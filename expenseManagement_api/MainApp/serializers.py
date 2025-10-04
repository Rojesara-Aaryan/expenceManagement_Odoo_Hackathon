from rest_framework import serializers
from .models import Company,CustomUser

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['companyId', 'name', 'country', 'currency', 'created_at']
        read_only_fields = ['companyId', 'created_at', 'currency']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['userId', 'email', 'password', 'name', 'contactNo','contactNo']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)