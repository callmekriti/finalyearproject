from django.db import models
from member.models import Members
from django.utils import timezone

class Attendance(models.Model):
    member = models.ForeignKey(Members, on_delete=models.CASCADE)  
    check_in = models.DateTimeField(default=timezone.now)
    check_out = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.member.name} - {self.check_in}"  # Fix field reference
