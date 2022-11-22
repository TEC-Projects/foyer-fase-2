from django.db import models

class Role(models.Model):
    '''
    Class that represents the Role of a user in the system
    '''
    role_type_id = models.IntegerField(db_column='ROLE_TYPE_ID', primary_key=True)  # Field name made lowercase.
    value = models.CharField(db_column='VALUE', unique=True, max_length=64)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ROLE'
