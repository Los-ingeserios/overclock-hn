from django.urls import include, path
from rest_framework.routers import SimpleRouter
from apps.direcciones.views import PaisViewSet, DepartamentoViewSet, CiudadViewSet, DireccionViewSet

direcciones_router = SimpleRouter()
direcciones_router.register(r'paises', PaisViewSet)
direcciones_router.register(r'departamentos', DepartamentoViewSet)
direcciones_router.register(r'ciudades', CiudadViewSet)
direcciones_router.register(r'direcciones', DireccionViewSet)

urlpatterns = [
    path('', include((direcciones_router.urls, 'direcciones')))
]
