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
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            return data
        raise serializers.ValidationError("Email and password are required.")