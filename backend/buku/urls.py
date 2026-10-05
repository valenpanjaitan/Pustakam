from rest_framework.routers import DefaultRouter
from .views import BukuViewSet

router = DefaultRouter()
router.register('buku', BukuViewSet)

urlpatterns = router.urls