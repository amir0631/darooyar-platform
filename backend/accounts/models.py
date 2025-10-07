# backend/accounts/models.py
# ورژن ۱.۲
# افزودن فیلدهای پروفایل تکمیلی به مدل User

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    avatar = models.CharField(max_length=50, blank=True, null=True, default='avatar1')
    # --- فیلدهای جدید ---
    pharmacy_name = models.CharField(max_length=255, blank=True, null=True, verbose_name="نام داروخانه")
    license_number = models.CharField(max_length=100, blank=True, null=True, verbose_name="شماره پروانه")
    mobile_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="شماره موبایل")
    address_loc = models.CharField(max_length=255, blank=True, null=True, verbose_name="آدرس")
    # --------------------
    pass