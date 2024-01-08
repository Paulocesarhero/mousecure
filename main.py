import logging
from datetime import timedelta
from Fm.file_manager import FManager

import magic

from fastapi import Depends, FastAPI, HTTPException, status, Body, UploadFile,File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from starlette import status
from fastapi.middleware.cors import CORSMiddleware

import security
from dao.empleado_dao import  EmpleadoDAO
from dao.reporte_dao import ReporteDao
from dao.poliza_dao import PolizaDao
from dao.vehiculo_dao import VehiculoDao


from domain.reporte import Report
from domain.token import Token
from domain.user import User
from domain.poliza import Poliza
from domain.vehiculo import Vehiculo

from dao.user_dao import UserDao
from security.security import get_password_hash, create_access_token

from dao.conductor_dao import ConductorDao
from domain.conductor import Conductor

from dao.empleado_dao import EmpleadoDAO
from domain.empleado import Empleado

from dao.reporte_dao import ReporteDao
from domain.reporte import Report
from domain.imagenSiniestro import Imagen


from security.Auth_Handler import signJWT
from security.Auth_Bearer import JWTBearer

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

# Dependencia para obtener el token de autorización
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Ruta para obtener un token JWT (iniciar sesión)
@app.post("/token", tags=["Login"], response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Verificar login del usuario

    Parámetros:
    - form_data: objeto OAuth2PasswordRequestForm: formulario de solicitud de contraseña con los siguientes campos:
        - username (str): En este caso será el email.
        - password (str): contraseña del usuario.

    Retorna:
    - barrer token con los siguiente datos encriptados
        - email (str)
        - id (str) de la bd mongo
        - tipo (str) empleado o conductor

    Excepciones:
    - HTTPException(status_code=401, detail="Usuario o contraseña incorrectos"): si el usuario no existe o la contraseña es incorrecta.
    """
    dao = UserDao()
    result = dao.check_credentials(form_data.username, form_data.password)

    if result["result"] == 1:
        user_type = result["user_type"]
        if user_type == "conductor" or user_type == "empleado":
            # Realiza acciones específicas para conductores o empleados
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"email": form_data.username,
                      "tipo": user_type,
                      "id": result["user_id"]
                      }, expires_delta=access_token_expires)
            return {"access_token": access_token, "token_type": "bearer"}
        else:
            raise HTTPException(status_code=401, detail="Tipo de usuario no válido")
    else:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")





@app.get("/protected",summary="Obtiene los datos actuales de la sesión",
          tags=["Login"])
async def get_protected_data(current_user: dict = Depends(security.security.get_current_user)):
    return {"message": "You have access to this protected data!", "current_user": current_user}

# Endpoint para modificar un conductor
@app.put("/conductor/{conductor_id}", summary="Modificar conductor",
         tags=["Conductor"], status_code=status.HTTP_200_OK)
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
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Error desconocido al actualizar conductor")
    except Exception as e:
        logging.exception(f"Error en el endpoint de actualización de conductor: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error interno del servidor al actualizar conductor")


# Endpoint-Driver para registrar un nuevo conductor (Eliminar o modificar de ser necesario)
@app.post("/conductor/", summary="Registrar conductor",
          tags=["Conductor"], status_code=status.HTTP_201_CREATED)
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
@app.get("/conductor/{conductor_id}", summary="Obtener id conductor",
         tags=["Conductor"], response_model=Conductor)
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
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error interno del servidor al obtener conductor por ID")


# Endpoint para obtener todos los reportes
@app.get("/reportes/", summary="Obtener reporte",
         tags=["Reporte"], response_model=list[Report])
async def get_all_reportes():
    print("get_all_reportes 1")
    dao = ReporteDao()
    print("get_all_reportes 2")
    try:
        print("get_all_reportes 3")
        reportes = dao.get_all_reportes()
        print("get_all_reportes 6")
        if reportes is None:
            raise HTTPException(status_code=404, detail="No se encontraron reportes")
        return reportes
    except HTTPException as exceptionHTTP:
        raise exceptionHTTP
    except Exception as exceptionHTTP:
        print("get_all_reportes 7")
        logging.exception(f"Error en la obtención de todos los reportes: {exceptionHTTP}")
        print(exceptionHTTP)
        raise HTTPException(status_code=500, detail="Error del servidor al recuperar los reportes")


# Endpoint para actualizar el reporte
@app.put("/reporte/{reporte_id}", summary="Actualizar reporte",
         tags=["Reporte"], status_code=status.HTTP_200_OK)
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
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Error desconocido al actualizar reporte")
    except Exception as e:
        logging.exception(f"Error en el endpoint de actualización de reporte: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Error interno del servidor al actualizar reporte")


@app.post("/reporte/create", summary="Crear reporte",
          tags=["Reporte"], status_code=status.HTTP_201_CREATED)
async def register_reporte(new_report: Report):
    dao = ReporteDao()
    idmongo = dao.registrar_reporte(new_report)
    # Procesar imágenes
    # manager = file_manager()
    # await manager.guardar_imagen(image, idmongo)
    if idmongo != "":
        return {"mensaje": f"Reporte registraodo {idmongo}"}
    else:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al registrar reporte")

@app.post("/reporte/create/imagen", summary="Guardar imagen reporte",
          tags=["Reporte"], status_code=status.HTTP_201_CREATED)
async def register_reporte_imagen(image: UploadFile = File(...), idmongo: str = 'default'):
    # Procesar imágenes
    manager = FManager()
    if await manager.guardar_imagen(image, idmongo):
        return {"mensaje": f"Imagen registrado {idmongo}"}
    else:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al registrar reporte")
    
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al registrar reporte")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al registrar conductor")
    
# Endpoint-Vehiculo para registrar un nuevo vehiculo 
@app.post("/vehiculo/create", status_code=status.HTTP_201_CREATED)
async def register_vehiculo(new_vehiculo: Vehiculo):
    dao = VehiculoDao()
    result = dao.register_vehiculo(new_vehiculo)
    if result == 0:
        return {"mensaje": "Vehiculo registrado exitosamente"}
    elif result == -2:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al registrar el vehiculo")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al registrar el vehiculo")
    
# Endpoint para obtener todos los vehiculos de un conductor
@app.get("/vehiculos/{idConductor}", response_model=list[Vehiculo])
async def get_all_vehiculos_by_idConductor(idConductor: str):
    dao = VehiculoDao()
    try:
        vehiculos = dao.get_vehiculos_by_conductor(idConductor)
        if vehiculos is None:
            raise HTTPException(status_code=404, detail="No se encontraron vehiculos")
        return vehiculos
    except HTTPException as exceptionHTTP:
        raise exceptionHTTP
    except Exception as exceptionHTTP:
        logging.exception(f"Error en la obtención de todos los vehiulos: {exceptionHTTP}")
        raise HTTPException(status_code=500, detail="Error del servidor al recuperar los vehiculos")
    
# Endpoint-Poliza para registrar un nueva poliza 
@app.post("/poliza/create", status_code=status.HTTP_201_CREATED)
async def register_poliza(new_poliza: Poliza):
    dao = PolizaDao()
    result = dao.register_poliza(new_poliza)
    if result == 0:
     return {"mensaje": "Poliza registrado exitosamente"}
    elif result == -2:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al registrar una Poliza")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al registrar una Poliza")

# Endpoint-Poliza para actualizar un nueva poliza 
@app.put("/poliza/update{vehiculo_id}", status_code=status.HTTP_200_OK)
async def update_poliza(vehiculo_id: str, updated_data: dict):
    dao = PolizaDao()
    try:
        result = dao.update_poliza(vehiculo_id, updated_data)        
        if result == 0:
            return {"mensaje": "Poliza actualizado exitosamente"}
        elif result == 1:
            return {"mensaje": "La Poliza ya tiene los datos proporcionados, no se realizó ninguna actualización"}
        elif result == -1:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Poliza no encontrado")
        elif result == -2:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al actualizar la Poliza")
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al actualizar la Poliza")
    except Exception as e:
        logging.exception(f"Error en el endpoint de actualización de la Poliza: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor al actualizar la Poliza") 
    
# Endpoint para obtener una poliza por ID de vehiculo
@app.get("/poliza/{vehiculo_id}", response_model=Poliza)
async def get_poliza_by_idVehiculo(vehiculo_id: str):
    dao = PolizaDao()
    try:
        poliza = dao.get_poliza_by_idVehiculo(vehiculo_id)
        if poliza is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se ha encontrado")                    
        else:
            return poliza
    except HTTPException as exceptionHTTP:
        raise exceptionHTTP
    except Exception as exceptionHTTP:
        logging.exception(f"Error en el endpoint de obtención de la poliza por ID: {exceptionHTTP}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor al obtener poliza por ID")
       

#End points de Empleado
#End-point para registrar un nuevo empleado
@app.post("/empleados/registrar", status_code=status.HTTP_201_CREATED)
async def register_empleado(new_Empleado: Empleado):
    dao = EmpleadoDAO()
    result = dao.register_empleado(new_Empleado)
    if result == 0:
        return {"mensaje": "Empleado registrado exitosamente"}
    elif result == -2:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al registrar Empleado")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al registrar Empleado")

#End-point para eliminar un empleado
@app.delete("/empleados/eliminar/{empleado_id}", status_code=status.HTTP_200_OK)
async def delete_empleado(empleado_id: str):
    dao = EmpleadoDAO()
    if dao.delete_empleado(empleado_id):
        return {"mensaje": "Empleado eliminado exitosamente"}
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado")
    
#End-point para obtener a todos los empleados (ID, Nombre, apelldios y Tipo y si esta activo)
@app.get("/empleados", status_code=status.HTTP_200_OK)
async def get_all_empleados():
    dao = EmpleadoDAO()
    empleados = dao.get_all_empleados()
    return empleados

#End-point para obtener un empleado (Todo menos paassword y tokensesion)
@app.get("/empleados/{empleado_id}", status_code=status.HTTP_200_OK)
async def get_empleado_activo_by_id(empleado_id: str):
    dao = EmpleadoDAO()
    empleado = dao.get_empleado_activo_by_id(empleado_id)
    if empleado:
        return empleado
    else:
        return {"mensaje": "No hay empleado disponibles"}

# Endpoint para modificar y desactivar a un empleado
@app.put("/empleado/modificar/{empleado_id}", status_code=status.HTTP_200_OK)
async def update_empleado(empleado_id: str, updated_data: dict):
    dao = EmpleadoDAO()
    try:
        result = dao.update_empleado(empleado_id, updated_data)
        if result == 0:
            return {"mensaje": "Empleado actualizado exitosamente"}
        elif result == 1:
            return {"mensaje": "El Empleado ya tiene los datos proporcionados, no se realizó ninguna actualización"}
        elif result == -1:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado")
        elif result == -2:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al actualizar Empleado")
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al actualizar Empleado")
    except Exception as e:
        logging.exception(f"Error en el endpoint de actualización de Empleado: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error interno del servidor al actualizar Empleado")
