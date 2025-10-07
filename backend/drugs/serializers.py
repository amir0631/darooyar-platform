# backend/drugs/serializers.py
# ورژن ۱.۴
# افزودن فیلد 'lot' به سریالایزر

from rest_framework import serializers
from .models import Drug

class DrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drug
        fields = [
            'id', 'generic_name', 'brand_name', 'dose', 'form', 
            'manufacturer', 'price', 'expiry_date', 'quantity', 'batch_number',
            'storage_conditions', 'owner', 'status', 'drug_type', 
            'created_at', 'updated_at', 'tracking_id', 
            'lot' # <-- فیلد کلیدی در اینجا اضافه شد
        ]
        # اطمینان حاصل کنید که 'lot' در read_only_fields نیست تا قابل نوشتن باشد
        read_only_fields = ('owner', 'created_at', 'updated_at', 'status', 'tracking_id')