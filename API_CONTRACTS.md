
# Contratos de API RESTful - Overclock HN
**Versión API:** `v1`
**Base URL:** `http://127.0.0.1:8000/api/v1/`

## Estándares del Proyecto (Reglas para el Backend y Frontend)
1. **Paginación:** Todas las listas devolverán un objeto estándar de Django REST Framework (`count`, `next`, `previous`, `results`).
2. **Autenticación:** Las rutas protegidas requieren un header: `Authorization: Bearer <token>`.
3. **Códigos HTTP:** 
   - `200 OK` (Lectura exitosa)
   - `201 Created` (Creación exitosa)
   - `400 Bad Request` (Error de validación o stock)
   - `401 Unauthorized` (Falta token)

---

## Módulo 1: Autenticación y Perfiles

### 1.1 Iniciar Sesión (Login)
* **Endpoint:** `POST /auth/login/`
* **Descripción:** Autentica al usuario y devuelve el token JWT o Token estándar.
* **Payload (Body):**
```json
{
  "nombre_usuario": "oscar1",
  "contrasena": "12345"
}

```

* **Respuesta Exitosa (200 OK):**

```json
{
  "token": "d7a8f9g0h1j2k3l4m5n6o7p8",
  "usuario": {
    "id": 2,
    "nombre": "oscar1",
    "is_admin": false,
    "cliente_id": 1
  }
}

```

### 1.2 Mi Perfil e Historial (Portal del Cliente)

* **Endpoint:** `GET /clientes/me/`
* **Headers:** `Authorization: Bearer <token>`
* **Respuesta Exitosa (200 OK):**

```json
{
  "id_cliente": 1,
  "nombre_completo": "Oscar Velasquez",
  "rtn": "99999999999999",
  "direcciones": [
    {
      "id_direccion": 2,
      "calle": "Residenciales Las Uvas",
      "predeterminada": true
    }
  ],
  "historial_pedidos": [
    {
      "id_pedido": 1,
      "fecha": "2026-11-14T17:00:00Z",
      "estado": "Entregado",
      "total": "21850.00"
    }
  ]
}

```

---

## Módulo 2: Catálogo E-commerce (Público)

### 2.1 Listado de Productos (Con Filtros Avanzados)

* **Endpoint:** `GET /productos/`
* **Query Params (Filtros):** `?categoria=1&marca=2&search=Latitude&min_precio=5000&max_precio=10000`
* **Respuesta Exitosa (200 OK):**

```json
{
  "count": 45,
  "next": "[http://127.0.0.1:8000/api/v1/productos/?page=2](http://127.0.0.1:8000/api/v1/productos/?page=2)",
  "previous": null,
  "results": [
    {
      "id_producto": 1,
      "sku": "LAP00000",
      "modelo": "Latitude 5420",
      "marca": { "id": 1, "nombre": "Dell" },
      "categoria": { "id": 1, "nombre": "Laptops" },
      "precio_venta": "9500.00",
      "stock_disponible": 10,
      "url_img": "/media/productos/lap00000.jpg"
    }
  ]
}

```

### 2.2 Ficha Técnica del Producto

* **Endpoint:** `GET /productos/{id}/`
* **Respuesta Exitosa (200 OK):**

```json
{
  "id_producto": 1,
  "modelo": "Latitude 5420",
  "descripcion_corta": "Laptop empresarial de alto rendimiento",
  "precio_venta": "9500.00",
  "stock_disponible": 10,
  "especificaciones": [
    { "clave": "Color", "valor": "Negro" },
    { "clave": "RAM", "valor": "16GB DDR4" },
    { "clave": "Almacenamiento", "valor": "512GB SSD" }
  ]
}

```

---

## Módulos 4 y 5: Checkout, Facturación SAR y Logística

### 3.1 Procesar Compra (Checkout)

* **Endpoint:** `POST /ventas/checkout/`
* **Headers:** `Authorization: Bearer <token>`
* **Descripción:** Recibe el carrito desde el Frontend, descuenta el stock, genera el Pedido y emite la Factura SAR automáticamente.
* **Payload (Body):**

```json
{
  "id_metodo_pago": 1,
  "entrega_domicilio": true,
  "id_direccion_envio": 2,
  "items": [
    {
      "id_producto": 1,
      "cantidad": 2,
      "precio_venta_actual": "9500.00"
    }
  ]
}

```

* **Respuesta Exitosa (201 Created):**

```json
{
  "mensaje": "Compra procesada exitosamente.",
  "pedido": {
    "id_pedido": 1,
    "estado": "Pendiente",
    "fecha_creacion": "2026-11-17T15:30:00Z"
  },
  "factura_sar": {
    "numero_factura": "000-001-01-00000002",
    "cai": "ABCD01-EFGH02-IJKL03-MNOP04-QRST05-06",
    "fecha_limite_emision": "2027-12-12",
    "desglose": {
      "subtotal": "19000.00",
      "importe_exento": "0.00",
      "importe_gravado_15": "19000.00",
      "monto_isv": "2850.00",
      "total_pagar": "21850.00"
    }
  }
}

```

### 3.2 Actualizar Estado Logístico del Pedido (Solo Admin)

* **Endpoint:** `PATCH /admin/pedidos/{id}/estado/`
* **Headers:** `Authorization: Bearer <token>` (Requiere usuario Administrador)
* **Payload (Body):**

```json
{
  "estado": "Despachado",
  "id_repartidor": 1,
  "numero_guia": "ENV12345678"
}

```

* **Respuesta Exitosa (200 OK):**

```json
{
  "id_pedido": 1,
  "nuevo_estado": "Despachado",
  "fecha_actualizacion": "2026-11-17T16:00:00Z"
}

```

---

## Módulo 6: Dashboard y Estadísticas Gerenciales (Solo Admin)

### 4.1 Clientes Top (Vista SQL `v_clientes_top`)

* **Endpoint:** `GET /dashboard/clientes-top/`
* **Headers:** `Authorization: Bearer <token>`
* **Respuesta Exitosa (200 OK):**

```json
[
  {
    "id_cliente": 1,
    "rtn": "99999999999999",
    "nombre_completo": "Oscar Velasquez",
    "total_comprado_historico": "85400.00"
  },
  {
    "id_cliente": 5,
    "rtn": "08011999123456",
    "nombre_completo": "Empresa Tech S.A.",
    "total_comprado_historico": "62000.00"
  }
]
```