-- Script para el Avance 1
-- Cambia la conexion a la base de datos overlock_hn
\c overclock_hn

-- Bloque para eliminar todas las tablas del schema actual, si ya existen previamente
DO $$ DECLARE
    record RECORD;
BEGIN
    FOR record IN (SELECT tablename FROM pg_tables WHERE schemaname = "current_schema"()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(record.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Creacion de las tablas requeridas
CREATE TABLE usuarios(
    id_usuario integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(20) UNIQUE NOT NULL,
    contrasena varchar(100) NOT NULL,
    fecha_creacion timestamp DEFAULT(current_timestamp) NOT NULL,
    url_foto varchar(50) NULL,
    -- Valor para determinar los permisos del usuario
    administrador boolean DEFAULT(FALSE) NOT NULL
);

-- CREATE TABLE personas();

CREATE TABLE clientes(
    id_cliente integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dni varchar(13) UNIQUE NOT NULL
        CHECK (length(dni) = 13),
    rtn varchar(14) UNIQUE
        CHECK (length(rtn) = 14),
    primer_nombre varchar(100) NOT NULL,
    segundo_nombre varchar(100),
    primer_apellido varchar(100) NOT NULL,
    segundo_apellido varchar(100),
    fecha_nacimiento date NOT NULL
        CHECK ((extract(YEAR from current_date) - extract(YEAR from fecha_nacimiento)) >= 18),
    telefono varchar(20) UNIQUE NOT NULL,
    correo varchar(100) UNIQUE NOT NULL
        CHECK (correo ~~ '%@%'),
    fecha_registro timestamp DEFAULT(current_timestamp) NOT NULL,
    razon_social varchar(50),
    estado boolean NOT NULL
);

CREATE TABLE usuarios_clientes(
    id_usuario_cliente integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- El usuario solo puede estar presente una vez en la tabla, para un cliente
    id_usuario integer UNIQUE REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_cliente integer REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
    ultimo_acceso timestamp
);

CREATE TABLE paises(
    id_pais integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL
);

CREATE TABLE departamentos(
    id_departamento integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pais integer REFERENCES paises(id_pais) ON DELETE RESTRICT,
    nombre varchar(100)
);

CREATE TABLE ciudades(
    id_ciudad integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_departamento integer REFERENCES departamentos(id_departamento) ON DELETE RESTRICT,
    nombre varchar(100) NOT NULL,
    codigo_postal varchar(5) UNIQUE NOT NULL
        CHECK(length(codigo_postal) = 5)
);

CREATE TABLE direcciones(
    id_direccion integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ciudad integer REFERENCES ciudades(id_ciudad) ON DELETE RESTRICT,
    calle varchar(100) NOT NULL,
    referencias varchar(500)
);

CREATE TABLE direcciones_clientes(
    id_direccion_cliente integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- La direccion solo puede pertenecer a un cliente con la restriccion UNIQUE
    id_direccion integer UNIQUE REFERENCES direcciones(id_direccion) ON DELETE CASCADE,
    id_cliente integer REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
    -- Valor si el usuario marco una direccion como predeterminada
    predeterminada boolean DEFAULT(FALSE) NOT NULL
);

CREATE TABLE categorias(
    id_categoria integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    descripcion varchar(500)
);

CREATE TABLE marcas(
    id_marca integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pais integer REFERENCES paises(id_pais) ON DELETE RESTRICT,
    nombre varchar(100) NOT NULL
);

CREATE TABLE productos(
    id_producto integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria integer REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    id_marca integer REFERENCES marcas(id_marca) ON DELETE RESTRICT,
    codigo_sku varchar(8) UNIQUE NOT NULL,
    numero_lote varchar(20) UNIQUE NOT NULL,
    modelo varchar(100) NOT NULL,
    precio_costo decimal(19, 4) NOT NULL,
    precio_descuento decimal(19, 4) NOT NULL,
    precio_venta decimal(19, 4) NOT NULL,
    stock int NOT NULL,
    fecha_ingreso timestamp DEFAULT(current_timestamp) NOT NULL,
    url_img varchar(100),
    estado boolean NOT NULL
);

CREATE TABLE especificaciones(
    id_especificacion integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto integer REFERENCES productos(id_producto) ON DELETE CASCADE,
    especificacion varchar(100) NOT NULL
);

CREATE TABLE proveedores(
    id_proveedor integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_direccion integer REFERENCES direcciones(id_direccion) ON DELETE RESTRICT,
    rtn varchar(14) UNIQUE NOT NULL
        CHECK(length(rtn) = 14),
    nombre varchar(100) NOT NULL,
    telefono varchar(20) UNIQUE NOT NULL,
    correo varchar(50) UNIQUE NOT NULL
        CHECK(correo ~~ '%@%'),
    estado boolean NOT NULL
);

CREATE TABLE compras(
    id_compra integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_proveedor integer REFERENCES proveedores(id_proveedor) ON DELETE RESTRICT,
    numero_compra varchar(20) UNIQUE NOT NULL,
    fecha_compra timestamp DEFAULT(current_timestamp) UNIQUE NOT NULL,
    subtotal decimal(19, 4) NOT NULL,
    isv decimal (3, 2) DEFAULT(0.15) NOT NULL,
    monto_isv decimal(19, 4) NOT NULL,
    total decimal(19, 4) NOT NULL
);

CREATE TABLE detalles_compras(
    id_detalles_compras integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_compra integer REFERENCES compras(id_compra) ON DELETE CASCADE,
    id_producto integer REFERENCES productos(id_producto) ON DELETE RESTRICT,
    cantidad integer NOT NULL,
    precio_compra decimal(19, 4) NOT NULL,
    subtotal decimal(19, 4) NOT NULL
);

CREATE TABLE metodos_pago(
    id_metodo_pago integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    descripcion varchar(500),
    condicion_pago varchar(20) DEFAULT('Contado') NOT NULL
);

CREATE TABLE sucursales(
    id_sucursal integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_direccion integer REFERENCES direcciones(id_direccion) ON DELETE RESTRICT,
    -- Se refiere al rtn y correo de la empresa que se deben imprimir en las facturas
    rtn varchar(14) UNIQUE NOT NULL
        CHECK(length(rtn) = 14),
    correo varchar(20) NOT NULL
        CHECK(correo ~~ '%@%'),
    hora_apertura time NOT NULL,
    hora_cierre time NOT NULL,
    telefono varchar(20) UNIQUE NOT NULL,
    fecha_inauguracion date NOT NULL,
    estado boolean NOT NULL
);

CREATE TABLE repartidores(
    id_repartidor integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dni varchar(13) UNIQUE NOT NULL
        CHECK(length(Dni) = 13),
    primer_nombre varchar(100) NOT NULL,
    segundo_nombre varchar(100),
    primer_apellido varchar(100) NOT NULL,
    segundo_apellido varchar(100),
    fecha_nacimiento date NOT NULL
        CHECK ((extract(YEAR from current_date) - extract(YEAR from fecha_nacimiento)) >= 18),
    telefono varchar(20) UNIQUE NOT NULL,
    estado boolean NOT NULL
);

CREATE TABLE vendedores(
    id_vendedor integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dni varchar(13) UNIQUE NOT NULL
        CHECK(length(Dni) = 13),
    primer_nombre varchar(100) NOT NULL,
    segundo_nombre varchar(100),
    primer_apellido varchar(100) NOT NULL,
    segundo_apellido varchar(100),
    fecha_nacimiento date NOT NULL
        CHECK ((extract(YEAR from current_date) - extract(YEAR from fecha_nacimiento)) >= 18),
    telefono varchar(20) UNIQUE NOT NULL,
    estado boolean NOT NULL
);

CREATE TABLE comprobantes_fiscales(
    id_comprobante_fiscal integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cai varchar(37) UNIQUE NOT NULL -- Un cai esta formado por grupos de 6 digitos separados, haciendo un total de 32
        CHECK(length(cai) = 37), -- La longitud de 37 incluye los 32 digitos mas 5 guiones de separacion
    correlativo_minimo varchar(19) UNIQUE NOT NULL -- Inicio del rango de numeros factura disponibles para la empresa
        CHECK(length(correlativo_minimo) = 19),
    correlativo_maximo varchar(19) UNIQUE NOT NULL -- Fin del rango de numeros de factura
        CHECK(length(correlativo_maximo) = 19),
    fecha_limite date NOT NULL
);

CREATE TABLE facturas(
    id_factura integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_comprobante_fiscal integer REFERENCES comprobantes_fiscales(id_comprobante_fiscal) ON DELETE RESTRICT,
    id_sucursal integer REFERENCES sucursales(id_sucursal) ON DELETE RESTRICT,
    id_vendedor integer REFERENCES vendedores(id_vendedor) ON DELETE RESTRICT,
    id_cliente integer REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
    id_metodo_pago integer REFERENCES metodos_pago(id_metodo_pago) ON DELETE SET NULL,
    numero_factura varchar(50) UNIQUE NOT NULL,
    fecha_emision timestamp DEFAULT(current_timestamp) NOT NULL,
    importe_exonerado decimal(19, 4) NOT NULL, -- Monto del que el cliente esta dispensado o libre de no realizar
    importe_exento decimal(19, 4) NOT NULL, -- Monto donde no se aplica impuestos debido al tipo de servicio
    importe_gravado decimal(19, 4) NOT NULL, -- Monto que si aplica a impuestos
    descuentos decimal(19, 4) NOT NULL, -- Suma de los descuentos individuales aplicables en cada producto
    subtotal decimal(19, 4) NOT NULL, -- Suma de los importes previos
    isv decimal(3, 2) DEFAULT(0.15) NOT NULL,
    monto_isv decimal(19, 4) NOT NULL, -- Porcentaje y calculo de impuestos, si aplica
    total decimal(19, 4) NOT NULL -- Total final a pagar
);

CREATE TABLE detalles_factura(
    id_detalle_factura integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_factura integer REFERENCES facturas(id_factura) ON DELETE CASCADE,
    id_producto integer REFERENCES productos(id_producto) ON DELETE RESTRICT,
    precio_venta decimal(19, 4) NOT NULL,
    cantidad integer NOT NULL,
    descuento decimal(3,2) NOT NULL, -- Porcentaje del descuento
    monto_descuento decimal(19, 4) NOT NULL, -- Monto que resulta de dicho descuento
    subtotal decimal (19, 4) NOT NULL
);

CREATE TABLE garantias(
    id_garantia integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cliente integer REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
    id_producto integer REFERENCES productos(id_producto) ON DELETE RESTRICT,
    fecha_inicio date DEFAULT(current_date) NOT NULL,
    fecha_vencimiento date NOT NULL,
    estado varchar(20) DEFAULT('Activa') NOT NULL
);

CREATE TABLE pedidos(
    id_pedido integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_factura integer REFERENCES facturas(id_factura) ON DELETE CASCADE,
    fecha_creacion timestamp DEFAULT(current_timestamp) NOT NULL,
    fecha_finalizacion timestamp,
    estado varchar(20) DEFAULT('Pendiente') NOT NULL,
    entrega_domicilio integer NOT NULL
);

CREATE TABLE envios(
    id_envio integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pedido integer REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_repartidor integer REFERENCES repartidores(id_repartidor) ON DELETE RESTRICT,
    id_direccion integer REFERENCES direcciones(id_direccion) ON DELETE RESTRICT,
    numero_guia varchar(20) UNIQUE NOT NULL,
    observaciones varchar(500) NOT NULL,
    estado varchar(20) DEFAULT('En preparacion') NOT NULL
);

-- Inserts de prueba en todas las tablas
-- USUARIOS
INSERT INTO usuarios (nombre, contrasena, fecha_creacion, url_foto, administrador)
VALUES('admin_08', 'secretpassword',DEFAULT, '/img/usuarios', TRUE);

INSERT INTO usuarios (nombre, contrasena, fecha_creacion, url_foto, administrador)
VALUES('oscar1', '12345',DEFAULT, '/img/usuarios', DEFAULT);

-- PERSONAS

-- CLIENTES
INSERT INTO clientes(dni, rtn, primer_nombre, segundo_nombre,
    primer_apellido, segundo_apellido, fecha_nacimiento, telefono, correo, razon_social, estado)
VALUES ('0801200011111', '99999999999999', 'Oscar', 'Miguel',
    'Velasquez', 'Mendoza', '19990201', '33339999',
    'oscar@gmail.com', NULL, TRUE);

-- USUARIOS_CLIENTES
INSERT INTO usuarios_clientes(id_usuario, id_cliente, ultimo_acceso)
VALUES (2, 1, '20261114');

-- PAISES
INSERT INTO paises(nombre)
VALUES ('Honduras');

INSERT INTO paises(nombre)
VALUES ('Estados Unidos');

-- DEPARTAMENTOS
INSERT INTO departamentos(id_pais, nombre)
VALUES (1, 'Francisco Morazan');

-- CIUDADES
INSERT INTO ciudades(id_departamento, nombre, codigo_postal)
VALUES (1, 'Distrito Central', '11101');

-- DIRECCIONES
INSERT INTO direcciones(id_ciudad, calle, referencias)
VALUES (1, 'Boulevard Suyapa', 'Torre Metropolis, Segundo piso');

INSERT INTO direcciones(id_ciudad, calle, referencias)
VALUES (1, 'Residencias Las Uvas', 'Casa numero 9999');

INSERT INTO direcciones(id_ciudad, calle, referencias)
VALUES (1, 'Anillo periferico', 'Atras de la gasolinera DOS');

-- DIRECCIONES_CLIENTES
INSERT INTO direcciones_clientes(id_direccion, id_cliente, predeterminada)
VALUES (2, 1, TRUE);

-- CATEGORIAS
INSERT INTO categorias(nombre, descripcion)
VALUES ('Laptops', 'Computadoras portatiles de una variedad de gamas');

-- MARCAS
INSERT INTO marcas(id_pais, nombre)
VALUES (2, 'Dell');

-- PRODUCTOS
INSERT INTO productos(id_categoria, id_marca, codigo_sku, numero_lote, modelo,
    precio_costo, precio_descuento, precio_venta, stock, fecha_ingreso,
    url_img, estado)
VALUES (1, 1, 'LAP00000', 'ABCD0000EFG','Latitude 5420',
    8999.00, 0.00,9500.00, 10, '20261116',
    '/img/productos', TRUE);

-- ESPECIFICACIONES
-- Cada especificacion es una entrada en la tabla, distinta para cada producto
INSERT INTO especificaciones(id_producto, especificacion)
VALUES (1, 'Color: Negro'),
    (1, 'Tipo disco: SSD'),
    (1, 'Capacidad disco: 512GB'),
    (1, 'Marca CPU: Intel'),
    (1, 'CPU: Core i5-1145G7'),
    (1, 'Tipo memoria RAM: DDR4'),
    (1, 'Cantidad memoria RAM: 16GB'),
    (1, 'Anio lanzamiento: 2021'),
    (1, 'Tamano pantalla: 14"'),
    (1, 'Resolucion pantalla: 1920x1080p'),
    (1, 'Bateria: 4 celdas 63WHr'),
    (1, 'Sistema operativo: Windows 11 Pro');

-- PROVEEDORES
INSERT INTO proveedores(id_direccion, rtn, nombre, telefono, correo, estado)
VALUES (3, '11111111111111', 'Informatica Mayoreo', '22227777',
    'informatica@gmail.com', TRUE);

-- COMPRAS
INSERT INTO compras(id_proveedor, numero_compra, subtotal, monto_isv, total)
VALUES (1, '000011223344', 17998.00, 2699.7, 20697.7);

-- DETALLES_COMPRAS
INSERT INTO detalles_compras(id_compra, id_producto, cantidad, precio_compra, subtotal)
VALUES (1, 1, 2, 8999.00, 17998.00);

-- METODOS_PAGO
INSERT INTO metodos_pago(nombre, descripcion, condicion_pago)
VALUES ('VISA', 'Pago con tarjeta', DEFAULT);

--SUCURSALES
INSERT INTO sucursales(id_direccion, rtn, correo, hora_apertura, hora_cierre,
    telefono, fecha_inauguracion, estado)
VALUES (1, '08012026111111','info@overclock.hn','08:00', '16:00',
    '33558899', '20261001', TRUE);

-- REPARTIDORES
INSERT INTO repartidores(dni, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
    fecha_nacimiento, telefono, estado)
VALUES ('0505199200000', 'Rodrigo', 'Sebastian', 'Molina',
    'Perdomo', '19920202', '99554433', TRUE);

-- VENDEDORES
INSERT INTO vendedores(dni, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
    fecha_nacimiento, telefono, estado)
VALUES ('0804198000000', 'Jose', 'Antonio', 'Ramirez',
    'Ferrari', '19800101', '96695445', TRUE);

-- COMPROBANTES_FISCALES
INSERT INTO comprobantes_fiscales(cai, correlativo_minimo, correlativo_maximo, fecha_limite)
VALUES ('ABCD01-EFGH02-IJKL03-MNOP04-QRST05-06', '000-001-01-00000001',
    '000-001-01-00000050', '20271212');

-- FACTURAS
INSERT INTO facturas(id_comprobante_fiscal, id_sucursal, id_vendedor, id_cliente, id_metodo_pago,
    numero_factura, importe_exonerado, importe_exento, importe_gravado,
    descuentos, subtotal, monto_isv, total)
VALUES (1, 1, 1, 1, 1,
    '000-001-01-00000002', 0.00, 0.00, 19000.00,
    0.00, 19000.00,2850.00, 21850.00);

-- DETALLES_FACTURA
INSERT INTO detalles_factura(id_factura, id_producto, precio_venta, cantidad, descuento, monto_descuento, subtotal)
VALUES (1, 1, 9500.00, 2, 0.00, 0.00, 19000.00);

-- GARANTIAS
INSERT INTO garantias(id_cliente, id_producto, fecha_vencimiento)
VALUES (1, 1, '20271114');

-- PEDIDOS
INSERT INTO pedidos(id_factura, fecha_finalizacion, entrega_domicilio)
VALUES (1,  '20271114 17:00', 1);

-- ENVIOS
INSERT INTO envios(id_pedido, id_repartidor, id_direccion, numero_guia, observaciones)
VALUES (1, 1, 2, 'ENV0000000000000', 'Paquete fragil');

-- CONSULTAS DE EJEMPLO
-- JOINS
-- Mostrar los clientes que tengan un usuario, con su respectiva informacion
SELECT C.primer_nombre, C.primer_apellido, U.nombre AS NombreUsuario, UC.ultimo_acceso FROM clientes AS C
INNER JOIN usuarios_clientes AS UC ON UC.id_cliente = C.id_cliente
INNER JOIN usuarios AS U ON U.id_usuario = UC.id_usuario;

-- Mostrar direccion completamente de los proveedores que tienen una direccion
SELECT PROV.nombre AS proveedor, P.nombre as pais, DEP.nombre AS departamento, C.nombre AS ciudad, D.calle as calle,
       D.referencias as referencias
FROM proveedores AS PROV
INNER JOIN direcciones AS D ON D.id_direccion = PROV.id_direccion
INNER JOIN ciudades C on D.id_ciudad = C.id_ciudad
INNER JOIN departamentos DEP on c.id_departamento = DEP.id_departamento
INNER JOIN paises P on DEP.id_pais = P.id_pais;

SELECT * FROM detalles_factura;

-- Impresion de factura
CREATE VIEW vw_factura_completa AS
SELECT S.telefono, S.rtn as rtn, S.correo,
    concat(C.primer_nombre, ' ', C.primer_apellido) AS cliente, C.rtn AS rtn_cliente,
    concat(V.primer_nombre, ' ', V.primer_apellido) as vendedor,
    P.numero_lote, P.modelo as descripcion_producto, DF.cantidad, DF.subtotal AS importe_producto,
    F.numero_factura, F.fecha_emision, F.importe_exonerado, F.descuentos, F.importe_exento, F.importe_gravado,
    F.subtotal, F.isv, F.monto_isv, F.total,
    CF.cai, CF.correlativo_minimo, CF.correlativo_maximo, CF.fecha_limite
FROM facturas AS F
INNER JOIN comprobantes_fiscales AS CF ON CF.id_comprobante_fiscal = F.id_comprobante_fiscal
INNER JOIN sucursales AS S ON S.id_sucursal = F.id_sucursal
INNER JOIN vendedores AS V ON V.id_vendedor = F.id_vendedor
INNER JOIN clientes C on C.id_cliente = F.id_cliente
INNER JOIN detalles_factura AS DF ON DF.id_factura = F.id_factura
INNER JOIN productos AS P ON P.id_producto = DF.id_producto;

SELECT * FROM vw_factura_completa;

/* CREATE TABLE numeros_serie(
    id_numero_serie integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto integer REFERENCES productos(id_producto),
    -- Numero de serie unico para cada existencia de un producto
    numero_serie varchar(20) UNIQUE NOT NULL,
    fecha_ingreso timestamp DEFAULT(current_timestamp) NOT NULL,
    -- Se marca como 0 cuando el producto se ha vendido, indicando que el numero de serie fue utilizado
    disponible integer DEFAULT(1) NOT NULL
); */

/* CREATE TABLE carritos(
    id_carrito integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario integer REFERENCES usuarios(id_usuario),
    subtotal decimal(19, 4) NOT NULL,
    isv decimal(3, 2) DEFAULT(0.15) NOT NULL,
    monto_isv decimal(19, 4) NOT NULL,
    total decimal(19, 4) NOT NULL
);

CREATE TABLE detalles_carritos(
    id_detalle_carrito integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_carrito integer REFERENCES carritos(id_carrito),
    id_producto integer REFERENCES productos(id_producto),
    cantidad integer NOT NULL,
    precio_venta decimal(19, 4) NOT NULL,
    subtotal decimal(19, 4) NOT NULL
); */
