-- seed_estados.sql
-- Carga los 5 estados que puede tener un EVENTO (tabla catálogo ESTADO).
-- Se puede ejecutar varias veces sin duplicar datos.
-- IMPORTANTE: si alguien vuelve a ejecutar develop.sql (que borra las tablas),
-- hay que volver a ejecutar este archivo.
-- Los estados de la RESERVA (Reservada, Confirmada, Cancelada) se controlan
-- con la restricción CHECK ck_reserva_estado de la tabla RESERVA.

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