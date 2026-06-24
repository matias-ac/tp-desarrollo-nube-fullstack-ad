# Guía: Preparar la VM para conexión LDAP desde el backend Flask

> **Entorno:** Arch Linux (host) · Oracle VirtualBox 7.2.8 · Windows Server 2008 (guest)
> **Objetivo:** Dejar la VM lista para que el backend Python/Flask se conecte por LDAP

---

## Parte 1 — Configurar la red de VirtualBox

Este es el paso más crítico. La solución depende de si usás WiFi o cable en el host.

> **Nota para el docente:** La forma "directa" descripta en el TP es usar Bridged Adapter, que le da a la VM una IP en la red local. Sin embargo, en Linux con conexión WiFi, los adaptadores inalámbricos generalmente no soportan el modo promiscuo que requiere Bridged Adapter, por lo que la VM no puede obtener una IP del router. La solución equivalente es NAT con reenvío de puertos (port forwarding), que logra exactamente el mismo resultado: el backend se conecta al AD por LDAP y autentica usuarios. La única diferencia es que en lugar de conectarse a la IP de la VM directamente, se conecta a `127.0.0.1:3389` en el host, y VirtualBox redirige ese tráfico internamente al puerto 389 de la VM.

### Usar NAT con Port Forwarding (solución para WiFi en Linux)

1. Apagá la VM si está encendida
2. En VirtualBox, seleccioná la VM → **Settings → Network**
3. En **Adapter 1**, asegurate que esté en **NAT**
4. Hacé clic en **Advanced** para expandir opciones
5. Clic en **Port Forwarding**
6. Agregá esta regla con el ícono `+`:

| Campo | Valor |
|-------|-------|
| Name | LDAP |
| Protocol | TCP |
| Host IP | *(dejar vacío)* |
| Host Port | 3389 |
| Guest IP | *(dejar vacío)* |
| Guest Port | 389 |

> **Por qué el puerto 3389 y no el 389:** En Linux, redirigir puertos por debajo de 1024 requiere permisos de root. El puerto 3389 (normalmente usado por RDP) no tiene esa restricción y funciona sin configuración adicional. VirtualBox se encarga de mapear 3389 del host → 389 de la VM transparentemente.

7. **OK → OK**
8. Iniciá la VM

**Verificar que funcionó** desde Arch Linux:
```bash
python3 -c "import socket; s=socket.create_connection(('127.0.0.1', 3389), timeout=3); print('LDAP OK'); s.close()"
```
Si imprime `LDAP OK` → la conexión está funcionando correctamente.

---

## Parte 2 — Verificar que el servicio LDAP está activo en la VM

Active Directory Domain Services **incluye LDAP por defecto** — no hay que instalarlo por separado. Para confirmarlo, en CMD de la VM ejecutá:

```cmd
netstat -an > C:\ldap.txt
notepad C:\ldap.txt
```

Buscá estas dos líneas (ambas deben estar presentes):
```
TCP    0.0.0.0:389    0.0.0.0:0    LISTENING
TCP    [::]:389       [::]:0       LISTENING
```
La primera es IPv4, la segunda IPv6. Con ambas confirmadas, el servicio LDAP está activo.

---

## Parte 3 — Habilitar LDAP en el Firewall de Windows

El firewall puede bloquear el puerto 389. Para abrirlo, en CMD de la VM como Administrador:

```cmd
netsh advfirewall firewall add rule name="LDAP Backend" protocol=TCP dir=in localport=389 action=allow
```

Si el comando se ejecuta sin errores, la regla quedó creada.

---

## Parte 4 — Solucionar problemas con GPOs antes de usar CMD

> **Nota:** Si configuraste GPOs que bloquean CMD (como "Bloqueo CMD y Regedit"), el Administrador puede quedar sin acceso a la terminal. Esto se soluciona eliminando la GPO o aplicando un Security Filter para excluir a Administrator.

**Para excluir a Administrator de una GPO sin eliminarla:**
1. **Start → Administrative Tools → Group Policy Management**
2. Clic sobre la GPO problemática
3. Pestaña **Scope → Security Filtering**
4. Clic en **Add** → escribí `Administrator` → OK
5. Seleccioná **Authenticated Users** → **Remove**

Si aun así CMD no abre (la GPO sigue aplicando antes del gpupdate), la solución más rápida es eliminar la GPO temporalmente, abrir CMD, y recrearla después si es necesario.

---

## Parte 5 — Crear la cuenta de servicio para el backend

El backend necesita una cuenta para buscar usuarios en el AD antes de validar sus credenciales.

### Opción A: Usar Administrator (para desarrollo — recomendado para el TP)

No hay nada que configurar. El docente mencionó que esta opción es válida para desarrollar.

```env
AD_ADMIN_DN=CN=Administrator,CN=Users,DC=IFTS,DC=LOCAL
AD_ADMIN_PASSWORD=tu_password_de_administrator
```

### Opción B: Crear cuenta de servicio dedicada (buena práctica)

1. En la VM, **Active Directory Users and Computers**
2. Carpeta **Users** (dentro de `IFTS.LOCAL`, no dentro de GCBA)
3. Clic derecho → **New → User**
4. **User logon name:** `svc_backend`
5. Next → contraseña segura → marcar:
   - ✅ **User cannot change password**
   - ✅ **Password never expires**
6. Finish

```env
AD_ADMIN_DN=CN=svc_backend,CN=Users,DC=IFTS,DC=LOCAL
AD_ADMIN_PASSWORD=la_password_que_pusiste
```

---

## Parte 6 — `.env` final del backend

```env
AD_SERVER=127.0.0.1
AD_PORT=3389
AD_USE_SSL=False
AD_BASE_DN=DC=IFTS,DC=LOCAL

AD_ADMIN_DN=CN=Administrator,CN=Users,DC=IFTS,DC=LOCAL
AD_ADMIN_PASSWORD=tu_password

AD_MAP_ADMIN=GG_Gerencia
AD_MAP_OPERADOR=GG_Soporte
AD_MAP_CONSULTA=GG_RRHH
```

> **Recordá:** `AD_SERVER=127.0.0.1` y `AD_PORT=3389` porque usamos NAT con port forwarding. VirtualBox redirige ese tráfico al puerto 389 de la VM automáticamente.

---

## Parte 7 — Verificación final desde Arch Linux

```bash
python3 -c "import socket; s=socket.create_connection(('127.0.0.1', 3389), timeout=3); print('LDAP OK'); s.close()"
```

Si imprime `LDAP OK` → todo está listo para arrancar con el código del backend.

---

## Resumen de verificación

| Paso | Qué verificar | Cómo saberlo |
|------|--------------|--------------|
| Port forwarding | VirtualBox redirige 3389 → 389 | Comando Python imprime `LDAP OK` |
| Servicio LDAP | Puerto 389 escuchando en la VM | `netstat` muestra `0.0.0.0:389 LISTENING` |
| Firewall | Puerto 389 permitido | Regla creada con `netsh` |
| Credenciales | Cuenta de servicio lista | Administrator o svc_backend configurado |
