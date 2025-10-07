# backend/drugs/views.py
# Corrected Version

from rest_framework import viewsets, permissions, status
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from .models import Drug
from .serializers import DrugSerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from lots.models import DrugLot
from lots.serializers import DrugLotSerializer


class NetworkItemsView(APIView):
    """
    این نما، لیستی ترکیبی از داروهای تکی و بسته‌های دارویی را برمی‌گرداند.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # دریافت تمام داروهای تکی (که در بسته‌ای نیستند)
        single_drugs = Drug.objects.filter(status=Drug.DrugStatus.AVAILABLE, lot__isnull=True)

        # دریافت تمام بسته‌های فعال
        lots = DrugLot.objects.filter(is_active=True).prefetch_related('drugs')

        # سریالایز کردن داده‌ها
        single_drugs_data = DrugSerializer(single_drugs, many=True).data
        lots_data = DrugLotSerializer(lots, many=True).data

        response_data = []
        for drug_data in single_drugs_data:
            response_data.append({'type': 'drug', **drug_data})

        for lot_data in lots_data:
            response_data.append({'type': 'lot', **lot_data})

        return Response(response_data)


class DrugViewSet(viewsets.ModelViewSet):
    queryset = Drug.objects.filter(status=Drug.DrugStatus.AVAILABLE)
    serializer_class = DrugSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ['drug_type']
    ordering_fields = ['created_at', 'quantity']
    search_fields = ['brand_name', 'generic_name', 'manufacturer']
    ordering = ['-created_at']

    def create(self, request, *args, **kwargs):
        """
        This overridden method handles both single and list-based (bulk) creation.
        """
        is_many = isinstance(request.data, list)
        if not is_many:
            # If data is a single object, proceed as normal.
            return super().create(request, *args, **kwargs)

        # If data is a list, use the serializer with many=True.
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        # This method now works for both single and bulk saves.
        serializer.save(owner=self.request.user)