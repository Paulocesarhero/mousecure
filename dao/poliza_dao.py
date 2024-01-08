from pydantic import BaseModel
from domain.poliza import Poliza
from connection.mongo_conector import Conector
from pymongo.collection import Collection
from bson import ObjectId
import logging


from security.Auth_Handler import signJWT,randomString
from security.Auth_Bearer import JWTBearer

logging.basicConfig(
    level=logging.DEBUG,
    filename='polizaDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
class PolizaDao:
    def __init__(self) -> None:
        try:
            self.db = Conector().conectarBD()
        except ConnectionError as e:
            logging.exception(f"Error al conectar a la base de datos: {e}")
            
    def register_poliza(self, new_poliza: Poliza):
     try:
        data: Collection = self.db.polizas
        poliza_dict = new_poliza.dict()
        data.insert_one(poliza_dict)
        return 0
     except Exception as e:
        logging.exception(f"Error al registrar conductor en la base de datos: {e}")
        return -2
    
    
    def update_poliza(self, vehiculo_id: str, updated_data: dict) -> int:
        try:
            data: Collection = self.db.polizas
            existing_data = data.find_one({"idVehiculo": vehiculo_id})
            if existing_data is None:
                logging.error(f"No se encontró la poliza con ID del vehiculo: {vehiculo_id}")                
                return -1         
            result = data.update_one({"idVehiculo": vehiculo_id}, {"$set": updated_data})   
            if result.modified_count > 0:
                return 0  
            else:
                return 1  
        except Exception as e:
            logging.exception(f"Error al actualizar la poliza en BD: {e}")
            return -2
        
    def get_poliza_by_idVehiculo(self, vehiculo_id: str) -> Poliza:
        try:
            data: Collection = self.db.polizas
            existing_data = data.find_one({"idVehiculo": vehiculo_id})

            if existing_data is None:
                logging.error(f"No se encontró la poliza con ID de este vehiculo {vehiculo_id}")                
                return None  
            existing_data['id'] = str(existing_data['_id'])
            print(existing_data['id'])
            del existing_data['_id']           
            Poliza = existing_data
            return Poliza
        except Exception as e:
            logging.exception(f"Error al obtener la poliza  en la base de datos: {e}")
            return None
        
        
   