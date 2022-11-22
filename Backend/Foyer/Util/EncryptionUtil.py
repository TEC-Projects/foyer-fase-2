import cryptography.fernet

class EncryptionUtil:
    
    def __init__(self, key):
        '''
        Constructor method for the EncryptionUtil class
        '''
        self.key = key

    def encrypt(self, data):
        '''
        Method that contains the logic to encrypt a given string
        '''
        f = cryptography.fernet.Fernet(self.key)
        return f.encrypt(data)

    def decrypt(self, data):
        '''
        Method that contains the logic to decrypt a given string
        '''
        f = cryptography.fernet.Fernet(self.key)
        return f.decrypt(data)

EncryptionUtil.__doc__ = 'Class that contains the logic to encrypt and decrypt passwords'
