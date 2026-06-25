# Estado del Proyecto — Sistema de Gestión de Stock con Active Directory

> Fecha: Junio 2026
> Proyecto: TP Final — Práctica Profesionalizante III (IFTS 18)

---

## 1. Resumen

Aplicación web de gestión de stock con autenticación contra Active Directory vía LDAP.
Backend en Python Flask, frontend en React + Vite + shadcn/ui, persistencia en JSON.

---

## 2. Estructura del proyecto

```
tp-final/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # create_app(), CORS, error handlers
│   │   ├── config.py            # Variables de entorno y defaults
│   │   ├── routes/
│   │   │   ├── auth.py          # POST /api/auth/login, GET /me, POST /logout
│   │   │   ├── categorias.py    # GET /api/categorias
│   │   │   ├── dashboard.py     # GET summary, top-products, movements-weekly, category-distribution
│   │   │   ├── productos.py     # CRUD /api/productos
│   │   │   ├── movimientos.py   # GET+POST /api/movimientos
│   │   │   └── reportes.py      # GET /api/reportes/export?tipo=inventario|movimientos
│   │   ├── services/
│   │   │   ├── auth_service.py  # Creación y validación de tokens JWT
│   │   │   ├── ldap_service.py  # Autenticación contra AD + mapeo de roles + restricción horaria
│   │   │   └── storage.py       # Persistencia en data/database.json
│   │   └── utils/
│   │       ├── decorators.py    # @jwt_required, @require_role
│   │       └── helpers.py       # sanitizar_input(), validar_campo_numerico()
│   ├── data/
│   │   └── database.json        # Colecciones: categorias, productos, movimientos
│   ├── run.py                   # Punto de entrada
│   └── .env                     # Configuración (SECRET_KEY, AD, etc.)
│
├── frontend/
│   └── src/app/
│       ├── components/
│       │   ├── Login.tsx        # Formulario de login con sonner + loading
│       │   ├── Dashboard.tsx    # Stats cards + 3 charts (Recharts)
│       │   ├── Layout.tsx       # Sidebar + header reutilizable, navegación por rol
│       │   ├── Productos.tsx    # Tabla CRUD con modal y select de categorías
│       │   ├── Movimientos.tsx  # Tabla con filtros + modal de registro
│       │   ├── Reportes.tsx     # Botones de exportación CSV
│       │   ├── ProtectedRoute.tsx  # Redirección a / si no hay sesión
│       │   ├── RoleRoute.tsx    # Redirección a /unauthorized si el rol no corresponde
│       │   ├── Unauthorized.tsx # Página de acceso denegado
│       │   └── ui/ (shadcn)     # ~48 componentes UI (Card, Table, Dialog, Select, etc.)
│       ├── contexts/
│       │   └── AuthContext.tsx   # user, token, login(), logout()
│       ├── hooks/
│       │   ├── useDashboardData.ts  # Fetch de stats del dashboard
│       │   ├── useProductos.ts      # CRUD de productos con estado local
│       │   └── useMovimientos.ts    # Listar y registrar movimientos
│       ├── services/
│       │   └── api.ts           # Wrapper fetch con JWT + manejo de 401
│       ├── utils/
│       │   └── permissions.ts   # Funciones canCreate, canEdit, canDelete, etc.
│       └── routes.tsx           # React Router con layout anidado + RoleRoute
│
└── docs/
    ├── TODO_BACKEND.md
    ├── TODO_FRONTEND.md
    ├── ESTADO_FRONTEND.md
    ├── guia-preparacion-vm-ldap.md
    └── ESTADO_PROYECTO.md       # Este documento
```

---

## 3. Funcionalidades implementadas

### 3.1 Autenticación (POST /api/auth/login)

- Conexión LDAP contra Active Directory en `IFTS.LOCAL`
- Bind inicial con cuenta de servicio para buscar al usuario
- Segundo bind con credenciales del usuario para validar contraseña
- Extracción de grupos de seguridad desde `memberOf`
- Mapeo de grupos a roles: `GG_Gerencia` → Admin, `GG_Soporte` → Operador, `GG_RRHH` → Consulta
- Restricción horaria: solo 8:00 a 18:00 hs en días hábiles
- Emisión de token JWT con expiración configurable
- Logout: endpoint POST /api/auth/logout (llamado desde el frontend)

### 3.2 Dashboard (GET /api/dashboard/*)

Cuatro endpoints protegidos con JWT, accesibles por cualquier rol autenticado:

| Endpoint | Descripción |
|---|---|
| `/api/dashboard/summary` | Total productos, bajo stock, movimientos hoy, valor estimado |
| `/api/dashboard/top-products` | Top 5 productos más vendidos (por egresos) |
| `/api/dashboard/movements-weekly` | Entradas y salidas de los últimos 7 días |
| `/api/dashboard/category-distribution` | Distribución de stock por categoría |

### 3.3 Productos (CRUD /api/productos)

| Método | Endpoint | Rol requerido |
|---|---|---|
| GET | `/api/productos` | Cualquier autenticado |
| GET | `/api/productos/:id` | Cualquier autenticado |
| POST | `/api/productos` | Admin |
| PUT | `/api/productos/:id` | Admin |
| DELETE | `/api/productos/:id` | Admin |

Campos: nombre, categoria_id, stock_actual, stock_minimo, precio_unitario.
Incluye `categoria_nombre` en la respuesta.

### 3.4 Movimientos (GET+POST /api/movimientos)

| Método | Endpoint | Rol requerido |
|---|---|---|
| GET | `/api/movimientos` | Cualquier autenticado (con filtros: tipo, producto_id, desde, hasta) |
| POST | `/api/movimientos` | Admin, Operador |

Tipos: `ingreso` (incrementa stock), `egreso` (decrementa, valida stock suficiente), `ajuste` (setea stock al valor indicado).

### 3.5 Reportes (GET /api/reportes/export)

| Parámetro | Rol requerido | Archivo generado |
|---|---|---|
| `?tipo=inventario` | Admin | CSV con nombre, categoría, stock, precio, valor total |
| `?tipo=movimientos` | Admin | CSV con fecha, producto, tipo, cantidad, usuario, observación |

### 3.6 Frontend

| Pantalla | Ruta | Roles |
|---|---|---|
| Login | `/` | Público |
| Dashboard | `/dashboard` | Admin, Operador, Consulta |
| Productos | `/productos` | Admin, Operador |
| Movimientos | `/movimientos` | Admin, Operador |
| Reportes | `/reportes` | Admin |
| No autorizado | `/unauthorized` | Público (redirección por RoleRoute) |

---

## 4. Roles y permisos

| Acción | Admin | Operador | Consulta |
|---|---|---|---|
| Ver Dashboard | ✅ | ✅ | ✅ |
| Ver productos | ✅ | ✅ | ❌ (solo dashboard) |
| Crear/Editar/Eliminar productos | ✅ | ❌ | ❌ |
| Ver movimientos | ✅ | ✅ | ❌ (solo dashboard) |
| Registrar movimientos | ✅ | ✅ | ❌ |
| Exportar reportes CSV | ✅ | ❌ | ❌ |

---

## 5. Seguridad implementada

| Medida | Ubicación |
|---|---|
| Tokens JWT con expiración (8hs por defecto) | `auth_service.py` |
| Decorador @jwt_required en todos los endpoints protegidos | `decorators.py` |
| Decorador @require_role en endpoints de escritura | `decorators.py` |
| Sanitización de entradas de texto | `helpers.py` (sanitizar_input) |
| Validación de campos numéricos | `helpers.py` (validar_campo_numerico) |
| Escape de caracteres LDAP (anti-inyección) | `ldap_service.py` (ldap_escape + regex whitelist) |
| Validación de username contra caracteres permitidos | `ldap_service.py` (regex `a-zA-Z0-9._@-`) |
| Prevención de CSV injection | `reportes.py` (sanitizar_csv) |
| SECRET_KEY requerida en .env (sin fallback hardcodeado) | `config.py` |
| Servidor solo en localhost (127.0.0.1) | `run.py` |
| Manejo de errores HTTP (400/401/403/404/500) | `__init__.py` |
| Logging de eventos de autenticación | `ldap_service.py` |
| Protección de rutas en frontend (ProtectedRoute + RoleRoute) | `routes.tsx` |
| Auto-logout en frontend al recibir 401 | `api.ts` |
| Toast de error de conexión en llamadas API | `api.ts` |
| Manejo de localStorage corrupto | `AuthContext.tsx` |
| Protección contra fechas inválidas en UI | `Movimientos.tsx` |

---

## 6. Guía para la presentación / prueba en clase

### 6.1 Requisitos previos

1. VM con Windows Server + Active Directory encendida
   - Port forwarding: `127.0.0.1:3389` → VM:389
   - Grupos: `GG_Gerencia`, `GG_Soporte`, `GG_RRHH`
   - Usuarios dados de alta en los grupos correspondientes

2. Backend corriendo:
   ```bash
   cd backend
   .venv/bin/python run.py
   ```

3. Frontend corriendo:
   ```bash
   cd frontend
   npm run dev
   ```

4. Abrir `http://localhost:5173` en el navegador

### 6.2 Credenciales de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `juan.perez` | `IFTS.2026.GERENCIA` | Admin |
| (usuario en GG_Soporte) | (pass del grupo) | Operador |
| (usuario en GG_RRHH) | (pass del grupo) | Consulta |

### 6.3 Demostración del login fuera del horario permitido

Si la prueba se realiza fuera del horario de 8:00 a 18:00 hs o en fin de semana,
el login mostrará el error: *"Acceso rechazado: Inicio de sesión no permitido fuera del horario laboral"*.

**Método recomendado para deshabilitar la restricción:** (no requiere cambiar la hora del sistema ni la VM)

1. Abrir `backend/.env`
2. Agregar la siguiente línea:
   ```
   RESTRICCION_HORARIA_DESHABILITADA=True
   ```
3. Reiniciar el backend (Ctrl+C y volver a ejecutar `python run.py`)
4. El login permitirá el acceso sin importar el horario ni el día de la semana

**Cómo mostrar la funcionalidad de restricción horaria durante la presentación:**

1. Tener `RESTRICCION_HORARIA_DESHABILITADA=False` (o no tener la línea)
2. Intentar login → mostrar error de horario restringido
3. Explicar el código en `ldap_service.py:check_access_hours()`
4. Activar bypass y mostrar login exitoso

### 6.4 Flujo de demostración sugerido

1. **Login**: mostrar autenticación exitosa con juan.perez
2. **Dashboard**: mostrar stats cards y gráficos con datos reales
3. **Productos**: mostrar listado, crear un nuevo producto, editar, eliminar
4. **Movimientos**: mostrar listado con filtro por tipo, registrar un ingreso/egreso
5. **Roles**: mostrar que Operador solo puede registrar movimientos (no crear productos)
6. **Reportes**: exportar CSV de inventario y movimientos, abrir en Excel
7. **Restricción horaria**: mostrar error al intentar login fuera del horario

### 6.5 Datos de prueba incluidos

El archivo `backend/data/database.json` contiene:
- 4 categorías (Electrónica, Accesorios, Repuestos, Insumos)
- 11 productos con distintos niveles de stock
- 4 movimientos de ejemplo (ingreso, egreso, ajuste)

---

## 7. Configuración del entorno

### 7.1 Archivo .env (backend)

Variables requeridas:
```
SECRET_KEY=<clave-secreta-para-jwt>
```

Variables de conexión AD:
```
AD_SERVER=127.0.0.1
AD_PORT=3389
AD_USE_SSL=False
AD_BASE_DN=DC=IFTS,DC=LOCAL
AD_ADMIN_DN=CN=Administrator,CN=Users,DC=IFTS,DC=LOCAL
AD_ADMIN_PASSWORD=<password-del-admin>
```

Variables para pruebas:
```
RESTRICCION_HORARIA_DESHABILITADA=False
```

### 7.2 Proxy de Vite (frontend)

```ts
// vite.config.ts
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true,
    }
  }
}
```

---

## 8. Branches en Git

Todas las ramas fueron mergeadas a `main`:

| Rama | Descripción |
|---|---|
| `refactor/backend-scaffolding` | Esqueleto Flask |
| `config/backend-venv-dependencias` | Dependencias Python |
| `config/global-gitignore-readme` | .gitignore + README |
| `feat/backend-json-storage` | Persistencia JSON |
| `feat/backend-ldap-service` | Conexión LDAP + autenticación |
| `feat/backend-auth-routes` | JWT + login/me/logout |
| `feat/backend-dashboard-endpoints` | 4 endpoints de dashboard |
| `feat/backend-crud-productos` | CRUD de productos |
| `feat/backend-movimientos` | Registro y listado de movimientos |
| `feat/backend-reportes-csv` | Exportación CSV |
| `feat/backend-seguridad-logging` | Errores, logging, validación |
| `feat/frontend-conexion-backend` | API, AuthContext, ProtectedRoute |
| `feat/frontend-login-real` | Login contra backend real |
| `feat/frontend-dashboard-dinamico` | Dashboard con datos reales + shadcn refactor |
| `feat/frontend-control-roles` | Lógica de permisos centralizada |
| `feat/frontend-pantallas-crud` | Productos, Movimientos, Reportes |
| `feat/frontend-ux-pulido` | Skeletons, toasts, limpieza |
| `fix/frontend-error-handling` | localStorage, fechas, reportes, silent failures |
| `fix/frontend-layout-ui` | Flash horario, AD status |
| `fix/backend-ldap-security` | Escape LDAP + validación username |
| `fix/backend-logout` | Logout frontend → backend |
| `fix/backend-security` | JWT sin fallback, CSV injection, seguridad general |
