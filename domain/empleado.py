# Modelos Pydantic
from pydantic import BaseModel
from typing import Union

class Empleado(BaseModel):
    id: Union[str,None] = None
    nombre: str
    apellidoPaterno: str
    apellidoMaterno: str
    fechaIngreso: str
    activo: bool
    email: str
    password: str
    rol: str
    tokenSesion: str