import logging
from domain.user import User
from connection.mongo_conector import Conector
from pymongo.collection import Collection

logging.basicConfig(
    level=logging.DEBUG,
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

            # Buscar en la colección de Conductor
            conductor_result = conductor_data.find({"email": email, "password": password})

            # Buscar en la colección de Empleado
            empleado_result = empleado_data.find({"email": email, "password": password})

            # Verificar si se encontró en alguna de las colecciones
            if conductor_result.count() > 0:
                return {"user_type": "conductor", "result": 1}  # Conductor encontrado
            elif empleado_result.count() > 0:
                return {"user_type": "empleado", "result": 1}  # Empleado encontrado
            else:
                return {"user_type": None, "result": 0}  # Credenciales no encontradas
        except Exception as e:
            logging.exception(f"Error al verificar credenciales en la base de datos: {e}")
            return {"user_type": None, "result": -2}


