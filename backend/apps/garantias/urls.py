from django.urls import include, path
from rest_framework.routers import SimpleRouter
from apps.garantias.views import GarantiasViewSet

garantias_router = SimpleRouter()
garantias_router.register(r'garantias', GarantiasViewSet)

urlpatterns = [
    path('', include((garantias_router.urls, 'garantias')))
]
