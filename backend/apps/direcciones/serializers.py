from rest_framework import serializers
from apps.direcciones.models import Pais, Departamento

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = ["id_pais", "nombre", "estado"]

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        models = Departamento
        fields = ["id_departamento", "id_pais", "nombre", "estado"]