from pydantic import BaseModel


class User(BaseModel):
    username: str
    password: str
    telefono: str
    rol: str
