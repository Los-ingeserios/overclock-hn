from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.inventario import views

inventario_router = DefaultRouter()
inventario_router.register(r'categorias', views.CategoriaViewSet)
inventario_router.register(r'marcas', views.MarcaViewSet)
inventario_router.register(r'productos', views.ProductoViewSet)
inventario_router.register(r'especificaciones', views.EspecificacionViewSet)

urlpatters = [
    path('', include(inventario_router.urls, 'inventario'))
]