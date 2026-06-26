
# Frontend — Sistema de Gestión y Control de Stock

SPA construida con **React 18 + Vite + TypeScript + Tailwind CSS 4 + Radix UI (shadcn/ui)**.

## Requisitos

- Node.js 18+ y npm

## Instalación y Ejecución

```bash
npm install
npm run dev       # Servidor de desarrollo → http://localhost:5173
npm run build     # Build de producción → dist/
```

## Configuración

Crear `frontend/.env` (ver `.env.example`):

```
VITE_API_BASE_URL=http://localhost:5000/api
```

El `vite.config.ts` incluye un proxy que redirige `/api/*` al backend en `localhost:5000`.

