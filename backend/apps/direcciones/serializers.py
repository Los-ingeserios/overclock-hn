from rest_framework import serializers
from apps.direcciones.models import Paises

class PaisesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paises
        fields = ["id_pais", "nombre"]