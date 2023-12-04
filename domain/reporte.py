# Modelos Pydantic
from pydantic import BaseModel


class Employee(BaseModel):
    nombre: str
    apellidoPaterno: str
    apellidoMaterno: str
    fechaIngreso: str
    activo: bool
    email: str
    password: str
    rol: str


class Report(BaseModel):
    fechaDelSiniestro: str
    fechaDeDictaminacion: str
    descripcionDictamen: str
    dictamen: str
    Ubicacion: str
    tipo: str
    descripcionDelSiniestro: str
    empleadoAsignado: Employee
