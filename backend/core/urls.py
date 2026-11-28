"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

# Se importan los routers individuales de cada aplicacion
from apps.inventario.urls import inventario_router
from apps.direcciones.urls import direcciones_router
from apps.gestion_empresarial.urls import gestion_empresarial_router
from apps.proveedores.urls import proveedores_router
from apps.garantias.urls import garantias_router
from apps.pagos.urls import pagos_router

# Se crea un router unico para cada version de la api, al cual se agregan los routers de las aplicaciones
api_v1_router = DefaultRouter()
api_v1_router.registry.extend(inventario_router.registry)
api_v1_router.registry.extend(direcciones_router.registry)
api_v1_router.registry.extend(gestion_empresarial_router.registry)
api_v1_router.registry.extend(proveedores_router.registry)
api_v1_router.registry.extend(garantias_router.registry)
api_v1_router.registry.extend(pagos_router.registry)

urlpatterns = [
    # path('admin/', admin.site.urls),
    
    # Se incluye unicamente las urls del router de la api
    # El atributo namespace debe ser unico, y cada nuevo registro debe corresponder a una nueva version 'v2', 'v3'...
    re_path(r'^api/v1/', include((api_v1_router.urls, 'api_v1'), namespace='v1')),
]

