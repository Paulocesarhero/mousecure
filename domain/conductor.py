# Modelos Pydantic
from datetime import date

from pydantic import BaseModel
from typing import Union

class Conductor(BaseModel):
    nombre: str
    apellidoPaterno: str
    apellidoMaterno: str
    fechaNacimiento: date
    numeroLicencia: str
    numeroTelefono: str
    activo: bool
    email: str
    password: str
    tokenSesion: str