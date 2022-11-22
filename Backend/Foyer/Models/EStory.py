from django.db import models


class EStory(models.Model):
    story_id = models.IntegerField( primary_key=True, db_column='STORY_ID')
    value = models.CharField(max_length=25)

    class Meta:
        managed = False
        db_table = 'STORY'
