from django.db.models.query import QuerySet
from django.db import connection

from .IDAO import IDAO
from ..Area import Area
from ..Supervision import Supervision
from ...Util import convert_story_name_to_id


class AreaDAO(IDAO):
    """
    Database object that connects to the database and manages the CRUD actions on the AREA table
    """

    def __init__(self):
        super().__init__()

    def add_row(self, data: dict) -> int or None:

        with connection.cursor() as cursor:
            cursor.execute('INSERT INTO THEATRE_GOOD (NAME, DESCRIPTION, LOCATION) VALUES (%s,%s,%s)',
                                [data['name'], data['description'], data['location']])
            cursor.execute('INSERT INTO AREA (AREA_ID, STORY_ID) VALUES ((SELECT LAST_INSERT_ID()),%s)',
                         [convert_story_name_to_id(data['story'])])
            cursor.execute('SELECT LAST_INSERT_ID()')
            (id,) = cursor.fetchone()

        return id

    def delete_row(self, id: int) -> bool:
        try:
            Supervision.objects.filter(theatre_good_id=id).delete()
            Area.objects.get(info=id).delete()
            return True
        except Exception as e:
            print(e.__str__())
            return False

    def retrieve_rows(self, filter: dict = None) -> QuerySet:
        if not filter:
            return Area.objects.all()
        else:
            return Area.objects.filter(info__id=filter['id'])

    def update_row(self, id: int, data: dict) -> bool:
        print(data)
        try:
            with connection.cursor() as cursor:
                print("B4")
                cursor.execute('UPDATE THEATRE_GOOD SET NAME=%s, DESCRIPTION=%s, LOCATION =%s WHERE THEATRE_GOOD_ID = %s',
                               [data['name'], data['description'], data['location'], id])
                print("AFT")
                cursor.execute('UPDATE AREA SET STORY_ID = %s WHERE AREA_ID = %s',
                               [convert_story_name_to_id(data['story']), id])
                print("AFT AFT")
            return True
        except Exception as e:
            print(e.__str__())
            return False


