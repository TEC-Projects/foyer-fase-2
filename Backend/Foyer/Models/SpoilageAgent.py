from django.db import models

from Foyer.Models.ESpoilageAgentType import SpoilageAgentType


class SpoilageAgent(models.Model):
    """
    Class that represents the Spoilage Agent model
    """
    spoilage_agent_id = models.IntegerField(db_column='SPOILAGE_AGENT_ID', primary_key=True)
    name = models.CharField(db_column='NAME', max_length=25)
    type = models.ForeignKey(SpoilageAgentType, models.DO_NOTHING, db_column='TYPE', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'SPOILAGE_AGENT'
