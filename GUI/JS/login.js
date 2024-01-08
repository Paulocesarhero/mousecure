function submitForm() {
    const loginUrl = `${baseURL}/token`;
    const protectedUrl = `${baseURL}/protected`;

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const postData = new URLSearchParams();
    postData.append('grant_type', '');
    postData.append('username', username);
    postData.append('password', password);
    postData.append('scope', '');
    postData.append('client_id', '');
    postData.append('client_secret', '');

    // Paso 1: Obtener el token
    axios.post(loginUrl, postData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        }
    })
        .then(function (response) {
            console.log('Respuesta del servidor (Login):', response);

            // Verificar el contenido de la respuesta y actuar en consecuencia
            if (response.data.access_token) {
                const accessToken = response.data.access_token;

                // Guardar el token en localStorage
                localStorage.setItem('accessToken', accessToken);

                // Paso 2: Obtener datos protegidos
                axios.get(protectedUrl, {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                    .then(function (protectedResponse) {
                        console.log('Respuesta del servidor (Protected):', protectedResponse);

                        // Verificar y almacenar el tipo de usuario en la GUI
                        if (protectedResponse.data.current_user && protectedResponse.data.current_user.tipo) {
                            const userType = protectedResponse.data.current_user.tipo;
                            const idMongo = protectedResponse.data.current_user.id;
                            localStorage.setItem('idMongo', idMongo);
                            if (userType == 'conductor'){
                                window.location.href = 'html/MainUser.html';
                            }if (userType == 'empleado'){
                                window.location.href = 'html/MainAdmin.html';
                            }
                        }

                        // Redirigir a la página principal del usuario
                    })
                    .catch(function (protectedError) {
                        console.error('Error al obtener datos protegidos:', protectedError);
                        // Manejar el error al obtener datos protegidos
                    });
            } else {
                // La respuesta no contiene el token esperado
                alert('Respuesta del servidor inesperada');
            }
        })
        .catch(function (error) {
            console.error('Error al realizar la solicitud (Login):', error);

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