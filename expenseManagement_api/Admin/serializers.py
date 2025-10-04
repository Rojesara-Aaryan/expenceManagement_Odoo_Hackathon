from rest_framework import serializers
from MainApp.models import Company, CustomUser
from django.contrib.auth.hashers import make_password

class CustomUserSerializer(serializers.ModelSerializer):
    companyId = serializers.UUIDField()
    managerId = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = ['userId', 'email', 'password', 'name', 'contactNo', 'companyId', 'role', 'managerId']
        read_only_fields = ['userId']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_companyId(self, value):
        if not Company.objects.filter(companyId=value, isDelete=False).exists():
            raise serializers.ValidationError("Company does not exist")
        return value

    def validate_managerId(self, value):
        if value:
            if not CustomUser.objects.filter(userId=value, role__in=['manager', 'admin'], isDelete=False).exists():
                raise serializers.ValidationError("Manager must be a valid manager or admin")
        return value

    def validate_role(self, value):
        if value not in ['employee', 'manager']:
            raise serializers.ValidationError("Role must be 'employee' or 'manager'")
        return value

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value, isDelete=False).exists():
            raise serializers.ValidationError("Email is already in use")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['username'] = validated_data['email']  # Use email as username
        manager_id = validated_data.pop('managerId', None)
        user = CustomUser.objects.create(**validated_data)
        if manager_id:
            user.manager = CustomUser.objects.get(userId=manager_id)
            user.save()
        return user