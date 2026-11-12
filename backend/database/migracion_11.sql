-- migracion_11.sql
-- Auditoría 4 · La reserva se confirma sola al pagar.
--   1. Las reservas que todavía estén "Reservada" (datos de demostración
--      antiguos) pasan a "Confirmada": en EventNova toda reserva se paga al crearla.
--   2. Las descripciones de los planes solo prometen lo que el sistema hace.
-- No borra datos. Se puede ejecutar varias veces.
-- Uso:  npm run db:migrar -- migracion_11.sql

BEGIN;

UPDATE public."RESERVA"
SET id_estado_reserva = (SELECT id_estado_reserva FROM public."ESTADO_RESERVA"
                         WHERE nombre_estado = 'Confirmada')
WHERE id_estado_reserva = (SELECT id_estado_reserva FROM public."ESTADO_RESERVA"
                           WHERE nombre_estado = 'Reservada');

UPDATE public."TIPO_PLAN"
SET descripcion_plan = 'Hasta 20 eventos activos, gestión de reservas, estadísticas de tus eventos'
WHERE nombre_plan = 'Plan Profesional';

UPDATE public."TIPO_PLAN"
SET descripcion_plan = 'Eventos activos ilimitados, gestión de reservas, estadísticas de tus eventos'
WHERE nombre_plan = 'Plan Empresa';

COMMIT;