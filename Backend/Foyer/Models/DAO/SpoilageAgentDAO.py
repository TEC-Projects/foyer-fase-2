from django.db import connection
from django.db.models import QuerySet

from .IDAO import IDAO
from Foyer.Models.SpoilageAgent import SpoilageAgent
from Foyer.Models.ESpoilageAgentType import SpoilageAgentType
from Foyer.Models.SupervisionDraft import SupervisionDraft


class SpoilageAgentDAO(IDAO):

    def __init__(self):
        """
        Constructor method
        """
        super().__init__()

    def retrieve_rows(self) -> QuerySet:
        """
        Method to retrieve all the spoilage agents registered in the database
        """
        return SpoilageAgent.objects.all()

    def add_row(self, data: dict) -> object:
        """
        Method to register a spoilage agent in the database
        """

        if data['name'] is None:
            return {
                'response': True,
                'message': 'El nombre del agente de deterioro no puede ser vacío'
            }
        if data['type'] is None:
            return {
                'response': True,
                'message': 'El tipo del agente de deterioro no puede ser vacío'
            }
        spoilage_agent_type = SpoilageAgentType.objects.filter(value=data['type'])
        type = spoilage_agent_type.first()
        if type is None:
            return {
                'response': True,
                'message': "El tipo ingresado no existe."
            }

        if SpoilageAgent.objects.filter(name=data['name']).exists():
            return {
                'response': True,
                'message': 'Ya existe un agente de deterioro con el nombre ingresado.'
            }

        with connection.cursor() as cursor:
            try:
                cursor.execute('INSERT INTO SPOILAGE_AGENT (NAME,TYPE) VALUES (%s,%s)',
                               [data['name'], type.spoilage_agent_type_id])
                # cursor.execute('SELECT LAST_INSERT_ID()')
                # (id,) = cursor.fetchone()
            except Exception as e:
                return {
                    'response': True,
                    'message': 'Error en la inserción en la base de datos. Error: ' + e
                }
        return {
            'response': False,
            'message': None
        }

    def update_row(self, data: dict) -> object:
        """
        Method to update a spoilage agent in the database
        """

        if data['id'] is None:
            return {
                'response': True,
                'message': 'El ID del agente de deterioro no puede ser vacío'
            }
        if data['name'] is None:
            return {
                'response': True,
                'message': 'El nombre del agente de deterioro no puede ser vacío'
            }

        if not SpoilageAgent.objects.filter(spoilage_agent_id=data['id']).exists():
            return {
                'response': True,
                'message': 'El tipo del agente de deterioro no puede ser vacío'
            }

        with connection.cursor() as cursor:
            try:
                cursor.execute('UPDATE SPOILAGE_AGENT SET NAME = %s WHERE SPOILAGE_AGENT_ID = %s ',
                               [data['name'], data['id']])
            except Exception as e:
                return {
                    'response': True,
                    'message': 'Error en la actualización en la base de datos. Error: ' + e
                }
        return {
            'response': False,
            'message': None
        }

    def delete_row(self, id: int) -> object:
        """
        Method to delete a spoilage agent in the database
        """

        if id is None:
            return {
                'response': True,
                'message': 'El ID del agente de deterioro no puede ser vacío'
            }

        if not SpoilageAgent.objects.filter(spoilage_agent_id=id).exists():
            return {
                'response': True,
                'message': 'No existe un agente de deterioro con el ID proporcionado.'
            }

        if SupervisionDraft.objects.filter(spoilage_agent_id=id).exists():
            return {
                'response': True,
                'message': 'No se puede eliminar un agente de deterioro que está asociado a los estados de borrador '
                           'de una inspección.'
            }

        try:
            SpoilageAgent.objects.get(spoilage_agent_id=id).delete()
        except Exception as e:
            return {
                'response': True,
                'message': 'Error en la eliminación en la base de datos. Error: ' + e
            }
        return {
            'response': False,
            'message': None
        }


SpoilageAgentDAO.__doc__ = 'Database object that connects to the database and manages the CRUD actions on the ' \
                           'SPOILAGE_AGENT table '
