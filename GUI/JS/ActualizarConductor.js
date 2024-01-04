document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formulario_Actualizar_Conductor');
    const btnAceptar = document.getElementById('btn_Aceptar');

    getConductor();

    function getConductor() {
        fetch('http://localhost:8000/conductor/658d2fef6aeb2e44b6bc8680')
            .then(response => response.json())
            .then(data => {
                llenarFormulario(data);
                habilitarBotonAceptar();
                agregarManejadorAceptar();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function llenarFormulario(data) {
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('apellidoPaterno').value = data.apellidoPaterno;
        document.getElementById('apellidoMaterno').value = data.apellidoMaterno;
        document.getElementById('fechaNacimiento').value = data.fechaNacimiento;
        document.getElementById('numeroLicencia').value = data.numeroLicencia;
        document.getElementById('numeroTelefono').value = data.numeroTelefono;
        document.getElementById('email').value = data.email;
    }

    function enableButtonAceptar() {
        btnAceptar.disabled = false;
    }

    function agregarManejadorAceptar() {
        btnAceptar.addEventListener('click', function () {
            const nombre = document.getElementById('nombre').value;
            const apellidoPaterno = document.getElementById('apellidoPaterno').value;
            const apellidoMaterno = document.getElementById('apellidoMaterno').value;
            const fechaNacimiento = document.getElementById('fechaNacimiento').value;
            const numeroLicencia = document.getElementById('numeroLicencia').value;
            const numeroTelefono = document.getElementById('numeroTelefono').value;
            const email = document.getElementById('email').value;

            actualizarDatosConductor({
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                fechaNacimiento,
                numeroLicencia,
                numeroTelefono,
                email,
            });
        });
    }

    function actualizarDatosConductor(datos) {
        fetch('http://localhost:8000/conductor/658d2fef6aeb2e44b6bc8680', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Datos actualizados:', data);
            })
            .catch(error => {
                console.error('Error en la actualización:', error);
            });
    }
});
