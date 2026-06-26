# Backend — API de Gestión de Stock

API REST construida con **Python + Flask** que expone endpoints para la gestión de inventario, autenticando contra **Active Directory (LDAP)** y persistiendo datos en **JSON**.

## Stack

- Python 3.14, Flask 3.0, Flask-CORS, ldap3, PyJWT, Gunicorn, python-dotenv

## Requisitos

- Python 3.10+
- Windows Server VM con Active Directory (Host-Only, `192.168.56.10`)
- Grupos AD: `GG_Gerencia`, `GG_Soporte`, `GG_RRHH`

## Instalación y Ejecución

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Editar .env con credenciales AD
python run.py
```

El servidor inicia en `http://127.0.0.1:5000`.

## Scripts auxiliares

| Script | Descripción |
|---|---|
| `seed.py` | Puebla `data/database.json` con datos de ejemplo |
| `test_ldap.py <user> <pass>` | Prueba rápida de conexión y autenticación LDAP |
| `prueba_login_ldap.py` | Probador LDAP interactivo con atributos completos |

## Estructura

```
backend/
├── app/
│   ├── __init__.py           # App factory
│   ├── config.py             # Config desde variables de entorno
│   ├── routes/               # Blueprints: auth, dashboard, productos, movimientos, categorias, reportes
│   ├── services/             # storage.py, auth_service.py, ldap_service.py
│   └── utils/                # decorators.py, helpers.py
├── data/
│   └── database.json         # Persistencia (creado al seedear)
├── .env.example
├── requirements.txt
├── run.py                    # Punto de entrada
├── seed.py
├── test_ldap.py
└── prueba_login_ldap.py
```

## Variables de Entorno (`.env`)

| Variable | Descripción |
|---|---|
| `SECRET_KEY` | Clave para firmar JWT |
| `AD_SERVER` | IP del servidor AD |
| `AD_PORT` | Puerto LDAP (389) |
| `AD_BASE_DN` | Base DN del dominio |
| `AD_ADMIN_DN` | DN del admin AD |
| `AD_ADMIN_PASSWORD` | Password del admin AD |
| `AD_MAP_ADMIN` | Grupo AD para rol Admin |
| `AD_MAP_OPERADOR` | Grupo AD para rol Operador |
| `AD_MAP_CONSULTA` | Grupo AD para rol Consulta |
| `JWT_EXPIRATION_HOURS` | Horas de validez del token |
| `RESTRICCION_HORARIA_DESHABILITADA` | Deshabilita validación `logonHours` |

## Endpoints

Ver `README.md` raíz → sección API, o `docs/DOCUMENTACION_PROYECTO.md` para detalle completo.
