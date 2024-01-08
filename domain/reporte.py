# Modelos Pydantic
from domain.empleado import Empleado
from pydantic import BaseModel
from typing import Optional


class Report(BaseModel):
    folio: Optional[str] = None
    fechaDelSiniestro: Optional[str] = None
    descripcionDelSiniestro: Optional[str] = None
    tipo: Optional[str] = None
    vehiculo: Optional[str] = None
    ubicacion: Optional[str] = None
    empleadoAsignado: Optional[str] = None
    fechaDeDictaminacion: Optional[str] = None
    descripcionDictamen: Optional[str] = None
    dictamen: Optional[str] = None