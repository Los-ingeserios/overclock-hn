from django.urls import path, include
from rest_framework.routers import SimpleRouter

from apps.usuarios.views import RegistroViewSet, UsuarioViewSet

usuarios_router = SimpleRouter()
usuarios_router.register(r'registro', RegistroViewSet)
usuarios_router.register(r'usuarios', UsuarioViewSet, 'usuarios')

urlpatterns = [
    path('', include((usuarios_router.urls, 'usuarios'))),
]