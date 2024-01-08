# Modelos Pydantic
from datetime import date

from pydantic import BaseModel
from typing import Optional

class Conductor(BaseModel):
    id: Optional[str] = None
    nombre: Optional[str] = None
    apellidoPaterno: Optional[str] = None
    apellidoMaterno: Optional[str] = None
    fechaNacimiento: Optional[str] = None
    numeroLicencia: Optional[str] = None
    numeroTelefono: Optional[str] = None
    activo: Optional[bool] = None
    email: Optional[str] = None
    password: Optional[str] = None
    tokenSesion: Optional[str] = None
