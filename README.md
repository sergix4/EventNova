# EventNova

Sistema web de gestión y reserva de eventos y espectáculos — **Proyecto Integrador 2026-2** (Bases de Datos y Programación en Ambiente Web I).

EventNova permite a **clientes** explorar y reservar eventos, a **agentes** publicar y administrar sus eventos y reservas, y a **administradores** consultar reportes del sistema. La información se guarda en una base de datos relacional **PostgreSQL**.

---

## Tabla de contenido

1. [Tecnologías](#tecnologías)
2. [Arquitectura y patrón MVC](#arquitectura-y-patrón-mvc)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Base de datos](#base-de-datos)
5. [Instalación y ejecución](#instalación-y-ejecución)
6. [API REST (endpoints)](#api-rest-endpoints)
7. [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
8. [Convención de nombres](#convención-de-nombres)
9. [Equipo](#equipo)

---

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Backend | Node.js, Express, `pg` (PostgreSQL), `bcryptjs`, `express-session`, `cors`, `dotenv`, `nodemon` |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Recharts |
| Base de datos | PostgreSQL 18 (administrada con pgAdmin 4) |
| Gestión del proyecto | Jira (Scrum, 3 sprints) |
| Diseño | Figma (Figma Make) |
| Control de versiones | Git + GitHub |

---

## Arquitectura y patrón MVC

El proyecto se divide en dos aplicaciones que se ejecutan por separado: una **API REST** (backend) y una **interfaz React** (frontend). Así se conserva el patrón **Modelo–Vista–Controlador** exigido por el curso:

| Capa MVC | Dónde vive | Responsabilidad |
| --- | --- | --- |
| **Modelo** | `backend/models` | Consultas SQL a PostgreSQL. No sabe nada de HTTP ni de sesiones. |
| **Controlador** | `backend/controllers` | Recibe la petición, valida datos, llama al Modelo y responde con JSON. |
| **Rutas** | `backend/routes` | Conectan una URL + verbo HTTP con un método del Controlador. |
| **Vista** | `frontend/src/pages` | Componentes React (`.tsx`) que dibujan cada pantalla con los datos recibidos. |

Flujo de una petición:

```
Vista (React) → services/api.ts → Ruta → Controlador → Modelo → PostgreSQL
                                                                    │
Vista (React) ← JSON ←──────────── Controlador ←────────────────────┘
```

> La versión original del proyecto (Express + EJS) quedó archivada en la rama `archive/estructura-mvc`.

---

## Estructura del proyecto

```
EventNova/
├── backend/
│   ├── app.js                  # Punto de entrada: middlewares, sesión, CORS y rutas /api
│   ├── conectarsql.js          # Script auxiliar: ejecuta database/develop.sql para crear las tablas
│   ├── config/
│   │   └── db.js               # Pool de conexión a PostgreSQL (reutilizable)
│   ├── controllers/
│   │   ├── authController.js   # login, register, registerAgente, logout
│   │   ├── homeController.js   # estado de la API
│   │   └── paisController.js   # CRUD de países
│   ├── models/
│   │   ├── usuarioModel.js     # Acceso a datos de usuarios (login y registro)
│   │   ├── planModel.js        # Consulta de planes de agente
│   │   └── paisModel.js        # Consultas SQL de países
│   ├── routes/
│   │   ├── index.js            # Agrupa todas las rutas bajo /api
│   │   ├── authRoutes.js       # /api/auth/*
│   │   └── paisRoutes.js       # /api/paises/*
│   ├── database/
│   │   ├── develop.sql         # DDL: creación de las tablas
│   │   └── seed_planes.sql     # Datos iniciales: planes de agente
│   ├── .env.example            # Plantilla de variables de entorno
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Página de inicio + navegación entre pantallas según el rol
│   │   ├── main.tsx            # Punto de entrada de React
│   │   ├── pages/              # Una pantalla por archivo (login, registro, paneles, reportes...)
│   │   ├── services/api.ts     # Punto único de comunicación con el backend
│   │   └── sharedData.ts       # Datos de ejemplo temporales (se reemplazan por datos reales)
│   ├── .env.example
│   └── package.json
├── docs/                       # Diagramas UML, ER y documentación
└── README.md
```

---

## Base de datos

Motor: **PostgreSQL**. El script `backend/database/develop.sql` crea las siguientes tablas:

| Grupo | Tablas |
| --- | --- |
| Catálogos | `PAIS`, `TIPO_PLAN`, `CATEGORIA`, `ESTADO`, `TIPO`, `METODO_PAGO` |
| Ubicación | `DEPARTAMENTO` (→ `PAIS`), `CIUDAD` (→ `DEPARTAMENTO`) |
| Personas | `USUARIO` (→ `CIUDAD`), `TELEFONOS` (→ `USUARIO`), `CLIENTE`, `AGENTE` (→ `TIPO_PLAN`), `ADMINISTRADOR` |
| Eventos y reservas | `EVENTO`, `AGRUPA` (evento–categoría), `RESERVA`, `RESEÑA` |

Notas de diseño:

- `USUARIO` guarda los datos comunes; `CLIENTE`, `AGENTE` y `ADMINISTRADOR` comparten su llave primaria (`numero_id`) con `USUARIO`. **El rol de una persona se determina por la tabla en la que aparece.**
- Las contraseñas se almacenan **con hash** (`bcryptjs`), nunca en texto plano.
- Un usuario puede tener varios teléfonos (relación 1 a muchos en `TELEFONOS`).

> ⚠️ `develop.sql` ejecuta `DROP TABLE ... CASCADE` antes de cada `CREATE TABLE`: **borra todos los datos** cada vez que se ejecuta.

---

## Instalación y ejecución

### Requisitos

- [Node.js](https://nodejs.org/) (el equipo usa v24.2.0)
- PostgreSQL 18 y pgAdmin 4
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/sergix4/EventNova.git
cd EventNova
git checkout develop
```

### 2. Configurar la base de datos

1. En pgAdmin, crear una base de datos llamada `eventnova_db`.
2. Crear un usuario `eventnova_user` con todos los permisos sobre esa base.
3. Crear las tablas (desde la carpeta `backend/`, después de configurar el `.env` del paso 3):

   ```bash
   node conectarsql.js
   ```

   Debe aparecer: `¡Las tablas se crearon correctamente!`
4. Cargar los planes de agente: abrir `backend/database/seed_planes.sql` en pgAdmin (Query Tool) y ejecutarlo. **Es obligatorio** para poder registrar agentes.

### 3. Configurar y levantar el backend

```bash
cd backend
npm install
cp .env.example .env      # en Windows PowerShell: copy .env.example .env
```

Completar el archivo `.env` con tus datos:

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto de la API | `3000` |
| `NODE_ENV` | Entorno | `development` |
| `DB_HOST` | Servidor de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base | `eventnova_db` |
| `DB_USER` | Usuario de la base | `eventnova_user` |
| `DB_PASSWORD` | Contraseña del usuario | *(la tuya)* |
| `SESSION_SECRET` | Secreto para firmar la sesión (largo y aleatorio) | *(cadena aleatoria)* |
| `FRONTEND_URL` | URL del frontend permitida por CORS | `http://localhost:5173` |

```bash
npm run dev
```

En la terminal deben aparecer:

```
API de EventNova corriendo en http://localhost:3000
Conexion a PostgreSQL establecida correctamente.
```

### 4. Configurar y levantar el frontend

En **otra terminal**:

```bash
cd frontend
npm install
cp .env.example .env      # en Windows PowerShell: copy .env.example .env
npm run dev
```

Abrir `http://localhost:5173` en el navegador.

> Se necesitan **las dos terminales abiertas a la vez**: backend (puerto 3000) y frontend (puerto 5173). No uses la extensión Live Server de VS Code para este proyecto.



---

## API REST (endpoints)

Todas las rutas están bajo el prefijo `/api`.

### Estado

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/status` | Verifica que la API esté funcionando. |

### Autenticación — `/api/auth`

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/auth/login` | Inicia sesión con correo y contraseña. Devuelve el usuario y su rol. |
| POST | `/api/auth/register` | Registra un **cliente** (con inicio de sesión automático). |
| POST | `/api/auth/register-agente` | Registra un **agente** con empresa y plan (con inicio de sesión automático). |
| POST | `/api/auth/logout` | Cierra la sesión. |

Validaciones principales: campos obligatorios, contraseña de mínimo 8 caracteres, correo e identificación únicos, plan válido, y registro transaccional (`BEGIN / COMMIT / ROLLBACK`) en `USUARIO` + `CLIENTE`/`AGENTE`.

### Países — `/api/paises`

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/paises` | Lista todos los países (orden alfabético). |
| GET | `/api/paises/:id` | Consulta un país. |
| POST | `/api/paises` | Crea un país (nombre obligatorio y sin repetir). |
| PUT | `/api/paises/:id` | Modifica un país. |
| DELETE | `/api/paises/:id` | Elimina un país (se bloquea si tiene departamentos asociados). |

---


## Flujo de trabajo con Git

Ramas:

- `main` → versión estable.
- `develop` → integración diaria del equipo.
- `feature/<nombre>` → una rama por tarea, creada desde `develop`.
- `archive/estructura-mvc` → versión anterior (EJS), conservada como respaldo.

Pasos para cada tarea:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-tarea

# ... trabajar y probar ...

git add .
git commit -m "feat: descripción corta del cambio"
git push origin feature/nombre-de-la-tarea
```

Luego abrir un **Pull Request** en GitHub hacia `develop`, revisarlo y hacer el merge.

---

## Convención de nombres

- Modelos: `nombreEntidadModel.js`
- Controladores: `nombreEntidadController.js`
- Rutas: `nombreEntidadRoutes.js`
- Páginas del frontend: `NombrePantallaPage.tsx` o `NombreRolDashboard.tsx`
- Ramas de Git: `feature/nombre-funcionalidad`

---

## Equipo

- Sergio Alejandro Morales Florez
- Daniel Castañeda Londoño
- Paola Andrea Carmona Salazar
- Isabella Serna Torres