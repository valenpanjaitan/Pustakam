from rest_framework import serializers
from .models import Buku

class BukuSerializer(serializers.ModelSerializer):
  class Meta:
    model = Buku
    fields = '__all__'