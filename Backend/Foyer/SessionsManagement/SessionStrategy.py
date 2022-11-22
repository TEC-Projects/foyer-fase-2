from abc import ABC, abstractmethod

class SessionStrategy(ABC):

    @abstractmethod
    def check_authorization(self, query : str):
        pass