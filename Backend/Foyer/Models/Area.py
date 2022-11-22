from django.db import models
from django.db.models.signals import post_delete

from .TheatreGood import TheatreGood
from .EStory import EStory


class Area(models.Model):
    info = models.OneToOneField(
        TheatreGood,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='AREA_ID',
    )
    story = models.ForeignKey(
        EStory,
        models.DO_NOTHING,
        db_column='STORY_ID')

    class Meta:
        managed = False
        db_table = 'AREA'


def delete_theatre_good(instance, **kwargs):
    instance.info.delete()


post_delete.connect(delete_theatre_good, Area)
