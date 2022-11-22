from django.db import models
from .ESupervisionResult import Actions
class ActionsOfEmployee(models.Model):
    '''
    Class that represents the actions that an employee can make
    '''
    employee = models.OneToOneField('Employee', models.DO_NOTHING, db_column='EMPLOYEE_ID', primary_key=True)  # Field name made lowercase.
    action = models.ForeignKey(Actions, models.DO_NOTHING, db_column='ACTION_ID')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ACTIONS_OF_EMPLOYEE'
        unique_together = (('employee', 'action'),)