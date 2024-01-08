from pydantic import BaseModel
from domain.vehiculo import Vehiculo
from connection.mongo_conector import Conector
from pymongo.collection import Collection
from bson import ObjectId
import logging


from security.Auth_Handler import signJWT,randomString
from security.Auth_Bearer import JWTBearer

logging.basicConfig(
    level=logging.DEBUG,
    filename='vehiculoDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
class VehiculoDao:
    def __init__(self) -> None:
        try:
            self.db = Conector().conectarBD()
        except ConnectionError as e:
            logging.exception(f"Error al conectar a la base de datos: {e}")
            
    def register_vehiculo(self, new_vehiculo: Vehiculo):
     try:
        data: Collection = self.db.vehiculos
        vehiculo_dict = new_vehiculo.dict()
        data.insert_one(vehiculo_dict)
        return 0
     except Exception as e:
        logging.exception(f"Error al registrar vehiculo en la base de datos: {e}")
        return -2
    
    def get_vehiculos_by_conductor(self, idConductor: str):
     try:
        data: Collection = self.db.vehiculos
        vehiculos = list(data.find({"idConductor": idConductor}))
        return [Vehiculo(**vehiculo) for vehiculo in vehiculos]
     except Exception as e:
        self.logger.exception(f"Error al obtener los vehiculos por idConductor de la base de datos: {e}")
        return None
        
   