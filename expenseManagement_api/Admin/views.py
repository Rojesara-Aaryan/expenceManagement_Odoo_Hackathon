from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUserSerializer

class EmployeeManagerCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Restrict to admin users
        if request.user.role != 'admin':
            return Response({"error": "Only admins can create employees or managers"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)