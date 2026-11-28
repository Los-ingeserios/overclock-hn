from django.urls import include, path
from rest_framework.routers import SimpleRouter
from apps.pedidos.views import DetallePedidoViewSet, EmpresaRepartidoraViewSet, EnvioViewSet, PedidoViewSet, RepartidorViewSet

pedidos_router = SimpleRouter()
pedidos_router.register(
    r"empresas-repartidoras",
    EmpresaRepartidoraViewSet,
    basename="empresa-repartidora",
)
pedidos_router.register(
    r"repartidores",
    RepartidorViewSet,
    basename="repartidor",
)

pedidos_router.register(
    r"pedidos",
    PedidoViewSet,
    basename="pedido",
)
pedidos_router.register(
    r"detalles-pedidos",
    DetallePedidoViewSet,
    basename="detalle-pedido",
)
pedidos_router.register(
    r"envios",
    EnvioViewSet,
    basename="envio",
)

urlpatterns = [
    path("", include((pedidos_router.urls, "pedidos"))),
]