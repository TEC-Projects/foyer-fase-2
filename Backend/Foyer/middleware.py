from Foyer.SessionsManagement.SessionContextManager import SessionContextManager
from Foyer.SessionsManagement.AdminUserSessionStrategy import AdminUserSessionStrategy
from Foyer.SessionsManagement.SuperUserSessionStrategy import SuperUserSessionStrategy
from Foyer.SessionsManagement.OperativeUserSessionStrategy import OperativeUserSessionStrategy
from Foyer.SessionsManagement.DirectorUserSessionStrategy import DirectorUserSessionStrategy
from Foyer.Util.JwtUtil import JwtUtil


class AuthMiddleware(object):

    jwt_service = JwtUtil
    session_context_manager = SessionContextManager

    def __init__(self):
        
        self.jwt_service = JwtUtil("FoyerSecretKey1234")
        self.session_context_manager = SessionContextManager(None)
        
    def process_request(self, headers, query):
        
        token = self.jwt_service.get_token(headers)
        self.jwt_service.verify_token(token)

        user_data = self.jwt_service.decode(token)
        user_type = user_data.get('type')

        #Apply strategy
        if user_type == 'ADMIN_USER':
            self.session_context_manager.add_strategy(AdminUserSessionStrategy())
            self.session_context_manager.check_session_token(query)

        if user_type == 'SUPER_USER':
            self.session_context_manager.add_strategy(SuperUserSessionStrategy())
            self.session_context_manager.check_session_token(query)

        if user_type == 'OPERATIVE_USER':
            self.session_context_manager.add_strategy(OperativeUserSessionStrategy())
            self.session_context_manager.check_session_token(query)

        if user_type == 'DIRECTOR_USER':
            self.session_context_manager.add_strategy(DirectorUserSessionStrategy())
            self.session_context_manager.check_session_token(query)
    
    def resolve(self, next, root, info, **args):
        
        excluded_queries = [
            '__schema',
            'login', 
            'firstLogin', 
            'recoveryCode', 
            'passwordRecovery'
            ]

        if ((root is None) and info.path.key not in excluded_queries):
            self.process_request(info.context.headers, info.path.key)

        return next(root, info, **args)


