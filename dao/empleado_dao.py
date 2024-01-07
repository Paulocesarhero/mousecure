from pydantic import BaseModel
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
            logging.exception(f"Error al registrar conductor en la base de datos: {e}")
            return -2


    def delete_empleado(self, empleado_id: str):
        try:
            print(empleado_id)
            data: Collection = self.db.empleados
            result = data.delete_one({"_id": ObjectId(empleado_id)})
            print(data)
            if result.deleted_count > 0:
                return True  # El empleado fue eliminado
            else:
                return False  # No se encontró el empleado con ese ID
        except Exception as e:
            logging.exception(f"Error al eliminar empleado en la base de datos: {e}")
            return False


    def get_all_empleados(self) -> List[Empleado]:
        try:
            data: Collection = self.db.empleados
            # Especificar campos para incluir en los resultados
            empleados_crudos = list(data.find({}, {"_id": 1, "nombre": 1, "apellidoPaterno": 1, "apellidoMaterno": 1}))
            empleados = []
            for empleado in empleados_crudos:
                # Convertir _id de MongoDB a id en el modelo Empleado
                empleado['id'] = str(empleado['_id'])
                del empleado['_id']
                try:
                    empleado_modelo = Empleado(**empleado)
                    empleados.append(empleado_modelo)
                    print("Empleado modelo:", empleado_modelo)
                except Exception as e:
                    print(f"Error al convertir empleado a modelo: {e}")
            return empleados
        except Exception as e:
            logging.exception(f"Error al obtener empleados de la base de datos: {e}")
            return []