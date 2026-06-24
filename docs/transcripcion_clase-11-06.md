7:367 minutos y 36 segundosBuenas noches. ¿Cómo están todos?
7:457 minutos y 45 segundosProfe, bien, bien. Bueno, buenas, buenas.
7:497 minutos y 49 segundosVamos arrancando. Les voy a hacer un repaso de el tema que les había dejado ayer, que era el tema este delap.
8:028 minutos y 2 segundosva a ir encaminando con lo que va a ser el eh segundo parcial, que va a ser un trabajo práctico integrador. Igual ahora
8:098 minutos y 9 segundosterminamos de hacer esto y bueno, les voy comentando un poquito más de cómo es y bueno, eh dónde ya lo tienen disponible.
8:278 minutos y 27 segundosBueno, configuración del Actory con lo que va a ser una conexión web. Nosotros estuvimos armando las clases pasadas eh
8:358 minutos y 35 segundosviendo un poquitito de Python con Flask y bueno, vimos que también nos permitió hacer unas integraciones con Shinja 2, donde se pueden usar templates para que podamos armar nuestra página web.
8:488 minutos y 48 segundosBueno, eh ahora eh lo que vamos a ver es este protocolo EDAP, que lo que nos va a permitir va a ser conectar nuestra
8:548 minutos y 54 segundospágina web con nuestro Active Directory, ese Act directory que configuramos a principio de la cursada.
9:039 minutos y 3 segundosBueno, ¿qué es el EDAP? LWET Directory Access Protocol es un protocolo para acceder y mantener servicios de directorio distribuidos sobre una red IP.
9:149 minutos y 14 segundosCaracterísticas: protocolo ligero basado en modelo de cliente servidor, ideal para autenticación.
9:209 minutos y 20 segundosUtiliza una estructura jerárquica similar a un árbol.
9:259 minutos y 25 segundosBueno, un poquito de los orígenes de este protocolo. Eh, surge un protocolo muy viejo allá por el 90 que era el X500.
9:329 minutos y 32 segundosEste protocolo también se usaba en la parte de redes para conectar lo que son los eh los routers.
9:399 minutos y 39 segundosEh, no está más en uso, no es un estándar, pero bueno, surge eh para que tengan un poco de idea, surge de ahí.
9:469 minutos y 46 segundosEh, desarrollado la Universidad de Michigan. Investigadores eh crearon el EDAP en los 90 para usar TCPIP y facilitar la adopción de entornos académicos y empresariales.
9:589 minutos y 58 segundosAdopción y evolución. El EDAP se convirtió en estándar, de facto, gestionando directorios y sigue vigente por su estandarización.
10:0910 minutos y 9 segundos¿Qué es un servicio directorio? Bueno, es una base de datos especializada que almacen información sobre usuarios, dispositivos, redes. Bueno, esto es un
10:1710 minutos y 17 segundospoquito más de volver a la definición de Active Directory, ¿no? ¿Qué es lo que nos va a englobar el Active Directory?
10:2810 minutos y 28 segundosBueno, vamos un poco a puntualmente qué va a ser lo que nos va a requerir, lo que va a pedir este LDAP para que para
10:3610 minutos y 36 segundosque funcione, ¿no? Para que funcione esta conexión. Bueno, va a tener estos acrónimos DN, distinguing name o unidad
10:4410 minutos y 44 segundosorganizativa. Eso ya lo eh lo vimos, lo gestionamos eh cuando hicimos un par de prácticas al comienzo de la cursada.
10:5210 minutos y 52 segundoscommon name y el domain component. Bueno, abajo hay un ejemplo de eh los valores que puede
11:0011 minutosadquirir y bueno, a qué hace referencia a cada cosa, ¿no? Eh, por ejemplo, ¿no?
11:0411 minutos y 4 segundosEl más puntual de eh DC de domain component vendría a ser el ITFS.18, que es el dominio punto local que queramos
11:1211 minutos y 12 segundosnosotros. Bueno, en lugar de DC de.com va a ser local.
11:2011 minutos y 20 segundosBueno, un poquito de cómo se configuraría eh instalar, bueno, el ACT directory, crear los usuarios, grupos, que es lo que necesitamos para trabajar, ¿no?
11:3011 minutos y 30 segundosDatos necesarios para la conexión, dirección IP con el nombre del servidor AD. Esto se es importante. Tema de puertos.
11:3811 minutos y 38 segundosEh, ustedes para probar eh pueden hacerlo simplemente por el puerto 389 para ver si realmente se le realiza una conexión o no.
11:4811 minutos y 48 segundoseh se lo va a pedir en esta cadena de conexión que van a usar para conectar este protocolo con el AD. Eh, pero bueno, les recomiendo que para
11:5811 minutos y 58 segundosprofesionalizar un poco el laburo y bueno, y e mantener un poco
12:0712 minutos y 7 segundoseh una estandarización, si pueden usen el puerto 636.
12:1412 minutos y 14 segundosPerdón, ahí me activó.
12:1812 minutos y 18 segundosAhí va a ver. Ahí está. Ahí me había activado una funcionalidad que no pedí.
12:2412 minutos y 24 segundosEh, que uso en el puerto 36 eh 636. Eh, ¿qué diferencia hay entre el LDAP y el
12:3012 minutos y 30 segundosLDAP? S. Eh, la conexión. En uno vamos a tener una conexión que va a ser por texto plano y en otro vamos a tener una
12:3812 minutos y 38 segundosconexión que eh va a estar eh codificada, va a estar cifrada.
12:4512 minutos y 45 segundosEh, ¿a qué se debe esto? Bueno, si ustedes van a hacer un tipo de
12:5212 minutos y 52 segundosintegración para una empresa, todo lo que va a ser conexiones, obviamente va a tener que ser, no va a
13:0013 minutostener que ser visible desde afuera, o sea, van a tener que impedir también que se pueda filtrar información o que eh los puedan atacar. Bueno, eh la idea de
13:0913 minutos y 9 segundosesto es que al hacer una conexión cifrada no se vean ni las credenciales ni los comandos que están interactuando con
13:1713 minutos y 17 segundosel AD, ¿no? Que mediante este protocolo no se vea esa información.
13:2313 minutos y 23 segundosEh, bueno, otra de las cosas, bueno, el DN, eh, bueno, obviamente vamos a necesitar un permiso, un usuario con permisos, eh,
13:3313 minutos y 33 segundosbueno, que esos usuarios tengan contraseña.
13:3713 minutos y 37 segundosAcá, bueno, eh, les pongo un ejemplo de cómo eh integrarían este protocolo Ledap
13:4413 minutos y 44 segundoscon lo que es eh Python. Eh, yo les sugiero usar el protocolo LD Lap 3, ya van por el LDAP 5, eh,
13:5413 minutos y 54 segundosporque eh es un protocolo más base y les va a pedir menos eh validaciones o eh
14:0214 minutos y 2 segundosmenos campos de configuración. Eh, como es uno de los primeros protocolos, eh requiere menos parámetros. Eh, la
14:1014 minutos y 10 segundosconexión la van a poder hacer igual el día de mañana que ustedes tengan que hacer algo similar en una empresa, hacer una conexión de este tipo en una empresa, eh va a ser exactamente lo
14:1914 minutos y 19 segundosmismo. O sea, pueden usar tranquilamente este protocolo eh salvo que les pidan alinearse a un protocolo más nuevo y bueno, eh, pero bueno, pueden usarlo
14:2814 minutos y 28 segundospara tanto para probar como para hacer la implementación.
14:3314 minutos y 33 segundosEh, bueno, parámetros que le va a pedir, servidor, nombre de servidor y bueno, la parte de conexión que va a ser eh lo que ustedes
14:4214 minutos y 42 segundoseh seguramente ya trabajaron eh cuando hicieron algún TP de
14:5014 minutos y 50 segundosbackend, el tema de un stream connection, bueno, a través de qué protocolo, bueno, yo me quiero conectar a este servidor con este usuario, con
14:5714 minutos y 57 segundosesta contraseña y que haga la conexión eh de manera automática. Bueno, esto es lo básico. Después, bueno, van a tener
15:0515 minutos y 5 segundosque trabajar un poquito para ajustar algunas cositas, pero este va a ser el stream connection básico que van a tener para hacer la conexión con el AD.
15:1615 minutos y 16 segundosPerdón, una cosa que no les había comentado es que si bien este es el protocolo el EDAP 3 es un protocolo más
15:2315 minutos y 23 segundosviejo, eh nosotros vamos a hacer esta conexión con eh nuestra máquina eh virtual que es
15:3215 minutos y 32 segundoslocal, que eh tiene configurado Active Directory, pero si ustedes el día de mañana tienen que hacer una conexión de
15:4015 minutos y 40 segundoseste tipo a una máquina que está en la nube eh o hacer una conexión eh puntual actualmente, ya que este protocolo es
15:4715 minutos y 47 segundospuntual de Microsoft con unad que es la evolución de de este AFT Directory que
15:5315 minutos y 53 segundosconfiguramos nosotros, que es eh llevar ese Act directory todo integrado directamente en la nube con un montón de de integraciones más de Microsoft. Eh,
16:0216 minutos y 2 segundosla única diferencia que van a tener en el uso de este protocolo va a ser eh donde van a apuntar el servidor. En lugar de ir el nombre del servidor a un
16:1016 minutos y 10 segundosIP, va a ir nada más que la URL a dónde va direccionado. O sea, para que se una idea de que eh esto es un poquito más
16:1816 minutos y 18 segundosviejo. Eh, va a ser un poco más fácil que hacer una conexión con un sistema mucho más nuevo, pero es el mismo protocolo, le va a pedir exactamente lo
16:2616 minutos y 26 segundosmismo y lo único que le va a variar es a dónde va a apuntar. que en lugar de apuntar eh a una base local, va a apuntar un sitio en la nube. En lugar de
16:3416 minutos y 34 segundosponer eh un IP local o un nombre local de servidor, va a ir a una URL.
16:4316 minutos y 43 segundosPerdón, ahí se siguen sumando.
16:5616 minutos y 56 segundosBueno, autenticación web con led usuario ingresa las credenciales. Esto viene a ser una suerte de flujo.
17:0317 minutos y 3 segundosEl app se conecta con el servidor Ledap.
17:0517 minutos y 5 segundosSe valido usuario de contraseña. Si es válido, permite el acceso.
17:1117 minutos y 11 segundosBueno, usar la conexión cifrada como buenas prácticas, limitar los usuarios con acceso en las búsquedas, validar la entrada de los usuarios para evitar
17:1917 minutos y 19 segundosinyecciones. Bueno, esto de las inyecciones se los había comentado eh un par de clases anteriores donde ustedes ingresan usuario,
17:2717 minutos y 27 segundoscontraseña, en general van a tener que tener eh cautela con eso de eh no permitir que ingresen por ahí eh
17:3517 minutos y 35 segundoscaracteres especiales o que eh limiten la cantidad de caracteres que van a ingresar en cada uno. Eh, son validaciones básicas. Eh, a veces se hacen, a veces no, por tema de tiempos.
17:4617 minutos y 46 segundosEh, ¿qué puede pasar con esto? que básicamente eh ingresen eh donde va el usuario eh user igual a true y termina
17:5617 minutos y 56 segundosimpactando en una sentencia de su código, ya que es un campo que está ingresando dentro de eh dentro de un algoritmo y directamente
18:0518 minutos y 5 segundostengan acceso con eso y bueno, puedan romper todo. Eh mismo desde ese campo de usuario de contraseña pueden ingresar hasta una base de datos.
18:1518 minutos y 15 segundosEh, por eso, bueno, de nuevo, eh, por ahí tomarse el tiempo o eh buscar por ahí eh fragmento de código con eh que
18:2518 minutos y 25 segundosnos ayuden a hacer validaciones eh para que bueno, no ingresen cualquier cosa y no sea tan permeable nuestro desarrollo.
18:3718 minutos y 37 segundosBueno, en resumen, el EDAP permite una autenticación centralizada.
18:4218 minutos y 42 segundosAPT directo lo informa lo implementa de forma robusta.
18:4618 minutos y 46 segundosLas aplicaciones web pueden conectarse fácilmente con bibliotecas como el edap 3 en Python. De nuevo, yo le sugiero usar Ledap 3 porque es la más amigable y
18:5418 minutos y 54 segundoses la que le va a pedir le va le va a pedir menos parámetros. Eh, si quieren pueden usar LDAP 5 o la que se les ocurre.
19:0319 minutos y 3 segundosLes recomiendo este porque eh es más básico y les va a resultar un poco más fácil de trabajar.
19:1119 minutos y 11 segundosBueno, eso es en general. lo que les había pasado la la clase pasada, la clase del miércoles.
19:2319 minutos y 23 segundosLes voy a compartir ahora eh un videíto.
19:3219 minutos y 32 segundosAhí estamos. Bueno, explica un poquito más también eh de cómo es esto de del Ledap, si por ahí les quedó alguna duda
19:4019 minutos y 40 segundoso eh por ahí les puedo llevar para reforzar un poquito el tema de la eh de cómo de cómo sería.
19:5519 minutos y 55 segundosAhí les pido que me avisen si se escucha. ¿Qué es LDAP?
20:0120 minutos y 1 segundoLDAP o Lory Access Protocol es un protocolo de red utilizado para acceder y gestionar información de directorios.
20:0920 minutos y 9 segundosLDAP es una herramienta que permite a los administradores de sistemas almacenar, organizar y recuperar información de forma eficiente.
20:1820 minutos y 18 segundosFuncionamiento básico de LDAP, esquema, objetos y atributos.
20:2320 minutos y 23 segundosLDAP utiliza un esquema para definir la estructura y los atributos de los objetos que se almacenan en el directorio. Los objetos que pueden
20:3220 minutos y 32 segundosrepresentar usuarios, grupos, dispositivos o cualquier otra cosa se organizan en una estructura de árbol jerárquica y se identifican mediante un
20:4020 minutos y 40 segundosdistinguished name DN. Cada objeto puede contener una serie de atributos que son para esclave valor que contienen
20:4720 minutos y 47 segundosinformación sobre el objeto. Protocolos y mecanismos de autenticación soportados por LDAP.
20:5420 minutos y 54 segundosLDAP es compatible con varios protocolos y mecanismos de autenticación, lo que lo hace muy flexible y adaptable a diferentes entornos.
21:0321 minutos y 3 segundosAlgunos de los protocolos y mecanismos más comunes incluyen el cifrado SSL/al TLS, el protocolo SASL y el mecanismo Kerveros.
21:1321 minutos y 13 segundosIntegración de LDAP con otros sistemas y aplicaciones.
21:1821 minutos y 18 segundosLDAP es ampliamente utilizado para integrar sistemas y aplicaciones, lo que permite a los usuarios acceder a diferentes recursos con una única identidad y contraseña.
21:2821 minutos y 28 segundosPor ejemplo, LDAP se puede utilizar para integrar aplicaciones de correo electrónico, sistemas de autenticación y
21:3521 minutos y 35 segundosautorización y sistemas de gestión de identidades, casos de uso y ejemplos de implementación de LDAP.
21:4221 minutos y 42 segundosLDAP se utiliza en una gran variedad de entornos y casos de uso, desde empresas y organizaciones gubernamentales hasta
21:5021 minutos y 50 segundosuniversidades y proveedores de servicios en la nube. Algunos ejemplos de implementación de LDAP incluyen la gestión de usuarios y grupos, la
21:5821 minutos y 58 segundosintegración de aplicaciones, la autenticación y autorización en sistemas y servicios y la gestión de dispositivos.
22:0622 minutos y 6 segundosEn conclusión, LDAP es una herramienta muy útil para gestionar información de directorios en entornos de red. Con su
22:1322 minutos y 13 segundoscapacidad de integración con otros sistemas y aplicaciones y su soporte para diferentes protocolos y mecanismos de autenticación, LDAP se ha convertido
22:2222 minutos y 22 segundosen una parte esencial de la infraestructura, de muchos sistemas y organizaciones. ¿Quieres seguir aprendiendo?
22:3222 minutos y 32 segundosBueno, ahí es un poquito lo que les venía comentando. Eh, bueno, tien les quería mostrar un par de salvedades, por así decirlo.
22:4122 minutos y 41 segundosEh, hay una parte acá que menciona eh querveros. Eh, bueno, nosotros estuvimos viendo el tema de lo que era Docker,
22:5022 minutos y 50 segundoseste tema de armar un contenedor con eh nuestra aplicación web o para desarrollar o para tener directamente la
22:5822 minutos y 58 segundosaplicación armada dentro de de este contenedor. Eh, vimos que también podían interactuar estos contenedores si
23:0623 minutos y 6 segundosnosotros los configuramos correctamente para que se vean entre sí.
23:1023 minutos y 10 segundosEh, básicamente Kerveros eh está apuntado lo que es eh Unix Linux y lo que nos va a permitir es eh poder hacer
23:1923 minutos y 19 segundoslas validaciones que vamos a requerir, validaciones respecto de la conexión de usua,
23:2723 minutos y 27 segundosa eso es lo que me refiero. Ustedes pueden usar el protocolo de EDAP, les va a funcionar dentro de de Docker si ustedes el día de mañana quieren
23:3423 minutos y 34 segundosincursionar con eso, pero van a requerir que eh esté configurado el Carveros.
23:4023 minutos y 40 segundosse los comento porque bueno, acá lo nombra y bueno, para que tengan una idea de que no es algo eh no es algo misterioso, sino que es el sistema que
23:4823 minutos y 48 segundosva a usar eh las versiones de Linux para validar más allá de que se puede usar el color que contienen información sobre
24:0024 minutoseh otra cosita más, el tema de que eh también les comenta eh que ustedes eh van a poder eh hacer la
24:1024 minutos y 10 segundosautenticación a nivel usuario, pero que eh les va a permitir gestionar todo lo que ustedes tengan cargado en el AD. O
24:1824 minutos y 18 segundossea, esto es nada más que para que ustedes se puedan conectar en el AD y una vez que eh tengan los permisos que tienen que tener, pueden gestionar altas
24:2524 minutos y 25 segundosbaja, consultar por equipos en particular, eh pueden manejar todo lo que tienen en la AD, obviamente con los
24:3224 minutos y 32 segundospermisos adecuados, pero eh al ya configurar este protocolo eh pueden tener disponible toda la información de
24:4024 minutos y 40 segundosde la D y bueno, la pueden manejar a su gusto.
24:4724 minutos y 47 segundosEsto es eh un protocolo que bueno, de nuevo les permite hacer una conexión con un sistema centralizado y bueno, eh pueden
24:5624 minutos y 56 segundosjugar ahí con un par de atributos, como por ejemplo la U en la que está, si va a tener determinados permisos o no, dependiendo de qué U está, van a poder
25:0525 minutos y 5 segundosvalidar de que eh esté correctamente las eh las credenciales.
25:1125 minutos y 11 segundosEh, bueno, van a tener un montón de cositas para poder ir jugando con esto.
25:1725 minutos y 17 segundosEh, se los doy porque en realidad esto se usa. Eh, la idea es que puedan aprovechar estos sistemas que ya están integrados.
25:2625 minutos y 26 segundosEh, si ustedes tienen tienen que realizar un tienen que hacer un desarrollo por eh un pedido de recursos
25:3425 minutos y 34 segundoshumanos que nos dicen, "No, necesitamos un software que nos liste los usuarios y
25:4025 minutos y 40 segundosbueno, nos nos diga eh los números de teléfono." Bueno, eh primero tiene que estar cargado en el AD, ¿no? Obviamente
25:4825 minutos y 48 segundosque no va a generar información, eh, pero simplemente lo que vamos a hacer nosotros va a ser desarrollar con la
25:5525 minutos y 55 segundosaplicación que tengamos, con el, eh, con la herramienta de desarrollo que tengamos o que nos guste o o que use la
26:0126 minutos y 1 segundoempresa, no sé, un sisar, un Python, el lenguaje que quieran, eh, una integración con el AC directory
26:0926 minutos y 9 segundosy simplemente hacer estas consultas, ¿no? traer esta información y bueno, dependiendo si nos piden un poquito más,
26:1626 minutos y 16 segundoseh, hasta poder cargar esta información, ¿no? Poder exportarla e importarla. Lo mismo con los dispositivos móviles.
26:2326 minutos y 23 segundosEh, recuerden que eh la tienen cargado, hablo de dispositivos, no van a ser solo notebooks.
26:3226 minutos y 32 segundosles comentaba que también podían ser impresoras, tablet, todo lo que yo lo eh lo que necesite que esté
26:3926 minutos y 39 segundoseh que esté unido al dominio, que pueda consumir o que esté eh que pueda consumir recursos del dominio
26:4626 minutos y 46 segundoso que se conecta al dominio, eh va a estar en la parte de dispositivos. No son solo notebooks, de vuelta, pueden ser tablet, pueden ser equipos de
26:5426 minutos y 54 segundosteleconferencia. En general, cada vez se usa menos, pero eh de nuevo, pueden ser equipos de teleconferencia, pueden ser
27:0127 minutos y 1 segundoeh simplemente impresoras. Bueno, eh quiero saber cuántos de estos dispositivos tengo y bueno, puedo tener directamente un U que diga, no sé,
27:0827 minutos y 8 segundosimpresora, su equipo de teleconferencia o que tenga, por ejemplo, eh lo que son eh salas donde tengo un determinado
27:1627 minutos y 16 segundosequipamiento. Eh, de nuevo, les pongo el ejemplo de teleconferencia porque eh se usaba este tema de eh tener salas con
27:2427 minutos y 24 segundosequipos de teleconferencia para tener eh charlas grupales y eso.
27:3027 minutos y 30 segundosBueno, todo eso al estar integrado con el AD, nosotros lo podemos consultar, va a estar disponible y bueno, les va a ahorrar un montón de trabajo porque no
27:3727 minutos y 37 segundosvan a tener no van a estar no van a tener que armar una base de datos, eh validar que toda esa
27:4427 minutos y 44 segundosinformación esté correcta, que esté actualizada, eh que
27:5327 minutos y 53 segundoseh, ¿cómo es? Perdón, que está actualizada. eh no lo van a tener que hacer por afuera, simplemente van a eh
28:0128 minutos y 1 segundousar esta herramienta de centralización eh con una opción para que simplemente
28:0728 minutos y 7 segundosse conecten y puedan editar o hacer lo que lo que necesitan. no van a tener que hacerlo por afuera, no van a tener que relevarlo para afuera. Teniendo esto, en
28:1728 minutos y 17 segundosgeneral, eh todas las empresas optan por eh tener estos mecanismos de directory para securizar también eh los equipos.
28:2628 minutos y 26 segundosEh, nosotros cuando generamos un objeto en el AD, eh en este caso un dispositivo que puede ser una Nodeuk, una PC de
28:3328 minutos y 33 segundosescritorio, ese objeto para que autentique con el AD lo vamos a tener que registrar. O sea,
28:4128 minutos y 41 segundosno solo lo creamos en este árbol que armamos nosotros, eh, que replica la estructura en la empresa, sino que lo vamos a tener que, por decir así, subir
28:5028 minutos y 50 segundosa dominio. Eh, básicamente es ingresarle las credenciales y que coincida el nombre que tiene el directory con el
28:5728 minutos y 57 segundosnombre del equipo, no mucho más, va a ser una conexión. Entonces, cada vez que querramos acceder al equipo, el mismo equipo va a autenticar con el Act
29:0529 minutos y 5 segundosdirectory, va a ver qué permisos tenemos, si podemos ingresar o no, si las credenciales son correctas o no, y se va a poder ingresar. Eh, esto es el común.
29:1729 minutos y 17 segundosEh, muchas veces puede ser que dependiendo de la empresa le den un equipo que no tenga absolutamente nada, tenga nada más que el sistema operativo, dos o tres herramientas de desarrollo y nada más.
29:2729 minutos y 27 segundosPero eh ya que no es tan complicado, vieron, nosotros ya lo configuramos este este updirecto y lo configuramos de cero, no tomó más de media hora, 40
29:3629 minutos y 36 segundosminutos hacerlo por primera vez, o sea, que dense una idea de que no eh no requiere mucha complejidad.
29:4329 minutos y 43 segundosEh, tener un equipo segurizado y en dominio, cosa que cualquiera que venga no pueda acceder a la información que tiene dentro. Esto obviamente es eh una
29:5229 minutos y 52 segundosbarrera, no quiere decir que sea la única. Después, obviamente, van a tener eh firewalls, van a tener eh herramientas
30:0030 minutosde seguridad que eh cifren los discos, que hagan un montón de cosas más, pero convengamos que le vamos poniendo barreras, le vamos poniendo eh límites
30:1030 minutos y 10 segundospara que, bueno, sea cada vez más complicado que puedan ingresar la computadora y la puedan usar, ¿no? Y bueno, puedan extraer información ahí. No sé si quieran comentar algo.
30:2530 minutos y 25 segundosYo quería hacer una consulta.
30:2630 minutos y 26 segundosSí, decimos, espero poder expresarme bien porque a veces trato de entender lo que es un protocolo, que qué es que es algo
30:3430 minutos y 34 segundosmaterial, es un script o es un modo de comunicarse es el modo de comunicarse, pero eso lo establece. O sea, puede ser
30:4330 minutos y 43 segundosdos empresas distintas, puede tener el mismo protocolo y que serían como normas que establecés dentro de una red. Eh, básicamente el protocolo va a ser eh la
30:5230 minutos y 52 segundosmanera que vas a tener, en este caso va a ser la manera que vas a tener de conectarte. Eh, lo que te dice este protocolo es este comandito, por así
31:0031 minutosdecirlo, l a vos te va a pedir los datos que les había mencionado de eh acá servidor apunta, eh usuario, contraseña, eh tipo de autenticación.
31:1231 minutos y 12 segundosEso va a ser lo que va a requerir el protocolo, o sea, los parámetros que va a requerir ese protocolo para hacer la conexión.
31:1931 minutos y 19 segundosEh, justo el protocolo este se llama EDAP, pero tenés un protocolo de red que es el TCPIP y también el
31:2831 minutos y 28 segundosUDP. O sea, son protocolos, son eh normas que se establecieron para la parte de conexión, para la conexión. En este caso va a ser con eh puntualmente
31:3631 minutos y 36 segundosun directorio activo. Eh, no importa en qué sistema operativo está. Eh, obviamente lo que es directorio activo,
31:4331 minutos y 43 segundoscuando decimos directorio activo, es una herramienta de Microsoft. Tiene integraciones con otros sistemas operativos, sí, pero es nativa de
31:5131 minutos y 51 segundosMicrosoft. Por eso siempre les hago hincapié de, bueno, eh se van a conectar eh con este protocolo, pero nosotros
31:5931 minutos y 59 segundospuntualmente lo vamos a hacer con eh estas herramientas de Microsoft. Sirve para Microsoft solamente, no sirve para todos los eh los demás lenguajes,
32:0832 minutos y 8 segundosperdón, lenguajes, los demás sistemas operativos. porque es un protocolo, es eh una convención que establece cómo se
32:1532 minutos y 15 segundosva a conectar y qué es lo que necesita para conectarse. Obviamente vos vas a rellenar esos campos, pero vas a tener que descargar la librería, que en la
32:2332 minutos y 23 segundoslibrería van a estar todas las instrucciones para que se pueda conectar a este dispositivo, sea Microsoft, sea un Ubunto, sea un RedH, sea Linux, que
32:3232 minutos y 32 segundosse te ocurra ahí. No sé si te aclaré un poco o te marí un poquito más.
32:3632 minutos y 36 segundosMe aclaraste. Trato de entenarlo como parte de una capa de la arquitectura también es para como es como esta convención que vos tenés para
32:4532 minutos y 45 segundosconectarte. Ahora, eh, vos cómo lo vas a usar, lo vas a usar en forma de un comando y ese comando va a requerir una
32:5232 minutos y 52 segundoslibrería, que va a ser esta librería edad 3 para que lo puedas usar con los parámetros que eh te pide eh nombre de
32:5932 minutos y 59 segundosequipo, usuario, contraseña y estas cositas que vimos.
33:0333 minutos y 3 segundosOkay. Estos protocolos se se enfocan exclusivamente en la autenticación, o sea, dentro de una red está destinado
33:1133 minutos y 11 segundospara eso, para autenticar usuarios dentro de una red.
33:1433 minutos y 14 segundosPara autenticar, pero eh con un directorio activo, con un eh apti directory.
33:2433 minutos y 24 segundosOkay. Sí. Y otra definición que vi por ahí, autenticación web, un poco me confunde porque cuando digo web es
33:3133 minutos y 31 segundosnavegar en internet, pero si estamos dentro de una red capaz están limitados algunos sitios.
33:3733 minutos y 37 segundosClaro, no, no, no, acá eh básicamente los que le quiero mostrar es cómo desde una aplicación web, una aplicación básica web que bueno, eh en parte
33:4633 minutos y 46 segundoshicieron y en parte bueno eh ahora les voy a mostrar eh cómo va a ser el TP que tienen que entregar eh
33:5433 minutos y 54 segundoscon eh una página web que tenga una autenticación directamente no se limiten a que vayan a una base de datos local o
34:0234 minutos y 2 segundosvaya a buscar eh usuario en contraseña en alguna parte el código que no debería ser así, pero bueno, a veces hacen
34:0934 minutos y 9 segundoscualquier cosa, eh, que esta autenticación directamente la pueden hacer con un directorio activo. Y
34:1834 minutos y 18 segundosbueno, y al usar este protocolo, bueno, que eh aparte de usar esta norma eh tenga todas las eh todas las
34:2734 minutos y 27 segundossegurizaciones que tiene al ser en un protocolo. O sea, vos si querés el día de mañana podés establecer tu propio protocolo, podés decir cómo va a
34:3534 minutos y 35 segundosnegociar los datos, cómo va a transmitir esta información, o sea, es algo que se puede hacer. Yo lo que les muestro es eh
34:4234 minutos y 42 segundosel estándar, que es lo más eh normal que se use. Eh, es seguro, sí, es seguro.
34:4834 minutos y 48 segundosEh, cada vez, obviamente, eh a medida que va evolucionando y va siendo más barato el tema del procesamiento, eh, se
34:5534 minutos y 55 segundosvan teniendo que agregar capas para que sea más seguro todavía. No, no nos podemos quedar con que
35:0235 minutos y 2 segundospor respetar las buenas prácticas, por usar los protocolos que se deben y todo, que con eso va a alcanzar, ¿no? Eh, que
35:1135 minutos y 11 segundoses una de las cosas que también les había mostrado en otras clases, por ejemplo, de a la hora de implementar ustedes un desarrollo web, bueno, que al
35:1935 minutos y 19 segundosente tenga un WF, que tenga un firewall eh para aplicaciones web para que no nos rompan todo.
35:2635 minutos y 26 segundosva a ser la última capa, va a ser lo mejor del mundo y sí y no, o sea, dependiendo de por ahí qué tan valiosa sea nuestra información. Por ahí no sé
35:3435 minutos y 34 segundossi les piden un desarrollo web para ver cuántos alfajores tiene un kiosco o no, pero si ustedes van a trabajar para un banco y van a tener que hacer un
35:4235 minutos y 42 segundosdesarrollo para eh hacer una transferencia, para eh hacer un cobro, hacer un pago y obviamente le van a pedir más sistema de seguridad. Eso
35:5035 minutos y 50 segundostambién eh ténganlo en cuenta, ¿no? Eh, yo lo que les muestro es eh las buenas prácticas y bueno, cómo se debería implementar. Después, dependiendo de qué
35:5935 minutos y 59 segundostan grande va a ser, eh ahí, bueno, le van a tener que ir agregando capas o van a tener que eh ir con algún proveedor para que les dé alguna solución.
36:0936 minutos y 9 segundosEh, se los muestro para que no se queden con que es solo el desarrollo y con que yo haga por ahí un logueo, ya está. Eh, tengan en cuenta que va a tener que tener un par de cositas más.
36:2036 minutos y 20 segundosEh, bueno, volviendo de vuelta, sin irme por las ramas, eh, el protocolo, bueno, va a ser este acuerdo que vamos a tener con esta librería para hacer conexiones
36:2936 minutos y 29 segundospuntuales con lo que va a ser un Active directory, este árbol que habíamos configurado en las primeras clases. Eh,
36:3736 minutos y 37 segundoste pongo como referencia otro protocolo que es el protocolo de red. Es la forma que va a tener de comunicarse con los demás equipos. Bueno, ¿cómo va a ser?
36:4436 minutos y 44 segundosBueno, TSP va a tener también sus librerías, va a tener eh, por ejemplo, como estuvimos viendo la un poquito de
36:5236 minutos y 52 segundosla parte de redes, una IP, una máscara de red, eh va a tener que tener un gateway, bueno, todas esas cositas son los parámetros que va a requerir ese protocolo, ese protocolo TCPIP.
37:0337 minutos y 3 segundosY la manera de conectarse va a ser esta norma de TCPIP, que responde en parte a lo que vimos que era eh un modelo y de conexión.
37:1137 minutos y 11 segundosEh, de nuevo, el protocolo en este caso va a ser esta norma que está eh establecida en común con los demás
37:1937 minutos y 19 segundosdispositivos para hacer la conexión. Eh, TCPIP va a ser por la parte de redes.
37:2437 minutos y 24 segundosEh, no es solo redes cableadas, es Wii, Bluetooth, lo que se les ocurra.
37:3037 minutos y 30 segundosY bueno, este protocolo, el edap va a ser eh para la conexión con lo que es eh un Active Directory, puntualmente con Directory para este servicio solamente.
37:4137 minutos y 41 segundosEh, ahora puede ser un Act directory de Microsoft o de otro sistema operativo, puede ser de cualquier sistema operativo. de nuevo, es un protocolo, es
37:5037 minutos y 50 segundoseh como si fuera una norma que se estableció para eh la comunicación con eh lo que va a ser eh un directo activo,
37:5837 minutos y 58 segundosno importa dónde esté. Ahí no sé si te lo puedo redondear un poquito más o Sí, está bien, está está muy bien, me quedó más claro. Muchas gracias.
38:0838 minutos y 8 segundoseh protocolos a medida que vayan eh bueno, los que ya trabajan para el eh para alguna empresa IT eh lo van a tener
38:1738 minutos y 17 segundospor ahí un poquito más claro. Eh hay un montón. Eh una de las cosas, perdón antes que me olvide, una de las cosas
38:2338 minutos y 23 segundosque mencionaba el video es que eh tema autenticación. Nosotros en este caso con lo que estamos viendo el protocolo de la EDAP, la autenticación la vamos a hacer
38:3238 minutos y 32 segundoscon usuario contraseña, que es la manera más fácil.
38:3538 minutos y 35 segundosEh, ustedes tranquilamente pueden preguntar por otro parámetro que tengan cargado en el director activo, como por ejemplo el correo. Nosotros en nuestro
38:4438 minutos y 44 segundosdirector activo eh solamente creamos eh un usuario con una contraseña. Para crear un
38:5238 minutos y 52 segundoscorreo necesitamos crear un registro más que es un registro MX. En uno de los slides que vimos hace un tiempo largo
39:0139 minutos y 1 segundoestaba, pero bueno, les comento porque no es solo que se rellene ese campito que dice eh email, es en el director
39:0939 minutos y 9 segundosactivo, es un tag más, es una etiqueta más.
39:1239 minutos y 12 segundosEh, para que realmente tenga eh un correo, un usuario, tiene que estar este registro que va a ser como eh como un
39:2039 minutos y 20 segundosusuario más, por así decirlo, en el AD eh que les va a permitir eh trabajar con este tema de de la mensajería.
39:2839 minutos y 28 segundosEh, obviamente para trabajar de nuevo con la mensajería, por más que habilitemos este registro, tenemos que habilitar el rol de eh correo, que es un rol de servidor exchange.
39:3839 minutos y 38 segundosEh, tiene un par de cosas más, pero no es eh nada descabellado, o sea, lo tienen todo integrado.
39:4539 minutos y 45 segundosCon esto lo que le quiero demostrar es que con estas herramientas básicas y no tan básicas,
39:5339 minutos y 53 segundosprácticamente se pueden armar su empresa, pueden manejar su dominio, eh pueden tener su gestión de recursos compartidos, pueden tener sus equipos
40:0240 minutos y 2 segundossegurizados ya con este con este dominio.
40:0640 minutos y 6 segundosObviamente nosotros lo armamos con algo mucho más chico que es un dominio local, pero si ustedes adquieren un dominio de la nube
40:1540 minutos y 15 segundose en una parte de la configuración que les pide DNS y todas esas cosas, eh cargan esos DNS que le dieron cuando
40:2240 minutos y 22 segundoscompraron el dominio y van a tener su dominio, que es el dominio ehcom.
40:2840 minutos y 28 segundosel que compraron, o sea, van a tener su eh su AD con todos los atributos y todas
40:3540 minutos y 35 segundoslas cosas que que quieran manejar con el dominio que compraron, eh, que es como está como se configura hoy en día en las
40:4340 minutos y 43 segundosempresas. Eh, obviamente si lo van a querer implementar en una Pyme o en una empresa, eh, tengan cuidado porque esta
40:5040 minutos y 50 segundosversión ya está quedando, va, ya quedó deprecada el 2008, eh, pero bueno, si
40:5740 minutos y 57 segundosquieren hacerlo con algo más nuevo y todo, eh, van a ver que lo que es a nivel de configuración es exactamente lo mismo, le va a pedir lo mismo, eh, y
41:0641 minutos y 6 segundosbueno, no les va a resultar mucho más complicado hacer una configuración eh con un con un dominio externo, con un
41:1441 minutos y 14 segundosdominio comprado, ¿no? Para tener salida la eh salida de internet para que no sea tan local como estamos haciendo las prácticas.
41:2241 minutos y 22 segundosEh, bueno, eso es como para que les quede les quede un poquito.
41:3341 minutos y 33 segundosVamos a ir un poco eh bueno, parte de cómo hacer esta esta sentencia, este stream connection, eh lo van a tener en
41:4241 minutos y 42 segundosla documentación. La documentación es simplemente lo mismo, es eh, chicos, importen la librería, eh, usen esta
41:4941 minutos y 49 segundossentencia y complétela con usuario, contraseña. En el caso de que quieran más información, eh, yo les dejé en el
41:5741 minutos y 57 segundosen el aula virtual también el link donde está esta información de cómo es la conexión con el LDAP. Acá en este caso,
42:0442 minutos y 4 segundoseh, Microsoft lo que nos muestra es con la evolución de lo que vimos nosotros, que es eh el Asurad D.
42:1442 minutos y 14 segundosque es básicamente lo mismo, pero ya directamente montado este servicio en la nube, ¿no?, que es la evolución. Eh, tema de administración es exactamente
42:2242 minutos y 22 segundosigual de como lo están administrando local. va a cambiar la vista, pero van a tener las mismas funciones.
42:2942 minutos y 29 segundosEsto para que también se queden tranquilos, que si el día de mañana buscan eh por el lado de seguridad o el lado de administración o en una
42:3642 minutos y 36 segundosentrevista les mencionan algo de esto, eh es lo mismo, las funcionalidades son las mismas, salvo que eh el shaite, por así decirlo, está en que eh ya está integrado en la nube.
42:5342 minutos y 53 segundosacá un poquito de lo que les va los que le va a pedir como parámetros, que es básicamente lo mismo lo mismo que vimos,
43:0143 minutos y 1 segundoprotocolo, red, no, no mucho más.
43:1043 minutos y 10 segundosDespués dentro de buscador de Microsoft también pueden buscar puntualmente para
43:1743 minutos y 17 segundoseh apuntarlo con algún atributo específico.
43:2643 minutos y 26 segundosUna de las cosas es que eh ustedes puedan validar con usuarios que están en una U en
43:3343 minutos y 33 segundosparticular, en una unidad organizativa en particular.
43:3643 minutos y 36 segundosEh, no es lo mismo un usuario final que por ahí necesita visualizar un informe que eh un administrador que necesita
43:4443 minutos y 44 segundoscargar información, borrar datos y bueno, eh necesita tener un control más más completo sobre sobre la herramienta.
43:5343 minutos y 53 segundosEh, ¿cómo lo hacen? ¿Cómo se hace eso? Y bueno, básicamente es eh validando usuario contraseña y que pertenezca a
43:5943 minutos y 59 segundosuno a uno en particular. Eh, de nuevo, esa administración de a qué pertenece, lo van a hacer del directory o lo van a
44:0744 minutos y 7 segundostener que hacer remoto con un con un usuario que sea administrador.
44:1444 minutos y 14 segundosSí, ahí le paso el tema de las fechas.
44:1744 minutos y 17 segundosAhí les muestro un poquito cómo es el tema del del TP.
44:4144 minutos y 41 segundosBueno, ahí en el aula virtual ya lo tienen disponible. La fecha límite de entrega va a ser el 25 del trabajo integrador y el primero de
44:5044 minutos y 50 segundosjulio vamos a tener lo que es el recuperatorio para los que precisan recuperar.
44:5544 minutos y 55 segundosEh, va a ser un recuperatorio solo para eh las dos instancias, para primer y segundo parcial. en el caso de que lo
45:0245 minutos y 2 segundosnecesiten, ya tienen habilitado también lo que va a
45:1545 minutos y 15 segundosser la práctica integradora, que básicamente va a ser que eh pueden armar
45:2345 minutos y 23 segundosen una página web una ABM, una alta baja modificación
45:3245 minutos y 32 segundoscon tres tipos de usuario. Uno de los usuarios va a ser administrador, que va a tener como un control total de de lo que se va a cargar, de lo que va de lo que se va a borrar.
45:4245 minutos y 42 segundosEh, otro va a ser un usuario, un operador y el otro va a ser un usuario de consulta.
45:5145 minutos y 51 segundosEh, de nuevo, eh, estos permisos básicamente es dependiendo cómo se loguean a
45:5845 minutos y 58 segundoseh con qué tiene el usuario que se loguea, eh va a ser qué permisos le van a dar.
46:0546 minutos y 5 segundosEh, de nuevo va a ser una web que tenga eh un sistema de logueo como como fuimos armando en los otros en las otras
46:1446 minutos y 14 segundosclases, eh con la diferencia de que eh esta vez se va a conectar eh alti directory a través de este protocolo que les pasé, este protocolo del EDAP.
46:2746 minutos y 27 segundosEh, bueno, el sistema va a ser un sistema de de stock.
46:3246 minutos y 32 segundosObviamente traten de completar que por lo menos el stock tenga eh cuatro o cinco campos, ¿no? Eh, un ID, eh un
46:4146 minutos y 41 segundosnombre de producto, eh un precio, por ejemplo, eh como para que bueno, tenga un poquito de de visual. Eh, no les voy
46:5046 minutos y 50 segundosa pedir que sea una base de datos ni nada por el estilo.
46:5446 minutos y 54 segundosEh, una de las cosas que sí les pido es el tema de que eh esos datos sean persistentes, ¿no? De que si yo cierro cierro la aplicación web no desaparezcan.
47:0347 minutos y 3 segundosEh, también les aclaro e en el TP.
47:0947 minutos y 9 segundosA ver, aguárden un segundito que directamente se los voy a compartir.
47:1447 minutos y 14 segundosLe voy a compartir imagen porque si no
47:2747 minutos y 27 segundossí, pero no hace falta que sea puntualmente una base de datos que sea un SQL o algo por el estilo. Con que lo puedan grabar y sea un CSB ya alcanza
47:3847 minutos y 38 segundosahí. No sé, milagros y bueno, eh ahí lo pueden ver.
47:5247 minutos y 52 segundosPor ahí se ve un poco chiquito, pero desarrollar una aplicación web en Python
47:5947 minutos y 59 segundosque integre autenticación contra el Actirectory. Una vez autenticado, el usuario debe acceder a un sistema de gestión de stock que permite administrar
48:0748 minutos y 7 segundosproductos, registrar movimientos, consultar reportes, respetando roles y permisos asociados a los grupos de la D.
48:1448 minutos y 14 segundosBueno, esto que les decía de acá se los aclaro de que bueno tengan un uso administrador, si se lo ve alguien que es administrador que eh pueda por ahí
48:2348 minutos y 23 segundosborrar eh pueda hacer consultas, tenga más permisos que un usuario estándar, que eso lo puede visualizar, ¿no?
48:3548 minutos y 35 segundosBueno, la aplicación debe deben persistir los datos de la aplicación en una base. No les pongo que es una eh una
48:4248 minutos y 42 segundosbase de datos porque de nuevo, como preguntaba Milagros, no hace falta que eh ustedes metan un SQL ni nada por el estilo.
48:5148 minutos y 51 segundosTambién, bueno, les pido que bueno, traten de respetar las prácticas de seguridad con el tema de validar por ahí los campitos, fue una de las cosas que
48:5948 minutos y 59 segundoshabíamos hecho en otro los ejercicios, cosa que no puedan ingresar cualquier cosa en el usuario, que no puedan ingresar cualquier cosa en en la contraseña.
49:0849 minutos y 8 segundosY bueno, eh como adicional que se puede exportar este listado que tienen de productos en stock.
49:1649 minutos y 16 segundosEh, les pongo preferente eh preferentemente en CCB porque eh la idea sería que eh no se vuelvan locos con un
49:2349 minutos y 23 segundosSQL ni nada por el estilo, que eh simplemente puedan escribir un documento y que eh se pueda consultar ese documento que va a tener la base de
49:3149 minutos y 31 segundosdatos. Eh, esto es libre, lo pueden hacer un CSB, que es un archivito separado por comas. Si alguno está más
49:4049 minutos y 40 segundosfamiliarizado o se lleva mejor, no sé, con Jason, eh, cosas por el estilo también. Eh, también es válido. Eh, la
49:4949 minutos y 49 segundosidea es que haya un archivito donde se guarden estos campitos que vamos a a cargar y modificar, ¿no?
49:5549 minutos y 55 segundosEh, otra de las cosas que les pido, bueno, el tema de que eh de poder setear un horario para que se conecten. Esto
50:0350 minutos y 3 segundosfue una de las cosas que vimos en las primeras clases, que era se tiar un horario al usuario, ¿no?
50:0950 minutos y 9 segundosque si está fuera del horario directamente no pueda tener acceso.
50:1550 minutos y 15 segundosYo les voy a pedir un entregable de todo esto, que suban el código y
50:2250 minutos y 22 segundoscapturas del del sistema funcionando. Y lo que vamos a hacer va a hacer una prueba en clase. Vamos a probar que
50:3050 minutos y 30 segundospoder generar un usuario X o sacar un usuario de la U y ver si se puede conectar o no.
50:4350 minutos y 43 segundosBueno, eh yo les puse como eh fecha final el 25, pero si ustedes lo tienen antes lo pueden entregar antes
50:5250 minutos y 52 segundostambién, no no hay problema con eso.
51:0051 minutosEh, bueno, ahí si lo quieren hacer en grupo, les voy a pedir que me avisen antes de entregarlo,
51:0751 minutos y 7 segundoseh, para, bueno, poder calificarlos a todos en grupo. E la idea es que, bueno,
51:1451 minutos y 14 segundoslo puedan hacer. Si tienen alguna consulta, de nuevo, esto va a ser para la 25. Eh, las clases que nos quedan eh
51:2151 minutos y 21 segundoslas voy a dejar de consulta para que puedan eh pueden ir consultando si se llegan a trabar en algún lado.
51:2851 minutos y 28 segundosEl máximo por grupo yo les pediría que sean cuatro o menos, hasta cuatro.
51:4251 minutos y 42 segundosAhí no sé si tiene alguna consulta.
51:4451 minutos y 44 segundosSí, yo, profe, pregunta. El 25 sería el día que se prueba una clase en vivo, digamos, ¿no? Si lo tienen antes, lo lo probamos antes. Eh, yo lo puse como fecha límite.
51:5551 minutos y 55 segundosBien, por eso faltan más o menos, no sé, 10, 15 días. Hay una clase que no vamos a tener, que me enteré hace poco, que es
52:0352 minutos y 3 segundosla del 17, que es un miércoles, eh, que no sé si era el día de la
52:1152 minutos y 11 segundosbandera, una cosa así que lo mueven, pero bueno, acá eh me figura como que
52:1952 minutos y 19 segundoseh que no no va a estar abierto al terciario.
52:3152 minutos y 31 segundosIgualmente, de nuevo, e la idea es que tengan eh clase de consulta. Eh, si en algún momento o alguna instancia se
52:3852 minutos y 38 segundostraban, eh, puedan consultar y lo podemos llevar todos adelante. Eh, lo único que les pido, bueno, eh, traten
52:4652 minutos y 46 segundosde ser prolijos. Yo lo que puse como buenas prácticas es que no eh no me jarcoden por ahí usuario y
52:5452 minutos y 54 segundoscontraseña, ¿no? Que usen un usuario que que esté validando y todo, ¿no? Que me abran la conexión con un usuario administrador
53:0153 minutos y 1 segundoeh el usuario administrador local del equipo, ¿no? Eh, que puedan hacer la conexión con uno de los usuarios que
53:0853 minutos y 8 segundosestá dentro de una de las claro. está eh no abre la institución,
53:2053 minutos y 20 segundosentonces no, perdón, eh ahí le estaba hablando a María eh justo el miércoles,
53:2753 minutos y 27 segundoseste miércoles 17 que les comentaba, eh, como es el día de la bandera, si bien lo mueven lo que es feriado
53:3553 minutos y 35 segundosa nivel institucional no abre la institución, entonces no se dictan clases.
53:4453 minutos y 44 segundosSí, a nivel de de feriado se pasa el feriado, pero a nivel institucional respetan la fecha del del día de la bandera. Por ahí viene la mano.
53:5653 minutos y 56 segundosEh, estaba consultando María eh Aronskin, sí se puede hacer individual.
54:0354 minutos y 3 segundosYo comentaba de eh bueno, si lo quieren hacer en grupo, son libres de hacerlo en grupo también, ¿no? No hay problema.
54:1054 minutos y 10 segundosEh, de vuelta las clases que quedan van a ser de de consulta si se tragan con alguna en alguna de las instancias.
54:1954 minutos y 19 segundosEh, básicamente es con su máquina virtual eh y una web pueden hacer la
54:2554 minutos y 25 segundosconexión eh y pueden editar, ¿no? Pueden editar este en este archivito eh que va a tener un un stock ficticio, ¿no?
54:3754 minutos y 37 segundosEh, la idea es que, bueno, pueden hacer la conexión. La conexión es eh es similar a lo que se hace en una empresa, o sea, no
54:4554 minutos y 45 segundoses una práctica lo más realista posible con lo con lo que tenemos.
54:5054 minutos y 50 segundosEh, y bueno, eh, obviamente van a tener que tener la máquina virtual configurada.
54:5654 minutos y 56 segundosEh, no les eh no se vuelvan locos con el tema de lo del lenguaje. Yo en realidad les pedí Python porque es el lo que más
55:0455 minutos y 4 segundoso menos vienen eh vienen manejando. Eh, una de las cosas que bueno, fuimos viendo, si se les complica el tema del
55:1355 minutos y 13 segundosdiseño web también es usar estos templates de Flask, tratar de llevar los templates que consigamos por ahí a esta
55:2155 minutos y 21 segundosforma de un sistema de stock y no mucho más.
55:2655 minutos y 26 segundosAsí que no sé si tiene alguna otra duda con respecto a cómo eh cómo desarrollarlo, qué es lo que tienen que hacer. Por un lado tienen la BM que ya
55:3455 minutos y 34 segundosla tienen eh armada y funcionando. Por otro lado tienen ya tienen el protocolo y por otro lado la página web que eh
55:4155 minutos y 41 segundosestuvimos viendo un par de cositas en clase y ya tienen un par de prácticas de cómo hacer un ABM, cómo hacer este logueo eh y cómo editar algunas cositas.
55:4955 minutos y 49 segundosAsí que bueno, no sé, eh, básicamente es integrar todo eso para que funcione con este sistema de stock.
56:0956 minutos y 9 segundosNo sé si les quedó alguna otra duda o algo respecto del parcial, respecto de lo que fuimos viendo.
56:1656 minutos y 16 segundosUna consulta, profe. Eh, el código de Python se ejecutaría dentro de la de la virtual o yo puedo ajustarlo
56:2556 minutos y 25 segundosdesde mi máquina apuntando al serio virtual. Claro, la idea es esa, eh, que vos tengas la máquina virtual por un lado que va a simular una máquina, un premis en una empresa.
56:3556 minutos y 35 segundosSí.
56:3556 minutos y 35 segundosY que vos, eh, dentro de tu PC corras la web. Por eso eh les había pasado toda esta info y bueno, estos prácticos con
56:4456 minutos y 44 segundosFlask, que les va a emular esta página web, les va a hacer correr esta página web y que con eso se conecten a esta máquina virtual
56:5256 minutos y 52 segundosque estimularía una máquina on premis dentro de la empresa. Eh, en este caso simularía algo en premis, pero si ustedes lo quisieran apuntar el día de
57:0057 minutosmañana a un equipo en la nube, a un director activo en la nube, simplemente les va a pedir los mismos campos, pero eh donde apunta en lugar de ir un IP a
57:0857 minutos y 8 segundosuna dirección local, va a ser una URL que va a ser donde va a estar alojado en la nube. O sea, para que se den una idea de que eh es muy poco lo que tienen que
57:1657 minutos y 16 segundoscorregir si lo quieren implementar a un nivel más macro, ¿no?
57:2357 minutos y 23 segundosAhí no sé, Leandro si sí. No, perfecto. No, no lo claro. Si el Python se está dentro de la virtual de
57:3157 minutos y 31 segundosmi compu apuntando. Bien, claro. Es de tu compu apuntando a la a la virtual simulando como que nosotros tenemos una red on premis y el servidor está ahí.
57:4157 minutos y 41 segundosPerfecto, me quedó, me quedó claro. Gracias, profe.
57:4557 minutos y 45 segundosAhí no sé si alguno alguno más tiene alguna duda con con la página web, eh con la BM, con este tema del protocolo,
57:5457 minutos y 54 segundosque fue lo que eh lo que vimos un poquito más en detalle ahora.
58:2058 minutos y 20 segundosEh, bueno, sería eso. Eh, creo que con eso sería suficiente.
58:2958 minutos y 29 segundosBueno, la idea por ahí es como algo más profesional, avanzado que eh se puede hacer desde Docker, pero bueno, para que
58:3758 minutos y 37 segundosfuncione esto en armonía tienen que habilitar este eh este servicio de quereros que ya requiere una configuración un poco más
58:4558 minutos y 45 segundoscompleja, por eso no se los pido para eh para hacer esta misma práctica dentro de Docker porque va a requerir un par de
58:5258 minutos y 52 segundospasos más y va a pasar como por eh tres o cuatro instancias. Eh, se puede hacer, se puede hacer tranquilamente, se puede
59:0059 minutoshacer con este protocolo EDAP. Lo único que va a requerir es una configuración adicional con Kerveros, por eso no eh no
59:1059 minutos y 10 segundosse los dado porque ya requiere un poquito más de de complejidad.
59:1659 minutos y 16 segundosEh, no sé de nuevo si tienen alguna consulta, alguna duda, eh, se trataron con algo, pudieron terminar las prácticas de
59:2559 minutos y 25 segundoseh de Python con Flask, pudieron hacer la integración con eh con Shinja 2, con esta eh con esta tecnología de templates,
59:3359 minutos y 33 segundosse trabaron con algo, algo no se entendió, se entendió muy por arriba.
59:3959 minutos y 39 segundosEh, de nuevo va a haber instancias, eh, va a haber un par de clases también que que vamos a usar de consulta, pero si tien alguna duda, alguna consulta, el
59:4759 minutos y 47 segundosmomento de equivocarse es ahora, chicos, no el día de la entrega.
1:00:001 horaYo por lo menos no. Okay.
1:00:061 hora y 6 segundosBueno, eh de nuevo, lo único que les pido es eh traten de implementar las buenas prácticas que fuimos viendo, validar
1:00:151 hora y 15 segundoseh usuario, contraseña eh de que no puedan ingresar cualquier cosa.
1:00:221 hora y 22 segundosTraten de en lo posible no jarcodear el tema de la conexión, de meterle
1:00:301 hora y 30 segundoseste super usuario que usamos para loguearnos en el en la máquina virtual, o sea, por ahí para hacer pruebas, sí,
1:00:371 hora y 37 segundospero después ya para la entrega les pido que lo corrijan.
1:00:411 hora y 41 segundosEh, y no mucho más. el tema este de la base de datos, que bueno eh yo le pongo que persistan los datos, pero de nuevo
1:00:481 hora y 48 segundoses básicamente que eh puedan escribir en un documento, porque acá lo que se valora es el tema de que puedan hacer la conexión y tenga una funcionalidad la página web.
1:01:001 hora y 1 minutoEh, de nuevo tienen un montón de comunidades para consultar más allá de lo que es GP chat y todo esto, todas estas que hay dando vueltas que les van
1:01:081 hora, 1 minuto y 8 segundosa resolver un montón eh lo que va a ser inicialmente la parte de código.
1:01:141 hora, 1 minuto y 14 segundosEh, pero de nuevo, si se trata en algún punto, eh, no, eh, lo tengo funcionando, pero no me anda la conexión o
1:01:241 hora, 1 minuto y 24 segundoseh o me da la conexión, pero no puedo hacer tal cosa. eh lo vamos sirviendo porque la idea es que eh podamos llegar todos a hacer esta entrega.
1:01:341 hora, 1 minuto y 34 segundosY de nuevo, si lo van a hacer en grupo, eh me avisan, yo les dejo un listado en el en el Drive o en el aula virtual para que se puedan anotar los grupos.
1:01:451 hora, 1 minuto y 45 segundosigualmente el día de la entrega, por favor recuérdenme eh somos el grupo tal y somos estos integrantes
1:01:531 hora, 1 minuto y 53 segundosmismo. Bueno, si lo suben de esa manera, al eh si lo suben al el aula virtual también,
1:02:001 hora y 2 minutospor favor aclárenme eso, que en la portada esté eso. Eh, y bueno, nada más.
1:02:061 hora, 2 minutos y 6 segundosEh, si tienen alguna consulta o algo, me pueden escribir. Yo les voy a tratar de de responder la brevedad.
1:02:131 hora, 2 minutos y 13 segundoseh y no mucho más, o sea, eh tienen las herramientas para poder hacer la la
1:02:211 hora, 2 minutos y 21 segundosconexión. Eh, la idea es que puedo se puedan llevar esto y eh aparte de este conocimiento de cómo administrar todas
1:02:281 hora, 2 minutos y 28 segundosestas instancias, un par de herramientas y bueno, un par de herramientas de gestión que les van a ser eh de utilidad, que bueno, fue parte de lo que
1:02:371 hora, 2 minutos y 37 segundosvimos de de parte de costos, parte ITIL, eh
1:02:441 hora, 2 minutos y 44 segundosy bueno, ¿cómo se van? ¿Cómo se alinean las empresas de de hoy día?
1:02:491 hora, 2 minutos y 49 segundosBueno, chicos, si no tienen ninguna consulta nada más, eh, los libero. Ahora les paso el link de asistencia
1:02:561 hora, 2 minutos y 56 segundosy bueno, ya las próximas clases eh serán de consulta y ahí me dicen cómo lo quieren manejar,
1:03:041 hora, 3 minutos y 4 segundossi lo quieren, quiénes son los que lo quieren hacer en grupo, quieren lo quieren entregar individual, eh,
1:03:111 hora, 3 minutos y 11 segundosy no mucho más. Eh, la fecha de recuperatorio eh va a ser una sola. Eh, se va a recuperar la distancia que necesiten, si necesitan recuperar primer
1:03:191 hora, 3 minutos y 19 segundosparcial o este trabajo integrador y no mucho más.
1:04:041 hora, 4 minutos y 4 segundosM.
