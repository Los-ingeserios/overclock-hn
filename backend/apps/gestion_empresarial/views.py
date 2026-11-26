from django.shortcuts import render
from rest_framework import mixins, viewsets
from apps.gestion_empresarial.models import Cliente, DireccionCliente
from apps.gestion_empresarial.serializers import (
    ClienteSerializer,
    DireccionClienteSerializer,
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