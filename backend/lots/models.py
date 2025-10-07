from django.db import models

# Create your models here.
# backend/lots/models.py
from django.db import models
from django.conf import settings

class DrugLot(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='drug_lots', verbose_name="ایجاد کننده بسته")
    title = models.CharField(max_length=255, verbose_name="عنوان بسته")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات")
    is_active = models.BooleanField(default=True, verbose_name="فعال")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "بسته دارویی"
        verbose_name_plural = "بسته‌های دارویی"