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


