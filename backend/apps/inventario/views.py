from rest_framework import viewsets, mixins, pagination

from apps.inventario.models import (
    Categoria, Marca, Producto, Especificacion,
    TipoPromocion, Promocion, PromocionProducto
)

from apps.inventario.serializers import (
    CategoriaSerializer, MarcaSerializer, ProductoAllSerializer, EspecificacionSerializer, ProductoListSerializer,
    ProductoDetailSerializer, TipoPromocionSerializer, PromocionSerializer, PromocionProductoSerializer
)

# La clase ModelViewSet provee todos los metodos para un CRUD
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.order_by("nombre", "id_categoria").all()
    serializer_class = CategoriaSerializer

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.order_by("nombre", "id_marca").select_related("id_pais")
    serializer_class = MarcaSerializer

# Vista principal de producto
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.select_related("id_categoria", "id_marca").prefetch_related("especificaciones").order_by("codigo_sku", "id_producto")

    # Sobreescritura del metodo get_serializer_class() para determinar distintos serializer
    def get_serializer_class(self):
        if hasattr(self, 'action'):
            if self.action == "list": # Pensado para la vista del cliente para ver todos los productos
                return ProductoListSerializer
            if self.action == "retrieve": # Utilizado cuando se busca un producto por su id
                return ProductoDetailSerializer

        return ProductoAllSerializer # Se retorna todo el modelo en el caso de que se utilice otro metodo

class ProductoAdminViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.select_related("id_categoria", "id_marca").order_by("codigo_sku", "id_producto")
    serializer_class = ProductoAllSerializer

class EspecificacionViewSet(viewsets.ModelViewSet):
    queryset = Especificacion.objects.select_related("id_producto").all().order_by("especificacion", "id_especificacion")
    serializer_class = EspecificacionSerializer

class TipoPromocionViewSet(viewsets.ModelViewSet):
    queryset = TipoPromocion.objects.order_by("nombre", "id_tipo_promocion").all()
    serializer_class = TipoPromocionSerializer

class PromocionViewSet(viewsets.ModelViewSet):
    queryset = Promocion.objects.order_by("id_promocion").all()
    serializer_class = PromocionSerializer

class PromocionProductoViewSet(viewsets.ModelViewSet):
    queryset = PromocionProducto.objects.order_by("rol_producto", "id_promocion_producto").all()
    serializer_class = PromocionProductoSerializer
