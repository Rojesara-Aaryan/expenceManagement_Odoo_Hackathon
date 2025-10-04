from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password
from .models import CustomUser  # Replace 'core' with your app name
from .serializers import LoginSerializer

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        try:
            user = CustomUser.objects.get(email=email, status=True, isDelete=False)
            if check_password(password, user.password):  # Handles hashed password verification
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user_id': str(user.userId),
                    'role': user.role,
                    'company_id': str(user.companyId.companyId),
                    'message': 'Login successful'
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found or inactive'}, status=status.HTTP_400_BAD_REQUEST)