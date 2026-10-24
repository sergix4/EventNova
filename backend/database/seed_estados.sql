-- seed_estados.sql
-- Carga los 5 estados que puede tener un EVENTO (tabla catálogo ESTADO)
-- y los 3 estados que puede tener una RESERVA (tabla catálogo ESTADO_RESERVA).
-- Se puede ejecutar varias veces sin duplicar datos.
-- IMPORTANTE: si alguien vuelve a ejecutar develop.sql (que borra las tablas),
-- hay que volver a ejecutar este archivo.

INSERT INTO public."ESTADO" (nombre_estado)
SELECT v.nombre
FROM (VALUES (1, 'Programado'),
             (2, 'En Boletería'),
             (3, 'En Vivo'),
             (4, 'Finalizado'),
             (5, 'Cancelado')) AS v(orden, nombre)
WHERE NOT EXISTS (
  SELECT 1 FROM public."ESTADO" e WHERE e.nombre_estado = v.nombre
)
ORDER BY v.orden;

-- Estados de la RESERVA (migracion_05)
INSERT INTO public."ESTADO_RESERVA" (nombre_estado)
SELECT v.nombre
FROM (VALUES (1, 'Reservada'),
             (2, 'Confirmada'),
             (3, 'Cancelada')) AS v(orden, nombre)
WHERE NOT EXISTS (
  SELECT 1 FROM public."ESTADO_RESERVA" er WHERE er.nombre_estado = v.nombre
)
ORDER BY v.orden;