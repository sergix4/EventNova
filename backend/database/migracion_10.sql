-- migracion_10.sql
-- Ajustes finales · Suspender usuarios en vez de eliminarlos (recomendación del docente).
-- Un usuario suspendido conserva TODA su información (reservas, eventos,
-- teléfonos...), pero no puede iniciar sesión hasta que el administrador lo reactive.
--
-- No borra ni cambia ningún dato: todos los usuarios actuales quedan activos.
-- Se puede ejecutar varias veces.
-- Uso:  npm run db:migrar -- migracion_10.sql

BEGIN;

ALTER TABLE public."USUARIO" ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public."USUARIO" ADD COLUMN IF NOT EXISTS fecha_suspension TIMESTAMP;
ALTER TABLE public."USUARIO" ADD COLUMN IF NOT EXISTS motivo_suspension VARCHAR(300);

COMMIT;