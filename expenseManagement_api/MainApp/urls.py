from django.urls import path
from .views import login_view,CompanySignupView,UserSignupView

app_name = 'main_app'

urlpatterns = [
    path('api/user/auth/', login_view, name='Auth-User'),
    path('api/add/company', CompanySignupView.as_view(), name='company-signup'),
    path('api/add/user', UserSignupView.as_view(), name='User-signup'),
]