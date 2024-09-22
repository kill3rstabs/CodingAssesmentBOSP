# reviews/serializers.py

from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'movie_title', 'content', 'sentiment', 'created_at']
        
    def validate(self, data):
        if not isinstance(data.get('movie_title', ''), str):
            raise serializers.ValidationError({"movie_title": "Movie title must be a string."})
        
        if not isinstance(data.get('content', ''), str):
            raise serializers.ValidationError({"content": "Content must be a string."})

        return data
