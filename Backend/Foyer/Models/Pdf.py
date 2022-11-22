from django.db import models

from Foyer.Models import Supervision


class Pdf(models.Model):
    """
    Class that represents the Pdf model
    """

    pdf_id = models.IntegerField(db_column='PDF_ID', primary_key=True)
    value = models.CharField(db_column='VALUE', max_length=25)
    supervision_id = models.ForeignKey(Supervision, models.DO_NOTHING, db_column='SUPERVISION_ID', blank=True,
                                       null=True)
    name = models.CharField(db_column='NAME', max_length=25)

    class Meta:
        managed = False
        db_table = 'PDF'
