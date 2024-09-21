# reviews/urls.py

from django.urls import path
from .views import submit_review, get_reviews

urlpatterns = [
    path('submit', submit_review, name='submit-review'),
    path('reviews', get_reviews, name='get-reviews'),
]
