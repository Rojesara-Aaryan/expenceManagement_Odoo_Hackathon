from django.urls import path
from .views import LoginView,CompanySignupView

app_name = 'main_app'

urlpatterns = [
    path('api/user/auth/', LoginView.as_view(), name='Auth-User'),
    path('signup/', CompanySignupView.as_view(), name='company-signup'),
]