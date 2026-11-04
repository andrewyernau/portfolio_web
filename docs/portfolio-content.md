# Contenido del portfolio

Inventario del texto y los conceptos del portfolio. La copia publicada vive en `api/src/site/content.ts`, en español e inglés. Este documento guarda de dónde sale cada dato y el texto de la web React anterior, retirada al pasar a HTMX.

## Quién soy

- André Yermak Naumenko, Murcia, España.
- Ingeniero telemático por la Universidad Politécnica de Cartagena (2021 a 2026), con intercambios en Dublín y Malta.
- Prácticas de ingeniería de datos en Setenova de octubre de 2025 a mayo de 2026; ingeniero de datos desde mayo de 2026.
- Servicios propios en Linux desde 2020.
- Idiomas: español y ruso nativos, inglés C1 (Cambridge), ucraniano básico.
- Contacto público: contact@yernau.com, GitHub andrewyernau, LinkedIn.

## Conceptos que el sitio debe transmitir

- Ingeniería de datos en tiempo real: Kafka, PostgreSQL, S3, Airflow, FastAPI, arquitectura medallion, series temporales.
- Fiabilidad: definir el SLA, convertirlo en objetivos medibles y validar cada despliegue con ellos.
- Soluciones on-premise y en la nube.
- Infraestructura propia: Docker, HAProxy, Prometheus, OpenTofu, DNS, correo, certificados. Dos caídas reales recuperadas.
- Base de teleco además de la telemática: señales, radio, acceso al medio, redes, hardware digital.
- Automatizar lo que se repite y aprender rápido lo que aún no se sabe.
- Ser honesto con los resultados: el TFG es modesto y se dice así.

## Fuentes

| Dato | Fuente |
| --- | --- |
| Setenova, infraestructura, habilidades | `TEX/CurriculumVitae/main_adidas.tex`, `carta_adidas.tex` |
| Eventos, conservatorio, asociación, clases | `TEX/CurriculumVitae/main.tex` |
| Streaming y tecnologías de las prácticas | `TEX/Practices/memoria_final.tex` |
| Resultados del TFG | `TEX/TFE/frontmatter/resumen.tex`, `chapters/05_conclusiones_y_trabajo_futuro.tex` |
| Multiplicador secuencial en VHDL | `TEX/HardwareArquitecture/main.tex` |
| ZedBoard, PIC16F876A | repositorios públicos `zedboard`, `assembly_exercises` |
| Radio, ALOHA, FSA, La Costera | repositorio público `tex-projects` (solo informes en los que figura André) |
| SmartEcoRutas | `ptylabs/PR-SmartEcoRutas-Solver` |

## Fuera de la web a propósito

- Nombres de clientes de Setenova: aparecen en el CV enviado a una empresa, no en una página pública ni en este repositorio, que también es público.
- Teléfono, también en el PDF público.
- Detalles internos de la infraestructura: IP, topología del proxy, túneles.
- Latencias y cifras de la memoria de prácticas ligadas a un cliente.
- La aportación individual a tmuxxer y SmartEcoRutas, sin confirmar.

## CV descargable

`static/main.pdf`, servido como `/main.pdf`. Es la copia de `TEX/CurriculumVitae/output/pdf/main_general.pdf`, en inglés, sin clientes ni teléfono porque es público. Al regenerar el CV, sustituir el archivo conservando el nombre.

# Archivo: texto de la web anterior

## Web React, español

**Rol:** Ingeniero telemático · software, datos y sistemas

### Inicio

**Software, datos y sistemas para problemas que merecen entenderse bien.**

Soy ingeniero telemático por la UPCT y trabajo como Data Engineer en Setenova. Mi práctica personal se mueve entre backend, herramientas de desarrollo, Linux, redes, videojuegos y machine learning: distintos contextos para una misma forma de trabajar, construir y aprender desde los fundamentos.

Murcia, España · abierto a conversar sobre oportunidades de ingeniería

- Ahora: Data Engineer en Setenova
- Formación: Ingeniería Telemática · UPCT · 2021–2026
- Idiomas: Español y ruso nativos · inglés C1 · ucraniano básico

**Experiencia profesional:** En Setenova empecé como Data Engineering Intern (oct. 2025 – may. 2026), integrando y procesando fuentes heterogéneas, analizando datos de protocolos en tiempo real y visualizando tráfico. Desde mayo de 2026 trabajo como Data Engineer.

### Proyectos

**Proyectos que hacen visible cómo trabajo**

Una selección de trabajo personal, académico y colaborativo. Cada ficha separa lo que construí de lo que todavía necesita más contexto, para que la evidencia pese más que la lista de tecnologías.

#### tmuxxer (Herramienta de desarrollo colaborativa)

Una utilidad de terminal en Rust para reunir directorios de proyectos, sesiones de tmux y, opcionalmente, contenedores Docker en ejecución en un selector interactivo con fzf.

Proyecto compartido nacido con un amigo para reducir fricción al cambiar de contexto durante el desarrollo.

- Crea, conecta y cambia sesiones; adapta su comportamiento según se ejecute dentro o fuera de tmux.
- Puede abrir una shell en un contenedor Docker en ejecución y permite configurar atajos y directorios.
- Se instala con Cargo y dispone de binarios para Linux.

Etiquetas: Rust, Linux, tmux, fzf, Docker

Nota: La contribución concreta de cada colaborador aún no está desglosada públicamente.

Enlaces: [Ver repositorio](https://github.com/ptylabs/tmuxxer)

#### Estilometría de ajedrez (Trabajo de Fin de Grado · Python)

Investigación de clasificación de jugadores a partir de análisis visual de partidas mediante una red siamesa entrenada con muestras ancla, positivas y negativas.

Un trabajo de casi un año que cubrió documentación, aprendizaje guiado, implementación, entrenamiento y evaluación.

- Exploré un enfoque de aprendizaje métrico para comparar representaciones visuales asociadas a jugadores.
- El trabajo obtuvo 10/10 y fue propuesto para matrícula de honor.
- Los resultados fueron positivos, aunque no espectaculares; el valor estuvo también en diseñar y evaluar el proceso completo.

Etiquetas: Python, Machine learning, Redes siamesas, Ajedrez

Nota: Quedan por publicar o concretar el dataset, las métricas, la arquitectura final y las limitaciones experimentales.

#### API backend en Rust (Backend personal · Axum)

Una API de complejidad moderada que conectaba un frontend con una base de datos, integraba servicios externos y validaba usuarios registrados.

Desarrollo del backend como pieza de integración entre la interfaz, la persistencia y APIs de terceros.

- El alcance incluía comunicación frontend–base de datos e integración de APIs externas.
- La validación de usuarios registrados formaba parte del flujo de la aplicación.

Etiquetas: Rust, Axum, APIs

Nota: El repositorio, el modelo de autenticación, la base de datos, las pruebas y el despliegue todavía no están documentados públicamente.

#### Plugins de Minecraft (Desarrollo Java)

Conjunto de aproximadamente cuatro plugins de temáticas distintas, construidos con las APIs y el ecosistema de extensiones de Minecraft.

Desarrollo de funcionalidades para servidores y aprendizaje práctico dentro de un ecosistema Java orientado a eventos y a APIs de plataforma.

- LibreBuild es uno de los ejemplos: integra WorldEdit para esquemas, comprueba zonas protegidas con WorldGuard y diferencia permisos de jugadores y administradores.
- El conjunto no se limita a LibreBuild: los demás plugins aún requieren una ficha técnica y enlaces propios.

Etiquetas: Java, Minecraft APIs, WorldEdit, WorldGuard

Enlaces: [Ver LibreBuild](https://github.com/andrewyernau/LibreBuild)

#### Self-hosting y Linux (Sistemas personales)

Administración de un entorno propio con varios servicios web, servidores Linux, Docker y networking.

Operación directa de la infraestructura donde vive este portfolio: servicios en Docker detrás de un Caddy central como proxy inverso.

- Es una práctica continua de despliegue, administración de servidores y redes aplicada a servicios propios.
- La configuración detallada de servicios, copias, monitorización y decisiones de seguridad se documentará a medida que pueda publicarse.

Etiquetas: Linux, Docker, Caddy, Networking

#### SmartEcoRutas (Retos UPCT · 2026)

Segundo puesto en la categoría SmartEcoRutas con un proyecto basado en un algoritmo heurístico de optimización de rutas.

Participación en un reto de ingeniería orientado a formular y aproximar un problema de rutas.

- El algoritmo utilizaba un enfoque heurístico para la optimización de rutas.

Etiquetas: Optimización, Algoritmos heurísticos, Rutas

Nota: La aportación individual, las restricciones y el resultado técnico todavía necesitan documentarse.

### Contacto

**Hablemos de ingeniería, datos o sistemas.**

Para oportunidades, colaboraciones o una conversación técnica, puedes escribirme directamente o usar el formulario.

Correo: andrewyernau@proton.me

Portfolio personal · sin rastreadores de terceros.

## Web React, inglés

**Rol:** Telematics engineer · software, data and systems

### Inicio

**Software, data and systems for problems worth understanding properly.**

I am a UPCT telematics engineer and a Data Engineer at Setenova. My personal practice spans backend development, developer tools, Linux, networking, games and machine learning: different settings for the same way of working—building and learning from first principles.

Murcia, Spain · open to engineering opportunities and conversations

- Now: Data Engineer at Setenova
- Education: Telematics Engineering · UPCT · 2021–2026
- Languages: Native Spanish and Russian · C1 English · basic Ukrainian

**Professional experience:** At Setenova, I started as a Data Engineering Intern (Oct. 2025 – May 2026), integrating and processing heterogeneous sources, analysing real-time protocol data and visualising traffic data. I have worked as a Data Engineer since May 2026.

### Proyectos

**Projects that make my way of working visible**

A selection of personal, academic and collaborative work. Each entry distinguishes what was built from what still needs more context, so evidence carries more weight than a technology list.

#### tmuxxer (Collaborative developer tool)

A Rust terminal utility that brings project directories, tmux sessions and, optionally, running Docker containers into an interactive fzf selector.

A shared project started with a friend to reduce the friction of changing development contexts.

- Creates, attaches to and switches sessions; its behaviour adapts to whether it runs inside or outside tmux.
- Can open a shell in a running Docker container and supports configurable shortcuts and directories.
- Installed through Cargo, with Linux binaries available.

Etiquetas: Rust, Linux, tmux, fzf, Docker

Nota: The specific contribution of each collaborator is not yet publicly broken down.

Enlaces: [View repository](https://github.com/ptylabs/tmuxxer)

#### Chess stylometry (Bachelor's thesis · Python)

Research into classifying players from visual analysis of games using a Siamese network trained with anchor, positive and negative samples.

A nearly year-long project covering documentation, guided study, implementation, training and evaluation.

- I explored metric learning to compare visual representations associated with players.
- The thesis received 10/10 and was proposed for honours distinction.
- Results were positive rather than spectacular; the value also lay in designing and evaluating the complete process.

Etiquetas: Python, Machine learning, Siamese networks, Chess

Nota: The dataset, metrics, final architecture and experimental limitations still need to be published or specified.

#### Rust backend API (Personal backend · Axum)

A moderately complex API connecting a frontend to a database, integrating external services and validating registered users.

Backend development as the integration point among the interface, persistence and third-party APIs.

- The scope included frontend–database communication and external API integration.
- Validating registered users was part of the application's flow.

Etiquetas: Rust, Axum, APIs

Nota: The repository, authentication model, database, tests and deployment are not yet publicly documented.

#### Minecraft plugins (Java development)

A set of roughly four plugins across different themes, built with Minecraft's plugin APIs and ecosystem.

Feature development for servers and hands-on learning in an event-driven, platform-API-oriented Java ecosystem.

- LibreBuild is one example: it integrates WorldEdit for schematics, checks protected areas with WorldGuard and differentiates player and administrator permissions.
- The set is not limited to LibreBuild: the other plugins still need individual technical entries and links.

Etiquetas: Java, Minecraft APIs, WorldEdit, WorldGuard

Enlaces: [View LibreBuild](https://github.com/andrewyernau/LibreBuild)

#### Self-hosting and Linux (Personal systems)

Operating a personal environment with several web services, Linux servers, Docker and networking.

Direct operation of the infrastructure that hosts this portfolio: Docker services behind a central Caddy reverse proxy.

- An ongoing practice of deployment, server administration and networking through personal services.
- Detailed service, backup, monitoring and security decisions will be documented as they can be made public.

Etiquetas: Linux, Docker, Caddy, Networking

#### SmartEcoRutas (Retos UPCT · 2026)

Second place in the SmartEcoRutas category with a project based on a heuristic route-optimisation algorithm.

Participation in an engineering challenge focused on formulating and approximating a routing problem.

- The algorithm used a heuristic approach to route optimisation.

Etiquetas: Optimisation, Heuristic algorithms, Routing

Nota: The individual contribution, constraints and technical outcome still need documentation.

### Contacto

**Let's talk about engineering, data or systems.**

For opportunities, collaborations or a technical conversation, email me directly or use the form.

Correo: andrewyernau@proton.me

Personal portfolio · no third-party trackers.
