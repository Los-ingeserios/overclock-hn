from django.urls import include, path
from rest_framework.routers import SimpleRouter
from apps.pedidos.views import EmpresaRepartidoraViewSet, RepartidorViewSet

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

urlpatterns = [
    path("", include((pedidos_router.urls, "pedidos"))),
]