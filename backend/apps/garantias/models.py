from django.db import models
from apps.gestion_empresarial.models import Cliente
from apps.inventario.models import Producto
# Create your models here.

class Garantias(models.Model): 


    id_garantia = models.AutoField(primary_key= True)
    id_cliente = models.ForeignKey(Cliente,db_column='id_cliente',blank=True ,null=True, on_delete= models.RESTRICT)
    id_producto= models.ForeignKey(Producto,db_column='id_producto',blank= True, null=True, on_delete= models.RESTRICT)

    fecha_inicio= models.DateField(auto_now=True)
    fecha_vencimiento = models.DateField()
    estado = models.BooleanField()
    
    class Meta:
        managed = False
        db_table = 'garantias'

    def __str__(self):
        return self.nombre
