document.addEventListener('DOMContentLoaded', function() {
    const elementosTabIndex = document.querySelectorAll('[tabindex]');
    const dialogoModal = document.querySelector('.cuadro-Dialogo-Modal');
    let dialogosOperacion = document.querySelectorAll('.cuadro-Dialogo.operacion');
    let tabindexArray = obtenerTodosIndex();
    let dialogoFocus;
    let dialogoRespuesta;
    let dialogoOperacion;
    let respuestaConfirmacion = false;
    let isAlerta = false;

    /*Evento para las Animaciones a realizar del DialogoModal despues de que
    ciertas animaciones hayan terminado*/
    crearEventosAnimacionDialogos(dialogoModal)


    /*Preparar Cada dialogo Operacion */
    dialogosOperacion.forEach(function(dialogo) {
        /*Desenficar todos los botones de los cuadros de dialogo Operacion */
        enfocarBotonesCuadroDialogo(false,dialogo);
        //Asignar eventos a los botones del dialogo operacion
        asignarEventoBotonesDialogo(dialogo);
        /*Agregar a cada dialogoOperacion un Evento para las Animaciones a realizar
        despues de que ciertas animaciones hayan terminado*/
        crearEventosAnimacionDialogos(dialogo)
    });


    /*Crea Un evento especial para realizar un efecto en especificico/ 
    /*Enviar que si se quiere realizar la accion, desde otro documento escucha este evento y sigue con las instrucciones*/
    function dispararEventoConfirmarOperacion(respuestaDialogo) {
        var enviarRespuestaDialogo = new CustomEvent('enviarRespuestaDialogo', {
            detail : {respuesta: respuestaDialogo}
        });
        document.dispatchEvent(enviarRespuestaDialogo);
    }


    /*Identificar que Cuadro de dialogo Operacion de la pagina se tiene que abrir*/
    document.addEventListener('abrirDialogoOperacion', function(e) {
        var idElemento = e.detail.dialogo;
        dialogosOperacion.forEach(function(dialogo) {
            if(dialogo.id === idElemento){
                dialogoOperacion = dialogo;
                dialogoFocus = dialogo;
                isAlerta = false;
                abrirDialogo(dialogoModal);
            }
        });
    });

    /*Crear El cuadro de respuesta*/
    document.addEventListener('respuestaApi', function(e) {
        dialogoRespuesta = CrearDialogoRespuesta(e.detail.src, e.detail.encabezado, e.detail.contenido,e.detail.boton);
        agregarEventoDialogoRespuesta ();
        isAlerta = e.detail.alerta;
        //Identifica si es alerta o respuesta
        if(isAlerta){
            dialogoFocus = dialogoRespuesta;
            abrirDialogo(dialogoModal);
        }else{
            cerrarDialogo(dialogoFocus);
        }
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
    function agregarEventoDialogoRespuesta (){
        asignarEventoBotonesDialogo(dialogoRespuesta);
    
        /*Evento para las Animaciones a realizar del dialogo respuesta despues de que
        ciertas animaciones hayan terminado*/
        crearEventosAnimacionDialogos(dialogoRespuesta)
    }


    /*Funciones para funcionalidad de Dialogos*/
    function crearEventosAnimacionDialogos(dialogo){
        //Identifiar si es El dialogoModal
        if(dialogo.querySelector('.cuadro-Dialogo')){
            //Dialogo modal
            dialogo.addEventListener('animationend', (event) => {
                if (event.animationName === 'fadeIn') {
                    abrirDialogo(dialogoFocus);
                }
                if (event.animationName === 'fadeOut') {
                    restablecerDialogo(dialogoModal);
                }
            });
        }else{
            //Identificar si es operacion o resultado
            if(dialogo.classList.contains('operacion')){
                dialogo.addEventListener('animationend', (event) => {
                    if(!respuestaConfirmacion){
                        if (event.animationName === 'dashIn') {
                            afinarDialogoYModal(dialogo);
                        }else{
                            restablecerDialogo(dialogoFocus);
                            cerrarDialogo(dialogoModal);
                        }
                    }else{
                        if(event.animationName === 'dashOut'){
                            restablecerDialogo(dialogoFocus);
                            abrirDialogo(dialogoRespuesta);
                        }
                    }
                });
            }else if(dialogo.classList.contains('resultado')) {
                //Dialogo respuesta
                dialogo.addEventListener('animationend', (event) => {
                    if (event.animationName === 'dashIn') {
                        afinarDialogoYModal(dialogoRespuesta);
                    }
                    if (event.animationName === 'dashOut') {
                        restablecerDialogo(dialogoRespuesta);
                        cerrarDialogo(dialogoModal);
                    }
                });
            }
    
        } 
    }

    function asignarEventoBotonesDialogo(dialogo){
        var botones = dialogo.querySelectorAll('button');
        for (let i = 0; i < botones.length; i++) {
            //Agrega un case para cada boton de un dialogo operacion
            switch (botones[i].id) {
                case 'aceptar_Operacion':
                    console.log("Aceptar Boton")
                    /*Funcionalidad de los Cuadros de dialogo de tipo operacion (Aceptar y Cancelar)
                    Con este formato se puede agregar mas botones con funciones especiales Pero solo para los dialogo Operacion*/
                    botones[i].addEventListener('click', function() {
                        respuestaConfirmacion = true;
                        /*Crea Un evento especial para un nuevo boton*/ 
                        dispararEventoConfirmarOperacion(respuestaConfirmacion);
                        enfocarBotonesCuadroDialogo(false,dialogo);
                    });
                    break;
                case 'cancelar_Operacion':
                     /*Formato para que cualquier boton pueda cerrar Cuadros de dialogos Operacion (Aceptar y Cancelar o n btn),
                     Aunque recomiendo que se llame cancelar operacion*/ 
                    console.log("Cancelar Boton")
                    botones[i].addEventListener('click', function() {
                        cerrarDialogo(dialogo);
                    });
                    break;   
                //Evento listener para el boton de los cuadros de respuesta     
                case 'aceptar_Dialogo':
                    /*Formato para que cualquier boton pueda cerrar Cuadros de dialogos Respuesta (1 btn), Aunque recomiendo que 
                    se llame Aceptar operacion y se quede asi la vdd*/ 
                     botones[i].addEventListener('click', function() {
                        isAlerta = false;
                        cerrarDialogo(dialogo);
                    });
                    break;                                
            }
        }
    }


    /*Funciones para organizar el tiempo entre dialogos*/
    function abrirDialogo(dialogo){
        dialogo.classList.add('activo');
        if(dialogo.querySelector('.cuadro-Dialogo')){
            dialogo.classList.add('fadeIn');
        }else{
            dialogo.classList.add('dashIn');
            enfocarBotonesCuadroDialogo(true,dialogo);
        }
    }
    function cerrarDialogo(dialogo){
        if(dialogo.querySelector('.cuadro-Dialogo')){
            dialogo.classList.add('fadeOut');
        }else{
            dialogo.classList.add('dashOut');
        }
        enfocarBotonesCuadroDialogo(false,dialogo);        
    }
    function afinarDialogoYModal(dialogo){
        dialogo.classList.remove('dashIn');
        dialogoModal.classList.remove('fadeIn');
    }
    function restablecerDialogo(dialogo){
        dialogo.classList.remove('activo');
        if(dialogo.querySelector('.cuadro-Dialogo')){
            dialogo.classList.remove('fadeOut');
        }else{
            dialogo.classList.remove('dashOut');
            dialogo.classList.contains('resultado');
            if(dialogo.classList.contains('operacion')){
                dialogoOperacion="";
            }else if(dialogo.classList.contains('resultado')) {
                respuestaConfirmacion = false;
                dialogoRespuesta.remove();
                dialogoRespuesta = "";
            }

        }     
    }


    /*Funcionalidad para que el tab solo enfoque en los botones del cuadro de dialogo que se muestra*/
    function enfocarBotonesCuadroDialogo(mostrarDialogo,dialogo){
        tabIndexValor = mostrarDialogo ? 0 : -1;
        var botones = dialogo.querySelectorAll('button');
        // Cerrar o restablecer índices basado en el estado de mostrarDialogo
        if (!respuestaConfirmacion) {
            bloquearTabElementosGUI(mostrarDialogo);
        }else{
            if(dialogo.classList.contains('operacion')) {
                tabIndexValor = -1;
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
    function bloquearTabElementosGUI(isBloquear){
        if(elementosTabIndex.length === tabindexArray.length) {
            if(isBloquear){
                elementosTabIndex.forEach((elemento) => {
                    elemento.tabIndex = -1;
                });
            }else{
                elementosTabIndex.forEach((elemento, index) => {
                    elemento.tabIndex = tabindexArray[index];
                });
            }
        }

    }
});