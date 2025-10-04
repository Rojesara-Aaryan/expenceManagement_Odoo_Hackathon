from rest_framework.views import APIView
import requests
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password
from .models import CustomUser, Company
from .serializers import LoginSerializer, CompanySerializer,UserSerializer

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
        

class CompanySignupView(generics.CreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        country = request.data.get('country')
        currency = request.data.get('currency') 
        if not name or not country or not currency:
            return Response({"error": "Company name and country are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        company = Company.objects.create(
            name=name,
            country=country,
            currency=currency
        )

        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserSignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()  # Fix: Use CustomUser instead of Company
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password') 
        contactNo = request.data.get('contactNo')
        companyId = request.data.get('companyId')

        if not name or not email or not password or not contactNo or not companyId:
            return Response({"error": "All fields are required."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        company = Company.objects.get(companyId=companyId)
        user = CustomUser.objects.create(
            name=name,
            email=email,
            password=password,  # Note: Password should be hashed (see below)
            contactNo=contactNo,
            companyId=companyId,
            role='Admin'
        )

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(request=request, email=email, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': str(user.userId),
                'username': user.username
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)