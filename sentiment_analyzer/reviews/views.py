from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer
from textblob import TextBlob
from django.db.models import Count


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


from rest_framework.pagination import PageNumberPagination

class ReviewPagination(PageNumberPagination):
    page_size = 5  # Number of reviews per page
    page_size_query_param = 'page_size'
    max_page_size = 10

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reviews(request):
    reviews = Review.objects.filter(user=request.user.id) 
    paginator = ReviewPagination()
    paginated_reviews = paginator.paginate_queryset(reviews, request)
    serializer = ReviewSerializer(paginated_reviews, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def review_statistics(request):
    
    sentiment_counts = (
        Review.objects.filter(user=request.user.id)
        .values('sentiment')
        .annotate(count=Count('id'))
    )


    movie_counts = (
        Review.objects.filter(user=request.user.id)
        .values('movie_title')
        .annotate(count=Count('id'))
        .order_by('-count')[:2] 
    )

    return Response({
        'sentiment_counts': list(sentiment_counts),
        'movie_counts': list(movie_counts),
    })