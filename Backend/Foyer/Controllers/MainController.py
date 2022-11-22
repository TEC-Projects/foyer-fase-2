from .EmployeeAdmin import EmployeeAdmin
from .AreaAdmin import AreaAdmin
from .SpoilageAgentAdmin import SpoilageAgentAdmin
from Foyer.Controllers.Observer.SupervisionAdmin import SupervisionAdmin
from .UserAdmin import UserAdmin
from ..Util.GeneralUtil import error


class MainControllerMeta(type):
    area_admin: AreaAdmin
    user_admin: UserAdmin
    spoilage_agent_admin: SpoilageAgentAdmin
    supervision_admin: SupervisionAdmin
    _instances: dict = {}

    def __init__(self, name, bases, dict):
        super().__init__(self)
        self.area_admin = AreaAdmin()
        self.user_admin = UserAdmin()
        self.spoilage_agent_admin = SpoilageAgentAdmin()
        self.employee_admin = EmployeeAdmin()
        self.supervision_admin = SupervisionAdmin()

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class MainController(metaclass=MainControllerMeta):

    ##########################
    # AREA RELATED FUNCTIONS #
    ##########################

    def get_stories(self) -> list[object]:
        return self.area_admin.retrieve_stories()

    def new_area(self, input: dict) -> object:
        return self.area_admin.new_area(input)

    def get_areas(self) -> list[object]:
        return self.area_admin.retrieve_areas()

    def get_area(self, id: str) -> object:
        if id is None:
            return error('El identificador de área no fue proporcionado')
        return self.area_admin.get_area(id)

    def get_full_area(self, id: str) -> object:
        return self.area_admin.get_full_area(id)

    def get_areas_for_report(self) -> list[object]:
        return self.area_admin.retrieve_areas_for_report()

    def delete_area(self, id: str) -> object:
        return self.area_admin.delete_area(id)

    def transfer_element(self, element_id: str, area_id: str) -> object:
        if not element_id or not area_id:
            return error("Se debe especificar ambos el elemento a transferir y el área de destino")
        return self.area_admin.transfer_element(element_id, area_id)

    def get_elements(self, area_id: str) -> list[object]:
        return self.area_admin.retrieve_elements(area_id)

    def get_element(self, id: str) -> object:
        if id is None:
            return error('El identificador de elemento no fue proporcionado')
        return self.area_admin.get_element(id)

    def modify_area(self, input: dict) -> object:
        return self.area_admin.modify_area(input)

    ########################################
    # USER AND EMPLOYEES RELATED FUNCTIONS #
    ########################################

    def retrieve_users(self, user_type):
        '''
        Main controller function that calls the user admin object to retrieve the users list depending on the user type
        '''
        return self.user_admin.retrieve_users(user_type)

    def register_user(self, id_number, name, surname, email, type):
        '''
        Main controller function that calls the user admin object to register a new user
        '''
        return self.user_admin.register_user(id_number, name, surname, email, type)

    def login(self, email, password):
        '''
        Main controller function that calls the user admin object to perform the login of the user
        '''
        return self.user_admin.login(email, password)

    def first_login(self, email, password, password_confirmation):
        '''
        Main controller function that calls the user admin object to change the password of the user in the first login
        '''
        return self.user_admin.first_login(email, password, password_confirmation)

    def recovery_code(self, email):
        '''
        Main controller function that calls the user admin object to send a recovery code to the email of the user
        '''
        return self.user_admin.recovery_code(email)

    def password_recovery(self, email, new_password, password_confirmation, recovery_code):
        '''
        Main controller function that calls the user admin object to recover the password of the user by entering the recovery code
        '''
        return self.user_admin.password_recovery(email, new_password, password_confirmation, recovery_code)

    def retrieve_employees(self, employee_type, company_id, employee_roles):
        '''
        Main controller function that calls the employee admin object to retrieve the employees list
        '''
        return self.employee_admin.retrieve_employees(employee_type, company_id, employee_roles)

    def add_employee(self, employee_id, company_id, roles):
        '''
        Main controller function that calls the employee admin object to add a new employee
        '''
        return self.employee_admin.add_employee(employee_id, company_id, roles)

    def update_employee(self, employee_id, company_id, is_inspector, is_curator, is_restorer):
        '''
        Main controller function that calls the employee admin object to update an employee
        '''
        print("MainController: update_employee")

        return self.employee_admin.update_employee(employee_id, company_id, is_inspector, is_curator, is_restorer)

    def retrieve_companies(self):
        '''
        Main controller function that calls the employee admin object to retrieve the companies list
        '''
        return self.employee_admin.retrieve_companies()

    def add_company(self, company_id, name, email):
        '''
        Main controller function that calls the employee admin object to add a new company
        '''
        return self.employee_admin.add_company(company_id, name, email)

    def update_company(self, company_id, email):
        '''
        Main controller function that calls the employee admin object to update a company
        '''
        return self.employee_admin.update_company(company_id, email)

    def delete_company(self, company_id):
        '''
        Main controller function that calls the employee admin object to delete a company
        '''
        return self.employee_admin.delete_company(company_id)

    def delete_employee(self, employee_id):
        '''
        Main controller function that calls the employee admin object to delete an employee
        '''
        return self.employee_admin.delete_employee(employee_id)

    ##############################
    # SPOILAGE RELATED FUNCTIONS #
    ##############################

    def get_spoilage_agents(self) -> list[object]:
        """
        Main controller function that calls the spoilage agent admin object to retrieve all the spoilage agents
        """
        return self.spoilage_agent_admin.get_spoilage_agents()

    def create_spoilage_agent(self, input) -> int:
        """
        Main controller function that calls the spoilage agent admin object to create a spoilage agent
        """
        return self.spoilage_agent_admin.create_spoilage_agent(input)

    def update_spoilage_agent(self, input) -> int:
        """
        Main controller function that calls the spoilage agent admin object to update a spoilage agent
        """
        return self.spoilage_agent_admin.update_spoilage_agent(input)

    def delete_spoilage_agent(self, id: int):
        """
        Main controller function that calls the spoilage agent admin object to delete a spoilage agent
        """
        if id is None:
            raise Exception("Spoilage agent for delete doesn't exist")
        return self.spoilage_agent_admin.delete_spoilage_agent(id)

    def cud_spoilage_agent(self, input) -> list[object]:
        """
        Main controller function that calls the spoilage agent admin object for the CUD of spoilage agents
        """
        return self.spoilage_agent_admin.cud_spoilage_agent(input)

    #################################
    # SUPERVISION RELATED FUNCTIONS #
    #################################

    def get_filtered_supervisions(self, input):
        """
        Main controller function that calls the supervision admin object to retrieve all the supervision filtered
        """
        return self.supervision_admin.get_filtered_supervisions(input)

    def get_supervision(self, id):
        """
        Main controller function that calls the supervision admin object to retrieve a supervision by ID
        """
        return self.supervision_admin.get_supervision(id)

    def create_supervision(self, input) -> object:
        """
        Main controller function that calls the supervision admin object to create a supervision
        """
        return self.supervision_admin.create_supervision(input)

    def conclude_supervision(self, input) -> object:
        """
        Main controller function that calls the supervision admin object to conclude a supervision
        """
        return self.supervision_admin.conclude_supervision(input)

    def update_supervision(self, input) -> object:
        """
        Main controller function that calls the supervision admin object to update a supervision
        """
        return self.supervision_admin.update_supervision(input)

    def retrieve_supervision_draft(self, id):
        """
        Main controller function that calls the supervision admin object to retrieve a supervision draft
        """
        return self.supervision_admin.retrieve_draft(id)

    def update_supervision_draft(self, input):
        """
        Main controller function that calls the supervision admin object to retreive a supervision draft
        """
        return self.supervision_admin.update_draft(input)

    #################################
    # STATISTICS RELATED FUNCTIONS  #
    #################################
    def get_supervisions_statistics(self):
        return self.supervision_admin.get_supervisions_statistics()

    def get_supervisions_statistics_from_responsible(self, responsibleId):
        return self.supervision_admin.get_supervisions_statistics_from_responsible(responsibleId)
