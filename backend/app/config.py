import os

from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY no está configurada. Definila en el archivo .env")
    PORT = int(os.environ.get("PORT", 5000))

    # Configuración de LDAP / Active Directory
    AD_SERVER = os.environ.get("AD_SERVER", "127.0.0.1")
    AD_PORT = int(os.environ.get("AD_PORT", 3389))
    AD_BASE_DN = os.environ.get("AD_BASE_DN", "DC=IFTS,DC=LOCAL")
    AD_ADMIN_DN = os.environ.get(
        "AD_ADMIN_DN", "CN=Administrator,CN=Users,DC=IFTS,DC=LOCAL"
    )
    AD_ADMIN_PASSWORD = os.environ.get("AD_ADMIN_PASSWORD", "")

    # Mapeo de grupos de seguridad a roles
    AD_MAP_ADMIN = os.environ.get("AD_MAP_ADMIN", "GG_Gerencia")
    AD_MAP_OPERADOR = os.environ.get("AD_MAP_OPERADOR", "GG_Soporte")
    AD_MAP_CONSULTA = os.environ.get("AD_MAP_CONSULTA", "GG_RRHH")

    # Bypass de restricción horaria (para pruebas y presentaciones)
    BYPASS_ACCESS_HOURS = os.environ.get("BYPASS_ACCESS_HOURS", "False").lower() in (
        "true",
        "1",
        "t",
    )

    # Configuración de JWT
    JWT_EXPIRATION_HOURS = int(os.environ.get("JWT_EXPIRATION_HOURS", 8))

    # RUta absoluta para el archivo JSON de base de datos local
    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    DB_PATH = os.path.join(BASE_DIR, "data", "database.json")
