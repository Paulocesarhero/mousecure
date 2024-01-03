import logging

from fastapi import FastAPI, HTTPException
from starlette import status
from fastapi.middleware.cors import CORSMiddleware

from dao.reporte_dao import ReporteDao
from domain.reporte import Report
from domain.user import User

from dao.user_dao import UserDao
from security.security import get_password_hash

from dao.conductor_dao import ConductorDao
from domain.conductor import Conductor

app = FastAPI(title="Mousecure", version="ALPHA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos
    allow_headers=["*"],  # Permite todos los headers
)

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
        return {"mensaje": f"Usuario creado: Ulises"}
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
        return {"mensaje": f"Reporte creado: Reporte exitoso"}
    elif result == -1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario existente en la BD")
    else:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al crear usuario")


# Endpoint para modificar un conductor
@app.put("/conductor/{conductor_id}", status_code=status.HTTP_200_OK)
async def update_conductor(conductor_id: str, updated_data: dict):
    dao = ConductorDao()
    try:
        result = dao.update_conductor(conductor_id, updated_data)
        
        if result == 0:
            return {"mensaje": "Conductor actualizado exitosamente"}
        elif result == 1:
            return {"mensaje": "El conductor ya tiene los datos proporcionados, no se realizó ninguna actualización"}
        elif result == -1:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conductor no encontrado")
        elif result == -2:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al actualizar conductor")
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al actualizar conductor")
    except Exception as e:
        logging.exception(f"Error en el endpoint de actualización de conductor: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor al actualizar conductor")
    

# Endpoint-Driver para registrar un nuevo conductor (Eliminar o modificar de ser necesario)
@app.post("/conductor/", status_code=status.HTTP_201_CREATED)
async def register_conductor(new_conductor: Conductor):
    dao = ConductorDao()
    result = dao.register_conductor(new_conductor)
    if result == 0:
        return {"mensaje": "Conductor registrado exitosamente"}
    elif result == -2:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al registrar conductor")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al registrar conductor")

# Endpoint para obtener un conductor por ID
@app.get("/conductor/{conductor_id}", response_model=Conductor)
async def get_conductor_by_id(conductor_id: str):
    dao = ConductorDao()
    try:
        conductor = dao.get_conductor_by_id(conductor_id)
        if conductor is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontrado")                    
        else:
            return conductor
    except HTTPException as exceptionHTTP:
        raise exceptionHTTP
    except Exception as exceptionHTTP:
        logging.exception(f"Error en el endpoint de obtención de conductor por ID: {exceptionHTTP}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor al obtener conductor por ID")
    

# Endpoint para obtener todos los reportes
@app.get("/reportes", response_model=list[Report])
async def get_all_reportes():
    dao = ReporteDao()
    try:
        reportes = dao.get_all_reportes()
        if reportes is None:
            raise HTTPException(status_code=404, detail="No se encontraron reportes")
        return reportes
    except HTTPException as exceptionHTTP:
        raise exceptionHTTP
    except Exception as exceptionHTTP:
        logging.exception(f"Error en la obtención de todos los reportes: {exceptionHTTP}")
        raise HTTPException(status_code=500, detail="Error del servidor al recuperar los reportes")
    

# Endpoint para actualizar el reporte
@app.put("/reporte/{reporte_id}", status_code=status.HTTP_200_OK)
async def update_reporte(reporte_id: str, updated_data: dict):
    dao = ReporteDao()
    try:
        result = dao.update_reporte(reporte_id, updated_data)        
        if result == 0:
            return {"mensaje": "Reporte actualizado exitosamente"}
        elif result == 1:
            return {"mensaje": "El reporte ya tiene los datos proporcionados, no se realizó ninguna actualización"}
        elif result == -1:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reporte no encontrado")
        elif result == -2:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al actualizar reporte")
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al actualizar reporte")
    except Exception as e:
        logging.exception(f"Error en el endpoint de actualización de reporte: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor al actualizar reporte")    