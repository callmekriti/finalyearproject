from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Trainer,Class


class TrainerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Trainer
        fields = ['id','name', 'email', 'salary', 'type', 'password']

class ClassSerializer(serializers.ModelSerializer):
    trainer_id = TrainerSerializer(read_only=True)  # SerializerMethodField(read_only=True)  # Read-only representation of the trainer
    trainer_id_id = serializers.PrimaryKeyRelatedField(queryset=Trainer.objects.all(), source='trainer_id', write_only=True)  # Allows setting the trainer by ID

    class Meta:
        model = Class
        fields = ['id', 'trainer_id', 'timing', 'capacity', 'trainer_id_id']  # List all fields
        #read_only_fields = ['id'] #make id read-only

    def create(self, validated_data):
        """Override create to handle creating a trainer from nested data."""
        trainer = validated_data.pop('trainer_id', None) #pull the trainer info from the validated data
        if trainer:
            trainer = Trainer.objects.create(**trainer) #create trainer
        else:
            trainer = Trainer.objects.get(pk=validated_data['trainer_id_id'].pk)


        instance = Class.objects.create(trainer_id = trainer, **validated_data)

        return instance