-- migracion_01.sql
-- Agrega columnas del enunciado y restricciones UNIQUE SIN borrar datos.
-- Se puede ejecutar varias veces sin problema.

-- CLIENTE: puntos (inicia en 0) y visualización de publicidad
ALTER TABLE public."CLIENTE"
  ADD COLUMN IF NOT EXISTS puntos INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS visualizar_publicidad BOOLEAN NOT NULL DEFAULT TRUE;

-- AGENTE: comisión (%) y experiencia (años)
ALTER TABLE public."AGENTE"
  ADD COLUMN IF NOT EXISTS comision NUMERIC(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS experiencia INTEGER NOT NULL DEFAULT 0;

-- ADMINISTRADOR: salario y horario
ALTER TABLE public."ADMINISTRADOR"
  ADD COLUMN IF NOT EXISTS salario NUMERIC(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS horario VARCHAR(100) NOT NULL DEFAULT 'Lunes a viernes 8:00 - 17:00';

-- UNIQUE sin distinguir mayúsculas (igual que la validación del backend)
CREATE UNIQUE INDEX IF NOT EXISTS ux_pais_nombre
  ON public."PAIS" (LOWER(nombre_pais));

CREATE UNIQUE INDEX IF NOT EXISTS ux_departamento_nombre_pais
  ON public."DEPARTAMENTO" (id_pais, LOWER(nombre_departamento));

CREATE UNIQUE INDEX IF NOT EXISTS ux_ciudad_nombre_departamento
  ON public."CIUDAD" (id_departamento, LOWER(nombre_ciudad));