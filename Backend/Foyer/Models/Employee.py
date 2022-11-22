from django.db import models
from .EmployeeCompany import Company
from .User import User
from .ESupervisionResult import Actions
from .EEmployeeType import ActionsOfEmployee


class Employee(models.Model):
    '''
    Class that represents the Employee model in the system
    '''
    employee_id = models.IntegerField(db_column='EMPLOYEE_ID', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey("User", models.DO_NOTHING, db_column='EMAIL', to_field='email', blank=True, null=True)  # Field name made lowercase.
    
    company = models.ManyToManyField(Company, through='OutsideHiredEmployee')
    action = models.ManyToManyField(Actions, through='ActionsOfEmployee')

    class Meta:
        managed = False
        db_table = 'EMPLOYEE'



    

