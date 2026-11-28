from rest_framework import viewsets, mixins, permissions
from django.contrib.auth import get_user_model

from apps.usuarios.serializers import RegistroSerializer, UsuarioAllSerializer

CustomUser = get_user_model()

# Vistas de soporte
class CreateViewSet(mixins.CreateModelMixin,
                    viewsets.GenericViewSet):
    pass

# El endpoint de registro tiene unicamente el metodo POST permitido, para enviar los datos
class RegistroViewSet(CreateViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = RegistroSerializer
    # permission_classes = [permissions.AllowAny] # Permite que cualquier solicitud tenga acceso a esta vista
    
# Este metodo pensado para el administrador hacer todo el CRUD de usuarios
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.order_by("username", "id")
    serializer_class = UsuarioAllSerializer  

    # permission_classes = [permissions.IsAuthenticated]
