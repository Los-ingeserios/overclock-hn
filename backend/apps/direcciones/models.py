from django.db import models

# Create your models here.
class Pais(models.Model):
    id_pais = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100),
    estado = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'paises'

class Departamento(models.Model):
    id_departamento = models.AutoField(primary_key=True)
    id_pais = models.ForeignKey(Pais, db_column='id_pais', blank=True, null=True, on_delete=models.RESTRICT),
    nombre = models.CharField(max_length=100)
    estado = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'departamentos'