# EventNova

Sistema web de gestión y reserva de eventos y espectáculos — Proyecto Integrador.

> **Esta es la arquitectura oficial del proyecto**, decidida por el equipo: backend
> (Express API) + frontend (React, basado en el prototipo de Figma Make). La
> estructura original en EJS quedó archivada en la rama `archive/estructura-mvc`
> como respaldo histórico.

## Cambio de arquitectura

La estructura original (Node + Express + EJS) generaba el HTML directamente en el
servidor. El prototipo de Figma viene como una aplicación **React + Vite +
TypeScript** independiente, con sus propias pantallas ya diseñadas. Para aprovecharla
sin perder el patrón MVC exigido por el curso, el proyecto se dividió en dos partes
que se ejecutan por separado:

```
eventnova/
├── backend/      # API REST en Node/Express — Modelo, Controlador y Rutas
└── frontend/     # Interfaz en React (el prototipo de Figma) — la Vista
```

### ¿Cómo se mapea esto al patrón MVC?

| Capa MVC | Dónde vive ahora |
| --- | --- |
| **Modelo** | `backend/models` — sigue igual, las consultas SQL a PostgreSQL |
| **Controlador** | `backend/controllers` — sigue igual, recibe la petición y decide la respuesta |
| **Vista** | `frontend/src/pages` — antes eran archivos `.ejs`, ahora son componentes `.tsx` de React (las pantallas que diseñó Figma) |

La diferencia clave: antes el Controlador respondía con **HTML ya armado**
(`res.render(...)`). Ahora el Controlador responde con **JSON** (`res.json(...)`), y
es React quien arma la pantalla con esos datos. Por eso `backend/` ya no tiene
carpetas `views/` ni `public/` — esa responsabilidad la asumió por completo
`frontend/`.

## Backend (`/backend`)

- Node.js + Express + PostgreSQL (`pg`)
- Expone todos sus endpoints bajo el prefijo `/api` (ej. `/api/status`)
- Usa `cors` para permitir que el frontend (que corre en otro puerto) le haga
  peticiones

  ## Configuración de la base de datos (PostgreSQL)

### Requisitos
- PostgreSQL 18 instalado (con pgAdmin 4).

### Pasos
1. Crear una base de datos llamada `eventnova_db`.
2. Crear un usuario `eventnova_user` con permisos ALL sobre esa base.
3. En la carpeta `backend/`, copiar `.env.example` como `.env` y completar con tus propias credenciales:

   \`\`\`
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=eventnova_db
   DB_USER=eventnova_user
   DB_PASSWORD=tu_contraseña
   \`\`\`

4. Instalar dependencias: `npm install` (dentro de `backend/`).
5. Levantar el servidor: `npm run dev`.
6. Verificar en la terminal el mensaje `Conexion a PostgreSQL establecida correctamente.`

### Instalación

```
cd backend
npm install
cp .env.example .env   # completar con tus datos de PostgreSQL
npm run dev
```

Corre en `http://localhost:3000`.

## Frontend (`/frontend`)

- React 19 + Vite + TypeScript + Tailwind CSS
- Contiene las pantallas diseñadas en Figma Make: login, registro, catálogo de
  eventos, panel de cliente, panel de agente y dashboard de administrador con
  reportes
- `src/pages/` — cada pantalla (equivalente a una Vista)
- `src/services/api.ts` — punto único de comunicación con el backend
- `src/sharedData.ts` — **datos de ejemplo temporales**; se irán reemplazando por
  datos reales del backend a medida que se construyan los endpoints

### Instalación

```
cd frontend
npm install
cp .env.example .env
npm run dev
```

Corre en `http://localhost:5173`.

## Ejecutar el proyecto completo

Se necesitan **dos terminales abiertas al mismo tiempo**: una corriendo
`backend` (`npm run dev`, puerto 3000) y otra corriendo `frontend` (`npm run
dev`, puerto 5173). El navegador se abre en la URL del frontend
(`http://localhost:5173`); el backend queda funcionando "detrás" como API.

## Convención de nombres

- Modelos: `nombreEntidadModel.js`
- Controladores: `nombreEntidadController.js`
- Páginas del frontend: `NombrePantallaPage.tsx` o `NombreRolDashboard.tsx`
- Ramas de Git: `feature/nombre-funcionalidad`

## Ramas del repositorio

- `main` → rama estable con la arquitectura oficial (esta rama)
- `develop` → integración diaria del equipo, nace igual que `main`
- `archive/estructura-mvc` → versión anterior (EJS) descartada, conservada como respaldo histórico

## Equipo

- Sergio Alejandro Morales Florez
- Daniel Castañeda Londoño
- Paola Andrea Carmona Salazar
- Isabella Serna Torres
