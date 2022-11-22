from enum import unique
from django.db import models
from Foyer.Models.ERole import Role

class User(models.Model):
    '''
    Class that represents the User model
    '''
    user_id = models.IntegerField(db_column='USER_ID', primary_key=True)  # Field name made lowercase.
    id_number = models.CharField(db_column='ID_NUMBER', max_length=64, unique=True)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', max_length=64)  # Field name made lowercase.
    surname = models.CharField(db_column='SURNAME', max_length=128)  # Field name made lowercase.
    email = models.CharField(db_column='EMAIL', unique=True, max_length=128)  # Field name made lowercase.
    password = models.CharField(db_column='PASSWORD', max_length=128)  # Field name made lowercase.
    new_user = models.IntegerField(db_column='NEW_USER')  # Field name made lowercase.
    type = models.ForeignKey(Role, models.DO_NOTHING, db_column='ROLE', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'USER'