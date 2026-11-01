-- migracion_07.sql
-- Sprint 3 · Tarea 2: Consolidar el script de la base de datos.
-- Quita de una base que YA existe (Neon) las tablas que el sistema no usa
-- y que se eliminaron de develop.sql y del diagrama ER:
--   CATEGORIA, AGRUPA, RESEÑA, METODO_PAGO y TIPO
-- y la columna EVENTO.id_tipo (con su llave foránea fk_evento_tipo).
--
-- No toca ninguna otra tabla ni dato. Se puede ejecutar varias veces.
-- Uso:  npm run db:migrar -- migracion_07.sql

BEGIN;

-- 1. Columna id_tipo de EVENTO (nunca se usó: la tabla TIPO no tiene datos)
ALTER TABLE public."EVENTO" DROP CONSTRAINT IF EXISTS fk_evento_tipo;
ALTER TABLE public."EVENTO" DROP COLUMN IF EXISTS id_tipo;

-- 2. Tablas que no pide el enunciado (primero las que dependen de otras)
DROP TABLE IF EXISTS public."AGRUPA";
DROP TABLE IF EXISTS public."RESEÑA";
DROP TABLE IF EXISTS public."CATEGORIA";
DROP TABLE IF EXISTS public."METODO_PAGO";
DROP TABLE IF EXISTS public."TIPO";

COMMIT;