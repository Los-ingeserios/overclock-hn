from decimal import Decimal

from django.core.validators import MaxValueValidator, MinLengthValidator, MinValueValidator
from django.db import models
from django.db.models.functions import Now
from apps.direcciones.models import Direccion
from apps.facturacion.models import Factura
from apps.inventario.models import Producto, Promocion

# Create your models here.

class EmpresaRepartidora(models.Model):
    id_empresa = models.AutoField(primary_key=True)
    id_direccion = models.ForeignKey(
        Direccion,
        db_column="id_direccion",
        on_delete=models.RESTRICT,
        blank=True,
        null=True,
    )
    rtn = models.CharField(
        unique=True,
        max_length=14,
        validators=[MinLengthValidator(14, "El RTN debe tener 14 caracteres")],
    )
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=50)
    telefono = models.CharField(max_length=20)
    fecha_registro = models.DateField()
    estado = models.BooleanField(db_default=True)

    class Meta:
        managed = False
        db_table = "empresas_repartidoras"

    def __str__(self):
        return f"{self.nombre} ({self.rtn})"


class Repartidor(models.Model):
    id_repartidor = models.AutoField(primary_key=True)
    id_empresa = models.ForeignKey(
        EmpresaRepartidora,
        db_column="id_empresa",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    dni = models.CharField(
        unique=True,
        max_length=13,
        validators=[MinLengthValidator(13, "El DNI debe tener 13 caracteres")],
    )
    primer_nombre = models.CharField(max_length=100)
    segundo_nombre = models.CharField(max_length=100, blank=True, null=True)
    primer_apellido = models.CharField(max_length=100)
    segundo_apellido = models.CharField(max_length=100, blank=True, null=True)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=20, unique=True)
    estado = models.BooleanField(db_default=True)

    class Meta:
        managed = False
        db_table = "repartidores"

    def __str__(self):
        return (
            f"{self.primer_nombre} {self.segundo_nombre or ''} "
            f"{self.primer_apellido} {self.segundo_apellido or ''}"
        ).strip()

class Pedido(models.Model):
    class EstadoPedido(models.TextChoices):
        PENDIENTE = "Pendiente", "Pendiente"
        ATRASADO = "Atrasado", "Atrasado"
        COMPLETADO = "Completado", "Completado"
        CANCELADO = "Cancelado", "Cancelado"

    id_pedido = models.AutoField(primary_key=True)
    id_factura = models.ForeignKey(
        Factura,
        db_column="id_factura",
        on_delete=models.CASCADE,
    )
    fecha_emision = models.DateTimeField(db_default=Now(), blank=True)
    fecha_completacion = models.DateTimeField(blank=True, null=True)
    importe_exonerado = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0000"))],
    )
    importe_exento = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0000"))],
    )
    importe_gravado = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0000"))],
    )
    descuentos = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0000"))],
    )
    subtotal = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
    )
    isv = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        db_default=Decimal("0.15"),
        validators=[
            MinValueValidator(Decimal("0.00")),
            MaxValueValidator(Decimal("1.00")),
        ],
    )
    monto_isv = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0000"))],
    )
    total = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
    )
    entrega_domicilio = models.BooleanField(db_default=False)
    estado = models.CharField(
        max_length=20,
        choices=EstadoPedido.choices,
        db_default=EstadoPedido.PENDIENTE,
    )

    class Meta:
        managed = False
        db_table = "pedidos"

    def __str__(self):
        return f"Pedido #{self.id_pedido} ({self.estado})"


class DetallePedido(models.Model):
    id_detalles_pedido = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(
        Pedido,
        db_column="id_pedido",
        on_delete=models.CASCADE,
    )
    id_producto = models.ForeignKey(
        Producto,
        db_column="id_producto",
        on_delete=models.RESTRICT,
    )
    id_promocion = models.ForeignKey(
        Promocion,
        db_column="id_promocion",
        on_delete=models.RESTRICT,
        blank=True,
        null=True,
    )
    precio_venta = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
    )
    cantidad = models.IntegerField(validators=[MinValueValidator(1)])
    subtotal = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
    )
    descuento = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0.00")),
            MaxValueValidator(Decimal("1.00")),
        ],
    )
    monto_descuento = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0000"))],
    )
    subtotal_descuento = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0000"))],
    )

    class Meta:
        managed = False
        db_table = "detalles_pedidos"

    def __str__(self):
        return f"DetallePedido #{self.id_detalles_pedido} - Pedido #{self.id_pedido_id}"


class Envio(models.Model):
    class EstadoEnvio(models.TextChoices):
        EN_PREPARACION = "En preparacion", "En preparacion"
        EN_CAMINO = "En camino", "En camino"
        ENTREGADO = "Entregado", "Entregado"
        CANCELADO = "Cancelado", "Cancelado"

    id_envio = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(
        Pedido,
        db_column="id_pedido",
        on_delete=models.CASCADE,
    )
    id_repartidor = models.ForeignKey(
        Repartidor,
        db_column="id_repartidor",
        on_delete=models.RESTRICT,
    )
    id_direccion = models.ForeignKey(
        Direccion,
        db_column="id_direccion",
        on_delete=models.RESTRICT,
    )
    numero_guia = models.CharField(max_length=20, unique=True)
    observaciones = models.CharField(max_length=500, blank=True, null=True)
    estado = models.CharField(
        max_length=20,
        choices=EstadoEnvio.choices,
        db_default=EstadoEnvio.EN_PREPARACION,
    )

    class Meta:
        managed = False
        db_table = "envios"

    def __str__(self):
        return f"Envio {self.numero_guia} ({self.estado})"