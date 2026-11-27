from django.core.validators import MinLengthValidator
from django.db import models
from apps.direcciones.models import Direccion

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