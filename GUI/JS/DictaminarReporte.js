document.addEventListener('DOMContentLoaded', function () {
    const btnAceptar = document.getElementById('btn_Aceptar_Dictamen');
    const btnCancelar = document.getElementById('btn_Cancelar_Dictamen');
    var folio = getSelectedReportFromCookie();    
    if (folio == null) {
        return;
    }
    getReporte();

    function getReporte() {
        fetch(`http://localhost:8000/reporte/${folio}`)
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
        document.getElementById('folio').value = data.folio;
        document.getElementById('fechaDelSiniestro').value = data.fechaDelSiniestro;        
        document.getElementById('ubicacion').value = data.ubicacion;
        document.getElementById('dictamen').value = data.dictamen;
        document.getElementById('tipo').value = data.tipo;
        document.getElementById('descripcionDelSiniestro').value = data.descripcionDelSiniestro;
        document.getElementById('descripcionDictamen').value = data.descripcionDictamen;
    }

    function enableButtonAceptar() {
        btnAceptar.disabled = false;
    }

    function addActionButtons() {
        btnAceptar.addEventListener('click', function () {
            dictamen = document.getElementById('dictamen').value;            
            descripcionDictamen = document.getElementById('descripcionDictamen').value;

            dicatminarReporte({
                dictamen,
                descripcionDictamen,
            });
        });

        btnCancelar.addEventListener('click', function () {
            alert("¡Cancelado¡ No se preocupe la acción fue cancelada");            
        });
    }

    function dicatminarReporte(datos) {
        console.log(datos);
        fetch(`http://localhost:8000/reportebyfolio/${folio}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
            .then(response => response.json())            
            .then(data => {
                alert("Reporte dictaminado");
                window.location.href = 'http://localhost:8080/html/DictaminarReporteLista.html';
            })
            .catch(error => {
                alert("No se pudo actualizar intentelo mas tarde");                
            });
    }

    function getSelectedReportFromCookie() {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'selectedReport') {
                return value;
            }
        }
        return null;
    }    
});

function regresar() {
    window.location.href = 'http://localhost:8080/html/DictaminarReporteLista.html';        
}

function cerrar_sesion() {
    window.location.href = 'http://localhost:8080/';        
}