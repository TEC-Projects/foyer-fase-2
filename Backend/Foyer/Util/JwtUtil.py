import jwt

class JwtUtil:

    def __init__(self, secret_key):
        self.secret_key = secret_key

    def encode(self, payload):
        try:
            return jwt.encode(payload, self.secret_key, algorithm='HS256')
        except:
            raise Exception('Error en el encoding de JWT')

    def decode(self, token):
        try:
            return jwt.decode(token, self.secret_key, algorithms=['HS256'])
        except:
            raise Exception('Error decoding JWT')

    def verify_token(self, token):
        try:
            self.decode(token)
        except:
            raise Exception('Error verifying JWT')

    def get_token(self, headers):

        # headers.get('Authorization') == None
        if('Authorization' not in headers):
            raise Exception("Header")

        token = headers['Authorization']
        tokens = token.split(' ')

        if(len(tokens) != 2):
            raise Exception('Invalid Authorization header')

        return tokens[1]