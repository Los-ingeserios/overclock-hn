from django.db import models
from django.core.validators import MinLengthValidator
from apps.direcciones.models import Direccion

# Create your models here.
class Proveedor(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    id_direccion = models.ForeignKey(Direccion,db_column='id_direccion' ,blank=True, null=True, on_delete=models.RESTRICT)
    rtn = models.CharField(unique=True, max_length=14)
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(unique=True, max_length=20)
    correo = models.EmailField(unique= True, max_length= 50)
    estado = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'proveedores'

    def __str__(self):
        return self.nombre



