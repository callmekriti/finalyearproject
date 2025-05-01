from django.db import models
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer

# Model
class Trainer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Class(models.Model):
    """
    Represents a class offered, with details like trainer, timing, and capacity.
    """
    id = models.AutoField(primary_key=True)  # Explicitly define and auto-increment the ID
    name = models.CharField(max_length=255,default="Gym")     
    trainer_id = models.ForeignKey('Trainer', on_delete=models.CASCADE, related_name='classes')
    timing = models.DateTimeField()  

    def __str__(self):
        """
        Returns a string representation of the class (e.g., for display in the Django admin).
        """
        return f"Class ID: {self.id}, Name: {self.name},Trainer: {self.trainer_id}, Timing: {self.timing}"

    class Meta:
        verbose_name = "Class"
        verbose_name_plural = "Classes"
        ordering = ['timing'] 