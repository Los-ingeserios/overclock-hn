from django.db import models
from django.core.validators import MinLengthValidator

# Create your models here.
class Pais(models.Model):
    id_pais = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    estado = models.BooleanField(db_default=True)

    class Meta:
        managed = False
        db_table = 'paises'
    
    def __str__(self):
        return self.nombre

class Departamento(models.Model):
    id_departamento = models.AutoField(primary_key=True)
    id_pais = models.ForeignKey(Pais, db_column='id_pais', blank=True, null=True, on_delete=models.RESTRICT)
    nombre = models.CharField(max_length=100)
    estado = models.BooleanField(db_default=True)

    class Meta:
        managed = False
        db_table = 'departamentos'

    def __str__(self):
        return self.nombre


class Ciudad(models.Model):
    id_ciudad = models.AutoField(primary_key=True)
    id_departamento = models.ForeignKey(Departamento, db_column='id_departamento', blank=True, null=True, on_delete=models.RESTRICT)
    nombre = models.CharField(max_length=100)
    codigo_postal = models.CharField(unique=True, max_length=5, 
        validators=[MinLengthValidator(5, "La longitud no es correcta")])
    estado = models.BooleanField(db_default=True)

    class Meta:
        managed = False
        db_table = 'ciudades'

    def __str__(self):
        return self.nombre

class Direccion(models.Model):
    id_direccion = models.AutoField(primary_key=True)
    id_ciudad = models.ForeignKey(Ciudad, db_column='id_ciudad', blank=True, null=True, on_delete=models.RESTRICT)
    calle = models.CharField(max_length=100)
    referencias = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'direcciones'

    def __str__(self):
        return f"{self.calle}, {self.id_ciudad.nombre}, {self.id_ciudad.id_departamento.nombre}, {self.id_ciudad.id_departamento.id_pais.nombre}"
        