from rest_framework import serializers
from apps.inventario.models import Categoria, Marca, Producto, Especificacion

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
        fields = ["id_producto", "id_categoria", "id_marca", "codigo_sku", "numero_lote"
            "modelo", "precio_costo", "precio_venta", "stock", "fecha_ingreso", "url_img", "estado"]

class EspecificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especificacion
        fields = ["id_especificacion", "id_producto", "especificacion"]