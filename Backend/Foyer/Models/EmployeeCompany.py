from django.db import models

class Company(models.Model):
    '''
    Class that represents the companies in the system and their details
    '''
    id = models.CharField(db_column='COMPANY_ID', primary_key=True, max_length=64)  # Field name made lowercase.
    name = models.CharField(db_column='COMPANY_NAME', unique=True, max_length=128)  # Field name made lowercase.
    email = models.CharField(db_column='EMAIL', unique=True, max_length=128)  # Field name made lowercase.
    class Meta:
        managed = False
        db_table = 'COMPANY'
