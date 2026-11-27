from rest_framework.routers import DefaultRouter
from apps.pagos.views import (
    TarjetaViewSet,
    MetodosPagoViewSet,
    PagoViewSet,
    DetallesPagosTarjetasViewSet
)

pagos_router = DefaultRouter()
pagos_router.register(r'tarjetas', TarjetaViewSet, basename='tarjeta')
pagos_router.register(r'metodos-pago', MetodosPagoViewSet, basename='metodo-pago')
pagos_router.register(r'pagos', PagoViewSet, basename='pago')
pagos_router.register(r'detalles-pagos-tarjetas', DetallesPagosTarjetasViewSet, basename='detalle-pago-tarjeta')