from decimal import Decimal

from django.utils import timezone
from rest_framework import serializers
from apps.pedidos.models import DetallePedido, EmpresaRepartidora, Envio, Pedido, Repartidor


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

TOLERANCIA_DECIMAL = Decimal("0.0001")
class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = [
            "id_pedido",
            "id_factura",
            "fecha_emision",
            "fecha_completacion",
            "importe_exonerado",
            "importe_exento",
            "importe_gravado",
            "descuentos",
            "subtotal",
            "isv",
            "monto_isv",
            "total",
            "entrega_domicilio",
            "estado",
        ]
        read_only_fields = ["id_pedido"]

    def validate(self, attrs):
        instance = self.instance

        fecha_emision = attrs.get(
            "fecha_emision",
            instance.fecha_emision if instance else None,
        )
        fecha_completacion = attrs.get(
            "fecha_completacion",
            instance.fecha_completacion if instance else None,
        )

        if fecha_emision and fecha_completacion and fecha_completacion < fecha_emision:
            raise serializers.ValidationError(
                {
                    "fecha_completacion": (
                        "La fecha de completación no puede ser anterior a la fecha de emisión."
                    )
                }
            )

        subtotal = attrs.get(
            "subtotal",
            instance.subtotal if instance else None,
        )
        descuentos = attrs.get(
            "descuentos",
            instance.descuentos if instance else Decimal("0.0000"),
        )

        if subtotal is not None and descuentos is not None and descuentos > subtotal:
            raise serializers.ValidationError(
                {"descuentos": "El monto de descuentos no puede superar el subtotal."}
            )

        estado = attrs.get(
            "estado",
            instance.estado if instance else Pedido.EstadoPedido.PENDIENTE,
        )
        if estado == Pedido.EstadoPedido.COMPLETADO and not fecha_completacion:
            raise serializers.ValidationError(
                {
                    "fecha_completacion": (
                        "Debe indicar fecha_completacion cuando el pedido está Completado."
                    )
                }
            )

        return attrs


class DetallePedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetallePedido
        fields = [
            "id_detalles_pedido",
            "id_pedido",
            "id_producto",
            "id_promocion",
            "precio_venta",
            "cantidad",
            "subtotal",
            "descuento",
            "monto_descuento",
            "subtotal_descuento",
        ]
        read_only_fields = ["id_detalles_pedido"]

    def validate(self, attrs):
        instance = self.instance

        precio_venta = attrs.get(
            "precio_venta",
            instance.precio_venta if instance else None,
        )
        cantidad = attrs.get(
            "cantidad",
            instance.cantidad if instance else None,
        )
        subtotal = attrs.get(
            "subtotal",
            instance.subtotal if instance else None,
        )
        descuento = attrs.get(
            "descuento",
            instance.descuento if instance else None,
        )
        monto_descuento = attrs.get(
            "monto_descuento",
            instance.monto_descuento if instance else None,
        )
        subtotal_descuento = attrs.get(
            "subtotal_descuento",
            instance.subtotal_descuento if instance else None,
        )
        promocion = attrs.get(
            "id_promocion",
            instance.id_promocion if instance else None,
        )

        if (
            subtotal is not None
            and monto_descuento is not None
            and monto_descuento > subtotal
        ):
            raise serializers.ValidationError(
                {
                    "monto_descuento": (
                        "El monto de descuento no puede ser mayor que el subtotal."
                    )
                }
            )

        if (
            subtotal is not None
            and monto_descuento is not None
            and subtotal_descuento is not None
        ):
            subtotal_esperado = subtotal - monto_descuento
            if abs(subtotal_descuento - subtotal_esperado) > TOLERANCIA_DECIMAL:
                raise serializers.ValidationError(
                    {
                        "subtotal_descuento": (
                            "subtotal_descuento debe ser igual a subtotal - monto_descuento."
                        )
                    }
                )

        if promocion is not None and hasattr(promocion, "estado") and not promocion.estado:
            raise serializers.ValidationError(
                {"id_promocion": "La promoción seleccionada no está activa."}
            )

        return attrs


class EnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Envio
        fields = [
            "id_envio",
            "id_pedido",
            "id_repartidor",
            "id_direccion",
            "numero_guia",
            "observaciones",
            "estado",
        ]
        read_only_fields = ["id_envio"]

    def validate(self, attrs):
        instance = self.instance

        pedido = attrs.get(
            "id_pedido",
            instance.id_pedido if instance else None,
        )
        repartidor = attrs.get(
            "id_repartidor",
            instance.id_repartidor if instance else None,
        )
        numero_guia = attrs.get(
            "numero_guia",
            instance.numero_guia if instance else None,
        )

        if pedido is not None and not pedido.entrega_domicilio:
            raise serializers.ValidationError(
                {
                    "id_pedido": (
                        "No se puede crear o asociar un envío a un pedido sin entrega a domicilio."
                    )
                }
            )

        if (
            repartidor is not None
            and hasattr(repartidor, "estado")
            and not repartidor.estado
        ):
            raise serializers.ValidationError(
                {"id_repartidor": "El repartidor seleccionado no está activo."}
            )

        if numero_guia is not None:
            guia_limpia = numero_guia.strip()
            if not guia_limpia:
                raise serializers.ValidationError(
                    {"numero_guia": "El número de guía no puede estar vacío."}
                )
            attrs["numero_guia"] = guia_limpia

        return attrs