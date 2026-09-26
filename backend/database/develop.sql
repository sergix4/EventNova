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
    CONSTRAINT fk_agente_usuario FOREIGN KEY (numero_id) REFERENCES public."USUARIO" (numero_id),
    CONSTRAINT fk_agente_plan FOREIGN KEY (id_plan) REFERENCES public."TIPO_PLAN" (id_plan)
);

DROP TABLE IF EXISTS public."ADMINISTRADOR" CASCADE;
CREATE TABLE public."ADMINISTRADOR" (
    numero_id VARCHAR(20) PRIMARY KEY,
    codigo_admin VARCHAR(50) NOT NULL,
    CONSTRAINT fk_admin_usuario FOREIGN KEY (numero_id) REFERENCES public."USUARIO" (numero_id)
);

DROP TABLE IF EXISTS public."CLIENTE" CASCADE;
CREATE TABLE public."CLIENTE" (
    numero_id VARCHAR(20) PRIMARY KEY,
    codigo_cliente VARCHAR(50) NOT NULL,
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (numero_id) REFERENCES public."USUARIO" (numero_id)
);


DROP TABLE IF EXISTS public."EVENTO" CASCADE;
CREATE TABLE public."EVENTO" (
    id_evento SERIAL PRIMARY KEY,
    id_agente VARCHAR(20) NOT NULL,
    id_estado INTEGER NOT NULL,
    id_tipo INTEGER NOT NULL,
    ubicacion_evento VARCHAR(255),
    capacidad INTEGER,
    precio NUMERIC(10, 2),
    hora TIME,
    imagen_evento VARCHAR(255),
    fecha_evento DATE,
    descripcion_evento TEXT,
    CONSTRAINT fk_evento_agente FOREIGN KEY (id_agente) REFERENCES public."AGENTE" (numero_id),
    CONSTRAINT fk_evento_estado FOREIGN KEY (id_estado) REFERENCES public."ESTADO" (id_estado),
    CONSTRAINT fk_evento_tipo FOREIGN KEY (id_tipo) REFERENCES public."TIPO" (id_tipo)
);

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
    id_reserva SERIAL PRIMARY KEY,
    id_cliente VARCHAR(20) NOT NULL,
    id_metodo INTEGER NOT NULL,
    numero_entrada INTEGER NOT NULL,
    valor_total NUMERIC(10, 2) NOT NULL,
    estado_reserva VARCHAR(50) NOT NULL,
    id_evento INTEGER NOT NULL,
    CONSTRAINT fk_reserva_cliente FOREIGN KEY (id_cliente) REFERENCES public."CLIENTE" (numero_id),
    CONSTRAINT fk_reserva_metodo FOREIGN KEY (id_metodo) REFERENCES public."METODO_PAGO" (id_metodo),
    CONSTRAINT fk_reserva_evento FOREIGN KEY (id_evento) REFERENCES public."EVENTO" (id_evento)
);

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