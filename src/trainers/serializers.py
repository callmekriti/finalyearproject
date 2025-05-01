from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Trainer,Class


class TrainerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Trainer
        fields = ['id','name', 'email', 'salary', 'type', 'password']

class ClassSerializer(serializers.ModelSerializer):
    trainer_id = serializers.PrimaryKeyRelatedField(queryset=Trainer.objects.all()) # Allow the trainer to be set by ID

    class Meta:
        model = Class
        fields = ['id','name' ,'trainer_id', 'timing']
        #read_only_fields = ['id'] #make id read-only