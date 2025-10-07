# backend/lots/serializers.py
# ورژن ۱.۰
# ایجاد سریالایزر برای بسته‌های دارویی

from rest_framework import serializers
from drugs.serializers import DrugSerializer # سریالایزر دارو را ایمپورت می‌کنیم
from .models import DrugLot

class DrugLotSerializer(serializers.ModelSerializer):
    # این فیلد، لیست تمام داروهای مرتبط با این بسته را نمایش می‌دهد
    drugs = DrugSerializer(many=True, read_only=True)

    class Meta:
        model = DrugLot
        fields = ['id', 'creator', 'title', 'description', 'is_active', 'created_at', 'drugs']
        read_only_fields = ('creator',)