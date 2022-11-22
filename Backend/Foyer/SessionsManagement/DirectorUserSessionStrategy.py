from Foyer.SessionsManagement.SessionStrategy import SessionStrategy

class DirectorUserSessionStrategy(SessionStrategy):

    authorized_queries = [

        # RESPONSIBLE QUERIES
        "retrieveCompanies",
        "retrieveEmployees",

        # AREA QUERIES
        "getAreasListing",
        "getAreaDetail",
        "getElementsListing",
        "getElementDetail",
        "getFullAreas",

        # SUPERVISION QUERIES
        "getFilteredSupervisions",
        "getSupervision",

        # SPOILAGE AGENTS QUERIES
        "getSpoilageAgents",

        # STATS QUERIES
        "getSupervisionsStatistics",
        "getSupervisionsStatisticsFromResponsible",
        

    ]

    def check_authorization(self, query: str):
        if(query not in self.authorized_queries):
            raise Exception("Permisos insuficientes. Petición no autorizada")