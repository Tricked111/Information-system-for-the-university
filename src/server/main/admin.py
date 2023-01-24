from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Person)
admin.site.register(Course)
admin.site.register(Teacher_Course)
admin.site.register(Student_Course)
admin.site.register(Classrooms)
admin.site.register(Termin)
admin.site.register(User_Termin)