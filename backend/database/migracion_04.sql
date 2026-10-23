-- migracion_04.sql
-- La imagen del evento se guarda como texto base64 (data URL), que supera los 255 caracteres.
ALTER TABLE public."EVENTO" ALTER COLUMN imagen_evento TYPE TEXT;