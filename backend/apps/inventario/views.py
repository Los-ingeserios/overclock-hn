from django.shortcuts import render
from rest_framework import mixins, viewsets
from apps.inventario.models import Categoria, Marca, Producto, Especificacion
from apps.inventario.serializers import CategoriaSerializer, MarcaSerializer, ProductoSerializer, EspecificacionSerializer

# La clase ModelViewSet provee todos los metodos para un CRUD
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class EspecificacionViewSet(viewsets.ModelViewSet):
    queryset = Especificacion.objects.all()
    serializer_class = EspecificacionSerializer