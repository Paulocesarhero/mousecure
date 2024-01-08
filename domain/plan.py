from pydantic import BaseModel
from typing import Optional

class Plan(BaseModel):
    id: Optional[str] = None
    precio: Optional[str] = None
    descripcion: Optional[str] = None