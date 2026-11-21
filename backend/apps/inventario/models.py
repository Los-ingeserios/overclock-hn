from django.db import models
from django.db.models.functions import Now
from apps.direcciones.models import Pais

# Se agregaron manualmente los parametros on_delete, db_default
# Create your models here.
class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'categorias'


class Marca(models.Model):
    id_marca = models.AutoField(primary_key=True)
    id_pais = models.ForeignKey(Pais, db_column='id_pais', blank=True, null=True, on_delete=models.RESTRICT)
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'marcas'


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    id_categoria = models.ForeignKey(Categoria, db_column='id_categoria', blank=True, null=True, on_delete=models.RESTRICT)
    id_marca = models.ForeignKey(Marca, db_column='id_marca', blank=True, null=True, on_delete=models.RESTRICT)
    codigo_sku = models.CharField(unique=True, max_length=8)
    numero_lote = models.CharField(unique=True, max_length=20)
    modelo = models.CharField(max_length=100)
    precio_costo = models.DecimalField(max_digits=19, decimal_places=4)
    precio_venta = models.DecimalField(max_digits=19, decimal_places=4)
    stock = models.IntegerField()
    # La funcion Now() es equivalente a current_timestamp en la base de datos
    fecha_ingreso = models.DateTimeField(db_default=Now())
    url_img = models.CharField(max_length=100, blank=True, null=True)
    estado = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'productos'


class Especificacion(models.Model):
    id_especificacion = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey(Producto, db_column='id_producto', blank=True, null=True, on_delete=models.CASCADE)
    especificacion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'especificaciones'
        