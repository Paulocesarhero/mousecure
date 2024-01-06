import logging
import magic

from fastapi import Depends, FastAPI, HTTPException, status, Body, UploadFile,File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from starlette import status
from fastapi.middleware.cors import CORSMiddleware

from dao.reporte_dao import ReporteDao
from domain.reporte import Report
from domain.user import User

from dao.user_dao import UserDao
from security.security import get_password_hash

from dao.conductor_dao import ConductorDao
from domain.conductor import Conductor

from domain.empleado import Empleado
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



#Paquetes pa el ejemplo
import time
from datetime import datetime,timedelta
from jose import jwt, JWTError
from pydantic import BaseModel
from typing import Union, List
from passlib.context import CryptContext


#Ejemplo de seguridad, nose, pipipi
oauth2_scheme = OAuth2PasswordBearer("/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "0f8e72c5d72139a7bdd2"
ALGORITHM = "HS256"
# hashear una contraseña
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
#Se crea un "Usuario con un hash almacenado"
nosexd=hash_password("1234")
fake_users_db ={
        "johndoe":{
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": hash_password("1234"),
        "disabled": False,
        #Password: secret
    }
}
#Clases pa que funcione el ejemplo"
class User(BaseModel):
    username:str
    full_name: Union[str,None] = None
    email: Union[str,None] = None
    disabled: Union[bool,None] = None

class UserInDB(User):
    hashed_password: str

#Funcion pa comprobar que el usuario existe"
def get_user(db,username):
    if username in db:
        user_data = db[username]
        prueba = UserInDB(**user_data)
        return UserInDB(**user_data)
    return False

#Funcion pa comprobar que el hash es el mismo"
def verify_password(plane_password,hashed_password):
    return pwd_context.verify(plane_password,hashed_password)

#Funcion pa ver si el usuario existe y la contraseña si es la misma"
def authenticate_user(db,user,password):
    user = get_user(db,user)
    if not user:
        raise HTTPException(status_code=401,detail="nose1", headers={"WWW-Authenticate":"Baerer"})
    if not verify_password(password,user.hashed_password):
        raise HTTPException(status_code=401,detail="nose2", headers={"WWW-Authenticate":"Baerer"})
    return user


def create_token(data:dict,time_expire:Union[datetime,None]=None):
    data_copy = data.copy()
    if time_expire is None:
        expires = datetime.utcnow() +timedelta(minutes=30)
    else:
        expires = datetime.utcnow() + time_expire
    data_copy.update({"exp":expires})
    token_jwt = jwt.encode(data_copy,key=SECRET_KEY,algorithm=ALGORITHM)
    return token_jwt


def get_user_current(token:str = Depends(oauth2_scheme)):
    try:
        token_decode = jwt.decode(token, key=SECRET_KEY, algorithm=[ALGORITHM])
        username = token_decode.get("sub")
        if username == None:
            raise HTTPException(status_code=401,detail="nose2", headers={"WWW-Authenticate":"Baerer"})
    except JWTError:
            raise HTTPException(status_code=401,detail="nose2", headers={"WWW-Authenticate":"Baerer"})
    user = get_user(fake_users_db,username)
    if not user:
        raise HTTPException(status_code=401,detail="nose2", headers={"WWW-Authenticate":"Baerer"})
    return user


def get_user_disabled_current(user:User = Depends(get_user_current)):
    if user.disabled:
        raise HTTPException(status_code=400,detail="nose2")
    return user

#Peticiones para probarla autorizacion"
@app.get("/")
def root():
    return "Hola soy una prueba de fastApi"

@app.get("/users/me")
def user(user: User = Depends(get_user_current)):
    return user

@app.post("/token")
def login_prueba(form_data:OAuth2PasswordRequestForm = Depends()):
    print(form_data.username,form_data.password)
    user = authenticate_user(fake_users_db,form_data.username,form_data.password)
    access_token_expires = timedelta(minutes=30)
    access_token_jwt = create_token({"sub":user.username},access_token_expires)
    return {
        "access_token": access_token_jwt,
        "token_type": "bearer"
    }

#Fin del ejemplo




#Llamada de prueba de login
@app.get("/users/Saludo",dependencies=[Depends(JWTBearer())])
def root():
    return "Hola soy una prueba de fastApi"

@app.post("/users/login",
          status_code=status.HTTP_200_OK)
async def loginPrueba(persona: Union[Conductor, Empleado]):
    personaId = persona.id
    if isinstance(persona, Conductor):
        print("Es un conductor")
        dao = ConductorDao()
        print(personaId)
        try:
            result = dao.create_sesion(personaId)
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
    elif isinstance(persona, Empleado):
        print("Es un Empleado")
        return {"tipo": "Empleado", "datos": persona}
    else:
        raise HTTPException(status_code=400, detail="Datos no válidos")
    




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
    


@app.post("/reporte/create",status_code=status.HTTP_201_CREATED)
async def register_reporte():
    hola = ReporteDao.generar_string("65961da00027c225290c6c6", "Ulsies", "05/08/2023")
    print(hola)
    result = 0
    if result == 0:
        return {"mensaje": "Conductor registrado exitosamente"}
    elif result == -2:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al registrar conductor")
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error desconocido al registrar conductor")
    

# Endpoint para obtener reportes por correo de empleado asignado
@app.get("/reportes/{email}", response_model=list[Report])
async def get_reportes_by_email(email: str, dao: ReporteDao = Depends()):
    try:
        reportes = dao.get_reportes_by_email(email)
        if reportes is None:
            raise HTTPException(status_code=404, detail=f"No se encontraron reportes para el correo {email}")
        return reportes
    except Exception as e:
        logging.exception(f"Error en el endpoint de obtención de reportes por correo de empleado asignado: {e}")
        raise HTTPException(status_code=500, detail="Error del servidor al recuperar los reportes")    