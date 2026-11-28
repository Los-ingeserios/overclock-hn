-- CONSULTAS DE EJEMPLO
-- SELECTS CON JOINS
-- Mostrar todos los clientes tengan o no un usuario
SELECT C.primer_nombre, C.primer_apellido, U.nombre AS NombreUsuario, UC.ultimo_acceso FROM clientes AS C
LEFT JOIN usuarios_clientes AS UC ON UC.id_cliente = C.id_cliente
LEFT JOIN usuarios AS U ON U.id_usuario = UC.id_usuario;

-- Mostrar las sucursales y sus direcciones completas
SELECT PROV.nombre AS proveedor, P.nombre as pais, DEP.nombre AS departamento, C.nombre AS ciudad, D.calle as calle,
       D.referencias as referencias
FROM proveedores AS PROV
INNER JOIN direcciones AS D ON D.id_direccion = PROV.id_direccion
INNER JOIN ciudades C on D.id_ciudad = C.id_ciudad
INNER JOIN departamentos DEP on c.id_departamento = DEP.id_departamento
INNER JOIN paises P on DEP.id_pais = P.id_pais;

-- Mostrar solo los productos que tengan una promocion activa
SELECT P.modelo, PROM_P.rol_producto, PROM.fecha_inicio, PROM.fecha_vencimiento, TP.nombre
FROM productos as P
INNER JOIN promociones_productos AS PROM_P on PROM_P.id_producto = P.id_producto
INNER JOIN promociones AS PROM ON PROM.id_promocion = PROM_P.id_promocion
INNER JOIN tipo_promocion AS TP ON TP.id_tipo_promocion = PROM.id_tipo_promocion
WHERE PROM.estado = TRUE;

-- Mostrar las compras realizadas, incluyendo los productos y los proveedores involucrados
SELECT C.subtotal, DC.cantidad, P.modelo AS producto, C.total, C.fecha_compra
FROM compras AS C
INNER JOIN detalles_compras AS DC ON C.id_compra = DC.id_compra
INNER JOIN productos AS P ON P.id_producto = DC.id_producto;

-- Mostrar las empresas de reparto activas y sus repartidores asociados
SELECT ER.nombre, ER.rtn, ER.telefono, concat(R.primer_nombre, ' ', R.primer_apellido) AS repartidor
FROM empresas_repartidoras AS ER
INNER JOIN repartidores AS R ON r.id_empresa = ER.id_empresa
WHERE ER.estado = TRUE;

-- Mostrar todos los pedidos, incluso aquellos que no tuvieron entrega a domicilio. En caso de tenerla, mostrar direccion
SELECT F.id_factura, F.numero_factura, P.id_pedido, P.subtotal, P.total, P.fecha_emision, P.fecha_completacion, P.estado,
    E.numero_guia, E.estado, C.nombre as ciudad, D.calle, D.referencias
FROM pedidos AS P
INNER JOIN facturas AS F ON F.id_factura = P.id_factura
LEFT JOIN envios AS E ON E.id_pedido = P.id_pedido
LEFT JOIN direcciones AS D ON D.id_direccion = E.id_direccion
LEFT JOIN ciudades AS C ON C.id_ciudad = D.id_ciudad;

-- CONSULTAS CON WITH
-- PRODUCTOS MAS VENDIDOS POR CADA CATEGORIA
WITH Resumen_Ventas_Productos AS (

SELECT   P.id_producto,P.modelo AS Producto ,C.id_categoria,
         C.nombre AS Categoria , SUM(DF.cantidad) AS Cantidades_Vendidas,
         SUM(F.total) AS Ganancias_Totales  FROM productos P
INNER JOIN categorias C ON P.id_categoria = C.id_categoria
INNER JOIN detalles_factura DF ON P.id_producto = DF.id_producto
INNER JOIN facturas as F ON F.id_factura = DF.id_factura
GROUP BY P.id_producto,P.modelo , C.id_categoria, C.nombre
)

SELECT * FROM Resumen_Ventas_Productos
ORDER BY Cantidades_Vendidas DESC;

-- MOSTRAR LOS PRODUCTOS AGOTADOS y ACTIVADOS
WITH Productos_Agotados AS (
   -- Todos los productos agotados pero activos
    SELECT
        P.id_producto,
        P.codigo_sku,
        M.nombre AS marca,
        C.nombre AS categoria,
        P.modelo AS producto,
        P.precio_venta,
        P.stock
    FROM productos P
    INNER JOIN marcas M ON P.id_marca = M.id_marca
    INNER JOIN categorias C ON P.id_categoria = C.id_categoria
    WHERE P.stock = 0 AND P.estado = TRUE
)
SELECT * FROM Productos_Agotados
ORDER BY categoria, producto;

-- VISTAS
-- IMPRESION DE FACTURA
CREATE VIEW vw_factura_completa AS
SELECT S.telefono, S.rtn as rtn, S.correo,
    concat(C.primer_nombre, ' ', C.primer_apellido) AS cliente, C.rtn AS rtn_cliente,
    concat(V.primer_nombre, ' ', V.primer_apellido) as vendedor,
    P.numero_lote, P.modelo as descripcion_producto, DF.cantidad, DF.subtotal AS importe_producto,
    F.numero_factura, F.fecha_emision, F.importe_exonerado, F.descuentos, F.importe_exento, F.importe_gravado,
    F.subtotal, F.isv, F.monto_isv, F.total, F.cai,
    CF.correlativo_minimo, CF.correlativo_maximo, CF.fecha_limite
FROM facturas AS F
INNER JOIN comprobantes_fiscales AS CF ON CF.id_comprobante_fiscal = F.id_comprobante_fiscal
INNER JOIN sucursales AS S ON S.id_sucursal = F.id_sucursal
INNER JOIN vendedores AS V ON V.id_vendedor = F.id_vendedor
INNER JOIN clientes C on C.id_cliente = F.id_cliente
INNER JOIN detalles_factura AS DF ON DF.id_factura = F.id_factura
INNER JOIN productos AS P ON P.id_producto = DF.id_producto;

SELECT * FROM vw_factura_completa;

-- CLIENTES TOP
CREATE VIEW v_clientes_top AS
    SELECT concat(C.primer_nombre, ' ', C.primer_apellido) as nombre_cliente, C.razon_social, SUM(F.total) AS total_facturas
    FROM clientes AS C
    INNER JOIN facturas AS F ON F.id_cliente = C.id_cliente
    GROUP BY nombre_cliente, C.razon_social
    HAVING SUM(F.total) > 50000
    ORDER BY nombre_cliente;

SELECT * FROM v_clientes_top;
