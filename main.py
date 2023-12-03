from fastapi import FastAPI, HTTPException
from starlette import status
from domain.user import User
from dao.user_dao import UserDao
from security.security import get_password_hash

app = FastAPI(title="Mousecure", version="ALPHA")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.post("/usuarios",
          status_code=status.HTTP_201_CREATED,
          summary="Crear usuario",
          tags=["Usuarios"])
def crear_usuario(new_user: User):
    """
    Crea un nuevo usuario en la BD.

    **Parámetros**:
    `usuario`: Un objeto `Usuario` con la información del nuevo usuario.

    **Retorna**:
    - Un mensaje que indica si el usuario fue creado exitosamente.

    **Excepciones**:
    - HTTPException: Si el usuario ya existe en la base de datos o si hay un error al crearlo.
    """
    dao = UserDao()

    hashed_password = get_password_hash(new_user.password)
    new_user.password = hashed_password

    resultado = dao.create_new_user(new_user)
    if resultado == 0:
        return {"mensaje": f"Usuario creado: {new_user.username}"}
    elif resultado == -1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario existente en la BD")
    else:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Error al crear usuario")