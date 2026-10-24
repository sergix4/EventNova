--generacion de tablas independientes

DROP TABLE IF EXISTS public."PAIS" CASCADE;--por ahora se genera cada vez que lo ejecute, meintras hago los cambios para mejorarlas
CREATE TABLE public."PAIS" (
    id_pais SERIAL PRIMARY KEY,
    nombre_pais VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS public."TIPO_PLAN" CASCADE;
CREATE TABLE public."TIPO_PLAN" (
    id_plan SERIAL PRIMARY KEY,
    nombre_plan VARCHAR(100) NOT NULL,
    descripcion_plan TEXT,
    precio_plan NUMERIC(10, 2) NOT NULL,
    limite_evento INTEGER NOT NULL
);

DROP TABLE IF EXISTS public."CATEGORIA" CASCADE;
CREATE TABLE public."CATEGORIA" (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categ VARCHAR(100) NOT NULL,
    descripcion_categ TEXT
);

DROP TABLE IF EXISTS public."ESTADO" CASCADE;
CREATE TABLE public."ESTADO" (
    id_estado SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS public."ESTADO_RESERVA" CASCADE;
CREATE TABLE public."ESTADO_RESERVA" (
    id_estado_reserva SERIAL PRIMARY KEY,
    nombre_estado     VARCHAR(50) NOT NULL,
    CONSTRAINT ux_estado_reserva_nombre UNIQUE (nombre_estado)
);

DROP TABLE IF EXISTS public."TIPO" CASCADE;
CREATE TABLE public."TIPO" (
    id_tipo SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS public."METODO_PAGO" CASCADE;
CREATE TABLE public."METODO_PAGO" (
    id_metodo SERIAL PRIMARY KEY,
    nombre_metodo VARCHAR(50) NOT NULL
);


--tablas dependientes

DROP TABLE IF EXISTS public."DEPARTAMENTO" CASCADE;
CREATE TABLE public."DEPARTAMENTO" (
    id_departamento SERIAL PRIMARY KEY,
    id_pais INTEGER NOT NULL,
    nombre_departamento VARCHAR(100) NOT NULL,
    CONSTRAINT fk_departamento_pais FOREIGN KEY (id_pais) REFERENCES public."PAIS" (id_pais)
);

DROP TABLE IF EXISTS public."CIUDAD" CASCADE;
CREATE TABLE public."CIUDAD" (
    id_ciudad SERIAL PRIMARY KEY,
    id_departamento INTEGER NOT NULL,
    nombre_ciudad VARCHAR(100) NOT NULL,
    CONSTRAINT fk_ciudad_departamento FOREIGN KEY (id_departamento) REFERENCES public."DEPARTAMENTO" (id_departamento)
);



DROP TABLE IF EXISTS public."USUARIO" CASCADE;
CREATE TABLE public."USUARIO" (
    numero_id VARCHAR(20) PRIMARY KEY,
    correo VARCHAR(150) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    direccion VARCHAR(255),
    id_ciudad INTEGER,
    CONSTRAINT fk_usuario_ciudad FOREIGN KEY (id_ciudad) REFERENCES public."CIUDAD" (id_ciudad)
);

DROP TABLE IF EXISTS public."TELEFONOS" CASCADE;
CREATE TABLE public."TELEFONOS" (
    numero_id VARCHAR(20) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    PRIMARY KEY (numero_id, telefono),
    CONSTRAINT fk_telefonos_usuario FOREIGN KEY (numero_id) REFERENCES public."USUARIO" (numero_id)
);

DROP TABLE IF EXISTS public."AGENTE" CASCADE;
CREATE TABLE public."AGENTE" (
    numero_id VARCHAR(20) PRIMARY KEY,
    id_plan INTEGER NOT NULL,
    nombre_empresa VARCHAR(150) NOT NULL,
    descripcion_agente TEXT,
    comision NUMERIC(5,2) NOT NULL DEFAULT 0,
    experiencia INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_agente_usuario FOREIGN KEY (numero_id) REFERENCES public."USUARIO" (numero_id),
    CONSTRAINT fk_agente_plan FOREIGN KEY (id_plan) REFERENCES public."TIPO_PLAN" (id_plan)
);

DROP TABLE IF EXISTS public."ADMINISTRADOR" CASCADE;
CREATE TABLE public."ADMINISTRADOR" (
    numero_id VARCHAR(20) PRIMARY KEY,
    codigo_admin VARCHAR(50) NOT NULL,
    salario NUMERIC(12,2) NOT NULL DEFAULT 0,
    horario VARCHAR(100) NOT NULL DEFAULT 'Lunes a viernes 8:00 - 17:00',
    CONSTRAINT fk_admin_usuario FOREIGN KEY (numero_id) REFERENCES public."USUARIO" (numero_id)
);

DROP TABLE IF EXISTS public."CLIENTE" CASCADE;
CREATE TABLE public."CLIENTE" (
    numero_id VARCHAR(20) PRIMARY KEY,
    codigo_cliente VARCHAR(50) NOT NULL,
    puntos INTEGER NOT NULL DEFAULT 0,
    visualizar_publicidad BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (numero_id) REFERENCES public."USUARIO" (numero_id)
);


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

DROP TABLE IF EXISTS public."AGRUPA" CASCADE;
CREATE TABLE public."AGRUPA" (
    id_evento INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    PRIMARY KEY (id_evento, id_categoria),
    CONSTRAINT fk_agrupa_evento FOREIGN KEY (id_evento) REFERENCES public."EVENTO" (id_evento),
    CONSTRAINT fk_agrupa_categoria FOREIGN KEY (id_categoria) REFERENCES public."CATEGORIA" (id_categoria)
);

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

CREATE INDEX IF NOT EXISTS ix_reserva_cliente ON public."RESERVA" (id_cliente);
CREATE INDEX IF NOT EXISTS ix_reserva_evento  ON public."RESERVA" (id_evento);
CREATE INDEX IF NOT EXISTS ix_reserva_estado  ON public."RESERVA" (id_estado_reserva);

DROP TABLE IF EXISTS public."RESEÑA" CASCADE;
CREATE TABLE public."RESEÑA" (
    numero_id_cliente VARCHAR(20) NOT NULL,
    id_evento INTEGER NOT NULL,
    fecha DATE,
    calificacion INTEGER,
    comentario TEXT,
    PRIMARY KEY (numero_id_cliente, id_evento),
    CONSTRAINT fk_resena_cliente FOREIGN KEY (numero_id_cliente) REFERENCES public."CLIENTE" (numero_id),
    CONSTRAINT fk_resena_evento FOREIGN KEY (id_evento) REFERENCES public."EVENTO" (id_evento)
);

-- UNIQUE sin distinguir mayúsculas (igual que la validación del backend)
CREATE UNIQUE INDEX IF NOT EXISTS ux_pais_nombre
  ON public."PAIS" (LOWER(nombre_pais));

CREATE UNIQUE INDEX IF NOT EXISTS ux_departamento_nombre_pais
  ON public."DEPARTAMENTO" (id_pais, LOWER(nombre_departamento));

CREATE UNIQUE INDEX IF NOT EXISTS ux_ciudad_nombre_departamento
  ON public."CIUDAD" (id_departamento, LOWER(nombre_ciudad));

CREATE UNIQUE INDEX IF NOT EXISTS ux_estado_nombre
  ON public."ESTADO" (nombre_estado);