# Modelos Pydantic
from pydantic import BaseModel
from typing import Optional

class Poliza(BaseModel):
    id: Optional[str] = None
    fehcaInicio: Optional[str] = None
    fechaFin: Optional[str] = None
    idPlan: Optional[str] = None