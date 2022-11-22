from __future__ import annotations

from django.db import ConnectionProxy, connection


class IDAO:

    conn: ConnectionProxy

    def __init__(self):
        self.conn = connection

    def add_row(self, data: object) -> int | None:
        pass

    def delete_row(self, id: int) -> bool:
        pass

    def retrieve_rows(self, filter: object) -> list | None:
        pass

    def update_row(self, id: int, data: object) -> bool:
        pass


IDAO.__doc__ = 'Interface of a data access object'
