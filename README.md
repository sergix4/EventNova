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
│   ├── models/               # MODELO: consultas SQL (usuario, plan, país)
│   ├── controllers/          # CONTROLADOR: reciben la petición y responden JSON
│   ├── routes/               # Rutas /api/auth, /api/paises, /api/status
│   ├── database/             # Scripts SQL (develop.sql, seed_planes.sql)
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

| Capa | Backend (servidor) | Frontend (navegador) |
| --- | --- | --- |
| **Modelo** | `backend/models/*.js` — consultas SQL a PostgreSQL | `frontend/js/models/*.js` — piden los datos a la API con `fetch` |
| **Vista** | Respuestas JSON de la API | `frontend/pages/*.html` + `frontend/js/views/*.js` + `frontend/css/` |
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

### 1. Base de datos (PostgreSQL)

1. Crear la base de datos `eventnova_db` y el usuario `eventnova_user` con permisos sobre ella.
2. Ejecutar en pgAdmin (Query Tool) los scripts de `backend/database/`:
   `develop.sql` y luego `seed_planes.sql`.

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

### 3. Abrir la aplicación

Abrir **http://localhost:3000** en el navegador. Un solo comando levanta todo:
el mismo servidor entrega las páginas HTML y responde la API.

> ⚠️ No abrir los `.html` con doble clic ni con *Live Server*: las páginas usan
> módulos de JavaScript y la sesión del servidor, así que deben abrirse desde
> `http://localhost:3000`.

## API disponible

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/status` | Estado del servidor |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar cliente |
| POST | `/api/auth/register-agente` | Registrar agente (con plan) |
| GET | `/api/auth/sesion` | Usuario con sesión activa (o `null`) |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET/POST | `/api/paises` | Listar / crear países |
| GET/PUT/DELETE | `/api/paises/:id` | Consultar / editar / eliminar un país |

## Estado actual

- ✅ Registro e inicio de sesión de clientes y agentes contra PostgreSQL.
- ✅ CRUD de países (Ubicación geográfica) contra PostgreSQL.
- 🟡 Eventos, reservas y reportes usan **datos de ejemplo** (`frontend/js/models/datosEjemplo.js`).
  Cuando exista cada endpoint solo se cambia el modelo correspondiente
  (por ejemplo `eventoModel.js`) para que use `peticion('/api/...')`; las vistas y
  controladores no cambian.

## Convenciones

- Modelos: `nombreEntidadModel.js` · Controladores: `nombreEntidadController.js` · Vistas: `nombrePantallaView.js`
- Páginas HTML en minúsculas con guiones: `mis-reservas.html`
- Ramas de Git: `feature/nombre-funcionalidad`, que se integran a `main` mediante Pull Request.

## Equipo

- Sergio Alejandro Morales Florez
- Daniel Castañeda Londoño
- Paola Andrea Carmona Salazar
- Isabella Serna Torres
