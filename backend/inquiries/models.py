# backend/inquiries/models.py
from django.db import models
from django.conf import settings

class DrugInquiry(models.Model):
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="کاربر درخواست دهنده")
    brand_name = models.CharField(max_length=255, verbose_name="نام تجاری")
    generic_name = models.CharField(max_length=255, verbose_name="نام ژنریک")
    dose = models.CharField(max_length=100, verbose_name="دوز")
    form = models.CharField(max_length=100, verbose_name="شکل دارویی")
    quantity_needed = models.PositiveIntegerField(verbose_name="تعداد مورد نیاز")
    is_active = models.BooleanField(default=True, verbose_name="فعال/در جریان")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"درخواست برای {self.brand_name} توسط {self.requester.username}"