from django.utils import timezone
from rest_framework import serializers
from apps.pedidos.models import EmpresaRepartidora, Repartidor


class EmpresaRepartidoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmpresaRepartidora
        fields = [
            "id_empresa",
            "id_direccion",
            "rtn",
            "nombre",
            "correo",
            "telefono",
            "fecha_registro",
            "estado",
        ]
        read_only_fields = ["id_empresa"]

    def validate_fecha_registro(self, value):
        if value >= timezone.localdate():
            raise serializers.ValidationError(
                "La fecha de registro debe ser anterior a la fecha actual."
            )
        return value


class RepartidorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repartidor
        fields = [
            "id_repartidor",
            "id_empresa",
            "dni",
            "primer_nombre",
            "segundo_nombre",
            "primer_apellido",
            "segundo_apellido",
            "fecha_nacimiento",
            "telefono",
            "estado",
        ]
        read_only_fields = ["id_repartidor"]

    def validate_fecha_nacimiento(self, value):
        hoy = timezone.localdate()
        edad = hoy.year - value.year - (
            (hoy.month, hoy.day) < (value.month, value.day)
        )
        if edad < 18:
            raise serializers.ValidationError(
                "El repartidor debe tener al menos 18 años."
            )
        return value