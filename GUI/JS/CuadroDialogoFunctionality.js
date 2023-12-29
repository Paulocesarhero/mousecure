document.addEventListener('DOMContentLoaded', function() {
    const elementosTabIndex = document.querySelectorAll('[tabindex]');
    const dialogoModal = document.querySelector('.cuadro-Dialogo-Modal');
    let dialogosOperacion = document.querySelectorAll('.cuadro-Dialogo.operacion');

    let tabindexArray = obtenerTodosIndex();
    let dialogoRespuesta;
    let dialogoOperacion;
    let respuestaConfirmacion = false;

    /*Funcionalidad de los Cuadros de dialogo de tipo operacion (Aceptar y Cancelar)
    Estos pueden tener más opciones*/
    dialogosOperacion.forEach(function(dialogo) {
        aceptarBoton = dialogo.querySelector('#aceptar_Operacion');
        aceptarBoton.addEventListener('click', function() {
            respuestaConfirmacion = true;
            dispararEventoConfirmarOperacion(true);
            enfocarBotonesCuadroDialogo(false,dialogo);
        });
    });
    /*Enviar que si se quiere realizar la accion*/
    function dispararEventoConfirmarOperacion(respuestaDialogo) {
        var enviarRespuestaDialogo = new CustomEvent('enviarRespuestaDialogo', {
            detail : {respuesta: respuestaDialogo}
        });
        console.log("|3| Disparo evento enviarRespuestaDialogo desde CuadroDeDIalogo.js");
        document.dispatchEvent(enviarRespuestaDialogo);
    }

    /*Crear El cuadro de respuesta*/
    document.addEventListener('respuestaApi', function(e) {
        console.log("|8| dispararDialogoResultado");
        dialogoRespuesta = CrearDialogoRespuesta(e.detail.src, e.detail.encabezado, e.detail.contenido,e.detail.boton);
        agregarEventoDialogoRespuesta (dialogoRespuesta);
        dialogoOperacion.classList.add('dashOut');
        /*Formato para que cualquier boton pueda cerrar Cuadros de dialogos Respuesta, Aunque recomiendo que 
        se llame Aceptar operacion y se quede asi la vdd*/ 
        var AceptarDialogo = dialogoRespuesta.querySelector('#aceptar_Dialogo');
        AceptarDialogo.addEventListener('click', function() {
            respuestaConfirmacion = false;
            dialogoRespuesta.classList.add('dashOut');
            enfocarBotonesCuadroDialogo(false,dialogoRespuesta);
        });

        enfocarBotonesCuadroDialogo(true,dialogoRespuesta)
    });
    function CrearDialogoRespuesta(srcImagen,encabezado, contenido, textoBoton) {
        // Crear el contenedor del diálogo
        let dialogo = document.createElement('div');
        dialogo.className = 'cuadro-Dialogo resultado';
    
        // Crear y agregar el icono
        let icono = document.createElement('div');
        icono.id = 'icono_Cuadro_Dialogo';
        let imagen = document.createElement('img');
        imagen.src = srcImagen;
        imagen.style.width = '100%';
        imagen.style.height = '100%';
        icono.appendChild(imagen);
        dialogo.appendChild(icono);
    
        // Crear y agregar el encabezado
        let encabezadoDiv = document.createElement('div');
        encabezadoDiv.id = 'encabezado_Cuadro_Dialogo';
        let titulo = document.createElement('h2');
        titulo.textContent = encabezado;
        encabezadoDiv.appendChild(titulo);
        dialogo.appendChild(encabezadoDiv);
    
        // Crear y agregar el contenido
        let contenidoDiv = document.createElement('div');
        contenidoDiv.id = 'contenido_Cuadro_Dialogo';
        let parrafo = document.createElement('p');
        parrafo.textContent = contenido;
        contenidoDiv.appendChild(parrafo);
        dialogo.appendChild(contenidoDiv);
    
        // Crear y agregar los botones
        let botonesDiv = document.createElement('div');
        botonesDiv.id = 'botones_Cuadro_Dialogo';
        let botonAceptar = document.createElement('button');
        botonAceptar.id = 'aceptar_Dialogo';
        botonAceptar.className = 'confirmar-Accion';
        botonAceptar.textContent = textoBoton;
        botonesDiv.appendChild(botonAceptar);
        dialogo.appendChild(botonesDiv);
    
        // Obtener el elemento padre y agregar el nuevo diálogo
        let cuadroDialogoModal = document.querySelector('.cuadro-Dialogo-Modal');
        cuadroDialogoModal.appendChild(dialogo);
        return dialogo;
    }
    function agregarEventoDialogoRespuesta (dialogo){
        /*Evento para las Animaciones a realizar del dialogo respuesta despues de que
        ciertas animaciones hayan terminado*/
        dialogoRespuesta.addEventListener('animationend', (event) => {
            if (event.animationName === 'dashIn') {
                dialogoRespuesta.classList.remove('dashIn');
            }
            if (event.animationName === 'dashOut') {
                dialogoRespuesta.classList.remove('activo');
                dialogoRespuesta.classList.remove('dashOut');
                respuestaConfirmacion = false;
                dialogoRespuesta.remove();
                dialogoModal.classList.add('fadeOut');
            }
        });
    }

    /*Formato para que cualquier boton pueda cerrar Cuadros de dialogos Operacion, Aunque recomiendo que 
    se llame cancelar operacion*/ 
    dialogosOperacion.forEach(function(dialogo) {
        cancelarBoton = dialogo.querySelector('#cancelar_Operacion');
        cancelarBoton.addEventListener('click', function() {
            dialogo.classList.add('dashOut');
            enfocarBotonesCuadroDialogo(false,dialogo);
        });
    });

    /*identificar que Cuadro de dialogo Operacion de la pagina se tiene que abrir*/
    document.addEventListener('abrirDialogoOperacion', function(e) {
        var idElemento = e.detail.dialogo;
        dialogosOperacion.forEach(function(dialogo) {
            if(dialogo.id === idElemento){
                dialogoOperacion = dialogo
                abrirDialogoModal();
            }
        });
        console.log("|2| Escucho evento abrirDialogoOperacion desde reporteSiniestro.js");
    });
    function abrirDialogoModal(){
        dialogoModal.classList.add('activo');
        dialogoModal.classList.add('fadeIn');
    }

    /*Evento para las Animaciones a realizar del DialogoModal despues de que
    ciertas animaciones hayan terminado*/
    dialogoModal.addEventListener('animationend', (event) => {
        if (event.animationName === 'fadeIn') {
            enfocarBotonesCuadroDialogo(true,dialogoOperacion);
            dialogoOperacion.classList.add('activo');
            dialogoOperacion.classList.add('dashIn');
        }
        if (event.animationName === 'fadeOut') {
            dialogoModal.classList.remove('activo');
            dialogoModal.classList.remove('fadeOut');
        }
    });

    /*Agregar a cada dialogoOperacion un Evento para las Animaciones a realizar
    despues de que ciertas animaciones hayan terminado*/
    dialogosOperacion.forEach(function(dialogo) {
        dialogo.addEventListener('animationend', (event) => {
            if (event.animationName === 'dashIn' && !respuestaConfirmacion) {
                dialogoModal.classList.remove('fadeIn');
                dialogo.classList.remove('dashIn');
            }
            if (event.animationName === 'dashOut' && !respuestaConfirmacion) {
                dialogo.classList.remove('activo');
                dialogo.classList.remove('dashOut');
                dialogoOperacion="";
                dialogoModal.classList.add('fadeOut');
            }else if(event.animationName === 'dashOut' && respuestaConfirmacion){
                dialogo.classList.remove('activo');
                dialogo.classList.remove('dashOut');
                dialogoOperacion="";
                dialogoRespuesta.classList.add('activo');
                dialogoRespuesta.classList.add('dashIn');
            }
        });
    });


    /*Funcionalidad para que el tab solo enfoque en los botones del cuadro de dialogo que se muestra*/
    function enfocarBotonesCuadroDialogo(abrirDialogo,dialogo){
        tabIndexValor = abrirDialogo ? 0 : -1;
        var botones = dialogo.querySelectorAll('button');

        // Cerrar o restablecer índices basado en el estado de abrirDialogo
        if (!respuestaConfirmacion) {
            if (abrirDialogo) {
                cerrarTodosIndex();
            } else {
                restablecerTodosIndex();
            }
        }
    
        for (let i = 0; i < botones.length; i++) {
            botones[i].tabIndex = tabIndexValor;
        }

    }

    /*Obtiene los index de navegabilidad de los elementos. Agrega un tabindex a cada elemento que quieres
    que sea seleccioanble con el tab */
    function obtenerTodosIndex(){
        var tabindexArray = [];
        elementosTabIndex.forEach(elemento => {
            tabindexArray.push(elemento.tabIndex);
        });
        return tabindexArray;
    }
    function restablecerTodosIndex(){
        if(elementosTabIndex.length === tabindexArray.length) {
            elementosTabIndex.forEach((elemento, index) => {
                elemento.tabIndex = tabindexArray[index];
            });
        }
    }
    function cerrarTodosIndex(){
        if(elementosTabIndex.length === tabindexArray.length) {
            elementosTabIndex.forEach((elemento, index) => {
                elemento.tabIndex = -1;
            });
        }
    }

});