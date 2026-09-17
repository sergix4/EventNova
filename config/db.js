// config/db.js
// Modulo reutilizable de conexion a PostgreSQL (Tarea 9 del Sprint 1)
// Se usa "pool" para reutilizar conexiones en lugar de abrir una nueva por consulta.

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Prueba de conexion al iniciar el servidor
pool.connect()
  .then((client) => {
    console.log('Conexion a PostgreSQL establecida correctamente.');
    client.release();
  })
  .catch((err) => {
    console.error('Error al conectar con PostgreSQL:', err.message);
  });

module.exports = pool;
