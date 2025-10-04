from django.urls import path
from .views import LoginView

app_name = 'main_app'

urlpatterns = [
    path('api/user/auth/', LoginView.as_view(), name='Auth-User'),
]