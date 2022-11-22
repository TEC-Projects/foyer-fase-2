from django.db import models
from .EmployeeCompany import Company
from . Employee import Employee
class OutsideHiredEmployee(models.Model):
    '''
    Class that represents employees and the companies they work for
    '''
    employee = models.OneToOneField(Employee, models.DO_NOTHING, db_column='EMPLOYEE_ID', primary_key=True)  # Field name made lowercase.
    company = models.ForeignKey(Company, models.DO_NOTHING, db_column='COMPANY_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'OUTSIDE_HIRED_EMPLOYEE'