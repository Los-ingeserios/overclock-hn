from django.utils import timezone
from rest_framework import serializers
from apps.gestion_empresarial.models import Cliente, DireccionCliente, Vendedor, Sucursal

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = [
            "id_cliente",
            "dni",
            "rtn",
            "primer_nombre",
            "segundo_nombre",
            "primer_apellido",
            "segundo_apellido",
            "fecha_nacimiento",
            "telefono",
            "correo",
            "fecha_registro",
            "razon_social",
            "estado",
        ]
        read_only_fields = ["id_cliente", "fecha_registro"]


class DireccionClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DireccionCliente
        fields = [
            "id_direccion_cliente",
            "id_direccion",
            "id_cliente",
            "predeterminada",
        ]
        read_only_fields = ["id_direccion_cliente"]

class VendedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendedor
        fields = [
            "id_vendedor",
            "dni",
            "primer_nombre",
            "segundo_nombre",
            "primer_apellido",
            "segundo_apellido",
            "fecha_contratacion",
            "fecha_nacimiento",
            "telefono",
            "estado",
        ]
        read_only_fields = ["id_vendedor"]

    def validate_fecha_contratacion(self, value):
        if value > timezone.localdate():
            raise serializers.ValidationError(
                "La fecha de contratación no puede ser futura."
            )
        return value

    def validate_fecha_nacimiento(self, value):
        hoy = timezone.localdate()
        edad = hoy.year - value.year - (
            (hoy.month, hoy.day) < (value.month, value.day)
        )
        if edad < 18:
            raise serializers.ValidationError(
                "El vendedor debe tener al menos 18 años."
            )
        return value

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = [
            "id_sucursal",
            "id_direccion",
            "rtn",
            "correo",
            "hora_apertura",
            "hora_cierre",
            "telefono",
            "fecha_inauguracion",
            "estado",
        ]
        read_only_fields = ["id_sucursal"]

    def validate(self, attrs):
        hora_apertura = attrs.get(
            "hora_apertura",
            getattr(self.instance, "hora_apertura", None),
        )
        hora_cierre = attrs.get(
            "hora_cierre",
            getattr(self.instance, "hora_cierre", None),
        )

        if hora_apertura and hora_cierre and hora_cierre <= hora_apertura:
            raise serializers.ValidationError(
                {"hora_cierre": "La hora de cierre debe ser mayor que la hora de apertura."}
            )
        return attrs