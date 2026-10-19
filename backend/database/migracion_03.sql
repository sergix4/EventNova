-- migracion_03.sql
-- Sprint 2 · Tarea 2: Modelo y migración de la tabla EVENTO.
-- Deja la tabla EVENTO con los campos que pide el enunciado:
--   código único, nombre, descripción, teatro, ciudad, fecha/hora de inicio,
--   fecha/hora estimada de fin, capacidad, precio base, observaciones y estado.
--
-- Como la tabla EVENTO todavía está VACÍA (aún no existe el CRUD), se vuelve a
-- crear desde cero y luego se reconectan las tablas que dependen de ella
-- (AGRUPA, RESERVA y RESEÑA).
--
-- CANDADO: si EVENTO ya tiene filas, la migración se detiene y NO borra nada.
-- Se puede ejecutar varias veces mientras la tabla esté vacía.

BEGIN;

-- 1. Candado: no seguir si ya hay eventos guardados
DO $$
BEGIN
  IF to_regclass('public."EVENTO"') IS NOT NULL
     AND EXISTS (SELECT 1 FROM public."EVENTO") THEN
    RAISE EXCEPTION 'La tabla EVENTO ya tiene datos: la migracion_03 no se ejecuta para no borrarlos.';
  END IF;
END $$;

-- 2. El nombre del estado no se puede repetir (el modelo busca el estado por nombre)
CREATE UNIQUE INDEX IF NOT EXISTS ux_estado_nombre
  ON public."ESTADO" (nombre_estado);

-- 3. Volver a crear la tabla EVENTO
--    (CASCADE quita también las llaves foráneas de AGRUPA, RESERVA y RESEÑA;
--     en el paso 5 se vuelven a crear)
DROP TABLE IF EXISTS public."EVENTO" CASCADE;

CREATE TABLE public."EVENTO" (
    id_evento          SERIAL PRIMARY KEY,
    -- Código único que se genera solo a partir del id: 1 -> EVT-00001
    codigo_evento      VARCHAR(20) GENERATED ALWAYS AS ('EVT-' || LPAD(id_evento::text, 5, '0')) STORED,
    nombre_evento      VARCHAR(150) NOT NULL,
    descripcion_evento TEXT,
    teatro             VARCHAR(150) NOT NULL,          -- recinto donde se realiza
    direccion_evento   VARCHAR(255),                   -- dirección del teatro (opcional)
    id_ciudad          INTEGER NOT NULL,               -- ciudad de realización
    fecha_inicio       TIMESTAMP NOT NULL,             -- fecha y hora de inicio
    fecha_fin          TIMESTAMP NOT NULL,             -- fecha y hora estimada de finalización
    capacidad          INTEGER NOT NULL,               -- capacidad total de espectadores
    precio_base        NUMERIC(10, 2) NOT NULL,        -- precio base de la entrada
    observaciones      TEXT,
    imagen_evento      VARCHAR(255),
    id_estado          INTEGER NOT NULL,               -- Programado, En Boletería, En Vivo, Finalizado, Cancelado
    causa_cancelacion  TEXT,                           -- se llena cuando el evento se cancela (Sprint 3)
    id_agente          VARCHAR(20) NOT NULL,           -- agente que registró el evento
    id_tipo            INTEGER,                        -- opcional por ahora (tabla TIPO aún sin datos)
    fecha_registro     TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT ux_evento_codigo   UNIQUE (codigo_evento),
    CONSTRAINT fk_evento_ciudad   FOREIGN KEY (id_ciudad) REFERENCES public."CIUDAD" (id_ciudad),
    CONSTRAINT fk_evento_agente   FOREIGN KEY (id_agente) REFERENCES public."AGENTE" (numero_id),
    CONSTRAINT fk_evento_estado   FOREIGN KEY (id_estado) REFERENCES public."ESTADO" (id_estado),
    CONSTRAINT fk_evento_tipo     FOREIGN KEY (id_tipo)   REFERENCES public."TIPO" (id_tipo),
    CONSTRAINT ck_evento_capacidad CHECK (capacidad > 0),
    CONSTRAINT ck_evento_precio    CHECK (precio_base >= 0),
    CONSTRAINT ck_evento_fechas    CHECK (fecha_fin > fecha_inicio)
);

-- 4. Índices para los filtros del CRUD (por estado, por ciudad y por agente)
CREATE INDEX IF NOT EXISTS ix_evento_estado ON public."EVENTO" (id_estado);
CREATE INDEX IF NOT EXISTS ix_evento_ciudad ON public."EVENTO" (id_ciudad);
CREATE INDEX IF NOT EXISTS ix_evento_agente ON public."EVENTO" (id_agente);

-- 5. Reconectar las tablas que apuntan a EVENTO
ALTER TABLE public."AGRUPA"  DROP CONSTRAINT IF EXISTS fk_agrupa_evento;
ALTER TABLE public."AGRUPA"  ADD  CONSTRAINT fk_agrupa_evento
  FOREIGN KEY (id_evento) REFERENCES public."EVENTO" (id_evento);

ALTER TABLE public."RESERVA" DROP CONSTRAINT IF EXISTS fk_reserva_evento;
ALTER TABLE public."RESERVA" ADD  CONSTRAINT fk_reserva_evento
  FOREIGN KEY (id_evento) REFERENCES public."EVENTO" (id_evento);

ALTER TABLE public."RESEÑA"  DROP CONSTRAINT IF EXISTS fk_resena_evento;
ALTER TABLE public."RESEÑA"  ADD  CONSTRAINT fk_resena_evento
  FOREIGN KEY (id_evento) REFERENCES public."EVENTO" (id_evento);

COMMIT;