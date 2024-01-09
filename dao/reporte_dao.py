from domain.reporte import Report
import logging
from domain.user import User
from connection.mongo_conector import Conector
from pymongo.collection import Collection
from bson import ObjectId
import time
from datetime import datetime,timedelta

logging.basicConfig(
    level=logging.DEBUG,
    filename='usuarioDAO.log',
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


class ReporteDao:

    def generar_Folio(self, id_conductor, aliasAuto, fecha):
        # Tomar los primeros 2 y los últimos 2 caracteres de id_conductor
        id_parte = id_conductor[:2] + id_conductor[-2:]
        # Tomar los primeros 2 caracteres del alias
        aliasAuto_parte = aliasAuto[:2]
        # Obtener la hora actual y formatearla
        hora_parte = datetime.now().strftime("%H%M%S")
        # Extraer los valores numéricos de la fecha
        fecha_numeros = fecha.replace("/", "")
        # Combinar todas las partes para formar el nuevo string
        nuevo_string = id_parte + aliasAuto_parte + hora_parte + fecha_numeros
        return nuevo_string

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

    def registrar_reporte(self, new_report: Report) -> str:
        try:
            data: Collection = self.db.reporte
            report_dict = new_report.model_dump()

            # Insertar el nuevo reporte en la base de datos
            res = data.insert_one(report_dict)

            # Retornar el _id del nuevo registro creado
            return str(res.inserted_id) if res.inserted_id else None

        except Exception as e:
            logging.exception(f"Error al insertar reporte en la base de datos: {e}")
            return None
        
    def get_all_reportes(self):
        try:
            print("get_all_reportes 4")
            data: Collection = self.db.reporte
            print("get_all_reportes 5")
            reportes = list(data.find())
            print("get_all_reportes 6")
            return [Report(**reporte) for reporte in reportes]
        except Exception as e:
            print("get_all_reportes 8")
            print(e)        
            self.logger.exception(f"Error al obtener todos los reportes de la base de datos: {e}")
            return None    

    def get_reportes_without_empleado(self):
        try:
            data: Collection = self.db.reporte
            reportes = list(data.find({"empleado": None}))
            return [Report(**reporte) for reporte in reportes]
        except Exception as e:
            self.logger.exception(f"Error al obtener los reportes sin empleado de la base de datos: {e}")
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
            self.logger.exception("Error al actualizar reporte en la base de datos: {e}")
            return -2      

    def create_reporte(self, folio: str, updated_data: dict) -> int:
        try:
            data: Collection = self.db.reporte
        except Exception as e:
            self.logger.exception("Error al actualizar reporte en la base de datos: {e}")
            return -2   


    def get_reportes_by_email(self, email: str):
        try:
            data: Collection = self.db.reporte
            reportes = list(data.find({"empleadoAsignado": email}))
            return [Report(**reporte) for reporte in reportes]
        except Exception as e:
            logging.exception(f"Error al obtener reportes por correo de empleado asignado: {e}")
            return None
        

    def get_reporte_by_folio(self, folio: str):
        try:
            data: Collection = self.db.reporte
            reporte = data.find_one({"folio": folio})
            if reporte is not None:
                return Report(**reporte)
            else:
                return None
        except Exception as e:
            logging.exception(f"Error al obtener reporte por folio de la base de datos: {e}")
            return None

        
    def update_reporte_by_folio(self, folio: str, updated_data: dict):
        try:
            print(folio)
            print(updated_data)
            data: Collection = self.db.reporte
            print(data)
            existing_data = data.find_one({"folio": folio})
            print(existing_data)
            if existing_data is None:
                return -1
            result = data.update_one({"folio": folio}, {"$set": updated_data})
            if result.modified_count > 0:
                return 0
            else:
                return 1
        except Exception as e:
            logging.exception(f"Error al actualizar reporte por folio en la base de datos: {e}")
            return -2