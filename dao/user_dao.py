import logging
from domain.user import User
from connection.mongo_conector import Conector
from pymongo.errors import PyMongoError
from pymongo.database import Database
from pymongo.collection import Collection

logging.basicConfig(
    level=logging.DEBUG,
    filename='usuarioDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


class UserDao:
    db: Database = None

    def __init__(self) -> None:
        try:
            self.db = Conector().conectarBD()
        except PyMongoError as e:
            logging.error(f"Error al conectar a la base de datos: {e}")

    def create_new_user(self, newUser: User) -> int:
        try:
            data: Collection = self.db.users
            if data.find_one({"username": newUser.username}):
                logging.warning(f"Usuario ya existente en la BD")
                return -1

            data.insert_one(dict(newUser))
            logging.info(f"Usuario creado: {newUser.username}")
            return 0

        except PyMongoError as e:
            logging.error(f"Error al crear el usuario: {e}")
            return -2

    def get_user(self, username: str) -> User:
        try:
            data: Collection = self.db.users

            usuarioDict = data.find_one({"username": username})
            if usuarioDict:
                user_retrieved = User(username=usuarioDict["username"], password=usuarioDict["password"],
                                  telefono=usuarioDict["telefono"], rol=usuarioDict["rol"])
                logging.info(f"Usuario obtenido: {username}")
                return user_retrieved

            logging.warning(f"Usuario no encontrado en la BD: {username}")
            return None

        except PyMongoError as e:
            logging.error(f"Error al obtener el usuario: {e}")
            return None

    def update_user(self, username: str, fields: dict) -> int:
        try:
            data: Collection = self.db.users

            if not data.find_one({"username": username}):
                logging.warning(f"Usuario no encontrado en la BD: {username}")
                return -1

            data.update_one({"username": username}, {"$set": fields})
            logging.info(f"Usuario actualizado: {username}")
            return 0

        except PyMongoError as e:
            logging.error(f"Error al actualizar el usuario: {e}")
            return -2

    def delete_user(self, username: str) -> int:
        try:
            data: Collection = self.db.users

            if not data.find_one({"username": username}):
                logging.warning(f"Usuario no encontrado en la BD: {username}")
                return -1

            data.delete_one({"username": username})
            logging.info(f"Usuario eliminado: {username}")
            return 0

        except PyMongoError as e:
            logging.error(f"Error al eliminar el usuario: {e}")
            return -2

