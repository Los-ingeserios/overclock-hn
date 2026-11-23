from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.inventario.views import (
    CategoriaViewSet, MarcaViewSet, ProductoViewSet, EspecificacionViewSet,
    TipoPromocionViewSet, PromocionViewSet, PromocionProductoViewSet
)

# app_name para toda la app de inventario
app_name = 'inventario'

inventario_router = DefaultRouter()
inventario_router.register(r'categorias', CategoriaViewSet)
inventario_router.register(r'marcas', MarcaViewSet)
inventario_router.register(r'productos', ProductoViewSet)
inventario_router.register(r'especificaciones', EspecificacionViewSet)
inventario_router.register(r'tipo-promociones', TipoPromocionViewSet)
inventario_router.register(r'promociones', PromocionViewSet)
inventario_router.register(r'promociones-productos', PromocionProductoViewSet)

urlpatterns = [
    path('', include(inventario_router.urls))
]