from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, DueViewSet 

app_name = 'events'
router = DefaultRouter()
router.register(r'events', EventViewSet , basename='event')
router.register(r'dues', DueViewSet , basename='due')

urlpatterns = [
    path('', include(router.urls)),
]
