# Generated by Django 4.1.2 on 2022-11-07 19:51

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id_course', models.IntegerField(primary_key=True, serialize=False)),
                ('abbrv', models.CharField(max_length=5)),
                ('title', models.TextField(blank=True)),
                ('description', models.TextField()),
                ('credits', models.IntegerField()),
                ('fakulta', models.CharField(max_length=4)),
                ('type', models.CharField(choices=[('w', 'Winter'), ('s', 'Summer')], default='w', max_length=1)),
            ],
        ),
        migrations.CreateModel(
            name='Termin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id_person', models.AutoField(primary_key=True, serialize=False)),
                ('firstname', models.CharField(max_length=50)),
                ('surname', models.CharField(max_length=50)),
                ('address', models.CharField(max_length=150)),
                ('telephone', models.CharField(max_length=25)),
                ('email', models.CharField(blank=True, max_length=32, null=True, unique=True)),
                ('role', models.CharField(choices=[('a', 'administrator'), ('g', 'garant'), ('l', 'lektor'), ('v', 'visitor'), ('s', 'student')], default='v', max_length=1)),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
