# backend/backend/urls.py
# ورژن ۱.۵
# بازگرداندن URL ها به حالت توسعه محلی

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drugs.views import DrugViewSet
from exchanges.views import ExchangeRequestViewSet
from inquiries.views import DrugInquiryViewSet
from lots.views import DrugLotViewSet
from drugs.views import NetworkItemsView

router = DefaultRouter()
router.register(r'drugs', DrugViewSet, basename='drug')
router.register(r'exchanges', ExchangeRequestViewSet, basename='exchange')
router.register(r'inquiries', DrugInquiryViewSet, basename='inquiry')
router.register(r'lots', DrugLotViewSet, basename='lot')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/network-items/', NetworkItemsView.as_view(), name='network-items'), 
    path('api/', include(router.urls)),
]