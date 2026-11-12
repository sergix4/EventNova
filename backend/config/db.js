// config/db.js
// Modulo reutilizable de conexion a PostgreSQL (Tarea 9 del Sprint 1)
// - Si el .env tiene DATABASE_URL  -> se conecta a Neon (nube, con SSL).
// - Si no la tiene                -> usa DB_HOST, DB_PORT... (PostgreSQL local).

require('dotenv').config();
const { Pool } = require('pg');

const usaNeon = Boolean(process.env.DATABASE_URL);

const datosConexion = usaNeon
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    };

const pool = new Pool({
  ...datosConexion,
  max: 10,                        // máximo de conexiones abiertas a la vez
  idleTimeoutMillis: 10000,       // cierra NOSOTROS las conexiones que lleven 10 s sin uso
  connectionTimeoutMillis: 15000, // Neon puede tardar unos segundos en "despertar"
  keepAlive: true,                // evita que el router/WiFi corte en silencio las conexiones abiertas
});

// Neon "duerme" la BD tras unos minutos sin uso y cierra las conexiones.
// Sin este manejador, ese cierre tumba el servidor.
pool.on('error', (err) => {
  console.error('PostgreSQL cerró una conexión inactiva:', err.message);
});

// ─── Reintentos al CONECTAR ──────────────────────────────────────────────────
// Si Neon está "despertando" o el internet tuvo un corte de unos segundos,
// abrir la conexión puede fallar con "Connection terminated due to connection
// timeout". En vez de responder 500 de una, se reintenta hasta 3 veces.
// Solo se reintenta ABRIR la conexión (la consulta todavía no se ha enviado),
// por eso es seguro: nunca se ejecuta dos veces un INSERT o un UPDATE.
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const conectarOriginal = pool.connect.bind(pool);
const queryOriginal = pool.query.bind(pool);

async function conectarConReintentos() {
  for (let intento = 1; ; intento++) {
    try {
      return await conectarOriginal();
    } catch (error) {
      if (intento >= 3) throw error;
      console.warn(`No se pudo conectar a PostgreSQL (intento ${intento} de 3): ${error.message}. Reintentando...`);
      await esperar(1000 * intento); // espera 1 s y luego 2 s
    }
  }
}

// pool.connect() -> lo usan las transacciones (BEGIN / COMMIT)
pool.connect = function (callback) {
  if (callback) return conectarOriginal(callback); // forma interna que usa la librería pg
  return conectarConReintentos();
};

// pool.query() -> lo usan casi todos los modelos
pool.query = async function (...args) {
  if (typeof args[args.length - 1] === 'function') return queryOriginal(...args); // forma con callback
  const client = await conectarConReintentos();
  let fallo;
  try {
    return await client.query(...args);
  } catch (error) {
    fallo = error;
    throw error;
  } finally {
    client.release(fallo); // si la consulta falló, esa conexión se descarta
  }
};

// Prueba de conexion al iniciar el servidor
pool.connect()
  .then((client) => {
    console.log(`Conexion a PostgreSQL (${usaNeon ? 'Neon' : 'local'}) establecida correctamente.`);
    client.release();
  })
  .catch((err) => {
    console.error('Error al conectar con PostgreSQL:', err.message);
  });

pool.usaNeon = usaNeon; // lo usa conectarsql.js para mostrar a qué base se conectó

module.exports = pool;