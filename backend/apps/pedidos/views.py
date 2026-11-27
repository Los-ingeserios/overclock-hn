from django.shortcuts import render
from apps.pedidos.models import DetallePedido, EmpresaRepartidora, Envio, Pedido, Repartidor
from apps.pedidos.serializers import (
    DetallePedidoSerializer,
    EmpresaRepartidoraSerializer,
    EnvioSerializer,
    PedidoSerializer,
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

class PedidoViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Pedido.objects.all().order_by("id_pedido")
    serializer_class = PedidoSerializer


class DetallePedidoViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = DetallePedido.objects.all().order_by("id_detalles_pedido")
    serializer_class = DetallePedidoSerializer


class EnvioViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Envio.objects.all().order_by("id_envio")
    serializer_class = EnvioSerializer