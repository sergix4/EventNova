-- migracion_05.sql
-- Sprint 2 · Tarea 5: Modelo y migración de la tabla RESERVA.
-- Deja la tabla RESERVA con los campos que pide el enunciado:
--   identificador único, fecha y hora de la reserva, valor total,
--   número de entradas, observaciones y estado (Reservada, Confirmada, Cancelada),
--   con llaves foráneas reserva -> cliente y reserva -> evento.
--
-- Cambios frente a la tabla del Sprint 1:
--   + codigo_reserva      (RES-00001, lo genera PostgreSQL)
--   + fecha_hora_reserva  (antes no existía)
--   + observaciones       (antes no existía)
--   + causa_cancelacion   (la pide la tarea 8 y los reportes del Sprint 3)
--   ~ numero_entrada  -> numero_entradas
--   ~ estado_reserva (texto + CHECK) -> id_estado_reserva (FK a la tabla catálogo ESTADO_RESERVA)
--   - id_metodo           (METODO_PAGO no está en el enunciado ni en el diagrama corregido)
--
-- Como la tabla RESERVA todavía está VACÍA (aún no existe el CRUD de reservas),
-- se vuelve a crear desde cero.
--
-- CANDADO: si RESERVA ya tiene filas, la migración se detiene y NO borra nada.
-- Se puede ejecutar varias veces mientras la tabla esté vacía.

BEGIN;

-- 1. Candado: no seguir si ya hay reservas guardadas
DO $$
BEGIN
  IF to_regclass('public."RESERVA"') IS NOT NULL
     AND EXISTS (SELECT 1 FROM public."RESERVA") THEN
    RAISE EXCEPTION 'La tabla RESERVA ya tiene datos: la migracion_05 no se ejecuta para no borrarlos.';
  END IF;
END $$;

-- 2. Tabla catálogo de estados de la reserva
CREATE TABLE IF NOT EXISTS public."ESTADO_RESERVA" (
    id_estado_reserva SERIAL PRIMARY KEY,
    nombre_estado     VARCHAR(50) NOT NULL,
    CONSTRAINT ux_estado_reserva_nombre UNIQUE (nombre_estado)
);

-- Los 3 estados (no se duplican si se ejecuta otra vez)
INSERT INTO public."ESTADO_RESERVA" (nombre_estado)
SELECT v.nombre
FROM (VALUES (1, 'Reservada'),
             (2, 'Confirmada'),
             (3, 'Cancelada')) AS v(orden, nombre)
WHERE NOT EXISTS (
  SELECT 1 FROM public."ESTADO_RESERVA" er WHERE er.nombre_estado = v.nombre
)
ORDER BY v.orden;

-- 3. Volver a crear la tabla RESERVA
DROP TABLE IF EXISTS public."RESERVA" CASCADE;

CREATE TABLE public."RESERVA" (
    id_reserva         SERIAL PRIMARY KEY,
    -- Código visible que se genera solo a partir del id: 1 -> RES-00001
    codigo_reserva     VARCHAR(20) GENERATED ALWAYS AS ('RES-' || LPAD(id_reserva::text, 5, '0')) STORED,
    -- Fecha y hora en que el cliente hizo la reserva (hora de Colombia)
    fecha_hora_reserva TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'America/Bogota'),
    numero_entradas    INTEGER NOT NULL,               -- cuántas entradas reservó
    valor_total        NUMERIC(12, 2) NOT NULL,        -- numero_entradas x precio_base del evento
    observaciones      TEXT,
    id_estado_reserva  INTEGER NOT NULL,               -- Reservada, Confirmada, Cancelada
    causa_cancelacion  TEXT,                           -- se llena cuando la reserva se cancela
    id_cliente         VARCHAR(20) NOT NULL,           -- cliente que hizo la reserva
    id_evento          INTEGER NOT NULL,               -- evento reservado

    CONSTRAINT ux_reserva_codigo   UNIQUE (codigo_reserva),
    CONSTRAINT fk_reserva_cliente  FOREIGN KEY (id_cliente)        REFERENCES public."CLIENTE" (numero_id),
    CONSTRAINT fk_reserva_evento   FOREIGN KEY (id_evento)         REFERENCES public."EVENTO" (id_evento),
    CONSTRAINT fk_reserva_estado   FOREIGN KEY (id_estado_reserva) REFERENCES public."ESTADO_RESERVA" (id_estado_reserva),
    CONSTRAINT ck_reserva_entradas CHECK (numero_entradas > 0),
    CONSTRAINT ck_reserva_valor    CHECK (valor_total >= 0)
);

-- 4. Índices para las consultas de las próximas tareas
--    (mis reservas del cliente, reservas de un evento, filtro por estado)
CREATE INDEX IF NOT EXISTS ix_reserva_cliente ON public."RESERVA" (id_cliente);
CREATE INDEX IF NOT EXISTS ix_reserva_evento  ON public."RESERVA" (id_evento);
CREATE INDEX IF NOT EXISTS ix_reserva_estado  ON public."RESERVA" (id_estado_reserva);

COMMIT;