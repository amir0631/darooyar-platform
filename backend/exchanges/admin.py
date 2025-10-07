# backend/exchanges/admin.py
# ورژن ۱.۰
# ثبت مدل درخواست تبادل و سفارشی‌سازی نمایش آن در پنل ادمین

from django.contrib import admin
from .models import ExchangeRequest

@admin.register(ExchangeRequest)
class ExchangeRequestAdmin(admin.ModelAdmin):
    """
    Customizes the display of the ExchangeRequest model in the Django admin.
    """
    list_display = ('id', 'drug', 'requester', 'status', 'created_at')
    list_filter = ('status', 'created_at')

    # بهبود تجربه کاربری برای انتخاب دارو و کاربر
    autocomplete_fields = ('drug', 'requester')