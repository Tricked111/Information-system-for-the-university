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

    username = forms.CharField(max_length=30)
    firstname = forms.CharField(max_length=30, required=False)
    surname= forms.CharField(max_length=30, required=False)
    email = forms.EmailField(max_length=254)

    class Meta:
        model = User
        fields = ('username', 'firstname', 'surname', 'email', 'password1', 'password2')


class EditProfileForm(forms.Form):
    #user = forms.CharField(max_length=30, required=False, help_text='First Name.')

    firstname = forms.CharField(max_length=30, required=False, widget=forms.TextInput(attrs={"class":"tmpclass"}))
    surname = forms.CharField(max_length=30, required=False)
    address = forms.CharField(max_length=30, required=False)
    email = forms.EmailField(max_length=254, required=False)
    telephone = forms.CharField(max_length=30, required=False)

class UpdateUser(forms.Form):
    role = forms.CharField(max_length=1, required=False)
    
    