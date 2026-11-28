from django.shortcuts import render
from rest_framework import mixins, viewsets
from apps.gestion_empresarial.models import (
    Cliente,
    DireccionCliente,
    Vendedor,
    Sucursal,
)
from apps.gestion_empresarial.serializers import (
    ClienteSerializer,
    DireccionClienteSerializer,
    VendedorSerializer,
    SucursalSerializer,
)

# Create your views here.


class ListRetrieveCreateUpdateViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    pass


class ClienteViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class DireccionClienteViewSet(viewsets.ModelViewSet):
    queryset = DireccionCliente.objects.all()
    serializer_class = DireccionClienteSerializer


class VendedorViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Vendedor.objects.all()
    serializer_class = VendedorSerializer


class SucursalViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer