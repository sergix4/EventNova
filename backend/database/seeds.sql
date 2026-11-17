-- ════════════════════════════════════════════════════════════════════════════
-- EventNova · seeds.sql
-- Datos iniciales de TODAS las tablas. Ejecutar DESPUÉS de schema.sql, sobre la
-- base recién creada (en pgAdmin: Query Tool → abrir este archivo → Ejecutar F5).
--
-- · Catálogos con sus valores reales: 5 estados de evento, 3 estados de reserva
--   y 3 planes de agente.
-- · 4 administradores (el equipo), 20 clientes y 20 agentes: cada persona tiene
--   UN SOLO rol (especialización disjunta de USUARIO).
-- · Las demás tablas tienen 20 filas o más.
-- · Contraseña de TODOS los usuarios de este archivo: 12345 (guardada con bcrypt).
-- · Todo va en una transacción: si algo falla no queda nada a medias.
-- ════════════════════════════════════════════════════════════════════════════

BEGIN;

-- 1. Catálogos ─────────────────────────────────────────────────────────────

INSERT INTO public.estado (nombre_estado) VALUES
('Programado'),
('En Boletería'),
('En Vivo'),
('Finalizado'),
('Cancelado');

INSERT INTO public.estado_reserva (nombre_estado) VALUES
('Reservada'),
('Confirmada'),
('Cancelada');

INSERT INTO public.tipo_plan (nombre_plan, descripcion_plan, precio_plan, limite_evento) VALUES
('Plan Básico', 'Hasta 5 eventos activos, gestión de reservas, panel de eventos', 29900.00, 5),
('Plan Profesional', 'Hasta 20 eventos activos, gestión de reservas, estadísticas de tus eventos', 49900.00, 20),
('Plan Empresa', 'Eventos activos ilimitados, gestión de reservas, estadísticas de tus eventos', 89900.00, 9999);

-- 2. Ubicación geográfica (país → departamento → ciudad) ───────────────────

INSERT INTO public.pais (nombre_pais) VALUES
('Colombia'),
('México'),
('Argentina'),
('Chile'),
('Perú'),
('España'),
('Ecuador'),
('Brasil'),
('Uruguay'),
('Paraguay'),
('Bolivia'),
('Venezuela'),
('Panamá'),
('Costa Rica'),
('Guatemala'),
('Honduras'),
('El Salvador'),
('Nicaragua'),
('República Dominicana'),
('Puerto Rico');

INSERT INTO public.departamento (id_pais, nombre_departamento) VALUES
(1, 'Antioquia'),
(1, 'Cundinamarca'),
(1, 'Valle del Cauca'),
(1, 'Atlántico'),
(1, 'Santander'),
(2, 'Ciudad de México'),
(2, 'Jalisco'),
(3, 'Buenos Aires'),
(3, 'Córdoba'),
(4, 'Santiago'),
(5, 'Lima'),
(6, 'Madrid'),
(6, 'Cataluña'),
(7, 'Pichincha'),
(8, 'São Paulo'),
(9, 'Montevideo'),
(10, 'Central'),
(11, 'La Paz'),
(12, 'Miranda'),
(13, 'Panamá');

INSERT INTO public.ciudad (id_departamento, nombre_ciudad) VALUES
(1, 'Medellín'),
(2, 'Bogotá'),
(3, 'Cali'),
(4, 'Barranquilla'),
(5, 'Bucaramanga'),
(6, 'Ciudad de México'),
(7, 'Guadalajara'),
(8, 'La Plata'),
(9, 'Córdoba'),
(10, 'Santiago'),
(11, 'Lima'),
(12, 'Madrid'),
(13, 'Barcelona'),
(14, 'Quito'),
(15, 'São Paulo'),
(16, 'Montevideo'),
(17, 'Asunción'),
(18, 'La Paz'),
(19, 'Caracas'),
(20, 'Ciudad de Panamá');

-- 3. Usuarios: 4 administradores + 20 clientes + 20 agentes = 44 ─────────────

INSERT INTO public.usuario (numero_id, correo, nombre, contraseña, fecha_nacimiento, direccion, id_ciudad, fecha_registro) VALUES
-- Administradores
('1030000001', 'sergio@eventnova.com', 'Sergio Alejandro Morales Flórez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '2004-03-12', 'Calle 26 # 30-15', 3, '2025-08-04 09:00:00'),
('1030000002', 'daniel@eventnova.com', 'Daniel Castañeda Londoño', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '2004-07-21', 'Carrera 25 # 28-40', 3, '2025-08-04 09:10:00'),
('1030000003', 'isabella@eventnova.com', 'Isabella Serna Torres', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '2005-01-30', 'Calle 30 # 22-11', 3, '2025-08-04 09:20:00'),
('1030000004', 'paola@eventnova.com', 'Paola Andrea Carmona Salazar', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '2004-11-08', 'Carrera 28 # 35-07', 3, '2025-08-04 09:30:00'),
-- Clientes
('1010000001', 'carlos.perez@correo.com', 'Carlos Pérez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1992-06-12', 'Calle 10 # 20-30', 3, '2025-10-06 09:15:00'),
('1010000002', 'maria.gomez@correo.com', 'María Gómez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1999-11-23', 'Carrera 15 # 40-12', 1, '2025-10-11 10:15:00'),
('1010000003', 'juan.rodriguez@correo.com', 'Juan Rodríguez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1988-04-07', 'Avenida 5 # 12-45', 2, '2025-10-16 11:15:00'),
('1010000004', 'laura.martinez@correo.com', 'Laura Martínez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1995-09-18', 'Calle 80 # 11-22', 3, '2025-10-21 12:15:00'),
('1010000005', 'andres.lopez@correo.com', 'Andrés López', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '2002-02-02', 'Carrera 27 # 33-10', 4, '2025-10-26 13:15:00'),
('1010000006', 'sofia.hernandez@correo.com', 'Sofía Hernández', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1991-07-13', 'Av. Reforma 120', 5, '2025-10-31 14:15:00'),
('1010000007', 'diego.torres@correo.com', 'Diego Torres', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1998-12-24', 'Calle Hidalgo 45', 1, '2025-11-05 15:15:00'),
('1010000008', 'valentina.diaz@correo.com', 'Valentina Díaz', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1987-05-08', 'Diagonal 74 # 500', 3, '2025-11-10 16:15:00'),
('1010000009', 'mateo.sanchez@correo.com', 'Mateo Sánchez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1994-10-19', 'Bv. San Juan 230', 2, '2025-11-15 17:15:00'),
('1010000010', 'camila.ramirez@correo.com', 'Camila Ramírez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '2001-03-03', 'Alameda 1450', 6, '2025-11-20 08:15:00'),
('1010000011', 'sebastian.castro@correo.com', 'Sebastián Castro', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1990-08-14', 'Av. Arequipa 890', 11, '2025-11-25 09:15:00'),
('1010000012', 'juliana.morales@correo.com', 'Juliana Morales', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1997-01-25', 'Gran Vía 42', 12, '2025-11-30 10:15:00'),
('1010000013', 'ricardo.ortiz@correo.com', 'Ricardo Ortiz', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1986-06-09', 'Passeig de Gràcia 18', 3, '2025-12-05 11:15:00'),
('1010000014', 'lucia.vargas@correo.com', 'Lucía Vargas', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1993-11-20', 'Av. Amazonas 310', 14, '2025-12-10 12:15:00'),
('1010000015', 'tomas.silva@correo.com', 'Tomás Silva', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '2000-04-04', 'Av. Paulista 1000', 15, '2025-12-15 13:15:00'),
('1010000016', 'paula.mendez@correo.com', 'Paula Méndez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1989-09-15', '18 de Julio 950', 1, '2025-12-20 14:15:00'),
('1010000017', 'felipe.rojas@correo.com', 'Felipe Rojas', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1996-02-26', 'Av. España 400', 2, '2025-12-25 15:15:00'),
('1010000018', 'natalia.navarro@correo.com', 'Natalia Navarro', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1985-07-10', 'Av. Arce 210', 3, '2025-12-30 16:15:00'),
('1010000019', 'gabriel.pena@correo.com', 'Gabriel Peña', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1992-12-21', 'Av. Francisco de Miranda 55', 5, '2026-01-04 17:15:00'),
('1010000020', 'mariana.herrera@correo.com', 'Mariana Herrera', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1999-05-05', 'Calle 50, Torre 1', 20, '2026-01-09 08:15:00'),
-- Agentes
('1020000001', 'eventos.nova@eventos.com', 'Andrés Felipe Gómez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1980-08-14', 'Oficina 101, Diagonal 74 # 500', 1, '2025-09-04 10:00:00'),
('1020000002', 'live.stage@eventos.com', 'Carolina Restrepo', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1985-03-27', 'Oficina 102, Bv. San Juan 230', 2, '2025-10-06 10:00:00'),
('1020000003', 'megafest@eventos.com', 'Jorge Iván Muñoz', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1990-10-13', 'Oficina 103, Alameda 1450', 3, '2025-11-08 10:00:00'),
('1020000004', 'teatro.vivo@eventos.com', 'Diana Marcela Ospina', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1975-05-26', 'Oficina 104, Av. Arequipa 890', 4, '2025-12-10 10:00:00'),
('1020000005', 'sonido.sur@eventos.com', 'Ricardo Salazar', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1980-12-12', 'Oficina 105, Gran Vía 42', 5, '2025-09-12 10:00:00'),
('1020000006', 'arena.global@eventos.com', 'Fernanda Aguilar', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1985-07-25', 'Oficina 106, Passeig de Gràcia 18', 6, '2025-10-14 10:00:00'),
('1020000007', 'danza.viva@eventos.com', 'Héctor Ramírez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1990-02-11', 'Oficina 107, Av. Amazonas 310', 7, '2025-11-16 10:00:00'),
('1020000008', 'escena.abierta@eventos.com', 'Mónica Ibáñez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1975-09-24', 'Oficina 108, Av. Paulista 1000', 8, '2025-12-18 10:00:00'),
('1020000009', 'showtime.latam@eventos.com', 'Pablo Andrés Rivas', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1980-04-10', 'Oficina 109, 18 de Julio 950', 9, '2025-09-20 10:00:00'),
('1020000010', 'foro.academico@eventos.com', 'Claudia Fuentes', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1985-11-23', 'Oficina 110, Av. España 400', 10, '2025-10-22 10:00:00'),
('1020000011', 'lima.live@eventos.com', 'Luis Alberto Quispe', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1990-06-09', 'Oficina 111, Av. Arce 210', 11, '2025-11-24 10:00:00'),
('1020000012', 'madrid.espectaculos@eventos.com', 'Elena Domínguez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1975-01-22', 'Oficina 112, Av. Francisco de Miranda 55', 12, '2025-12-26 10:00:00'),
('1020000013', 'bcn.arts@eventos.com', 'Jordi Puig', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1980-08-08', 'Oficina 113, Calle 50, Torre 1', 13, '2025-09-03 10:00:00'),
('1020000014', 'andes.fest@eventos.com', 'Verónica Andrade', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1985-03-21', 'Oficina 114, Calle 10 # 20-30', 14, '2025-10-05 10:00:00'),
('1020000015', 'brasil.show@eventos.com', 'Rafael Oliveira', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1990-10-07', 'Oficina 115, Carrera 15 # 40-12', 15, '2025-11-07 10:00:00'),
('1020000016', 'rio.de.la.plata@eventos.com', 'Martín Acosta', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1975-05-20', 'Oficina 116, Avenida 5 # 12-45', 16, '2025-12-09 10:00:00'),
('1020000017', 'guarani.eventos@eventos.com', 'Gloria Benítez', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1980-12-06', 'Oficina 117, Calle 80 # 11-22', 17, '2025-09-11 10:00:00'),
('1020000018', 'altura.live@eventos.com', 'Raúl Mamani', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1985-07-19', 'Oficina 118, Carrera 27 # 33-10', 18, '2025-10-13 10:00:00'),
('1020000019', 'caribe.sound@eventos.com', 'Yolanda Briceño', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1990-02-05', 'Oficina 119, Av. Reforma 120', 19, '2025-11-15 10:00:00'),
('1020000020', 'istmo.producciones@eventos.com', 'Iván Castillo', '$2a$10$b7wlSkrRC1J/v7SIG.rGO.u9MfgdB802ZeHnSu4bFaLJjGA4ODEzq', '1975-09-18', 'Oficina 120, Calle Hidalgo 45', 20, '2025-12-17 10:00:00');

INSERT INTO public.telefonos (numero_id, telefono) VALUES
('1030000001', '3104520001'),
('1030000002', '3104520002'),
('1030000003', '3104520003'),
('1030000004', '3104520004'),
('1010000001', '3101555001'),
('1010000002', '3102555002'),
('1010000003', '3103555003'),
('1010000004', '3104555004'),
('1010000005', '3105555005'),
('1010000006', '3106555006'),
('1010000007', '3107555007'),
('1010000008', '3108555008'),
('1010000009', '3109555009'),
('1010000010', '3110555010'),
('1010000011', '3111555011'),
('1010000012', '3112555012'),
('1010000013', '3113555013'),
('1010000014', '3114555014'),
('1010000015', '3115555015'),
('1010000016', '3116555016'),
('1010000017', '3117555017'),
('1010000018', '3118555018'),
('1010000019', '3119555019'),
('1010000020', '3120555020'),
('1020000001', '6001444001'),
('1020000002', '6002444002'),
('1020000003', '6003444003'),
('1020000004', '6004444004'),
('1020000005', '6005444005'),
('1020000006', '6006444006'),
('1020000007', '6007444007'),
('1020000008', '6008444008'),
('1020000009', '6009444009'),
('1020000010', '6010444010'),
('1020000011', '6011444011'),
('1020000012', '6012444012'),
('1020000013', '6013444013'),
('1020000014', '6014444014'),
('1020000015', '6015444015'),
('1020000016', '6016444016'),
('1020000017', '6017444017'),
('1020000018', '6018444018'),
('1020000019', '6019444019'),
('1020000020', '6020444020');

-- 4. Roles (cada persona en UNA sola de estas tablas) ───────────────────────

INSERT INTO public.administrador (numero_id, codigo_admin, salario, horario) VALUES
('1030000001', 'ADM-1030000001', 5200000.00, 'Lunes a viernes 8:00 - 17:00'),
('1030000002', 'ADM-1030000002', 5200000.00, 'Lunes a viernes 8:00 - 17:00'),
('1030000003', 'ADM-1030000003', 5200000.00, 'Lunes a viernes 9:00 - 18:00'),
('1030000004', 'ADM-1030000004', 5200000.00, 'Lunes a viernes 9:00 - 18:00');

INSERT INTO public.cliente (numero_id, codigo_cliente, puntos, visualizar_publicidad) VALUES
('1010000001', 'CLI-1010000001', 57, TRUE),
('1010000002', 'CLI-1010000002', 94, TRUE),
('1010000003', 'CLI-1010000003', 131, TRUE),
('1010000004', 'CLI-1010000004', 168, FALSE),
('1010000005', 'CLI-1010000005', 205, TRUE),
('1010000006', 'CLI-1010000006', 242, TRUE),
('1010000007', 'CLI-1010000007', 279, TRUE),
('1010000008', 'CLI-1010000008', 316, FALSE),
('1010000009', 'CLI-1010000009', 353, TRUE),
('1010000010', 'CLI-1010000010', 390, TRUE),
('1010000011', 'CLI-1010000011', 427, TRUE),
('1010000012', 'CLI-1010000012', 464, FALSE),
('1010000013', 'CLI-1010000013', 51, TRUE),
('1010000014', 'CLI-1010000014', 88, TRUE),
('1010000015', 'CLI-1010000015', 125, TRUE),
('1010000016', 'CLI-1010000016', 162, FALSE),
('1010000017', 'CLI-1010000017', 199, TRUE),
('1010000018', 'CLI-1010000018', 236, TRUE),
('1010000019', 'CLI-1010000019', 273, TRUE),
('1010000020', 'CLI-1010000020', 310, FALSE);

-- id_plan: 1 = Plan Básico, 2 = Plan Profesional, 3 = Plan Empresa
INSERT INTO public.agente (numero_id, id_plan, nombre_empresa, descripcion_agente, comision, experiencia) VALUES
('1020000001', 1, 'Eventos Nova S.A.S.', 'Productora de conciertos sinfónicos y música en vivo', 5.00, 4),
('1020000002', 2, 'Live Stage', 'Eventos culturales y teatro', 6.50, 7),
('1020000003', 3, 'MegaFest', 'Festivales masivos de música', 8.00, 10),
('1020000004', 1, 'Teatro Vivo', 'Obras de teatro independientes', 4.50, 1),
('1020000005', 2, 'Sonido Sur', 'Comedia y espectáculos regionales', 5.50, 4),
('1020000006', 3, 'Arena Global', 'Ferias y exposiciones internacionales', 7.50, 7),
('1020000007', 1, 'Danza Viva', 'Danza clásica y contemporánea', 5.00, 10),
('1020000008', 2, 'Escena Abierta', 'Jazz y música clásica', 6.00, 1),
('1020000009', 3, 'ShowTime Latam', 'Giras de música alternativa', 8.50, 4),
('1020000010', 1, 'Foro Académico', 'Congresos y seminarios', 4.00, 7),
('1020000011', 2, 'Lima Live', 'Música tradicional y conciertos en Perú', 5.00, 10),
('1020000012', 3, 'Madrid Espectáculos', 'Grandes producciones musicales', 6.50, 1),
('1020000013', 1, 'Bcn Arts', 'Ópera y artes escénicas', 8.00, 4),
('1020000014', 2, 'Andes Fest', 'Ferias del libro y festivales andinos', 4.50, 7),
('1020000015', 3, 'Brasil Show', 'Fiestas electrónicas masivas', 5.50, 10),
('1020000016', 1, 'Río de la Plata', 'Teatro y tango', 7.50, 1),
('1020000017', 2, 'Guaraní Eventos', 'Ferias gastronómicas y exposiciones', 5.00, 4),
('1020000018', 3, 'Altura Live', 'Música andina y cultura', 6.00, 7),
('1020000019', 1, 'Caribe Sound', 'Música tropical', 8.50, 10),
('1020000020', 2, 'Istmo Producciones', 'Eventos corporativos y galas', 4.00, 1);

-- 5. Eventos ───────────────────────────────────────────────────────────────
-- id_estado: 1 = Programado, 2 = En Boletería, 3 = En Vivo, 4 = Finalizado, 5 = Cancelado
-- Los eventos de 2026 ya pasaron (Finalizado); los de 2027 están en venta o programados.

INSERT INTO public.evento (nombre_evento, descripcion_evento, teatro, direccion_evento, id_ciudad, fecha_inicio, fecha_fin, capacidad, precio_base, id_estado, causa_cancelacion, fecha_cancelacion, id_agente, fecha_registro) VALUES
('Concierto Sinfónico', 'Orquesta filarmónica en vivo', 'Teatro Metropolitano', 'Calle 41 # 57-30', 1, '2026-02-14 19:00:00', '2026-02-14 22:00:00', 1500, 85000.00, 4, NULL, NULL, '1020000001', '2026-01-05 10:00:00'),
('Noche de Rock', 'Bandas nacionales invitadas', 'Movistar Arena', 'Diagonal 61C # 26-36', 2, '2026-03-21 20:00:00', '2026-03-22 00:00:00', 5000, 120000.00, 4, NULL, NULL, '1020000002', '2026-01-05 20:00:00'),
('Festival de Salsa', 'Encuentro salsero internacional', 'Estadio Pascual Guerrero', 'Calle 5 # 34-00', 3, '2026-04-25 18:00:00', '2026-04-26 00:00:00', 8000, 95000.00, 4, NULL, NULL, '1020000003', '2026-02-09 18:00:00'),
('Obra El Quijote', 'Adaptación teatral clásica', 'Teatro Amira de la Rosa', 'Carrera 54 # 52-27', 4, '2026-05-16 19:30:00', '2026-05-16 21:30:00', 600, 45000.00, 4, NULL, NULL, '1020000004', '2026-03-02 19:30:00'),
('Stand Up Comedy', 'Noche de humor con comediantes invitados', 'Teatro Santander', 'Calle 33 # 18-60', 5, '2026-06-13 20:00:00', '2026-06-13 22:00:00', 800, 55000.00, 4, NULL, NULL, '1020000005', '2026-03-30 20:00:00'),
('Expo Tecnología', 'Feria de innovación y startups', 'Centro Citibanamex', 'Av. del Conscripto 311', 6, '2026-07-11 09:00:00', '2026-07-11 18:00:00', 3000, 70000.00, 5, 'El recinto no estará disponible por mantenimiento.', '2026-06-21 09:00:00', '1020000006', '2026-04-27 09:00:00'),
('Gala de Ballet', 'Compañía nacional de danza', 'Teatro Degollado', 'Calle Belén s/n, Centro', 7, '2026-07-25 19:00:00', '2026-07-25 21:00:00', 900, 80000.00, 4, NULL, NULL, '1020000007', '2026-05-11 19:00:00'),
('Jazz en el Parque', 'Cuartetos de jazz al aire libre', 'Teatro Argentino', 'Av. 51 # 702', 8, '2026-08-08 18:00:00', '2026-08-08 21:00:00', 1200, 60000.00, 4, NULL, NULL, '1020000008', '2026-05-25 18:00:00'),
('Festival Indie', 'Música alternativa y bandas emergentes', 'Quality Espacio', 'Av. Cruz Roja 200', 9, '2026-08-29 17:00:00', '2026-08-29 23:00:00', 2500, 90000.00, 4, NULL, NULL, '1020000009', '2026-06-15 17:00:00'),
('Cumbre de Diseño', 'Charlas de diseño UX/UI', 'Teatro Municipal', 'Agustinas 794', 10, '2026-09-19 09:00:00', '2026-09-19 17:00:00', 1000, 110000.00, 4, NULL, NULL, '1020000010', '2026-07-06 09:00:00'),
('Noche Criolla', 'Música tradicional peruana', 'Gran Teatro Nacional', 'Av. Javier Prado Este 2225', 11, '2026-10-10 20:00:00', '2026-10-10 22:30:00', 1400, 75000.00, 4, NULL, NULL, '1020000011', '2026-07-27 20:00:00'),
('Concierto Pop', 'Artista internacional en gira', 'WiZink Center', 'Av. Felipe II s/n', 12, '2026-10-31 21:00:00', '2026-10-31 23:30:00', 9000, 150000.00, 4, NULL, NULL, '1020000012', '2026-08-17 21:00:00'),
('Ópera Carmen', 'Producción lírica completa', 'Gran Teatre del Liceu', 'La Rambla 51', 13, '2027-01-23 19:00:00', '2027-01-23 22:00:00', 2200, 180000.00, 2, NULL, NULL, '1020000013', '2026-09-10 10:00:00'),
('Feria del Libro', 'Presentaciones de autores y firmas', 'Teatro Sucre', 'Plaza del Teatro', 14, '2027-02-06 10:00:00', '2027-02-06 19:00:00', 1800, 25000.00, 2, NULL, NULL, '1020000014', '2026-09-13 10:00:00'),
('Carnaval Electrónico', 'DJs internacionales', 'Allianz Parque', 'Av. Francisco Matarazzo 1705', 15, '2027-02-20 21:00:00', '2027-02-21 04:00:00', 7000, 130000.00, 5, 'El artista principal canceló su gira.', '2026-11-10 15:00:00', '1020000015', '2026-09-16 10:00:00'),
('Noche de Tango', 'Orquesta típica en vivo', 'Teatro Solís', 'Buenos Aires 678', 16, '2027-03-06 20:00:00', '2027-03-06 22:30:00', 1100, 65000.00, 2, NULL, NULL, '1020000016', '2026-09-19 10:00:00'),
('Expo Gastronómica', 'Chefs invitados y degustaciones', 'Centro de Convenciones', 'Av. Aviadores del Chaco 2100', 17, '2027-03-20 11:00:00', '2027-03-20 20:00:00', 2000, 50000.00, 2, NULL, NULL, '1020000017', '2026-09-22 10:00:00'),
('Música Andina', 'Agrupaciones folclóricas', 'Teatro Municipal Alberto Saavedra', 'Calle Genaro Sanjinés', 18, '2027-04-10 19:00:00', '2027-04-10 21:30:00', 700, 40000.00, 2, NULL, NULL, '1020000018', '2026-09-25 10:00:00'),
('Festival Caribe', 'Ritmos tropicales', 'Poliedro de Caracas', 'La Rinconada', 19, '2027-05-15 18:00:00', '2027-05-15 23:00:00', 4500, 85000.00, 1, NULL, NULL, '1020000019', '2026-09-28 10:00:00'),
('Gala de Fin de Año', 'Orquesta y cena de gala', 'Teatro Nacional', 'Casco Antiguo', 20, '2027-06-19 20:00:00', '2027-06-20 02:00:00', 1000, 200000.00, 1, NULL, NULL, '1020000020', '2026-09-01 10:00:00');

-- 6. Reservas ──────────────────────────────────────────────────────────────
-- id_estado_reserva: 1 = Reservada, 2 = Confirmada (pagada), 3 = Cancelada
-- valor_total = numero_entradas × precio_base del evento (entradas que quedan
-- después de las cancelaciones parciales de la sección 7).

INSERT INTO public.reserva (fecha_hora_reserva, numero_entradas, valor_total, observaciones, id_estado_reserva, causa_cancelacion, fecha_cancelacion, cancelada_por, id_cliente, id_evento) VALUES
('2026-01-20 12:07:00', 3, 255000.00, 'General', 2, NULL, NULL, NULL, '1010000001', 1),
('2026-02-02 14:15:00', 2, 170000.00, 'Palco', 2, NULL, NULL, NULL, '1010000002', 1),
('2026-01-15 12:48:00', 4, 480000.00, 'Balcón', 2, NULL, NULL, NULL, '1010000003', 2),
('2026-02-10 10:24:00', 2, 240000.00, 'Preferencial', 3, 'El cliente ya no puede asistir.', '2026-02-13 10:24:00', 'Cliente', '1010000004', 2),
('2026-04-12 06:00:00', 5, 475000.00, 'VIP', 2, NULL, NULL, NULL, '1010000005', 3),
('2026-02-27 03:36:00', 3, 285000.00, 'Platea', 2, NULL, NULL, NULL, '1010000006', 3),
('2026-04-15 02:42:00', 2, 90000.00, 'General', 2, NULL, NULL, NULL, '1010000007', 4),
('2026-06-08 00:48:00', 2, 110000.00, 'Palco', 2, NULL, NULL, NULL, '1010000008', 5),
('2026-04-24 22:24:00', 3, 165000.00, 'Balcón', 2, NULL, NULL, NULL, '1010000009', 5),
('2026-06-04 01:48:00', 3, 210000.00, 'Preferencial', 3, 'Evento cancelado por el organizador: El recinto no estará disponible por mantenimiento.', '2026-06-21 09:00:00', 'Agente', '1010000010', 6),
('2026-05-02 22:40:00', 2, 140000.00, 'VIP', 3, 'Evento cancelado por el organizador: El recinto no estará disponible por mantenimiento.', '2026-06-21 09:00:00', 'Agente', '1010000011', 6),
('2026-06-13 14:12:00', 3, 240000.00, 'Platea', 2, NULL, NULL, NULL, '1010000012', 7),
('2026-07-23 10:48:00', 4, 240000.00, 'General', 2, NULL, NULL, NULL, '1010000013', 8),
('2026-06-09 08:24:00', 2, 120000.00, 'Palco', 2, NULL, NULL, NULL, '1010000014', 8),
('2026-07-26 05:00:00', 2, 180000.00, 'Balcón', 2, NULL, NULL, NULL, '1010000015', 9),
('2026-09-10 18:36:00', 2, 220000.00, 'Preferencial', 2, NULL, NULL, NULL, '1010000016', 10),
('2026-08-19 03:12:00', 3, 225000.00, 'VIP', 2, NULL, NULL, NULL, '1010000017', 11),
('2026-09-14 00:48:00', 3, 225000.00, 'Platea', 3, 'El cliente ya no puede asistir.', '2026-09-17 00:48:00', 'Cliente', '1010000018', 11),
('2026-08-21 23:24:00', 5, 750000.00, 'General', 2, NULL, NULL, NULL, '1010000019', 12),
('2026-09-16 21:00:00', 3, 450000.00, 'Palco', 2, NULL, NULL, NULL, '1010000020', 12),
('2026-10-30 05:18:00', 2, 360000.00, 'Balcón', 2, NULL, NULL, NULL, '1010000001', 13),
('2026-09-23 16:31:00', 4, 100000.00, 'Preferencial', 2, NULL, NULL, NULL, '1010000002', 14),
('2026-10-14 12:47:00', 4, 520000.00, 'VIP', 3, 'Evento cancelado por el organizador: El artista principal canceló su gira.', '2026-11-10 15:00:00', 'Agente', '1010000003', 15),
('2026-11-07 03:07:00', 2, 130000.00, 'Platea', 2, NULL, NULL, NULL, '1010000004', 16),
('2026-10-06 22:30:00', 5, 250000.00, 'General', 2, NULL, NULL, NULL, '1010000005', 17),
('2026-10-26 14:36:00', 2, 80000.00, 'Palco', 2, NULL, NULL, NULL, '1010000006', 18),
('2026-11-12 21:06:00', 2, 360000.00, 'Balcón', 2, NULL, NULL, NULL, '1010000007', 13),
('2026-10-06 16:28:00', 3, 75000.00, 'Preferencial', 2, NULL, NULL, NULL, '1010000008', 14),
('2026-10-30 04:01:00', 4, 260000.00, 'VIP', 2, NULL, NULL, NULL, '1010000009', 16),
('2026-09-29 10:12:00', 2, 100000.00, 'Platea', 2, NULL, NULL, NULL, '1010000010', 17);

-- 7. Cancelaciones parciales de entradas ───────────────────────────────────
-- entradas_antes = entradas que tenía la reserva antes de esa cancelación.

INSERT INTO public.cancelacion_entradas (id_reserva, entradas_canceladas, entradas_antes, valor_cancelado, causa, cancelada_por, fecha_cancelacion) VALUES
(1, 1, 4, 85000.00, 'Cambio de planes', 'Cliente', '2026-01-30 05:16:00'),
(2, 1, 3, 85000.00, 'Un acompañante no asiste', 'Cliente', '2026-02-07 01:45:00'),
(3, 1, 5, 120000.00, 'Error en la cantidad', 'Cliente', '2026-02-10 06:04:00'),
(5, 1, 6, 95000.00, 'Imprevisto laboral', 'Agente', '2026-04-17 06:00:00'),
(6, 1, 4, 95000.00, 'Viaje cancelado', 'Cliente', '2026-03-21 18:57:00'),
(7, 1, 3, 45000.00, 'Cruce de horario', 'Administrador', '2026-04-27 09:25:00'),
(9, 1, 4, 55000.00, 'Motivo personal', 'Cliente', '2026-05-14 11:50:00'),
(12, 1, 4, 80000.00, 'Reducción del grupo', 'Cliente', '2026-06-30 01:43:00'),
(13, 1, 5, 60000.00, 'Enfermedad de un acompañante', 'Cliente', '2026-07-29 13:40:00'),
(15, 1, 3, 90000.00, 'Cambio de asistencia', 'Agente', '2026-08-08 14:36:00'),
(17, 1, 4, 75000.00, 'Cambio de planes', 'Cliente', '2026-09-08 19:31:00'),
(19, 1, 6, 150000.00, 'Un acompañante no asiste', 'Administrador', '2026-09-18 22:26:00'),
(20, 1, 4, 150000.00, 'Error en la cantidad', 'Cliente', '2026-10-04 11:24:00'),
(22, 1, 5, 25000.00, 'Imprevisto laboral', 'Cliente', '2026-10-14 09:54:00'),
(24, 1, 3, 65000.00, 'Viaje cancelado', 'Cliente', '2026-11-10 01:52:00'),
(25, 1, 6, 50000.00, 'Cruce de horario', 'Agente', '2026-10-22 08:42:00'),
(27, 1, 3, 180000.00, 'Motivo personal', 'Cliente', '2026-11-13 12:39:00'),
(28, 1, 4, 25000.00, 'Reducción del grupo', 'Administrador', '2026-10-22 05:04:00'),
(29, 1, 5, 65000.00, 'Enfermedad de un acompañante', 'Cliente', '2026-11-05 07:12:00'),
(30, 1, 3, 50000.00, 'Cambio de asistencia', 'Cliente', '2026-10-17 20:31:00');

COMMIT;