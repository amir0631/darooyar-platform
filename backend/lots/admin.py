# backend/lots/admin.py
# ورژن ۱.۰
# ثبت مدل DrugLot و نمایش داروهای مرتبط در پنل ادمین

from django.contrib import admin
from .models import DrugLot
from drugs.models import Drug

# این کلاس به ما اجازه می‌دهد داروها را مستقیماً در صفحه بسته ویرایش کنیم
class DrugInline(admin.TabularInline):
    model = Drug
    extra = 0 # تعداد ردیف خالی برای افزودن داروی جدید
    fields = ('brand_name', 'generic_name', 'quantity', 'price')
    readonly_fields = ('brand_name', 'generic_name', 'quantity', 'price')
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False

@admin.register(DrugLot)
class DrugLotAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'created_at', 'is_active')
    inlines = [DrugInline] # نمایش داروهای مرتبط در همان صفحه