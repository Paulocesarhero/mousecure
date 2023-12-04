# Modelos Pydantic
from pydantic import BaseModel


class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str


class User(BaseModel):
    name: str
    age: int
    address: Address


