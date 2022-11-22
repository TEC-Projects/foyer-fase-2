from Foyer.SessionsManagement.SessionStrategy import SessionStrategy

class AdminUserSessionStrategy(SessionStrategy):

    authorized_queries = [

        # USER QUERIES
        "retrieveUsers",

        # RESPONSIBLE QUERIES
        "retrieveCompanies",
        "retrieveEmployees",
        "addCompany",
        "addEmployee",
        "updateEmployee",
        "updateCompany",
        "deleteCompany",
        "deleteEmployee",

        # AREA QUERIES
        "getAreasListing",
        "getAreaDetail",
        "getElementsListing",
        "getElementDetail",
        "getFullAreas",
        "getFullArea",
        "transferElement",
        "newArea",
        "deleteArea",
        "modifyArea",

        # SUPERVISION QUERIES
        "getFilteredSupervisions",
        "getSupervision",
        "concludeSupervision",
        "createSupervision",
        "updateSupervision",
        "retrieveSupervisionDraft",

        # SPOILAGE AGENTS QUERIES
        "getSpoilageAgents",
        "cudSpoilageAgent",
        
    ]

    def check_authorization(self, query: str):
        if(query not in self.authorized_queries):
            raise Exception("Permisos insuficientes. Petición no autorizada")