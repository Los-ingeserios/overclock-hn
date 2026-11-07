# Backend - Overclock HN (Django + PostgreSQL)

Bienvenido al lado oscuro (Backend). Aquí manejaremos la API REST y la Base de Datos para el E-commerce de Hardware.

## Pasos para levantar el entorno local

**1. Levantar la Base de Datos (Docker)**
Antes de correr cualquier comando de Python, asegúrate de tener Docker Desktop abierto y levanta el contenedor de PostgreSQL:

```bash
docker-compose up -d
```

(Nota: Esto ejecutará automáticamente el Script.sql que crearemos para el Avance 1).

**2. Activar el Entorno Virtual**
Nunca instales paquetes globalmente. Activa el entorno virtual (venv):
```Bash
Windows: .\venv\Scripts\activate

Mac/Linux: source venv/bin/activate
```

**3. Instalar Dependencias**

```Bash
pip install -r requirements.txt
```

**4. Migraciones y Servidor**
Cada vez que bajes cambios de GitHub o crees un modelo nuevo en models.py, debes sincronizar la BD:

```Bash
python manage.py makemigrations
python manage.py migrate
```
Para encender el servidor en http://127.0.0.1:8000/:
```Bash
python manage.py runserver
```

¿Cómo crear una nueva App en Django?
Si necesitas crear un nuevo módulo (ej. ventas o inventario), no lo crees en la raíz. Ve a la carpeta apps y córrelo desde ahí:

```Bash
cd apps
python ../manage.py startapp nombre_de_la_app
cd ..
```
### ¡IMPORTANTE! Después de crearla, ve al archivo apps.py de tu nueva app y asegúrate de agregarle el prefijo apps.. Por ejemplo: name = 'apps.ventas'. Finalmente, regístrala en core/settings.py dentro de INSTALLED_APPS.