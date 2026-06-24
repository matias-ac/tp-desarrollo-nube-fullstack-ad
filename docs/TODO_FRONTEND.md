# Frontend TODOs — Conectar React con Backend Flask

> Proyecto: Sistema de Gestión y Control de Stock (IFTS 18)
> Stack: React + Vite + Tailwind + shadcn/ui
> Backend: Flask + LDAP + JSON (a construir)

---

## Fase 1 — Infraestructura y conexión con backend

### 1.1 Configurar variable de entorno para API base URL
- Crear archivo `.env` (y `.env.example`) en la raíz
- Agregar `VITE_API_BASE_URL=http://localhost:5000/api`

### 1.2 Configurar proxy de Vite para desarrollo
- Agregar `server.proxy` en `vite.config.ts` para redirigir `/api` → backend Flask
- Evita CORS en desarrollo

### 1.3 Crear servicio API centralizado
- Crear `src/app/services/api.ts`
- Función wrapper con `fetch` que:
  - Adjunte token JWT en header `Authorization: Bearer <token>`
  - Maneje errores globales (401 → redirect a login)
  - Exponga helpers: `api.get(url)`, `api.post(url, body)`, etc.

### 1.4 Crear contexto de autenticación
- Crear `src/app/contexts/AuthContext.tsx`
- `AuthProvider` que provea:
  - `user` (id, nombre, role)
  - `token`
  - `isAuthenticated`
  - `login(username, password)` → llama a `POST /api/auth/login`
  - `logout()`
- Persistir token en `localStorage`
- Envolver la app con `AuthProvider` en `App.tsx`

### 1.5 Agregar protección de rutas
- En `routes.tsx`:
  - Ruta `/dashboard` debe redirigir a `/` si no hay token válido
  - Opcional: crear componente `ProtectedRoute`

---

## Fase 2 — Login real contra backend

### 2.1 Refactorizar `Login.tsx` para usar API
- Reemplazar mock `navigate('/dashboard')` por llamada a `AuthContext.login()`
- Enviar `username` y `password` al backend
- Backend esperado:
  ```json
  POST /api/auth/login
  Body: { "username": "dominio\\usuario", "password": "..." }
  Respuesta 200: { "token": "jwt...", "user": { "id": "logistica.user", "role": "Operador", "name": "..." } }
  ```
- Manejar errores:
  - 401: credenciales inválidas
  - 403: fuera del horario de acceso (mostrar mensaje del backend)
  - 500: error de servidor
- Mostrar los errores en la UI (toast con `sonner` o mensaje inline)

### 2.2 Refactorizar el botón "Cerrar Sesión"
- Que llame a `AuthContext.logout()` en lugar de solo navegar a `/`

---

## Fase 3 — Dashboard dinámico con datos reales

### 3.1 Crear hooks o funciones para fetch de datos
- En `Dashboard.tsx` (o un hook separado `useDashboardData`):
  - `GET /api/dashboard/summary` → stats cards
  - `GET /api/dashboard/top-products` → bar chart
  - `GET /api/dashboard/movements-weekly` → line chart
  - `GET /api/dashboard/category-distribution` → pie chart
- Manejar estados: loading (skeleton) y error (toast)

### 3.2 Reemplazar datos hardcodeados en Dashboard
- Stats cards: mapear desde API en lugar del array fijo
- `barData`, `lineData`, `pieData`: idem
- Eliminar constantes `barData`, `pieData`, `lineData`

### 3.3 Reemplazar mock de usuario por el real
- Eliminar array `users` hardcodeado
- Eliminar `currentUser` con estado local
- Leer `user` desde `AuthContext`
- Eliminar el switcher de roles del dropdown (ya no se cambia desde frontend)

### 3.4 Refactorizar sidebar a datos dinámicos según rol
- Los links del sidebar deben generarse según `user.role`:
  - Admin: todos los links
  - Operador: todos excepto "Reportes" (o export)
  - Consulta: solo "Vista General" (lectura)
- Los links deben ser `<a>` a rutas de React Router, no `#`

### 3.5 Refactorizar componentes UI para usar shadcn/ui
- Reemplazar el `<div>` de stats cards por `<Card>`, `<CardHeader>`, `<CardContent>`
- Reemplazar el dropdown inline por `<DropdownMenu>`
- Reemplazar `<button>` de login por `<Button>`

---

## Fase 4 — Control de acceso por roles en UI

### 4.1 Definir lógica de permisos
- Crear `src/app/utils/permissions.ts`
- Constantes o funciones:
  - `ROLES.ADMIN`, `ROLES.OPERADOR`, `ROLES.CONSULTA`
  - `canCreate(user)`, `canEdit(user)`, `canDelete(user)`, `canRegisterMovements(user)`, `canExport(user)`

### 4.2 Aplicar permisos en Dashboard
- Si `user.role === 'Consulta'`:
  - Botón de "Cerrar Sesión" debe quedar visible
  - Indicador de sincronización AD visible
  - Resto del contenido es solo lectura (ya está ok)
- Si `user.role === 'Operador'`:
  - Sin cambios visibles por ahora (no hay botones de admin en el dashboard)
- Si `user.role === 'Admin'`:
  - Sin restricciones

---

## Fase 5 — Pantallas faltantes

### 5.1 Crear página Gestión de Productos
- Ruta: `/productos`
- Tabla con listado de productos (usar `<Table>` de shadcn/ui)
- Botón "Nuevo Producto" (según rol)
- Modal/drawer con formulario (usar `<Dialog>`, `react-hook-form`)
- Acciones: Editar / Eliminar (según rol)
- Endpoints esperados:
  - `GET /api/productos`
  - `POST /api/productos` (Admin)
  - `PUT /api/productos/:id` (Admin)
  - `DELETE /api/productos/:id` (Admin)

### 5.2 Crear página Movimientos
- Ruta: `/movimientos`
- Tabla con historial de movimientos
- Botón "Nuevo Movimiento" (Admin y Operador)
- Formulario: tipo (ingreso/egreso/ajuste), producto, cantidad
- Endpoints esperados:
  - `GET /api/movimientos`
  - `POST /api/movimientos` (Admin, Operador)

### 5.3 Crear página Reportes
- Ruta: `/reportes`
- Botones para exportar CSV:
  - Exportar inventario actual
  - Exportar sábana de movimientos
- Solo visible para Admin
- Endpoint esperado:
  - `GET /api/reportes/export?tipo=inventario` → descarga CSV
  - `GET /api/reportes/export?tipo=movimientos` → descarga CSV

### 5.4 Agregar rutas al router
- En `routes.tsx`, agregar:
  - `/productos` → `ProductosPage`
  - `/movimientos` → `MovimientosPage`
  - `/reportes` → `ReportesPage`
  - Todas protegidas por autenticación

---

## Fase 6 — UX y pulido

### 6.1 Agregar skeletons / loaders
- Mientras se cargan datos del dashboard, mostrar `<Skeleton>` de shadcn/ui

### 6.2 Agregar toasts de notificación
- Usar `sonner` (ya está en package.json) para:
  - Éxito/error en login
  - Éxito/error en operaciones CRUD

### 6.3 Manejo de error global
- En `api.ts`, capturar 401 y hacer logout automático
- Mostrar toast genérico para errores de red

### 6.4 Limpiar artefactos de Figma (opcional)
- Eliminar `figmaAssetResolver` de `vite.config.ts`
- Eliminar `ImageWithFallback.tsx` si no se usa
- Renombrar package name en `package.json`

---

## Orden de ejecución recomendado

```
Fase 1 (infraestructura) → Fase 2 (login) → Fase 3 (dashboard dinámico)
→ Fase 4 (roles) → Fase 5 (pantallas faltantes) → Fase 6 (pulido)
```

Cada ticket dentro de una fase es atómico y puede ser resuelto de forma independiente, pero recomiendo respetar el orden numérico dentro de cada fase.
