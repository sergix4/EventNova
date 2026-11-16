// Script temporal para renombrar las tablas de mayúsculas a minúsculas en PostgreSQL
const pool = require('../config/db');

const tablas = [
  ['PAIS', 'pais'],
  ['TIPO_PLAN', 'tipo_plan'],
  ['ESTADO', 'estado'],
  ['ESTADO_RESERVA', 'estado_reserva'],
  ['DEPARTAMENTO', 'departamento'],
  ['CIUDAD', 'ciudad'],
  ['USUARIO', 'usuario'],
  ['TELEFONOS', 'telefonos'],
  ['AGENTE', 'agente'],
  ['ADMINISTRADOR', 'administrador'],
  ['CLIENTE', 'cliente'],
  ['EVENTO', 'evento'],
  ['RESERVA', 'reserva'],
  ['CANCELACION_ENTRADAS', 'cancelacion_entradas'],
];

async function renombrarTablas() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: existentes } = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );
    const nombresExistentes = new Set(existentes.map((r) => r.tablename));

    for (const [origen, destino] of tablas) {
      if (nombresExistentes.has(origen)) {
        await client.query(`ALTER TABLE public."${origen}" RENAME TO ${destino};`);
        console.log(`Renombrada: "${origen}" -> ${destino}`);
      } else if (nombresExistentes.has(destino)) {
        console.log(`Ya estaba en minúsculas: ${destino}`);
      } else {
        console.log(`No encontrada (omitida): "${origen}"`);
      }
    }

    // Actualizar funciones de triggers que referencian los nombres anteriores en su cuerpo
    await client.query(`
      CREATE OR REPLACE FUNCTION public.fn_reserva_fecha_cancelacion()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (SELECT nombre_estado FROM public.estado_reserva
            WHERE id_estado_reserva = NEW.id_estado_reserva) = 'Cancelada' THEN
          IF NEW.fecha_cancelacion IS NULL THEN
            NEW.fecha_cancelacion := NOW() AT TIME ZONE 'America/Bogota';
          END IF;
        ELSE
          NEW.fecha_cancelacion := NULL;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION public.fn_evento_fecha_cancelacion()
      RETURNS TRIGGER AS $$
      BEGIN
        IF (SELECT nombre_estado FROM public.estado
            WHERE id_estado = NEW.id_estado) = 'Cancelado' THEN
          IF NEW.fecha_cancelacion IS NULL THEN
            NEW.fecha_cancelacion := NOW() AT TIME ZONE 'America/Bogota';
          END IF;
        ELSE
          NEW.fecha_cancelacion := NULL;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query('COMMIT');

    const { rows: finales } = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
    );
    console.log('\nTablas actuales en public:', finales.map((r) => r.tablename));
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al renombrar tablas (ROLLBACK ejecutado):', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

renombrarTablas();
