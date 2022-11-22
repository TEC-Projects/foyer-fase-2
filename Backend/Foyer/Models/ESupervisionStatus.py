from django.db import models


class Status(models.Model):
    """
    Class that represents the Status model of the Supervision
    """
    supervision_status_id = models.IntegerField(db_column='STATUS_ID', primary_key=True)
    value = models.CharField(db_column='VALUE', max_length=25)

    class Meta:
        managed = False
        db_table = 'STATUS'
