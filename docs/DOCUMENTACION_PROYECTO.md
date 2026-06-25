# Documentación del Proyecto — Sistema de Gestión de Stock con Active Directory

> **Materia:** Práctica Profesionalizante III — IFTS 18
> **Tecnologías:** Python Flask, React + Vite, Active Directory (LDAP), JWT, JSON

---

## Índice

1. [Arquitectura general](#1-arquitectura-general)
2. [Backend — Estructura y módulos](#2-backend--estructura-y-módulos)
   - [2.1 App factory (`__init__.py`)](#21-app-factory)
   - [2.2 Configuración (`config.py`)](#22-configuración)
   - [2.3 Servicios](#23-servicios)
   - [2.4 Rutas (endpoints)](#24-rutas)
   - [2.5 Utilidades](#25-utilidades)
3. [Frontend — Estructura y componentes](#3-frontend--estructura-y-componentes)
   - [3.1 Routing y protecciones](#31-routing-y-protecciones)
   - [3.2 Estado de autenticación](#32-estado-de-autenticación)
   - [3.3 Cliente API](#33-cliente-api)
   - [3.4 Permisos por rol](#34-permisos-por-rol)
   - [3.5 Componentes principales](#35-componentes-principales)
4. [Flujo de autenticación](#4-flujo-de-autenticación)
5. [Sistema de roles](#5-sistema-de-roles)
6. [Restricción horaria (logonHours)](#6-restricción-horaria)
7. [Persistencia de datos](#7-persistencia-de-datos)
8. [Modelo de datos](#8-modelo-de-datos)
9. [Seguridad implementada](#9-seguridad-implementada)
10. [Ejecución del proyecto](#10-ejecución-del-proyecto)
11. [Guía de prueba en clase](#11-guía-de-prueba-en-clase)

---

## 1. Arquitectura general

```
┌─────────────────────────┐       ┌─────────────────────────────┐       ┌──────────────────────┐
│    Frontend (React)     │       │    Backend (Flask)           │       │  Active Directory    │
│    localhost:5173       │──────▶│    localhost:5000            │──────▶│  192.168.56.10:389   │
│                         │  API  │                              │ LDAP  │                      │
│  ┌───────────────────┐  │       │  ┌────────────────────────┐  │       │  ┌────────────────┐  │
│  │  Productos.tsx     │  │       │  │  routes/               │  │       │  │  Usuarios AD   │  │
│  │  Movimientos.tsx   │──┼───────┼─▶│  ├─ auth.py            │──┼───────┼─▶│  │  Grupos:       │  │
│  │  Dashboard.tsx     │  │       │  │  ├─ productos.py       │  │       │  │  │· GG_Gerencia  │  │
│  │  Reportes.tsx      │  │       │  │  ├─ movimientos.py     │  │       │  │  │· GG_Soporte   │  │
│  │  Login.tsx         │  │       │  │  ├─ dashboard.py       │  │       │  │  │· GG_RRHH      │  │
│  └───────────────────┘  │       │  │  ├─ reportes.py         │  │       │  │  └────────────────┘  │
│                         │       │  │  └─ categorias.py       │  │       │                      │
│  ┌───────────────────┐  │       │  └────────────────────────┘  │       └──────────────────────┘
│  │  AuthContext.tsx   │  │       │                              │
│  │  api.ts            │──┼───────┼─▶ JWT + JSON                │
│  │  permissions.ts    │  │       │                              │
│  └───────────────────┘  │       │  ┌────────────────────────┐  │
│                         │       │  │  services/             │  │
│  ┌───────────────────┐  │       │  │  ├─ ldap_service.py    │  │
│  │  ui/ (shadcn)     │  │       │  │  ├─ auth_service.py   │──┼───────▶ JWT
│  │  (9 componentes)  │  │       │  │  └─ storage.py         │  │       │
│  └───────────────────┘  │       │  └────────────────────────┘  │       │
│                         │       │                              │       │
│  ┌───────────────────┐  │       │  ┌────────────────────────┐  │       │
│  │  hooks/            │  │       │  │  data/                 │  │       │
│  │  · useDashboardData│  │       │  │  └─ database.json      │◀─┼───────┘
│  │  · useProductos    │  │       │  └────────────────────────┘  │
│  │  · useMovimientos  │  │       │                              │
│  └───────────────────┘  │       └─────────────────────────────┘
└─────────────────────────┘
```

### Flujo de comunicación

```
Frontend ──(HTTP JSON)──▶ Backend ──(LDAP)──▶ Active Directory
                                       │
                                       └──(lectura/escritura)──▶ data/database.json
```

- Frontend se comunica con backend vía HTTP/JSON (fetch)
- Backend se comunica con AD vía LDAP (ldap3)
- Backend lee/escribe datos en `data/database.json`
- Autenticación: JWT stateless (sin sesión en servidor)

---

## 2. Backend — Estructura y módulos

### 2.1 App factory

**Archivo:** `backend/app/__init__.py`

```python
def create_app(config_class=Config):
```

Crea y configura la aplicación Flask:

| Componente | Detalle |
|---|---|
| **Config** | Carga desde `Config` class (lee variables de `.env`) |
| **Logging** | Archivo `app.log` con timestamp, nivel INFO |
| **CORS** | Solo permite `http://localhost:5173` (Vite dev server) |
| **Blueprints** | Registra 6 módulos de rutas: `auth`, `categorias`, `dashboard`, `productos`, `movimientos`, `reportes` |
| **Error handlers** | 400, 401, 403, 404, 500 → todos responden con JSON `{error, code}` |

### 2.2 Configuración

**Archivo:** `backend/app/config.py`

Variables que se cargan desde `.env`:

| Variable | Default | Descripción |
|---|---|---|
| `SECRET_KEY` | *(requerido)* | Clave para firmar JWT |
| `PORT` | 5000 | Puerto del servidor |
| `AD_SERVER` | 127.0.0.1 | IP del servidor AD |
| `AD_PORT` | 389 | Puerto LDAP |
| `AD_USE_SSL` | False | Usar LDAPS |
| `AD_BASE_DN` | DC=IFTS,DC=LOCAL | Base del directorio AD |
| `AD_ADMIN_DN` | CN=Administrator,... | Cuenta admin para búsquedas LDAP |
| `AD_ADMIN_PASSWORD` | — | Contraseña del admin AD |
| `AD_MAP_ADMIN` | GG_Gerencia | Grupo AD → rol Admin |
| `AD_MAP_OPERADOR` | GG_Soporte | Grupo AD → rol Operador |
| `AD_MAP_CONSULTA` | GG_RRHH | Grupo AD → rol Consulta |
| `RESTRICCION_HORARIA_DESHABILITADA` | False | Deshabilita restricción horaria |
| `JWT_EXPIRATION_HOURS` | 8 | Horas de validez del token |

### 2.3 Servicios

#### `services/storage.py` — Persistencia en JSON

Maneja la lectura/escritura del archivo `data/database.json`.

| Función | Docstring |
|---|---|
| `get_db_path()` | `Obtiene la ruta del archivo JSON desde la configuración de Flask.` |
| `get_db()` | `Lee y devuelve el diccionario completo de la base de datos.` Si el archivo no existe o está corrupto, crea/retorna estructura vacía `{categorias:[], productos:[], movimientos:[]}` |
| `save_db(data)` | `Escribe el diccionario completo en el archivo JSON (sobreescritura total).` Crea el directorio `data/` si no existe |
| `get_next_id(coleccion)` | `Calcula el siguiente ID autoincremental (último ID + 1 para una colección).` |

#### `services/ldap_service.py` — Integración con Active Directory

Toda la lógica de conexión y autenticación contra AD.

| Función | Línea | Docstring |
|---|---|---|
| `decodificar_logon_hours(data)` | 13 | `Decodifica el atributo logonHours de AD (21 bytes, 168 bits). Cada bit representa una hora de la semana: bit 0 = Domingo 00:00-01:00, bit 23 = Domingo 23:00-24:00, bit 24 = Lunes 00:00-01:00, ..., bit 167 = Sábado 23:00-24:00. Retorna un dict {python_weekday: [horas_permitidas]} o None si no hay datos.` |
| `check_access_hours(logon_hours=None)` | 50 | `Verifica si la hora actual está dentro del horario permitido para el usuario. Si se proporcionan logon_hours desde AD, valida contra esos datos. Si no (usuario sin restricción configurada), usa el fallback hardcodeado de días hábiles 08:00 a 18:00 hs. Lanza un PermissionError si está fuera del rango.` |
| `get_ldap_connection(bind_dn, bind_password)` | 87 | `Establece una conexión activa con el servidor Active Directory. Si no se proveen credenciales, realiza el bind inicial con la cuenta de administrador.` |
| `authenticate_user(username, password)` | 115 | `Autentica a un usuario contra el Active Directory. 1. Conecta con la cuenta admin para buscar el DN del usuario y leer sus atributos. 2. Realiza un segundo bind con el DN del usuario y su contraseña para validar credenciales. 3. Retorna la información del usuario autenticado y sus grupos.` |
| `map_role(groups)` | 226 | `Mapea los grupos del Active Directory del usuario a un rol interno del sistema de acuerdo a las prioridades (Admin > Operador > Consulta).` |

**Decodificación de logonHours:**

El atributo `logonHours` de AD es un bitmap de 21 bytes = 168 bits. Cada bit representa una hora de la semana:

```
Bit   0  = Domingo 00:00-01:00
Bit  23  = Domingo 23:00-24:00
Bit  24  = Lunes 00:00-01:00
...
Bit 167  = Sábado 23:00-24:00
```

La función extrae los bits LSB-first y los agrupa por día (24 horas cada uno), mapeando el orden de AD (Domingo=0) al orden de Python (Lunes=0).

#### `services/auth_service.py` — JWT

| Función | Descripción |
|---|---|
| `create_token(user_data)` | Crea token HS256 con claims: `sub` (username), `name`, `role`, `iat`, `exp` |
| `decode_token(token)` | Decodifica y valida el token. Levanta `PermissionError` si expiró o es inválido |

### 2.4 Rutas

#### `routes/auth.py` — Autenticación

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/api/auth/login` | POST | pública | Recibe `{username, password}`, autentica contra AD, verifica horario, mapea rol, devuelve `{token, user}` |
| `/api/auth/me` | GET | JWT | Devuelve usuario del token actual |
| `/api/auth/logout` | POST | JWT | Confirma cierre de sesión (el frontend elimina el token) |

**Flujo de login:**

```
1. Recibir username/password del formulario
2. authenticate_user(username, password)
   ├── Buscar usuario en AD (cuenta admin)
   │   ├── Obtener DN, displayName, mail, grupos, logonHours
   │   └── Si no existe → devuelve None
   ├── Validar contraseña (segundo bind con credenciales del usuario)
   │   ├── Si AD responde "data 530" → levanta PermissionError (horario no permitido)
   │   ├── Si falla por otro motivo → devuelve None (contraseña incorrecta)
   │   └── Si ok → continúa
   └── Devuelve datos del usuario (incluyendo logonHours decodificado)
3. check_access_hours(user_data["logon_hours"])
   ├── Si logonHours dice que esta hora está bloqueada → PermissionError
   │   (AD ya pudo haber rechazado en el paso 2 con data 530)
   └── Si logonHours no está configurado → fallback 8-18 hábiles
4. map_role(user_data["groups"])
   ├── Si no pertenece a ningún grupo autorizado → 403
   └── Si ok → asigna rol (Admin / Operador / Consulta)
5. create_token({username, name, role})
6. Devolver {token, user: {id, name, role}}
```

**Mensajes de error del login y su origen:**

| Mensaje | Código HTTP | Origen |
|---|---|---|
| "Credenciales inválidas" | 401 | `authenticate_user()` devuelve None |
| "Acceso rechazado: La hora actual..." | 403 | AD responde `data 530` (logonHours) O `check_access_hours()` falla |
| "Usuario sin grupo autorizado" | 403 | `map_role()` devuelve None |
| "No se pudo establecer conexión..." | 503 | Error de conexión LDAP |

#### `routes/dashboard.py` — Estadísticas

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/api/dashboard/summary` | GET | JWT | Total productos, bajo stock, movimientos hoy, valor estimado |
| `/api/dashboard/top-products` | GET | JWT | Top 5 productos con más egresos |
| `/api/dashboard/movements-weekly` | GET | JWT | Ingresos/egresos por día de la semana actual (lun-dom) |
| `/api/dashboard/category-distribution` | GET | JWT | Stock total por categoría |

#### `routes/productos.py` — CRUD de productos

| Endpoint | Método | Roles | Descripción |
|---|---|---|---|
| `/api/productos` | GET | cualquier autenticado | Listar productos (con filtro `?q=`) + nombre de categoría |
| `/api/productos/<id>` | GET | cualquier autenticado | Obtener producto por ID |
| `/api/productos` | POST | Admin | Crear producto (valida categoría, sanitiza inputs) |
| `/api/productos/<id>` | PUT | Admin | Actualizar producto (parcial) |
| `/api/productos/<id>` | DELETE | Admin | Eliminar producto |

**Esquema de producto:**
```json
{
  "id": 1,
  "nombre": "Laptop Gamer",
  "categoria_id": 1,
  "stock_actual": 23,
  "stock_minimo": 5,
  "precio_unitario": 1200.0,
  "categoria_nombre": "Electrónica"
}
```

#### `routes/movimientos.py` — Movimientos de stock

| Endpoint | Método | Roles | Descripción |
|---|---|---|---|
| `/api/movimientos` | GET | cualquier autenticado | Listar movimientos con filtros (`?tipo=`, `?producto_id=`, `?desde=`, `?hasta=`) |
| `/api/movimientos` | POST | Admin, Operador | Registrar movimiento (ingreso/egreso/ajuste) + actualizar stock |

**Tipos de movimiento y efecto en stock:**

| Tipo | Efecto | Validación |
|---|---|---|
| `ingreso` | `stock_actual += cantidad` | — |
| `egreso` | `stock_actual -= cantidad` | Stock suficiente |
| `ajuste` | `stock_actual = cantidad` | — |

#### `routes/reportes.py` — Exportación CSV

| Endpoint | Método | Roles | Descripción |
|---|---|---|---|
| `/api/reportes/export?tipo=inventario` | GET | Admin | CSV con nombre, categoría, stock, precio, valor total |
| `/api/reportes/export?tipo=movimientos` | GET | Admin | CSV con fecha, producto, tipo, cantidad, usuario, observación |

**Función auxiliar:**

| Función | Docstring |
|---|---|
| `sanitizar_csv(valor)` | `Previene CSV injection anteponiendo un espacio si el valor empieza con caracter peligroso.` |

#### `routes/categorias.py` — Categorías

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/api/categorias` | GET | JWT | Listar todas las categorías |

### 2.5 Utilidades

#### `utils/decorators.py` — Decoradores de protección

| Decorador | Descripción |
|---|---|
| `@jwt_required` | Lee header `Authorization: Bearer <token>`, decodifica, guarda payload en `g.current_user`. Devuelve 401 si falta o es inválido |
| `@require_role("Admin", "Operador")` | Verifica que `g.current_user["role"]` esté en la lista. Devuelve 403 si no. Uso: `@jwt_required` + `@require_role(...)` |

#### `utils/helpers.py` — Sanitización y validación

| Función | Descripción |
|---|---|
| `sanitizar_input(texto, max_length=100)` | Elimina `< > " ' ;`, recorta, trunca |
| `validar_campo_numerico(valor, minimo=0)` | Verifica tipo numérico y rango |

---

## 3. Frontend — Estructura y componentes

### 3.1 Routing y protecciones

**Archivo:** `frontend/src/app/routes.tsx`

```
/                  → Login        (público)
/unauthorized       → Unauthorized (público)
/dashboard          → Dashboard    (ProtectedRoute)
/productos          → Productos    (ProtectedRoute + RoleRoute Admin/Operador)
/movimientos        → Movimientos  (ProtectedRoute + RoleRoute Admin/Operador)
/reportes           → Reportes     (ProtectedRoute + RoleRoute Admin)
```

- `ProtectedRoute`: redirige a `/` si no hay sesión
- `RoleRoute`: redirige a `/unauthorized` si el rol no corresponde
- Todas las rutas protegidas están envueltas en `Layout` (sidebar + header)

### 3.2 Estado de autenticación

**Archivo:** `frontend/src/app/contexts/AuthContext.tsx`

Provider global que maneja:

| Método | Descripción |
|---|---|
| `login(username, password)` | POST `/api/auth/login`, guarda token y user en localStorage + estado React |
| `logout()` | POST `/api/auth/logout`, limpia localStorage y estado |
| `isAuthenticated` | `true` si hay token y user en estado |

El estado se inicializa desde `localStorage` al cargar la app (persistencia entre recargas).

### 3.3 Cliente API

**Archivo:** `frontend/src/app/services/api.ts`

Wrapper centralizado de `fetch`:

| Función | Descripción |
|---|---|
| `api.get(url)` | GET con JWT |
| `api.post(url, body)` | POST con JWT y JSON body |
| `api.put(url, body)` | PUT con JWT y JSON body |
| `api.delete(url)` | DELETE con JWT |

Maneja automáticamente:
- Adjuntar header `Authorization: Bearer <token>`
- Redirigir a `/` en 401 (solo para endpoints que NO son de login)
- Parsear errores JSON del backend
- Lanzar `Error` con el mensaje del backend

### 3.4 Permisos por rol

**Archivo:** `frontend/src/app/utils/permissions.ts`

Funciones que reciben el objeto `user` y devuelven `boolean`:

| Función | Admin | Operador | Consulta |
|---|---|---|---|
| `canCreate(user)` | ✅ | ❌ | ❌ |
| `canEdit(user)` | ✅ | ❌ | ❌ |
| `canDelete(user)` | ✅ | ❌ | ❌ |
| `canRegisterMovements(user)` | ✅ | ✅ | ❌ |
| `canExport(user)` | ✅ | ❌ | ❌ |
| `canViewProductos(user)` | ✅ | ✅ | ❌ |
| `canViewMovimientos(user)` | ✅ | ✅ | ❌ |
| `canViewReportes(user)` | ✅ | ❌ | ❌ |

### 3.5 Componentes principales

| Componente | Archivo | Descripción |
|---|---|---|
| `Login` | `Login.tsx` | Formulario con campos username/password (toggle visibilidad), muestra errores en recuadro rojo, loading state |
| `Layout` | `Layout.tsx` | Sidebar con navegación filtrada por rol, header con indicador de horario y dropdown de usuario (cierre de sesión) |
| `Dashboard` | `Dashboard.tsx` | 4 cards de resumen + 3 gráficos (Recharts): top productos, movimientos semanales, distribución por categoría. Esqueletos (skeleton) mientras carga |
| `Productos` | `Productos.tsx` | Tabla con búsqueda, modal de creación/edición (shadcn Dialog + Select), badges de bajo stock, acciones según permisos |
| `Movimientos` | `Movimientos.tsx` | Tabla con filtros (tipo), modal de registro con select de producto/tipo, formato de fecha con fallback |
| `Reportes` | `Reportes.tsx` | Botones de exportación CSV de inventario y movimientos |
| `ProtectedRoute` | `ProtectedRoute.tsx` | Redirige a `/` si no hay sesión |
| `RoleRoute` | `RoleRoute.tsx` | Redirige a `/unauthorized` si el rol no está en la lista permitida |
| `Unauthorized` | `Unauthorized.tsx` | Página de acceso denegado |

**Hooks personalizados:**

| Hook | Archivo | Descripción |
|---|---|---|
| `useDashboardData` | `hooks/useDashboardData.ts` | Fetch de los 4 endpoints del dashboard en paralelo (`Promise.all`) |
| `useProductos` | `hooks/useProductos.ts` | CRUD de productos con estado local (lista, loading, crear, actualizar, eliminar) |
| `useMovimientos` | `hooks/useMovimientos.ts` | Listar (con filtros) y registrar movimientos |

**Componentes UI (shadcn):**

Los componentes de interfaz reutilizables están en `components/ui/`. Solo 9 se usan actualmente:

| Componente | Uso |
|---|---|
| `badge` | Estado de stock (OK/bajo) en Productos; tipo de movimiento en Movimientos |
| `button` | Botones en todas las pantallas |
| `card` | Cards de resumen en Dashboard; botones de exportación en Reportes |
| `dialog` | Modales de creación/edición en Productos y Movimientos |
| `dropdown-menu` | Menú de usuario en Layout |
| `input` | Campos de formulario en Productos y Movimientos |
| `select` | Selectores de categoría/tipo en Productos y Movimientos |
| `skeleton` | Esqueletos de carga en Dashboard, Productos, Movimientos |
| `table` | Tablas en Productos y Movimientos |

---

## 4. Flujo de autenticación

```
Usuario                    Frontend                    Backend                   AD
  │                           │                          │                       │
  │  Ingresa credenciales      │                          │                       │
  │──────────────────────────▶│                          │                       │
  │                           │  POST /api/auth/login     │                       │
  │                           │  {username, password}     │                       │
  │                           │─────────────────────────▶│                       │
  │                           │                          │  LDAP search           │
  │                           │                          │  (cuenta admin)        │
  │                           │                          │──────────────────────▶│
  │                           │                          │  sAMAccountName=user   │
  │                           │                          │◀──────────────────────│
  │                           │                          │  DN, groups,           │
  │                           │                          │  logonHours, nombre    │
  │                           │                          │                       │
  │                           │                          │  LDAP bind             │
  │                           │                          │  (credenciales user)   │
  │                           │                          │──────────────────────▶│
  │                           │                          │◀──────────────────────│
  │                           │                          │  OK / data 530 / error │
  │                           │                          │                       │
  │                           │                          │  Verificar horario     │
  │                           │                          │  Mapear rol            │
  │                           │                          │  Generar JWT           │
  │                           │                          │                       │
  │                           │  {token, user} / error    │                       │
  │                           │◀─────────────────────────│                       │
  │                           │                          │                       │
  │  Muestra error o           │                          │                       │
  │  redirige a dashboard     │                          │                       │
  │◀──────────────────────────│                          │                       │
```

### Detalle de códigos de error LDAP

| Código | Significado | Acción del backend |
|---|---|---|
| `data 525` | Usuario no encontrado | Credenciales inválidas |
| `data 52e` | Contraseña incorrecta | Credenciales inválidas |
| `data 530` | No permitido en este horario | PermissionError → 403 |
| `data 531` | No permitido desde esta estación | Credenciales inválidas |
| `data 532` | Contraseña expirada | Credenciales inválidas |
| `data 533` | Cuenta deshabilitada | Credenciales inválidas |

---

## 5. Sistema de roles

### Mapeo desde AD (configurable en `.env`)

| Grupo AD (default) | Rol | Permisos |
|---|---|---|
| **GG_Gerencia** | **Admin** | CRUD productos, movimientos, reportes CSV, dashboard |
| **GG_Soporte** | **Operador** | Ver productos, ver/registrar movimientos, dashboard |
| **GG_RRHH** | **Consulta** | Solo dashboard (visualización general) |

### Prioridad de roles

Si un usuario pertenece a múltiples grupos, se aplica el primer match en este orden:
1. Admin (más permisos)
2. Operador
3. Consulta (menos permisos)

### Protección en backend

Los decoradores verifican el rol en cada request:

```python
@productos_bp.route("/api/productos", methods=["POST"])
@jwt_required
@require_role("Admin")           # ← solo Admin puede crear
def crear_producto():
    ...

@movimientos_bp.route("/api/movimientos", methods=["POST"])
@jwt_required
@require_role("Admin", "Operador")  # ← Admin y Operador pueden registrar
def registrar_movimiento():
    ...
```

### Protección en frontend

- `RoleRoute` en el router redirige si el rol no corresponde
- `permissions.ts` oculta botones de crear/editar/eliminar según el rol
- El sidebar solo muestra las secciones que el rol puede ver

---

## 6. Restricción horaria

### Dos niveles de validación

**1. Active Directory (logonHours):**

AD almacena las horas permitidas en el atributo `logonHours` (21 bytes, 168 bits).
Si está configurado:

- AD rechaza el bind con código `data 530` si el usuario intenta loguearse fuera de sus horas
- El backend detecta `data 530` y devuelve error 403 con mensaje de horario restringido

**2. Fallback hardcodeado (app):**

Si el usuario no tiene `logonHours` configurado en AD, la app aplica:
- Días hábiles (lunes a viernes)
- Horario 08:00 a 18:00 hs

**3. Bypass para pruebas:**

Configurar `RESTRICCION_HORARIA_DESHABILITADA=True` en `.env` deshabilita toda verificación horaria.

### Decodificación de logonHours

```python
def decodificar_logon_hours(data):
    """
    Entrada: 21 bytes (168 bits)
    Salida: {0: [8,9,...,17], 1: [8,9,...,17], ..., 5: [], 6: []}
    donde la clave es Python weekday (0=Lunes, 6=Domingo)
    y el valor es la lista de horas permitidas (0-23)
    """
```

---

## 7. Persistencia de datos

### Archivo único JSON

**Ruta:** `backend/data/database.json`

**Estructura:**
```json
{
  "categorias": [ { "id": 1, "nombre": "Electrónica" } ],
  "productos": [ { "id": 1, "nombre": "...", "categoria_id": 1, ... } ],
  "movimientos": [ { "id": 1, "producto_id": 1, "tipo": "ingreso", ... } ]
}
```

### Operaciones

| Operación | Descripción |
|---|---|
| `get_db()` | Lee el archivo completo a memoria |
| `save_db(data)` | Escribe el archivo completo (atómico, sin escritura parcial) |
| `get_next_id(coleccion)` | Auto-increment: `max(id) + 1` |

### Ventaja vs. base de datos relacional

- No requiere instalación de motor de base de datos
- Fácil de inspeccionar y modificar manualmente
- Backups simples (copiar el archivo)
- Aprobado por el profesor para este TP

---

## 8. Modelo de datos

### Categoría

```json
{
  "id": 1,
  "nombre": "Electrónica"
}
```

### Producto

```json
{
  "id": 1,
  "nombre": "Laptop Gamer",
  "categoria_id": 1,
  "stock_actual": 23,
  "stock_minimo": 5,
  "precio_unitario": 1200.0
}
```

### Movimiento

```json
{
  "id": 1,
  "producto_id": 1,
  "tipo": "ingreso",
  "cantidad": 15,
  "usuario_id": "juan.perez",
  "observacion": "Stock inicial",
  "created_at": "2026-06-20T10:00:00"
}
```

---

## 9. Seguridad implementada

| Medida | Implementación |
|---|---|
| **JWT** | Tokens firmados con `SECRET_KEY` del `.env`. `SECRET_KEY` es obligatoria (sin fallback hardcodeado) |
| **Sanitización de inputs** | `sanitizar_input()` elimina caracteres HTML (`< > " ' ;`) |
| **Validación numérica** | `validar_campo_numerico()` verifica tipo y rango |
| **Escape LDAP** | `ldap_escape()` de ldap3 + regex whitelist en username |
| **CSV injection** | Valores que empiezan con `= + - @` se escapan con `'` al inicio |
| **CORS restringido** | Solo `http://localhost:5173` |
| **Servidor en localhost** | `run.py` usa `127.0.0.1`, no `0.0.0.0` |
| **Manejo de errores** | Handlers globales devuelven JSON, no HTML |
| **Logging** | Eventos de autenticación registrados en `app.log` |
| **Roles en backend** | `@require_role` en cada endpoint de escritura |
| **Roles en frontend** | `RoleRoute` + permisos condicionales en UI |
| **Auto-logout** | Redirect a `/` al recibir 401 (excepto en login) |
| **localStorage seguro** | Try-catch al parsear, cleanup si corrupto |

---

## 10. Ejecución del proyecto

### Requisitos

- Python 3.10+
- Node.js 18+
- Active Directory accesible (VM con Windows Server)

### Backend

```bash
cd backend

# Crear entorno virtual
python3 -m venv .venv
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env (copiar .env.example y ajustar)
cp .env.example .env
# Editar .env con los datos del AD

# Ejecutar
python run.py
# Servidor en http://127.0.0.1:5000
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar (desarrollo)
npm run dev
# Servidor en http://localhost:5173

# Build para producción
npm run build
```

### Script de prueba LDAP (standalone)

```bash
cd backend
source .venv/bin/activate
python prueba_login_ldap.py
```

Solicita usuario y contraseña, se conecta al AD, autentica y muestra todos los atributos del usuario (incluyendo logonHours decodificado).

---

## 11. Guía de prueba en clase

### Demostración rápida

1. Iniciar VM con AD (Host-Only, IP `192.168.56.10`)
2. Iniciar backend: `cd backend && source .venv/bin/activate && python run.py`
3. Iniciar frontend: `cd frontend && npm run dev`
4. Abrir `http://localhost:5173`

### Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| `juan.perez` | `IFTS.2026.GERENCIA` | Admin |
| Usuario en grupo `GG_Soporte` | (pass del grupo) | Operador |
| Usuario en grupo `GG_RRHH` | (pass del grupo) | Consulta |

### Para probar la restricción horaria

1. Configurar `logonHours` en AD para un usuario (desde "Active Directory Users and Computers" → Propiedades del usuario → Account → Logon Hours)
2. Intentar login fuera de las horas configuradas → error 403 con mensaje de horario
3. Para deshabilitar la restricción durante la demo: `RESTRICCION_HORARIA_DESHABILITADA=True` en `.env`

### Flujo de demostración sugerido

```
1. Login como Admin (juan.perez)
   → Mostrar dashboard con stats y gráficos
2. Crear producto
   → Mostrar modal con categorías
3. Registrar movimiento (ingreso/egreso)
   → Mostrar actualización de stock
4. Login como Operador
   → Mostrar que NO puede crear/editar productos
   → Mostrar que SÍ puede registrar movimientos
5. Exportar reportes CSV (solo Admin)
   → Abrir en Excel/LibreOffice
6. Restricción horaria
   → Configurar logonHours en AD
   → Mostrar error al intentar login
```
