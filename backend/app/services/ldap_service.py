import re
from datetime import datetime

from ldap3.utils.conv import escape_filter_chars as ldap_escape

from flask import current_app
from ldap3 import ALL, SUBTREE, Connection, Server


def check_access_hours():
    """
    Verifica si la hora actual está dentro del rango permitido (08:00 a 18:00 hs)
    y en días hábiles (lunes a viernes).
    Lanza un PermissionError si está fuera del rango.

    Para pruebas o presentaciones, se puede deshabilitar la restricción horaria
    configurando BYPASS_ACCESS_HOURS=True en el archivo .env
    """
    if current_app.config.get("BYPASS_ACCESS_HOURS", False):
        return

    now = datetime.now()
    weekday = now.weekday()  # 0 = Lunes, 6 = Domingo
    hour = now.hour

    # Validar día hábil (Lunes a Viernes)
    if weekday > 4:
        raise PermissionError(
            "Acceso rechazado: El sistema solo permite el acceso en días hábiles."
        )

    # Validar rango horario (08:00 a 18:00 hs)
    if not (8 <= hour < 18):
        raise PermissionError(
            "Acceso rechazado: Inicio de sesión no permitido fuera del horario laboral (08:00 a 18:00 hs)."
        )


def get_ldap_connection(bind_dn=None, bind_password=None):
    """
    Establece una conexión activa con el servidor Active Directory.
    Si no se proveen credenciales, realiza el bind inicial con la cuenta de administrador.
    """

    server_ip = current_app.config["AD_SERVER"]
    port = current_app.config["AD_PORT"]
    use_ssl = current_app.config["AD_USE_SSL"]
    # Si no se pasan credenciales específicas, usar la cuenta de servicio/admin
    if bind_dn is None:
        bind_dn = current_app.config["AD_ADMIN_DN"]
        bind_password = current_app.config["AD_ADMIN_PASSWORD"]

    server = Server(
        server_ip, port=port, use_ssl=use_ssl, get_info=ALL, connect_timeout=5
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
    """
    Autentica a un usuario contra el Active Directory.
    1. Conecta con la cuenta admin para buscar el DN del usuario y leer sus atributos.
    2. Realiza un segundo bind con el DN del usuario y su contraseña para validar credenciales.
    3. Retorna la información del usuairo autenticado y sus grupos.
    """

    # Limpiar prefijo de dominio si el usuario ingresó "dominio\usuario" 
    if '\\' in username:
        username = username.split('\\')[-1]

    # Validar que el username solo contenga caracteres permitidos en AD
    if not re.match(r'^[a-zA-Z0-9._@-]+$', username):
        current_app.logger.warning(f"Intento de login con username inválido: '{username}'")
        return None

    # 1. Conexión de búsqueda con cuenta adminsitrativa
    try:
        admin_conn = get_ldap_connection()
    except Exception as e:
        current_app.logger.error(f'Error de conexión LDAP inicial: {e}')
        raise RuntimeError("No se pudo establecer conexión con el servidor de autenticación.")

    base_dn = current_app.config['AD_BASE_DN']
    search_filter = f'(sAMAccountName={ldap_escape(username)})'

    try:
        # Buscar usuario en todo el árbol bajo el Base DN
        admin_conn.search(
            search_base=base_dn,
            search_filter=search_filter,
            search_scope=SUBTREE,
            attributes=['distinguishedName', 'displayName', 'mail', 'memberOf']
        )

        if not admin_conn.entries:
            current_app.logger.info(f"Intento de login fallido: Usuario '{username}' no encontrado en AD.")
            return None

        user_entry = admin_conn.entries[0]
        user_dn = user_entry.distinguishedName.value
        display_name = user_entry.displayName.value if 'displayName' in user_entry else username
        email = user_entry.mail.value if 'mail' in user_entry else None

        # Obtener y parsear los CN de los grupos de seguridad a los que pertenece
        groups = []
        if 'memberOf' in user_entry:
            # El atributo memberOf puede ser un valor único o una lista
            raw_groups = user_entry.memberOf.values
            for group_dn in raw_groups:
                # Expresión regular para extraer el valor del Common Name (CN)
                match = re.search(r'CN=([^,]+)', group_dn)
                if match:
                    groups.append(match.group(1))

    except Exception as e:
        current_app.logger.error(f"Error durante la búsqueda de usuario en LDAP: {e}")
        return None
    finally:
        admin_conn.unbind()

    # 2. Bind de validación de contraseña con las credenciales del propio usuario
    try:
        user_conn = get_ldap_connection(bind_dn=user_dn, bind_password=password)
        user_conn.unbind() # Si el bind fue exitoso, la contraseña es correcta
    except Exception as e:
        current_app.logger.info(f"Intento de login fallido para '{username}': Contraseña incorrecta.")
        return None

    return {
        "dn": user_dn,
        "username": username,
        "name": display_name,
        "email": email,
        "groups": groups
    }

def map_role(groups):
    """
    Mapea los grupos del Active Directory del usuario a un rol interno del sistema
    de acuerdo a las prioridades (Admin > Operador > Consulta). 
    """
    admin_group = current_app.config['AD_MAP_ADMIN']
    operador_group = current_app.config['AD_MAP_OPERADOR']
    consulta_group = current_app.config['AD_MAP_CONSULTA']

    if admin_group in groups:
        return 'Admin'
    elif operador_group in groups:
        return 'Operador'
    elif consulta_group in groups:
        return 'Consulta'

    return None  # Sin rol autorizado
