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

    def __str__(self):
        return self.nombre

class Marca(models.Model):
    id_marca = models.AutoField(primary_key=True)
    id_pais = models.ForeignKey(Pais, db_column='id_pais', blank=True, null=True, on_delete=models.RESTRICT)
    nombre = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'marcas'

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    id_categoria = models.ForeignKey(Categoria, related_name='productos', db_column='id_categoria', blank=True, null=True, on_delete=models.RESTRICT)
    id_marca = models.ForeignKey(Marca, related_name='productos', db_column='id_marca', blank=True, null=True, on_delete=models.RESTRICT)
    codigo_sku = models.CharField(unique=True, max_length=8)
    numero_lote = models.CharField(unique=True, max_length=20)
    modelo = models.CharField(max_length=100)
    precio_costo = models.DecimalField(max_digits=19, decimal_places=4)
    precio_venta = models.DecimalField(max_digits=19, decimal_places=4)
    stock = models.IntegerField()
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    # La funcion Now() es equivalente a current_timestamp en la base de datos
    fecha_ingreso = models.DateTimeField(db_default=Now())
    url_img = models.CharField(max_length=500, blank=True, null=True)
    estado = models.BooleanField(db_default=True)

    class Meta:
        managed = False
        db_table = 'productos'

class Especificacion(models.Model):
    id_especificacion = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey(Producto, related_name='especificaciones', db_column='id_producto', blank=True, null=True, on_delete=models.CASCADE)
    especificacion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'especificaciones'

class TipoPromocion(models.Model):
    id_tipo_promocion = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_promocion'

class Promocion(models.Model):
    id_promocion = models.AutoField(primary_key=True)
    id_tipo_promocion = models.ForeignKey(TipoPromocion, db_column='id_tipo_promocion', blank=True, null=True, on_delete=models.RESTRICT)
    fecha_inicio = models.DateField()
    fecha_vencimiento = models.DateField(blank=True, null=True)
    porcentaje_descuento = models.DecimalField(max_digits=3, decimal_places=2)
    cantidad_requerida = models.IntegerField(db_default=1)
    cantidad_beneficio = models.IntegerField(db_default=1)
    estado = models.BooleanField(db_default=True)

    # Se debe agregar un validator para la fecha de vencimiento y la fecha de inicio

    class Meta:
        managed = False
        db_table = 'promociones'

class PromocionProducto(models.Model):
    # Opciones para crear un choice
    # Esto permite mostrar un menu desplegable en la api al momento de crear una nueva instancia
    # En este caso, las constantes corresponden con la clave y deben coincidir con el check en la base de datos
    # Es como un mapa, la clave se guarda en la BD y el valor es lo que se muestra en la API    
    REQUERIDO = "Requerido"
    BENEFICIO = "Beneficio"
    AMBOS = "Ambos"

    ROL_PRODUCTO_CHOICES = [
        (REQUERIDO, "Requerido"),
        (BENEFICIO, "Beneficio"),
        (AMBOS, "Ambos")
    ]

    # Columnas de la tabla
    id_promocion_producto = models.AutoField(primary_key=True)
    id_promocion = models.ForeignKey(Promocion, db_column='id_promocion', blank=True, null=True, on_delete=models.CASCADE)
    id_producto = models.ForeignKey(Producto, db_column='id_producto', blank=True, null=True, on_delete=models.RESTRICT)
    rol_producto = models.CharField(max_length=20, choices=ROL_PRODUCTO_CHOICES, default=REQUERIDO)

    class Meta:
        managed = False
        db_table = 'promociones_productos'
        