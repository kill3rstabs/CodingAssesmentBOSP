from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer
from textblob import TextBlob

# Submit a new review (only for authenticated users)
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Enforce that only authenticated users can access
def submit_review(request):
    if request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            # Extract the review content
            review_content = serializer.validated_data['content']
            
            # Calculate sentiment using TextBlob
            blob = TextBlob(review_content)
            sentiment_score = blob.sentiment.polarity

            # Determine sentiment label based on polarity
            if sentiment_score > 0:
                sentiment = 'positive'
            elif sentiment_score < 0:
                sentiment = 'negative'
            else:
                sentiment = 'neutral'

            # Save the review along with the sentiment
            serializer.save(user=request.user, sentiment=sentiment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get the logged-in user's reviews (only their own reviews)
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Enforce that only authenticated users can access
def get_reviews(request):
    reviews = Review.objects.filter(user=request.user)  # Filter reviews to only the ones submitted by the logged-in user
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)