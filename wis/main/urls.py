from django.urls import path
from . import views

from django.contrib.auth.views import LoginView, LogoutView,PasswordChangeView,PasswordChangeDoneView



#basic
urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_user, name='login'),
    path('logout',views.logout_user, name='logout'),
    path('register', views.register_user, name='register'),
    path('study', views.study_view, name='study'),
    path('logged', views.logged_view, name='loggend_on'),
    path('profile', views.profile_view, name='profile'),
    path('profile_edit', views.profile_edit, name='profile_edit'),
    path('<int:id>', views.courses_view, name='courses-view'),
    path('admin_view', views.admin_view, name='admin_view'),
]