// Datos de proyectos para el portfolio
const projectsData = [
    {
        id: 1,
        title: "Entorno virtual de aprendizaje ADÁN (Proyecto)",
        summary: "Plataforma virtual de aprendizaje desarrollada como proyecto final de carrera.",
        description: `
            <p>
            Proyecto desarrollado en el marco de la asignatura "Proyecto" de la carrera Tecnólogo en Informática, orientado al análisis, diseño e implementación de un entorno virtual de aprendizaje, poniendo especial énfasis en la evaluación de tecnologías, la arquitectura del sistema y el desarrollo de soluciones cercanas a un entorno real de producción.
            </p>

            <p>
            El trabajo consistió en diseñar y construir un prototipo funcional que permita la gestión de cursos, usuarios y contenidos educativos, facilitando la interacción entre los distintos usuarios (administradores, profesores y estudiantes) mediante funcionalidades académicas y de comunicación. El sistema fue concebido como una solución multiplataforma, con acceso web para todos los perfiles y una aplicación mobile destinada a estudiantes.
            </p>

            <p>
            Se implementó un sistema de autenticación y autorización basado en JWT. La solución incorpora además envío de correos electrónicos y notificaciones automáticas para eventos relevantes del sistema, como anuncios, vencimientos de tareas y publicación de calificaciones.
            </p>

            <p>
            El proyecto incluyó el despliegue en la nube de los distintos componentes del sistema, contemplando la separación entre frontend, backend y servicios de persistencia (base de datos y almacenamiento de archivos), así como la configuración de entornos y dependencias necesarias para su funcionamiento.
            </p>

            <p>
            El proyecto pone especial énfasis en:
            </p>

            <ul>
            <li>La documentación técnica del sistema, abarcando requerimientos, modelos de dominio, arquitectura, diseño y verificación</li>
            <li>El análisis de tecnologías para backend, frontend y persistencia</li>
            <li>El diseño de la arquitectura del sistema, incluyendo la definición de componentes, responsabilidades y su documentación mediante diagramas y modelos formales</li>
            <li>La implementación de mecanismos de autenticación y seguridad</li>
            <li>El desarrollo de aplicaciones web y mobile para distintos perfiles de usuario</li>
            <li>La gestión integral del proyecto, incluyendo planificación, testing y despliegue</li>
            </ul>
        `,
        tags: ["Java", "Spring Boot", "React", "Kotlin", "PostgreSQL", "Railway", "Vercel", "Firebase", "JWT"],
        videoPaths: [
            { name: "Web usr", url: "https://youtu.be/7o1hmrivsqM" },
            { name: "Web admin", url: "https://drive.google.com/file/d/1Jc2kNZMLJbsPVHxqt46udX-aL2spcV8E/view?usp=sharing" }, //https://youtu.be/97wHpviazEg
            { name: "Mobile", url: "https://youtu.be/rhAw_PCyqJ4" }
        ],
        letraUrl: "letras/PROPUESTA DE PROYECTO 2025.pdf",
        reportUrl: "letras/InformeFinalProyecto.pdf"
    },
    {
        id: 2,
        title: "Tenis 2D",
        summary: "Videojuego de tenis 2D desarrollado con Pygame.",
        description: "Videojuego de tenis 2D desarrollado para la materia optativa \"Desarrollo y programación de videojuegos en 2 dimensiones\" (DPV2D). El desarrollo fue realizado de forma bastante artesanal, utilizando Python y la librería Pygame. Tiene implementado un modo single-player en el que se puede jugar contra un bot y también un modo multijugador para que dos personas jueguen desde un mismo teclado. Dentro del repositorio hay más información sobre el origen de los distintos recursos utilizados en el juego.",
        tags: ["Python", "Pygame", "Pixel Art"],
        videoUrl: "https://youtu.be/mnP0UjItCVc",
        images: ["imagenes/tenis/1.png", "imagenes/tenis/2.png", "imagenes/tenis/3.png", "imagenes/tenis/4.png", "imagenes/tenis/5.png"],
        codeUrl: "https://github.com/navi-37/tenis2d",
    },
    {
        id: 4,
        title: "Sistema de gestión y visualización de paradas y lineas de transporte en rutas nacionales.",
        summary: "Solución para optimizar la gestión de paradas y lineas de transporte dentro de las rutas nacionales.",
        description: `
            <p>
            Proyecto desarrollado en el marco del Taller de Sistemas de Información Geográfica (TSIG), orientado a aplicar conceptos de SIG, integración de servicios geoespaciales y consistencia de datos espaciales entre distintas capas de negocio.
            </p>

            <p>
            El trabajo consistió en diseñar e implementar una solución que permita registrar, administrar y visualizar paradas y líneas de transporte en rutas nacionales, integrando información geográfica, atributos operativos y reglas de consistencia espacial. El sistema ofrece un mapa interactivo para el usuario final, con herramientas de búsqueda y filtrado, y un entorno de administración para la carga y edición de datos.
            </p>

            <p>
            La solución contempla distintos perfiles de usuario: usuarios anónimos, que pueden consultar el mapa y explorar líneas y paradas cercanas, y usuarios administradores, responsables de gestionar paradas, recorridos y asociaciones entre líneas y paradas, incluyendo la edición de geometrías y el control de estados habilitados o deshabilitados.
            </p>

            <p>
            El proyecto pone especial énfasis en:
            </p>

            <ul>
            <li>El uso de datos geoespaciales y su representación en mapas interactivos</li>
            <li>La implementación de lógica de ruteo (en nuestro caso el algoritmo de Dijkstra) para trazar recorridos sobre la capa de caminería nacional provista por el MTOP</li>
            <li>El modelado de relaciones entre entidades espaciales (líneas, paradas, recorridos)</li>
            <li>La integración de bases de datos espaciales y servicios de mapas</li>
            <li>El desarrollo de una solución completa, desde el backend hasta la visualización</li>
            </ul>
        `,  
        tags: ["SIG", "WMS/WFS", "PostgreSQL", "PostGIS", "GeoServer", "Spring Boot", "React", "OpenLayers"],
        images: ["imagenes/tsig/diag.png", "imagenes/tsig/clases.png", "imagenes/tsig/mer.png"],
        letraUrl: "letras/TSIG 2025 - Letra Tecnologo.pdf",
        videoUrl:"https://youtu.be/SPYLT8KJUvg"
    },
    {
        id: 5,
        title: "Sitio web de restaurante",
        summary: "Sitio web para restaurante desarrollado con PHP y MySQL.",
        description: "Sitio web básico desarrollado como laboratorio de la materia optativa \"Desarrollo de sitios web con PHP\". Consiste en una aplicación web para la gestión de un restaurante, donde los usuarios clientes pueden navegar los distintos menús, agregarlos a favoritos, incorporarlos a un carrito, realizar compras y consultar su historial de pedidos. El sistema cuenta con autenticación de usuarios y manejo de roles. El rol administrador dispone de funcionalidades para la gestión de los menús disponibles, incluyendo alta, baja y modificación de productos.",
        tags: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
        videoUrl: "https://youtu.be/hNJBezNBmbE",
    },
    {
        id: 6,
        title: "Portal de difusión para refugio de animales",
        summary: "Sitio web desarrollado para la materia optativa RIA.",
        description: "Pequeño sitio web estático desarrollado como laboratorio de la materia RIA (Rich Internet Applications). La tematica del sitio era abierta y se decidió desarrollar un portal de difusión de animales en adopción de un refugio ficticio.",
        tags: ["HTML", "CSS", "JavaScript"],
        videoUrl: "https://youtu.be/vTo625gO090"
    },
    {
        id: 7,
        title: "Aplicación de mensajería en red local con sockets",
        summary: "Aplicación de mensajería por terminal desarrollada en Python que permite el envío de mensajes y archivos entre dispositivos de una misma red local utilizando sockets UDP y TCP.",
        description: `
            <p>
            Este proyecto fue desarrollado como laboratorio para la materia Redes de Computadoras. Consiste en una aplicación de mensajería en tiempo real operada desde la terminal, diseñada para comunicar distintos hosts dentro de una red local sin utilizar servidores intermediarios para el intercambio de mensajes.
            </p>

            <p>
            El sistema permite:
            </p>

            <ul>
                <li>Envío de mensajes de texto entre hosts específicos</li>
                <li>Envío de mensajes en broadcast a toda la red</li>
                <li>Transferencia de archivos entre pares</li>
            </ul>

            <p>
            La aplicación utiliza sockets UDP para el envío de mensajes de texto, priorizando simplicidad y bajo overhead, y TCP para la transferencia de archivos, garantizando la entrega completa y ordenada de los datos.
            </p>

            <p>
            Debido a la restricción de tamaño máximo de 255 bytes por paquete, los archivos se fragmentan en chunks que luego son reconstruidos en el host receptor.
            </p>

            <p>
            El programa está implementado utilizando multithreading, dividiendo su ejecución en tres hilos:
            </p>

            <ul>
                <li>Un hilo dedicado a la recepción de mensajes por UDP</li>
                <li>Un hilo dedicado a la recepción de archivos por TCP</li>
                <li>Un hilo principal encargado de la interacción con el usuario y el envío de mensajes y archivos</li>
            </ul>

            <p>
            El sistema incluye un mecanismo de autenticación local basado en la validación de credenciales almacenadas en un archivo de texto, implementado como alternativa al servicio de autenticación remoto que fue utilizado durante el curso ya que éste no se encuentra disponible.
            </p>
        `,
        tags: ["Redes", "Sockets", "TCP", "UDP", "Python"],
        codePaths: [
            { name: "mensajeria-redes.py", path: "codigo/redes-mensajeria.py" }
        ],
        language: "Python",
        letraUrl: "letras/redes2024-lab.pdf"
    },
    {
        id: 133,
        title: "Laboratorios de Bases de Datos",
        summary: "Resumen de los laboratorios realizados para las materias Bases de Datos 1 y 2.",
        description: "El objetivo es mostrar el tipo de consultas y desarrollos realizados durante el cursado de estas materias. En BD1, el laboratorio se enfoca en consultas SQL, mientras que en BD2 se avanza en el uso de triggers, stored procedures y cursores.",
        tags: ["SQL", "PostgreSQL", "MySQL"],
        letras: [
            { name: "Propuesta BD1", url: "letras/BD1-OblUnico-2023.pdf" },
            { name: "Propuesta BD2", url: "letras/letraOblig2-bd2.pdf" }
        ],
        codePaths: [
            { name: "BD1", path: "codigo/ObBD1Mat2023.sql" },
            { name: "BD2 parte 1.1", path: "codigo/Parte1_1.sql" },
            { name: "BD2 parte 1.2", path: "codigo/Parte1_2.sql" },
            { name: "BD2 parte 2", path: "codigo/Parte2.sql" }
        ],
        language: "sql",
    },
    {
        id: 8,
        title: "Filesystem basado en MS-DOS",
        summary: "Mini filesystem con comportamiento y sintaxis similares a sistemas MS-DOS, implementado en C, con algunas extensiones de C++.",
        description: `
            <p> 
            Proyecto desarrollado para la materia Estructuras de Datos y Algoritmos, orientado a introducir a los estudiantes en el diseño e implementación de estructuras de datos propias, el manejo de memoria dinámica y la resolución de problemas complejos sin apoyarse en abstracciones de alto nivel.
            </p>

            <p>
            El trabajo consistió en construir un simulador de sistema de archivos, similar al de un sistema operativo, con una estructura jerárquica de directorios y archivos de texto. El sistema permite navegar, crear, eliminar y mover archivos y directorios, además de listar contenidos y manipular el texto almacenado en los archivos.
            </p>

            <p>
            La implementación se realizó en C (utilizando algunas extensiones controladas de C++), priorizando el uso explícito de punteros, estructuras dinámicas y recorridos recursivos, lo que obliga a razonar cuidadosamente sobre la representación interna del sistema, la gestión de memoria y la consistencia de los datos.
            </p>

            <p>
            Este proyecto funciona como un primer acercamiento práctico a:
            </p>

            <ul>
            <li>Modelar problemas reales mediante estructuras de datos jerárquicas</li>
            <li>Gestionar memoria dinámica</li>
            <li>Implementar lógica recursiva</li>
            <li>Trabajar con código modular y estructurado</li>
            </ul>
            `,
        tags: ["C", "C++", "Filesystem", "MS-DOS"],
        letraUrl: "letras/eda2023-ob.pdf",
        videoUrl: "https://youtu.be/6uMtlemFyP8",
        codeUrl: "https://github.com/navi-37/filesystem-eda"
    },
    {
        id: 9,
        title: "Sistema de operaciones con arreglos en lenguaje assembly (MARIE)",
        summary: "Programa desarrollado en lenguaje ensamblador que maneja arreglos numéricos y permite realizar distintas operaciones aritméticas y de ordenamiento mediante un menú interactivo.",
        description: `<p>Laboratorio opcional de la materia Arquitecutra del computador, hecho con la finalidad de introducir a los estudiantes a la programación en un lenguaje ensamblador. Si bien la elección de lenguaje era abierta se recomendaba el uso de la arquitectura MARIE por su simpleza y conveniencia.</p>

            <p>El programa consiste en el manejo de distintas operaciones entre 3 arreglos numéricos y puede ejecutarse desde cualquier navegador en <a href="https://marie.js.org/" target="_blank" rel="noopener noreferrer">marie.js.org</a></p>

            <p>Al ejecutar el programa el primer input es para ingresar el tamaño de los arrays (se asume que el usuario ingresará un numero entre 1 y 10 inclusive). Se procede entonces a solicitar los numeros que se desea ingresar en arreglo1 y luego en el arreglo2. Al terminar de ingresar los numeros pasamos al menú, donde ingresando 0, 1, 2, 3 y 4 se ejecutan las consignas solicitadas y si se ingresa cualquier otro número el programa se dirige otra vez al menú hasta que se ingresa un valor válido.</p>

            <p>Funcionalidades:</p>
            
            <ul>
            <li>0 - imprime a3</li>
            <li>1 - copia a1 en a3 y lo ordena de menor a mayor</li>
            <li>2 - suma los elementos de a1 con los de a2 en a3 --> a3[i]=a1[i]+a2[i]</li>
            <li>3 - multiplica los elementos de a1 con los de a2 en a3, suma los elementos de a3 en la variable prodcart y la imprime.</li>
            <li>4 - divide los elementos correspondientes de a1 con los de a2 en a3, suma los elementos de a3 en la variable divcart y la imprime.</li>
            </ul>

            <p>Nota: para testear en la página usar tanto input como output en modo decimal.</p>
            `,

        tags: ["Assembly", "MARIE", "Arquitectura"],
        videoUrl: "https://youtu.be/mX7AE6Ev3WE",
        language: "marie", // Especificar lenguaje para syntax highlighting
        codePaths: [
            { name: "labMARIE", path: "codigo/arquitectura-labMARIE.txt" }
        ],
        letraUrl: "letras/Arq_tecno_2023_obligatorio.pdf"
    },
    {
        id: 10,
        title: "Generador de contraseñas",
        summary: "Generador de contraseñas aleatorias escrito en C.",
        description: "",
        tags: ["C"],
        codeUrl: "https://github.com/navi-37/pwgen",
        images: ["imagenes/pwgen/pwgen.png", "imagenes/pwgen/pwgen2.png"]
    },
];
