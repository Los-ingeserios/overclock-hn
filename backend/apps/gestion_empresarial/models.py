from django.db import models
from django.core.validators import MinLengthValidator
from apps.direcciones.models import Direccion
from django.db.models.functions import Now
# Create your models here.

class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    dni = models.CharField(
        unique=True,
        max_length=13,
        validators=[MinLengthValidator(13, 'El DNI debe tener 13 caracteres')],
    )
    rtn = models.CharField(
        unique=True,
        max_length=14,
        blank=True,
        null=True,
        validators=[MinLengthValidator(14, 'El RTN debe tener 14 caracteres')],
    )
    primer_nombre = models.CharField(max_length=100)
    segundo_nombre = models.CharField(max_length=100, blank=True, null=True)
    primer_apellido = models.CharField(max_length=100)
    segundo_apellido = models.CharField(max_length=100, blank=True, null=True)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(unique=True, max_length=20)
    correo = models.EmailField(unique=True, max_length=100)
    fecha_registro = models.DateTimeField(db_default=Now(), blank=True)
    razon_social = models.CharField(max_length=50, blank=True, null=True)
    estado = models.BooleanField(db_default=True)

    class Meta:
        managed = False
        db_table = 'clientes'
        
    def __str__(self):
        return f"{self.primer_nombre} {self.segundo_nombre or ''} {self.primer_apellido} {self.segundo_apellido or ''}".strip()

class DireccionCliente(models.Model):
    id_direccion_cliente = models.AutoField(primary_key=True)
    id_direccion = models.OneToOneField(
        Direccion,
        db_column='id_direccion',
        on_delete=models.CASCADE,
    )
    id_cliente = models.ForeignKey(
        Cliente,
        db_column='id_cliente',
        on_delete=models.RESTRICT,
    )
    predeterminada = models.BooleanField(db_default=False)

    class Meta:
        managed = False
        db_table = 'direcciones_clientes'

class Vendedor(models.Model):
    id_vendedor = models.AutoField(primary_key=True)
    dni = models.CharField(
        unique=True,
        max_length=13,
        validators=[MinLengthValidator(13, "El DNI debe tener 13 caracteres")],
    )
    primer_nombre = models.CharField(max_length=100)
    segundo_nombre = models.CharField(max_length=100, blank=True, null=True)
    primer_apellido = models.CharField(max_length=100)
    segundo_apellido = models.CharField(max_length=100, blank=True, null=True)
    fecha_contratacion = models.DateField()
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=20, unique=True)
    estado = models.BooleanField(db_default=True)

    class Meta:
        managed = False
        db_table = "vendedores"

    def __str__(self):
        return (
            f"{self.primer_nombre} {self.segundo_nombre or ''} "
            f"{self.primer_apellido} {self.segundo_apellido or ''}"
        ).strip()


class Sucursal(models.Model):
    id_sucursal = models.AutoField(primary_key=True)
    id_direccion = models.ForeignKey(
        Direccion,
        db_column="id_direccion",
        on_delete=models.RESTRICT,
    )
    rtn = models.CharField(
        unique=True,
        max_length=14,
        validators=[MinLengthValidator(14, "El RTN debe tener 14 caracteres")],
    )
    correo = models.EmailField(max_length=30)
    hora_apertura = models.TimeField()
    hora_cierre = models.TimeField()
    telefono = models.CharField(max_length=20, unique=True)
    fecha_inauguracion = models.DateField()
    estado = models.BooleanField(db_default=True)

    class Meta:
        managed = False
        db_table = "sucursales"

    def __str__(self):
        return f"Sucursal #{self.id_sucursal} - RTN {self.rtn}"