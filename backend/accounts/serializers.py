# backend/accounts/serializers.py
# ورژن ۱.۰
# ایجاد سریالایزر سفارشی برای افزودن تعداد درخواست‌های در حال انتظار

# backend/accounts/serializers.py
from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer
from exchanges.models import ExchangeRequest

class CustomUserDetailsSerializer(UserDetailsSerializer):
    pending_requests_count = serializers.SerializerMethodField()

    class Meta(UserDetailsSerializer.Meta):
        # افزودن فیلدهای جدید به لیست
        fields = UserDetailsSerializer.Meta.fields + (
            'avatar', 'pending_requests_count', 'pharmacy_name', 
            'license_number', 'mobile_number', 'address_loc'
        )
        # اجازه ویرایش به تمام فیلدها به جز ایمیل و نام کاربری
        read_only_fields = ('email', 'username')


    def get_pending_requests_count(self, obj):
        return ExchangeRequest.objects.filter(
            drug__owner=obj,
            status=ExchangeRequest.RequestStatus.PENDING
        ).count()