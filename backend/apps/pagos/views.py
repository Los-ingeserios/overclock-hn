from rest_framework import viewsets, mixins
from apps.pagos.models import Tarjeta, Metodos_pago, Pago, Detalles_pagos_tarjetas
from apps.pagos.serializers import (
    TarjetaSerializer,
    MetodosPagoSerializer,  # <--- Coincide exactamente con el serializer
    PagoSerializer,
    DetallesPagosTarjetasSerializer
)

class ListRetrieveCreateUpdateViewSet(mixins.ListModelMixin,
                                      mixins.RetrieveModelMixin,
                                      mixins.CreateModelMixin,
                                      mixins.UpdateModelMixin,
                                      viewsets.GenericViewSet):
    pass

class TarjetaViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Tarjeta.objects.all()
    serializer_class = TarjetaSerializer

class MetodosPagoViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Metodos_pago.objects.all()
    serializer_class = MetodosPagoSerializer

class PagoViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer

class DetallesPagosTarjetasViewSet(viewsets.ModelViewSet):
    queryset = Detalles_pagos_tarjetas.objects.all()
    serializer_class = DetallesPagosTarjetasSerializer