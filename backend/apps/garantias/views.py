from rest_framework import viewsets
from apps.garantias.models import Garantias
from apps.garantias.serializers import GarantiasSerializer

# Create your views here.
class GarantiasViewSet(viewsets.ModelViewSet):
    queryset = Garantias.objects.all()
    serializer_class = GarantiasSerializer
    