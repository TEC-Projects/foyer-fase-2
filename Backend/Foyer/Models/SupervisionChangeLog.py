from django.db import models

from Foyer.Models import User,Supervision


class SupervisionChangeLog(models.Model):
    supervision_change_log_id = models.IntegerField(db_column='SUPERVISION_CHANGE_LOG_ID', primary_key=True)
    last_change_user_id = models.ForeignKey(User, models.DO_NOTHING, db_column='LAST_CHANGE_ID_NUMBER',to_field='id_number', blank=True, null=True)
    last_change_date = models.DateField(db_column='LAST_CHANGE_DATE')
    supervision_id = models.ForeignKey(Supervision, models.DO_NOTHING, db_column='SUPERVISION_ID', blank=True, null=True)
    description = models.CharField(db_column='DESCRIPTION', max_length=500)

    class Meta:
        managed = False
        db_table = 'SUPERVISION_CHANGE_LOG'