# Modelos Pydantic
from pydantic import BaseModel
from typing import Optional

class Poliza(BaseModel):
    id: str
    fehcaInicio: str
    fechaFin: str
    idPlan: str
    idVehiculo: str