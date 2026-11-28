from django.utils import timezone
from rest_framework import serializers

from apps.facturacion.models import (
    ComprobanteFiscal,
    DetalleFactura,
    Factura,
)


class ComprobanteFiscalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComprobanteFiscal
        fields = [
            "id_comprobante_fiscal",
            "correlativo_minimo",
            "correlativo_maximo",
            "fecha_limite",
        ]
        read_only_fields = ["id_comprobante_fiscal"]

    def validate_fecha_limite(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError(
                "La fecha límite del comprobante fiscal no puede estar vencida."
            )
        return value

    def validate(self, attrs):
        minimo = attrs.get(
            "correlativo_minimo",
            self.instance.correlativo_minimo if self.instance else None,
        )
        maximo = attrs.get(
            "correlativo_maximo",
            self.instance.correlativo_maximo if self.instance else None,
        )
        if minimo and maximo and minimo > maximo:
            raise serializers.ValidationError(
                "El correlativo mínimo no puede ser mayor que el correlativo máximo."
            )
        return attrs


class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = [
            "id_factura",
            "id_comprobante_fiscal",
            "cai",
            "id_sucursal",
            "id_vendedor",
            "id_cliente",
            "numero_factura",
            "fecha_emision",
            "importe_exonerado",
            "importe_exento",
            "importe_gravado",
            "descuentos",
            "subtotal",
            "isv",
            "monto_isv",
            "total",
        ]
        read_only_fields = ["id_factura"]

    def validate_cai(self, value):
        if len(value) != 37:
            raise serializers.ValidationError(
                "El CAI debe tener exactamente 37 caracteres."
            )
        return value

    def validate(self, attrs):
        comprobante = attrs.get(
            "id_comprobante_fiscal",
            self.instance.id_comprobante_fiscal if self.instance else None,
        )
        if comprobante and comprobante.fecha_limite < timezone.localdate():
            raise serializers.ValidationError(
                {"id_comprobante_fiscal": "El comprobante fiscal asociado está vencido."}
            )
        return attrs


class DetalleFacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleFactura
        fields = [
            "id_detalle_factura",
            "id_factura",
            "id_producto",
            "id_promocion",
            "precio_venta",
            "cantidad",
            "subtotal",
            "descuento",
            "monto_descuento",
            "subtotal_descuento",
        ]
        read_only_fields = ["id_detalle_factura"]

    def validate(self, attrs):
        subtotal = attrs.get(
            "subtotal",
            self.instance.subtotal if self.instance else None,
        )
        monto_descuento = attrs.get(
            "monto_descuento",
            self.instance.monto_descuento if self.instance else None,
        )
        subtotal_descuento = attrs.get(
            "subtotal_descuento",
            self.instance.subtotal_descuento if self.instance else None,
        )

        if subtotal is not None and monto_descuento is not None and monto_descuento > subtotal:
            raise serializers.ValidationError(
                {"monto_descuento": "El monto de descuento no puede superar el subtotal."}
            )

        if subtotal_descuento is not None and subtotal_descuento < 0:
            raise serializers.ValidationError(
                {"subtotal_descuento": "El subtotal con descuento no puede ser negativo."}
            )

        return attrs