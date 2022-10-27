from django.shortcuts import render, redirect

from django.http import Http404
from django.http import HttpResponse
from django.views import generic
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate
from .forms import *

# Create your views here.

def index(request):
    course = Course.objects.all()
    
    return render(request, 'index.html',{'course' : course})


def signin(request):
    return render(request, 'login.html')

def logged_view(request):
    context = {

    }

    return render(request, 'logged_on.html', context)

def signup(request):
    if request.method == 'POST':

        form = SignUpForm(request.POST)

        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')

            firstname = form.cleaned_data.get('firstname')
            surname = form.cleaned_data.get('surname')
            address = form.cleaned_data.get('address')
            email = form.cleaned_data.get('email')
            telephone = form.cleaned_data.get('telephone')

            user = authenticate(username=username, password=raw_password)

            login(request, user)
            user_instance = User.objects.filter(username=username).first()
            Person.objects.create(user=user_instance, firstname=firstname, surname=surname, address=address,
                                  telephone=telephone, role='s')

            return redirect('loggend_on')
    else:
        form = SignUpForm()
    return render(request, 'register.html', {'form': form})