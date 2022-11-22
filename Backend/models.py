# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Actions(models.Model):
    action_id = models.IntegerField(db_column='ACTION_ID', primary_key=True)  # Field name made lowercase.
    value = models.CharField(db_column='VALUE', unique=True, max_length=25)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ACTIONS'


class ActionsOfEmployee(models.Model):
    employee = models.OneToOneField('Employee', models.DO_NOTHING, db_column='EMPLOYEE_ID', primary_key=True)  # Field name made lowercase.
    action = models.ForeignKey(Actions, models.DO_NOTHING, db_column='ACTION_ID')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ACTIONS_OF_EMPLOYEE'
        unique_together = (('employee', 'action'),)


class Area(models.Model):
    area = models.OneToOneField('TheatreGood', models.DO_NOTHING, db_column='AREA_ID', primary_key=True)  # Field name made lowercase.
    floor = models.ForeignKey('Floor', models.DO_NOTHING, db_column='FLOOR_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'AREA'


class Company(models.Model):
    company_id = models.CharField(db_column='COMPANY_ID', primary_key=True, max_length=25)  # Field name made lowercase.
    company_name = models.CharField(db_column='COMPANY_NAME', unique=True, max_length=25)  # Field name made lowercase.
    email = models.CharField(db_column='EMAIL', unique=True, max_length=25)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'COMPANY'


class Component(models.Model):
    component = models.OneToOneField('TheatreGood', models.DO_NOTHING, db_column='COMPONENT_ID', primary_key=True)  # Field name made lowercase.
    element = models.ForeignKey('Element', models.DO_NOTHING, db_column='ELEMENT_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'COMPONENT'


class Element(models.Model):
    element = models.OneToOneField('TheatreGood', models.DO_NOTHING, db_column='ELEMENT_ID', primary_key=True)  # Field name made lowercase.
    area = models.ForeignKey(Area, models.DO_NOTHING, db_column='AREA_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ELEMENT'


class Employee(models.Model):
    employee_id = models.IntegerField(db_column='EMPLOYEE_ID', primary_key=True)  # Field name made lowercase.
    email = models.ForeignKey('User', models.DO_NOTHING, db_column='EMAIL', to_field='EMAIL', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'EMPLOYEE'


class Floor(models.Model):
    floor_id = models.IntegerField(db_column='FLOOR_ID', primary_key=True)  # Field name made lowercase.
    value = models.CharField(db_column='VALUE', unique=True, max_length=25)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'FLOOR'


class Images(models.Model):
    image_id = models.IntegerField(db_column='IMAGE_ID', primary_key=True)  # Field name made lowercase.
    value = models.CharField(db_column='VALUE', max_length=150)  # Field name made lowercase.
    theatre_good = models.ForeignKey('TheatreGood', models.DO_NOTHING, db_column='THEATRE_GOOD_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'IMAGES'


class OutsideHiredEmployee(models.Model):
    employee = models.OneToOneField(Employee, models.DO_NOTHING, db_column='EMPLOYEE_ID', primary_key=True)  # Field name made lowercase.
    company = models.ForeignKey(Company, models.DO_NOTHING, db_column='COMPANY_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'OUTSIDE_HIRED_EMPLOYEE'


class Role(models.Model):
    role_type_id = models.IntegerField(db_column='ROLE_TYPE_ID', primary_key=True)  # Field name made lowercase.
    value = models.CharField(db_column='VALUE', unique=True, max_length=25)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'ROLE'


class SpoilageAgent(models.Model):
    spoilage_agent_id = models.IntegerField(db_column='SPOILAGE_AGENT_ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', unique=True, max_length=25)  # Field name made lowercase.
    type = models.ForeignKey('SpoilageAgentType', models.DO_NOTHING, db_column='TYPE', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'SPOILAGE_AGENT'


class SpoilageAgentManagement(models.Model):
    theatre_good = models.OneToOneField('TheatreGood', models.DO_NOTHING, db_column='THEATRE_GOOD_ID', primary_key=True)  # Field name made lowercase.
    spoilage_agent = models.ForeignKey(SpoilageAgent, models.DO_NOTHING, db_column='SPOILAGE_AGENT_ID')  # Field name made lowercase.
    detectiondate = models.DateField(db_column='DetectionDate')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'SPOILAGE_AGENT_MANAGEMENT'
        unique_together = (('theatre_good', 'spoilage_agent'),)


class SpoilageAgentType(models.Model):
    spoilage_agent_type_id = models.IntegerField(db_column='SPOILAGE_AGENT_TYPE_ID', primary_key=True)  # Field name made lowercase.
    value = models.CharField(db_column='VALUE', unique=True, max_length=25)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'SPOILAGE_AGENT_TYPE'


class Supervision(models.Model):
    supervision_id = models.IntegerField(db_column='SUPERVISION_ID', primary_key=True)  # Field name made lowercase.
    theatre_good = models.ForeignKey('TheatreGood', models.DO_NOTHING, db_column='THEATRE_GOOD_ID', blank=True, null=True)  # Field name made lowercase.
    user = models.ForeignKey('User', models.DO_NOTHING, db_column='USER_ID', blank=True, null=True)  # Field name made lowercase.
    start_date = models.DateField(db_column='START_DATE')  # Field name made lowercase.
    end_date = models.DateField(db_column='END_DATE')  # Field name made lowercase.
    results = models.CharField(db_column='RESULTS', max_length=150, blank=True, null=True)  # Field name made lowercase.
    last_change_user = models.ForeignKey('User', models.DO_NOTHING, db_column='LAST_CHANGE_USER_ID', blank=True, null=True)  # Field name made lowercase.
    last_change_date = models.DateField(db_column='LAST_CHANGE_DATE')  # Field name made lowercase.
    action = models.ForeignKey(Actions, models.DO_NOTHING, db_column='ACTION_ID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'SUPERVISION'


class TheatreGood(models.Model):
    theatre_good_id = models.IntegerField(db_column='THEATRE_GOOD_ID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', unique=True, max_length=25)  # Field name made lowercase.
    description = models.CharField(db_column='DESCRIPTION', max_length=150)  # Field name made lowercase.
    address = models.CharField(db_column='ADDRESS', max_length=150)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'THEATRE_GOOD'


class User(models.Model):
    user_id = models.IntegerField(db_column='USER_ID', primary_key=True)  # Field name made lowercase.
    id_number = models.CharField(db_column='ID_NUMBER', max_length=25)  # Field name made lowercase.
    name = models.CharField(db_column='NAME', max_length=25)  # Field name made lowercase.
    email = models.CharField(db_column='EMAIL', unique=True, max_length=25)  # Field name made lowercase.
    password = models.CharField(db_column='PASSWORD', max_length=25)  # Field name made lowercase.
    new_user = models.IntegerField(db_column='NEW_USER')  # Field name made lowercase.
    role = models.ForeignKey(Role, models.DO_NOTHING, db_column='ROLE', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'USER'
