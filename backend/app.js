// app.js (backend)
// Punto de entrada de EventNova.
//
// Este servidor Express cumple dos funciones:
//   1. Sirve la interfaz (HTML5 + CSS + JavaScript) que vive en la carpeta /frontend.
//   2. Expone la API REST bajo el prefijo /api, que es la que habla con PostgreSQL.
//
// Como la interfaz y la API salen del MISMO servidor (http://localhost:3000),
// ya no hace falta CORS ni un segundo servidor para el frontend.

// Hora de Colombia para TODO el servidor. Las fechas de los eventos se guardan
// en hora de Colombia, así "ahora" y "fecha del evento" se comparan igual sin
// importar en qué computador o servidor corra EventNova.
process.env.TZ = "America/Bogota";

require("dotenv").config();

// Tarea 16: sin un SESSION_SECRET propio el servidor NO arranca. Con un secreto
// conocido (como el del .env.example) cualquiera podría falsificar la cookie de sesión.
const SECRETO = process.env.SESSION_SECRET || "";
if (SECRETO.length < 32 || SECRETO.startsWith("cambia_este_secreto")) {
  console.error(
    "SESSION_SECRET falta, es muy corto o es el texto de ejemplo. Genera uno nuevo (ver .env.example).",
  );
  process.exit(1);
}

const path = require("path");
const express = require("express");
require("express-async-errors"); // Tarea 16: los errores de los controladores async llegan a manejarErrores
const session = require("express-session");
const manejarErrores = require("./middlewares/manejarErrores");

const indexRoutes = require("./routes/index");
require("./config/db"); // fuerza a que db.js se ejecute y pruebe la conexión

const app = express();
app.disable("x-powered-by"); // Tarea 16: no anunciar en cada respuesta que el servidor usa Express

// Auditoría final: cabeceras de seguridad básicas en todas las respuestas
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff"); // el navegador no "adivina" tipos de archivo
  res.setHeader("X-Frame-Options", "DENY"); // nadie puede meter EventNova dentro de un <iframe>
  res.setHeader("Referrer-Policy", "same-origin"); // no enviar la URL a otros sitios
  next();
});
const PORT = process.env.PORT || 3000;
const CARPETA_FRONTEND = path.join(__dirname, "..", "frontend");

// ─── Middlewares ────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true })); // leer datos de formularios
app.use(express.json({ limit: "5mb" })); // leer JSON en el body (5mb para la imagen del evento)

const DOS_HORAS = 2 * 60 * 60 * 1000;
app.use(
  session({
    name: "eventnova.sid", // nombre propio de la cookie (no el genérico connect.sid)
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, // cada petición vuelve a contar las 2 horas
    cookie: {
      httpOnly: true, // el JavaScript de la página no puede leer la cookie
      sameSite: "lax", // otra página web no puede usar la sesión del usuario
      secure: process.env.NODE_ENV === "production", // en producción, solo por HTTPS
      maxAge: DOS_HORAS, // la sesión vence tras 2 horas sin usar el sistema
    },
  }),
);

// ─── API REST (Modelo + Controlador) ────────────────────────────────────────
app.use("/api", indexRoutes);

// Si una ruta de la API no existe se responde en JSON
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Ruta de la API no encontrada" });
});

// ─── Archivos de terceros usados por la vista ───────────────────────────────
// Chart.js (gráficas del panel de administrador) se instala con npm y se sirve
// desde node_modules, así funciona sin internet.
app.use(
  "/vendor/chart.js",
  express.static(path.join(__dirname, "node_modules", "chart.js", "dist")),
);

// ─── Interfaz (Vista): HTML5 + CSS + JavaScript ─────────────────────────────
app.use(express.static(CARPETA_FRONTEND));

// Página no encontrada
app.use((req, res) => {
  res.status(404).sendFile(path.join(CARPETA_FRONTEND, "404.html"));
});

// Tarea 16: errores no controlados. SIEMPRE al final (lleva 4 parámetros: err, req, res, next)
app.use(manejarErrores);

app.listen(PORT, () => {
  console.log(`EventNova corriendo en http://localhost:${PORT}`);
});
