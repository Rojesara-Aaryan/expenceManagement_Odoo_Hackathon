from rest_framework.views import APIView
import requests
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import check_password
from .models import CustomUser, Company
from .serializers import LoginSerializer, CompanySerializer

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

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        country = request.data.get('country')

        if not name or not country:
            return Response({"error": "Company name and country are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Fetch country details
        try:
            response = requests.get("https://restcountries.com/v3.1/all?fields=name,currencies")
            response.raise_for_status()
            countries = response.json()
        except Exception as e:
            return Response({"error": f"Failed to fetch countries: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        currency_code = None
        for c in countries:
            if c.get("name", {}).get("common", "").lower() == country.lower():
                currencies = c.get("currencies", {})
                if currencies:
                    currency_code = list(currencies.keys())[0]
                break

        if not currency_code:
            return Response({"error": "Invalid country name or country not found."},
                            status=status.HTTP_400_BAD_REQUEST)


        company = Company.objects.create(
            name=name,
            country=country,
            currency=currency_code
        )

        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_201_CREATED)