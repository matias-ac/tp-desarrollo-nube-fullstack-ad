# CONTEXTO DEL PROYECTO: TRABAJO PRÁCTICO INTEGRADOR

## 1. CONTEXTO ACADÉMICO Y DE LA MATERIA

* **Institución:** Instituto de Formación Técnico Superior N° 18 (IFTS 18) - Buenos Aires, Argentina.
* **Carrera:** Tecnicatura Superior en Desarrollo de Software (TSDS).
* **Materia:** Práctica Profesionalizante III: Desarrollo e Implementación de Sistemas en la Nube.
* **Docente:** Pablo Uñates.
* **Etapa:** Segundo Parcial (Trabajo Práctico Integrador y Final).

## 2. OBJETIVO GENERAL DEL PROYECTO

Desarrollar una aplicación web funcional conectada a una infraestructura de red local/híbrida que simule un escenario empresarial real. La aplicación debe validar la identidad de los usuarios directamente contra un servidor de **Active Directory (AD)** hospedado en una Máquina Virtual local y, en función de su pertenencia a grupos de seguridad, otorgar permisos granulares para un **Sistema de Gestión y Control de Stock**.

## 3. ENTORNO DE DESARROLLO E INFRAESTRUCTURA (CRÍTICO)

* **Sistema Operativo Host:** Arch Linux.
* **Hipervisor:** Oracle VirtualBox.
* **Sistema Operativo Invitado (Sistemas en la Nube):** Windows Server 2008 (elegido por su bajo consumo de recursos y compatibilidad).
* **Estructura del AD:** Unidad Organizativa (OU) raíz llamada `GCBA`. Usuarios preexistentes distribuidos en sub-OUs (como `Gerencia`, `RecursosHumanos`, `SoporteTecnico`) y asignados a Grupos Globales de Seguridad específicos (ej. `GG_Gerencia`, `GG_RRHH`, `GG_Soporte`).
* **Puertos e Interconexión:** Conexión mediante protocolo LDAP (Puerto estándar `389` o LDAPS seguro `636`). 
  * *Nota de conectividad:* Al estar el backend corriendo nativamente en el host (Arch Linux) o en un contenedor local, se requiere prestar especial atención a la configuración de red de VirtualBox (ej. uso de Adaptador Puente / Bridged Adapter o Red Interna con reenvío de puertos) para permitir que Linux acceda al servicio LDAP de la MV de Windows Server 2008.
* **Política de Registro:** **No existe el autoregistro de usuarios desde la web.** Los usuarios son administrados y activados exclusivamente de forma interna en el Active Directory de la MV.

## 4. ARCHITECTURA DEL SOFTWARE

* **Backend:** Python.
    * **Manejo de LDAP:** Uso de librerías como `ldap3` o `pyldap` para realizar el *bind* de autenticación y la lectura de atributos/grupos del usuario en el AD.
    * **Persistencia:** Base de datos relacional para el almacenamiento de productos, categorías y logs de movimientos de stock.
* **Frontend:** React (u otra solución web moderna optimizada). El diseño debe estructurarse usando layouts limpios, modernos y componentes listos para producción para agilizar la entrega.

## 5. REQUERIMIENTOS FUNCIONALES Y LÓGICA DE NEGOCIO

### A. Autenticación y Control de Acceso Horario

* **Flujo de Login:** El usuario ingresa sus credenciales (`sAMAccountName` o `UserPrincipalName` y contraseña). El backend realiza la consulta contra el servidor LDAP de la máquina virtual.
* **Restricción Horaria de Acceso:** La aplicación debe validar la hora del sistema en el momento del login. **Solo se permite el acceso en el rango horario de 08:00 a 18:00 hs.** Intentos de login fuera de este rango deben ser rechazados explícitamente por el backend informando la restricción al usuario en el frontend.

### B. Gestión de Roles y Permisos (Mapeo de Grupos AD)

Una vez autenticado exitosamente y validado el horario, el backend debe leer los grupos de seguridad a los que pertenece el usuario dentro del Active Directory para determinar su rol dentro del sistema de stock. Se deben contemplar 3 niveles de acceso:
1.  **Administrador (Admin):**
    * Acceso total y sin restricciones al sistema.
    * Permisos para: Visualizar dashboards, crear/modificar/eliminar productos, registrar movimientos de stock, realizar copias/backups de los datos y exportar información.
2.  **Operador:**
    * Acceso intermedio enfocado en la gestión operativa.
    * Permisos para: Visualizar el stock y **registrar de forma obligatoria movimientos de stock** (ingresos, egresos, ajustes).
    * *Restricción:* No puede eliminar productos ni realizar tareas administrativas complejas.
3.  **Consulta:**
    * Acceso de lectura únicamente.
    * Permisos para: Visualizar dashboards, buscar productos y consultar reportes.
    * *Restricción:* Todos los botones de creación, edición, eliminación o registro de movimientos deben estar deshabilitados o ausentes en la interfaz para este rol.

### C. Funcionalidades del Sistema de Stock

* **Dashboard Visual:** Vista general con métricas e indicadores de stock.
* **Administración de Productos:** CRUD básico de ítems (Nombre, Categoría, Stock Actual, Alertas de Stock Mínimo).
* **Registro de Movimientos:** Historial auditable donde se asiente el tipo de movimiento, cantidad, fecha/hora y el usuario que lo realizó.
* **Exportación de Información:** El sistema debe contar con un módulo para generar reportes descargables en formato `.csv`, priorizando la exportación de la sábana de movimientos o el estado actual del inventario.

## 6. ENTREGABLES REQUERIDOS PARA LA EVALUACIÓN

Para la aprobación del trabajo práctico, se exige la demostración en vivo del sistema corriendo y la entrega de documentación técnica con capturas de pantalla explícitas de los siguientes flujos operacionales:
1.  **Código fuente completo** estructurado bajo buenas prácticas de seguridad (manejo de variables de entorno para IPs y credenciales del AD).
2.  **Captura del formulario de Login** funcionando.
3.  **Capturas del Dashboard adaptado según el rol:** Demostración exacta de cómo se visualiza el sistema una vez logueado para cada uno de los 3 perfiles creados en el AD de la OU GCBA (Admin, Operador y Consulta), evidenciando los permisos habilitados y deshabilitados correspondientes.
