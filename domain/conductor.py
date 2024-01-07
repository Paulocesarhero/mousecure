# Modelos Pydantic
from pydantic import BaseModel
from typing import Union

class Conductor(BaseModel):
    nombre: str
    apellidoPaterno: str
    apellidoMaterno: str
    fechaNacimiento: str
    numeroLicencia: str
    numeroTelefono: str
    activo: bool
    email: str
    password: str
    tokenSesion: str