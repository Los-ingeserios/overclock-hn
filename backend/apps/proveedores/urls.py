from django.urls import include, path
from rest_framework.routers import SimpleRouter
from apps.proveedores.views import ProveedoresViewSet

proveedores_router = SimpleRouter()
proveedores_router.register(r'proveedores', ProveedoresViewSet)

urlpatterns = [
    path('', include((proveedores_router.urls, 'proveedores')))
]
