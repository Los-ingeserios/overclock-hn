from django.shortcuts import render
from apps.pedidos.models import EmpresaRepartidora, Repartidor
from apps.pedidos.serializers import (
    EmpresaRepartidoraSerializer,
    RepartidorSerializer,
)
from apps.direcciones.views import ListRetrieveCreateUpdateViewSet
# Create your views here.



class EmpresaRepartidoraViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = EmpresaRepartidora.objects.all().order_by("id_empresa")
    serializer_class = EmpresaRepartidoraSerializer


class RepartidorViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Repartidor.objects.all().order_by("id_repartidor")
    serializer_class = RepartidorSerializer