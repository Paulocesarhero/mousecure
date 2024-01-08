import logging
from typing import Any, Mapping, Optional

from fastapi.security import OAuth2PasswordBearer

import security.security
from domain.user import User
from connection.mongo_conector import Conector
from pymongo.collection import Collection

from bson import ObjectId  # Importa ObjectId para manejar los ID de MongoDB
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

logging.basicConfig(
    level=logging.INFO,
    filename='usuarioDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


class UserDao:
    def __init__(self) -> None:
        try:
            self.db = Conector().conectarBD()
        except ConnectionError as e:
            logging.exception(f"Error al conectar a la base de datos: {e}")

    def create_user_in_db(self, user: User) -> int:
        try:
            data: Collection = self.db.users
            user_dict = user.model_dump()
            # Asegúrate de aplicar .model_dump() recursivamente a objetos anidados
            user_dict["address"] = user.address.model_dump()
            data.insert_one(user_dict)
            return 0
        except Exception as e:
            logging.exception(f"Error al insertar usuario en la base de datos: {e}")
            return -2

    def check_credentials(self, email: str, password: str) -> dict:
        try:
            conductor_data: Collection = self.db.conductores
            empleado_data: Collection = self.db.empleados

            logging.info(f"Verificando credenciales para email: {email}")

            # Buscar en la colección de Conductor
            conductor_result = self._find_user(conductor_data, email)

            # Buscar en la colección de Empleado
            empleado_result = self._find_user(empleado_data, email)

            if conductor_result and self._verify_password(password, conductor_result["password"]):
                logging.info(f"Resultado de búsqueda en conductor_data: {conductor_result}")
                logging.info(f"Resultado de búsqueda en empleado_data: {empleado_result}")
                return self._process_result(conductor_result, empleado_result)

        except Exception as e:
            logging.exception(f"Error al verificar credenciales en la base de datos: {e}")

        return {"user_type": None, "user_id": None, "result": -2}

    def _find_user(self, collection: Collection, email: str) -> Optional[dict]:
        return collection.find_one({"email": email})

    def _verify_password(self, input_password: str, hashed_password: str) -> bool:
        return security.security.verificarPassword(input_password, hashed_password)

    def _process_result(self, conductor_result, empleado_result) -> dict:
        if conductor_result:
            return {"user_type": "conductor", "user_id": str(conductor_result["_id"]), "result": 1}
        elif empleado_result:
            if empleado_result["rol"] == "ajustador":
                return {"user_type": "ajustador", "user_id": str(empleado_result["_id"]), "result": 1}
            return {"user_type": "empleado", "user_id": str(empleado_result["_id"]), "result": 1}
        else:
            return {"user_type": None, "user_id": None, "result": 0}


