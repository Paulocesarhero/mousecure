from pydantic import BaseModel
from domain.conductor import Conductor
from connection.mongo_conector import Conector
from pymongo.collection import Collection
from bson import ObjectId
import logging

logging.basicConfig(
    level=logging.DEBUG,
    filename='conductorDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

class ConductorDao:
    def __init__(self) -> None:
        try:
            self.db = Conector().conectarBD()
        except ConnectionError as e:
            logging.exception(f"Error al conectar a la base de datos: {e}")

# DAO-Driver para registrar un nuevo conductor (Eliminar o modificar de ser necesario)
    def register_conductor(self, new_conductor: Conductor):
        try:
            data: Collection = self.db.conductores
            conductor_dict = new_conductor.dict()
            data.insert_one(conductor_dict)
            return 0
        except Exception as e:
            logging.exception(f"Error al registrar conductor en la base de datos: {e}")
            return -2


    def update_conductor(self, conductor_id: str, updated_data: dict) -> int:
        try:
            data: Collection = self.db.conductores
            existing_data = data.find_one({"_id": ObjectId(conductor_id)})
            if existing_data is None:
                logging.error(f"No se encontró el conductor con ID {conductor_id}")                
                return -1            
            result = data.update_one({"_id": ObjectId(conductor_id)}, {"$set": updated_data})        
            if result.modified_count > 0:
                return 0  
            else:
                return 1  
        except Exception as e:
            logging.exception(f"Error al actualizar conductor en la base de datos: {e}")
            return -2