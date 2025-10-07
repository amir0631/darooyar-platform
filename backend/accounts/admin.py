# backend/accounts/admin.py
# ورژن ۱.۱
# افزودن فیلدهای پروفایل جدید به پنل ادمین

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# یک کلاس ادمین سفارشی برای نمایش فیلدهای جدید ایجاد می‌کنیم
class CustomUserAdmin(UserAdmin):
    # افزودن فیلدهای جدید به نمای لیست برای دسترسی سریع
    list_display = (
        'username', 
        'email', 
        'first_name', 
        'last_name', 
        'is_staff',
        'address_loc', 
        'pharmacy_name'
    )

    # افزودن فیلدهای جدید به فرم ویرایش کاربر با ایجاد یک بخش جدید
    # ما fieldset های پیش‌فرض UserAdmin را گرفته و بخش سفارشی خود را به آن اضافه می‌کنیم
    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات تکمیلی داروخانه', {
            'fields': ('avatar', 'pharmacy_name', 'license_number', 'mobile_number', 'address_loc')
        }),
    )

# مدل User را با کلاس ادمین سفارشی خودمان ثبت می‌کنیم
admin.site.register(User, CustomUserAdmin)