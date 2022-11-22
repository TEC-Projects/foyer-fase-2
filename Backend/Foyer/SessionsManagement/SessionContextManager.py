from Foyer.SessionsManagement.SessionStrategy import SessionStrategy

class SessionContextManager():

    session_strategy = SessionStrategy

    def __init__(self, s: SessionStrategy):
        self.session_strategy = s

    def add_strategy(self, s: SessionStrategy):
        self.session_strategy = s

    def check_session_token(self, query: str):
        self.session_strategy.check_authorization(query)

