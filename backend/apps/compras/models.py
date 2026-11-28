from django.db import models
from django.core.validators import MinLengthValidator
from apps.inventario.models import Producto
from apps.proveedores.models import Proveedor

# Create your models here.

class Compras(models.Model):
    id_compra = models.AutoField(primary_key= True)
    id_proveedor = models.ForeignKey(Proveedor,db_column='id_proveedor',blank=True, null=True, on_delete=models.RESTRICT) 
    numero_compra = models.CharField(unique= True , max_length= 20)
    fecha_compra = models.DateField(auto_now_add= True)
    subtotal = models.DecimalField(max_digits=19 , decimal_places= 2)  
    isv = models.DecimalField(max_digits= 19 ,  decimal_places= 2)
    monto_isv = models.DecimalField(max_digits=19, decimal_places= 2)
    total = models.DecimalField(max_digits= 19, decimal_places= 2)

    class Meta: 
        managed = False
        db_table = 'proveedores'

    def __str__(self):
        return self.nombre

class Detalles_Compra(models.Model):

    id_detalles_compras = models.AutoField(primary_key= True)
    id_compra = models.ForeignKey(Compras,db_column= 'id_compra' , blank= True, null= True, on_delete= models.CASCADE)
    id_producto = models.ForeignKey(Producto,db_column='id_producto', blank = True,null = True, on_delete= models.RESTRICT)
    cantidad = models.IntegerField()
    precio_compra = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)