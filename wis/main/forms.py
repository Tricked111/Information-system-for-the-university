from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import *

from django.views.generic.edit import *


class person_form(forms.ModelForm):
    class Meta:
        model = Person
        fields =[
            'id_person',
            'firstname',
            'surname',
            'address',
            'telephone',
            'user',
            'role',
        ]


class SignUpForm(UserCreationForm):

    username = forms.CharField(max_length=30, required=False)
    firstname = forms.CharField(max_length=30, required=False)
    email = forms.EmailField(max_length=254)

    class Meta:
        model = User
        fields = ('username', 'firstname','email','password1', 'password2')