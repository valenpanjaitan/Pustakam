from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from .views import DocumentedTokenObtainPairView, DocumentedTokenRefreshView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("buku.urls")),
    path("api/token/", DocumentedTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", DocumentedTokenRefreshView.as_view(), name="token_refresh"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
