from django.db import models

from ..Models.TheatreGood import TheatreGood


class Image(models.Model):
    image = models.IntegerField(
        db_column='IMAGE_ID',
        primary_key=True
    )
    theatre_good = models.ForeignKey(
        TheatreGood,
        on_delete=models.CASCADE,
        db_column='THEATRE_GOOD_ID',
    )
    value = models.CharField(
        max_length=150
    )
    name = models.CharField(
        max_length=64
    )

    class Meta:
        managed = False
        db_table = 'IMAGE'
