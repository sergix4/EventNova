-- seed_planes.sql
-- Carga los 3 planes de agente que muestra el formulario de registro.
-- Se puede ejecutar varias veces sin duplicar datos.
-- IMPORTANTE: si alguien vuelve a ejecutar develop.sql (que borra las tablas),
-- hay que volver a ejecutar este archivo.
-- limite_evento = 9999 representa "ilimitado" (la columna es NOT NULL).

INSERT INTO public."TIPO_PLAN" (nombre_plan, descripcion_plan, precio_plan, limite_evento)
SELECT 'Plan Básico', 'Hasta 5 eventos activos, gestión de reservas, panel de eventos', 29900, 5
WHERE NOT EXISTS (SELECT 1 FROM public."TIPO_PLAN" WHERE nombre_plan = 'Plan Básico');

INSERT INTO public."TIPO_PLAN" (nombre_plan, descripcion_plan, precio_plan, limite_evento)
SELECT 'Plan Profesional', 'Hasta 20 eventos activos, estadísticas básicas, soporte prioritario', 49900, 20
WHERE NOT EXISTS (SELECT 1 FROM public."TIPO_PLAN" WHERE nombre_plan = 'Plan Profesional');

INSERT INTO public."TIPO_PLAN" (nombre_plan, descripcion_plan, precio_plan, limite_evento)
SELECT 'Plan Empresa', 'Eventos ilimitados, reportes avanzados, múltiples usuarios', 89900, 9999
WHERE NOT EXISTS (SELECT 1 FROM public."TIPO_PLAN" WHERE nombre_plan = 'Plan Empresa');