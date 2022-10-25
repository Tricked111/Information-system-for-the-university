from django.db import models
from django.core.exceptions import PermissionDenied
from django.conf import settings

# Create your models here.


class Person(models.Model):
    id_person = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=50, blank=False)
    surname = models.CharField(max_length=50, blank=False)
    address = models.CharField(max_length=150, blank=False)
    telephone = models.CharField(max_length=25, blank=False, unique=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    email = models.CharField(max_length=32, unique=True, blank=True, null=True)

    ROLES = (
        ('a', 'administrator'),
        ('g', 'garant'),
        ('l', 'lektor'),
        ('v', 'visitor'),
        ('s', 'student')
    )
    role = models.CharField(
        max_length=1,
        choices=ROLES,
        blank=False,
        default='v'
    )

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return self.surname

    def get_absolute_url(self):
        return f"{self.id_person}"

    def is_admin(self):
        if self.role == 'a':
            pass
        else:
            raise PermissionDenied()

    def is_garant(self):
        if self.role == 'g' or self.role == 'a':
            pass
        else:
            raise PermissionDenied()

    def is_lektor(self):
        if self.role == 'l' or self.role == 'a' or self.role == 'g':
            pass
        else:
            raise PermissionDenied()