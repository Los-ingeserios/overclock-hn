from rest_framework.routers import SimpleRouter

from apps.facturacion.views import (
    ComprobanteFiscalViewSet,
    DetalleFacturaViewSet,
    FacturaViewSet,
)

facturacion_router = SimpleRouter()
facturacion_router.register(
    r"comprobantes-fiscales",
    ComprobanteFiscalViewSet,
    basename="comprobante-fiscal",
)
facturacion_router.register(
    r"facturas",
    FacturaViewSet,
    basename="factura",
)
facturacion_router.register(
    r"detalles-factura",
    DetalleFacturaViewSet,
    basename="detalle-factura",
)