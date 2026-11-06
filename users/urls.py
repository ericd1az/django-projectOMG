from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import UserApiViewSet, UserView


router = DefaultRouter()
router.register('users', UserApiViewSet, basename='users')

urlpatterns = [
    path('auth/me/', UserView.as_view(), name='auth-me'),
    path('auth/token/', TokenObtainPairView.as_view(), name='auth-token'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='auth-token-refresh'),
    path('', include(router.urls)),
]
