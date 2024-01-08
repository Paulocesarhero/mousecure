# Modelos Pydantic
from pydantic import BaseModel
from typing import Optional

class Vehiculo(BaseModel):
    id: Optional[str] = None
    alias:Optional[str] = None
    modelo: Optional[str] = None
    marca: Optional[str] = None
    anio: Optional[str] = None
    color: Optional[str] = None
    placas: Optional[str] = None
    idConductor: Optional[str] = None