from rest_framework import serializers
from apps.direcciones.models import Pais, Departamento, Ciudad, Direccion

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = ["id_pais", "nombre", "estado"]

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = ["id_departamento", "id_pais", "nombre", "estado"]

class CiudadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciudad
        fields = ["id_ciudad", "id_departamento", "nombre", "codigo_postal", "estado"]

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = ["id_direccion", "id_ciudad", "calle", "referencias"]
