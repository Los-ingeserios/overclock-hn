from rest_framework import serializers

from apps.inventario.models import (
    Categoria, Marca, Producto, Especificacion, TipoPromocion,
    Promocion, PromocionProducto
)

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = "__all__"

class ProductoAllSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = "__all__"

# Esta clase esta pensada para mostrar los datos de los producto a los clientes
class ProductoListSerializer(serializers.ModelSerializer):
    id_categoria = CategoriaSerializer(many=False, read_only=True)
    id_marca = MarcaSerializer(many=False, read_only=True)

    class Meta:
        model = Producto
        fields = ["id_producto", "codigo_sku", "id_categoria", "id_marca", "modelo", 
                  "precio_venta", "stock", "url_img"]

class EspecificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especificacion
        fields = "__all__"
        
class ProductoDetailSerializer(serializers.ModelSerializer):
    id_categoria = serializers.SlugRelatedField(many=False, read_only=True, slug_field='descripcion')
    especificaciones = EspecificacionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Producto
        fields = ["id_producto", "modelo", "id_categoria", "precio_venta", "stock", 
                  "especificaciones"]

class TipoPromocionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPromocion
        fields = "__all__"

class PromocionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promocion
        fields = "__all__"

class PromocionProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromocionProducto
        fields = "__all__"