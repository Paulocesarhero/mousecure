import time, string, random, jwt
from decouple import config

JWT_SECRET = config("SECRET_KEY")
JWT_ALGORITHM = config("ALGORITHM")

def token_response(token:str):
    return {
        "tokenSesion": token
    }


def signJWT(userID:str):
    payload = {
        "userID": userID,
        "expiry": time.time()+36000
    }
    token_bytes = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    token_str = token_bytes.decode('utf-8')
    return token_response(token_str)


def decodeJWT(token:str):      
    try:     
        decode_token = jwt.decode(token,JWT_SECRET,algorithm=JWT_ALGORITHM) 
        if decode_token['expiry']>=time.time():
            return True
        else:
            return{}
    except:
        return{}


def randomString():
    caracteres = string.ascii_letters + string.digits
    return ''.join(random.choice(caracteres) for _ in range(2))