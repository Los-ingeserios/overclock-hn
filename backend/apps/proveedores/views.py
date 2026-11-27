from rest_framework import viewsets
from apps.proveedores.models import Proveedor
from apps.proveedores.serializers import ProveedorSerializer

# Create your views here.
class ProveedoresViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
