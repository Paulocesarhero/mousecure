# Modelos Pydantic
from domain.empleado import Empleado
from pydantic import BaseModel

class Report(BaseModel):
    id: str
    fechaDelSiniestro: str
    descripcionDelSiniestro: str
    tipo: str
    fechaDeDictaminacion: str
    descripcionDictamen: str
    dictamen: str
    ubicacion: str
    empleadoAsignado: Empleado
