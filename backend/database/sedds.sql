INSERT INTO public."PAIS" (nombre_pais) VALUES
('Colombia'), ('México'), ('Argentina'), ('Chile'), ('Perú'),
('España'), ('Ecuador'), ('Brasil'), ('Uruguay'), ('Paraguay'),
('Bolivia'), ('Venezuela'), ('Panamá'), ('Costa Rica'), ('Guatemala'),
('Honduras'), ('El Salvador'), ('Nicaragua'), ('República Dominicana'), ('Puerto Rico');

INSERT INTO public."TIPO_PLAN" (nombre_plan, descripcion_plan, precio_plan, limite_evento) VALUES
('Plan Básico', 'Hasta 5 eventos activos, gestión de reservas, panel de eventos', 29900.00, 5),
('Plan Profesional', 'Hasta 20 eventos activos, gestión de reservas, estadísticas de tus eventos', 49900.00, 20),
('Plan Empresa', 'Eventos activos ilimitados, gestión de reservas, estadísticas de tus eventos', 89900.00, 9999),
('Plan Emprendedor', 'Hasta 3 eventos activos mensuales', 19900.00, 3),
('Plan Plus', 'Hasta 10 eventos activos con soporte prioritario', 39900.00, 10),
('Plan Corporativo', 'Hasta 50 eventos activos para grandes productoras', 129900.00, 50),
('Plan Festival', 'Eventos masivos hasta 100 activos', 199900.00, 100),
('Plan Teatro', 'Ideal para salas y teatros independientes', 59900.00, 25),
('Plan Conferencia', 'Enfocado en eventos académicos y charlas', 34900.00, 8),
('Plan VIP', 'Eventos ilimitados con analítica avanzada', 249900.00, 9999),
('Plan Universitario', 'Descuento para instituciones educativas', 14900.00, 4),
('Plan Cultural', 'Para centros culturales y museos', 24900.00, 6),
('Plan Deportivo', 'Gestión de torneos y eventos deportivos', 69900.00, 30),
('Plan Nocturno', 'Para bares, clubes y conciertos locales', 44900.00, 15),
('Plan Temporada', 'Válido para giras de temporada', 79900.00, 40),
('Plan Regional', 'Cobertura regional multi-ciudad', 99900.00, 60),
('Plan Nacional', 'Cobertura nacional ilimitada', 159900.00, 9999),
('Plan Internacional', 'Eventos en múltiples países', 299900.00, 9999),
('Plan Prueba', 'Plan inicial de prueba', 9900.00, 2),
('Plan Aliado', 'Para socios estratégicos de EventNova', 109900.00, 75);

INSERT INTO public."ESTADO" (nombre_estado) VALUES
('Programado'), ('En Boletería'), ('En Vivo'), ('Finalizado'), ('Cancelado'),
('Borrador'), ('En Revisión'), ('Aprobado'), ('Pospuesto'), ('Agotado'),
('Preventa'), ('Últimas Entradas'), ('Suspendido'), ('Reprogramado'), ('Archivado'),
('Privado'), ('Público'), ('Destacado'), ('Cerrado'), ('En Espera');

INSERT INTO public."ESTADO_RESERVA" (nombre_estado) VALUES
('Reservada'), ('Confirmada'), ('Cancelada'), ('Pendiente Pago'), ('Expirada'),
('Reembolsada'), ('En Validación'), ('Asistida'), ('No Asistida'), ('Parcial'),
('Transferida'), ('Bloqueada'), ('Cortesía'), ('VIP Confirmada'), ('Lista Espera'),
('Rechazada'), ('Anulada'), ('Pausada'), ('Verificada'), ('Cerrada');

INSERT INTO public."DEPARTAMENTO" (id_pais, nombre_departamento) VALUES
(1, 'Antioquia'), (1, 'Cundinamarca'), (1, 'Valle del Cauca'), (1, 'Atlántico'), (1, 'Santander'),
(2, 'Ciudad de México'), (2, 'Jalisco'), (3, 'Buenos Aires'), (3, 'Córdoba'), (4, 'Santiago'),
(5, 'Lima'), (6, 'Madrid'), (6, 'Cataluña'), (7, 'Pichincha'), (8, 'São Paulo'),
(9, 'Montevideo'), (10, 'Central'), (11, 'La Paz'), (12, 'Miranda'), (13, 'Panamá');

INSERT INTO public."CIUDAD" (id_departamento, nombre_ciudad) VALUES
(1, 'Medellín'), (2, 'Bogotá'), (3, 'Cali'), (4, 'Barranquilla'), (5, 'Bucaramanga'),
(6, 'CDMX'), (7, 'Guadalajara'), (8, 'La Plata'), (9, 'Córdoba'), (10, 'Santiago'),
(11, 'Lima'), (12, 'Madrid'), (13, 'Barcelona'), (14, 'Quito'), (15, 'São Paulo'),
(16, 'Montevideo'), (17, 'Asunción'), (18, 'La Paz'), (19, 'Caracas'), (20, 'Ciudad de Panamá');

INSERT INTO public."USUARIO" (numero_id, correo, nombre, contraseña, fecha_nacimiento, direccion, id_ciudad) VALUES
('1001', 'usuario1@eventnova.com',  'Carlos Pérez',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1990-01-15', 'Calle 10 # 20-30', 1),
('1002', 'usuario2@eventnova.com',  'María Gómez',       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1992-03-22', 'Carrera 15 # 40-12', 2),
('1003', 'usuario3@eventnova.com',  'Juan Rodríguez',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1988-07-09', 'Avenida 5 # 12-45', 3),
('1004', 'usuario4@eventnova.com',  'Laura Martínez',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1995-11-30', 'Calle 80 # 11-22', 4),
('1005', 'usuario5@eventnova.com',  'Andrés López',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1991-05-18', 'Carrera 27 # 33-10', 5),
('1006', 'usuario6@eventnova.com',  'Sofía Hernández',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1993-09-04', 'Av. Reforma 120', 6),
('1007', 'usuario7@eventnova.com',  'Diego Torres',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1987-12-11', 'Calle Hidalgo 45', 7),
('1008', 'usuario8@eventnova.com',  'Valentina Díaz',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1996-02-25', 'Diagonal 74 # 500', 8),
('1009', 'usuario9@eventnova.com',  'Mateo Sánchez',     '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1994-06-14', 'Bv. San Juan 230', 9),
('1010', 'usuario10@eventnova.com', 'Camila Ramírez',    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1989-08-19', 'Alameda 1450', 10),
('1011', 'usuario11@eventnova.com', 'Sebastián Castro',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1992-10-03', 'Av. Arequipa 890', 11),
('1012', 'usuario12@eventnova.com', 'Isabella Morales',  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1997-04-27', 'Gran Vía 42', 12),
('1013', 'usuario13@eventnova.com', 'Alejandro Ortiz',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1986-11-08', 'Passeig de Gràcia 18', 13),
('1014', 'usuario14@eventnova.com', 'Lucía Vargas',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1998-01-21', 'Av. Amazonas 310', 14),
('1015', 'usuario15@eventnova.com', 'Daniel Silva',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1990-07-16', 'Av. Paulista 1000', 15),
('1016', 'usuario16@eventnova.com', 'Paula Méndez',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1993-03-09', '18 de Julio 950', 16),
('1017', 'usuario17@eventnova.com', 'Felipe Rojas',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1991-12-02', 'Av. España 400', 17),
('1018', 'usuario18@eventnova.com', 'Natalia Navarro',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1995-05-28', 'Av. Arce 210', 18),
('1019', 'usuario19@eventnova.com', 'Gabriel Peña',      '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1989-09-13', 'Av. Francisco de Miranda', 19),
('1020', 'usuario20@eventnova.com', 'Mariana Herrera',   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1994-10-24', 'Calle 50, Torre 1', 20);

INSERT INTO public."TELEFONOS" (numero_id, telefono) VALUES
('1001', '3001110001'), ('1002', '3001110002'), ('1003', '3001110003'), ('1004', '3001110004'),
('1005', '3001110005'), ('1006', '3001110006'), ('1007', '3001110007'), ('1008', '3001110008'),
('1009', '3001110009'), ('1010', '3001110010'), ('1011', '3001110011'), ('1012', '3001110012'),
('1013', '3001110013'), ('1014', '3001110014'), ('1015', '3001110015'), ('1016', '3001110016'),
('1017', '3001110017'), ('1018', '3001110018'), ('1019', '3001110019'), ('1020', '3001110020');

INSERT INTO public."AGENTE" (numero_id, id_plan, nombre_empresa, descripcion_agente, comision, experiencia) VALUES
('1001', 1, 'Eventos Nova S.A.',     'Productora de conciertos',        5.00, 4),
('1002', 2, 'Live Stage',            'Eventos culturales y teatro',     6.50, 6),
('1003', 3, 'MegaFest',              'Festivales masivos',              8.00, 10),
('1004', 1, 'Teatro Vivo',           'Obras independientes',            4.50, 3),
('1005', 2, 'Sonido Sur',            'Conciertos regionales',           5.50, 5),
('1006', 3, 'Arena Global',          'Espectáculos internacionales',    7.50, 9),
('1007', 1, 'Cultura Urbana',        'Stand-up y arte urbano',          5.00, 2),
('1008', 2, 'Escena Abierta',        'Danza y música clásica',          6.00, 7),
('1009', 3, 'ShowTime Latam',        'Giras musicales',                 8.50, 11),
('1010', 1, 'Foro Académico',        'Congresos y seminarios',          4.00, 4),
('1011', 2, 'Lima Live',             'Conciertos en Perú',              6.00, 5),
('1012', 3, 'Madrid Espectáculos',   'Grandes producciones',            7.00, 8),
('1013', 1, 'Bcn Arts',              'Galerías y música',               5.00, 3),
('1014', 2, 'Andes Fest',            'Festivales andinos',              6.25, 6),
('1015', 3, 'Brasil Show',           'Eventos masivos',                 9.00, 12),
('1016', 1, 'Río de la Plata',       'Teatro y tango',                  4.75, 4),
('1017', 2, 'Guaraní Eventos',       'Ferias y exposiciones',           5.50, 5),
('1018', 3, 'Altura Live',           'Conciertos y cultura',            7.00, 7),
('1019', 1, 'Caribe Sound',          'Música tropical',                 5.25, 3),
('1020', 2, 'Istmo Producciones',    'Eventos corporativos',            6.00, 6);

INSERT INTO public."ADMINISTRADOR" (numero_id, codigo_admin, salario, horario) VALUES
('1001', 'ADM-001', 4500000.00, 'Lunes a viernes 8:00 - 17:00'),
('1002', 'ADM-002', 4200000.00, 'Lunes a viernes 8:00 - 17:00'),
('1003', 'ADM-003', 4800000.00, 'Lunes a viernes 9:00 - 18:00'),
('1004', 'ADM-004', 4100000.00, 'Lunes a viernes 8:00 - 17:00'),
('1005', 'ADM-005', 4300000.00, 'Lunes a viernes 7:00 - 16:00'),
('1006', 'ADM-006', 4600000.00, 'Lunes a viernes 8:00 - 17:00'),
('1007', 'ADM-007', 4000000.00, 'Lunes a viernes 9:00 - 18:00'),
('1008', 'ADM-008', 4400000.00, 'Lunes a viernes 8:00 - 17:00'),
('1009', 'ADM-009', 4900000.00, 'Lunes a viernes 8:00 - 17:00'),
('1010', 'ADM-010', 4150000.00, 'Lunes a viernes 8:00 - 17:00'),
('1011', 'ADM-011', 4250000.00, 'Lunes a viernes 9:00 - 18:00'),
('1012', 'ADM-012', 4700000.00, 'Lunes a viernes 8:00 - 17:00'),
('1013', 'ADM-013', 4350000.00, 'Lunes a viernes 8:00 - 17:00'),
('1014', 'ADM-014', 4050000.00, 'Lunes a viernes 7:00 - 16:00'),
('1015', 'ADM-015', 5000000.00, 'Lunes a viernes 8:00 - 17:00'),
('1016', 'ADM-016', 4100000.00, 'Lunes a viernes 8:00 - 17:00'),
('1017', 'ADM-017', 4200000.00, 'Lunes a viernes 9:00 - 18:00'),
('1018', 'ADM-018', 4450000.00, 'Lunes a viernes 8:00 - 17:00'),
('1019', 'ADM-019', 4300000.00, 'Lunes a viernes 8:00 - 17:00'),
('1020', 'ADM-020', 4550000.00, 'Lunes a viernes 8:00 - 17:00');

INSERT INTO public."CLIENTE" (numero_id, codigo_cliente, puntos, visualizar_publicidad) VALUES
('1001', 'CLI-001', 120, TRUE),  ('1002', 'CLI-002', 250, TRUE),
('1003', 'CLI-003', 80,  FALSE), ('1004', 'CLI-004', 310, TRUE),
('1005', 'CLI-005', 45,  TRUE),  ('1006', 'CLI-006', 500, FALSE),
('1007', 'CLI-007', 90,  TRUE),  ('1008', 'CLI-008', 150, TRUE),
('1009', 'CLI-009', 200, FALSE), ('1010', 'CLI-010', 60,  TRUE),
('1011', 'CLI-011', 340, TRUE),  ('1012', 'CLI-012', 410, TRUE),
('1013', 'CLI-013', 75,  FALSE), ('1014', 'CLI-014', 180, TRUE),
('1015', 'CLI-015', 220, TRUE),  ('1016', 'CLI-016', 95,  FALSE),
('1017', 'CLI-017', 130, TRUE),  ('1018', 'CLI-018', 275, TRUE),
('1019', 'CLI-019', 50,  TRUE),  ('1020', 'CLI-020', 390, FALSE);

INSERT INTO public."EVENTO" (nombre_evento, descripcion_evento, teatro, direccion_evento, id_ciudad, fecha_inicio, fecha_fin, capacidad, precio_base, id_estado, id_agente) VALUES
('Concierto Sinfónico',    'Orquesta filarmónica en vivo',   'Teatro Metropolitano', 'Calle 41 # 57-30', 1,  '2026-03-10 19:00:00', '2026-03-10 22:00:00', 1500, 85000.00,  2, '1001'),
('Noche de Rock',          'Bandas nacionales invitadas',     'Movistar Arena',       'Diag 61C # 26-36', 2,  '2026-04-15 20:00:00', '2026-04-15 23:30:00', 5000, 120000.00, 2, '1002'),
('Festival de Salsa',      'Encuentro salsero internacional', 'Estadio Pascual',      'Calle 5 # 34-00',  3,  '2026-05-20 18:00:00', '2026-05-21 01:00:00', 8000, 95000.00,  1, '1003'),
('Obra El Quijote',        'Adaptación teatral clásica',      'Teatro Amira',         'Carrera 54 # 52',  4,  '2026-06-05 19:30:00', '2026-06-05 21:30:00', 600,  45000.00,  2, '1004'),
('Stand Up Comedy',        'Noche de humor',                  'Teatro Santander',     'Calle 33 # 18-60', 5,  '2026-06-18 20:00:00', '2026-06-18 22:00:00', 800,  55000.00,  3, '1005'),
('Expo Tecnología',        'Feria de innovación',             'Centro Citibanamex',   'Av. Conscripto',   6,  '2026-07-10 09:00:00', '2026-07-10 18:00:00', 3000, 70000.00,  1, '1006'),
('Gala de Ballet',         'Compañía nacional de danza',      'Teatro Degollado',     'Centro Histórico', 7,  '2026-07-22 19:00:00', '2026-07-22 21:30:00', 900,  80000.00,  2, '1007'),
('Jazz en el Parque',      'Cuartetos de jazz',               'Teatro Argentino',     'Av. 51 # 702',     8,  '2026-08-03 18:00:00', '2026-08-03 21:00:00', 1200, 60000.00,  4, '1008'),
('Festival Indie',         'Música alternativa',              'Quality Espacio',      'Av. Cruz Roja',    9,  '2026-08-14 17:00:00', '2026-08-14 23:00:00', 2500, 90000.00,  2, '1009'),
('Cumbre de Diseño',       'Charlas de diseño UX/UI',         'Teatro Municipal',     'Agustinas 794',    10, '2026-09-01 09:00:00', '2026-09-01 17:00:00', 1000, 110000.00, 1, '1010'),
('Noche Criolla',          'Música tradicional peruana',      'Gran Teatro Nacional', 'Av. Javier Prado', 11, '2026-09-12 20:00:00', '2026-09-12 22:30:00', 1400, 75000.00,  2, '1011'),
('Concierto Pop',          'Artista internacional',           'WiZink Center',        'Av. Felipe II',    12, '2026-09-25 21:00:00', '2026-09-25 23:30:00', 9000, 150000.00, 2, '1012'),
('Ópera Carmen',           'Producción lírica completa',      'Gran Teatre Liceu',    'La Rambla 51',     13, '2026-10-04 19:00:00', '2026-10-04 22:00:00', 2200, 180000.00, 1, '1013'),
('Feria del Libro',        'Presentaciones y autores',        'Teatro Sucre',         'Plaza del Teatro', 14, '2026-10-15 10:00:00', '2026-10-15 19:00:00', 1800, 25000.00,  2, '1014'),
('Carnaval Electrónico',   'DJs internacionales',             'Allianz Parque',       'Av. Francisco',    15, '2026-10-28 21:00:00', '2026-10-29 04:00:00', 7000, 130000.00, 5, '1015'),
('Noche de Tango',         'Orquesta típica en vivo',         'Teatro Solís',         'Buenos Aires 678', 16, '2026-11-05 20:00:00', '2026-11-05 22:30:00', 1100, 65000.00,  2, '1016'),
('Expo Gastronómica',      'Chefs y degustaciones',           'Centro de Convenciones', 'Av. Aviadores',  17, '2026-11-12 11:00:00', '2026-11-12 20:00:00', 2000, 50000.00,  1, '1017'),
('Música Andina',          'Agrupaciones folclóricas',        'Teatro Municipal',     'Calle Genaro',     18, '2026-11-19 19:00:00', '2026-11-19 21:30:00', 700,  40000.00,  2, '1018'),
('Festival Caribe',        'Ritmos tropicales',               'Poliedro',             'La Rinconada',     19, '2026-11-26 18:00:00', '2026-11-26 23:00:00', 4500, 85000.00,  2, '1019'),
('Gala de Fin de Año',     'Orquesta y cena de gala',         'Teatro Nacional',      'Casco Antiguo',    20, '2026-12-20 20:00:00', '2026-12-21 02:00:00', 1000, 200000.00, 1, '1020');

INSERT INTO public."RESERVA" (numero_entradas, valor_total, observaciones, id_estado_reserva, id_cliente, id_evento) VALUES
(2, 170000.00, 'Platea',          2, '1001', 1),
(4, 480000.00, 'General',         2, '1002', 2),
(3, 285000.00, 'Palco',           1, '1003', 3),
(2, 90000.00,  'Balcón',          2, '1004', 4),
(5, 275000.00, 'Grupo amigos',    2, '1005', 5),
(1, 70000.00,  'Pase diario',     1, '1006', 6),
(2, 160000.00, 'Preferencial',    2, '1007', 7),
(3, 180000.00, 'Zona verde',      2, '1008', 8),
(4, 360000.00, 'Campo',           3, '1009', 9),
(2, 220000.00, 'Taller incluido', 2, '1010', 10),
(2, 150000.00, 'Mezzanine',       1, '1011', 11),
(6, 900000.00, 'Pista VIP',       2, '1012', 12),
(2, 360000.00, 'Palco central',   2, '1013', 13),
(3, 75000.00,  'Entrada general', 1, '1014', 14),
(4, 520000.00, 'VIP',             3, '1015', 15),
(2, 130000.00, 'Tertulia',        2, '1016', 16),
(5, 250000.00, 'Degustación',     2, '1017', 17),
(2, 80000.00,  'Platea baja',     1, '1018', 18),
(3, 255000.00, 'Gradería',        2, '1019', 19),
(2, 400000.00, 'Mesa gala',       2, '1020', 20);

INSERT INTO public."CANCELACION_ENTRADAS" (id_reserva, entradas_canceladas, entradas_antes, valor_cancelado, causa, cancelada_por) VALUES
(1,  1, 3, 85000.00,  'Cambio de planes',          'Cliente'),
(2,  1, 5, 120000.00, 'Un acompañante no asiste',  'Cliente'),
(3,  1, 4, 95000.00,  'Ajuste de cupo',            'Agente'),
(4,  1, 3, 45000.00,  'Error en cantidad',         'Cliente'),
(5,  1, 6, 55000.00,  'Imprevisto laboral',        'Cliente'),
(6,  1, 2, 70000.00,  'Viaje cancelado',           'Cliente'),
(7,  1, 3, 80000.00,  'Cambio de fecha',           'Agente'),
(8,  1, 4, 60000.00,  'Solicitud del cliente',     'Administrador'),
(9,  1, 5, 90000.00,  'Motivo personal',           'Cliente'),
(10, 1, 3, 110000.00, 'Cruce de horario',          'Cliente'),
(11, 1, 3, 75000.00,  'Ajuste de reserva',         'Cliente'),
(12, 2, 8, 300000.00, 'Reducción de grupo',        'Cliente'),
(13, 1, 3, 180000.00, 'Enfermedad',                'Cliente'),
(14, 1, 4, 25000.00,  'Cambio de asistencia',      'Cliente'),
(15, 1, 5, 130000.00, 'Reprogramación',            'Agente'),
(16, 1, 3, 65000.00,  'Solicitud telefónica',      'Administrador'),
(17, 2, 7, 100000.00, 'Menos asistentes',          'Cliente'),
(18, 1, 3, 40000.00,  'Inconveniente de viaje',    'Cliente'),
(19, 1, 4, 85000.00,  'Cambio de localidad',       'Agente'),
(20, 1, 3, 200000.00, 'Ajuste de mesa',            'Cliente');
