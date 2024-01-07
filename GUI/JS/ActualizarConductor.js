document.addEventListener('DOMContentLoaded', function () {
    const btnAceptar = document.getElementById('btn_Aceptar');
    const btnCancelar = document.getElementById('btn_Cancelar');

    getConductor();

    function getConductor() {
        fetch('http://localhost:8000/conductor/6598bb168e83d9b74d84c003')
            .then(response => response.json())
            .then(data => {
                fillForm(data);
                enableButtonAceptar();
                addActionButtons();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function fillForm(data) {
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

    function addActionButtons() {
        btnAceptar.addEventListener('click', function () {
            const nombre = document.getElementById('nombre').value;
            const apellidoPaterno = document.getElementById('apellidoPaterno').value;
            const apellidoMaterno = document.getElementById('apellidoMaterno').value;
            const fechaNacimiento = document.getElementById('fechaNacimiento').value;
            const numeroLicencia = document.getElementById('numeroLicencia').value;
            const numeroTelefono = document.getElementById('numeroTelefono').value;
            const email = document.getElementById('email').value;

            updateConductor({
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                fechaNacimiento,
                numeroLicencia,
                numeroTelefono,
                email,
            });
        });

        btnCancelar.addEventListener('click', function () {
            alert("¡Cancelado¡ No se preocupe la cción fue cancelada");
        });
    }

    function updateConductor(datos) {
        fetch('http://localhost:8000/conductor/6598bb168e83d9b74d84c003', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
            .then(response => response.json())            
            .then(data => {
                alert("Su información se actualizo de manera exitosa");                
            })
            .catch(error => {
                alert("No se pudo actualizar intentelo mas tarde");                
            });
    }
});