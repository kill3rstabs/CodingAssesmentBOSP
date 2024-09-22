from django.urls import path
from .views import submit_review, get_reviews, review_statistics
urlpatterns = [
    path('submit', submit_review, name='submit-review'),
    path('reviews', get_reviews, name='get-reviews'),
    path('statistics', review_statistics, name='review-statistics'),
]
