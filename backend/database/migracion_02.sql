-- migracion_02.sql
-- Restringe los estados de la RESERVA a: Reservada, Confirmada, Cancelada.
-- Es para las bases que ya existían; develop.sql ya trae esta restricción.
-- Se puede ejecutar varias veces sin problema y NO borra datos.

ALTER TABLE public."RESERVA" DROP CONSTRAINT IF EXISTS ck_reserva_estado;

ALTER TABLE public."RESERVA"
  ADD CONSTRAINT ck_reserva_estado
  CHECK (estado_reserva IN ('Reservada', 'Confirmada', 'Cancelada'));

ALTER TABLE public."RESERVA"
  ALTER COLUMN estado_reserva SET DEFAULT 'Reservada';