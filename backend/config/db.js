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
  idleTimeoutMillis: 30000,       // cierra conexiones que lleven 30 s sin uso
  connectionTimeoutMillis: 15000, // Neon puede tardar unos segundos en "despertar"
});

// Neon "duerme" la BD tras unos minutos sin uso y cierra las conexiones.
// Sin este manejador, ese cierre tumba el servidor.
pool.on('error', (err) => {
  console.error('PostgreSQL cerró una conexión inactiva:', err.message);
});

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