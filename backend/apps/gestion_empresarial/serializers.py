from rest_framework import serializers
from apps.gestion_empresarial.models import Cliente, DireccionCliente


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