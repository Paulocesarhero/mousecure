document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch all employees
    console.log("xd")
    function fetchAllEmpleados() {
        fetch('http://localhost:8000/empleados', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('table tbody');
            data.forEach(empleado => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div id="infoEmpleado">
                            <div id="puestoNombre">
                                <h5>${empleado.rol}</h5>
                                <p>${empleado.nombre} ${empleado.apellidoPaterno} ${empleado.apellidoMaterno}</p>
                            </div>
                            <div id="Botones">
                                <button class="icon-button blue" onclick="verDetalle('${empleado.id}')" tabindex="0">
                                    <img src="../Resources/Icons/Ver-NT.png" height="32px" width="32px" alt="Ver" />
                                </button>
                                <button class="icon-button blue" onclick="editarDetalle('${empleado.id}')" tabindex="0">
                                    <img src="../Resources/Icons/Lapiz-NT.png" height="32px" width="32px"  alt="Editar" />
                                </button>
                                <button class="icon-button red" onclick="eliminarDetalle('${empleado.id}')" tabindex="0">
                                    <img src="../Resources/Icons/Eliminar-NT.png" height="32px" width="32px"  alt="Eliminar" />
                                </button>
                            </div>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
    
    // Call the function to fetch all employees when the DOM is loaded
    fetchAllEmpleados();
});