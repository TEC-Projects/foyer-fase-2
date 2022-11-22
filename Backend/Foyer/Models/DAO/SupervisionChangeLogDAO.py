from django.db.models import QuerySet

from Foyer.Models.DAO import IDAO
from Foyer.Models.SupervisionChangeLog import SupervisionChangeLog


class SupervisionChangeLogDAO(IDAO):

    def __init__(self):
        """
        Constructor method
        """
        super().__init__()

    def add_row(self, data: str) -> None:
        pass

    def delete_row(self, id: int) -> bool:
        pass

    def retrieve_rows(self, filter: dict = None) -> QuerySet:
        """
        Method to retrieve the log of change of the supervision by the filter selected
        """
        if not filter:
            return SupervisionChangeLog.objects.all()
        else:
            return SupervisionChangeLog.objects.filter(supervision_id=filter['sp_id'])

    def update_row(self, id: int, data: object) -> bool:
        pass

SupervisionChangeLogDAO.__doc__ = 'Database object that connects to the database and manages the CRUD actions on the SUPERVISION_CHANGE_LOG table'