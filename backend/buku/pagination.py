from rest_framework.pagination import PageNumberPagination


class BukuPagination(PageNumberPagination):
    """Return a bounded page of books with standard DRF navigation links."""

    page_size = 10
