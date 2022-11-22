import random
import string

from Foyer.Models.DAO.UserDAO import UserDAO
from Foyer.Models.User import User, Role
from Foyer.Util.GeneralUtil import GeneralUtil
from Foyer.Util.EmailServices import EmailServices
from Foyer.Util.GeneralUtil import check_event_loop
from Foyer.Util.EncryptionUtil import EncryptionUtil
from Foyer.Util.JwtUtil import JwtUtil


class UserAdmin():
    user_dao: UserDAO
    email_service: EmailServices
    encryption_service = EncryptionUtil
    jwt_service = JwtUtil
    

    def __init__(self):
        '''
        Constructor method for UserAdmin
        '''
        super().__init__()
        self.user_dao = UserDAO()
        self.email_service = EmailServices()
        self.encryption_service = EncryptionUtil(b'ubAqCCK5de8ztHOnMW7jAtN1PoaiD8gaza1MytQPyUQ=')
        self.jwt_service = JwtUtil("FoyerSecretKey1234")

    def retrieve_users(self, user_type):
        '''
        Method that contains the logic to retrieve all the users in the system based on their type and return them in a list
        '''
        check_event_loop()  # CHECKS FOR ASYNCIO EVENT LOOP
        users: list[object] = []
        database_response = self.user_dao.retrieve_rows(user_type)
        for user in database_response:
            if user is not None:
                users.append({
                    'user_id': user.user_id,
                    'id': user.id_number,
                    'name': user.name,
                    'surname': user.surname,
                    'email': user.email,
                    'type': user.type.value
                })
        return users

    def register_user(self, id_number, name, surname, email, type):
        '''
        Method that contains the logic to register a new user in the system and send them an email with their temporary password
        '''
        if self.user_dao.find_existing_user(id_number, email) is False:
            tepm_password = GeneralUtil().generate_password(8)
            encrypted_pass = self.encryption_service.encrypt(bytes(tepm_password, 'utf-8'))
            user = User()
            user.id_number = id_number
            user.name = name
            user.surname = surname
            user.email = email
            user.password = encrypted_pass.decode("utf-8")
            user.new_user = 1
            user.type = Role.objects.get(value=type)
            # print(tepm_password)
            self.user_dao.add_row(user)
            self.email_service.email_created_user(email, tepm_password, type)
            return {
                'response': False,
                'message': None
            }
        else:
            return {
                'response': True,
                'message': 'El correo electrónico o número de identificación ya se encuentra registrada en el sisitema, por favor utilice unos diferentes'
            }

    def login(self, email, password):
        '''
        Method that contains the logic to log in a user in the system and return their information if the credentials are correct
        '''
        user = self.user_dao.retrieve_row_by_email(email)
        if user is not None:
            decrypted_pass = self.encryption_service.decrypt(bytes(user.password, 'utf-8'))
            if decrypted_pass.decode("utf-8") == password:

                try:
                    user_data = self.retrieve_user_by_email(email)
                    token = self.jwt_service.encode(user_data)
                    
                    return {
                        'token': token,
                        'user': user_data,
                        'new_user': user.new_user,
                        'response': False,
                        'message': None
                    }

                except Exception as e:
                    return {
                        'token': None,
                        'user': None,
                        'new_user': None,
                        'response': True,
                        'message': 'Error al iniciar sesión: ' + str(e)
                    }

            else:
                return {
                    'token': None,
                    'user': None,
                    'new_user': None,
                    'response': True,
                    'message': 'Inicio de sesión fallido: Contraseña incorrecta'
                }
        else:
            return {
                'token': None,
                'user': None,
                'new_user': None,
                'response': True,
                'message': 'Inicio de sesión fallido: El usuario no existe'
            }

    def first_login(self, email, new_password, password_confirmation):
        '''
        Method that contains the logic to change the password of a user in their first login to the system and return a boolean value indicating if the operation was successful
        '''
        if len(new_password) >= 8 and len(new_password) <= 25:
            if new_password == password_confirmation:
                encrypted_pass = self.encryption_service.encrypt(bytes(new_password, 'utf-8'))
                user = self.user_dao.retrieve_row_by_email(email)
                user.password = encrypted_pass.decode("utf-8")
                user.new_user = 0
                self.user_dao.add_row(user)
                return {
                    'response': False,
                    'message': None
                }
            else:
                return {
                    'response': True,
                    'message': 'Actualización de contraseña fallida: Las contraseñas no coinciden'
                }
        else:
            return {
                'response': True,
                'message': 'Actualización de contraseña fallida: La contraseña debe tener como mínimo 8 dígitos y como máximo 25'
            }

    def recovery_code(self, email):
        '''
        Method that contains the logic to send a recovery code to the email of a user in the system and return a boolean value indicating if the operation was successful
        '''
        if self.user_dao.retrieve_row_by_email(email) is not None:
            user = self.user_dao.retrieve_row_by_email(email)
            code = GeneralUtil().generate_password(6)
            encrypted_code = self.encryption_service.encrypt(bytes(code, 'utf-8'))
            user.password = encrypted_code.decode("utf-8")
            self.user_dao.add_row(user)
            self.email_service.email_recover_password(email, code)
            return {
                'response': False,
                'message': None
            }
        else:
            return {
                'response': True,
                'message': 'Error al enviar código de recuperación: El correo electrónico no se encuentra registrado'
            }

    def password_recovery(self, email, new_password, password_confirmation, recovery_code):
        '''
        Method that contains the logic to change the password of a user in the system in case they forgot it and return a boolean value indicating if the operation was successful
        '''
        user = self.user_dao.retrieve_row_by_email(email)
        decrypted_code = self.encryption_service.decrypt(bytes(user.password, 'utf-8'))
        if decrypted_code.decode("utf-8") == recovery_code:
            if len(new_password) >= 8 and len(new_password) <= 25:
                if new_password == password_confirmation:
                    encrypted_pass = self.encryption_service.encrypt(bytes(new_password, 'utf-8'))
                    user.password = encrypted_pass.decode("utf-8")
                    self.user_dao.add_row(user)
                    return {
                        'response': False,
                        'message': None
                    }
                else:
                    return {
                        'response': True,
                        'message': 'Error al recuperar contraseña: Las contraseñas no coinciden'
                    }
            else:
                return {
                    'response': True,
                    'message': 'Error al recuperar contraseña: La nueva contraseña debe tener como mínimo 8 dígitos y como máximo 25'
                }
        else:
            return {
                'response': True,
                'message': 'Error al recuperar contraseña: El código de recuperación es incorrecto'
            }

    def retrieve_user_by_email(self, email):
        '''
        Method that contains the logic to retrieve a user by their email and return their information
        '''
        user = self.user_dao.retrieve_row_by_email(email)
        if user is not None:
            return {
                'user_id': user.user_id,
                'id': user.id_number,
                'name': user.name,
                'surname': user.surname,
                'email': user.email,
                'type': user.type.value
            }
        else:
            return {
                'id': None,
                'name': None,
                'email': None,
                'type': None
            }


UserAdmin.__doc__ = 'Class to manage the users and the login process in the system'
