from abc import ABC, abstractmethod

from Foyer.Controllers.Observer import Observer


class Subject(ABC):

    @abstractmethod
    def attach(self, observer: Observer) -> None:
        pass

    @abstractmethod
    def detach(self, observer: Observer) -> None:
        pass

    @abstractmethod
    def notify(self, input) -> None:
        pass
