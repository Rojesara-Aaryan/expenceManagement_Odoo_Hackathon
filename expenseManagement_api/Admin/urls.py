from django.urls import path
from .views import EmployeeManagerCreateView

app_name = 'expense_management'

urlpatterns = [
    path('api/user/create/', EmployeeManagerCreateView.as_view(), name='employee-manager-create'),
]