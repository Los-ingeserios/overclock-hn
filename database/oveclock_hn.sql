-- Script para el Avance 1
-- Bloque para eliminar todas las tablas del schema public, si ya existen previamente
DO $$ DECLARE
    record RECORD;
BEGIN
    FOR record IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
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
    administrador integer DEFAULT(0) NOT NULL
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
    estado integer NOT NULL
);

CREATE TABLE usuarios_clientes(
    id_usuario_cliente integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario integer UNIQUE REFERENCES usuarios(id_usuario),
    id_cliente integer REFERENCES clientes(id_cliente)
);

CREATE TABLE paises(
    id_pais integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL
);

CREATE TABLE departamentos(
    id_departamento integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pais integer REFERENCES paises(id_pais),
    nombre varchar(100)
);

CREATE TABLE ciudades(
    id_ciudad integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_departamento integer REFERENCES departamentos(id_departamento),
    nombre varchar(100) NOT NULL,
    codigo_postal varchar(5) UNIQUE NOT NULL
        CHECK(length(codigo_postal) = 5)
);

CREATE TABLE direcciones(
    id_direccion integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_ciudad integer REFERENCES ciudades(id_ciudad),
    calle varchar(100) NOT NULL,
    referencias varchar(500)
);

CREATE TABLE direcciones_clientes(
    id_direccion_cliente integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_direccion integer UNIQUE REFERENCES direcciones(id_direccion),
    id_cliente integer REFERENCES clientes(id_cliente),
    predeterminada integer DEFAULT(0) NOT NULL
);

CREATE TABLE categorias(
    id_categoria integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    descripcion varchar(500)
);

CREATE TABLE marcas(
    id_marca integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pais integer REFERENCES paises(id_pais),
    nombre varchar(100) NOT NULL
);

CREATE TABLE especificaciones(
    id_espeficicacion integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    socket varchar(50) NOT NULL,
    dimensiones varchar(50) NOT NULL
        CHECK (dimensiones ~~ '[0-9]x[0-9]x[0-9]'),
    peso varchar(20) NOT NULL,
    fecha_lanzamiento date NOT NULL,
    detalles varchar(500) NOT NULL
);

CREATE TABLE productos(
    id_producto integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria integer REFERENCES categorias(id_categoria),
    id_marca integer REFERENCES marcas(id_marca),
    id_especificaciones integer REFERENCES especificaciones(id_espeficicacion),
    codigo_sku varchar(8) UNIQUE NOT NULL,
    modelo varchar(100) NOT NULL,
    precio_costo decimal(19, 4) NOT NULL,
    precio_venta decimal(19, 4) NOT NULL,
    stock int NOT NULL,
    fecha_ingreso timestamp DEFAULT(current_timestamp) NOT NULL,
    url_img varchar(100),
    estado integer NOT NULL
);

CREATE TABLE numeros_serie(
    id_numero_serie integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_producto integer REFERENCES productos(id_producto),
    numero_serie varchar(20) UNIQUE NOT NULL,
    fecha_ingreso timestamp DEFAULT(current_timestamp) NOT NULL,
    disponible integer DEFAULT(1) NOT NULL
);

CREATE TABLE proveedores(
    id_proveedor integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_direccion integer REFERENCES direcciones(id_direccion),
    nombre varchar(100) NOT NULL,
    estado integer NOT NULL
);

CREATE TABLE carritos(
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
);

CREATE TABLE garantias(
    id_garantia integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cliente integer REFERENCES clientes(id_cliente),
    id_numero_serie integer REFERENCES numeros_serie(id_numero_serie),
    fecha_inicio date DEFAULT(current_date) NOT NULL,
    fecha_vencimiento date NOT NULL,
    estado varchar(20) DEFAULT('Activa') NOT NULL
);

CREATE TABLE compras(
    id_compra integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_proveedor integer REFERENCES proveedores(id_proveedor),
    numero_compra varchar(50) UNIQUE NOT NULL,
    fecha_compra timestamp DEFAULT(current_timestamp) UNIQUE NOT NULL,
    subtotal decimal(19, 4) NOT NULL,
    isv decimal (3, 2) DEFAULT(0.15) NOT NULL,
    monto_isv decimal(19, 4) NOT NULL,
    total decimal(19, 4) NOT NULL
);

CREATE TABLE detalles_compras(
    id_detalles_compras integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_compra integer REFERENCES compras(id_compra),
    id_producto integer REFERENCES productos(id_producto),
    cantidad integer NOT NULL,
    precio_compra decimal(19, 4) NOT NULL,
    subtotal decimal(19, 4) NOT NULL
);

CREATE TABLE metodos_pago(
    id_metodo_pago integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    descripcion varchar(500),
    fecha_registro timestamp DEFAULT(current_timestamp) NOT NULL
);

CREATE TABLE sucursales(
    id_sucursal integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_direccion integer REFERENCES direcciones(id_direccion),
    hora_apertura time NOT NULL,
    hora_cierre time NOT NULL,
    estado integer NOT NULL
);

CREATE TABLE comprobantes_fiscales(
    id_comprobante_fiscal integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    correlativo_minimo varchar(16) UNIQUE NOT NULL
        CHECK(length(correlativo_minimo) = 16),
    correlativo_maximo varchar(16) UNIQUE NOT NULL
        CHECK(length(correlativo_maximo) = 16),
    fecha_limite date NOT NULL
);

CREATE TABLE facturas(
    id_factura integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_comprobante_fiscal integer REFERENCES comprobantes_fiscales(id_comprobante_fiscal),
    id_sucursal integer REFERENCES sucursales(id_sucursal),
    id_vendedor integer REFERENCES vendedores(id_vendedor),
    id_cliente integer REFERENCES clientes(id_cliente),
    numero_factura varchar(50) UNIQUE NOT NULL,
    fecha_venta timestamp DEFAULT(current_timestamp) NOT NULL,
    subtotal decimal(19, 4) NOT NULL,
    isv decimal(3, 2) NOT NULL,
    monto_isv decimal(19, 4) NOT NULL,
    total decimal(19, 4) NOT NULL
);

CREATE TABLE detalles_factura(
    id_detalle_factura integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_factura integer REFERENCES facturas(id_factura),
    id_numero_serie integer UNIQUE REFERENCES numeros_serie(id_numero_serie),
    precio_venta decimal(19, 4) NOT NULL
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
    telefono varchar(20) UNIQUE NOT NULL
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
    telefono varchar(20) UNIQUE NOT NULL
);

CREATE TABLE pedidos(
    id_pedido integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_factura integer REFERENCES facturas(id_factura),
    id_metodo_pago integer REFERENCES metodos_pago(id_metodo_pago),
    fecha_creacion timestamp DEFAULT(current_timestamp) NOT NULL,
    fecha_finalizacion timestamp,
    estado varchar(20) DEFAULT('Pendiente') NOT NULL,
    entrega_domicilio integer DEFAULT(0) NOT NULL
);

CREATE TABLE envios(
    id_envio integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pedido integer REFERENCES pedidos(id_pedido),
    id_repartidor integer REFERENCES repartidores(id_repartidor),
    id_direccion integer REFERENCES direcciones(id_direccion),
    numero_guia varchar(20) UNIQUE NOT NULL,
    observaciones varchar(500) NOT NULL,
    estado varchar(20) DEFAULT('En preparacion') NOT NULL
);
