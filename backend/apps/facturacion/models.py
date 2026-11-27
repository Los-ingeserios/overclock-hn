from decimal import Decimal

from django.core.validators import MaxValueValidator, MinLengthValidator, MinValueValidator
from django.db import models
from django.db.models.functions import Now

from apps.gestion_empresarial.models import Cliente, Sucursal, Vendedor
from apps.inventario.models import Promocion, Producto

# Create your models here.
class ComprobanteFiscal(models.Model):
    id_comprobante_fiscal = models.AutoField(primary_key=True)
    correlativo_minimo = models.CharField(
        unique=True,
        max_length=19,
        validators=[MinLengthValidator(19, "El correlativo mínimo debe tener 19 caracteres")],
    )
    correlativo_maximo = models.CharField(
        unique=True,
        max_length=19,
        validators=[MinLengthValidator(19, "El correlativo máximo debe tener 19 caracteres")],
    )
    fecha_limite = models.DateField()

    class Meta:
        managed = False
        db_table = "comprobantes_fiscales"

    def __str__(self):
        return f"Comprobante #{self.id_comprobante_fiscal} ({self.correlativo_minimo} - {self.correlativo_maximo})"


class Factura(models.Model):
    id_factura = models.AutoField(primary_key=True)
    id_comprobante_fiscal = models.ForeignKey(
        ComprobanteFiscal,
        db_column="id_comprobante_fiscal",
        on_delete=models.RESTRICT,
        null=True,
        blank=True,
    )
    cai = models.CharField(
        max_length=37,
        validators=[MinLengthValidator(37, "El CAI debe tener 37 caracteres")],
    )
    id_sucursal = models.ForeignKey(
        Sucursal,
        db_column="id_sucursal",
        on_delete=models.RESTRICT,
        null=True,
        blank=True,
    )
    id_vendedor = models.ForeignKey(
        Vendedor,
        db_column="id_vendedor",
        on_delete=models.RESTRICT,
        null=True,
        blank=True,
    )
    id_cliente = models.ForeignKey(
        Cliente,
        db_column="id_cliente",
        on_delete=models.RESTRICT,
        null=True,
        blank=True,
    )
    numero_factura = models.CharField(unique=True, max_length=50)
    fecha_emision = models.DateTimeField(db_default=Now(), blank=True)
    importe_exonerado = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0"))],
    )
    importe_exento = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0"))],
    )
    importe_gravado = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0"))],
    )
    descuentos = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0"))],
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
            MinValueValidator(Decimal("0")),
            MaxValueValidator(Decimal("1")),
        ],
    )
    monto_isv = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0"))],
    )
    total = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
    )

    class Meta:
        managed = False
        db_table = "facturas"

    def __str__(self):
        return f"Factura {self.numero_factura}"


class DetalleFactura(models.Model):
    id_detalle_factura = models.AutoField(primary_key=True)
    id_factura = models.ForeignKey(
        Factura,
        db_column="id_factura",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    id_producto = models.ForeignKey(
        Producto,
        db_column="id_producto",
        on_delete=models.RESTRICT,
        null=True,
        blank=True,
    )
    id_promocion = models.ForeignKey(
        Promocion,
        db_column="id_promocion",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
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
            MinValueValidator(Decimal("0")),
            MaxValueValidator(Decimal("1")),
        ],
    )
    monto_descuento = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0"))],
    )
    subtotal_descuento = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0"))],
    )

    class Meta:
        managed = False
        db_table = "detalles_factura"

    def __str__(self):
        return f"Detalle #{self.id_detalle_factura} - Factura #{self.id_factura_id}"