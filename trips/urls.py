from django.urls import path, include
from rest_framework.routers import DefaultRouter
from trips.views import TripViewSet, home
from .views import get_route, get_trip_logs

router = DefaultRouter()
router.register(r'trips', TripViewSet)

urlpatterns = [
	path('', home, name='home'),
    path('api/', include(router.urls)),
    path('api/get_route/', get_route, name="get_route"),
    path("api/trip-logs/<int:trip_id>/", get_trip_logs, name="trip_logs"),
]
urlpatterns += router.urls  # ✅ Ensures all API endpoints are included
