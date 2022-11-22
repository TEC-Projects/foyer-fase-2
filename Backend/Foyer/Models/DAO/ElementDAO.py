from django.db.models.query import QuerySet
from django.db import connection

from .IDAO import IDAO
from ..Element import Element
from ..Supervision import Supervision

class ElementDAO(IDAO):
    """
    Database object that connects to the database and manages the CRUD actions on the ELEMENT table
    """

    def __init__(self):
        super().__init__()

    def add_row(self, data: dict) -> int or None:
        try:
            with connection.cursor() as cursor:
                cursor.execute('INSERT INTO THEATRE_GOOD (NAME, DESCRIPTION, LOCATION) VALUES (%s,%s,%s)',
                                    [data['name'], data['description'], data['location']])
                cursor.execute('INSERT INTO ELEMENT (ELEMENT_ID, AREA_ID) VALUES ((SELECT LAST_INSERT_ID()),%s)',
                             [data['area_id']])
                cursor.execute('SELECT LAST_INSERT_ID()')
                (id,) = cursor.fetchone()
                return id
        except Exception as e:
            e.__str__()
            return None

    def delete_row(self, id: int) -> bool:
        print(id)
        try:
            Supervision.objects.filter(theatre_good__id=id).delete()
            Element.objects.get(info__id=id).delete()
        except Exception as e:
            e.__str__()
            return False
        return True

    def retrieve_rows(self, filter: dict = None) -> QuerySet:
        if not filter:
            return Element.objects.all()
        else:
            if 'id' in filter:
                return Element.objects.filter(info=filter['id'])
            else:
                return Element.objects.filter(area__info=filter['area_id'])

    def update_row(self, id: int, data: dict) -> bool:
        if 'area_id' in data:
            try:
                with connection.cursor() as cursor:
                    cursor.execute("UPDATE ELEMENT SET AREA_ID = %s WHERE ELEMENT_ID = %s", [data['area_id'], id])
                return True
            except Exception as e:
                print(e.__str__())
                return False
        else:
            try:
                with connection.cursor() as cursor:
                    cursor.execute(
                        'UPDATE THEATRE_GOOD SET NAME=%s, DESCRIPTION=%s, LOCATION =%s WHERE THEATRE_GOOD_ID = %s',
                        [data['name'], data['description'], data['location'], id])
                return True
            except Exception as e:
                print(e.__str__())
                return False

