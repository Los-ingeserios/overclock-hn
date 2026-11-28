from django.shortcuts import render
from apps.direcciones.views import ListRetrieveCreateUpdateViewSet
from apps.facturacion.models import (
    ComprobanteFiscal,
    DetalleFactura,
    Factura,
)
from apps.facturacion.serializers import (
    ComprobanteFiscalSerializer,
    DetalleFacturaSerializer,
    FacturaSerializer,
)
# Create your views here.


class ComprobanteFiscalViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = ComprobanteFiscal.objects.all().order_by("id_comprobante_fiscal")
    serializer_class = ComprobanteFiscalSerializer


class FacturaViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Factura.objects.select_related(
        "id_comprobante_fiscal",
        "id_sucursal",
        "id_vendedor",
        "id_cliente",
    ).order_by("-id_factura")
    serializer_class = FacturaSerializer


class DetalleFacturaViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = DetalleFactura.objects.select_related(
        "id_factura",
        "id_producto",
        "id_promocion",
    ).order_by("id_detalle_factura")
    serializer_class = DetalleFacturaSerializer