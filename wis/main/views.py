from atexit import register
from django.shortcuts import render, redirect

from django.http import Http404
from django.http import HttpResponse
from django.views import generic
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login,logout,authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import *

# Create your views here.

def index(request):
    course = Course.objects.all()
    #person_instance = Person.objects.filter(user=request.user).first()
    context = {
            'course' : course,
            #"role": person_instance.role
        }
    return render(request, 'index.html', context)


def login_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']    
        user = authenticate(request,username=username,password=password)
    
        if user is not None:
            login(request,user)
            return redirect("/")         
        else:
            messages.success(request,"Error authenticate.Try again...")
            return redirect("/login")
            #return render(request, 'login.html',{})
    else:
        return render(request, 'login.html',{})



def logout_user(request):
    logout(request)
    messages.success(request,"You Were logout")
    return redirect("/")


def logged_view(request):
    context = {
    }

    return render(request, 'logged_on.html', context)


def courses_view(request, id):
    course = Course.objects.filter(id_course=id).first()
    is_register = False
    if request.user.is_authenticated:
        person_instance = Person.objects.filter(user=request.user).first()
        
        courses_user = person_instance.courses.all()

        for i in courses_user:
            if i.abbrv == course.abbrv:
                is_register = True
                break


        if request.method == "POST":
            
            if 'Register' in request.POST:
                person_instance.courses.add(course)   
                person_instance.save() 
                is_register = True

            elif 'Unregister' in request.POST:
                person_instance.courses.remove(course)
                person_instance.save()
                is_register = False

    context = {
        "course" : course,
        "course_abbrv" : course.abbrv,
        "course_title" : course.title,
        "is_register" : is_register,
    }

    return render(request, 'course_detail.html', context)

@login_required
def study_view(request):
    if request.user.is_authenticated:
        person_instance = Person.objects.filter(user=request.user).first()
        courses = person_instance.courses.all()

    contex = {
        'courses' : courses,
    }
    
    return render(request, 'study_view.html',contex)


def register_user(request):
    if request.method == "POST":
        
        form = SignUpForm(request.POST)
        
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            firstname = form.cleaned_data['firstname']
            surname = form.cleaned_data['surname']
            email = form.cleaned_data['email']
            
            user = authenticate(username=username,password=password)
            login(request,user)    
            
            user_instance = User.objects.filter(username=username).first()
            Person.objects.create(user=user_instance, firstname=firstname, surname=surname, email=email, role='v')
            messages.success(request,"Registration Successful!")
            return redirect('/')
        
            
        else:
            messages.success(request,f"Registration Failed! \n{form.errors.as_text()}")
            return redirect('/register')
    
    else:
        form = SignUpForm()
    return render(request,'register.html',{
        'form' : form,
    })

@login_required
def admin_view(request):
    if request.user.is_authenticated:
        person_instance = Person.objects.filter(user=request.user).first()

        if person_instance.role != 'a':
            raise Http404

        persons = Person.objects.all()
        context = {
            "role": person_instance.role,
            "persons" : persons
        }
    else:
        raise Http404

    return render(request, 'admin_view.html', context)

@login_required
def profile_view(request):
    if request.user.is_authenticated:
        person_instance = Person.objects.filter(user=request.user).first()
        
        context = {
            "person": person_instance,
            "role" : person_instance.role
        }
    else:
        raise Http404

    return render(request, 'profile.html', context)


def user_delete(request, id):
    person_instance = Person.objects.filter(id_person=id).first()
    if request.method == 'POST':
        if 'Delete' in request.POST:
            Person.objects.filter(id_person=person_instance.id_person).delete()
        return redirect('/admin_view')
    context = {
        'person': person_instance,
    }
    return render(request, 'admin_user_delete.html', context)
    


def user_update(request, id):
    person_instance = Person.objects.filter(id_person=id).first()
    if request.method == 'POST':
        person_instance = Person.objects.filter(id_person=id).first()

        form = UpdateUser(request.POST or None)
        if form.is_valid():
            role = form.cleaned_data['role'] if form.cleaned_data['role'] != '' else person_instance.role
            Person.objects.filter(id_person=person_instance.id_person).update(role=role)
            person_instance = Person.objects.filter(id_person=id).first()
            return redirect('/admin_view')
    else:
        form = UpdateUser()    

    context = {
        'form' : form,
        'person': person_instance,
    }
    return render(request, 'admin_user_update.html', context)

@login_required
def profile_edit(request):
    person_instance = Person.objects.filter(user=request.user).first()
    if request.method == 'POST':
        person_instance = Person.objects.filter(user=request.user).first()

        form = EditProfileForm(request.POST or None)

        if form.is_valid():
            firstname = form.cleaned_data['firstname'] if form.cleaned_data['firstname'] != '' else person_instance.firstname
            surname = form.cleaned_data['surname'] if form.cleaned_data['surname'] != '' else person_instance.surname
            address = form.cleaned_data['address'] if form.cleaned_data['address'] != '' else person_instance.address
            email = form.cleaned_data['email'] if form.cleaned_data['email'] != '' else person_instance.email
            telephone = form.cleaned_data['telephone'] if form.cleaned_data['telephone'] != '' else person_instance.telephone

            Person.objects.filter(id_person=person_instance.id_person).update(firstname=firstname,
                                                                              surname=surname,
                                                                              address=address,
                                                                              telephone=telephone,
                                                                              email=email)

            person_instance = Person.objects.filter(user=request.user).first()
            return redirect('/profile')


    else:
        form = EditProfileForm()

    context = {
        'form': form,
        'user_profile': request.user,
        'person': person_instance,

    }

    return render(request, 'profile_edit.html', context)