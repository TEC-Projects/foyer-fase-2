from Foyer.Models.DAO.SpoilageAgentDAO import SpoilageAgentDAO
from Foyer.Models.ESpoilageAgentType import SpoilageAgentType
from Foyer.Util import check_event_loop
from Foyer.Models.SpoilageAgent import SpoilageAgent


class SpoilageAgentAdmin():

    def __init__(self):
        """
        Constructor method for SpoilageAgentAdmin
        """
        super().__init__()
        self.dao_spoilage_agent = SpoilageAgentDAO()

    def get_spoilage_agents(self) -> list:
        """
        Method that contains the logic to retrieve all the spoilage agents in the system based on their type and
        return them in a list
        """
        check_event_loop()
        spoilage_agents: list[object] = []
        database_response = self.dao_spoilage_agent.retrieve_rows()
        for sp in database_response:
            if sp.spoilage_agent_id is not None:
                spoilage_agents.append({
                    'id': sp.spoilage_agent_id,
                    'name': sp.name,
                    'type': sp.type.value
                })
        return spoilage_agents

    def create_spoilage_agent(self, input) -> int:
        return self.dao_spoilage_agent.add_row(input)

    def update_spoilage_agent(self, input) -> int:
        return self.dao_spoilage_agent.update_row(input)

    def delete_spoilage_agent(self, id):
        return self.dao_spoilage_agent.delete_row(id)

    def cud_spoilage_agent(self, input):
        """
        Method that calls the spoilage agent dao for the CUD of the spoilage agents
        """
        created_spoilage_agents = input['createdSpoilageAgents']
        updated_spoilage_agents = input['updatedSpoilageAgents']
        deleted_spoilage_agents = input['deletedSpoilageAgents']

        response = {}
        created_sa_response: list[object] = []
        updated_sa_response: list[object] = []
        deleted_sa_response: list[object] = []

        if len(created_spoilage_agents) == 0:
            response['created_sa_response'] = []
        else:
            for data in created_spoilage_agents:
                e = self.dao_spoilage_agent.add_row(data)
                if e['response']:
                    created_sa_response.append(e)

            response['created_sa_response'] = created_sa_response

        if len(updated_spoilage_agents) == 0:
            response['updated_sa_response'] = []
        else:
            for data in updated_spoilage_agents:
                e = self.dao_spoilage_agent.update_row(data)
                if e['response']:
                    updated_sa_response.append(e)

            response['updated_sa_response'] = updated_sa_response

        if len(deleted_spoilage_agents) == 0:
            response['deleted_sa_response'] = []
        else:
            for data in deleted_spoilage_agents:
                e = self.dao_spoilage_agent.delete_row(data)
                if e['response']:
                    deleted_sa_response.append(e)

            response['deleted_sa_response'] = deleted_sa_response

        return response
