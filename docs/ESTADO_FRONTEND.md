# Estado Actual del Frontend — Mock de Figma

> Documento de referencia que detalla la estructura, diseño y componentes del frontend
> tal como está hoy, antes de conectarlo al backend.

---

## 1. Origen del proyecto

El frontend fue generado a partir de un diseño de Figma usando la herramienta "Make" de Figma. Esto explica:

- El nombre del paquete en `package.json`: `@figma/my-make-file`
- El plugin `figmaAssetResolver()` en `vite.config.ts`, que resuelve imports `figma:asset/XXX` a archivos locales en `src/assets/`
- El componente `ImageWithFallback.tsx` en `src/app/components/figma/`
- El archivo `ATTRIBUTIONS.md` que acredita componentes shadcn/ui y fotos de Unsplash

No contiene ningún código de backend ni lógica de negocio real. Es enteramente un **mock visual**.

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework UI | React | 18.3.1 |
| Lenguaje | TypeScript | (tipado en toda la app) |
| Build tool | Vite | 6.3.5 |
| CSS engine | Tailwind CSS | 4.1.12 |
| Animaciones CSS | tw-animate-css | 1.3.8 |
| Routing | React Router | 7.13.0 |
| Charts | Recharts | 2.15.2 |
| Iconos | Lucide React | 0.487.0 |
| Componentes base | Radix UI (vía shadcn/ui) | ~40+ componentes |
| Variantes CSS | class-variance-authority (CVA) | 0.7.1 |
| Utilidades CSS | clsx + tailwind-merge (función `cn()`) | — |
| Tema | next-themes (disponible, no implementado aún) | 0.4.6 |
| Formularios | react-hook-form (disponible) | 7.55.0 |
| Toasts | sonner (disponible) | 2.0.3 |
| Fechas | date-fns (disponible) | 3.6.0 |
| MUI (alternativo) | @mui/material + @emotion | 7.3.5 |

---

## 3. Estructura de archivos del frontend

```
tp-final/
├── index.html                       # Entry point HTML
├── package.json
├── postcss.config.mjs
├── vite.config.ts                   # Vite + React + Tailwind + figmaAssetResolver
├── .env                             # NO EXISTE (no hay variables de entorno)
│
└── src/
    ├── main.tsx                     # createRoot + renderiza <App />
    │
    ├── styles/
    │   ├── index.css                # Agregador: importa fonts, tailwind y theme
    │   ├── fonts.css                # Archivo vacío (listo para declarar @font-face)
    │   ├── tailwind.css             # @import 'tailwindcss' + tw-animate-css
    │   └── theme.css                # Variables CSS (light/dark), layer base
    │
    └── app/
        ├── App.tsx                  # <RouterProvider router={router} />
        ├── routes.tsx               # 2 rutas: / (Login), /dashboard (Dashboard)
        │
        └── components/
            ├── Login.tsx            # Página de login (81 líneas)
            ├── Dashboard.tsx        # Dashboard principal (272 líneas)
            │
            ├── figma/
            │   └── ImageWithFallback.tsx  # Imagen con placeholder en caso de error
            │
            └── ui/                  # ~48 componentes shadcn/ui
                ├── button.tsx       # shadcn Button (variants: default, destructive, outline, secondary, ghost, link)
                ├── card.tsx         # Card + CardHeader + CardTitle + CardDescription + CardContent + CardFooter + CardAction
                ├── sidebar.tsx      # Sidebar system completo (726 líneas, ~20 subcomponentes)
                ├── dialog.tsx       # Modal dialog
                ├── dropdown-menu.tsx # Dropdown menu (~17 subcomponentes exportados)
                ├── chart.tsx        # Wrapper de Recharts (ChartContainer, ChartTooltip, ChartLegend)
                ├── table.tsx        # Tabla accesible
                ├── form.tsx         # Form wrappers para react-hook-form
                ├── tabs.tsx         # Tabs de navegación
                ├── input.tsx        # Input de texto
                ├── textarea.tsx     # Textarea
                ├── select.tsx       # Select dropdown
                ├── checkbox.tsx     # Checkbox
                ├── radio-group.tsx  # Radio group
                ├── switch.tsx       # Switch toggle
                ├── slider.tsx       # Slider
                ├── input-otp.tsx    # One-time password input
                ├── calendar.tsx     # Calendario (react-day-picker)
                ├── tooltip.tsx      # Tooltip
                ├── popover.tsx      # Popover
                ├── hover-card.tsx   # Hover card
                ├── context-menu.tsx # Context menu
                ├── sheet.tsx        # Slide-out panel lateral
                ├── drawer.tsx       # Drawer (vaul)
                ├── accordion.tsx    # Acordeón
                ├── collapsible.tsx  # Collapsible
                ├── avatar.tsx       # Avatar con imagen/fallback
                ├── badge.tsx        # Badge
                ├── skeleton.tsx     # Skeleton loader
                ├── separator.tsx    # Separador visual
                ├── progress.tsx     # Barra de progreso
                ├── command.tsx      # Command palette (cmdk)
                ├── navigation-menu.tsx # Menú de navegación
                ├── menubar.tsx      # Menu bar
                ├── breadcrumb.tsx   # Breadcrumb
                ├── pagination.tsx   # Paginación
                ├── carousel.tsx     # Carrusel (embla-carousel-react)
                ├── resizable.tsx    # Paneles redimensionables
                ├── scroll-area.tsx  # Área con scroll personalizado
                ├── toggle.tsx       # Toggle button
                ├── toggle-group.tsx # Grupo de toggles
                ├── alert.tsx        # Alerta
                ├── alert-dialog.tsx # Alert dialog
                ├── sonner.tsx       # Provider de sonner toasts
                ├── aspect-ratio.tsx # Contenedor con aspect ratio
                ├── label.tsx        # Label
                ├── utils.ts         # función cn()
                └── use-mobile.ts    # Hook useIsMobile() (breakpoint 768px)
```

---

## 4. Sistema de diseño y tema visual

### 4.1 Tema light (por defecto)

| Variable | Valor | Uso |
|---|---|---|
| `--background` | `#ffffff` | Fondo general |
| `--foreground` | `oklch(0.145 0 0)` (negro suave) | Texto principal |
| `--primary` | `#030213` (negro profundo) | Elementos primarios |
| `--primary-foreground` | blanco | Texto sobre primary |
| `--secondary` | `oklch(0.95 0.0058 264.53)` (gris muy claro azulado) | Fondo secundario |
| `--muted` | `#ececf0` | Fondo muted |
| `--muted-foreground` | `#717182` | Texto muted |
| `--accent` | `#e9ebef` | Fondo accent |
| `--destructive` | `#d4183d` (rojo) | Acciones destructivas |
| `--border` | `rgba(0,0,0,0.1)` | Bordes |
| `--input-background` | `#f3f3f5` | Fondo de inputs |
| `--ring` | `oklch(0.708 0 0)` | Focus ring |
| `--radius` | `0.625rem` (10px) | Border radius base |
| `--sidebar` | `oklch(0.985 0 0)` | Fondo de sidebar |
| `--chart-1` a `--chart-5` | Varios oklch | Colores de gráficos |

### 4.2 Tema dark (`.dark`)

Fondo negro (oklch 0.145), texto blanco (oklch 0.985), sidebar oscuro (oklch 0.205). Todos los colores se oscurecen proporcionalmente.

### 4.3 Tipografía

- Tamaño base: `16px`
- Fuente: no está definida explícitamente (usa la del navegador, `fonts.css` está vacío)
- Pesos: `--font-weight-medium: 500`, `--font-weight-normal: 400`
- Jerarquía:
  - `h1`: `text-2xl`, medium, line-height 1.5
  - `h2`: `text-xl`, medium, line-height 1.5
  - `h3`: `text-lg`, medium, line-height 1.5
  - `h4`: `text-base`, medium, line-height 1.5
  - `label`, `button`: `text-base`, medium
  - `input`: `text-base`, normal

### 4.4 Bordes y radios

- `--radius`: 10px
- `--radius-sm`: 6px
- `--radius-md`: 8px
- `--radius-lg`: 10px
- `--radius-xl`: 14px

---

## 5. Página de Login (`Login.tsx`)

### 5.1 Estructura visual

- **Fondo**: `bg-slate-50`, ocupa todo el viewport (`min-h-screen`)
- **Figuras decorativas de fondo**: 3 círculos con blur-3xl y opacidad 40%, posicionados absolutamente:
  - Superior izquierdo: `bg-blue-400`, `top-[-10%] left-[-10%]`, 384x384px
  - Superior derecho: `bg-emerald-400`, `top-[20%] right-[-10%]`, 384x384px
  - Inferior izquierdo: `bg-teal-300`, `bottom-[-20%] left-[20%]`, 384x384px
  - Mezcla: `mix-blend-multiply` (efecto de superposición de colores)
- **Card de login**: `max-w-md`, centrado, fondo blanco, `rounded-2xl`, `shadow-xl`, borde `border-slate-100`
- **Logo**: cuadrado de 64x64px con fondo `bg-blue-600`, icono `Package` blanco de 32px, `rounded-2xl`
- **Título**: "Control de Stock - Acceso", `text-2xl font-bold text-slate-800`
- **Subtítulo**: "Sistema integral con Active Directory", `text-slate-500 text-sm`

### 5.2 Formulario

- **Campo Usuario AD**: input text, placeholder `dominio\usuario`, borde `border-slate-300`, focus ring azul
- **Campo Contraseña**: input password, placeholder `••••••••`
- **Info box**: fondo `bg-blue-50`, icono `ShieldAlert`, texto: "Acceso permitido solo en días hábiles, de 8:00 a 18:00 hs."
- **Botón**: `bg-blue-600`, hover `bg-blue-700`, texto blanco, `rounded-lg`, `shadow-md shadow-blue-500/20`

### 5.3 Comportamiento actual (mock)

- Al hacer submit, **no valida credenciales**
- Llama a `navigate('/dashboard')` directamente (simula autenticación exitosa)
- No muestra errores (no hay manejo de estados de error)

---

## 6. Dashboard (`Dashboard.tsx`)

### 6.1 Layout general

Flex horizontal: sidebar (`w-64`) + contenido principal (`flex-1`).

### 6.2 Sidebar

| Elemento | Detalle |
|---|---|
| Fondo | `bg-slate-900` |
| Texto | `text-slate-300` |
| Branding | "StockControl AD" en `text-white font-bold text-lg`, con borde inferior `border-slate-800` |
| Items de navegación | 4 links hardcodeados (anchor `#`, sin routing real) |
| | 1. **Vista General de Stock** — activo: `bg-blue-600/10 text-blue-400 rounded-lg` |
| | 2. Gestión de Productos — hover: `bg-slate-800 hover:text-white` |
| | 3. Movimientos — idem |
| | 4. Reportes — idem |
| Iconos | `LayoutDashboard`, `PackageSearch`, `ArrowRightLeft`, `FileBarChart` (Lucide, 18px) |
| Pie de sidebar | Indicador "Sincronización AD:" con punto verde `bg-emerald-400` + "Conectado" |
| Comportamiento responsive | `hidden md:flex` — se oculta en mobile |

### 6.3 Header

| Elemento | Detalle |
|---|---|
| Fondo | `bg-white`, borde inferior `border-slate-200` |
| Altura | `h-16` |
| Indicador horario | Badge green/amber según hora del sistema (cliente-side): |
| | — `bg-emerald-50 text-emerald-700 border-emerald-200`: "Hora actual dentro del rango de acceso" |
| | — `bg-amber-50 text-amber-700 border-amber-200`: "Fuera del rango de acceso óptimo" |
| Icono | `Clock` (14px) |
| Botón notificaciones | `Bell` (20px), con punto rojo indicador `bg-red-500` |
| Perfil de usuario | Avatar: inicial del username en círculo `bg-blue-100 text-blue-600`, 32x32px |
| | Nombre: `currentUser.id` en `text-sm font-semibold text-slate-700` |
| | Rol: `currentUser.role` en `text-xs text-slate-500` |
| | Chevron: `ChevronDown` (16px) |

### 6.4 Dropdown de perfil (mock de cambio de usuario)

Aparece al hacer click en el perfil. Implementación inline (no usa `DropdownMenu` de shadcn):

- Header: "Cambiar Usuario" en `text-xs font-medium text-slate-500 uppercase tracking-wider`
- 3 usuarios mock:
  - `logistica.user` (Operador)
  - `gerencia.admin` (Admin)
  - `consulta.user` (Consulta)
- Item activo: `bg-blue-50 text-blue-700`
- Item inactivo: `text-slate-700 hover:bg-slate-50`
- Separador + botón "Cerrar Sesión": `text-red-600 hover:bg-red-50`, con icono `LogOut` (14px)

### 6.5 Contenido del Dashboard

#### Título de página
- "Vista General de Stock": `text-2xl font-bold text-slate-800`
- Subtítulo: "Resumen de inventario y movimientos recientes": `text-slate-500 text-sm`

#### Stats Cards (grid 4 columnas responsive)

Cada card:

| Propiedad | Valor |
|---|---|
| Fondo | `bg-white` |
| Borde | `rounded-xl border border-slate-200` |
| Padding | `p-5` |
| Sombra | `shadow-sm` |

Cards (datos hardcodeados):

| Título | Valor | Cambio | Color del cambio |
|---|---|---|---|
| Total Productos | 4,285 | +12% | `text-emerald-600` |
| Bajo Stock | 38 | -5% | `text-rose-600` |
| Movimientos Hoy | 156 | +24% | `text-emerald-600` |
| Valor Estimado | $245k | +2% | `text-emerald-600` |

#### Gráficos (grid 2 columnas en lg)

##### Productos más vendidos (BarChart — Recharts)

| Propiedad | Valor |
|---|---|
| Fondo card | `bg-white p-6 rounded-xl border border-slate-200 shadow-sm` |
| Título | "Productos más vendidos" — `text-lg font-semibold text-slate-800` |
| Altura | `h-72` (288px) |
| Tipo | `BarChart` con barras azules (`#3b82f6`), `radius={[4,4,0,0]}` |
| Grid | `CartesianGrid` vertical: false, stroke: `#e2e8f0` |
| Tooltip | fondo blanco, borde none, sombra, `borderRadius: 8px` |
| Data hardcodeada | Laptops: 120, Monitores: 85, Teclados: 150, Mouse: 180, Cables: 210 |

##### Movimientos semanales (LineChart — Recharts)

| Propiedad | Valor |
|---|---|
| Título | "Movimientos semanales" |
| Altura | `h-72` |
| Línea "entradas" | `#10b981` (verde esmeralda), strokeWidth 3, dot con borde blanco |
| Línea "salidas" | `#f43f5e` (rojo-rosa), strokeWidth 3, dot con borde blanco |
| Legend | iconType "circle", fontSize 12px |
| Data hardcodeada | Lun-Sáb: entradas (40,30,20,27,18) y salidas (24,13,38,39,48) |

##### Distribución por categoría (PieChart — Recharts)

| Propiedad | Valor |
|---|---|
| Layout | `lg:col-span-2`, flex row en desktop, column en mobile |
| Título | "Distribución de stock por categoría" |
| Tipo | Donut (Pie con `innerRadius=60`, `outerRadius=100`, `paddingAngle=5`) |
| Colores | `#3b82f6` (azul), `#10b981` (verde), `#f59e0b` (ámbar), `#6366f1` (índigo) |
| Leyenda custom | bullets de color + nombre + porcentaje calculado sobre 1200 |
| Data hardcodeada | Electrónica: 400 (33.3%), Accesorios: 300 (25%), Repuestos: 300 (25%), Insumos: 200 (16.7%) |

### 6.6 Comportamiento responsive

- **Sidebar**: se oculta en mobile (`hidden md:flex`)
- **Stats cards**: 1 columna en sm, 2 en md, 4 en md+
- **Gráficos**: 1 columna en mobile, 2 en lg (salvo el donut que ocupa 2 columnas en lg)
- Header: `gap-4 md:gap-6`, texto del perfil oculto en mobile (`hidden md:block`)

---

## 7. Componentes shadcn/ui disponibles (no utilizados aún en Login/Dashboard)

El proyecto incluye ~48 componentes shadcn/ui listos para usar. Los más relevantes para el desarrollo futuro:

| Componente | Ideal para |
|---|---|
| `Button` | Reemplazar `<button>` nativo de Login y header |
| `Card` | Reemplazar `<div>` de stats cards |
| `DropdownMenu` | Reemplazar dropdown inline del perfil |
| `Dialog` | Modales para crear/editar productos |
| `Form` | Formularios con validación (react-hook-form) |
| `Table` | Listado de productos y movimientos |
| `Chart` | Envoltorio estilizado de Recharts |
| `Skeleton` | Loaders mientras se cargan datos de la API |
| `Sonner` | Toasts de notificación |
| `Sidebar` | Sidebar completo con colapsado y submenús |
| `Tabs` | Navegación por pestañas |
| `Select` | Selector de categorías |
| `Badge` | Indicadores de estado |
| `AlertDialog` | Confirmación de acciones destructivas |
| `Sheet` | Panel lateral para formularios |
| `Tooltip` | Información adicional en hover |

---

## 8. Estado actual de la autenticación

| Aspecto | Estado |
|---|---|
| Login | Mock: navega a `/dashboard` sin validar nada |
| Token JWT | No existe |
| Auth context | No existe |
| Protección de rutas | No existe: `/dashboard` es accesible directamente |
| Roles | Mock: 3 usuarios hardcodeados en array local |
| Cambio de rol | Selector manual en dropdown (simula cambio de usuario) |
| Restricción horaria | Indicador visual cliente-side (no bloquea nada) |
| Cierre de sesión | Solo navega a `/` (no invalida nada) |

---

## 9. Datos mock vs. endpoints reales necesarios

| Dato en UI | Valor hardcodeado | Endpoint que debería consumir |
|---|---|---|
| Stats cards | `[{title, value, change}]` | `GET /api/dashboard/summary` |
| Bar chart | `[{name, ventas}]` | `GET /api/dashboard/top-products` |
| Line chart | `[{day, entradas, salidas}]` | `GET /api/dashboard/movements-weekly` |
| Pie chart | `[{name, value}]` | `GET /api/dashboard/category-distribution` |
| Usuarios | `[{id, role}]` | `POST /api/auth/login` + `GET /api/auth/me` |
| Roles y permisos | Sin lógica real | Decodificar del JWT |

---

## 10. Configuración de Vite

```ts
// vite.config.ts — plugins:
// 1. figmaAssetResolver()  → resuelve figma:asset/XXX (legado de Figma)
// 2. @vitejs/plugin-react  → React Fast Refresh
// 3. @tailwindcss/vite     → Tailwind CSS v4

// Alias: @ → ./src
// assetsInclude: SVG y CSV

// NO tiene:
// - server.proxy (para redirigir /api al backend)
// - variables de entorno (import.meta.env.VITE_API_URL)
```

---

## 11. Resumen del estado del proyecto

```
Infraestructura frontend:
  ✅ React + Vite + TypeScript funcionando
  ✅ Tailwind CSS v4 con tema light/dark
  ✅ 48 componentes shadcn/ui listos para usar
  ✅ Routing con React Router (2 rutas)
  ✅ Recharts para gráficos
  ❌ Sin conexión a backend
  ❌ Sin variables de entorno
  ❌ Sin proxy de Vite para API

Login:
  ✅ UI completa y responsiva
  ❌ No autentica realmente
  ❌ No muestra errores

Dashboard:
  ✅ Layout completo (sidebar + header + contenido)
  ✅ 4 gráficos con Recharts
  ✅ Stats cards
  ✅ Selector mock de usuarios/roles
  ❌ Todos los datos son hardcodeados
  ❌ Sin control de acceso por roles

Pantallas faltantes (no existen):
  ❌ Gestión de Productos
  ❌ Movimientos
  ❌ Reportes / Exportación
```
