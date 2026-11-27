from django.urls import path, include
from rest_framework.routers import SimpleRouter
from apps.inventario.views import (
    CategoriaViewSet, MarcaViewSet, ProductoViewSet, ProductoAdminViewSet, EspecificacionViewSet,
    TipoPromocionViewSet, PromocionViewSet, PromocionProductoViewSet
)

inventario_router = SimpleRouter()
inventario_router.register(r'categorias', CategoriaViewSet)
inventario_router.register(r'marcas', MarcaViewSet)
inventario_router.register(r'productos', ProductoViewSet)
inventario_router.register(r'productos-admin', ProductoAdminViewSet, basename='productos-admin')
inventario_router.register(r'especificaciones', EspecificacionViewSet)
inventario_router.register(r'tipo-promociones', TipoPromocionViewSet)
inventario_router.register(r'promociones', PromocionViewSet)
inventario_router.register(r'promociones-productos', PromocionProductoViewSet)

urlpatterns = [
    path('', include((inventario_router.urls, 'inventario')))
]