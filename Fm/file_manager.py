from fastapi import UploadFile

RUTA_BIBLIOTECA: str = "Biblioteca"


class FManager:
    def __init__(self) -> None:
        self.rutaBiblioteca = RUTA_BIBLIOTECA

    async def guardar_imagen(self, documento: UploadFile, nombre_documento: str):
        try:
            image_path = f"{self.rutaBiblioteca}/{nombre_documento}.png"
            with open(image_path, "wb") as buffer:
                buffer.write(await documento.read())
            return True

        except Exception as e:
            return False