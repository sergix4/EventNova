-- migracion_06.sql
-- Sprint 3 · Dashboard del administrador con datos reales.
-- Agrega las FECHAS que necesita la "Actividad reciente" del dashboard:
--   + USUARIO.fecha_registro     -> cuándo se registró el cliente / agente / admin
--   + RESERVA.fecha_cancelacion  -> cuándo se canceló la reserva
--   + EVENTO.fecha_cancelacion   -> cuándo se canceló el evento
--
-- Las fechas de cancelación las llena PostgreSQL SOLO con un TRIGGER, así no
-- hay que tocar el código que ya cancela reservas y eventos.
--
-- NO borra datos y se puede ejecutar varias veces sin problema.
-- Los usuarios que YA existían quedan con fecha_registro vacía (NULL),
-- porque no sabemos cuándo se registraron; los nuevos sí la tendrán.

BEGIN;

-- 1. Columnas nuevas (todas en hora de Colombia, igual que fecha_hora_reserva)
ALTER TABLE public."USUARIO" ADD COLUMN IF NOT EXISTS fecha_registro TIMESTAMP;
ALTER TABLE public."USUARIO" ALTER COLUMN fecha_registro
  SET DEFAULT (NOW() AT TIME ZONE 'America/Bogota');

ALTER TABLE public."RESERVA" ADD COLUMN IF NOT EXISTS fecha_cancelacion TIMESTAMP;
ALTER TABLE public."EVENTO"  ADD COLUMN IF NOT EXISTS fecha_cancelacion TIMESTAMP;

-- 2. TRIGGER de RESERVA: cuando pasa a "Cancelada" guarda la fecha y hora
CREATE OR REPLACE FUNCTION public.fn_reserva_fecha_cancelacion()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT nombre_estado FROM public."ESTADO_RESERVA"
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

DROP TRIGGER IF EXISTS tg_reserva_fecha_cancelacion ON public."RESERVA";
CREATE TRIGGER tg_reserva_fecha_cancelacion
  BEFORE INSERT OR UPDATE OF id_estado_reserva ON public."RESERVA"
  FOR EACH ROW EXECUTE FUNCTION public.fn_reserva_fecha_cancelacion();

-- 3. TRIGGER de EVENTO: cuando pasa a "Cancelado" guarda la fecha y hora
CREATE OR REPLACE FUNCTION public.fn_evento_fecha_cancelacion()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT nombre_estado FROM public."ESTADO"
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

DROP TRIGGER IF EXISTS tg_evento_fecha_cancelacion ON public."EVENTO";
CREATE TRIGGER tg_evento_fecha_cancelacion
  BEFORE INSERT OR UPDATE OF id_estado ON public."EVENTO"
  FOR EACH ROW EXECUTE FUNCTION public.fn_evento_fecha_cancelacion();

-- 4. Lo que YA estaba cancelado antes de esta migración no tiene fecha real:
--    se deja vacío (NULL) y el dashboard simplemente no lo muestra en la actividad.

COMMIT;