from rest_framework import serializers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.utils import OpenApiResponse, extend_schema, inline_serializer


TokenErrorResponse = inline_serializer(
    name="TokenErrorResponse",
    fields={
        "detail": serializers.CharField(),
        "code": serializers.CharField(required=False),
    },
)


class DocumentedTokenObtainPairView(TokenObtainPairView):
    """Mengembalikan access token dan refresh token baru."""

    @extend_schema(
        operation_id="token_obtain_pair",
        tags=["Authentication"],
        summary="Mengambil token JWT.",
        description=(
            "Tambahkan kredensial akun yang valid untuk menerima token akses dan"
            "token penyegaran. Gunakan token akses sebagai token Bearer untuk"
            "endpoint Buku. Endpoint ini tidak memerlukan autentikasi."
        ),
        request=inline_serializer(
            name="TokenObtainRequest",
            fields={
                "username": serializers.CharField(),
                "password": serializers.CharField(write_only=True),
            },
        ),
        responses={
            200: inline_serializer(
                name="TokenPairResponse",
                fields={
                    "access": serializers.CharField(),
                    "refresh": serializers.CharField(),
                },
            ),
            400: OpenApiResponse(
                response=TokenErrorResponse,
                description="Kredensial yang diperlukan tidak ada atau tidak valid.",
            ),
            401: OpenApiResponse(
                response=TokenErrorResponse,
                description="Kredensial tidak valid atau akun tidak aktif.",
            ),
        },
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class DocumentedTokenRefreshView(TokenRefreshView):
    """Mengembalikan access token baru dari refresh token yang valid."""

    @extend_schema(
        operation_id="token_refresh",
        tags=["Authentication"],
        summary="Memperbarui access token JWT.",
        description=(
            "Menggirim refresh token yang valid untuk menerima access token baru."
            "Gunakan access token sebagai Bearer token untuk endpoint Buku."
        ),
        request=inline_serializer(
            name="TokenRefreshRequest",
            fields={"refresh": serializers.CharField()},
        ),
        responses={
            200: inline_serializer(
                name="TokenRefreshResponse",
                fields={"access": serializers.CharField()},
            ),
            400: OpenApiResponse(
                response=TokenErrorResponse,
                description="Bagian refresh tidak ada atau tidak valid.",
            ),
            401: OpenApiResponse(
                response=TokenErrorResponse,
                description="Token penyegaran tidak valid, kedaluwarsa, atau ditarik.",
            ),
        },
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
