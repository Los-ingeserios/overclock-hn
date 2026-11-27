from django.urls import include, path
from rest_framework.routers import SimpleRouter
from apps.gestion_empresarial.views import (
    ClienteViewSet,
    DireccionClienteViewSet,
    VendedorViewSet,
    SucursalViewSet,
)

gestion_empresarial_router = SimpleRouter()
gestion_empresarial_router.register(r'clientes', ClienteViewSet)
gestion_empresarial_router.register(r'direcciones-clientes', DireccionClienteViewSet)
gestion_empresarial_router.register(r'vendedores', VendedorViewSet)
gestion_empresarial_router.register(r'sucursales', SucursalViewSet)

urlpatterns = [
    path('', include((gestion_empresarial_router.urls, 'gestion_empresarial')))
]