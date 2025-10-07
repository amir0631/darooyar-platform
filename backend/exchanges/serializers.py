# backend/exchanges/serializers.py
# ورژن ۱.۰
# ایجاد Serializer برای مدل ExchangeRequest

from rest_framework import serializers
from .models import ExchangeRequest

class ExchangeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRequest
        fields = '__all__'
        # کاربر هنگام ایجاد درخواست، نباید بتواند این فیلدها را مستقیماً تغییر دهد
        read_only_fields = ('requester', 'status', 'created_at', 'updated_at')