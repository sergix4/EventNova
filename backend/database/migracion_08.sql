-- migracion_08.sql
-- Sprint 3 · Tarea 10: Reporte de reservas y operación.
-- Agrega a una base que YA existe (Neon) lo que el reporte necesita para
-- saber QUIÉN canceló y para mostrar las cancelaciones PARCIALES de entradas:
--
--   + RESERVA.cancelada_por     -> 'Cliente', 'Agente' o 'Administrador'
--                                  (quién canceló la reserva COMPLETA)
--   + tabla CANCELACION_ENTRADAS -> una fila por cada cancelación PARCIAL
--                                  (antes solo quedaba una nota en observaciones)
--
-- También llena esos datos para las cancelaciones que ya existían:
--   - cancelada_por: se deduce de la causa que guarda el sistema
--   - CANCELACION_ENTRADAS: se lee de las notas "[fecha] El cliente canceló 1 de 3
--     entradas. Causa: ..." que el sistema ya dejaba en observaciones
--
-- No borra ni cambia ningún otro dato. Se puede ejecutar varias veces.
-- Uso:  npm run db:migrar -- migracion_08.sql

BEGIN;

-- 1. Quién canceló la reserva completa
ALTER TABLE public."RESERVA" ADD COLUMN IF NOT EXISTS cancelada_por VARCHAR(15);
ALTER TABLE public."RESERVA" DROP CONSTRAINT IF EXISTS ck_reserva_cancelada_por;
ALTER TABLE public."RESERVA" ADD CONSTRAINT ck_reserva_cancelada_por
  CHECK (cancelada_por IN ('Cliente', 'Agente', 'Administrador'));

-- 1.1 Reservas canceladas que ya existían (se deduce por la causa)
--     a) Al cancelar un EVENTO, el sistema escribe "Evento cancelado por el organizador: ..."
UPDATE public."RESERVA"
SET cancelada_por = 'Agente'
WHERE cancelada_por IS NULL
  AND causa_cancelacion LIKE 'Evento cancelado por el organizador:%';

--     b) Si el cliente cancela sin escribir causa, el sistema pone "Cancelada por el cliente."
--        (y las 2 causas que usa la demo para los clientes)
UPDATE public."RESERVA"
SET cancelada_por = 'Cliente'
WHERE cancelada_por IS NULL
  AND causa_cancelacion IN ('Cancelada por el cliente.',
                            'El cliente informó que no podrá asistir',
                            'Cambio de planes del cliente');
--     Las demás canceladas antiguas quedan en NULL: el reporte dice "Sin registro".

-- 2. Cancelaciones PARCIALES de entradas (la reserva sigue activa con las demás)
CREATE TABLE IF NOT EXISTS public."CANCELACION_ENTRADAS" (
    id_cancelacion      SERIAL PRIMARY KEY,
    id_reserva          INTEGER NOT NULL,
    entradas_canceladas INTEGER NOT NULL,              -- cuántas se cancelaron
    entradas_antes      INTEGER NOT NULL,              -- cuántas tenía la reserva antes
    valor_cancelado     NUMERIC(12, 2) NOT NULL,       -- entradas_canceladas x precio_base
    causa               TEXT NOT NULL,
    cancelada_por       VARCHAR(15) NOT NULL,          -- Cliente, Agente o Administrador
    fecha_cancelacion   TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'America/Bogota'),

    CONSTRAINT fk_cancelacion_reserva FOREIGN KEY (id_reserva)
      REFERENCES public."RESERVA" (id_reserva) ON DELETE CASCADE,
    CONSTRAINT ck_cancelacion_entradas CHECK (entradas_canceladas > 0 AND entradas_canceladas < entradas_antes),
    CONSTRAINT ck_cancelacion_valor    CHECK (valor_cancelado >= 0),
    CONSTRAINT ck_cancelacion_por      CHECK (cancelada_por IN ('Cliente', 'Agente', 'Administrador'))
);
CREATE INDEX IF NOT EXISTS ix_cancelacion_reserva ON public."CANCELACION_ENTRADAS" (id_reserva);

-- 2.1 Pasar a la tabla las cancelaciones parciales que ya estaban como nota en observaciones.
--     Formato de la nota: [5/11/2026] El cliente canceló 1 de 3 entradas. Causa: ...
--     Solo se hace con las reservas que todavía no tienen filas en la tabla (para no duplicar).
INSERT INTO public."CANCELACION_ENTRADAS"
  (id_reserva, entradas_canceladas, entradas_antes, valor_cancelado, causa, cancelada_por, fecha_cancelacion)
SELECT r.id_reserva,
       nota[3]::int,
       nota[4]::int,
       nota[3]::int * e.precio_base,
       nota[5],
       INITCAP(nota[2]),                         -- cliente -> Cliente
       TO_DATE(nota[1], 'DD/MM/YYYY')::timestamp
FROM public."RESERVA" r
JOIN public."EVENTO" e ON e.id_evento = r.id_evento
CROSS JOIN LATERAL regexp_matches(
  r.observaciones,
  '\[(\d{1,2}/\d{1,2}/\d{4})\] El (cliente|agente|administrador) canceló (\d+) de (\d+) entradas\. Causa: ([^\n]*)',
  'g'
) AS nota
WHERE r.observaciones IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public."CANCELACION_ENTRADAS" ce WHERE ce.id_reserva = r.id_reserva);

COMMIT;