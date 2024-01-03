document.addEventListener('DOMContentLoaded', function() {

    const btnAceptar = document.getElementById('btn_Aceptar');
    const vehiculoComboBox = document.getElementById('vehiculo_Comboxbox');
    const tipoSiniestroComboBox = document.getElementById('tipo_Siniestro_Combobox');
    const declaracionTextarea = document.getElementById('declaracion_Textarea');
    const activarCarruselCheckbox = document.getElementById('activar_Carrusel');
    const carruselFotos = document.getElementById('carrusel_Fotos');
    const imagenesDialogoRespuesta = [
        "../Resources/Icons/OperacionExitosa- Color.png",
        "../Resources/Icons/OperacionErronea- Color.png",
        "../Resources/Icons/OperacionAdvertencia- Color.png"
    ];//Agrega las imagenes a tu gusto

    document.getElementById('activar_Carrusel').addEventListener('change', function() {
        document.getElementById('carrusel_Fotos').style.display = this.checked ? 'flex' : 'none';
        document.getElementById('subir_Foto').style.display = this.checked ? 'flex' : 'none';
      });

    document.getElementById('subir_Foto').addEventListener('change', function(event) {
        const files = event.target.files;
        const carousel = document.getElementById('carrusel_Fotos');
        carousel.innerHTML = '';
    
        for (let i = 0; i < files.length; i++) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(files[i]);
            img.onload = () => URL.revokeObjectURL(img.src);
            img.classList = "imagen_Siniestro";
            carousel.appendChild(img);
        }
        actualizarEstadoBoton();
    });
    

    //Las coordenadas paps
    function geoFindMe() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
              console.log("Latitude: " + position.coords.latitude);
              console.log("Longitude: " + position.coords.longitude);
            }, function(error) {
              console.error("Error Code = " + error.code + " - " + error.message);
            });
          } else {
            console.log("Geolocation is not supported by this browser.");
          }
    }
    /*
    document.querySelector("#btn_Aceptar").addEventListener("click", geoFindMe);*/

    function verificarFormulario() {
        const vehiculoSeleccionado = vehiculoComboBox.value !== "defaultOption"; // Asumiendo que tienes una opción por defecto
        const tipoSiniestroSeleccionado = tipoSiniestroComboBox.value !== "defaultOption";
        const declaracionValida = declaracionTextarea.value.trim() !== "" && !/[\u263a-\u263c\u263e-\u2648\u2654-\u267f]/.test(declaracionTextarea.value);
        const imagenesEnCarrusel = Array.from(carruselFotos.children).filter(hijo => hijo.tagName === 'IMG').length;
        const carruselValido = activarCarruselCheckbox.checked ? imagenesEnCarrusel > 0 : true;

        return vehiculoSeleccionado && tipoSiniestroSeleccionado && declaracionValida && carruselValido;
    }
    function actualizarEstadoBoton() {
        if(verificarFormulario()){
            btnAceptar.disabled = false;
            btnAceptar.classList.remove("btn-Aceptar-disable");
            btnAceptar.classList.add("btn-Aceptar-able");
        }else{
            btnAceptar.classList.add("btn-Aceptar-disable");
            btnAceptar.classList.remove("btn-Aceptar-able");
        }
    }

    vehiculoComboBox.addEventListener('change', actualizarEstadoBoton);
    tipoSiniestroComboBox.addEventListener('change', actualizarEstadoBoton);
    declaracionTextarea.addEventListener('input', actualizarEstadoBoton);
    activarCarruselCheckbox.addEventListener('change', actualizarEstadoBoton);


    /*Las funciones deben de ser Asyn para poder realizar el proceso de:
    Mostrar Dialgo -> Usuario presiona aceptar Operacion -> Se muestra el dialogo de repesua en especifico*/
    document.getElementById('btn_Aceptar').addEventListener('click', async function() {
        const resultadoDialogo = await dispararEventoAbrirDialogoOperacion("enviar_Reporte");
        console.log("|5| Escucho evento desde reporteSiniestro.js");
        if (resultadoDialogo) {
            console.log("|6| Escucho evento desde reporteSiniestro.js");
            var respuestaEjemplo = ejecutarUnallamadaEnespeficicoAlApi();
            console.log(respuestaEjemplo) ;
            /*Si no quieres que se devuelva un cuadro de confirmacion, como el logout no agregues uses el metodo de dispararDialogoResultado*/
            switch (respuestaEjemplo) {
                case 1:
                    dispararDialogoResultado(
                        imagenesDialogoRespuesta[0],
                        "Solo soy un dialogo de respuesta, EXITO!: "+respuestaEjemplo,
                        "Un dialogo de respuesta para ver si si funciona el despliegue personalizado de dialogos de respuesta",
                        "Gracias por participar",
                        false);
                    break;
                case 2:
                    dispararDialogoResultado(
                        imagenesDialogoRespuesta[1],
                        "Solo soy un dialogo de respuesta, CUIDADO!: "+respuestaEjemplo,
                        "Un dialogo de respuesta para ver si si funciona el despliegue personalizado de dialogos de respuesta",
                        "Gracias por participar",
                        false);                      
                    break;            
                case 3:
                    dispararDialogoResultado(
                        imagenesDialogoRespuesta[2],
                        "Solo soy un dialogo de respuesta, ERROR!: "+respuestaEjemplo,
                        "Un dialogo de respuesta para ver si si funciona el despliegue personalizado de dialogos de respuesta",
                        "Gracias por participar",
                        false);                            
                    break;        
                default:                        
                    break;
            }
        }
    });

    /*Las funciones deben de ser Asyn para poder realizar el proceso de:
    Mostrar Dialgo -> Usuario presiona aceptar Operacion -> Se muestra el dialogo de repesua en especifico*/
    document.getElementById('btn_Cancelar').addEventListener('click', function() {

        /*Un ejemplo donde solo se dispara una alerta,*/
        dispararDialogoResultado(
            imagenesDialogoRespuesta[0],//Escoge la imagen que se adecue a tu CU
            "Solo soy un dialogo de respuesta, EXITO!: ",//Encabezado del errror
            "Un dialogo de respuesta para ver si si funciona el despliegue personalizado de dialogos de respuesta",//Detalles del error
            "Gracias por participar",
            true);//Nompre del boton
/*
        const resultadoDialogo = await dispararEventoAbrirDialogoOperacion("logOut");
        console.log("|5| Escucho evento desde reporteSiniestro.js");
        if (resultadoDialogo) {
            console.log("|6| Escucho evento desde reporteSiniestro.js");
            var respuestaEjemplo = ejecutarUnallamadaEnespeficicoAlApi();
            console.log(respuestaEjemplo) ;
            switch (respuestaEjemplo) {
                case 1:
                    
                    dispararDialogoResultado(
                        imagenesDialogoRespuesta[0],//Escoge la imagen que se adecue a tu CU
                        "Solo soy un dialogo de respuesta, EXITO!: "+respuestaEjemplo,//Encabezado del errror
                        "Un dialogo de respuesta para ver si si funciona el despliegue personalizado de dialogos de respuesta",//Detalles del error
                        "Gracias por participar");//Nompre del boton
                    break;
                case 2:
                    dispararDialogoResultado(
                        imagenesDialogoRespuesta[1],
                        "Solo soy un dialogo de respuesta, CUIDADO!: "+respuestaEjemplo,
                        "Un dialogo de respuesta para ver si si funciona el despliegue personalizado de dialogos de respuesta",
                        "Gracias por participar");                        
                    break;            
                case 3:
                    dispararDialogoResultado(
                        imagenesDialogoRespuesta[2],
                        "Solo soy un dialogo de respuesta, ERROR!: "+respuestaEjemplo,
                        "Un dialogo de respuesta para ver si si funciona el despliegue personalizado de dialogos de respuesta",
                        "Gracias por participar");                            
                    break;        
                default:                        
                    break;
            }
        }*/
    });






    function ejecutarUnallamadaEnespeficicoAlApi(){
        return Math.floor(Math.random() * 3) + 1;
    }

    /*Funciones para mostrar los dialogos respuestas y realizar una operacion si se confirma la operacion*/
    /*Con estas operaciones puedes disparar cuadros de dialogo y mostrar cuadros de repuestas*/
    function dispararDialogoResultado(src,encabezado,contenido,boton,isAlerta) {
        console.log("|7| dispararDialogoResultado");
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
            console.log("|1| Disparo evento desde reporteSiniestro.js");
            var abrirDialogoOperacion = new CustomEvent('abrirDialogoOperacion', {
                detail: { dialogo: dialogoOperacion, resolve }
            });
            document.dispatchEvent(abrirDialogoOperacion);

            document.addEventListener('enviarRespuestaDialogo', function(e) {
                resolve(e.detail.respuesta);
                console.log("|4| Escucho evento desde reporteSiniestro.js");
            }, { once: true });

        });
    }
});