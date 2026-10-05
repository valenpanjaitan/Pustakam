from django.db import models

# Create your models here.
class Buku(models.Model):
  title = models.CharField(max_length=200)
  writer = models.CharField(max_length=200, blank=True, null=True)
  issued_date = models.DateField(default=None, blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title