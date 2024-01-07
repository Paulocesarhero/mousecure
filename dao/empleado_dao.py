import security.security
from domain.conductor import Conductor
from connection.mongo_conector import Conector
from pymongo.collection import Collection
from bson import ObjectId
import logging

from domain.empleado import Empleado
from security.Auth_Handler import signJWT, randomString
from security.Auth_Bearer import JWTBearer

logging.basicConfig(
    level=logging.DEBUG,
    filename='conductorDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


class EmpleadoDao:
    def __init__(self) -> None:
        try:
            self.db = Conector().conectarBD()
        except ConnectionError as e:
            logging.exception(f"Error al conectar a la base de datos: {e}")

    def register_empleado(self, new_empleado: Empleado):
        try:
            data: Collection = self.db.empleados
            hashed_password = security.security.get_password_hash(new_empleado.password)
            new_empleado.password = hashed_password
            empleado_dict = new_empleado.model_dump()

            data.insert_one(empleado_dict)
            return 0
        except Exception as e:
            logging.exception(f"Error al registrar empleado en la base de datos: {e}")
            return -2
