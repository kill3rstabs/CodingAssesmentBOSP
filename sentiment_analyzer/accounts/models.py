# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # You can add custom fields here
    pass

    def __str__(self):
        return self.username
