import logging

from fastapi import FastAPI, HTTPException
from starlette import status

from dao.reporte_dao import ReporteDao
from domain.reporte import Report
from domain.user import User

from dao.user_dao import UserDao
from security.security import get_password_hash

app = FastAPI(title="Mousecure", version="ALPHA")

logging.basicConfig(
    level=logging.DEBUG,
    filename='usuarioDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


# Endpoint para crear un usuario
@app.post("/users/",
          status_code=status.HTTP_201_CREATED)
async def create_user(user: User):
    dao = UserDao()
    result = dao.create_user_in_db(user)
    if result == 0:
        return {"mensaje": f"Usuario creado: "}
    elif result == -1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario existente en la BD")
    else:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al crear usuario")


@app.post("/report/",
          status_code=status.HTTP_201_CREATED)
async def create_report_employee(new_report: Report):
    dao = ReporteDao()
    result = dao.create_report_with_Employee(new_report)
    if result == 0:
        return {"mensaje": f"Usuario creado: "}
    elif result == -1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario existente en la BD")
    else:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al crear usuario")
