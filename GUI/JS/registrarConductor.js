function submitForm() {
    const loginUrl = `${baseURL}/token`;
    const protectedUrl = `${baseURL}/protected`;
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
            password: document.getElementById('password').value,
            tokenSesion: 'holuap'
        };
        const postDataLogin = new URLSearchParams();
        postDataLogin.append('grant_type', '');
        postDataLogin.append('username', document.getElementById('email').value);
        postDataLogin.append('password', document.getElementById('password').value);
        postDataLogin.append('scope', '');
        postDataLogin.append('client_id', '');
        postDataLogin.append('client_secret', '');

        // Realizar la solicitud POST con Axios
        axios.post(url, formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                axios.post(loginUrl, postDataLogin, {
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
                                        if (userType == 'conductor') {
                                            window.location.href = 'MainUser.html';
                                        }
                                        if (userType == 'empleado') {
                                            window.location.href = 'MainAdmin.html';
                                        }
                                        if (userType == 'ajustador') {
                                            window.location.href = 'DictaminarReporteLista.html';
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
            })
            .catch(function (error) {
                // Manejar errores de la solicitud aquí
                console.error('Error al realizar la solicitud:', error);
            });
    }
}
