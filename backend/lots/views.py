# backend/lots/views.py
# ورژن ۱.۰
# ایجاد ViewSet برای بسته‌های دارویی

from rest_framework import viewsets, permissions
from .models import DrugLot
from .serializers import DrugLotSerializer
# TODO: Create and import IsCreatorOrReadOnly permission

class DrugLotViewSet(viewsets.ModelViewSet):
    queryset = DrugLot.objects.filter(is_active=True)
    serializer_class = DrugLotSerializer
    permission_classes = [permissions.IsAuthenticated] # TODO: Add IsCreatorOrReadOnly

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)