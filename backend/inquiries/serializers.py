# backend/inquiries/serializers.py
from rest_framework import serializers
from .models import DrugInquiry

class DrugInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = DrugInquiry
        fields = '__all__'
        read_only_fields = ('requester',)