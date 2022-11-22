import datetime
from abc import ABC
from traceback import print_exc

from Foyer.Controllers.Observer import Observer
from Foyer.Controllers.Observer.ConcludeSupervisionAdmin import ConcludeSupervisionAdmin
from Foyer.Controllers.Observer.ConcludeSupervisionOperative import ConcludeSupervisionOperative
from Foyer.Controllers.Observer.Subject import Subject
from Foyer.Models import Actions, Employee, Company
from Foyer.Models.SupervisionDraft import SupervisionDraft
from Foyer.Models.DAO import SupervisionDAO, AreaDAO, ElementDAO, EmployeeDAO
from Foyer.Models.DAO.PdfDAO import PdfDAO
from Foyer.Models.DAO.SupervisionChangeLogDAO import SupervisionChangeLogDAO
from Foyer.Models.DAO.SupervisionDraftDAO import SupervisionDraftDAO
from Foyer.Util import check_event_loop


class SupervisionAdmin(Subject):
    dao_supervision: SupervisionDAO
    dao_area: AreaDAO
    dao_element: ElementDAO
    dao_pdf: PdfDAO
    dao_supervision_change_log: SupervisionChangeLogDAO
    dao_employee: EmployeeDAO
    dao_supervision_draft: SupervisionDraftDAO
    # OBSERVER
    state: int
    observers: list[Observer]

    def __init__(self):
        """
        Constructor method for SupervisionAdmin
        """
        super().__init__()
        self.dao_supervision = SupervisionDAO()
        self.dao_area = AreaDAO()
        self.dao_element = ElementDAO()
        self.dao_pdf = PdfDAO()
        self.dao_supervision_change_log = SupervisionChangeLogDAO()
        self.dao_supervision_draft = SupervisionDraftDAO()
        self.state = None
        self.observers = [ConcludeSupervisionAdmin(), ConcludeSupervisionOperative()]

    def attach(self, observer: Observer) -> None:
        self.observers.append(observer)

    def detach(self, observer: Observer) -> None:
        self.observers.remove(observer)

    def notify(self, input):
        print("Subject: Notifying observers...")
        for observer in self.observers:
            res = observer.conclude_supervision(self, input)
            if res is not None:
                return res

    def get_supervisions_statistics(self):
        return self.dao_supervision.retrieve_rows2()

    def get_supervisions_statistics_from_responsible(self, responsibleId):
        check_event_loop()
        if not Employee.objects.filter(employee_id=responsibleId).exists():
            return {'response': True,
                    'message': 'No existe un encargado asociado al ID ingresado.',
                    'dataset': None,
                    'responsible': None}
        dataset = self.dao_supervision.retrieve_rows2(responsibleId)
        database_response = Employee.objects.select_related().filter(employee_id=responsibleId)
        print(database_response)
        for employee in database_response:
            if employee is not None:
                roles = []
                for action in employee.action.all():
                    roles.append(action.value)

                company: Company = employee.company.get()
                if company.id == "3007110978":
                    employee_type = 'INTERNAL'
                else:
                    employee_type = 'CONTRACTOR'

                user = employee.user
                responsible = {
                    'id': str(employee.employee_id),
                    'user': {
                        'user_id': user.user_id,
                        'id': user.id_number,
                        'name': user.name,
                        'surname': user.surname,
                        'email': user.email,
                        'type': user.type.value
                    },
                    'company_name': company.name,
                    'role': roles,
                    'type': employee_type
                }

        return {'response': False,
                'message': '',
                'dataset': dataset,
                'responsible': responsible}

    def get_filtered_supervisions(self, input):
        """
        Method that contains the logic to retrieve all the supervisions in the system filtered and
        return them in a list
        """
        check_event_loop()
        supervisions: list[object] = []
        database_response = self.dao_supervision.retrieve_rows(filter=input)

        for query_set in database_response:
            for supervision in query_set:
                if supervision.supervision_id is not None:

                    ###### TYPE OF SUPERVISION ########
                    area = self.dao_area.retrieve_rows({'id': supervision.theatre_good_id})
                    element = self.dao_element.retrieve_rows({'id': supervision.theatre_good_id})
                    type_of_theatre_good = None
                    if area.__len__() == 0 and element.__len__() == 0:
                        raise Exception("No existe un área o elemento con dicho id")
                    else:
                        if area.__len__() == 0:
                            type_of_theatre_good = "ELEMENT"
                        if element.__len__() == 0:
                            type_of_theatre_good = "AREA"

                        ###### STATUS OF SUPERVISION ###################
                        status = None
                        today = datetime.date.today()
                        if input['status'] is not None:
                            status = input['status']
                        else:
                            if supervision.execution_date is None:
                                if today < supervision.start_date:
                                    status = "TO_PROCEED"
                                if supervision.start_date <= today <= supervision.end_date:
                                    if supervision.action_id is None:
                                        status = "IN_PROGRESS"
                                if supervision.end_date < today:
                                    status = "LATE"
                            else:
                                if supervision.execution_date < supervision.end_date:
                                    status = "EXECUTED"
                                else:
                                    status = "EXECUTED_LATE"
                    #### ACTION OF SUPERVISION ##############
                    if supervision.action_id is None:
                        action = None
                    else:
                        action_supervision = Actions.objects.filter(actions_id=supervision.action_id.actions_id).first()
                        if action_supervision is None:
                            action = None
                        else:
                            action = action_supervision.value

                    ### EXECUTION DATE ######
                    if supervision.execution_date is None:
                        execution_date = None
                    else:
                        execution_date = str(supervision.execution_date)

                    theatre_good_id: str
                    if type_of_theatre_good == 'AREA':
                        theatre_good_id = 'A' + str(supervision.theatre_good.id)
                    else:
                        holder = element.first()
                        theatre_good_id = 'A' + str(holder.area.info.id) + '-' + str(supervision.theatre_good.id)

                    supervisions.append({
                        'id': supervision.supervision_id,
                        'toBeInspected': {
                            'id': theatre_good_id,
                            'name': supervision.theatre_good.name,
                            'type': type_of_theatre_good
                        },
                        'responsible': {
                            'id': supervision.id_number.id_number,
                            'name': supervision.id_number.name + " " + supervision.id_number.surname

                        },
                        'status': status,
                        'startDate': str(supervision.start_date),
                        'endDate': str(supervision.end_date),
                        'executionDate': execution_date,
                        'action': action
                    })
        return supervisions

    def get_supervision(self, id):
        """
        Method that contains the logic to retrieve a supervision filtered by the ID
        """

        filter = {
            'inspectionId': id,
            'responsibleId': None,
            'startDate': None,
            'endDate': None,
            'status': None
        }
        database_response = self.dao_supervision.retrieve_rows(filter=filter)
        for query_set in database_response:
            if query_set:
                supervision = query_set.first()

            ###### TYPE OF SUPERVISION ########
            area = self.dao_area.retrieve_rows({'id': supervision.theatre_good_id})
            element = self.dao_element.retrieve_rows({'id': supervision.theatre_good_id})
            type_of_theatre_good = None
            if area.__len__() == 0 and element.__len__() == 0:
                raise Exception("No existe un área o elemento con dicho id")
            else:
                if area.__len__() == 0:
                    type_of_theatre_good = "ELEMENT"
                if element.__len__() == 0:
                    type_of_theatre_good = "AREA"

            ###### STATUS OF SUPERVISION ###################
            status = None
            today = datetime.date.today()

            if supervision.execution_date is None:
                if today < supervision.start_date:
                    status = "TO_PROCEED"
                if supervision.start_date <= today <= supervision.end_date:
                    if supervision.action_id is None:
                        status = "IN_PROGRESS"
                if supervision.end_date < today:
                    status = "LATE"
            else:
                if supervision.execution_date < supervision.end_date:
                    status = "EXECUTED"
                else:
                    status = "EXECUTED_LATE"

            #### ACTION OF SUPERVISION ##############
            if supervision.action_id is None:
                action = None
            else:
                action_supervision = Actions.objects.filter(actions_id=supervision.action_id.actions_id).first()
                if action_supervision is None:
                    action = None
                else:
                    action = action_supervision.value

            ### EXECUTION DATE ######
            if supervision.execution_date is None:
                execution_date = None
            else:
                execution_date = str(supervision.execution_date)

            ###### LIST OF PDFS ##############
            documentsListing: list[object] = []
            pdfs = self.dao_pdf.retrieve_rows({'sp_id': id})
            for pdf in pdfs:
                if pdf.pdf_id is not None:
                    documentsListing.append({
                        'name': pdf.name,
                        'source': pdf.value
                    })
            ###### LIST OF CHANGE LOG ##############
            updateLog: list[object] = []
            change_logs = self.dao_supervision_change_log.retrieve_rows({'sp_id': id})
            if change_logs:
                for change_log in change_logs:
                    if change_log.supervision_change_log_id is not None:
                        updateLog.append({
                            'authorName': change_log.last_change_user_id.name + " " + change_log.last_change_user_id.surname,
                            'date': str(change_log.last_change_date),
                            'description': change_log.description
                        })

            ##### SUPERVISION COMPLETE ##############
            theatre_good_id: str
            if type_of_theatre_good == 'AREA':
                theatre_good_id = 'A' + str(supervision.theatre_good.id)
            else:
                holder = element.first()
                theatre_good_id = 'A' + str(holder.area.info.id) + '-' + str(supervision.theatre_good.id)

            return {
                'id': supervision.supervision_id,
                'toBeInspected': {
                    'id': theatre_good_id,
                    'name': supervision.theatre_good.name,
                    'type': type_of_theatre_good
                },
                'responsible': {
                    'id': supervision.id_number.id_number,
                    'name': supervision.id_number.name + " " + supervision.id_number.surname

                },
                'status': status,  # "MOMENTÁNEO", #supervision.status_id.value,
                'startDate': str(supervision.start_date),
                'endDate': str(supervision.end_date),
                'executionDate': execution_date,
                'action': action,
                'documentsListing': documentsListing,
                'updateLog': updateLog
            }

    def create_supervision(self, input) -> object:
        """
        Method that calls the supervision dao for create a supervision
        """
        return self.dao_supervision.add_row(input)

    def conclude_supervision(self, input) -> object:
        """
        Method that calls the supervision for update a supervision with the type 1 for conclude
        """
        if input['adminId'] is None:
            self.state = 1
        else:
            self.state = 0

        return self.notify(input)

    def update_supervision(self, input) -> object:
        """
        Method that calls the supervision dao for update a supervision with the type 2 for modify
        """
        return self.dao_supervision.update_row(2, input)

    def retrieve_draft(self, id: str) -> object:
        if SupervisionDraft.objects.filter(supervision_draft_id=id).exists():
            return self.dao_supervision_draft.retrieve_rows({'id': id})
        else:
            return {
                'has_draft_been_found': False
            }

    def update_draft(self, input: dict):
        try:
            if SupervisionDraft.objects.filter(supervision_draft_id=input['id']).exists():
                self.dao_supervision_draft.update_row(input['id'], input)
            else:
                self.dao_supervision_draft.add_row(input)
            return {
                'response': False,
                'message': None
            }
        except Exception as e:
            print_exc()
            return {
                'response': True,
                'message': "No se pudo guardar el borrador, por favor intente más tarde."
            }
