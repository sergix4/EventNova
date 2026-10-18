// conectarsql.js
// Crea las tablas y carga los datos base en la BD configurada en el .env
// (sirve igual para PostgreSQL local o para Neon).
//
// Uso normal (base vacía):        npm run db:init
// Recrear una base que ya tiene tablas (BORRA TODO):  npm run db:init -- --forzar
//
// CANDADO: si la base ya tiene tablas, el script NO hace nada a menos que se
// agregue --forzar. Así nadie borra por accidente la base compartida de Neon.
const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

// Se ejecutan en este orden
const SCRIPTS = ['develop.sql', 'seed_planes.sql', 'seed_estados.sql'];
const FORZAR = process.argv.includes('--forzar');
const DESTINO = pool.usaNeon ? 'Neon (base COMPARTIDA del equipo)' : 'PostgreSQL local';

(async () => {
  try {
    // ── Candado ────────────────────────────────────────────────────────────
    const { rows } = await pool.query(`SELECT to_regclass('public."PAIS"') AS tabla`);
    const yaTieneTablas = rows[0].tabla !== null;

    if (yaTieneTablas && !FORZAR) {
      console.error(`\n⛔ La base de datos ${DESTINO} YA tiene tablas.`);
      console.error('   develop.sql las BORRARÍA junto con todos sus datos, así que no se hizo nada.');
      console.error('   Si de verdad quieres recrearla desde cero: npm run db:init -- --forzar\n');
      process.exitCode = 1;
      return;
    }

    if (yaTieneTablas && FORZAR) {
      console.warn(`⚠️  --forzar activado: se BORRARÁN todas las tablas de ${DESTINO}.`);
    }

    // ── Ejecutar scripts ───────────────────────────────────────────────────
    for (const archivo of SCRIPTS) {
      const sql = fs.readFileSync(path.join(__dirname, 'database', archivo), 'utf8');
      console.log(`Ejecutando ${archivo} en ${DESTINO}...`);
      await pool.query(sql);
    }
    console.log('¡Tablas creadas y datos base cargados correctamente!');
  } catch (error) {
    console.error('Error al ejecutar los scripts:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();