# EventNova

Sistema web de gestión y reserva de eventos y espectáculos — Proyecto Integrador.

**Tecnologías:** HTML5 · CSS3 · JavaScript (sin frameworks) · Node.js + Express · PostgreSQL · patrón MVC · Git/GitHub.

> El frontend se construyó inicialmente en React a partir del prototipo de Figma.
> Por requisito del curso se tradujo a **HTML5 + CSS + JavaScript puro**,
> conservando el mismo diseño, la conexión a PostgreSQL y el patrón MVC.

## Estructura del proyecto

```
EventNova/
├── backend/                  # Servidor Express: solo API REST (se despliega en Railway con Docker)
│   ├── app.js                # Punto de entrada: /api (con CORS para el frontend publicado)
│   ├── config/db.js          # Conexión a PostgreSQL (pg)
│   ├── models/               # MODELO: consultas SQL (usuario, persona, plan, país, departamento, ciudad, evento, reserva, reporte)
│   ├── controllers/          # CONTROLADOR: reciben la petición y responden JSON
│   ├── routes/               # Rutas /api/auth, /api/paises, /api/departamentos, /api/ciudades, /api/eventos, /api/reservas, /api/usuarios, /api/planes, /api/reportes, /api/status
│   ├── middlewares/          # authMiddleware (sesión, rol y cuenta activa), limiteLogin, validarId, sincronizarEstados, manejarErrores
│   ├── database/             # schema.sql (tablas), seeds.sql (datos iniciales), seed_demo.js, importar_ubicaciones.js
│   └── .env.example          # Plantilla de variables de entorno
│
├── docs/                     # Manual de usuario, diagramas UML, E-R y modelo relacional (PDF)
│
└── frontend/                 # Interfaz HTML5 + CSS + JavaScript
    ├── index.html            # Página de inicio pública
    ├── 404.html
    ├── pages/                # Una página .html por pantalla
    │   ├── login.html, registro.html
    │   ├── cliente/          # inicio, explorar, detalle-evento, mis-reservas, perfil
    │   ├── agente/           # mis-eventos, registrar-evento, reservas, perfil
    │   └── admin/            # dashboard, reportes generales y comerciales, cobertura, operación, usuarios, ubicación, perfil
    ├── css/                  # base.css (diseño común) + una hoja por sección
    └── js/                   # MVC del lado del cliente
        ├── models/           # MODELO: fetch a la API
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

La base de datos se crea con **dos archivos** de `backend/database/`:

| Archivo | Qué hace |
| ------- | -------- |
| `schema.sql` | Crea las 14 tablas, índices, restricciones y triggers. Se ejecuta sobre una base vacía.|
| `seeds.sql` | Inserta los datos iniciales: 5 estados de evento, 3 estados de reserva, 3 planes, 4 administradores, 20 clientes, 20 agentes y 20 o más filas en las demás tablas. Cada persona tiene **un solo rol**. |

**Opción A · pgAdmin (así lo revisa la docente):**

1. Crear una base de datos vacía (por ejemplo `eventnova_db`).
2. Clic derecho sobre la base → **Query Tool** → abrir `schema.sql` → **Ejecutar (F5)**.
3. En el mismo Query Tool abrir `seeds.sql` → **Ejecutar (F5)**.

**Opción B · desde el proyecto (Neon o PostgreSQL local):**

1. Neon: pegar la `DATABASE_URL` en `backend/.env`.
   Local: llenar `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` (sin `DATABASE_URL`).
2. `npm run db:init` → ejecuta `schema.sql` + `seeds.sql`.
   Tiene un candado: si la base ya tiene tablas no hace nada
3. `npm run db:ubicaciones` → (opcional) agrega los países, departamentos y ciudades del mundo
   (datos de [countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database),
   licencia ODbL, mediante el paquete npm [`country-state-city`](https://github.com/harpreetkhalsagtbit/country-state-city)).
4. `npm run db:demo` → (opcional, necesita el paso 3) **datos de demostración**: 5 agentes, 12 clientes,
   22 eventos en todos los estados y 82 reservas con fechas calculadas desde el día en que se ejecuta.
   Contraseña de los usuarios demo: `Demo12345` (por ejemplo `laura.gomez@demo.eventnova.com`).
   Para quitarla: `npm run db:demo -- --borrar`.

> No hace falta `npm run db:admin`: `seeds.sql` ya trae los 4 administradores.

**Usuarios de `seeds.sql`** (contraseña de todos: `12345`):

| Rol | Correos |
| --- | ------- |
| Administrador | `sergio@eventnova.com`, `daniel@eventnova.com`, `isabella@eventnova.com`, `paola@eventnova.com` |
| Cliente | `carlos.perez@correo.com`, `maria.gomez@correo.com` … (20 en total) |
| Agente | `eventos.nova@eventos.com`, `live.stage@eventos.com` … (20 en total) |

**Para aplicar un cambio nuevo a una base que ya existe** (no borra datos):
crear un `.sql` en `backend/database/` y ejecutar `npm run db:migrar -- nombre_del_archivo.sql`.

### 2. Servidor (API)

```bash
cd backend
npm install
cp .env.example .env      # en Windows: copy .env.example .env
# editar .env con las credenciales de la base de datos
npm run dev
```

En la terminal debe aparecer:

```
Conexion a PostgreSQL establecida correctamente.
EventNova corriendo en http://localhost:3000
```

El backend **solo** responde la API (en `http://localhost:3000` se ve un mensaje JSON).
En internet corre en **Railway** (`backend/Dockerfile`).

### 3. Abrir la aplicación

- **En internet:** https://sergix4.github.io/EventNova/ (GitHub Pages, workflow
  `.github/workflows/static.yml`), conectada al backend de Railway.
- **En local**, contra tu backend local:
  1. En `frontend/js/models/config.js` cambiar temporalmente la URL:
     `export const BASE_URL = "http://127.0.0.1:3000";`
  2. Abrir `frontend/index.html` con la extensión **Live Server** de VS Code
     (abre `http://127.0.0.1:5500`).
  3. **No subir ese cambio**: antes de hacer commit, restaurarlo con
     `git restore frontend/js/models/config.js`.

> ⚠️ Usar `127.0.0.1` en los dos lados (o `localhost` en los dos): si se mezclan,
> el navegador no envía la cookie de sesión y el inicio de sesión no se mantiene.

## API disponible

| Método         | Ruta                            | Descripción                                                                            |
| -------------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| GET            | `/api/status`                   | Estado del servidor                                                                    |
| POST           | `/api/auth/login`               | Iniciar sesión                                                                         |
| POST           | `/api/auth/register`            | Registrar cliente                                                                      |
| POST           | `/api/auth/register-agente`     | Registrar agente (con plan)                                                            |
| GET            | `/api/auth/sesion`              | Usuario con sesión activa (o `null`; con `aviso: "suspendida"` si la cuenta se suspendió) |
| POST           | `/api/auth/logout`              | Cerrar sesión                                                                          |
| GET/PUT        | `/api/auth/perfil`              | «Mi perfil»: consultar / editar los datos propios (cualquier rol con sesión)           |
| PUT            | `/api/auth/perfil/contrasena`   | Cambiar la contraseña propia (pide la actual)                                          |
| GET/POST       | `/api/paises`                   | Listar / crear países                                                                  |
| GET/PUT/DELETE | `/api/paises/:id`               | Consultar / editar / eliminar un país                                                  |
| GET/POST       | `/api/departamentos`            | Listar (opcional `?id_pais=`) / crear departamentos                                    |
| GET/PUT/DELETE | `/api/departamentos/:id`        | Consultar / editar / eliminar un departamento                                          |
| GET/POST       | `/api/ciudades`                 | Listar (obligatorio `?id_departamento=`) / crear ciudades                              |
| GET/PUT/DELETE | `/api/ciudades/:id`             | Consultar / editar / eliminar una ciudad                                               |
| GET/POST       | `/api/reservas`                 | Listar (según el rol de la sesión) / crear reserva (cliente; queda Confirmada al pagar)|
| GET            | `/api/reservas/estados`         | Estados de la reserva                                                                  |
| GET            | `/api/reservas/cupos/:idEvento` | Entradas disponibles de un evento                                                      |
| GET/PUT/DELETE | `/api/reservas/:id`             | Consultar / modificar las observaciones (solo con el evento En Boletería) / eliminar una reserva cancelada (admin) |
| PATCH          | `/api/reservas/:id/estado`      | Cancelar una reserva (total o parcial). La confirmación es automática al pagar.        |
| GET            | `/api/usuarios`                 | Listar usuarios (admin; opcional `?rol=` cliente, agente o administrador y `?buscar=`) |
| GET/PUT        | `/api/usuarios/:id`             | Consultar / editar (persona, teléfonos y datos del rol) (admin)                        |
| PATCH          | `/api/usuarios/:id/estado`      | Suspender o reactivar una cuenta (admin; no suspende clientes con reservas ni agentes con eventos) |
| POST           | `/api/usuarios/clientes`        | Registrar un cliente desde el panel (solo administrador)                               |
| POST           | `/api/usuarios/agentes`         | Registrar un agente desde el panel (solo administrador)                                |
| POST           | `/api/usuarios/administradores` | Registrar un administrador (solo otro administrador con sesión)                        |
| GET/POST       | `/api/eventos`                  | Listar eventos / registrar evento (agente o admin)                                     |
| GET            | `/api/eventos/catalogo`         | Catálogo para el cliente (filtros de ubicación y fecha; solo agentes activos)          |
| GET            | `/api/eventos/estados`          | Estados del evento                                                                     |
| GET            | `/api/eventos/:id/imagen`       | Imagen del evento (pública)                                                            |
| GET/PUT/DELETE | `/api/eventos/:id`              | Consultar / editar / eliminar un evento (agente dueño o admin)                         |
| PATCH          | `/api/eventos/:id/estado`       | Cambiar el estado (al cancelar, también cancela sus reservas)                          |
| GET            | `/api/reportes/dashboard`       | Dashboard del administrador                                                            |
| GET            | `/api/reportes/generales`       | Reporte general de registros (admin)                                                   |
| GET            | `/api/reportes/comerciales`     | Reportes comerciales (admin, `?anio=`)                                                 |
| GET            | `/api/reportes/cobertura`       | Eventos por país, departamento y ciudad (admin)                                        |
| GET            | `/api/reportes/operacion`       | Historial de reservas, canceladas y eventos cancelados (admin)                         |
| GET            | `/api/planes`                   | Listar los planes de agente (tabla TIPO_PLAN)                                          |

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
- ✅ Administrar reservas (perfil agente): listado real de las reservas de sus eventos con filtros (texto, evento, estado, fecha), indicador de entradas vendidas, detalle y cancelación (total o parcial) con causa obligatoria.
- ✅ Reglas de eventos: duración mínima de 1 hora, registro con 24 h de anticipación y sin fechas pasadas; solo se reserva En Boletería; En Vivo y Finalizado cambian solos según la hora; cancelar un evento cancela todas sus reservas.
- ✅ Dashboard del administrador con estadísticas reales (`/api/reportes/dashboard`, solo administrador): totales de usuarios, reservas y eventos; ingresos, reservas y eventos por mes del año elegido; cobertura por país/departamento/ciudad; actividad reciente y resumen de pagos de reservas (`migracion_06.sql`).
- ✅ Script de base de datos consolidado: `develop.sql` (hoy `schema.sql` + `seeds.sql`) crea las 14 tablas finales con sus triggers; se quitaron las tablas que no pide el enunciado (CATEGORIA, AGRUPA, RESEÑA, METODO_PAGO y TIPO) con `migracion_07.sql`.
- ✅ Datos de demostración (`npm run db:demo`, `backend/database/seed_demo.js`): clientes, agentes, eventos y reservas en todos los estados (con causas de cancelación) para probar los reportes y la sustentación.
- ✅ API de usuarios (`/api/usuarios`, solo administrador): listado por rol con búsqueda, consulta, edición en transacción (persona, teléfonos y datos de cliente/agente/administrador) y suspensión / reactivación protegida (no se suspende a un cliente con reservas, a un agente con eventos, ni el admin a sí mismo).
- ✅ Gestión de clientes y agentes (`pages/admin/usuarios.html`, solo administrador): pestañas con buscador, paginación, Ver, Editar (persona, teléfonos, país → departamento → ciudad y datos del rol) y Suspender / Reactivar con motivo; el botón Suspender se deshabilita si el cliente tiene reservas o el agente tiene eventos.
- ✅ CRUD de administradores (pestaña «Administradores» en `pages/admin/usuarios.html`): solo un administrador con sesión registra a otro (persona, contraseña, salario y horario); un administrador no puede suspenderse a sí mismo, siempre queda al menos uno activo, y si un administrador es suspendido su sesión deja de servir.
- ✅ Reporte general con datos reales (`/api/reportes/generales`, solo administrador): totales de clientes, agentes, administradores, reservas y eventos con los nuevos del mes; eventos y reservas por estado; reservas y eventos por mes del año elegido y los últimos 50 registros del sistema con filtros.
- ✅ Reportes comerciales con datos reales (`/api/reportes/comerciales?anio=2026`, solo administrador): ingresos por agente y por cliente con su promedio general, ingresos totales por mes, número de reservas por evento y por mes, y eventos creados por agente y ciudad (activos, finalizados y cancelados).
- ✅ Reporte de cobertura y eventos con datos reales (`/api/reportes/cobertura?anio=2026` o `?anio=todos`, solo administrador): listado de eventos (código, nombre, estado, fecha) por país, departamento y ciudad de realización, filtros encadenados con el conteo de eventos de cada nivel, gráficas por país y departamento, ranking de ciudades y resumen de cobertura.
- ✅ Reporte de reservas y operación con datos reales (`/api/reportes/operacion?anio=2026` o `?anio=todos`, solo administrador): historial de reservas por cliente (selector, buscador y ficha del cliente), reservas canceladas con causa, fecha y **quién canceló** (`RESERVA.cancelada_por`), cancelaciones **parciales** de entradas (tabla `CANCELACION_ENTRADAS`), eventos cancelados con su causa y reservas afectadas, resumen operativo y actividad reciente (`migracion_08.sql`).
- ✅ «Mi perfil» conectado a la BD (`/api/auth/perfil`) para cliente, agente y administrador: cada usuario edita sus propios datos (nombre, correo, fecha de nacimiento, dirección, 1 a 3 teléfonos, país → departamento → ciudad y los campos de su rol que le corresponden), cambia su contraseña pidiendo la actual, el cliente activa o desactiva la publicidad y el agente ve sus eventos y reservas reales. Puntos, comisión, salario y horario solo los cambia el administrador desde Usuarios; el agente puede cambiar su plan desde su perfil. El perfil del admin ya no usa datos de ejemplo.
- ✅ Auditoría final: seguridad (límite de intentos de inicio de sesión, cabeceras de seguridad, sesiones de usuarios suspendidos invalidadas, cédula del agente oculta en la API pública), reglas de reservas (no se cancela un evento que ya empezó, precio congelado con reservas · migracion_09.sql), CRUD completo desde el panel admin (registrar clientes y agentes, eliminar reservas canceladas) y sin datos ni botones de ejemplo.
- ✅ Ajustes finales: reservas confirmadas al pagar (una reserva por compra), suspensión de usuarios (migracion_10.sql), imágenes fuera de los listados, reintentos de conexión con Neon y textos corregidos.
- ✅ Auditoría 3 (PR #50): no se suspende a clientes con reservas ni a agentes con eventos; los eventos de agentes suspendidos no se muestran ni se venden; un usuario suspendido o con la sesión vencida vuelve al login con un aviso; el cliente edita las observaciones de sus reservas confirmadas; el admin solo elimina reservas canceladas; fechas de eventos normalizadas a hora de Colombia; pie de página responsivo y columna de acciones fija en las reservas del agente.
- ✅ Auditoría 4: la reserva se confirma sola al pagar (sin confirmación manual, migracion_11), observaciones editables, pago simulado al subir de plan, fecha de nacimiento desde 1900 y mínimo 18 años.
- ✅ Auditoría 5: columna «Entradas» visible en Mis eventos del agente en portátiles y manual de usuario actualizado.

## Documentación

En la carpeta [`docs/`](docs/) (actualizados el 12 de noviembre de 2026):

| Documento | Contenido |
| --- | --- |
| [Manual de usuario](docs/Manual_Usuario_EventNova.pdf) | Uso del sistema por rol (cliente, agente y administrador), flujo de una reserva, preguntas frecuentes |
| [Diagramas UML](docs/Diagramas_UML_EventNova.pdf) | Diagrama de clases (pág. 1) y diagrama de paquetes MVC (pág. 2) |
| [Diagrama E-R](docs/Diagrama_ER_EventNova.pdf) | Entidad-relación en notación Chen (13 entidades + teléfono multivaluado) |
| [Modelo relacional](docs/Modelo_Relacional_EventNova.pdf) | Las 14 tablas de `schema.sql` con columnas, tipos y llaves |

## Convenciones

- Modelos: `nombreEntidadModel.js` · Controladores: `nombreEntidadController.js` · Vistas: `nombrePantallaView.js`
- Páginas HTML en minúsculas con guiones: `mis-reservas.html`
- Ramas de Git: `feature/nombre-funcionalidad`, que se integran a `main` mediante Pull Request.

## Equipo

- Daniel Castañeda Londoño https://github.com/alejandrocastalondo-source
- Sergio Alejandro Morales Florez https://github.com/sergix4
- Paola Andrea Carmona Salazar https://github.com/paolaandrea3883-blip
- Isabella Serna Torres https://github.com/IsabellaSernaT