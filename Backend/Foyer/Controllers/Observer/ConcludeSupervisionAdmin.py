from Foyer.Controllers.Observer.Observer import Observer
from Foyer.Controllers.Observer.Subject import Subject
from Foyer.Models.DAO import SupervisionDAO
from Foyer.Models.DAO.SupervisionDraftDAO import SupervisionDraftDAO


class ConcludeSupervisionAdmin(Observer):

    def __init__(self):
        self.dao_supervision = SupervisionDAO()
        self.dao_supervision_draft = SupervisionDraftDAO()

    def conclude_supervision(self, subject: Subject, input):
        if subject.state == 0:
            print("ConcreteObserverA: Reacted to the event")
            res = self.dao_supervision.update_row(1, input)
            print(res)
            if not res['response']:
                # self.dao_supervision_draft.delete_row(input['inspectionId'])
                self.dao_supervision.add_change_log(input['adminId'], input['inspectionId'])
            return res
