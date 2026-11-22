from rest_framework import serializers
from apps.inventario.models import Categoria, Marca, Producto, Especificacion, TipoPromocion, Promocion, PromocionProducto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ["id_categoria", "nombre", "descripcion"]

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ["id_pais", "id_marca", "nombre"]

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ["id_producto", "id_categoria", "id_marca", "codigo_sku", "numero_lote",
            "modelo", "precio_costo", "precio_venta", "stock", "fecha_ingreso", "url_img", "estado"]

class EspecificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especificacion
        fields = ["id_especificacion", "id_producto", "especificacion"]

class TipoPromocionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPromocion
        fields = ["id_tipo_promocion", "nombre", "descripcion"]

class PromocionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promocion
        fields = ["id_promocion", "id_tipo_promocion", "fecha_inicio", "fecha_vencimiento", "porcentaje_descuento",
                  "cantidad_requerida", "cantidad_beneficio", "estado"]

class PromocionProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromocionProducto
        fields = ["id_promocion_producto", "id_promocion", "id_producto", "rol_producto"]