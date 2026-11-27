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