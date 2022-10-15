from django.shortcuts import render

from django.http import Http404
from django.http import HttpResponse
from django.views import generic
# Create your views here.

def index(request):
    return render(request, 'index.html')