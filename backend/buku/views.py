from rest_framework import filters, serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    OpenApiResponse,
    extend_schema,
    extend_schema_view,
    inline_serializer,
)

from .models import Buku
from .filters import BukuFilter
from .pagination import BukuPagination
from .serializers import BukuSerializer


AuthenticationErrorResponse = inline_serializer(
    name="AuthenticationErrorResponse",
    fields={"detail": serializers.CharField()},
)

ValidationErrorResponse = inline_serializer(
    name="BukuValidationErrorResponse",
    fields={
        "title": serializers.ListField(child=serializers.CharField(), required=False),
        "writer": serializers.ListField(child=serializers.CharField(), required=False),
        "issued_date": serializers.ListField(
            child=serializers.CharField(), required=False
        ),
    },
)


@extend_schema_view(
    list=extend_schema(
        tags=["Books"],
        summary="Daftar buku",
        description=(
            "Mencari melalui judul atau penulis dengan `search`, mempersempit "
            "hasil dengan `writer` dan/atau `issued_date`, serta berpindah "
            "halaman dengan `page`. Filter penulis mencocokkan sebagian teks "
            "tanpa membedakan huruf besar/kecil; tanggal memakai format YYYY-MM-DD. "
            "Memerlukan token akses JWT."
        ),
        responses={
            200: BukuSerializer(many=True),
            401: OpenApiResponse(
                response=AuthenticationErrorResponse,
                description="Tidak ada kredensial autentikasi yang diberikan atau tidak valid.",
            ),
        },
    ),
    retrieve=extend_schema(
        tags=["Books"],
        summary="Mengambil satu buku",
        description="Mengembalikan satu buku berdasarkan ID. Memerlukan token akses JWT.",
        responses={
            200: BukuSerializer,
            401: OpenApiResponse(response=AuthenticationErrorResponse),
            404: OpenApiResponse(
                response=AuthenticationErrorResponse,
                description="Tidak ada buku yang cocok dengan ID yang diberikan.",
            ),
        },
    ),
    create=extend_schema(
        tags=["Books"],
        summary="Membuat data buku",
        description="Membuat data buku baru. Memerlukan token akses JWT.",
        responses={
            201: BukuSerializer,
            400: OpenApiResponse(
                response=ValidationErrorResponse,
                description="Data buku yang dikirim gagal validasi.",
            ),
            401: OpenApiResponse(response=AuthenticationErrorResponse),
        },
    ),
    update=extend_schema(
        tags=["Books"],
        summary="Mengganti data buku",
        description="Mengganti data buku yang dapat diedit. Memerlukan token akses JWT.",
        responses={
            200: BukuSerializer,
            400: OpenApiResponse(response=ValidationErrorResponse),
            401: OpenApiResponse(response=AuthenticationErrorResponse),
            404: OpenApiResponse(response=AuthenticationErrorResponse),
        },
    ),
    partial_update=extend_schema(
        tags=["Books"],
        summary="Memperbarui data buku",
        description="Memperbarui bidang-bidang buku yang dipilih. Memerlukan token akses JWT.",
        responses={
            200: BukuSerializer,
            400: OpenApiResponse(
                response=ValidationErrorResponse,
                description="Data buku yang dikirim gagal validasi. ",
            ),
            401: OpenApiResponse(response=AuthenticationErrorResponse),
            404: OpenApiResponse(
                response=AuthenticationErrorResponse,
                description="Tidak ada buku yang cocok dengan ID yang diberikan.",
            ),
        },
    ),
    destroy=extend_schema(
        tags=["Books"],
        summary="Menghapus data buku",
        description="Menghapus data buku berdasarkan ID. Memerlukan token akses JWT.",
        responses={
            204: OpenApiResponse(description="Buku berhasil dihapus."),
            401: OpenApiResponse(response=AuthenticationErrorResponse),
            404: OpenApiResponse(
                response=AuthenticationErrorResponse,
                description="Tidak ada buku yang cocok dengan ID yang diberikan.",
            ),
        },
    ),
)
class BukuViewSet(viewsets.ModelViewSet):
    queryset = Buku.objects.all().order_by("-created_at", "-id")
    serializer_class = BukuSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BukuPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ["title", "writer"]
    filterset_class = BukuFilter
