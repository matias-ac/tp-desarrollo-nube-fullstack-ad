import os
import sys

# Agregar la carpeta del backend al path del sistema
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from app.services.ldap_service import authenticate_user, get_ldap_connection, map_role


def run_test():
    app = create_app()

    with app.app_context():
        print("=== Diagnóstico de Conexión Active Directory (LDAP) ===")
        print(f"Servidor: {app.config['AD_SERVER']}:{app.config['AD_PORT']}")
        print(f"Base DN:  {app.config['AD_BASE_DN']}")
        print(f"Admin DN: {app.config['AD_ADMIN_DN']}")

        # 1. Probar la conexión administrativa básica
        print("\n1. Probando conexión administrativa básica...")
        try:
            conn = get_ldap_connection()
            print("✔ Conexión y Bind administrativo exitoso.")
            conn.unbind()
        except Exception as e:
            print(f"❌ Error de conexión/bind administrativo: {e}")
            print(
                "\nConsejo: Verificá que la VM de Windows Server esté corriendo y que la regla"
            )
            print(
                "de Port Forwarding de VirtualBox redirija el puerto 3389 del host al 389 de la VM."
            )
            return

        # 2. Probar autenticación de usuario
        if len(sys.argv) > 2:
            username = sys.argv[1]
            password = sys.argv[2]
            print(f"\n2. Probando autenticación del usuario '{username}'...")

            try:
                user_data = authenticate_user(username, password)
                if user_data:
                    print("✔ Autenticación exitosa.")
                    print(f"   Nombre completo: {user_data['name']}")
                    print(f"   Email:           {user_data['email']}")
                    print(f"   DN del Usuario   {user_data['dn']}")
                    print(f"   Grupos en AD:    {user_data['groups']}")

                    # Mapear rol
                    rol = map_role(user_data["groups"])
                    print(
                        f"   Rol del Sistema: {rol if rol else 'NINGUNO (Acceso Denegado)'}"
                    )
                else:
                    print("❌ Credenciales incorrectas o usuario no encontrado en AD.")
            except Exception as e:
                print(f"❌ Error durante la autenticación: {e}")
        else:
            print("\n2. Para probar la autenticación de un usuario real, ejecuta:")
            print("   python test_ldap.py <nombre_usuario> <contraseña>")
            print("   Ejemplo: python test_ldap.py Diego.Castro password123")


if __name__ == "__main__":
    run_test()
