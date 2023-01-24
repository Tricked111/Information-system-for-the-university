from django.db import models
from django.core.exceptions import PermissionDenied
from django.conf import settings

# Create your models here.

class Person(models.Model):
    id_person = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=50, blank=False)
    surname = models.CharField(max_length=50, blank=False)
    address = models.CharField(max_length=150, blank=False)
    telephone = models.CharField(max_length=25, blank=False)
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
            return True
        else:
            return False

    def is_garant(self):
        if self.role == 'g' or self.role == 'a':
            return True
        else:
            return False

    def is_lektor(self):
        if self.role == 'l' or self.role == 'a' or self.role == 'g':
            return True
        else:
            return False


class Course(models.Model):
    id_course = models.AutoField(primary_key=True) # basically IntegerField but with autoincrementation so after all Primary Key
    abbrv = models.CharField(max_length = 5)
    title = models.TextField(blank = True)
    description = models.TextField(blank=False)
    credits = models.IntegerField(default=5)
    garant = models.ForeignKey(Person, models.DO_NOTHING, db_column='id_person', default=None)

    max_persons = models.IntegerField(default=100)
    approved = models.BooleanField(default=False)

    SEMESTR = (
        ('w', 'Winter'),  # Winter time
        ('s', 'Summer'),  # Summer time
    )
    type = models.CharField(
        max_length=1,
        choices=SEMESTR,
        default='w',  # By default will be winter time
    )
    def get_absolute_url(self):
        return f"{self.id_course}"

    def __str__(self):
        """String for representing the MyModelName object (in Admin site etc.)."""
        return self.id_course


class Teacher_Course(models.Model):
    id_teacher = models.ForeignKey(Person, models.DO_NOTHING, db_column='id_person')
    id_course = models.ForeignKey(Course, models.DO_NOTHING, db_column='id_course')
    class Meta:
        unique_together = (('id_teacher', 'id_course'),)

class Student_Course(models.Model):
    id_student = models.ForeignKey(Person, models.DO_NOTHING, db_column='id_person')
    id_course = models.ForeignKey(Course, models.DO_NOTHING, db_column='id_course')
    class Meta:
        unique_together = (('id_student', 'id_course'),)

class Classrooms(models.Model):
    id_classroom = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=False)


class Termin(models.Model):
    id_termin = models.AutoField(primary_key=True) # basically IntegerField but with autoincrementation so after all Primary Key
    id_course = models.ForeignKey(Course, on_delete=models.CASCADE)
    id_classroom = models.ForeignKey(Classrooms, on_delete=models.CASCADE, default=None)
    name = models.CharField(max_length=50, blank=False)
    repeted = models.BooleanField(default=False)
    time_start = models.TimeField(blank=False, default=None)
    time_end = models.TimeField(blank=False, default=None)
    date = models.DateField(default=None)
    weekday = models.CharField(max_length=10, default=None)
    max_points = models.IntegerField(default=None)
    description = models.CharField(max_length=100, default=None)

    auto_regist = models.BooleanField(default=None)
    capacita = models.IntegerField(default=None)


    TYPES = (
        ('l', 'lecture'),
        ('c', 'cviceni'),
        ('z', 'exam'),
        ('p', 'project'),
        ('h', 'homework')
    )
    type = models.CharField(
        max_length=1,
        choices=TYPES,
        blank=False,
        default='l'
    )

class User_Termin(models.Model):
    id_student = models.ForeignKey(Person, models.DO_NOTHING, db_column='id_person')
    id_termin = models.ForeignKey(Termin, models.DO_NOTHING, db_column='id_termin')
    points = models.IntegerField()
    class Meta:
        unique_together = (('id_student', 'id_termin'),)