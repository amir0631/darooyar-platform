# backend/exchanges/models.py
# ورژن ۱.۰
# تعریف مدل داده‌ای برای درخواست تبادل دارو

from django.db import models
from django.conf import settings
from drugs.models import Drug

class ExchangeRequest(models.Model):
    # وضعیت درخواست در پلتفرم
    class RequestStatus(models.TextChoices):
        PENDING = 'pending', 'در انتظار بررسی'
        ACCEPTED = 'accepted', 'پذیرفته شده'
        REJECTED = 'rejected', 'رد شده'
        COMPLETED = 'completed', 'تکمیل شده'

    # داروی مورد درخواست
    drug = models.ForeignKey(
        Drug,
        on_delete=models.CASCADE,
        related_name='requests',
        verbose_name="داروی مورد درخواست"
    )
    # کاربری که درخواست را ثبت کرده
    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='made_requests',
        verbose_name="کاربر درخواست دهنده"
    )

    quantity_requested = models.PositiveIntegerField(verbose_name="تعداد درخواستی")
    notes = models.TextField(blank=True, null=True, verbose_name="یادداشت")

    status = models.CharField(
        max_length=10,
        choices=RequestStatus.choices,
        default=RequestStatus.PENDING,
        verbose_name="وضعیت درخواست"
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت درخواست")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین به‌روزرسانی")

    def __str__(self):
        return f"درخواست برای {self.drug.brand_name} توسط {self.requester.username}"

    class Meta:
        verbose_name = "درخواست تبادل"
        verbose_name_plural = "درخواست‌های تبادل"
        ordering = ['-created_at']