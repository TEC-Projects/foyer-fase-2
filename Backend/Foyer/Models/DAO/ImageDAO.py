from django.db.models.query import QuerySet
from django.db import connection

from .IDAO import IDAO
from ..Image import Image
from ...Util.GeneralUtil import upload_file, delete_file


class ImageDAO(IDAO):

    def __init__(self):
        super().__init__()

    def add_row(self, data: dict) -> bool:
        try:
            url: str = upload_file(data['file'])

            print(url)

            if url:
                with connection.cursor() as cursor:
                    cursor.execute('INSERT INTO IMAGE(VALUE, THEATRE_GOOD_ID, NAME) VALUES (%s, %s, %s);',
                                   [url, data['good_id'], data['file'].name])
                return True
            else:
                return False
        except Exception as e:
            print(e.__str__())
            return False

    def delete_row(self, id: int) -> bool:
        try:
            image = Image.objects.get(image=id)
            print(image)
            print(id)
            delete_file(image.value)
            image.delete()
        except Exception as e:
            e.__str__()
            return False
        return True

    def retrieve_rows(self, filter: dict = None) -> QuerySet:
        if not filter:
            return Image.objects.all()
        else:
            if 'id' not in filter:
                return Image.objects.filter(theatre_good=filter['tg_id'])
            else:
                return Image.objects.filter(image=filter['id'])

    def update_row(self, id: int, data: object) -> bool:
        pass


ImageDAO.__doc__ = 'Database object that connects to the database and manages the CRUD actions on the IMAGES table'
