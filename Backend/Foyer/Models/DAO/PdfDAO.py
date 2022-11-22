from django.db import connection
from django.db.models import QuerySet

from Foyer.Models.DAO import IDAO
from Foyer.Models.Pdf import Pdf
from Foyer.Util import upload_file


class PdfDAO(IDAO):

    def __init__(self):
        """
        Constructor method
        """
        super().__init__()

    def add_row(self, data: dict) -> bool:
        """
        Method to register a pdf associated with supervision in the database
        """
        try:
            url: str = upload_file(data['file'])
            print(url)
            if url:
                with connection.cursor() as cursor:
                    cursor.execute('INSERT INTO PDF (VALUE, SUPERVISION_ID, NAME) VALUES (%s, %s, %s);',
                                   [url, data['sp_id'], data['file'].name])
                return True
            else:
                return False
        except Exception as e:
            print(e.__str__())
            return False

    def delete_row(self, id: int) -> bool:
        pass

    def retrieve_rows(self, filter: dict = None) -> QuerySet:
        """
        Method to retrieve all the pdfs registered in the database by the filter selected
        """
        if not filter:
            return Pdf.objects.all()
        else:
            return Pdf.objects.filter(supervision_id=filter['sp_id'])

    def update_row(self, id: int, data: object) -> bool:
        pass


PdfDAO.__doc__ = 'Database object that connects to the database and manages the CRUD actions on the PDF table'