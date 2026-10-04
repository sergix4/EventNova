// seed_admin.js
// Crea un administrador inicial (USUARIO + ADMINISTRADOR) en una transacción.
// Uso:  node database/seed_admin.js
// Opcional: ADMIN_CORREO, ADMIN_PASSWORD, ADMIN_ID en el .env
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const numero_id = process.env.ADMIN_ID || '0000000001';
const correo = (process.env.ADMIN_CORREO || 'admin@eventnova.com').toLowerCase();
const password = process.env.ADMIN_PASSWORD || 'Admin12345';

(async () => {
  const client = await pool.connect();
  try {
    const existe = await client.query(
      'SELECT 1 FROM public."USUARIO" WHERE correo = $1 OR numero_id = $2',
      [correo, numero_id]
    );
    if (existe.rowCount > 0) {
      console.log('El administrador ya existe. No se hizo nada.');
      return;
    }

    const hash = await bcrypt.hash(password, 10);
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO public."USUARIO" (numero_id, correo, nombre, contraseña, direccion)
       VALUES ($1, $2, $3, $4, $5)`,
      [numero_id, correo, 'Administrador EventNova', hash, 'Oficina principal']
    );
    await client.query(
      `INSERT INTO public."ADMINISTRADOR" (numero_id, codigo_admin)
       VALUES ($1, $2)`,
      [numero_id, `ADM-${numero_id}`]
    );
    await client.query('COMMIT');
    console.log(`Administrador creado → correo: ${correo} | contraseña: ${password}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear el administrador:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
})();