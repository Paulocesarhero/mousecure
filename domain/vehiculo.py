# Modelos Pydantic
from pydantic import BaseModel
from typing import Union

class Vehiculo(BaseModel):
    id: str
    anio: int
    color: str
    placas: str
    idConductor: str