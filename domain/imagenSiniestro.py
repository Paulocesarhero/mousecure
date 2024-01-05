# Modelos Pydantic
from pydantic import BaseModel

class Imagen(BaseModel):
    id: str
    idReporte: str