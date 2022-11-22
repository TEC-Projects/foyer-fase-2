from django.db import models
from django.db.models.signals import post_delete, pre_delete

from .TheatreGood import TheatreGood
from .Area import Area
from .Supervision import Supervision


class Element(models.Model):
    # id = models.IntegerField(
    #     db_column='ELEMENT_ID'
    # )
    info = models.OneToOneField(
        TheatreGood,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='ELEMENT_ID'
    )
    area = models.ForeignKey(
        Area,
        models.CASCADE,
        db_column='AREA_ID'
    )

    class Meta:
        managed = False
        db_table = 'ELEMENT'


def delete_theatre_good(instance, **kwargs):
    instance.info.delete()


def delete_supervision(instance, **kwargs):
    Supervision.objects.filter(theatre_good__id=instance.info.id).delete()


pre_delete.connect(delete_supervision, Element)
post_delete.connect(delete_theatre_good, Element)
