from domain.reporte import Report
import logging
from domain.user import User
from connection.mongo_conector import Conector
from pymongo.collection import Collection

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
