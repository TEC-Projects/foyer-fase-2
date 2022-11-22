from Foyer.Controllers.Observer.Observer import Observer
from Foyer.Controllers.Observer.Subject import Subject
from Foyer.Models.DAO import SupervisionDAO
from Foyer.Models.DAO.SupervisionDraftDAO import SupervisionDraftDAO


class ConcludeSupervisionOperative(Observer):

    def __init__(self):
        self.dao_supervision = SupervisionDAO()
        self.dao_supervision_draft = SupervisionDraftDAO()

    def conclude_supervision(self, subject: Subject, input):
        if subject.state == 1:
            print("ConcreteObserverB: Reacted to the event")
            print(input)
            res = self.dao_supervision.update_row(1, input)
            if 'response' not in res:
                # self.dao_supervision_draft.delete_row(input['inspection_id'])
                pass
            return res
