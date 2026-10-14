import django_filters

from .models import Buku


class BukuFilter(django_filters.FilterSet):
    writer = django_filters.CharFilter(field_name="writer", lookup_expr="icontains")
    issued_date = django_filters.DateFilter(field_name="issued_date")

    class Meta:
        model = Buku
        fields = ["writer", "issued_date"]
