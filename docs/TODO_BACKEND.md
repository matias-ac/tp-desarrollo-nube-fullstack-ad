# Backend TODOs — Flask + LDAP + JSON

> Proyecto: Sistema de Gestión y Control de Stock (IFTS 18)
> Stack: Python + Flask + ldap3 + JWT
> Persistencia: Archivos JSON (según indicación del profesor — clase 11/06)
> "No hace falta que sea puntualmente una base de datos SQL... con que lo puedan grabar y sea un CSV/JSON ya alcanza"

---

## Fase 1 — Scaffolding del proyecto

### 1.1 Crear estructura de directorios

```
backend/
├── app/
│   ├── __init__.py            # create_app() factory
│   ├── config.py              # Config desde .env
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py            # POST /api/auth/login, GET /api/auth/me
│   │   ├── dashboard.py       # GET /api/dashboard/*
│   │   ├── productos.py       # CRUD productos
│   │   ├── movimientos.py     # CRUD movimientos
│   │   └── reportes.py        # GET /api/reportes/export → CSV
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ldap_service.py    # Conexión y consultas LDAP
│   │   ├── auth_service.py    # Lógica de autenticación + JWT
│   │   └── storage.py         # Lectura/escritura de archivos JSON
│   └── utils/
│       ├── __init__.py
│       ├── decorators.py      # @jwt_required, @require_role
│       └── helpers.py         # Validaciones, formateo
├── data/                      # Archivos de persistencia (NO se suben a git)
│   └── database.json          # Único archivo: { categorias, productos, movimientos }
├── requirements.txt
├── .env
├── .env.example
└── run.py                     # Entry point
```

### 1.2 Crear entorno virtual y dependencias

```txt
flask
flask-cors
ldap3
pyjwt
python-dotenv
gunicorn              # producción (opcional)
```

### 1.3 Configurar variables de entorno

Crear `.env` y `.env.example`:

```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=generar-un-secreto-seguro-aqui

AD_SERVER=127.0.0.1
AD_PORT=3389
AD_USE_SSL=False
AD_BASE_DN=DC=IFTS,DC=LOCAL
AD_ADMIN_DN=CN=Administrator,CN=Users,DC=IFTS,DC=LOCAL
AD_ADMIN_PASSWORD=tu_password_de_administrator

# Mapeo de grupos AD → roles (configurable)
AD_MAP_ADMIN=GG_Gerencia
AD_MAP_OPERADOR=GG_Soporte
AD_MAP_CONSULTA=GG_RRHH

JWT_EXPIRATION_HOURS=8
```

### 1.4 Implementar `create_app()` factory

En `app/__init__.py`:
- Cargar config desde `config.py`
- Inicializar Flask-CORS
- Registrar blueprints de cada ruta
- (Opcional) Cargar datos semilla si los JSON están vacíos

---

## Fase 2 — Servicio de persistencia JSON

### 2.1 Crear `app/services/storage.py`

Módulo que expone operaciones contra `data/database.json`:

- `get_db()` → lee y devuelve el dict completo `{ categorias, productos, movimientos }`
- `save_db(data)` → escribe el dict completo al archivo (sobrescritura total)
- `get_next_id(coleccion)` → autoincremental simple (último ID + 1)

Manejo:
- Si `database.json` no existe, se crea automáticamente con colecciones vacías
- Toda escritura es atómica: se reescribe el archivo completo
- Sin dependencias externas — solo `json` de la stdlib

### 2.2 Crear archivo semilla (`data/database.json`)

```json
{
  "categorias": [
    { "id": 1, "nombre": "Electrónica" },
    { "id": 2, "nombre": "Accesorios" },
    { "id": 3, "nombre": "Repuestos" },
    { "id": 4, "nombre": "Insumos" }
  ],
  "productos": [
    { "id": 1, "nombre": "Laptop Gamer", "categoria_id": 1, "stock_actual": 15, "stock_minimo": 5, "precio_unitario": 1200.00 },
    { "id": 2, "nombre": "Monitor 24\"", "categoria_id": 1, "stock_actual": 8, "stock_minimo": 10, "precio_unitario": 350.00 },
    { "id": 3, "nombre": "Teclado Mecánico", "categoria_id": 2, "stock_actual": 25, "stock_minimo": 10, "precio_unitario": 85.00 },
    { "id": 4, "nombre": "Mouse Inalámbrico", "categoria_id": 2, "stock_actual": 30, "stock_minimo": 15, "precio_unitario": 45.00 },
    { "id": 5, "nombre": "Cable HDMI 2m", "categoria_id": 4, "stock_actual": 50, "stock_minimo": 20, "precio_unitario": 12.00 },
    { "id": 6, "nombre": "Webcam HD", "categoria_id": 1, "stock_actual": 12, "stock_minimo": 8, "precio_unitario": 65.00 },
    { "id": 7, "nombre": "Hub USB 4 puertos", "categoria_id": 2, "stock_actual": 20, "stock_minimo": 10, "precio_unitario": 25.00 },
    { "id": 8, "nombre": "Disco SSD 512GB", "categoria_id": 1, "stock_actual": 3, "stock_minimo": 10, "precio_unitario": 89.00 },
    { "id": 9, "nombre": "Funda para Notebook", "categoria_id": 2, "stock_actual": 18, "stock_minimo": 10, "precio_unitario": 35.00 },
    { "id": 10, "nombre": "Cartucho Tóner", "categoria_id": 4, "stock_actual": 6, "stock_minimo": 15, "precio_unitario": 55.00 }
  ],
  "movimientos": [
    { "id": 1, "producto_id": 1, "tipo": "ingreso", "cantidad": 15, "usuario_id": "admin", "observacion": "Stock inicial", "created_at": "2026-06-20T10:00:00" },
    { "id": 2, "producto_id": 8, "tipo": "egreso", "cantidad": 2, "usuario_id": "operador1", "observacion": "Venta directa", "created_at": "2026-06-21T14:30:00" },
    { "id": 3, "producto_id": 3, "tipo": "ajuste", "cantidad": 5, "usuario_id": "admin", "observacion": "Recuento físico", "created_at": "2026-06-22T09:15:00" }
  ]
}
```

---

## Fase 3 — Servicio LDAP

### 3.1 Implementar conexión LDAP (`app/services/ldap_service.py`)

- `get_ldap_connection()`:
  - Conectar al AD usando `ldap3` (Server + Connection)
  - Bind inicial con cuenta de servicio (`AD_ADMIN_DN`)
  - Timeout configurable
  - Manejo de errores de conexión

### 3.2 Autenticar usuario contra AD

- `authenticate_user(username, password)`:
  - Buscar el DN del usuario por `sAMAccountName`
  - Hacer bind con las credenciales del usuario (verificar contraseña)
  - Devolver datos del AD (DN, nombre, email, grupos `memberOf`)

### 3.3 Leer grupos AD

- `get_user_groups(dn)`:
  - Leer atributo `memberOf`
  - Extraer CN de cada grupo
  - Devolver lista: `["GG_Gerencia", "GG_Soporte"]`

### 3.4 Mapear grupo → rol

- `map_role(groups)`:
  - Leer de variables de entorno (no hardcodeado):
    - `AD_MAP_ADMIN` → `Admin`
    - `AD_MAP_OPERADOR` → `Operador`
    - `AD_MAP_CONSULTA` → `Consulta`
  - Si no coincide con ningún grupo mapeado → denegar acceso

### 3.5 Validar restricción horaria

- `check_access_hours()`:
  - Hora actual del sistema
  - Permitir solo si `08:00 <= hora < 18:00`
  - Fuera de horario → lanzar excepción con mensaje para el frontend

---

## Fase 4 — Autenticación y JWT

### 4.1 `POST /api/auth/login`

- Recibir `{ "username": "...", "password": "..." }`
- Validar campos requeridos
- Llamar a `check_access_hours()` → si falla, `403` con mensaje
- Llamar a `authenticate_user()` → si falla, `401`
- Leer grupos y mapear a rol
- Generar JWT: `{ "sub": username, "role": rol, "name": nombre }`
- Responder:
```json
{
  "token": "eyJ...",
  "user": {
    "id": "logistica.user",
    "name": "Logística Usuario",
    "role": "Operador"
  }
}
```

### 4.2 `GET /api/auth/me`

- Requiere token JWT
- Decodificar y devolver datos del usuario (para refresh en frontend)

### 4.3 `POST /api/auth/logout`

- Stateless (no-op). Responder `200 OK`

### 4.4 Decoradores de autorización

- `@jwt_required`:
  - Extraer token de `Authorization: Bearer <token>`
  - Decodificar y validar (firma, expiración)
  - Inyectar `current_user` en `g`
- `@require_role(*roles)`:
  - Verificar que `current_user.role` esté en los roles permitidos
  - Responder `403` si no

---

## Fase 5 — Endpoints del Dashboard

### 5.1 `GET /api/dashboard/summary`

- `total_productos`: len(productos)
- `bajo_stock`: count donde `stock_actual < stock_minimo`
- `movimientos_hoy`: count de movimientos con fecha de hoy
- `valor_estimado`: suma de `stock_actual * precio_unitario`

### 5.2 `GET /api/dashboard/top-products`

- Top 5 productos con más egresos
- Agrupar desde `database.json` → movimientos

### 5.3 `GET /api/dashboard/movements-weekly`

- Movimientos de los últimos 7 días agrupados por día
- Calcular con fechas reales (datetime)

### 5.4 `GET /api/dashboard/category-distribution`

- Stock actual agrupado por categoría
- Leer `database.json` → categorias y productos

---

## Fase 6 — CRUD de Productos

Operaciones contra `database.json` (colección `productos`):

| Endpoint | Método | Roles | Descripción |
|----------|--------|-------|-------------|
| `/api/productos` | GET | Todos | Listar (con filtro `?q=`) |
| `/api/productos/<id>` | GET | Todos | Detalle |
| `/api/productos` | POST | Admin | Crear |
| `/api/productos/<id>` | PUT | Admin | Actualizar |
| `/api/productos/<id>` | DELETE | Admin | Eliminar |

Validaciones inline (sin marshmallow):
- Campos requeridos: nombre, categoria_id, stock_actual, stock_minimo, precio_unitario
- stock_actual >= 0, precio_unitario > 0
- categoria_id debe existir en `database.json` → categorias

---

## Fase 7 — Movimientos de Stock

Operaciones contra `database.json` (colección `movimientos`):

| Endpoint | Método | Roles | Descripción |
|----------|--------|-------|-------------|
| `/api/movimientos` | GET | Todos | Listar (filtros: `?tipo=&producto_id=&desde=&hasta=`) |
| `/api/movimientos` | POST | Admin, Operador | Registrar |

Al registrar un movimiento:
- Validar que producto exista en `database.json` → productos
- Si es `egreso`, verificar `stock_actual >= cantidad`
- Actualizar `stock_actual` del producto en `database.json`
- Registrar `usuario_id` desde el token JWT
- Timestamp con `datetime.now().isoformat()`

Campos del movimiento: `id, producto_id, tipo, cantidad, usuario_id, observacion, created_at`

---

## Fase 8 — Reportes / Exportación CSV

### 8.1 `GET /api/reportes/export?tipo=inventario`

- Admin
- Generar CSV con: nombre, categoría, stock actual, stock mínimo, precio unitario, valor total
- Response: `Content-Type: text/csv` + `Content-Disposition: attachment`

### 8.2 `GET /api/reportes/export?tipo=movimientos`

- Admin
- CSV con: fecha, producto, categoría, tipo, cantidad, usuario, observación

---

## Fase 9 — Seguridad y buenas prácticas

### 9.1 Validación de entrada
- Validar manualmente en cada endpoint (sin marshmallow)
- Sanitizar inputs (longitud, caracteres especiales)

### 9.2 Manejo global de errores
- Handlers para `400`, `401`, `403`, `404`, `500`
- Formato uniforme: `{ "error": "...", "code": N }`

### 9.3 Logging
- Logging a `app.log`
- Loguear intentos de login (éxito/fallo)
- Loguear operaciones CRUD

### 9.4 CORS
- Flask-CORS permitiendo solo `http://localhost:5173`

### 9.5 Variables de entorno
- Nada hardcodeado — todo vía `.env`
- `.env.example` con placeholders

---

## Fase 10 — Scripts de utilidad

### 10.1 `seed.py`
- Regenera `data/database.json` con datos de ejemplo (el bloque de la Fase 2.2)
- Sobrescribe el archivo existente

### 10.2 `test_ldap.py`
- Script standalone que prueba conexión LDAP
- Útil para debuggear conectividad con la VM

### 10.3 Comandos Flask personalizados (opcional)
- `flask seed` → ejecuta seed.py
- `flask test-ldap` → test de conexión

---

## Orden de ejecución recomendado

```
Fase 1 (scaffolding) → Fase 2 (JSON storage) → Fase 3 (LDAP)
→ Fase 4 (auth + JWT) → Fase 5 (dashboard) → Fase 6 (productos)
→ Fase 7 (movimientos) → Fase 8 (reportes) → Fase 9 (seguridad)
→ Fase 10 (scripts)
```

Cada fase puede desarrollarse de forma independiente. El orden asegura que siempre haya algo funcional antes de avanzar. La Fase 3 (LDAP) puede trabajarse en paralelo con las Fases 1-2 si se tiene la VM disponible.
