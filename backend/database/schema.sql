
--Tablas independientes cataloos con opciones predeterminadas
CREATE TABLE public.pais (
    id_pais     SERIAL PRIMARY KEY,
    nombre_pais VARCHAR(100) NOT NULL
);

CREATE TABLE public.tipo_plan (
    id_plan          SERIAL PRIMARY KEY,
    nombre_plan      VARCHAR(100) NOT NULL,
    descripcion_plan TEXT,
    precio_plan      NUMERIC(10, 2) NOT NULL,
    limite_evento    INTEGER NOT NULL
);

CREATE TABLE public.estado (
    id_estado     SERIAL PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL
);

CREATE TABLE public.estado_reserva (
    id_estado_reserva SERIAL PRIMARY KEY,
    nombre_estado     VARCHAR(50) NOT NULL,
    CONSTRAINT ux_estado_reserva_nombre UNIQUE (nombre_estado)
);


CREATE TABLE public.departamento (
    id_departamento     SERIAL PRIMARY KEY,
    id_pais             INTEGER NOT NULL,
    nombre_departamento VARCHAR(100) NOT NULL,
    CONSTRAINT fk_departamento_pais FOREIGN KEY (id_pais) REFERENCES public.pais (id_pais)
);

CREATE TABLE public.ciudad (
    id_ciudad       SERIAL PRIMARY KEY,
    id_departamento INTEGER NOT NULL,
    nombre_ciudad   VARCHAR(100) NOT NULL,
    CONSTRAINT fk_ciudad_departamento FOREIGN KEY (id_departamento) REFERENCES public.departamento (id_departamento)
);


-- usuarios

CREATE TABLE public.usuario (
    numero_id         VARCHAR(20) PRIMARY KEY,
    correo            VARCHAR(150) UNIQUE NOT NULL,
    nombre            VARCHAR(100) NOT NULL,
    contraseña        VARCHAR(255) NOT NULL,
    fecha_nacimiento  DATE,
    direccion         VARCHAR(255),
    id_ciudad         INTEGER,
    fecha_registro    TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'America/Bogota'),
    activo            BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_suspension  TIMESTAMP,
    motivo_suspension VARCHAR(300),
    CONSTRAINT fk_usuario_ciudad FOREIGN KEY (id_ciudad) REFERENCES public.ciudad (id_ciudad)
);

CREATE TABLE public.telefonos (
    numero_id VARCHAR(20) NOT NULL,
    telefono  VARCHAR(20) NOT NULL,
    PRIMARY KEY (numero_id, telefono),
    CONSTRAINT fk_telefonos_usuario FOREIGN KEY (numero_id) REFERENCES public.usuario (numero_id)
);

CREATE TABLE public.agente (
    numero_id          VARCHAR(20) PRIMARY KEY,
    id_plan            INTEGER NOT NULL,
    nombre_empresa     VARCHAR(150) NOT NULL,
    descripcion_agente TEXT,
    comision           NUMERIC(5, 2) NOT NULL DEFAULT 0,
    experiencia        INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_agente_usuario FOREIGN KEY (numero_id) REFERENCES public.usuario (numero_id),
    CONSTRAINT fk_agente_plan    FOREIGN KEY (id_plan)   REFERENCES public.tipo_plan (id_plan)
);

CREATE TABLE public.administrador (
    numero_id    VARCHAR(20) PRIMARY KEY,
    codigo_admin VARCHAR(50) NOT NULL,
    salario      NUMERIC(12, 2) NOT NULL DEFAULT 0,
    horario      VARCHAR(100) NOT NULL DEFAULT 'Lunes a viernes 8:00 - 17:00',
    CONSTRAINT fk_admin_usuario FOREIGN KEY (numero_id) REFERENCES public.usuario (numero_id)
);

CREATE TABLE public.cliente (
    numero_id             VARCHAR(20) PRIMARY KEY,
    codigo_cliente        VARCHAR(50) NOT NULL,
    puntos                INTEGER NOT NULL DEFAULT 0,
    visualizar_publicidad BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (numero_id) REFERENCES public.usuario (numero_id)
);


-- eventos

CREATE TABLE public.evento (
    id_evento          SERIAL PRIMARY KEY,
    codigo_evento      VARCHAR(20) GENERATED ALWAYS AS ('EVT-' || LPAD(id_evento::text, 5, '0')) STORED,
    nombre_evento      VARCHAR(150) NOT NULL,
    descripcion_evento TEXT,
    teatro             VARCHAR(150) NOT NULL,
    direccion_evento   VARCHAR(255),
    id_ciudad          INTEGER NOT NULL,
    fecha_inicio       TIMESTAMP NOT NULL,
    fecha_fin          TIMESTAMP NOT NULL,
    capacidad          INTEGER NOT NULL,
    precio_base        NUMERIC(10, 2) NOT NULL,
    observaciones      TEXT,
    imagen_evento      TEXT,
    id_estado          INTEGER NOT NULL,
    causa_cancelacion  TEXT,
    fecha_cancelacion  TIMESTAMP,
    id_agente          VARCHAR(20) NOT NULL,
    fecha_registro     TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT ux_evento_codigo    UNIQUE (codigo_evento),
    CONSTRAINT fk_evento_ciudad    FOREIGN KEY (id_ciudad) REFERENCES public.ciudad (id_ciudad),
    CONSTRAINT fk_evento_agente    FOREIGN KEY (id_agente) REFERENCES public.agente (numero_id),
    CONSTRAINT fk_evento_estado    FOREIGN KEY (id_estado) REFERENCES public.estado (id_estado),
    CONSTRAINT ck_evento_capacidad CHECK (capacidad > 0),
    CONSTRAINT ck_evento_precio    CHECK (precio_base >= 0),
    CONSTRAINT ck_evento_fechas    CHECK (fecha_fin > fecha_inicio)
);

CREATE INDEX ix_evento_estado ON public.evento (id_estado);
CREATE INDEX ix_evento_ciudad ON public.evento (id_ciudad);
CREATE INDEX ix_evento_agente ON public.evento (id_agente);


-- Reservas y cancelaciones parciales

CREATE TABLE public.reserva (
    id_reserva         SERIAL PRIMARY KEY,
    codigo_reserva     VARCHAR(20) GENERATED ALWAYS AS ('RES-' || LPAD(id_reserva::text, 5, '0')) STORED,
    fecha_hora_reserva TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'America/Bogota'),
    numero_entradas    INTEGER NOT NULL,
    valor_total        NUMERIC(12, 2) NOT NULL,
    observaciones      TEXT,
    id_estado_reserva  INTEGER NOT NULL,
    causa_cancelacion  TEXT,
    fecha_cancelacion  TIMESTAMP,
    cancelada_por      VARCHAR(15),
    id_cliente         VARCHAR(20) NOT NULL,
    id_evento          INTEGER NOT NULL,

    CONSTRAINT ux_reserva_codigo        UNIQUE (codigo_reserva),
    CONSTRAINT fk_reserva_cliente       FOREIGN KEY (id_cliente)        REFERENCES public.cliente (numero_id),
    CONSTRAINT fk_reserva_evento        FOREIGN KEY (id_evento)         REFERENCES public.evento (id_evento),
    CONSTRAINT fk_reserva_estado        FOREIGN KEY (id_estado_reserva) REFERENCES public.estado_reserva (id_estado_reserva),
    CONSTRAINT ck_reserva_entradas      CHECK (numero_entradas > 0),
    CONSTRAINT ck_reserva_valor         CHECK (valor_total >= 0),
    CONSTRAINT ck_reserva_cancelada_por CHECK (cancelada_por IN ('Cliente', 'Agente', 'Administrador', 'Sistema'))
);

CREATE INDEX ix_reserva_cliente ON public.reserva (id_cliente);
CREATE INDEX ix_reserva_evento  ON public.reserva (id_evento);
CREATE INDEX ix_reserva_estado  ON public.reserva (id_estado_reserva);

CREATE TABLE public.cancelacion_entradas (
    id_cancelacion      SERIAL PRIMARY KEY,
    id_reserva          INTEGER NOT NULL,
    entradas_canceladas INTEGER NOT NULL,
    entradas_antes      INTEGER NOT NULL,
    valor_cancelado     NUMERIC(12, 2) NOT NULL,
    causa               TEXT NOT NULL,
    cancelada_por       VARCHAR(15) NOT NULL,
    fecha_cancelacion   TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'America/Bogota'),

    CONSTRAINT fk_cancelacion_reserva  FOREIGN KEY (id_reserva) REFERENCES public.reserva (id_reserva) ON DELETE CASCADE,
    CONSTRAINT ck_cancelacion_entradas CHECK (entradas_canceladas > 0 AND entradas_canceladas < entradas_antes),
    CONSTRAINT ck_cancelacion_valor    CHECK (valor_cancelado >= 0),
    CONSTRAINT ck_cancelacion_por      CHECK (cancelada_por IN ('Cliente', 'Agente', 'Administrador'))
);

CREATE INDEX ix_cancelacion_reserva ON public.cancelacion_entradas (id_reserva);


-- minuscula

CREATE UNIQUE INDEX ux_pais_nombre
  ON public.pais (LOWER(nombre_pais));

CREATE UNIQUE INDEX ux_departamento_nombre_pais
  ON public.departamento (id_pais, LOWER(nombre_departamento));

CREATE UNIQUE INDEX ux_ciudad_nombre_departamento
  ON public.ciudad (id_departamento, LOWER(nombre_ciudad));

CREATE UNIQUE INDEX ux_estado_nombre
  ON public.estado (nombre_estado);

-- Triggers de fecha de cancelación, guarda el momento exacto en donde se canceló

CREATE OR REPLACE FUNCTION public.fn_reserva_fecha_cancelacion()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT nombre_estado FROM public.estado_reserva
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

CREATE TRIGGER tg_reserva_fecha_cancelacion
  BEFORE INSERT OR UPDATE OF id_estado_reserva ON public.reserva
  FOR EACH ROW EXECUTE FUNCTION public.fn_reserva_fecha_cancelacion();

CREATE OR REPLACE FUNCTION public.fn_evento_fecha_cancelacion()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT nombre_estado FROM public.estado
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

CREATE TRIGGER tg_evento_fecha_cancelacion
  BEFORE INSERT OR UPDATE OF id_estado ON public.evento
  FOR EACH ROW EXECUTE FUNCTION public.fn_evento_fecha_cancelacion();
