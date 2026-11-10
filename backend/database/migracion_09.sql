-- migracion_09.sql
-- Auditoría final · Reglas de reservas:
-- permite que el SISTEMA cancele reservas (cancelada_por = 'Sistema').
-- Se usa cuando un evento termina y el agente nunca confirmó la reserva:
-- en vez de quedar "Reservada" para siempre, se cancela automáticamente.
--
-- No borra ni cambia ningún dato. Se puede ejecutar varias veces.
-- Uso:  npm run db:migrar -- migracion_09.sql

BEGIN;

ALTER TABLE public."RESERVA" DROP CONSTRAINT IF EXISTS ck_reserva_cancelada_por;
ALTER TABLE public."RESERVA" ADD CONSTRAINT ck_reserva_cancelada_por
  CHECK (cancelada_por IN ('Cliente', 'Agente', 'Administrador', 'Sistema'));

COMMIT;