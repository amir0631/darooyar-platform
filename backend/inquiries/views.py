# backend/inquiries/views.py
from rest_framework import viewsets, permissions
from .models import DrugInquiry
from .serializers import DrugInquirySerializer

class DrugInquiryViewSet(viewsets.ModelViewSet):
    serializer_class = DrugInquirySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = DrugInquiry.objects.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)