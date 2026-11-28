from django.shortcuts import render
from rest_framework import viewsets, mixins
from apps.direcciones.models import Pais, Departamento, Ciudad, Direccion
from apps.direcciones.serializers import PaisSerializer, DepartamentoSerializer, CiudadSerializer, DireccionSerializer

# Se definen unicamente los metodos list (GET), retrieve (GET por id), create (POST) y update (PUT)
class ListRetrieveCreateUpdateViewSet(mixins.ListModelMixin,
                                      mixins.RetrieveModelMixin,
                                      mixins.CreateModelMixin,
                                      mixins.UpdateModelMixin,
                                      viewsets.GenericViewSet):
    pass

class PaisViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer

class DepartamentoViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer

class CiudadViewSet(ListRetrieveCreateUpdateViewSet):
    queryset = Ciudad.objects.all()
    serializer_class = CiudadSerializer

# Para las direcciones se usan todos los metodos del CRUD
class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
