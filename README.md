# Sistema de Gestión y Control de Stock — Integración con Active Directory

Trabajo Práctico Integrador y Final — **Práctica Profesionalizante III: Desarrollo e Implementación de Sistemas en la Nube** — Tecnicatura Superior en Desarrollo de Software, IFTS 18.

Aplicación web full-stack para gestión de inventario, con autenticación contra **Active Directory (LDAP)**, permisos por roles basados en grupos de seguridad, y restricción horaria de acceso mediante `logonHours`.

---

## Stack Tecnológico

| Capa | Tecnologías |
|---|---|
| **Backend** | Python 3.14, Flask 3.0, Flask-CORS, ldap3, PyJWT, Gunicorn, python-dotenv |
| **Frontend** | React 18, Vite 6, TypeScript, Tailwind CSS 4, Radix UI, Recharts, react-router v7, react-hook-form, sonner, shadcn/ui |
| **Autenticación** | Active Directory (LDAP v3), JWT (HS256) |
| **Persistencia** | Archivo JSON (`data/database.json`) — sin servidor de base de datos |
| **Infraestructura** | Windows Server VM (AD), Linux (desarrollo), Host-Only network |

---

## Estructura del Proyecto

```
tp-final/
├── backend/                    # API REST — Python + Flask
│   ├── app/
│   │   ├── __init__.py         # App factory (create_app)
│   │   ├── config.py           # Configuración desde .env
│   │   ├── routes/             # Blueprints
│   │   │   ├── auth.py         # POST /login, GET /me, POST /logout
│   │   │   ├── dashboard.py    # Estadísticas y charts
│   │   │   ├── productos.py    # CRUD de productos
│   │   │   ├── movimientos.py  # Registro de movimientos de stock
│   │   │   ├── categorias.py   # Listado de categorías
│   │   │   └── reportes.py     # Exportación CSV
│   │   ├── services/
│   │   │   ├── storage.py      # Persistencia JSON
│   │   │   ├── auth_service.py # JWT create/decode
│   │   │   └── ldap_service.py # Autenticación LDAP + logonHours
│   │   └── utils/
│   │       ├── decorators.py   # @jwt_required, @require_role
│   │       └── helpers.py      # Sanitización, validación
│   ├── .env.example
│   ├── requirements.txt
│   ├── run.py                  # Punto de entrada
│   ├── seed.py                 # Poblado de datos de ejemplo
│   ├── test_ldap.py            # Script diagnóstico LDAP
│   └── prueba_login_ldap.py   # Probador LDAP interactivo
├── frontend/                   # SPA — React + Vite + Tailwind
│   ├── src/
│   │   ├── main.tsx
│   │   ├── app/
│   │   │   ├── App.tsx         # Provider + Router + Toaster
│   │   │   ├── routes.tsx      # Definición de rutas protegidas
│   │   │   ├── contexts/AuthContext.tsx
│   │   │   ├── services/api.ts # Cliente HTTP con JWT
│   │   │   ├── hooks/          # useDashboardData, useProductos, useMovimientos
│   │   │   └── components/
│   │   │       ├── Login.tsx / Layout.tsx / Dashboard.tsx
│   │   │       ├── Productos.tsx / Movimientos.tsx / Reportes.tsx
│   │   │       ├── ProtectedRoute.tsx / RoleRoute.tsx / Unauthorized.tsx
│   │   │       └── ui/         # Componentes shadcn/ui
│   │   └── styles/             # Tailwind, tema claro/oscuro
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts          # Proxy /api → localhost:5000
└── docs/
    └── DOCUMENTACION_PROYECTO.md   # Documentación técnica completa (~725 líneas)
```

---

## Requisitos Previos

- **Python** 3.10+
- **Node.js** 18+ y npm
- **Máquina virtual** con Windows Server y Active Directory Domain Services, en red Host-Only (IP `192.168.56.10`)
- Grupos de seguridad AD creados: `GG_Gerencia`, `GG_Soporte`, `GG_RRHH`

---

## Puesta en Marcha

### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Editar .env con credenciales y configuración AD
python run.py
```

El servidor inicia en `http://127.0.0.1:5000` (solo loopback).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Servidor de desarrollo en `http://localhost:5173`. El proxy de Vite redirige `/api/*` al backend.

### 3. Poblar datos de ejemplo

```bash
cd backend
source .venv/bin/activate
python seed.py
```

Crea 4 categorías, 10 productos y 3 movimientos en `data/database.json`.

### 4. Probar conectividad LDAP

```bash
python test_ldap.py <usuario> <contraseña>   # Test rápido
python prueba_login_ldap.py                   # Visor interactivo completo
```

---

## API Endpoints

### Autenticación
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Público | `{username, password}` → `{token, user}` |
| GET | `/api/auth/me` | JWT | Datos del usuario autenticado |
| POST | `/api/auth/logout` | JWT | Confirmación de cierre de sesión |
| GET | `/api/health` | Público | Health check |

### Dashboard
| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/dashboard/summary` | JWT | Total productos, stock bajo, movs. hoy, valor estimado |
| GET | `/api/dashboard/top-products` | JWT | Top 5 productos más movidos |
| GET | `/api/dashboard/movements-weekly` | JWT | Movimientos semanales por día |
| GET | `/api/dashboard/category-distribution` | JWT | Stock por categoría |

### Productos
| Método | Endpoint | Rol | Descripción |
|---|---|---|---|
| GET | `/api/productos` | Cualquiera | Listar (`?q=` para búsqueda) |
| GET | `/api/productos/<id>` | Cualquiera | Obtener por ID |
| POST | `/api/productos` | Admin | Crear |
| PUT | `/api/productos/<id>` | Admin | Actualizar |
| DELETE | `/api/productos/<id>` | Admin | Eliminar |

### Movimientos
| Método | Endpoint | Rol | Descripción |
|---|---|---|---|
| GET | `/api/movimientos` | Cualquiera | Listar (filtros: `tipo`, `producto_id`, `desde`, `hasta`) |
| POST | `/api/movimientos` | Admin/Operador | Registrar (ingreso/egreso/ajuste) |

### Categorías y Reportes
| Método | Endpoint | Auth/Rol | Descripción |
|---|---|---|---|
| GET | `/api/categorias` | JWT | Listar categorías |
| GET | `/api/reportes/export?tipo=inventario` | Admin | CSV de inventario |
| GET | `/api/reportes/export?tipo=movimientos` | Admin | CSV de movimientos |

---

## Matriz de Roles y Permisos

| Funcionalidad | Admin (GG_Gerencia) | Operador (GG_Soporte) | Consulta (GG_RRHH) |
|---|---|---|---|
| Dashboard | ✓ | ✓ | ✓ |
| Ver productos | ✓ | ✓ | ✗ |
| Crear/Editar/Eliminar productos | ✓ | ✗ | ✗ |
| Ver movimientos | ✓ | ✓ | ✗ |
| Registrar movimientos | ✓ | ✓ | ✗ |
| Exportar CSV | ✓ | ✗ | ✗ |

---

## Flujo de Autenticación

1. El usuario ingresa usuario/contraseña en el formulario de Login.
2. El backend se conecta a AD con credenciales de administrador y busca al usuario por `sAMAccountName`.
3. Realiza un segundo bind LDAP con las credenciales del usuario para validar la contraseña.
4. Si AD responde con `data 530`, el acceso es denegado por restricción horaria (`logonHours`).
5. Se decodifica el bitmap `logonHours` (168 bits) como validación adicional.
6. Se mapea el grupo AD al rol (prioridad: Admin > Operador > Consulta).
7. Se genera un JWT con `{sub, role, name}`, válido por 8 horas.
8. El frontend almacena el token en `localStorage` y lo envía en cada request vía `Authorization: Bearer`.

---

## Arquitectura

```
┌──────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────┐
│  Frontend (React)    │      │  Backend (Flask)        │      │  Active Directory   │
│  localhost:5173      │─────▶│  localhost:5000         │─────▶│  192.168.56.10:389  │
│                      │ API  │                         │ LDAP │                     │
│  AuthContext          │      │  routes/                │      │  Grupos:            │
│  api.ts (fetch+JWT)  │      │  services/              │      │  GG_Gerencia        │
│  react-router v7     │      │  utils/                 │      │  GG_Soporte         │
│  shadcn/ui + Radix   │      │                         │      │  GG_RRHH            │
└──────────────────────┘      └──────────┬──────────────┘      └─────────────────────┘
                                         │
                                    data/database.json
                                  (persistencia en JSON)
```

---

## Seguridad

- JWT firmado con HS256
- Input sanitized (se eliminan `< > " ' ;`)
- Protección contra inyección LDAP (regex whitelist + escape ldap3)
- CSV injection prevention (prefijo `'` en fórmulas)
- CORS restringido a `localhost:5173`
- Servidor vinculado solo a `127.0.0.1`
- Respuestas de error en JSON (sin stack traces)
- Log de auditoría en `app.log`
- Roles validados en backend y frontend

---

## Diagnóstico

```bash
# Ver logs del backend
tail -f backend/app.log

# Probar conexión LDAP manualmente
python backend/test_ldap.py <usuario> <contraseña>
```

---

## Documentación Adicional

- **Documentación técnica completa**: [`docs/DOCUMENTACION_PROYECTO.md`](docs/DOCUMENTACION_PROYECTO.md) (~725 líneas) — cubre arquitectura, módulos, flujo de autenticación, modelo de datos, seguridad y guía de prueba en clase.

---

## Convención de Nombres para Ramas de Git

Formato: `<tipo>/<alcance>-<descripción-corta>`

### Tipos
| Tipo | Uso |
|---|---|
| `feat/` | Nuevas funcionalidades |
| `fix/` | Corrección de errores |
| `config/` | Configuración de entorno y herramientas |
| `refactor/` | Refactorización sin cambio de comportamiento |
| `docs/` | Documentación |

### Alcances
| Alcance | Ámbito |
|---|---|
| `backend` | Servidor Flask, servicios, LDAP |
| `frontend` | React, Vite, componentes, estilos |
| `global` | Archivos raíz, `.gitignore`, config global |
| `docs` | Documentación en `docs/` |

### Ejemplos

```
config/global-gitignore-readme
feat/backend-ldap-auth
feat/frontend-login-page
fix/frontend-sidebar-responsive
docs/vm-setup-guide
```
