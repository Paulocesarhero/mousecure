# Modelos Pydantic
from pydantic import BaseModel
from typing import Union

class Poliza(BaseModel):
    id: str
    fehcaInicio: str
    fechaFin: str
    idPlan: str