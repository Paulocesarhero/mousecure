from pydantic import BaseModel

import security
from domain.empleado import Empleado
from connection.mongo_conector import Conector
from pymongo.collection import Collection
from bson import ObjectId
from typing import Union, List
import logging


logging.basicConfig(
    level=logging.DEBUG,
    filename='conductorDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

class EmpleadoDAO:
    def __init__(self) -> None:
        try:
            self.db = Conector().conectarBD()
        except ConnectionError as e:
            logging.exception(f"Error al conectar a la base de datos: {e}")



    def register_empleado(self, new_Empleado: Empleado):
        try:
            data: Collection = self.db.empleados
            empleado_dict = new_Empleado.dict(exclude={"id"})
            data.insert_one(empleado_dict)
            return 0
        except Exception as e:
            logging.exception(f"Error al registrar Empleado en la base de datos: {e}")
            return -2

    def update_empleado(self, empleado_id: str, updated_data: dict) -> int:
        try:
            data: Collection = self.db.empleados
            existing_data = data.find_one({"_id": ObjectId(empleado_id)})
            if existing_data is None:
                logging.error(f"No se encontró el Empleado con ID {empleado_id}")                
                return -1     
            result = data.update_one({"_id": ObjectId(empleado_id)}, {"$set": updated_data})        
            if result.modified_count > 0:
                return 0  
            else:
                return 1  
        except Exception as e:
            logging.exception(f"Error al actualizar Empleado en la base de datos: {e}")
            return -2


    def delete_empleado(self, empleado_id: str):
        try:
            data: Collection = self.db.empleados
            result = data.delete_one({"_id": ObjectId(empleado_id)})
            if result.deleted_count > 0:
                return True
            else:
                return False
        except Exception as e:
            logging.exception(f"Error al eliminar empleado en la base de datos: {e}")
            return False


    def get_all_empleados(self) -> Union[List[Empleado], str]:
        try:
            data: Collection = self.db.empleados
            # Especificar campos para incluir en los resultados
            empleados_crudos = list(data.find({"activo": True}, {"_id": 1, "nombre": 1, "apellidoPaterno": 1, "apellidoMaterno": 1,"rol": 1}))
            if not empleados_crudos:
                return "No hay empleados activos disponibles."
            empleados = []
            for empleado in empleados_crudos:
                # Convertir _id de MongoDB a id en el modelo Empleado
                empleado['id'] = str(empleado['_id'])
                del empleado['_id']
                try:
                    empleado_modelo = Empleado(**empleado)
                    empleados.append(empleado_modelo)
                except Exception:
                    logging.exception("Error al convertir empleado a modelo:  {e}")
            return empleados
        except Exception as e:
            logging.exception("Error al obtener empleados de la base de datos: {e}")
            return []
        

    def get_empleado_activo_by_id(self, empleado_id: str)-> List[Empleado]:
        try:
            data: Collection = self.db.empleados
            filtro = {"_id": ObjectId(empleado_id), "activo": True}
            proyeccion = {"password": 0, "tokenSesion": 0}
            empleado_crudo = data.find_one(filtro, proyeccion)
            if empleado_crudo:
                # Convertir _id de MongoDB a id en el modelo Empleado
                empleado_crudo['id'] = str(empleado_crudo['_id'])
                del empleado_crudo['_id']
                return Empleado(**empleado_crudo)
            else:
                return None
        except Exception as e:
            logging.exception(f"Error al obtener empleado de la base de datos: {e}")
            return None
