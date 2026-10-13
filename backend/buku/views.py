from rest_framework import filters, serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import (
    OpenApiResponse,
    extend_schema,
    extend_schema_view,
    inline_serializer,
)

from .models import Buku
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
        summary="List books",
        description=(
            "Return one page of the book collection. Use `search` to match "
            "book titles and writers, and `page` to move through the matching "
            "results. Requires a JWT access token."
        ),
        responses={
            200: BukuSerializer(many=True),
            401: OpenApiResponse(
                response=AuthenticationErrorResponse,
                description="Authentication credentials were not provided or invalid.",
            ),
        },
    ),
    retrieve=extend_schema(
        tags=["Books"],
        summary="Get a book",
        description="Return one book by its database ID. Requires a JWT access token.",
        responses={
            200: BukuSerializer,
            401: OpenApiResponse(response=AuthenticationErrorResponse),
            404: OpenApiResponse(
                response=AuthenticationErrorResponse,
                description="No book exists with this ID.",
            ),
        },
    ),
    create=extend_schema(
        tags=["Books"],
        summary="Create a book",
        description="Create a book. Requires a JWT access token.",
        responses={
            201: BukuSerializer,
            400: OpenApiResponse(
                response=ValidationErrorResponse,
                description="The submitted book data failed validation.",
            ),
            401: OpenApiResponse(response=AuthenticationErrorResponse),
        },
    ),
    update=extend_schema(
        tags=["Books"],
        summary="Replace a book",
        description="Replace a book's editable fields. Requires a JWT access token.",
        responses={
            200: BukuSerializer,
            400: OpenApiResponse(response=ValidationErrorResponse),
            401: OpenApiResponse(response=AuthenticationErrorResponse),
            404: OpenApiResponse(response=AuthenticationErrorResponse),
        },
    ),
    partial_update=extend_schema(
        tags=["Books"],
        summary="Update a book",
        description="Update selected book fields. Requires a JWT access token.",
        responses={
            200: BukuSerializer,
            400: OpenApiResponse(
                response=ValidationErrorResponse,
                description="The submitted book data failed validation.",
            ),
            401: OpenApiResponse(response=AuthenticationErrorResponse),
            404: OpenApiResponse(
                response=AuthenticationErrorResponse,
                description="No book exists with this ID.",
            ),
        },
    ),
    destroy=extend_schema(
        tags=["Books"],
        summary="Delete a book",
        description="Delete a book by its database ID. Requires a JWT access token.",
        responses={
            204: OpenApiResponse(description="The book was deleted."),
            401: OpenApiResponse(response=AuthenticationErrorResponse),
            404: OpenApiResponse(
                response=AuthenticationErrorResponse,
                description="No book exists with this ID.",
            ),
        },
    ),
)
class BukuViewSet(viewsets.ModelViewSet):
    queryset = Buku.objects.all().order_by("-created_at", "-id")
    serializer_class = BukuSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BukuPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "writer"]
