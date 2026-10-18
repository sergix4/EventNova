// database/importar_ubicaciones.js
// Carga TODOS los países, departamentos (estados/provincias) y ciudades del mundo
// en las tablas PAIS, DEPARTAMENTO y CIUDAD.
//
// Los datos vienen del paquete npm "country-state-city" (basado en la base abierta
// "countries-states-cities-database" de GitHub): 250 países, ~3.400 departamentos
// con ciudades y ~148.000 ciudades.
//
// Uso:  npm run db:ubicaciones
// - NO borra nada: si un país, departamento o ciudad ya existe (mismo nombre,
//   sin importar mayúsculas), lo deja como está y no lo duplica.
// - Se puede ejecutar varias veces sin problema.
// - Todo va en una transacción: si algo falla, no queda nada a medias.

require('dotenv').config();
const { Country, State, City } = require('country-state-city');
const pool = require('../config/db');

// Nombres de países en español usando el traductor que ya trae Node.js
// (ej. "Germany" -> "Alemania"). Si no hay traducción, se deja el nombre en inglés.
const enEspanol = new Intl.DisplayNames(['es'], { type: 'region' });
function nombrePais(pais) {
  try {
    return enEspanol.of(pais.isoCode) || pais.name;
  } catch {
    return pais.name;
  }
}

const TAMANO_LOTE = 10000; // ciudades por consulta (para no mandar 148.000 de una)

(async () => {
  const inicio = Date.now();
  const client = await pool.connect();

  try {
    // ── 1. Leer los datos del paquete ────────────────────────────────────────
    const paises = Country.getAllCountries();
    const departamentos = State.getAllStates();
    const ciudades = City.getAllCities();

    const nombrePorCodigo = new Map(paises.map(p => [p.isoCode, nombrePais(p)]));

    // Solo se importan los departamentos que tienen al menos una ciudad
    // (así el selector no se llena de regiones vacías).
    const conCiudades = new Set(ciudades.map(c => `${c.countryCode}|${c.stateCode}`));
    const deptosUtiles = departamentos.filter(d => conCiudades.has(`${d.countryCode}|${d.isoCode}`));
    const nombreDepto = new Map(deptosUtiles.map(d => [`${d.countryCode}|${d.isoCode}`, d.name]));

    console.log(`Datos leídos: ${paises.length} países, ${deptosUtiles.length} departamentos, ${ciudades.length} ciudades.`);

    await client.query('BEGIN');

    // ── 2. Países ────────────────────────────────────────────────────────────
    const r1 = await client.query(
      `INSERT INTO public."PAIS" (nombre_pais)
       SELECT nombre FROM unnest($1::text[]) AS v(nombre)
       ON CONFLICT DO NOTHING`,
      [paises.map(nombrePais)]
    );
    console.log(`Países nuevos: ${r1.rowCount}`);

    // ── 3. Departamentos (se unen con su país por nombre) ───────────────────
    const r2 = await client.query(
      `INSERT INTO public."DEPARTAMENTO" (id_pais, nombre_departamento)
       SELECT p.id_pais, v.depto
       FROM unnest($1::text[], $2::text[]) AS v(pais, depto)
       JOIN public."PAIS" p ON LOWER(p.nombre_pais) = LOWER(v.pais)
       ON CONFLICT DO NOTHING`,
      [deptosUtiles.map(d => nombrePorCodigo.get(d.countryCode)), deptosUtiles.map(d => d.name)]
    );
    console.log(`Departamentos nuevos: ${r2.rowCount}`);

    // ── 4. Ciudades por lotes (se unen con su departamento y país por nombre) ─
    let ciudadesNuevas = 0;
    for (let i = 0; i < ciudades.length; i += TAMANO_LOTE) {
      const lote = ciudades.slice(i, i + TAMANO_LOTE);
      const r3 = await client.query(
        `INSERT INTO public."CIUDAD" (id_departamento, nombre_ciudad)
         SELECT d.id_departamento, v.ciudad
         FROM unnest($1::text[], $2::text[], $3::text[]) AS v(pais, depto, ciudad)
         JOIN public."PAIS" p ON LOWER(p.nombre_pais) = LOWER(v.pais)
         JOIN public."DEPARTAMENTO" d ON d.id_pais = p.id_pais
                                     AND LOWER(d.nombre_departamento) = LOWER(v.depto)
         ON CONFLICT DO NOTHING`,
        [
          lote.map(c => nombrePorCodigo.get(c.countryCode)),
          lote.map(c => nombreDepto.get(`${c.countryCode}|${c.stateCode}`)),
          lote.map(c => c.name),
        ]
      );
      ciudadesNuevas += r3.rowCount;
      console.log(`  Ciudades: ${Math.min(i + TAMANO_LOTE, ciudades.length)} de ${ciudades.length} procesadas...`);
    }
    console.log(`Ciudades nuevas: ${ciudadesNuevas}`);

    await client.query('COMMIT');
    console.log(`¡Listo! Ubicaciones importadas en ${((Date.now() - inicio) / 1000).toFixed(1)} s.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al importar ubicaciones (no se guardó nada):', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();