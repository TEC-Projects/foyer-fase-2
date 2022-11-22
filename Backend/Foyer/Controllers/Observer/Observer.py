from abc import ABC, abstractmethod

from Foyer.Controllers.Observer.Subject import Subject  # PUEDE QUE CAMBIE


class Observer(ABC):
    """
    The Observer interface declares the update method, used by subjects.
    """

    @abstractmethod
    def conclude_supervision(self, subject: Subject, input):
        """
        Receive update from subject.
        """
        pass
