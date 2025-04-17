from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, MembershipTypeViewSet,AttendanceViewSet
from rest_framework.authtoken.views import obtain_auth_token

# Create a router and register the viewsets
router = DefaultRouter()

# Register MemberViewSet
router.register(r'members', MemberViewSet, basename='member')
router.register(r'attendance',AttendanceViewSet,basename="attendance")

# Register MembershipTypeViewSet
router.register(r'membershipTypes', MembershipTypeViewSet, basename='membership-type')

urlpatterns = [
    # Token authentication endpoint
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('attendance/get_by_username/', AttendanceViewSet.as_view({'get': 'get_by_user'}), name='attendance-get-by-username'),
    # Include all router-generated URLs
    path('', include(router.urls)),
]
