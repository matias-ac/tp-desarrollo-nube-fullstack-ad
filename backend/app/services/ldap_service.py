import re
from datetime import datetime

from flask import current_app
from ldap3 import ALL, SUBTREE, Connection, Server
from ldap3.utils.conv import escape_filter_chars as ldap_escape

# Orden de los días en el bitmap de logonHours de AD (0=Sunday, 6=Saturday)
# Mapeo a Python weekday (0=Monday, 6=Sunday)
_AD_DAY_TO_PYTHON = {0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5}


def decodificar_logon_hours(data):
    if not data:
        return None

    raw = bytes(data)
    if len(raw) != 21:
        return None

    # Extraer los 168 bits (LSB first)
    bits = []
    for byte in raw:
        for b in range(8):
            bits.append(bool(byte & (1 << b)))

    # Agrupar por día (24 horas cada uno) y mapear a Python weekday
    resultado = {}
    for ad_day in range(7):
        inicio = ad_day * 24
        horas = [h for h in range(24) if bits[inicio + h]]
        py_day = _AD_DAY_TO_PYTHON[ad_day]
        resultado[py_day] = horas

    return resultado


def check_access_hours(logon_hours=None):
    if current_app.config.get("RESTRICCION_HORARIA_DESHABILITADA", False):
        return

    now = datetime.now()
    weekday = now.weekday()  # 0 = Lunes, 6 = Domingo
    hour = now.hour

    if logon_hours is not None:
        horas_permitidas = logon_hours.get(weekday, [])
        if hour not in horas_permitidas:
            raise PermissionError(
                "Acceso rechazado: La hora actual no está dentro del horario permitido "
                "para este usuario según la configuración de Active Directory."
            )
        return

    # Fallback hardcodeado si el usuario no tiene logonHours configurado
    if weekday > 4:
        raise PermissionError(
            "Acceso rechazado: El sistema solo permite el acceso en días hábiles."
        )
    if not (8 <= hour < 18):
        raise PermissionError(
            "Acceso rechazado: Inicio de sesión no permitido fuera del horario laboral (08:00 a 18:00 hs)."
        )


def get_ldap_connection(bind_dn=None, bind_password=None):

    server_ip = current_app.config["AD_SERVER"]
    port = current_app.config["AD_PORT"]
    # Si no se pasan credenciales específicas, usar la cuenta de servicio/admin
    if bind_dn is None:
        bind_dn = current_app.config["AD_ADMIN_DN"]
        bind_password = current_app.config["AD_ADMIN_PASSWORD"]

    server = Server(
        server_ip, port=port, get_info=ALL, connect_timeout=5
    )

    # Crear y retornar conexión con auto_bind activado
    conn = Connection(
        server,
        user=bind_dn,
        password=bind_password,
        auto_bind=True,
        raise_exceptions=True,
    )
    return conn


def authenticate_user(username, password):

    # Limpiar prefijo de dominio si el usuario ingresó "dominio\usuario"
    if "\\" in username:
        username = username.split("\\")[-1]

    # Validar que el username solo contenga caracteres permitidos en AD
    if not re.match(r"^[a-zA-Z0-9._@-]+$", username):
        current_app.logger.warning(
            f"Intento de login con username inválido: '{username}'"
        )
        return None

    # 1. Conexión de búsqueda con cuenta adminsitrativa
    try:
        admin_conn = get_ldap_connection()
    except Exception as e:
        current_app.logger.error(f"Error de conexión LDAP inicial: {e}")
        raise RuntimeError(
            "No se pudo establecer conexión con el servidor de autenticación."
        )

    base_dn = current_app.config["AD_BASE_DN"]
    search_filter = f"(sAMAccountName={ldap_escape(username)})"

    try:
        # Buscar usuario en todo el árbol bajo el Base DN
        admin_conn.search(
            search_base=base_dn,
            search_filter=search_filter,
            search_scope=SUBTREE,
            attributes=[
                "distinguishedName",
                "displayName",
                "mail",
                "memberOf",
                "logonHours",
            ],
        )

        if not admin_conn.entries:
            current_app.logger.info(
                f"Intento de login fallido: Usuario '{username}' no encontrado en AD."
            )
            return None

        user_entry = admin_conn.entries[0]
        user_dn = user_entry.distinguishedName.value
        display_name = (
            user_entry.displayName.value if "displayName" in user_entry else username
        )
        email = user_entry.mail.value if "mail" in user_entry else None

        # Obtener y parsear los CN de los grupos de seguridad a los que pertenece
        groups = []
        if "memberOf" in user_entry:
            # El atributo memberOf puede ser un valor único o una lista
            raw_groups = user_entry.memberOf.values
            for group_dn in raw_groups:
                # Expresión regular para extraer el valor del Common Name (CN)
                match = re.search(r"CN=([^,]+)", group_dn)
                if match:
                    groups.append(match.group(1))

        # Obtener y decodificar logonHours (restricción horaria del AD)
        logon_hours = None
        if "logonHours" in user_entry:
            logon_hours = decodificar_logon_hours(user_entry.logonHours.value)

    except Exception as e:
        current_app.logger.error(f"Error durante la búsqueda de usuario en LDAP: {e}")
        return None
    finally:
        admin_conn.unbind()

    # 2. Bind de validación de contraseña con las credenciales del propio usuario
    try:
        user_conn = get_ldap_connection(bind_dn=user_dn, bind_password=password)
        user_conn.unbind()  # Si el bind fue exitoso, la contraseña es correcta
    except Exception as e:
        error_str = str(e)
        # data 530 = AD rechaza el login por restricción horaria (logonHours)
        if "data 530" in error_str:
            current_app.logger.info(
                f"Intento de login para '{username}': Rechazado por restricción horaria (data 530)."
            )
            raise PermissionError(
                "Acceso rechazado: La hora actual no está dentro del horario permitido "
                "para este usuario según la configuración de Active Directory."
            )
        current_app.logger.info(
            f"Intento de login fallido para '{username}': Contraseña incorrecta."
        )
        return None

    return {
        "dn": user_dn,
        "username": username,
        "name": display_name,
        "email": email,
        "groups": groups,
        "logon_hours": logon_hours,
    }


def map_role(groups):
    admin_group = current_app.config["AD_MAP_ADMIN"]
    operador_group = current_app.config["AD_MAP_OPERADOR"]
    consulta_group = current_app.config["AD_MAP_CONSULTA"]

    if admin_group in groups:
        return "Admin"
    elif operador_group in groups:
        return "Operador"
    elif consulta_group in groups:
        return "Consulta"

    return None  # Sin rol autorizado
