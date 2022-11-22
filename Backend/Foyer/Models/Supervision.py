from django.db import models

from Foyer.Models.ESupervisionResult import Actions
from Foyer.Models.TheatreGood import TheatreGood
from Foyer.Models.User import User
from Foyer.Models.ESupervisionStatus import Status

class Supervision(models.Model):
    """
    Class that represents the Supervision model
    """
    supervision_id = models.IntegerField(db_column='SUPERVISION_ID', primary_key=True)
    theatre_good = models.ForeignKey(TheatreGood, models.DO_NOTHING, db_column='THEATRE_GOOD_ID', blank=True, null=True)
    id_number = models.ForeignKey(User, models.DO_NOTHING, db_column='ID_NUMBER', to_field='id_number', blank=True, null=True)
    start_date = models.DateField(db_column='START_DATE')
    end_date = models.DateField(db_column='END_DATE')
    execution_date = models.DateField(db_column='EXECUTION_DATE')
    action_id = models.ForeignKey(Actions, models.DO_NOTHING, db_column='ACTION_ID', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'SUPERVISION'
        ordering = ['end_date']
