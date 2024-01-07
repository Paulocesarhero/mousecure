function submitForm() {
    const url = `${baseURL}/token`;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const postData = new URLSearchParams();
    postData.append('grant_type', '');
    postData.append('username', username);
    postData.append('password', password);
    postData.append('scope', '');
    postData.append('client_id', '');
    postData.append('client_secret', '');

    axios.post('http://localhost:8000/token', postData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        }
    })
        .then(function (response) {
            console.log('Respuesta del servidor:', response);

            // Verificar el contenido de la respuesta y actuar en consecuencia
            if (response.data.access_token) {
                // Acceso concedido
                alert('Acceso concedido');
            } else {
                // La respuesta no contiene el token esperado
                alert('Respuesta del servidor inesperada');
            }
        })
        .catch(function (error) {
            console.error('Error al realizar la solicitud:', error);

            // Manejar el error como desees
            if (error.response) {
                // El servidor respondió con un código de estado diferente de 2xx
                console.log('Código de estado:', error.response.status);
                console.log('Mensaje del servidor:', error.response.data);
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió una respuesta
                console.log('No se recibió respuesta del servidor');
            } else {
                // Algo sucedió en la configuración de la solicitud que desencadenó el error
                console.log('Error de configuración de la solicitud:', error.message);
            }
        });
}