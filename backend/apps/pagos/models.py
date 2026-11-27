from django.db import models
from apps.gestion_empresarial.models import Cliente

# Create your models here.

class Tarjeta(models.Model):
    id_tarjeta = models.AutoField(primary_key=True)   
    id_cliente = models.ForeignKey(Cliente, db_column='id_cliente', blank=True, null=True, on_delete=models.RESTRICT)
    nombre_titular = models.CharField(max_length=30)
    numero_tarjeta = models.CharField(max_length=30)
    fecha_vencimiento = models.DateField()
    cvv = models.CharField(max_length=4)
    tipo_tarjeta = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'Tarjetas'

class Metodos_pago(models.Model):  # <--- Definida con M mayúscula
    id_metodo_pago = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=100)
    condicion_pago = models.CharField(max_length=50)
    numero_referencia = models.CharField(max_length=50)
    pago_con_tarjeta = models.BooleanField()

    class Meta:
       managed = False
       db_table = 'metodos_pago'

class Pago(models.Model):
    id_pago = models.AutoField(primary_key=True)
    # Referenciamos la clase con la misma mayúscula
    id_metodo_pago = models.ForeignKey(Metodos_pago, db_column='id_metodo_pago', on_delete=models.RESTRICT)
    codigo_pago = models.CharField(max_length=50, unique=True)
    fecha_emision = models.DateTimeField(auto_now_add=True)
    monto_pagado = models.DecimalField(max_digits=19, decimal_places=2)
    estado = models.CharField(max_length=20)

    class Meta:
       managed = False
       db_table = 'pago'

class Detalles_pagos_tarjetas(models.Model):
    id_detalles_pagos_tarjetas = models.AutoField(primary_key=True)
    id_pago = models.ForeignKey(Pago, db_column='id_pago', on_delete=models.RESTRICT)
    id_tarjeta = models.ForeignKey(Tarjeta, db_column='id_tarjeta', on_delete=models.RESTRICT)
    codigo_autorizacion = models.CharField(unique=True, max_length=50)


    class Meta: 
       managed = False
       db_table = 'detalles_pagos_tarjetas'
