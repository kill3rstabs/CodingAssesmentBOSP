# accounts/serializers.py

from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}  # Ensure password is write-only
        }

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user
    def validate(self, data):
        """
        Validate the input data to ensure it meets requirements.
        """
        required_fields = ['username', 'password', 'email']
        for field in required_fields:
            if field not in data:
                raise serializers.ValidationError({field: f"{field} is required."})

        # Validate data types
        if not isinstance(data['username'], str):
            raise serializers.ValidationError({'username': 'Must be a string.'})
        if not isinstance(data['password'], str):
            raise serializers.ValidationError({'password': 'Must be a string.'})
        if not isinstance(data['email'], str):
            raise serializers.ValidationError({'email': 'Must be a string.'})

        return data

