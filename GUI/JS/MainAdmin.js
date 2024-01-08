var respuestaApi = false;
var nuevaVentanamodificar = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../Resources/Icons/Mousecure - LT.png">
    <link rel="stylesheet" href="../CSS/NavBarStyle.css">
    <link rel="stylesheet" href="../CSS/CuadroDialogo.css">
    <link rel="stylesheet" href="../CSS/modificarEmpleado.css">
    <link rel="stylesheet" href="../CSS/MainAdminStyle.css">
    <script type="text/javascript" src="../JS/NavBarFunctionality.js"></script>
    <script type="text/javascript" src="../JS/CuadroDialogoFunctionality.js"></script>
    <script type="text/javascript" src="../JS/modificarEmpleado.js"></script>
    <title>Mousecure</title>
    <style>
    .form-container {
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        max-width: 500px;
        margin: auto;
    }
    .form-group {
        margin-bottom: 15px;
    }
    .form-group label {
        display: block;
        margin-bottom: 5px;
    }
    .form-group input,
    .form-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .form-group input[type="date"] {
        padding: 9px;
    }
    .form-group input[type="submit"],
    .form-group button {
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        cursor: pointer;
    }
    .form-group button {
        background-color: #f4f4f4;
        color: #333;
    }
    .form-group button:hover {
        background-color: #e7e7e7;
    }
    .form-group input[type="submit"] {
        background-color: #5cb85c;
        color: white;
        border-color: #4cae4c;
    }
    .form-group input[type="submit"]:hover {
        background-color: #4cae4c;
    }
    .button-group {
        display: flex;
        justify-content: space-between;
    }
</style>
</head>
<body>
<header>
<nav class="navbar">
    <div class="logo">
        <img src="../Resources/Icons/Mousecure - LT.png" height="32px" weight="32px"/>MouSecure
    </div>

    <ul class="nav-links">
        <li class="dropdown">
            <a tabindex="0">
                <img id="usuario_Option"src="../Resources/Icons/User - LT.png" height="35px" weight="35px"/>
            </a>
            <ul class="dropdown-content">
                <li><a tabindex="0" id="logOut_NavBar"><img src="../Resources/Icons/LogOut - LT.png" height="32px" weight="32px"/>Cerrar Sesión</a></li>
            </ul>
        </li>                
    </ul>

    <div class="menu-hamburguesa" tabindex="0">
        <img src="../Resources/Icons/HMenu - LT.png" height="35px" weight="35px"/>
    </div>

    <div id="sidebar" class="sidebar">
        <ul class="sidebar-nav-links">
            <li><a href="#" class="sidebar-header-User-Icon" tabindex="-1"><img id="usuario_Option_SideBar"src="../Resources/Icons/User - LT.png" height="35px" weight="35px"/>[Nombre de Usuario]</a></li>
            &nbsp;
            <hr>
            <li class="sidebar-options"><a id="logOut_SideBar" tabindex="-1"><img src="../Resources/Icons/LogOut - LT.png" height="32px" weight="32px"/>Cerrar Sesión</a></li>
            <hr>
        </ul>
    </div>
</nav>
</header>

<main>
<div class="form-container">
    <form action="/submit" method="post">
        <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" required tabindex="0">
        </div>
        <div class="form-group">
            <label for="apellidoPaterno">Apellido Paterno</label>
            <input type="text" id="apellidoPaterno" name="apellidoPaterno" required tabindex="0">
        </div>
        <div class="form-group">
            <label for="apellidoMaterno">Apellido Materno</label>
            <input type="text" id="apellidoMaterno" name="apellidoMaterno" required tabindex="0">
        </div>
        <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" required tabindex="0">
        </div>
        <div class="form-group">
            <label for="fechaIngreso">Fecha de Ingreso</label>
            <input type="date" id="fechaIngreso" name="fechaIngreso" required tabindex="0">
        </div>
        <div class="form-group">
            <label for="cargo">Cargo</label>
            <select id="cargo" name="cargo" required tabindex="0">
                <option value="Ajustador">Ajustador</option>
                <option value="EjecutivoDeAsistencia">Ejecutivo de asistencia</option>
                <option value="Administrador">Administrador</option>
            </select>
        </div>
        <div class="form-group button-group">
            <button type="button" onclick="location.href='your_back_link_here';" tabindex="0">Regresar</button>
            <input type="submit" value="Guardar" tabindex="0">
        </div>
    </form>
</div>
<!-- Formato de cuadro de dialogos -->   
<div class="cuadro-Dialogo-Modal">
    <div class="cuadro-Dialogo operacion" id="enviar_Reporte">
        <!-- Rempleza el icono por el que gustes -->
        <div id="icono_Cuadro_Dialogo">
            <img src="../Resources/Icons/OperacionAdvertencia- Color.png" height="100%" width="100%">
        </div>
        <div id="encabezado_Cuadro_Dialogo">
            <h2>¿Está seguro de guardar el reporte?</h2>
        </div>
        <div id="contenido_Cuadro_Dialogo">
            <p>Una vez que se guarde el reporte, la información no se podrá editar ni eliminar.</p>
        </div>
            <!-- Agrega los botones que gustes -->
        <div id="botones_Cuadro_Dialogo">
            <button id="aceptar_Operacion" class="confirmar-Accion">Aceptar</button>
            <button id="cancelar_Operacion" class="cancelar-Accion">Cancelar</button>
        </div>
    </div>

    <div class="cuadro-Dialogo operacion" id="logOut">
        <!-- Rempleza el icono por el que gustes -->
        <div id="icono_Cuadro_Dialogo">
            <img src="../Resources/Icons/OperacionAdvertencia- Color.png" height="100%" width="100%">
        </div>
        <div id="encabezado_Cuadro_Dialogo">
            <h2>¿Desea cerrar sesión?</h2>
        </div>
        <div id="contenido_Cuadro_Dialogo">
            <p>Saldra de su sesión actual.</p>
        </div>
            <!-- Agrega los botones que gustes -->
        <div id="botones_Cuadro_Dialogo">
            <button id="aceptar_Operacion" class="confirmar-Accion">Aceptar</button>
            <button id="cancelar_Operacion" class="cancelar-Accion">Cancelar</button>
        </div>
    </div>
</div>
</div>
</main>
</body>
</html>
    `
var nuevaVentanaVer = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../Resources/Icons/Mousecure - LT.png">
    <link rel="stylesheet" href="../CSS/NavBarStyle.css">
    <link rel="stylesheet" href="../CSS/CuadroDialogo.css">
    <link rel="stylesheet" href="../CSS/modificarEmpleado.css">
    <link rel="stylesheet" href="../CSS/MainAdminStyle.css">
    <script type="text/javascript" src="../JS/NavBarFunctionality.js"></script>
    <script type="text/javascript" src="../JS/CuadroDialogoFunctionality.js"></script>
    <script type="text/javascript" src="../JS/modificarEmpleado.js"></script>
    <title>Mousecure</title>
    <style>
    .form-container {
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        max-width: 500px;
        margin: auto;
    }
    .form-group {
        margin-bottom: 15px;
    }
    .form-group label {
        display: block;
        margin-bottom: 5px;
    }
    .form-group input,
    .form-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    .form-group input[type="date"] {
        padding: 9px;
    }
    .form-group input[type="submit"],
    .form-group button {
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        cursor: pointer;
    }
    .form-group button {
        background-color: #f4f4f4;
        color: #333;
    }
    .form-group button:hover {
        background-color: #e7e7e7;
    }
    .form-group input[type="submit"] {
        background-color: #5cb85c;
        color: white;
        border-color: #4cae4c;
    }
    .form-group input[type="submit"]:hover {
        background-color: #4cae4c;
    }
    .button-group {
        display: flex;
        justify-content: space-between;
    }
</style>
</head>
<body>
<header>
<nav class="navbar">
    <div class="logo">
        <img src="../Resources/Icons/Mousecure - LT.png" height="32px" weight="32px"/>MouSecure
    </div>

    <ul class="nav-links">
        <li class="dropdown">
            <a tabindex="0">
                <img id="usuario_Option"src="../Resources/Icons/User - LT.png" height="35px" weight="35px"/>
            </a>
            <ul class="dropdown-content">
                <li><a tabindex="0" id="logOut_NavBar"><img src="../Resources/Icons/LogOut - LT.png" height="32px" weight="32px"/>Cerrar Sesión</a></li>
            </ul>
        </li>                
    </ul>

    <div class="menu-hamburguesa" tabindex="0">
        <img src="../Resources/Icons/HMenu - LT.png" height="35px" weight="35px"/>
    </div>

    <div id="sidebar" class="sidebar">
        <ul class="sidebar-nav-links">
            <li><a href="#" class="sidebar-header-User-Icon" tabindex="-1"><img id="usuario_Option_SideBar"src="../Resources/Icons/User - LT.png" height="35px" weight="35px"/>[Nombre de Usuario]</a></li>
            &nbsp;
            <hr>
            <li class="sidebar-options"><a id="logOut_SideBar" tabindex="-1"><img src="../Resources/Icons/LogOut - LT.png" height="32px" weight="32px"/>Cerrar Sesión</a></li>
            <hr>
        </ul>
    </div>
</nav>
</header>

<main>
<div class="form-container">
<form action="/submit" method="post">
    <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" name="nombre" required readonly tabindex="0">
    </div>
    <div class="form-group">
        <label for="apellidoPaterno">Apellido Paterno</label>
        <input type="text" id="apellidoPaterno" name="apellidoPaterno" required readonly tabindex="0">
    </div>
    <div class="form-group">
        <label for="apellidoMaterno">Apellido Materno</label>
        <input type="text" id="apellidoMaterno" name="apellidoMaterno" required readonly tabindex="0">
    </div>
    <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" name="email" required readonly tabindex="0">
    </div>
    <div class="form-group">
        <label for="fechaIngreso">Fecha de Ingreso</label>
        <input type="date" id="fechaIngreso" name="fechaIngreso" required readonly tabindex="0">
    </div>
    <div class="form-group">
        <label for="cargo">Cargo</label>
        <select id="cargo" name="cargo" required disabled tabindex="0">
            <option value="Ajustador">Ajustador</option>
            <option value="EjecutivoDeAsistencia">Ejecutivo de asistencia</option>
            <option value="Administrador">Administrador</option>
        </select>
    </div>
    <div class="form-group button-group">
        <button type="button" onclick="location.href='your_back_link_here';" tabindex="0">Regresar</button>
        <input type="submit" value="Guardar" tabindex="0">
    </div>
</form>
</div>
<!-- Formato de cuadro de dialogos -->   
<div class="cuadro-Dialogo-Modal">
    <div class="cuadro-Dialogo operacion" id="enviar_Reporte">
        <!-- Rempleza el icono por el que gustes -->
        <div id="icono_Cuadro_Dialogo">
            <img src="../Resources/Icons/OperacionAdvertencia- Color.png" height="100%" width="100%">
        </div>
        <div id="encabezado_Cuadro_Dialogo">
            <h2>¿Está seguro de guardar el reporte?</h2>
        </div>
        <div id="contenido_Cuadro_Dialogo">
            <p>Una vez que se guarde el reporte, la información no se podrá editar ni eliminar.</p>
        </div>
            <!-- Agrega los botones que gustes -->
        <div id="botones_Cuadro_Dialogo">
            <button id="aceptar_Operacion" class="confirmar-Accion">Aceptar</button>
            <button id="cancelar_Operacion" class="cancelar-Accion">Cancelar</button>
        </div>
    </div>

    <div class="cuadro-Dialogo operacion" id="logOut">
        <!-- Rempleza el icono por el que gustes -->
        <div id="icono_Cuadro_Dialogo">
            <img src="../Resources/Icons/OperacionAdvertencia- Color.png" height="100%" width="100%">
        </div>
        <div id="encabezado_Cuadro_Dialogo">
            <h2>¿Desea cerrar sesión?</h2>
        </div>
        <div id="contenido_Cuadro_Dialogo">
            <p>Saldra de su sesión actual.</p>
        </div>
            <!-- Agrega los botones que gustes -->
        <div id="botones_Cuadro_Dialogo">
            <button id="aceptar_Operacion" class="confirmar-Accion">Aceptar</button>
            <button id="cancelar_Operacion" class="cancelar-Accion">Cancelar</button>
        </div>
    </div>
</div>
</div>
</main>
</body>
</html>
    `

const imagenesDialogoRespuesta = [
    "../Resources/Icons/OperacionExitosa- Color.png",
    "../Resources/Icons/OperacionErronea- Color.png",
    "../Resources/Icons/OperacionAdvertencia- Color.png"
];//Agrega las imagenes a tu gusto


function verDetalle(id_empleado) {
    obtenerEmpleado(id_empleado,false)
}

function editarDetalle(id_empleado) {
    obtenerEmpleado(id_empleado,true)
}

async function eliminarDetalle(empleadoId,event) {
    const resultadoDialogo = await dispararEventoAbrirDialogoOperacion("eliminar_empleado");
    eiminarApi(empleadoId,event)
}



function eiminarApi(empleadoId,event){
    var url = "http://localhost:8000/empleado/modificar/" + empleadoId;

    var datosActualizados = {
        activo: false
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === "Empleado actualizado exitosamente") {
            var boton = event.target;
            var fila = boton.closest("tr");
            fila.remove();
        }
        dispararDialogoResultado(
            imagenesDialogoRespuesta[0],
            "EXITO!: ",
            "Empleado eliminado con exito",
            "Aceptar",
            false);
    })
    .catch(error => {
        console.error('Error:', error);
        dispararDialogoResultado(
            imagenesDialogoRespuesta[1],
            "Opss!: ",
            error,
            "Aceptar",
            false);
    });    

}


function obtenerEmpleado(empleadoId,modificar) {
    fetch("http://localhost:8000/empleados/" + empleadoId)
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener el empleado');
        }
        return response.json();
    })
    .then(empleado => {
        abrirYRellenarFormulario(empleado,modificar);
    })
    .catch(error => console.error('Error:', error));
}

function abrirYRellenarFormulario(empleado,modificar) {
    var nuevaVentana = window.open("", "_blank");
    if(modificar){
        nuevaVentana.document.write(nuevaVentanamodificar);        
    }else{
        nuevaVentana.document.write(nuevaVentanaVer);        
    }

    nuevaVentana.document.close();

    nuevaVentana.onload = function() {
        var doc = nuevaVentana.document;

        doc.getElementById('nombre').value = empleado.nombre || '';
        doc.getElementById('apellidoPaterno').value = empleado.apellidoPaterno || '';
        doc.getElementById('apellidoMaterno').value = empleado.apellidoMaterno || '';
        doc.getElementById('email').value = empleado.email || '';
        if (empleado.fechaIngreso) {
            var fechaFormatoCorrecto = empleado.fechaIngreso.split('/').reverse().join('-');
            doc.getElementById('fechaIngreso').value = fechaFormatoCorrecto;
        }
        doc.getElementById('cargo').value = empleado.rol;
    };
}

function nuevoEmpleado() {
    var nuevaVentana = window.open("", "_blank");
    nuevaVentana.document.write(nuevaVentanamodificar);        
    nuevaVentana.document.close();
}


document.addEventListener('DOMContentLoaded', function() {
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
                                <button class="icon-button red" onclick="eliminarDetalle('${empleado.id}',event)" tabindex="0">
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
    
    fetchAllEmpleados();

function filtrarTabla() {
    var valorBusqueda = document.getElementById('busqueda_Tabla').value.toUpperCase();

    var tabla = document.getElementById('contenedor_Tabla');
    var filas = tabla.getElementsByTagName('tr');

    for (var i = 0; i < filas.length; i++) {
        var columna = filas[i].getElementsByTagName('p')[0];
        if (columna) {
            var texto = columna.textContent || columna.innerText;
            if (texto.toUpperCase().indexOf(valorBusqueda) > -1) {
                filas[i].style.display = '';
            } else {
                filas[i].style.display = 'none';
            }
        }       
    }
}

document.getElementById('busqueda_Tabla').addEventListener('keyup', filtrarTabla);

function filtrarPorSeleccion() {
    var valorSeleccionado = document.getElementById('filtro_Tabla').value.toUpperCase();

    var tabla = document.getElementById('contenedor_Tabla');
    var filas = tabla.getElementsByTagName('tr');

    for (var i = 0; i < filas.length; i++) {
        var h5 = filas[i].getElementsByTagName('h5')[0];
        if (h5) {
            var texto = h5.textContent || h5.innerText;
            if (texto.toUpperCase() === valorSeleccionado) {
                filas[i].style.display = '';
            } else {
                filas[i].style.display = 'none';
            }
        }
    }
}

document.getElementById('filtro_Tabla').addEventListener('change', filtrarPorSeleccion);

    
});
  

    function dispararDialogoResultado(src,encabezado,contenido,boton,isAlerta) {
        var respuestaApi = new CustomEvent('respuestaApi', {
            detail : {
                src: src,
                encabezado: encabezado,
                contenido: contenido,
                boton: boton,
                alerta: isAlerta
            }
        });
        document.dispatchEvent(respuestaApi);
    }
    function dispararEventoAbrirDialogoOperacion(dialogoOperacion) {
        return new Promise((resolve) => {
            var abrirDialogoOperacion = new CustomEvent('abrirDialogoOperacion', {
                detail: { dialogo: dialogoOperacion, resolve }
            });
            document.dispatchEvent(abrirDialogoOperacion);

            document.addEventListener('enviarRespuestaDialogo', function(e) {
                resolve(e.detail.respuesta);
            }, { once: true });

        });
    } 


    