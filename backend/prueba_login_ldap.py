#!/usr/bin/env python3

import getpass
import os
import re
import sys
from binascii import hexlify

from dotenv import load_dotenv
from ldap3 import ALL, SUBTREE, Connection, Server
from ldap3.utils.conv import escape_filter_chars as ldap_escape

# Cargar .env del directorio actual
load_dotenv()


def conectar_ldap(servidor, puerto, bind_dn, bind_password):
    server = Server(servidor, port=puerto, get_info=ALL, connect_timeout=5)
    conn = Connection(server, user=bind_dn, password=bind_password, auto_bind=True, raise_exceptions=True)
    return conn


def decodificar_logon_hours(data):
    if not data:
        return None

    raw = bytes(data)
    if len(raw) != 21:
        return f"(longitud inesperada: {len(raw)} bytes)"

    bits = []
    for byte in raw:
        for b in range(8):
            bits.append(bool(byte & (1 << b)))

    dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    resultado = {}
    for i, dia in enumerate(dias):
        horas = []
        for h in range(24):
            idx = i * 24 + h
            if idx < len(bits) and bits[idx]:
                horas.append(f"{h:02d}:00")
        resultado[dia] = horas

    return resultado


def mostrar_tabla_horaria(logon_hours):
    if not logon_hours or isinstance(logon_hours, str):
        print(f"  logonHours: {logon_hours}")
        return

    print("\n  logonHours (horas permitidas por día):")
    print("  " + "-" * 70)
    for dia, horas in logon_hours.items():
        if horas:
            bloques = []
            start = None
            prev = None
            for h in horas:
                h_num = int(h.split(":")[0])
                if start is None:
                    start = h_num
                    prev = h_num
                elif h_num == prev + 1:
                    prev = h_num
                else:
                    bloques.append(f"{start:02d}:00-{prev + 1:02d}:00" if start != prev else f"{start:02d}:00")
                    start = h_num
                    prev = h_num
            if start is not None:
                bloques.append(f"{start:02d}:00-{prev + 1:02d}:00" if start != prev else f"{start:02d}:00")
            print(f"  {dia:>10}: {', '.join(bloques)}")
        else:
            print(f"  {dia:>10}: (sin acceso)")


def main():
    print("=" * 60)
    print("  Prueba de autenticación LDAP contra Active Directory")
    print("=" * 60)

    # Leer configuración desde .env
    ad_server = os.environ.get("AD_SERVER", "127.0.0.1")
    ad_port = int(os.environ.get("AD_PORT", 389))
    base_dn = os.environ.get("AD_BASE_DN", "DC=IFTS,DC=LOCAL")
    admin_dn = os.environ.get("AD_ADMIN_DN", "")
    admin_password = os.environ.get("AD_ADMIN_PASSWORD", "")

    print(f"\n[CONFIGURACIÓN DESDE .env]")
    print(f"  Servidor: {ad_server}:{ad_port}")
    print(f"  Base DN:  {base_dn}")

    if not admin_dn or not admin_password:
        print("\n[ERROR] No se encontraron AD_ADMIN_DN y AD_ADMIN_PASSWORD en .env")
        sys.exit(1)

    # Solicitar credenciales del usuario a probar
    print()
    username = input("  Usuario a probar (sAMAccountName): ").strip()
    if not username:
        print("  Debes ingresar un nombre de usuario.")
        sys.exit(1)

    password = getpass.getpass("  Contraseña: ")

    # Limpiar prefijo dominio\usuario
    if "\\" in username:
        username = username.split("\\")[-1]

    print(f"\n[PASO 1] Conectando con cuenta administrativa...")
    try:
        admin_conn = conectar_ldap(ad_server, ad_port, admin_dn, admin_password)
        print(f"  ✅ Conexión establecida con {admin_dn}")
    except Exception as e:
        print(f"  ❌ Error de conexión: {e}")
        sys.exit(1)

    print(f"\n[PASO 2] Buscando usuario '{username}' en {base_dn}...")
    search_filter = f"(sAMAccountName={ldap_escape(username)})"

    try:
        admin_conn.search(
            search_base=base_dn,
            search_filter=search_filter,
            search_scope=SUBTREE,
            attributes=["*", "+"],
        )

        if not admin_conn.entries:
            print(f"  ❌ Usuario '{username}' no encontrado en AD.")
            admin_conn.unbind()
            sys.exit(1)

        entry = admin_conn.entries[0]
        user_dn = entry.distinguishedName.value
        print(f"  ✅ Usuario encontrado: {user_dn}")
    except Exception as e:
        print(f"  ❌ Error en la búsqueda: {e}")
        admin_conn.unbind()
        sys.exit(1)

    print(f"\n[PASO 3] Validando contraseña del usuario...")
    try:
        user_conn = conectar_ldap(ad_server, ad_port, user_dn, password)
        user_conn.unbind()
        print(f"  ✅ Contraseña correcta")
    except Exception as e:
        print(f"  ❌ Contraseña incorrecta: {e}")
        admin_conn.unbind()
        sys.exit(1)

    print(f"\n[ATRIBUTOS DEL USUARIO]")
    print("=" * 60)

    atributos_omitir = {"logonHours", "unicodePwd", "objectSid"}

    for attr in sorted(entry.entry_attributes):
        valor = entry[attr].value if attr in entry else None

        if attr in atributos_omitir:
            continue

        if valor is None:
            continue

        if isinstance(valor, bytes):
            print(f"  {attr}: (binario, {len(valor)} bytes)")
            continue

        if hasattr(valor, "isoformat"):
            print(f"  {attr}: {valor.isoformat()}")
            continue

        if isinstance(valor, (list, set)):
            print(f"  {attr}:")
            for v in valor:
                print(f"    - {v}")
            continue

        print(f"  {attr}: {valor}")

    # Mostrar logonHours con decodificación especial
    logon_hours_raw = entry.logonHours.value if "logonHours" in entry else None
    if logon_hours_raw:
        print(f"\n[LOGON HOURS]")
        print("  Raw (hex):", hexlify(bytes(logon_hours_raw)).decode())
        decodificado = decodificar_logon_hours(logon_hours_raw)
        mostrar_tabla_horaria(decodificado)
    else:
        print(f"\n  logonHours: (no disponible)")

    # Mostrar grupos
    print(f"\n[GRUPOS (memberOf)]")
    if "memberOf" in entry:
        grupos = []
        for g in entry.memberOf.values:
            match = re.search(r"CN=([^,]+)", g)
            if match:
                grupos.append(match.group(1))
        for g in grupos:
            print(f"  - {g}")
    else:
        print("  (ninguno)")

    admin_conn.unbind()
    print(f"\n{'=' * 60}")
    print(f"  Autenticación exitosa para: {username}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n  Cancelado por el usuario.")
        sys.exit(1)
