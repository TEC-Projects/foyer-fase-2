from django.db import models

class SpoilageAgentType(models.Model):
    """
    Class that represents the Type model of the Spoilage Agent
    """
    spoilage_agent_type_id = models.IntegerField(db_column='SPOILAGE_AGENT_TYPE_ID', primary_key=True)
    value = models.CharField(db_column='VALUE', max_length=25)

    class Meta:
        managed = False
        db_table = 'SPOILAGE_AGENT_TYPE'

