# backend/exchanges/views.py
# ورژن ۱.۲
# افزودن منطق کسر موجودی دارو هنگام پذیرش درخواست

from django.db import transaction # <-- ایمپورت کردن ترنزاکشن
from django.db.models import Q
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ExchangeRequest
from .serializers import ExchangeRequestSerializer
from drugs.models import Drug # <-- ایمپورت کردن مدل Drug

class ExchangeRequestViewSet(viewsets.ModelViewSet):
    # ... (serializer_class, permission_classes, get_queryset, perform_create remain the same) ...
    serializer_class = ExchangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ExchangeRequest.objects.filter(
            Q(requester=user) | Q(drug__owner=user)
        ).distinct().select_related('drug', 'requester')

    def perform_create(self, serializer):
        # TODO: Add validation
        serializer.save(requester=self.request.user)


    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        with transaction.atomic(): # <-- شروع ترنزاکشن
            exchange_request = self.get_object()
            user = request.user
            new_status = request.data.get('status')
            drug = exchange_request.drug

            # Check if the user is the owner of the drug
            if drug.owner != user:
                return Response({'error': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

            # Only pending requests can be updated
            if exchange_request.status != ExchangeRequest.RequestStatus.PENDING:
                return Response({'error': 'This request has already been processed.'}, status=status.HTTP_400_BAD_REQUEST)

            valid_statuses = [ExchangeRequest.RequestStatus.ACCEPTED, ExchangeRequest.RequestStatus.REJECTED]
            if new_status not in valid_statuses:
                return Response({'error': 'Invalid status update.'}, status=status.HTTP_400_BAD_REQUEST)

            if new_status == ExchangeRequest.RequestStatus.ACCEPTED:
                # Check if there is enough quantity
                if drug.quantity < exchange_request.quantity_requested:
                    return Response({'error': 'Not enough quantity available.'}, status=status.HTTP_400_BAD_REQUEST)

                # Decrease drug quantity
                drug.quantity -= exchange_request.quantity_requested
                # If quantity becomes zero, mark drug as exchanged
                if drug.quantity == 0:
                    drug.status = Drug.DrugStatus.EXCHANGED
                drug.save()

            exchange_request.status = new_status
            exchange_request.save()
            serializer = self.get_serializer(exchange_request)
            return Response(serializer.data)