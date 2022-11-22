

from .IDAO import IDAO
from ..Employee import Employee
from ..User import User
from django.db import connection, transaction, IntegrityError
# from ..EEmployeeType import ActionsOfEmployee
from ..Supervision import Supervision
class EmployeeDAO(IDAO):
    
    def __init__(self):
        '''
        Constructor for EmployeeDAO
        '''
        super().__init__()

    def retrieve_rows(self):
        '''
        Method to retrieve all the employees registered in the database
        '''
        return Employee.objects.select_related().all()

    def find_existing_employee(self, employee_id):
        '''
        Method to check if an employee already exists in the database by its id number
        '''
        if Employee.objects.filter(employee_id=employee_id).exists():
            return True
        else:
            return False

    @transaction.atomic
    def add_row(self, employee_id, company_id, roles):
        '''
        Method to register an employee in the database with the given parameters and roles
        '''
        try:
            with transaction.atomic():
                user = User.objects.get(id_number=employee_id)
                with connection.cursor() as cursor:
                    cursor.execute("INSERT INTO EMPLOYEE (employee_id, email) VALUES (%s, %s)", [employee_id, user.email])
                    cursor.execute("INSERT INTO OUTSIDE_HIRED_EMPLOYEE (employee_id, company_id) VALUES (%s, %s)", [employee_id, company_id])
                    if "INSPECTION" in roles:
                        action_id = 1
                        cursor.execute("INSERT INTO ACTIONS_OF_EMPLOYEE (employee_id, action_id) VALUES (%s, %s)", [employee_id, action_id])
                    if "RESTORATION" in roles:
                        action_id = 2
                        cursor.execute("INSERT INTO ACTIONS_OF_EMPLOYEE (employee_id, action_id) VALUES (%s, %s)", [employee_id, action_id])
                    if "CONSERVATION" in roles:
                        action_id = 3
                        cursor.execute("INSERT INTO ACTIONS_OF_EMPLOYEE (employee_id, action_id) VALUES (%s, %s)", [employee_id, action_id])
        except IntegrityError:
            return False

    transaction.atomic
    def update_row(self, employee_id, company_id, roles):
        '''
        Method to update the information of an employee in the database
        '''
        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("UPDATE OUTSIDE_HIRED_EMPLOYEE SET company_id = %s WHERE employee_id = %s", [company_id, employee_id])
                    cursor.execute("DELETE FROM ACTIONS_OF_EMPLOYEE WHERE employee_id = %s", [employee_id])
                    if "INSPECTION" in roles:
                        action_id = 1
                        cursor.execute("INSERT INTO ACTIONS_OF_EMPLOYEE (employee_id, action_id) VALUES (%s, %s)", [employee_id, action_id])
                    if "RESTORATION" in roles:
                        action_id = 2
                        cursor.execute("INSERT INTO ACTIONS_OF_EMPLOYEE (employee_id, action_id) VALUES (%s, %s)", [employee_id, action_id])
                    if "CONSERVATION" in roles:
                        action_id = 3
                        cursor.execute("INSERT INTO ACTIONS_OF_EMPLOYEE (employee_id, action_id) VALUES (%s, %s)", [employee_id, action_id])
        except IntegrityError:
            return False

    @transaction.atomic
    def delete_row(self, employee_id):
        '''
        Method to delete an employee from the database
        '''
        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("DELETE FROM ACTIONS_OF_EMPLOYEE WHERE employee_id = %s", [employee_id])
                    cursor.execute("DELETE FROM OUTSIDE_HIRED_EMPLOYEE WHERE employee_id = %s", [employee_id])
                    cursor.execute("DELETE FROM EMPLOYEE WHERE employee_id = %s", [employee_id])
        except IntegrityError:
            return False

    def check_if_employee_has_supervisions(self, employee_id):
        '''
        Method to check if an employee has any supervisions
        '''
        if Supervision.objects.filter(id_number=employee_id).exists():
            return True
        else:
            return False

EmployeeDAO.__doc__ = 'Class to manage the employees in the database'