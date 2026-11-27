-- Script para el Avance 1
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
    url_foto varchar(255) NULL,
    -- Valor para determinar los permisos del usuario
    administrador boolean DEFAULT(FALSE) NOT NULL
);

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
    estado boolean DEFAULT(TRUE) NOT NULL
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
    nombre varchar(100) NOT NULL,
    estado boolean DEFAULT(TRUE) NOT NULL
);

CREATE TABLE departamentos(
    id_departamento integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pais integer REFERENCES paises(id_pais) ON DELETE RESTRICT,
    nombre varchar(100),
    estado boolean DEFAULT(TRUE) NOT NULL
);

CREATE TABLE ciudades(
    id_ciudad integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_departamento integer REFERENCES departamentos(id_departamento) ON DELETE RESTRICT,
    nombre varchar(100) NOT NULL,
    codigo_postal varchar(5) UNIQUE NOT NULL
        CHECK(length(codigo_postal) = 5),
    estado boolean DEFAULT(TRUE) NOT NULL
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
    descripcion varchar(200),
    precio_costo decimal(19, 4) NOT NULL,
    precio_venta decimal(19, 4) NOT NULL,
    stock int NOT NULL CHECK(stock >= 0), -- Incorporacion de check para validar que el stock no sea negativo
    fecha_ingreso timestamp DEFAULT(current_timestamp) NOT NULL,
    url_img varchar(500),
    estado boolean DEFAULT(TRUE) NOT NULL
);

CREATE TABLE tipo_promocion(
    id_tipo_promocion integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    descripcion varchar(500)
);

CREATE TABLE promociones(
    id_promocion integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tipo_promocion integer REFERENCES tipo_promocion(id_tipo_promocion) ON DELETE RESTRICT,
    fecha_inicio date NOT NULL,
    -- Una promocion podria no terminar, como los descuentos por tercera edad, cuarta edad
    fecha_vencimiento date,
    porcentaje_descuento decimal(3,2) NOT NULL ,
    -- Columnas de cantidades para determinar los productos que aplican a los beneficios
    cantidad_requerida integer DEFAULT(1) NOT NULL,
    cantidad_beneficio integer DEFAULT(1) NOT NULL,
    estado boolean DEFAULT(TRUE) NOT NULL,
    CONSTRAINT chk_fechas_promocion CHECK (fecha_vencimiento > fecha_inicio)
);

CREATE TABLE promociones_productos(
    id_promocion_producto integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_promocion integer REFERENCES promociones(id_promocion) ON DELETE CASCADE,
    id_producto integer REFERENCES productos(id_producto) ON DELETE RESTRICT,
    rol_producto varchar(20) NOT NULL
        CHECK (rol_producto IN ('Requerido', 'Beneficio', 'Ambos'))
);

CREATE TABLE especificaciones(
    id_especificacion integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto integer REFERENCES productos(id_producto) ON DELETE CASCADE,
    especificacion varchar(100) NOT NULL
);

CREATE TABLE garantias(
    id_garantia integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cliente integer REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
    id_producto integer REFERENCES productos(id_producto) ON DELETE RESTRICT,
    fecha_inicio date DEFAULT(current_date) NOT NULL,
    fecha_vencimiento date NOT NULL,
    estado boolean DEFAULT(TRUE) NOT NULL
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
    estado boolean DEFAULT(TRUE) NOT NULL
);

CREATE TABLE compras(
    id_compra integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_proveedor integer REFERENCES proveedores(id_proveedor) ON DELETE RESTRICT,
    numero_compra varchar(20) UNIQUE NOT NULL,
    fecha_compra timestamp DEFAULT(current_timestamp) NOT NULL, --Eliminacion del UNIQUE, ya que las compras si pueden compartir fecha_compra, mas no los demas detalles
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
    precio_compra decimal(19, 4) check(precio_compra > 0) NOT NULL,
    subtotal decimal(19, 4) NOT NULL
);

CREATE TABLE sucursales(
    id_sucursal integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_direccion integer REFERENCES direcciones(id_direccion) ON DELETE RESTRICT NOT NULL,
    -- Se refiere al rtn y correo de la empresa que se deben imprimir en las facturas
    rtn varchar(14) UNIQUE NOT NULL
        CHECK(length(rtn) = 14),
    correo varchar(30) NOT NULL
        CHECK(correo ~~ '%@%'),
    hora_apertura time NOT NULL,
    hora_cierre time NOT NULL 
        CHECK(hora_cierre > hora_apertura),
    telefono varchar(20) UNIQUE NOT NULL,
    fecha_inauguracion date NOT NULL,
    estado boolean DEFAULT(TRUE) NOT NULL
);

CREATE TABLE empresas_repartidoras(
    id_empresa integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_direccion integer REFERENCES direcciones(id_direccion) ON DELETE RESTRICT,
    rtn varchar(14) UNIQUE NOT NULL
        CHECK(char_length(rtn) = 14),
    nombre varchar(100) NOT NULL,
    correo varchar(50) check(correo like '%@%')NOT NULL,
    telefono varchar(20) NOT NULL,
    fecha_registro date check(fecha_registro < CURRENT_DATE) NOT NULL,
    estado boolean DEFAULT(TRUE) NOT NULL
);

CREATE TABLE repartidores(
    id_repartidor integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_empresa integer REFERENCES empresas_repartidoras(id_empresa) ON DELETE CASCADE,
    dni varchar(13) UNIQUE NOT NULL
        CHECK(length(Dni) = 13),
    primer_nombre varchar(100) NOT NULL,
    segundo_nombre varchar(100),
    primer_apellido varchar(100) NOT NULL,
    segundo_apellido varchar(100),
    fecha_nacimiento date NOT NULL
        CHECK ((extract(YEAR from current_date) - extract(YEAR from fecha_nacimiento)) >= 18),
    telefono varchar(20) UNIQUE NOT NULL,
    estado boolean DEFAULT(TRUE) NOT NULL
);

CREATE TABLE vendedores(
    id_vendedor integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dni varchar(13) UNIQUE NOT NULL
        CHECK(length(Dni) = 13),
    primer_nombre varchar(100) NOT NULL,
    segundo_nombre varchar(100),
    primer_apellido varchar(100) NOT NULL,
    segundo_apellido varchar(100),
    fecha_contratacion date check(fecha_contratacion <= CURRENT_DATE) NOT NULL,
    fecha_nacimiento date NOT NULL,
        CHECK ((extract(YEAR from current_date) - extract(YEAR from fecha_nacimiento)) >= 18),
    telefono varchar(20) UNIQUE NOT NULL,
    estado boolean DEFAULT(TRUE) NOT NULL
);

CREATE TABLE comprobantes_fiscales(
    id_comprobante_fiscal integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    correlativo_minimo varchar(19) UNIQUE NOT NULL -- Inicio del rango de numeros factura disponibles para la empresa
        CHECK(length(correlativo_minimo) = 19),
    correlativo_maximo varchar(19) UNIQUE NOT NULL -- Fin del rango de numeros de factura
        CHECK(length(correlativo_maximo) = 19),
    fecha_limite date NOT NULL
);

CREATE TABLE facturas(
    id_factura integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_comprobante_fiscal integer REFERENCES comprobantes_fiscales(id_comprobante_fiscal) ON DELETE RESTRICT,
    cai varchar(37) NOT NULL -- Un cai esta formado por grupos de 6 digitos separados, haciendo un total de 32
        CHECK(length(cai) = 37), -- La longitud de 37 incluye los 32 digitos mas 5 guiones de separacion
    id_sucursal integer REFERENCES sucursales(id_sucursal) ON DELETE RESTRICT,
    id_vendedor integer REFERENCES vendedores(id_vendedor) ON DELETE RESTRICT,
    id_cliente integer REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
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
    id_promocion integer REFERENCES promociones(id_promocion) ON DELETE SET NULL,
    precio_venta decimal(19, 4) NOT NULL,
    cantidad integer NOT NULL,
    subtotal decimal(19, 4) NOT NULL,
    descuento decimal(3,2) NOT NULL, -- Porcentaje del descuento
    monto_descuento decimal(19, 4) NOT NULL, -- Monto que resulta de dicho descuento
    subtotal_descuento decimal (19, 4) NOT NULL
);

CREATE TABLE tarjetas(
    id_tarjeta integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cliente integer REFERENCES clientes(id_cliente) ON DELETE RESTRICT,
    nombre_titular varchar(100) NOT NULL,
    numero_tarjeta varchar(20) UNIQUE NOT NULL,
    fecha_vencimiento date NOT NULL,
    cvv varchar(4) NOT NULL,
    tipo_tarjeta varchar(20) NOT NULL
        CHECK(tipo_tarjeta IN ('Credito', 'Debito'))
);

CREATE TABLE metodos_pago(
    id_metodo_pago integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL, -- Efectivo, transferencia,
    descripcion varchar(500),
    condicion_pago varchar(20) NOT NULL
        CHECK(condicion_pago IN ('Contado', 'Credito')),
    numero_referencia varchar(50) UNIQUE NOT NULL,
    pago_con_tarjeta boolean NOT NULL
);

-- Funciona practicamente como una tabla intermedia entre factura y metodos_pago
CREATE TABLE pagos(
    id_pago integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_factura integer REFERENCES facturas(id_factura) ON DELETE CASCADE,
    id_metodo_pago integer REFERENCES metodos_pago(id_metodo_pago) ON DELETE RESTRICT,
    codigo_pago varchar(20) UNIQUE NOT NULL,
    fecha_emision timestamp DEFAULT(current_timestamp) NOT NULL,
    monto_pagado decimal(19, 4) NOT NULL,
    estado varchar(20) DEFAULT('Pendiente') NOT NULL
        CHECK(estado IN ('Pendiente', 'Cancelado', 'Completado'))
);

CREATE TABLE detalles_pagos_tarjetas(
    id_detalles_pagos_tarjetas integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pago integer REFERENCES pagos(id_pago) ON DELETE CASCADE,
    id_tarjeta integer REFERENCES tarjetas(id_tarjeta) ON DELETE RESTRICT,
    codigo_autorizacion varchar(50) UNIQUE NOT NULL
);

CREATE TABLE pedidos(
    id_pedido integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_factura integer REFERENCES facturas(id_factura) ON DELETE CASCADE,
    fecha_emision timestamp DEFAULT(current_timestamp) NOT NULL,
    fecha_completacion timestamp,
    importe_exonerado DECIMAL(19, 4) NOT NULL,
    importe_exento DECIMAL(19, 4) NOT NULL,
    importe_gravado DECIMAL(19, 4) NOT NULL,
    descuentos decimal(19, 4) NOT NULL,
    subtotal decimal(19, 4) NOT NULL,
    isv decimal(3, 2) DEFAULT(0.15) NOT NULL,
    monto_isv decimal(19, 4) NOT NULL,
    total decimal(19, 4) NOT NULL,
    entrega_domicilio boolean DEFAULT(FALSE) NOT NULL,
    estado varchar(20) DEFAULT('Pendiente') NOT NULL
        CHECK(estado IN ('Pendiente', 'Atrasado', 'Completado', 'Cancelado'))
);

CREATE TABLE detalles_pedidos(
    id_detalles_pedido integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pedido integer REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_producto integer REFERENCES productos(id_producto) ON DELETE RESTRICT,
    id_promocion integer REFERENCES promociones(id_promocion) ON DELETE RESTRICT,
    precio_venta decimal(19, 4) NOT NULL,
    cantidad integer NOT NULL,
    subtotal decimal(19, 4) NOT NULL,
    descuento decimal(3, 2) NOT NULL,
    monto_descuento decimal(19, 4) NOT NULL,
    subtotal_descuento decimal(19, 4) NOT NULL
);

CREATE TABLE envios(
    id_envio integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pedido integer REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_repartidor integer REFERENCES repartidores(id_repartidor) ON DELETE RESTRICT,
    id_direccion integer REFERENCES direcciones(id_direccion) ON DELETE RESTRICT,
    numero_guia varchar(20) UNIQUE NOT NULL,
    observaciones varchar(500),
    estado varchar(20) DEFAULT('En preparacion') NOT NULL
        CHECK (estado IN ('En preparacion', 'En camino', 'Entregado', 'Cancelado'))
);
