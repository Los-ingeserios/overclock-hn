from rest_framework import serializers
from apps.pagos.models import Tarjeta, Metodos_pago, Pago, Detalles_pagos_tarjetas

class TarjetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarjeta
        fields = ["id_tarjeta", "id_cliente", "nombre_titular", "numero_tarjeta", "fecha_vencimiento", "cvv", "tipo_tarjeta"]

class MetodosPagoSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Metodos_pago
        fields = ["id_metodo_pago", "nombre", "descripcion", "condicion_pago", "numero_referencia", "pago_con_tarjeta"]

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = ["id_pago", "id_metodo_pago", "codigo_pago", "fecha_emision", "monto_pagado", "estado"]
        read_only_fields = ["fecha_emision"]

class DetallesPagosTarjetasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detalles_pagos_tarjetas
        fields = ["id_detalles_pagos_tarjetas", "id_pago", "id_tarjeta", "codigo_autorizacion"]