# EventNova

Sistema web de gestión y reserva de eventos y espectáculos, desarrollado como Proyecto Integrador (Bases de Datos y Programación en Ambiente Web I).

## Objetivo

Plataforma tipo Tuboleta / Eventbrite / Ticketmaster que permite iniciar sesión, registrar clientes y agentes, administrar eventos y reservas, y consultar reportes desde un dashboard de administrador.

## Tecnologías

- **Backend:** Node.js + Express
- **Motor de vistas:** EJS
- **Base de datos:** PostgreSQL (driver `pg`)
- **Frontend:** HTML5, CSS3, JavaScript
- **Control de versiones:** Git / GitHub
- **Gestión ágil:** Jira (Scrum)

## Patrón de arquitectura: MVC

El proyecto sigue el patrón **Modelo–Vista–Controlador**:

- **Modelo (`/models`):** contiene las consultas SQL contra PostgreSQL. Cada archivo representa una entidad (ej. `paisModel.js`, `eventoModel.js`). No conoce nada de HTTP ni de HTML.
- **Vista (`/views`):** plantillas EJS que generan el HTML que ve el usuario. Se apoyan en `/views/partials` para fragmentos reutilizables (head, navbar, footer).
- **Controlador (`/controllers`):** recibe la petición (request), pide datos al Modelo si los necesita, y decide qué Vista renderizar. No contiene SQL directamente.
- **Rutas (`/routes`):** conectan una URL + verbo HTTP (GET, POST, PUT, DELETE) con un método de un Controlador.

## Estructura de carpetas

```
eventnova/
├── app.js                  # Punto de entrada de la aplicación
├── package.json
├── .env.example             # Plantilla de variables de entorno
├── .gitignore
│
├── config/
│   └── db.js                # Conexión reutilizable a PostgreSQL
│
├── models/
│   └── paisModel.js         # Ejemplo de Modelo (consultas SQL de "pais")
│
├── controllers/
│   └── homeController.js    # Ejemplo de Controlador
│
├── routes/
│   └── index.js             # Rutas principales
│
├── views/
│   ├── index.ejs            # Vista de ejemplo (home)
│   └── partials/
│       ├── head.ejs
│       ├── navbar.ejs
│       └── footer.ejs
│
├── public/                  # Archivos estáticos servidos al navegador
│   ├── css/style.css
│   ├── js/main.js
│   └── img/
│
├── database/                 # Scripts SQL (ej. database/init.sql)
├── docs/                     # Diagramas UML y ER del proyecto
```

## Convención de nombres

- Archivos de Modelo: `nombreEntidadModel.js` (ej. `eventoModel.js`, `reservaModel.js`)
- Archivos de Controlador: `nombreEntidadController.js` (ej. `eventoController.js`)
- Archivos de Rutas: `nombreEntidadRoutes.js` (ej. `eventoRoutes.js`)
- Ramas de Git por funcionalidad: `feature/nombre-funcionalidad` (ej. `feature/login`, `feature/crud-eventos`)

## Instalación y ejecución local

1. Clonar el repositorio y entrar a la carpeta del proyecto.
2. Instalar dependencias:
   ```
   npm install
   ```
3. Copiar `.env.example` a `.env` y completar los datos reales de conexión a PostgreSQL.
4. Ejecutar en modo desarrollo:
   ```
   npm run dev
   ```
5. Abrir `http://localhost:3000` en el navegador.

## Equipo

- Sergio Alejandro Morales Florez
- Daniel Castañeda Londoño
- Paola Andrea Carmona Salazar
- Isabella Serna Torres