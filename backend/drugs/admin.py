# backend/drugs/admin.py
# ورژن ۱.۰
# ثبت مدل دارو و سفارشی‌سازی نمایش آن در پنل ادمین

from django.contrib import admin
from .models import Drug

@admin.register(Drug)
class DrugAdmin(admin.ModelAdmin):
    """
    Customizes the display of the Drug model in the Django admin panel.
    """
    list_display = ('brand_name', 'generic_name', 'owner', 'status', 'expiry_date', 'quantity')
    list_filter = ('status', 'owner', 'expiry_date')
    search_fields = ('brand_name', 'generic_name', 'batch_number')
    ordering = ('-created_at',)