from rest_framework import viewsets,status
from .models import Due, Event
from .serializers import DueSerializer, EventSerializer
from django.utils.timezone import now
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny , IsAuthenticated , IsAdminUser
from datetime import datetime
import smtplib
from trainers.models import Trainer
from member.models import Members
from email.message import EmailMessage

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def upcoming_events(self, request):
        """
        Returns a list of upcoming events.
        """
        upcoming_events = Event.objects.filter(event_date__gte=now().date())
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """
        Creates a new event.  Handles data like title, description, label, and day (as epoch timestamp).
        """
        data = request.data

        # Handle 'day' (epoch timestamp)
        day = data.get('day')
        if not day:
            return Response({"error": "Day (timestamp) is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            day = int(day)  # Ensure it's an integer
        except ValueError:
            return Response({"error": "Invalid day format. Must be an integer timestamp."}, status=status.HTTP_400_BAD_REQUEST)

        # Handle 'label'
        label = data.get('label')
        if not label:
            return Response({"error": "Label is required."}, status=status.HTTP_400_BAD_REQUEST)

        event_data = {
            'title': data.get('title'),
            'description': data.get('description'),
            'label': label,  # Directly pass the label value
            'day': day  # Pass the raw timestamp value
        }

        serializer = self.get_serializer(data=event_data)

        if serializer.is_valid():
            serializer.save()
            smtp_server = "smtp.gmail.com"
            smtp_port = 465  # SSL port
            sender_email="tamangkriti10@gmail.com"
            sender_password="lffi ofir yfbn piod"
            trainers=Trainer.objects.all()
            members=Members.objects.all()

            trainer_emails = [trainer.email for trainer in trainers]
            member_emails = [member.email for member in members]
            recipient_emails = trainer_emails + member_emails
            msg = EmailMessage()
            msg.set_content("You event has bee created")
            msg['Subject'] = "New Event!"
            msg['From'] = sender_email
            msg['To'] = ", ".join(recipient_emails)


            try:
                with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:  

                    server.login(sender_email, sender_password)
                    server.send_message(msg)

            except smtplib.SMTPAuthenticationError:
                return "Error: SMTP Authentication failed. Check your email and password."
            except smtplib.SMTPServerDisconnected:
                return "Error: Failed to connect to the SMTP server."
            except Exception as e:
                return f"Error: An unexpected error occurred: {e}"
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class DueViewSet(viewsets.ModelViewSet):
    queryset = Due.objects.all()
    serializer_class = DueSerializer
    permission_classes = [AllowAny]


    @action(detail=False, methods=['post'])
    def copy_expired_members(self, request):
        """
        Copies members whose membership has expired to the Due table.
        """
        from .models import Members  # Import Members model here to avoid circular imports

        expired_members = Members.objects.filter(membership_end_date__lt=now().date())

        copied_count = 0
        for member in expired_members:
            if not Due.objects.filter(member_id=member.member_id).exists():
                Due.objects.create(
                    member_id=member.member_id,
                    name=member.name,
                    email=member.email,
                    phone_number=member.phone_number,
                    address=member.address,
                    date_of_birth=member.date_of_birth,
                    membership_start_date=member.membership_start_date,
                    membership_end_date=member.membership_end_date,
                    membership_type_id=member.membership_type.membership_type_id
                )
                copied_count += 1

        return Response({"message": f"{copied_count} members copied to Due table."})

    @action(detail=True, methods=['delete'])
    def delete_member_and_due(self, request, pk=None):
        """
        Deletes a member and their due record based on member ID.
        """
        try:
            member_id = int(pk)
            Due.objects.filter(member_id=member_id).delete()
            from .models import Members
            Members.objects.filter(member_id=member_id).delete()
            return Response({"message": "Member and their due record deleted successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=400)
