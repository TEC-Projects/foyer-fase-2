from __future__ import annotations

import datetime, re

from django.db import connection

from Foyer.Models import User, Role
from Foyer.Models.DAO.PdfDAO import PdfDAO
from Foyer.Models.ESupervisionResult import Actions
from Foyer.Models.DAO import IDAO, AreaDAO, ElementDAO
from Foyer.Models.Supervision import Supervision
from Foyer.Models.DAO.UserDAO import UserDAO


class SupervisionDAO(IDAO):
    dao_area: AreaDAO
    dao_element: ElementDAO
    dao_user: UserDAO
    dao_pdf: PdfDAO

    def __init__(self):
        """
        Constructor method
        """
        super().__init__()
        self.dao_area = AreaDAO()
        self.dao_element = ElementDAO()
        self.dao_user = UserDAO()
        self.dao_pdf = PdfDAO()

    def retrieve_rows(self, filter: dict):
        """
        Method to retrieve all the supervisions registered in the database by the filter selected
        """

        supervision_id = filter['inspectionId']
        start_date = filter['startDate']
        end_date = filter['endDate']
        id_number = filter['responsibleId']
        status = filter['status']
        s = None

        supervisions_part1 = Supervision()
        supervisions_part2 = Supervision()
        uninitialized = True

        ###### PART 1 (TO_PROCEED // IN_PROGRESS // LATE)

        if supervision_id is not None:
            supervisions_part1 = Supervision.objects.filter(supervision_id=supervision_id, execution_date=None)
            uninitialized = False

        if start_date is not None:
            if uninitialized:
                supervisions_part1 = Supervision.objects.filter(start_date__gte=start_date, execution_date=None)
                uninitialized = False
            else:
                supervisions_part1 = supervisions_part1.filter(start_date__gte=start_date, execution_date=None)
        if end_date is not None:
            if uninitialized:
                supervisions_part1 = Supervision.objects.filter(end_date__lte=end_date, execution_date=None)
                uninitialized = False
            else:
                supervisions_part1 = supervisions_part1.filter(end_date__lte=end_date, execution_date=None)
        if id_number is not None:
            if uninitialized:
                supervisions_part1 = Supervision.objects.filter(id_number=id_number, execution_date=None)
                uninitialized = False
            else:
                supervisions_part1 = supervisions_part1.filter(id_number=id_number, execution_date=None)

        if status is not None:
            if status == "TO_PROCEED":
                if uninitialized:
                    supervisions_part1 = Supervision.objects.filter(start_date__gte=datetime.date.today(),
                                                                    execution_date=None)
                    uninitialized = False
                else:
                    supervisions_part1 = supervisions_part1.filter(start_date__gte=datetime.date.today(),
                                                                   execution_date=None)
            if status == "IN_PROGRESS":
                if uninitialized:
                    supervisions_part1 = Supervision.objects.filter(start_date__lte=datetime.date.today(),
                                                                    end_date__gte=datetime.date.today(),
                                                                    execution_date=None)
                    uninitialized = False
                else:
                    supervisions_part1 = supervisions_part1.filter(start_date__lte=datetime.date.today(),
                                                                   end_date__gte=datetime.date.today(),
                                                                   execution_date=None)
            if status == "LATE":
                if uninitialized:
                    supervisions_part1 = Supervision.objects.exclude(start_date__gt=datetime.date.today())
                    supervisions_part1 = supervisions_part1.filter(end_date__lt=datetime.date.today(),
                                                                   execution_date=None)
                    uninitialized = False
                else:
                    supervisions_part1 = supervisions_part1.exclude(start_date__gt=datetime.date.today())
                    supervisions_part1 = supervisions_part1.filter(end_date__gt=datetime.date.today(),
                                                                   execution_date=None)
            if status == "EXECUTED" or status == "EXECUTED_LATE":
                uninitialized = False
                supervisions_part1 = []

        if uninitialized:
            supervisions_part1 = Supervision.objects.all()
            supervisions_part1 = supervisions_part1.filter(execution_date=None)

        uninitialized = True
        ###### PART 2 (EXECUTED // EXECUTE_LATE)

        if supervision_id is not None:
            supervisions_part2 = Supervision.objects.filter(supervision_id=supervision_id)
            supervisions_part2 = supervisions_part2.exclude(execution_date=None)
            uninitialized = False

        if start_date is not None:
            if uninitialized:
                supervisions_part2 = Supervision.objects.filter(start_date__gte=start_date)
                supervisions_part2 = supervisions_part2.exclude(execution_date=None)
                uninitialized = False
            else:
                supervisions_part2 = supervisions_part2.filter(start_date__gte=start_date)
                supervisions_part2 = supervisions_part2.exclude(execution_date=None)
        if end_date is not None:
            if uninitialized:
                supervisions_part2 = Supervision.objects.filter(end_date__lte=end_date)
                supervisions_part2 = supervisions_part2.exclude(execution_date=None)
                uninitialized = False
            else:
                supervisions_part2 = supervisions_part2.filter(end_date__lte=end_date)
                supervisions_part2 = supervisions_part2.exclude(execution_date=None)
        if id_number is not None:
            if uninitialized:
                supervisions_part2 = Supervision.objects.filter(id_number=id_number)
                supervisions_part2 = supervisions_part2.exclude(execution_date=None)
                uninitialized = False
            else:
                supervisions_part2 = supervisions_part2.filter(id_number=id_number)
                supervisions_part2 = supervisions_part2.exclude(execution_date=None)

        if status is not None:
            if status == "EXECUTED":
                if uninitialized:
                    supervisions_part2 = Supervision.objects.exclude(execution_date=None)
                    supervisions_part2 = supervisions_part2.raw(
                        'SELECT * FROM SUPERVISION WHERE EXECUTION_DATE < END_DATE ORDER BY END_DATE ASC')
                    uninitialized = False
                else:
                    supervisions_part2 = supervisions_part2.exclude(execution_date=None)
                    supervisions_part2 = supervisions_part2.raw(
                        'SELECT * FROM SUPERVISION WHERE EXECUTION_DATE < END_DATE ORDER BY END_DATE ASC')

            if status == "EXECUTED_LATE":
                if uninitialized:
                    supervisions_part2 = Supervision.objects.exclude(execution_date=None)
                    supervisions_part2 = supervisions_part2.raw(
                        'SELECT * FROM SUPERVISION WHERE EXECUTION_DATE > END_DATE ORDER BY END_DATE ASC')
                    uninitialized = False
                else:
                    supervisions_part2 = supervisions_part2.exclude(execution_date=None)
                    supervisions_part2 = supervisions_part2.raw(
                        'SELECT * FROM SUPERVISION WHERE EXECUTION_DATE > END_DATE ORDER BY END_DATE ASC')

            if status == "IN_PROGRESS" or status == "TO_PROCEED" or status == "LATE":
                uninitialized = False
                supervisions_part2 = []

        if uninitialized:
            supervisions_part2 = Supervision.objects.all()
            supervisions_part2 = supervisions_part2.exclude(execution_date=None)

        # print(supervisions_part1)
        # print(supervisions_part2)

        if supervisions_part1.__len__() == 0:
            return [supervisions_part2]
        if supervisions_part2.__len__() == 0:
            return [supervisions_part1]

        return [supervisions_part1, supervisions_part2]

    def add_row(self, data: dict) -> object:
        """
        Method to register a supervision in the database
        """

        if data['elementId'] is not None:
            if not re.match('A\d+-\d+$', data['elementId']):
                return {
                    'response': True,
                    'message': 'El elemento consultado no posee un formato de identificación correcto.',
                    'id': None
                }
            else:
                theatre_good_id = int(data['elementId'][1:].split('-')[1])

            if not self.dao_element.retrieve_rows({'id': theatre_good_id}).exists():
                return {
                    'response': True,
                    'message': 'No existe un elemento con el ID proporcionado',
                    'id': None
                }
        else:
            if not re.match(r'A([0-9])+$', data['areaId']):
                return {
                    'response': True,
                    'message': 'El área consultado no posee un formato de identificación correcto.',
                    'id': None
                }
            theatre_good_id = int(data['areaId'][1:])
            if not self.dao_area.retrieve_rows({'id': theatre_good_id}).exists():
                return {
                    'response': True,
                    'message': 'No existe un área con el ID proporcionado',
                    'id': None
                }

        if data['responsibleId'] is None:
            return {
                'response': True,
                'message': 'El ID del responsable de la inspección no puede ser vacío',
                'id': None
            }

        if data['startDate'] is None:
            return {
                'response': True,
                'message': 'La fecha de inicio de la inspección no puede ser vacía',
                'id': None
            }

        if data['endDate'] is None:
            return {
                'response': True,
                'message': 'La fecha de fin de la inspección no puede ser vacía',
                'id': None
            }

        if not self.dao_user.find_existing_user(data['responsibleId'], ""):
            return {
                'response': True,
                'message': 'No existe un encargado con el ID proporcionado',
                'id': None
            }

        if not User.objects.filter(id_number=data['responsibleId'], type=Role.objects.get(value='OPERATIVE_USER')):
            return {
                'response': True,
                'message': 'No se puede asignar una inspección a un usuario que no sea operativo ',
                'id': None
            }

        format = "%Y-%m-%d"
        start_date_dt_object = datetime.datetime.strptime(data['startDate'], format)
        end_date_dt_object = datetime.datetime.strptime(data['endDate'], format)

        if start_date_dt_object >= end_date_dt_object:
            return {
                'response': True,
                'message': 'La fecha de inicio debe ser menor a la fecha de fin',
                'id': None
            }

        with connection.cursor() as cursor:
            try:
                cursor.execute(
                    'INSERT INTO SUPERVISION (THEATRE_GOOD_ID,ID_NUMBER,START_DATE,END_DATE) VALUES (%s,%s,%s,%s)',
                    [theatre_good_id, data['responsibleId'], data['startDate'], data['endDate']])
            except Exception as e:
                print(e)
                return {
                    'response': True,
                    'message': 'Error en la inserción en la base de datos. Error: ' + e,
                    'id': None
                }
            cursor.execute('SELECT LAST_INSERT_ID()')
            (id,) = cursor.fetchone()
        return {
            'response': False,
            'message': None,
            'id': id
        }

    def delete_row(self, id: int) -> bool:
        pass

    def update_row(self, type: int, data: dict) -> object:
        """
        Method to update a supervision in the database, if the type is 1 is for conclude the supervision else is for
        modify the supervision
        """

        global validar
        if data['inspectionId'] is None:
            return {
                'response': True,
                'message': 'El ID de la inspección no puede ser vacío.',
                'id': None
            }

        if not Supervision.objects.filter(supervision_id=data['inspectionId']):
            return {
                'response': True,
                'message': 'No existe una inspección con el ID proporcionado.',
                'id': None
            }

        if type == 1:  ###### CONCLUDE INSPECTION ########

            if not Actions.objects.filter(value=data['action']):
                return {
                    'response': True,
                    'message': 'La acción ingresada no existe.',
                    'id': None
                }

            action = Actions.objects.get(value=data['action']).actions_id

            for pdf in data['documentListing']:
                if not self.dao_pdf.add_row({'file': pdf, 'sp_id': data['inspectionId']}):
                    return {
                        'response': True,
                        'message': 'No se pudo adjuntar el PDF.',
                        'id': None
                    }

            with connection.cursor() as cursor:
                try:
                    cursor.execute(
                        'UPDATE SUPERVISION SET ACTION_ID = %s, EXECUTION_DATE = CURDATE() WHERE SUPERVISION_ID = %s ',
                        [action, data['inspectionId']])
                    # cursor.execute('INSERT INTO PDF (VALUE, SUPERVISION_ID, NAME) VALUES(%s,%s,%s)   ',
                    # [data['pdf']['source'], data['inspectionId'], data['pdf']['name']])
                    # cursor.execute(
                    # 'INSERT INTO SUPERVISION_CHANGE_LOG (LAST_CHANGE_ID_NUMBER, SUPERVISION_ID, LAST_CHANGE_DATE) VALUES(%s,%s,CURDATE())   ',
                    # [data['adminId'], data['inspectionId']])

                except Exception as e:
                    print(e)
                    return {
                        'response': True,
                        'message': 'Error en la base de datos. Error: ' + e,
                        'id': None
                    }
            return {
                'response': False,
                'message': None,
                'id': data['inspectionId']
            }

        if type == 2:  ###### UPDATE INSPECTION #######
            if data['responsibleId'] is None:
                return {
                    'response': True,
                    'message': 'El ID del responsable no puede ser vacío.',
                    'id': None
                }
            if data['startDate'] is None:
                return {
                    'response': True,
                    'message': 'La fecha de inicio de la inspección no puede ser vacía',
                    'id': None
                }

            if data['endDate'] is None:
                return {
                    'response': True,
                    'message': 'La fecha de fin de la inspección no puede ser vacía',
                    'id': None
                }

            if not self.dao_user.find_existing_user(data['responsibleId'], ""):
                return {
                    'response': True,
                    'message': 'No existe un encargado con el ID proporcionado',
                    'id': None
                }

            format = "%Y-%m-%d"
            start_date_dt_object = datetime.datetime.strptime(data['startDate'], format)
            end_date_dt_object = datetime.datetime.strptime(data['endDate'], format)

            if start_date_dt_object >= end_date_dt_object:
                return {
                    'response': True,
                    'message': 'La fecha de inicio debe ser menor a la fecha de fin',
                    'id': None
                }
            if data['action'] is None:
                if Supervision.objects.get(supervision_id=data['inspectionId']).action_id is not None:
                    return {
                        'response': True,
                        'message': 'Se debe asignar una acción resultante a una inspección ya finalizada.',
                        'id': None
                    }
                action = None
            else:
                if Supervision.objects.get(supervision_id=data['inspectionId']).action_id is None:
                    return {
                        'response': True,
                        'message': 'Se debe finalizar la inspección primero, en caso de actualizar el tipo de acción '
                                   'y el pdf resultante.',
                        'id': None
                    }

                if not Actions.objects.filter(value=data['action']):
                    return {
                        'response': True,
                        'message': 'La acción ingresada no existe.',
                        'id': None
                    }
                action = Actions.objects.get(value=data['action']).actions_id
                for pdf in data['documentListing']:
                    if not self.dao_pdf.add_row({'file': pdf, 'sp_id': data['inspectionId']}):
                        return {
                            'response': True,
                            'message': 'No se pudo adjuntar el PDF.',
                            'id': None
                        }
            with connection.cursor() as cursor:
                try:
                    cursor.execute(
                        'UPDATE SUPERVISION SET ID_NUMBER = %s,START_DATE = %s, END_DATE = %s, ACTION_ID = %s WHERE '
                        'SUPERVISION_ID = %s ',
                        [data['responsibleId'], data['startDate'], data['endDate'], action, data['inspectionId']])
                    # cursor.execute('INSERT INTO PDF (VALUE, SUPERVISION_ID, NAME) VALUES(%s,%s,%s)   ',
                    # [data['pdf']['source'], data['inspectionId'], data['pdf']['name']])
                    cursor.execute(
                        'INSERT INTO SUPERVISION_CHANGE_LOG (LAST_CHANGE_ID_NUMBER, SUPERVISION_ID, DESCRIPTION, '
                        'LAST_CHANGE_DATE) '
                        'VALUES(%s,%s,%s,CURDATE())',
                        [data['adminId'], data['inspectionId'], "Modificación"])

                except Exception as e:
                    return {
                        'response': True,
                        'message': 'Error en la base de datos. Error: ' + e,
                        'id': None
                    }
            return {
                'response': False,
                'message': None,
                'id': data['inspectionId']
            }

    def retrieve_rows2(self, responsible_id: int = None):
        if not responsible_id:

            dataset = []

            # TO_PROCEED
            to_proceed = Supervision.objects.filter(start_date__gte=datetime.date.today(),
                                                    execution_date=None).count()
            dataset.append({
                "status": "TO_PROCEED",
                "absoluteCount": to_proceed
            })

            # IN_PROGRESS
            in_progress = Supervision.objects.filter(start_date__lte=datetime.date.today(),
                                                     end_date__gte=datetime.date.today(),
                                                     execution_date=None).count()
            dataset.append({
                "status": "IN_PROGRESS",
                "absoluteCount": in_progress
            })

            # LATE
            late = Supervision.objects.exclude(start_date__gt=datetime.date.today())
            late = late.filter(end_date__lt=datetime.date.today(),
                               execution_date=None).count()
            dataset.append({
                "status": "LATE",
                "absoluteCount": late
            })

            # EXECUTED
            executed = Supervision.objects.exclude(execution_date=None)
            executed = executed.raw(
                'SELECT * FROM SUPERVISION WHERE EXECUTION_DATE < END_DATE ORDER BY END_DATE ASC').__len__()
            dataset.append({
                "status": "EXECUTED",
                "absoluteCount": executed
            })

            # EXECUTED_LATE
            executed_late = Supervision.objects.exclude(execution_date=None)
            executed_late = executed_late.raw(
                'SELECT * FROM SUPERVISION WHERE EXECUTION_DATE > END_DATE ORDER BY END_DATE ASC').__len__()
            dataset.append({
                "status": "EXECUTED_LATE",
                "absoluteCount": executed_late
            })

            return dataset

        else:
            supervisions_from_responsible = Supervision.objects.filter(id_number=responsible_id)
            dataset = []

            # TO_PROCEED
            to_proceed = supervisions_from_responsible.filter(start_date__gte=datetime.date.today(),
                                                              execution_date=None).count()
            dataset.append({
                "status": "TO_PROCEED",
                "absoluteCount": to_proceed
            })

            # IN_PROGRESS
            in_progress = supervisions_from_responsible.filter(start_date__lte=datetime.date.today(),
                                                               end_date__gte=datetime.date.today(),
                                                               execution_date=None).count()
            dataset.append({
                "status": "IN_PROGRESS",
                "absoluteCount": in_progress
            })
            # LATE
            late = supervisions_from_responsible.exclude(start_date__gt=datetime.date.today())
            late = late.filter(end_date__lt=datetime.date.today(),
                               execution_date=None).count()
            dataset.append({
                "status": "LATE",
                "absoluteCount": late
            })

            # EXECUTED
            executed = supervisions_from_responsible.exclude(execution_date=None)
            executed = executed.raw(
                'SELECT * FROM SUPERVISION WHERE EXECUTION_DATE < END_DATE AND ID_NUMBER = %s ORDER BY END_DATE ASC',
                [responsible_id]).__len__()
            dataset.append({
                "status": "EXECUTED",
                "absoluteCount": executed
            })

            # EXECUTED_LATE
            executed_late = supervisions_from_responsible.exclude(execution_date=None)
            executed_late = executed_late.raw(
                'SELECT * FROM SUPERVISION WHERE EXECUTION_DATE > END_DATE AND ID_NUMBER = %s ORDER BY END_DATE ASC',
                [responsible_id]).__len__()
            dataset.append({
                "status": "EXECUTED_LATE",
                "absoluteCount": executed_late
            })
            print(dataset)
            return dataset

    def add_change_log(self, admin_id: int, inspection_id: int):

        with connection.cursor() as cursor:
            try:
                cursor.execute(
                    'INSERT INTO SUPERVISION_CHANGE_LOG (LAST_CHANGE_ID_NUMBER, SUPERVISION_ID,DESCRIPTION, '
                    'LAST_CHANGE_DATE) VALUES(%s,%s,%s,CURDATE())   ',
                    [admin_id, inspection_id, "Cierre por administrador"])

            except Exception as e:
                print(e)
                return {
                    'response': True,
                    'message': 'Error en la base de datos. Error: ' + e,
                    'id': None
                }
        return {
                    'response': False,
                    'message': '',
                    'id': admin_id
                }


SupervisionDAO.__doc__ = 'Database object that connects to the database and manages the CRUD actions on the ' \
                         'SUPERVISION table '
