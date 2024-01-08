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

    const correoEmpleados = [
        "ulisesram19@gmail.com",
        "ulises_ram19@hotmial.com",
        "LeoRam19@gmail.com"
    ];

    var coordenadas = ""


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
    
    geoFindMe()

    //Las coordenadas paps
    function geoFindMe() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
              console.log("Latitude: " + position.coords.latitude);
              console.log("Longitude: " + position.coords.longitude);
              coordenadas = position.coords.latitude+" "+position.coords.longitude+""
              console.log(coordenadas)
              return coordenadas
            }, function(error) {
              coordenadas = "Error Code = " + error.code + " - " + error.message;
              return coordenadas              
            });
          } else {
            coordenadas = "Geolocation is not supported by this browser."
            return coordenadas
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
        if(resultadoDialogo){
            crearReporteApi()
        }





       /* const resultadoDialogo = await dispararEventoAbrirDialogoOperacion("enviar_Reporte");
        if (resultadoDialogo) {
            var respuestaEjemplo = ejecutarUnallamadaEnespeficicoAlApi();
            console.log(respuestaEjemplo) ;
            //Si no quieres que se devuelva un cuadro de confirmacion, como el logout no agregues uses el metodo de dispararDialogoResultado
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
        }*/



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



    function obtenerCorreoAleatorio() {
        const indiceAleatorio = Math.floor(Math.random() * correoEmpleados.length);
        return correoEmpleados[indiceAleatorio];
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


    function crearReporteApi(){
        var fechaActual = new Date();
        var reportData = {
            fechaDelSiniestro: (fechaActual.getDate() < 10 ? '0' : '') + fechaActual.getDate() + '/' + ((fechaActual.getMonth() + 1) < 10 ? '0' : '') + (fechaActual.getMonth() + 1) + '/' + fechaActual.getFullYear(),
            descripcionDelSiniestro: document.getElementById('declaracion_Textarea').value,
            tipo: document.getElementById('tipo_Siniestro_Combobox').value,
            vehiculo: document.getElementById('vehiculo_Comboxbox').value,
            ubicacion: coordenadas,
            empleadoAsignado: obtenerCorreoAleatorio()
        };
        
        // Envía los datos a la API para crear el reporte
        fetch('http://localhost:8000/reporte/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Procesar la respuesta
            var idmongo = data.mensaje.split(" ")[2]; // Asumiendo que el mensaje es "Reporte registrado {idmongo}"
            
            
            // Si se seleccionó el checkbox y se obtuvo el idmongo, enviar otra solicitud POST
            if (activarCarruselCheckbox.checked && idmongo) {
                
                var image = document.getElementById('subir_Foto').files[0];
                var formData = new FormData();
                formData.append('image', image);
                formData.append('idmongo', idmongo);

                
                fetch('http://localhost:8000/reporte/create/imagen?', {
                    method: 'POST',
                    body:formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Procesar la respuesta de la imagen
                })
                .catch(error => console.error('Error al registrar imagen:', error));
            }
        })
        .catch(error => {
            console.error('Error al registrar reporte:', error);
        });
    }



    var form = document.getElementById('formulario_Siniestro');

    form.onsubmit = function(event) {
        event.preventDefault();

        var reportData = {
            fechaDelSiniestro: (fechaActual.getDate() < 10 ? '0' : '') + fechaActual.getDate() + '/' + ((fechaActual.getMonth() + 1) < 10 ? '0' : '') + (fechaActual.getMonth() + 1) + '/' + fechaActual.getFullYear(),
            descripcionDelSiniestro: document.getElementById('declaracion_Textarea').value,
            tipo: document.getElementById('tipo_Siniestro_Combobox').value,
            vehiculo: document.getElementById('vehiculo_Comboxbox').value,
            ubicacion: geoFindMe(),
            empleadoAsignado: obtenerCorreoAleatorio()
        };

        // Envía los datos a la API para crear el reporte
        fetch('http://localhost:8000/reporte/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Procesar la respuesta
            var idmongo = data.mensaje.split(" ")[2]; // Asumiendo que el mensaje es "Reporte registrado {idmongo}"
            
            // Si se seleccionó el checkbox y se obtuvo el idmongo, enviar otra solicitud POST
            if (activarCarruselCheckbox.checked && idmongo) {
                var image = document.getElementById('subir_Foto').files[0];
                var formData = new FormData();
                formData.append('image', image);
                formData.append('idmongo', idmongo);

                fetch('/reporte/create/imagen', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Procesar la respuesta de la imagen
                })
                .catch(error => console.error('Error al registrar imagen:', error));
            }
        })
        .catch(error => {
            console.error('Error al registrar reporte:', error);
        });
    };






















});