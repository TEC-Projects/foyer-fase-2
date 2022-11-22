from .IDAO import IDAO
from ..EmployeeCompany import Company
from Foyer.Models.Supervision import Supervision
from Foyer.Models.Employee import Employee
from Foyer.Models.OutsideHiredEmployee import OutsideHiredEmployee

class CompanyDAO(IDAO):

    def __init__(self):
        '''
        Constructor for CompanyDAO
        '''
        super().__init__()

    def retrieve_rows(self):
        '''
        Method to retrieve all the rows registered in the Company table
        '''
        return Company.objects.all()

    def add_row(self, company):
        '''
        Method to add a row to the Company table
        '''
        company.save()

    def find_existing_company(self, company_id, email):
        '''
        Method to check if a company already exists in the database by its id number
        '''
        if Company.objects.filter(id=company_id).exists() or Company.objects.filter(email=email).exists():
            return True
        else:
            return False

    def update_row(self, company_id, email):
        '''
        Method to update a row in the Company table
        '''
        company = Company.objects.get(id=company_id)
        company.email = email
        company.save()

    def find_used_email(self, email):
        '''
        Method to check if an email is already being used by another company
        '''
        if Company.objects.filter(email=email).exists():
            return True
        else:
            return False

    def delete_row(self, company_id):
        '''
        Method to delete a row from the Company table
        '''
        company = Company.objects.get(id=company_id)
        company.delete()

    def check_if_company_has_employees(self, company_id):
        '''
        Method to check if a company has employees
        '''
        if OutsideHiredEmployee.objects.filter(company_id=company_id).exists():
            return True
        else:
            return False



CompanyDAO.__doc__ = 'Class to manage the Company table in the database'

