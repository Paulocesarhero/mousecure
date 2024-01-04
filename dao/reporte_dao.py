from domain.reporte import Report
import logging
from domain.user import User
from connection.mongo_conector import Conector
from pymongo.collection import Collection
from bson import ObjectId

logging.basicConfig(
    level=logging.DEBUG,
    filename='usuarioDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


class ReporteDao:
    def __init__(self) -> None:
        try:
            self.db = Conector().conectarBD()
        except ConnectionError as e:
            logging.exception(f"Error al conectar a la base de datos: {e}")

    def create_report_with_Employee(self, new_report: Report):
        try:
            data: Collection = self.db.reporte
            user_dict = new_report.model_dump()
            user_dict["empleadoAsignado"] = new_report.empleadoAsignado.model_dump()
            data.insert_one(user_dict)
            return 0
        except Exception as e:
            logging.exception(f"Error al insertar usuario en la base de datos: {e}")
            return -2        
        
    def get_all_reportes(self):
        try:
            data: Collection = self.db.reporte
            reportes = list(data.find())
            return [Report(**reporte) for reporte in reportes]
        except Exception as e:
            self.logger.exception(f"Error al obtener todos los reportes de la base de datos: {e}")
            return None    
        

    def update_reporte(self, reporte_id: str, updated_data: dict) -> int:
        try:
            data: Collection = self.db.reporte
            existing_data = data.find_one({"_id": ObjectId(reporte_id)})
            if existing_data is None:
                self.logger.error(f"No se encontró el reporte con ID {reporte_id}")
                return -1
            result = data.update_one({"_id": ObjectId(reporte_id)}, {"$set": updated_data})
            if result.modified_count > 0:
                return 0
            else:
                return 1
        except Exception as e:
            self.logger.exception(f"Error al actualizar reporte en la base de datos: {e}")
            return -2        