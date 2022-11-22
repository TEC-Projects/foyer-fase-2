from Foyer.SessionsManagement.SessionStrategy import SessionStrategy

class OperativeUserSessionStrategy(SessionStrategy):

    authorized_queries = [

        # AREA QUERIES
        "getAreaDetail",
        "getElementsListing",
        "getElementDetail",

        # SUPERVISION QUERIES
        "getFilteredSupervisions",
        "getSupervision",
        "concludeSupervision",
        "saveSupervisionDraft",
        "retrieveSupervisionDraft",

        # SPOILAGE AGENTS QUERIES
        "getSpoilageAgents",

    ]

    def check_authorization(self, query: str):
        if(query not in self.authorized_queries):
            raise Exception("Permisos insuficientes. Petición no autorizada")