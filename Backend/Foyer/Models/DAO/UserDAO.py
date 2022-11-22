from .IDAO import IDAO
from .. import User, Role


class UserDAO(IDAO):

    def __init__(self):
        '''
        Constructor method
        '''
        super().__init__()

    def retrieve_rows(self, user_type):
        '''
        Method to retrieve all the users registered in the database
        '''
        if user_type == 'ADMIN_USER':
            return User.objects.filter(type = Role.objects.get(value='OPERATIVE_USER'))
        elif user_type == 'SUPER_USER':
            return User.objects.filter(type = Role.objects.get(value='DIRECTOR_USER')) | User.objects.filter(type = Role.objects.get(value='ADMIN_USER')) | User.objects.filter(type = Role.objects.get(value='OPERATIVE_USER'))
        else:
            return []

    def add_row(self, user):
        '''
        Method to register a new user in the database
        '''
        user.save()

    def find_row_by_id(self, id_number):
        '''
        Method to find a user by its id number
        '''
        if User.objects.filter(id_number=id_number).exists():
            return True
        else:
            return False

    def retrieve_row_by_email(self, email):
        '''
        Method to retrieve a user by its email address registered in the database
        '''
        if User.objects.filter(email=email).exists():
            return User.objects.get(email=email)
        else:
            return None

    def find_existing_user(self, id_number, email):
        '''
        Method to check if a user already exists in the database by its id number or email address
        '''
        if User.objects.filter(id_number=id_number).exists() or User.objects.filter(email=email).exists():
            return True
        else:
            return False

UserDAO.__doc__ = 'Data access object for manage the users in the database'
