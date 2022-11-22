from django.db import models

from Foyer.Models.SupervisionDraft import SupervisionDraft
from Foyer.Models.SpoilageAgent import SpoilageAgent


class SupervisionDraftSpoilageAgent(models.Model):
    """
    Class that represents each Supervision draft spoilage agent model
    """
    supervision_draft_spoilage_agent_id = models.IntegerField(
        db_column='SUPERVISION_DRAFT_SPOILAGE_AGENT_ID',
        primary_key=True,
        auto_created=True
    )
    supervision_draft = models.ForeignKey(
        SupervisionDraft,
        db_column='SUPERVISION_DRAFT_ID',
        on_delete=models.CASCADE,
    )
    spoilage_agent = models.ForeignKey(
        SpoilageAgent,
        models.DO_NOTHING,
        db_column='SPOILAGE_AGENT_ID'
    )
    image_url = models.CharField(
        max_length=150
    )
    image_name = models.CharField(
        max_length=150
    )
    remarks = models.CharField(
        max_length=1000
    )
    suggested_treatment = models.CharField(
        max_length=1000
    )

    class Meta:
        managed = False
        db_table = 'SUPERVISION_DRAFT_SPOILAGE_AGENT'
