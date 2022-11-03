from django.urls import path
from . import views

from django.contrib.auth.views import LoginView, LogoutView,PasswordChangeView,PasswordChangeDoneView



#basic
urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_user, name='login'),
    path('logout',views.logout_user, name='logout'),
    path('register', views.register_user, name='register'),
    path('logged', views.logged_view, name='loggend_on'),
    path('profile', views.profile_view, name='profile'),
    path('profile_edit', views.profile_edit, name='profile_edit'),
    path('courses/<int:id>', views.courses_view, name='courses-view'),
]