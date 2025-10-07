# backend/drugs/models.py
# ورژن ۱.۰
# تعریف مدل داده‌ای برای دارو (Drug)

from django.db import models
from django.conf import settings
import random
from lots.models import DrugLot

def generate_unique_tracking_id():
    """
    یک شناسه ۵ رقمی منحصر به فرد تولید می‌کند.
    """
    while True:
        tracking_id = random.randint(10000, 99999)
        if not Drug.objects.filter(tracking_id=tracking_id).exists():
            return tracking_id

class Drug(models.Model):
    # وضعیت دارو در پلتفرم
    class DrugStatus(models.TextChoices):
        AVAILABLE = 'available', 'موجود'
        RESERVED = 'reserved', 'رزرو شده'
        EXCHANGED = 'exchanged', 'تبادل شده'
        
    class DrugType(models.TextChoices):
        SURPLUS = 'surplus', 'مازاد'
        NEAR_EXPIRY = 'near_expiry', 'نزدیک به انقضا'

    # اطلاعات اصلی دارو - مطابق با منشور
    generic_name = models.CharField(max_length=255, verbose_name="نام ژنریک")
    brand_name = models.CharField(max_length=255, verbose_name="نام تجاری")
    dose = models.CharField(max_length=100, verbose_name="دوز")
    form = models.CharField(max_length=100, verbose_name="شکل دارویی", help_text="مثال: قرص، کپسول، شربت")
    manufacturer = models.CharField(max_length=255, verbose_name="شرکت سازنده")
    price = models.DecimalField(max_digits=10, decimal_places=0, default=0, verbose_name="مبلغ (تومان)")
    

    # اطلاعات موجودی و انقضا
    expiry_date = models.DateField(verbose_name="تاریخ انقضا")
    quantity = models.PositiveIntegerField(verbose_name="تعداد موجودی")
    batch_number = models.CharField(max_length=100, verbose_name="شماره بچ (Batch Number)")

    # سایر اطلاعات
    storage_conditions = models.TextField(blank=True, null=True, verbose_name="شرایط نگهداری")

    # اطلاعات سیستمی
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='drugs',
        verbose_name="مرکز ثبت کننده"
    )
    status = models.CharField(
        max_length=10,
        choices=DrugStatus.choices,
        default=DrugStatus.AVAILABLE,
        verbose_name="وضعیت"
    )

    drug_type = models.CharField(
        max_length=20,
        choices=DrugType.choices,
        default=DrugType.SURPLUS,
        verbose_name="نوع دارو"
    
    )

    tracking_id = models.CharField(
        max_length=5,
        unique=True,
        blank=True, # اجازه می‌دهیم هنگام ساخت خالی باشد
        editable=False,
        verbose_name="شناسه پیگیری"
    )

    lot = models.ForeignKey(
        DrugLot,
        on_delete=models.CASCADE,
        related_name='drugs',
        null=True, # این دارو می‌تواند بخشی از یک بسته نباشد
        blank=True,
        verbose_name="بسته دارویی"
    )



    

    def save(self, *args, **kwargs):
        # اگر آبجکت جدید است و شناسه ندارد، یکی برایش بساز
        if not self.tracking_id:
            self.tracking_id = generate_unique_tracking_id()
        super().save(*args, **kwargs)

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="آخرین به‌روزرسانی")

    def __str__(self):
        return f"{self.brand_name} ({self.generic_name}) - {self.dose}"

    class Meta:
        verbose_name = "دارو"
        verbose_name_plural = "داروها"
        ordering = ['-created_at']

    
