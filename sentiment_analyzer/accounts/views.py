from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import CustomUserSerializer  # Import the serializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import CustomUser

@api_view(['POST'])
def register(request):
    print("Request data:", request.data)
    if request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        email = request.data.get('email')
        username = request.data.get('username')

        # Check if email or username is already taken
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "This email is already registered."}, status=status.HTTP_400_BAD_REQUEST)
        
        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "This username is already taken."}, status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        # Generate a token if the user is authenticated
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
