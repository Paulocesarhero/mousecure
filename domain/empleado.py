# Modelos Pydantic
from pydantic import BaseModel
from typing import Optional

class Empleado(BaseModel):
    id: str
    nombre: Optional[str] = None
    apellidoPaterno: Optional[str] = None
    apellidoMaterno: Optional[str] = None
    fechaIngreso: Optional[str] = None
    activo: Optional[bool] = None
    email: Optional[str] = None
    password: Optional[str] = None
    rol: Optional[str] = None
    tokenSesion: Optional[str] = None