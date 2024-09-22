from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer
from textblob import TextBlob


@api_view(['POST'])
@permission_classes([IsAuthenticated])  
def submit_review(request):
    if request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            
            review_content = serializer.validated_data['content']
            
            
            blob = TextBlob(review_content)
            sentiment_score = blob.sentiment.polarity

            
            if sentiment_score > 0:
                sentiment = 'positive'
            elif sentiment_score < 0:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'

            
            serializer.save(user=request.user, sentiment=sentiment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reviews(request):
    reviews = Review.objects.filter(user=request.user.id) 
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)