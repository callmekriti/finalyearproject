from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainerViewSet,ClassViewSet

router = DefaultRouter()
router.register(r'trainers', TrainerViewSet, basename='trainer')
router.register(r'classes', ClassViewSet, basename='class')
urlpatterns = [
    path('', include(router.urls)),
]
