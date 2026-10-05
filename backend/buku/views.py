from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Buku
from .serializers import BukuSerializer


class BukuViewSet(viewsets.ModelViewSet):
    queryset = Buku.objects.all().order_by("-created_at")
    serializer_class = BukuSerializer
    permission_classes = [IsAuthenticated]