import httpx
import pytest
from fastapi.testclient import TestClient
from main import app
# pip install python-magic-bin se necesita esta dependencia para correr las pruebas
@pytest.fixture
def client():
    return TestClient(app)

base_url = "http://localhost:8000"

def test_login_valid_user():
    # Datos de prueba para un usuario válido
    valid_user_data = {
        "username": "pwd",
        "password": "pwd",
    }

    # Realiza la solicitud POST al endpoint de login
    response = httpx.post(f"{base_url}/token", data=valid_user_data)

    # Verifica que la solicitud se haya realizado correctamente (código de estado 200)
    assert response.status_code == 200

    # Verifica la estructura de la respuesta
    assert "access_token" in response.json()
    assert "token_type" in response.json()
    assert response.json()["token_type"] == "bearer"

    # También puedes verificar otros aspectos específicos de la respuesta según tus necesidades

def test_login_invalid_user():
    # Datos de prueba para un usuario inválido
    invalid_user_data = {
        "username": "usuario_no_existente@dominio.com",
        "password": "contrasena_invalida",
    }

    # Realiza la solicitud POST al endpoint de login
    response = httpx.post(f"{base_url}/token", data=invalid_user_data)

    # Verifica que la solicitud haya fallado debido a credenciales incorrectas (código de estado 401)
    assert response.status_code == 401

    # Verifica que el detalle del error sea el esperado
    assert response.json()["detail"] == "Usuario o contraseña incorrectos"

def test_get_protected_data_unauthenticated_user(client):
    # Realiza la solicitud GET al endpoint protegido sin proporcionar un token de acceso válido
    response = client.get("/protected")

    # Verifica que la solicitud haya fallado debido a la falta de autenticación (código de estado 401)
    assert response.status_code == 401

def test_get_conductor_by_id():
    # Supongamos que tienes un ID de conductor válido
    conductor_id = "659aff69cf9434ddb4171ec3"

    # Realiza la solicitud GET al endpoint para obtener un conductor por ID
    response = httpx.get(f"{base_url}/conductor/{conductor_id}", headers={"accept": "application/json"})

    # Verifica que la solicitud se haya realizado correctamente (código de estado 200)
    assert response.status_code == 200

def test_create_conductor():
    # Datos de prueba para crear un nuevo conductor
    conductor_data = {
        "nombre": "Ana Gabriela",
        "apellidoPaterno": "Vasquez",
        "apellidoMaterno": "Sol",
        "fechaNacimiento": "2001-04-24",
        "numeroLicencia": "XYZDSA",
        "numeroTelefono": "2282522839",
        "activo": True,
        "email": "anaSol@gmail.com",
        "password": "HTML5semantics",
        "tokenSesion": "dsadsadsa"
    }

    # Realiza la solicitud POST al endpoint para crear un nuevo conductor
    response = httpx.post(
        f"{base_url}/conductor/",
        headers={"accept": "application/json", "Content-Type": "application/json"},
        json=conductor_data
    )

    # Verifica que la solicitud se haya realizado correctamente (código de estado 200)
    assert response.status_code == 201

    # Verifica la estructura de la respuesta
    assert "mensaje" in response.json()
    assert response.json()["mensaje"] == "Conductor registrado exitosamente"

def test_get_conductores(client):
    # Realiza la solicitud GET al endpoint para obtener todos los conductores
    response = client.get("/conductores")

    # Verifica que la solicitud se haya realizado correctamente (código de estado 200)
    assert response.status_code == 200

    # Verifica que la respuesta sea una lista de conductores
    assert isinstance(response.json(), list)