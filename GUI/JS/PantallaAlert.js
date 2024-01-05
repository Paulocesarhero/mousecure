function regresar() {
    window.history.back();
}


function insertarContenido(tipoAlerta) {
    var main = document.createElement('main');

    var contenedorAlerta = document.createElement('div');
    contenedorAlerta.id = "contenedor_Alerta";

    var contenedorImagen = document.createElement('div');
    contenedorImagen.id = "contenedor_Imagen";
    var imagen = document.createElement('img');
    imagen.src = "../Resources/Icons/OperacionAdvertencia- Color.png";
    imagen.style.height = "128px";
    imagen.style.width = "128px";
    contenedorImagen.appendChild(imagen);

    var contenedorMensaje = document.createElement('div');
    contenedorMensaje.id = "contenedor_Mensaje";

    var tituloAlerta = document.createElement('div');
    tituloAlerta.id = "titulo_Alerta";
    var h1 = document.createElement('h1');
    switch (tipoAlerta) {
        case 0:
            h1.textContent = "Tiene que iniciar sesión primero.";
            break;
        case 1:
            h1.textContent = "Alto amigo, usted no puede pasar por aquí.";
            break;
        default:
            h1.textContent = "Upps... algo paso.";
            break;
    }
    tituloAlerta.appendChild(h1);

    var botonAlerta = document.createElement('div');
    botonAlerta.id = "boton_Alerta";
    var boton = document.createElement('button');
    boton.id = "botton_regresar";
    switch (tipoAlerta) {
        case 0:
            boton.setAttribute("onclick", "iniciarSesion()");
            break;
        case 1:
        default:
            boton.setAttribute("onclick", "regresar()");
        break;
    }

    var imagenBoton = document.createElement('img');
    imagenBoton.src = "../Resources/Icons/FlechaIzq - LT.png";
    imagenBoton.style.height = "38px";
    imagenBoton.style.width = "38px";
    boton.appendChild(imagenBoton);


    switch (tipoAlerta) {
        case 0:
            boton.appendChild(document.createTextNode(" Iniciar Sesion"));
            break;
        case 1:
        default:
            boton.appendChild(document.createTextNode(" Regresar"));
            break;
        }

    botonAlerta.appendChild(boton);

    contenedorMensaje.appendChild(tituloAlerta);
    contenedorMensaje.appendChild(botonAlerta);
    contenedorAlerta.appendChild(contenedorImagen);
    contenedorAlerta.appendChild(contenedorMensaje);
    main.appendChild(contenedorAlerta);

    document.body.appendChild(main);
}

insertarContenido(tipoAlerta);