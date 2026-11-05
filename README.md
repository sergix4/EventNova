# EventNova

Sistema web de gestión y reserva de eventos y espectáculos — Proyecto Integrador.

**Tecnologías:** HTML5 · CSS3 · JavaScript (sin frameworks) · Node.js + Express · PostgreSQL · patrón MVC · Git/GitHub.

> El frontend se construyó inicialmente en React a partir del prototipo de Figma.
> Por requisito del curso se tradujo a **HTML5 + CSS + JavaScript puro**,
> conservando el mismo diseño, la conexión a PostgreSQL y el patrón MVC.

## Estructura del proyecto

```
EventNova/
├── backend/                  # Servidor Express (API REST + archivos estáticos)
│   ├── app.js                # Punto de entrada: /api + sirve la carpeta frontend/
│   ├── config/db.js          # Conexión a PostgreSQL (pg)
│   ├── models/               # MODELO: consultas SQL (usuario, plan, país, departamento, ciudad, evento, reserva)
│   ├── controllers/          # CONTROLADOR: reciben la petición y responden JSON
│   ├── routes/               # Rutas /api/auth, /api/paises, /api/departamentos, /api/ciudades, /api/status
│   ├── middlewares/          # authMiddleware.js: soloAdmin protege crear/editar/eliminar
│   ├── database/             # develop.sql, migraciones, seed_planes.sql, seed_estados.sql, seed_admin.js, seed_demo.js
│   └── .env.example          # Plantilla de variables de entorno
│
└── frontend/                 # Interfaz HTML5 + CSS + JavaScript
    ├── index.html            # Página de inicio pública
    ├── 404.html
    ├── pages/                # Una página .html por pantalla
    │   ├── login.html, registro.html
    │   ├── cliente/          # inicio, explorar, detalle-evento, mis-reservas, perfil
    │   ├── agente/           # mis-eventos, registrar-evento, reservas, perfil
    │   └── admin/            # dashboard, reportes, cobertura, operación, ubicación, perfil
    ├── css/                  # base.css (diseño común) + una hoja por sección
    └── js/                   # MVC del lado del cliente
        ├── models/           # MODELO: fetch a la API y datos de ejemplo
        ├── views/            # VISTA: generan el HTML de cada pantalla
        ├── controllers/      # CONTROLADOR: eventos del usuario y lógica de pantalla
        └── utils/            # Formato de pesos, fechas, etc.
```

## ¿Cómo se aplica el patrón MVC?

El patrón se aplica en las dos partes del sistema:

| Capa            | Backend (servidor)                                          | Frontend (navegador)                                                                   |
| --------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Modelo**      | `backend/models/*.js` — consultas SQL a PostgreSQL          | `frontend/js/models/*.js` — piden los datos a la API con `fetch`                       |
| **Vista**       | Respuestas JSON de la API                                   | `frontend/pages/*.html` + `frontend/js/views/*.js` + `frontend/css/`                   |
| **Controlador** | `backend/controllers/*.js` — validan y deciden la respuesta | `frontend/js/controllers/*.js` — escuchan clics/formularios y coordinan modelo y vista |

Ejemplo — CRUD de países (`Panel administrador → Ubicación geográfica`):

```
ubicacion.html ──► ubicacionController.js ──► PaisModel (js/models/paisModel.js)
                         │                          │  fetch('/api/paises')
                         ▼                          ▼
                  ubicacionView.js          backend/routes/paisRoutes.js
               (dibuja tabla/errores)               │
                                            backend/controllers/paisController.js
                                                    │
                                            backend/models/paisModel.js ──► PostgreSQL (tabla pais)
```

## Instalación y ejecución

### 1. Base de datos

El equipo usa una base compartida en **Neon Postgres** (nube).

**Si ya existe la base en Neon (caso normal):**

1. Pedir la `DATABASE_URL` por privado y pegarla en `backend/.env`.
2. `npm run dev`. **No** ejecutar `npm run db:init`.

**Para crear una base nueva desde cero (Neon o PostgreSQL local):**

1. Neon: crear el proyecto y pegar la `DATABASE_URL` en `.env`.
   Local: crear `eventnova_db` y llenar `DB_HOST`, `DB_PORT`, etc. (sin `DATABASE_URL`).
2. `npm run db:init` → tablas (`develop.sql`) + planes + estados.
   Tiene un candado: si la base ya tiene tablas no hace nada
   (para recrearla a propósito: `npm run db:init -- --forzar`, **borra todo**).
3. `npm run db:ubicaciones` → países, departamentos y ciudades del mundo  
   (datos de [countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database),
   licencia ODbL, mediante el paquete npm [`country-state-city`](https://github.com/harpreetkhalsagtbit/country-state-city)).
4. `npm run db:admin` → administrador inicial.
5. `npm run db:demo` → **datos de demostración** (opcional): 5 agentes, 12 clientes,
   22 eventos en 15 ciudades de 5 países (en todos los estados) y 82 reservas
   repartidas en los meses de 2026. No borra nada y no duplica si se ejecuta dos veces.
   Contraseña de todos los usuarios demo: `Demo12345` (por ejemplo
   `laura.gomez@demo.eventnova.com` como cliente y
   `valle.producciones@demo.eventnova.com` como agente).
   Para **quitar** la demo después: `npm run db:demo -- --borrar` (borra solo los
   usuarios `@demo.eventnova.com`, sus eventos y sus reservas; lo demás no se toca).

> `develop.sql` es el script **consolidado**: ya trae todos los cambios de las
> migraciones 01 a 07, así que una base nueva queda igual a la de Neon **sin**
> ejecutar ninguna migración.

**Para aplicar una migración nueva a una base que ya existe** (no borra datos):
`npm run db:migrar -- migracion_07.sql` (cambiar por el nombre de la migración).
Los archivos `migracion_XX.sql` son el historial de cambios que se aplicó a Neon;
solo sirven para bases creadas antes de esa migración.

### 2. Servidor

```bash
cd backend
npm install
cp .env.example .env      # en Windows: copy .env.example .env
# editar .env con tus credenciales de PostgreSQL
npm run dev
```

En la terminal debe aparecer:

```
Conexion a PostgreSQL establecida correctamente.
EventNova corriendo en http://localhost:3000
```

Para crear el usuario administrador inicial (una sola vez):

```bash
npm run db:admin
```

Por defecto queda `admin@eventnova.com` / `Admin12345`. Se puede cambiar con
`ADMIN_CORREO`, `ADMIN_PASSWORD` y `ADMIN_ID` en el `.env`.

### 3. Abrir la aplicación

Abrir **http://localhost:3000** en el navegador. Un solo comando levanta todo:
el mismo servidor entrega las páginas HTML y responde la API.

> ⚠️ No abrir los `.html` con doble clic ni con _Live Server_: las páginas usan
> módulos de JavaScript y la sesión del servidor, así que deben abrirse desde
> `http://localhost:3000`.

## API disponible

| Método         | Ruta                              | Descripción                                                           |
| -------------- | --------------------------------- | --------------------------------------------------------------------- |
| GET            | `/api/status`                     | Estado del servidor                                                   |
| POST           | `/api/auth/login`                 | Iniciar sesión                                                        |
| POST           | `/api/auth/register`              | Registrar cliente                                                     |
| POST           | `/api/auth/register-agente`       | Registrar agente (con plan)                                           |
| GET            | `/api/auth/sesion`                | Usuario con sesión activa (o `null`)                                  |
| POST           | `/api/auth/logout`                | Cerrar sesión                                                         |
| GET/POST       | `/api/paises`                     | Listar / crear países                                                 |
| GET/PUT/DELETE | `/api/paises/:id`                 | Consultar / editar / eliminar un país                                 |
| GET/POST       | `/api/departamentos`              | Listar (opcional `?id_pais=`) / crear departamentos                   |
| GET/PUT/DELETE | `/api/departamentos/:id`          | Consultar / editar / eliminar un departamento                         |
| GET/POST       | `/api/ciudades`                   | Listar (obligatorio `?id_departamento=`) / crear ciudades             |
| GET/PUT/DELETE | `/api/ciudades/:id`               | Consultar / editar / eliminar una ciudad                              |
| GET/POST       | `/api/reservas`                   | Listar (según el rol de la sesión) / crear reserva (cliente)          |
| GET            | `/api/reservas/estados`           | Estados de la reserva                                                 |
| GET            | `/api/reservas/cupos/:idEvento`   | Entradas disponibles de un evento                                     |
| GET/PUT/DELETE | `/api/reservas/:id`               | Consultar / modificar entradas (si está Reservada) / eliminar (admin) |
| PATCH          | `/api/reservas/:id/estado`        | Confirmar o cancelar una reserva                                      |
| GET            | `/api/usuarios`                   | Listar usuarios (admin; opcional `?rol=` cliente, agente o administrador y `?buscar=`) |
| GET/PUT/DELETE | `/api/usuarios/:id`               | Consultar / editar (persona, teléfonos y datos del rol) / eliminar (admin) |
| POST           | `/api/usuarios/administradores`   | Registrar un administrador (solo otro administrador con sesión) |
| GET            | `/api/planes`                     | Listar los planes de agente (tabla TIPO_PLAN) |

## Estado actual

- ✅ Registro (cliente y agente, con ciudad y teléfono) e inicio de sesión contra PostgreSQL, redirigiendo según el rol.
- ✅ CRUD de países, departamentos y ciudades (Ubicación geográfica) contra PostgreSQL.
- ✅ Administrador inicial creado con `seed_admin.js`.
- ✅ Crear, editar y eliminar ubicaciones solo lo puede hacer el administrador (middleware `soloAdmin`).
- ✅ Estados del evento (tabla `ESTADO`) y de la reserva (tabla `ESTADO_RESERVA`) definidos.
- ✅ Tabla `EVENTO` con los campos del enunciado (`migracion_03.sql`) y modelo `backend/models/eventoModel.js`.
- ✅ Tabla `RESERVA` con los campos del enunciado (`migracion_05.sql`) y modelo `backend/models/reservaModel.js` (valor total automático y validación de cupos).
- ✅ CRUD de reservas (`/api/reservas`): el cliente reserva desde el detalle del evento; valor total automático, validación de cupos y permisos por rol.
- ✅ Vista "Mis reservas" del cliente: listado real de sus reservas con filtros (texto, estado, fecha), detalle del evento asociado y cancelación de reservas propias.
- ✅ Administrar reservas (perfil agente): listado real de las reservas de sus eventos con filtros (texto, evento, estado, fecha), detalle y cambio de estado Reservada → Confirmada / Cancelada con causa obligatoria.
- ✅ Reglas de eventos: duración mínima de 1 hora, registro con 24 h de anticipación y sin fechas pasadas; solo se reserva En Boletería; En Vivo y Finalizado cambian solos según la hora; cancelar un evento cancela todas sus reservas.
- ✅ Dashboard del administrador con estadísticas reales (`/api/reportes/dashboard`, solo administrador): totales de usuarios, reservas y eventos; ingresos, reservas y eventos por mes del año elegido; cobertura por país/departamento/ciudad; actividad reciente y resumen de pagos de reservas (`migracion_06.sql`).
- ✅ Script de base de datos consolidado: `develop.sql` crea las 13 tablas finales con sus triggers; se quitaron las tablas que no pide el enunciado (CATEGORIA, AGRUPA, RESEÑA, METODO_PAGO y TIPO) con `migracion_07.sql`.
- ✅ Datos de demostración (`npm run db:demo`, `backend/database/seed_demo.js`): clientes, agentes, eventos y reservas en todos los estados (con causas de cancelación) para probar los reportes y la sustentación.
- ✅ API de usuarios (`/api/usuarios`, solo administrador): listado por rol con búsqueda, consulta, edición en transacción (persona, teléfonos y datos de cliente/agente/administrador) y eliminación protegida (no se borra a quien tiene reservas o eventos, ni el admin a sí mismo).
- ✅ Gestión de clientes y agentes (`pages/admin/usuarios.html`, solo administrador): pestañas con buscador, paginación, Ver, Editar (persona, teléfonos, país → departamento → ciudad y datos del rol) y Eliminar con confirmación y aviso cuando tiene reservas o eventos.
- ✅ CRUD de administradores (pestaña «Administradores» en `pages/admin/usuarios.html`): solo un administrador con sesión registra a otro (persona, contraseña, salario y horario); un administrador no puede eliminarse a sí mismo, siempre queda al menos uno, y si un administrador es eliminado su sesión deja de servir.
- ✅ Reporte general con datos reales (`/api/reportes/generales`, solo administrador): totales de clientes, agentes, administradores, reservas y eventos con los nuevos del mes; eventos y reservas por estado; reservas y eventos por mes del año elegido y los últimos 50 registros del sistema con filtros.
- ✅ Reportes comerciales con datos reales (`/api/reportes/comerciales?anio=2026`, solo administrador): ingresos por agente y por cliente con su promedio general, ingresos totales por mes, número de reservas por evento y por mes, y eventos creados por agente y ciudad (activos, finalizados y cancelados).
- ✅ Reporte de cobertura y eventos con datos reales (`/api/reportes/cobertura?anio=2026` o `?anio=todos`, solo administrador): listado de eventos (código, nombre, estado, fecha) por país, departamento y ciudad de realización, filtros encadenados con el conteo de eventos de cada nivel, gráficas por país y departamento, ranking de ciudades y resumen de cobertura.
- 🟡 Reportes comerciales, cobertura y operación todavía usan **datos de ejemplo** (`frontend/js/models/datosEjemplo.js`).
  Cuando exista cada endpoint solo se cambia el modelo correspondiente
  (por ejemplo `eventoModel.js`) para que use `peticion('/api/...')`; las vistas y
  controladores no cambian.

## Convenciones

- Modelos: `nombreEntidadModel.js` · Controladores: `nombreEntidadController.js` · Vistas: `nombrePantallaView.js`
- Páginas HTML en minúsculas con guiones: `mis-reservas.html`
- Ramas de Git: `feature/nombre-funcionalidad`, que se integran a `main` mediante Pull Request.

## Equipo

- Daniel Castañeda Londoño
- Sergio Alejandro Morales Florez
- Paola Andrea Carmona Salazar
- Isabella Serna Torres
