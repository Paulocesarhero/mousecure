// Función para enviar la solicitud con Axios
function submitForm() {
    const url = `${baseURL}/conductor/`;
    var password1 = document.getElementById('password').value;
    var password2 = document.getElementById('password2').value;
    if (password1 === password2) {


        // Obtener los datos del formulario
        var formData = {
            nombre: document.getElementById('username').value,
            apellidoPaterno: document.getElementById('apellidoPaterno').value,
            apellidoMaterno: document.getElementById('apellidoMaterno').value,
            fechaNacimiento: document.getElementById('fechaDeNacimiento').value,
            numeroLicencia: document.getElementById('numeroDeLicencia').value,
            numeroTelefono: document.getElementById('numeroDeTelefono').value,
            activo: true,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // Realizar la solicitud POST con Axios
        axios.post('http://localhost:8000/conductor/', formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // Manejar la respuesta exitosa aquí
                console.log('Respuesta del servidor:', response.data);
            })
            .catch(function (error) {
                // Manejar errores de la solicitud aquí
                console.error('Error al realizar la solicitud:', error);
            });
    } else {
        alert('¡Error! Las contraseñas no coinciden.');
    }
}
