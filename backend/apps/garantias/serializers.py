from rest_framework import serializers
from apps.garantias.models import Garantias

class GarantiasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Garantias
        fields = ["id_garantia", "id_cliente","id_producto","fecha_inicio" , "fecha_vencimiento","estado"]
        
        