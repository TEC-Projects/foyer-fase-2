from Foyer.SessionsManagement.SessionStrategy import SessionStrategy


class SuperUserSessionStrategy(SessionStrategy):

    authorized_queries = [

        # USER QUERIES
        "retrieveUsers",
        "registerUser",

    ]

    def check_authorization(self, query: str):
        if(query not in self.authorized_queries):
            raise Exception("Permisos insuficientes. Petición no autorizada")

