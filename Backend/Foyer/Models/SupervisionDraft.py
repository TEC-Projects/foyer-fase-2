from django.db import models

from Foyer.Models.Supervision import Supervision
from Foyer.Models.ESupervisionResult import Actions

class SupervisionDraft(models.Model):
    """
    Class that represents the Supervision draft model
    """
    supervision_draft = models.OneToOneField(
        Supervision,
        db_column='SUPERVISION_DRAFT_ID',
        on_delete=models.CASCADE,
        primary_key=True
    )
    action = models.ForeignKey(
        Actions,
        models.DO_NOTHING,
        db_column='ACTION_ID'
    )

    class Meta:
        managed = False
        db_table = 'SUPERVISION_DRAFT'
