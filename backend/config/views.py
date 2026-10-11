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
    """Issue a JWT access/refresh pair from username and password."""

    @extend_schema(
        operation_id="token_obtain_pair",
        tags=["Authentication"],
        summary="Obtain JWT tokens",
        description=(
            "Submit valid account credentials to receive an access token and "
            "a refresh token. Use the access token as a Bearer token for "
            "Books endpoints. This endpoint does not require authentication."
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
                description="Required credential fields are missing or malformed.",
            ),
            401: OpenApiResponse(
                response=TokenErrorResponse,
                description="The credentials are invalid or the account is inactive.",
            ),
        },
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class DocumentedTokenRefreshView(TokenRefreshView):
    """Issue a new access token from a valid refresh token."""

    @extend_schema(
        operation_id="token_refresh",
        tags=["Authentication"],
        summary="Refresh JWT access token",
        description=(
            "Submit a valid refresh token to receive a new access token. "
            "This endpoint does not require an access token."
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
                description="The refresh field is missing or malformed.",
            ),
            401: OpenApiResponse(
                response=TokenErrorResponse,
                description="The refresh token is invalid, expired, or revoked.",
            ),
        },
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
