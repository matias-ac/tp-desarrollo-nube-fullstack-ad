# Sistema de Gestión y Control de Stock — Integración con Active Directory

Este proyecto es el Trabajo Práctico Integrador y Final para la materia **Práctica Profesionalizante III: Desarrollo e Implementación de Sistemas en la Nube** (Tecnicatura Superior en Desarrollo de Software, IFTS 18).

El sistema consiste en una aplicación web que gestiona un inventario de productos y sus movimientos de stock, autenticando a los usuarios contra un servidor de **Active Directory (AD)** mediante LDAP y aplicando permisos granulares según la pertenencia a grupos de seguridad, respetando además restricciones horarias de acceso.

---

## Estructura del Proyecto

El repositorio está organizado de forma independiente para facilitar el desarrollo, mantenimiento y despliegue de cada componente:

*   **`backend/`**: API REST construida en Python con Flask. Utiliza `ldap3` para la conexión con el Active Directory, `pyjwt` para la gestión de sesiones y persistencia local en archivos JSON.
*   **`frontend/`**: Aplicación de cliente SPA construida con React, Vite, Tailwind CSS y componentes de Radix UI (estilo shadcn/ui).
*   **`docs/`**: Documentación técnica, transcripciones de clases, guías de preparación de la máquina virtual y análisis de requerimientos.

---

## Convención de Nombres para Ramas de Git (Branching Strategy)

Para mantener un historial de Git limpio, legible y ordenado durante el desarrollo de las distintas funcionalidades, correcciones y configuraciones, utilizaremos la siguiente convención para el nombre de las ramas:

### Formato General
```text
<tipo>/<alcance>-<descripción-corta>
```

Tanto el `<tipo>` como el `<alcance>` deben escribirse en minúsculas. La `<descripción-corta>` debe estar en minúsculas y las palabras separadas por guiones (kebab-case).

### 1. Tipos de Ramas (`<tipo>`)
Indica la naturaleza del cambio que se introduce en la rama:

*   **`feat/`**: Para el desarrollo de nuevas características o funcionalidades (ej. pantallas, endpoints, lógica de negocio).
*   **`fix/`**: Para la resolución de errores, bugs o problemas detectados en el código.
*   **`config/`**: Para tareas de configuración de entornos, instalación de dependencias, preparación de herramientas o cambios de infraestructura de desarrollo.
*   **`refactor/`**: Para modificaciones en la estructura del código que mejoran su legibilidad o diseño sin alterar su comportamiento externo.
*   **`docs/`**: Para la creación, edición o actualización de documentación, guías de usuario o comentarios.

### 2. Alcance del Cambio (`<alcance>`)
Indica qué sección del proyecto se ve afectada directamente por el cambio:

*   **`backend`**: Cambios que afectan únicamente al servidor Flask, servicios de persistencia o LDAP.
*   **`frontend`**: Cambios que afectan únicamente a la aplicación React, estilos, componentes o rutas del cliente.
*   **`global`**: Cambios que impactan a todo el repositorio de manera transversal (como archivos de configuración en la raíz, `.gitignore`, configuraciones globales del repositorio).
*   **`docs`**: Cambios dedicados a manuales, guías o análisis en la carpeta de documentación.

---

### Ejemplos de Uso Práctico

| Tipo de Tarea | Nombre de Rama Sugerido | Descripción |
| :--- | :--- | :--- |
| **Configuración inicial** | `config/global-gitignore-readme` | Configuración del `.gitignore` y el `README` global de la raíz. |
| **Configuración de entorno** | `config/backend-venv-dependencies` | Creación del entorno virtual e instalación de paquetes de Python. |
| **Estructura del código** | `refactor/backend-scaffolding` | Creación del esqueleto de carpetas del servidor Flask. |
| **Nueva funcionalidad** | `feat/backend-ldap-auth` | Desarrollo de la conexión y autenticación LDAP en el backend. |
| **Nueva pantalla** | `feat/frontend-login-page` | Implementación de la vista y lógica del login en React. |
| **Corrección de un bug** | `fix/backend-timezone-hours` | Corrección en la validación horaria de acceso en el login. |
| **Corrección visual** | `fix/frontend-sidebar-responsive` | Solución a un error de visualización del menú lateral en móviles. |
| **Documentación** | `docs/vm-setup-guide` | Redacción de los pasos de preparación de VirtualBox y Active Directory. |

---

## Cómo Ejecutar el Proyecto

*(Las instrucciones específicas de ejecución para el desarrollo y producción se completarán en esta sección a medida que avancemos en la implementación de cada módulo).*
