from pydantic import BaseModel
from typing import Union

class Plan(BaseModel):
    id: str
    precio: str
    descripcion: str