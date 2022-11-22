from django.db import models

class Actions(models.Model):
    """
    Class that represents the Result model of the Supervision
    """
    actions_id = models.IntegerField(db_column='ACTION_ID', primary_key=True)
    value = models.CharField(db_column='VALUE', max_length=25)

    class Meta:
        managed = False
        db_table = 'ACTIONS'
