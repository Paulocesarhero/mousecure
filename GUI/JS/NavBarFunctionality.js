document.addEventListener('DOMContentLoaded', function() {
    const imagenesDialogoRespuesta = [
        "../Resources/Icons/OperacionExitosa- Color.png",
        "../Resources/Icons/OperacionErronea- Color.png",
        "../Resources/Icons/OperacionAdvertencia- Color.png"
    ];//Agrega las imagenes a tu gusto

    const dropdowns = document.querySelectorAll('.dropdown');
    const menuHamburguesa = document.querySelector('.menu-hamburguesa');
    const sidebar = document.getElementById("sidebar");
    const sidebarOptions = document.querySelectorAll('.sidebar-options');
    const logOutNavBar = document.getElementById('logOut_NavBar');
    const logOutSideBar = document.getElementById('logOut_SideBar');

    let lastOpenedDropdown = null;

    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnMenuHamburguesa = menuHamburguesa.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnMenuHamburguesa) {
            sidebar.style.right = '-250px';
            accesibilidadSideBar(-1);
        }
    });


    dropdowns.forEach(function(dropdown) {
        let imagenContenedor = dropdown.querySelector('.imagen-contenedor');

        dropdown.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                toggleDropdown(this, true);
                if(imagenContenedor){
                    imagenContenedor.style.transform = 'rotate(180deg)';
                }
            }
        });

        dropdown.addEventListener('mouseenter', function(event) {
            toggleDropdown(this, false);
        });
        dropdown.addEventListener('mouseleave', function(event) {
            closeDropdown(this);
        });

        Array.from(dropdown.querySelectorAll('a')).forEach(element => {
            element.addEventListener('blur', function(event) {
                setTimeout(() => {
                    if (!dropdown.contains(document.activeElement)) {
                        closeDropdown(dropdown);
                    }
                    if(imagenContenedor){
                        imagenContenedor.style.transform = 'rotate(0deg)';
                    }
                }, 100);
            });
        });
        
    });


    menuHamburguesa.addEventListener('click', function(event) {
        toggleSidebar();
    });

    menuHamburguesa.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            toggleSidebar();
        }
    });

    sidebarOptions.forEach(option => {
        option.addEventListener('blur', function(event) {
            setTimeout(() => {
                if (!sidebar.contains(document.activeElement)) {
                    sidebar.style.right = '-250px';
                    accesibilidadSideBar(-1);
                }
            }, 0);
        });
    });


    function toggleDropdown(dropdown, isKeyboard) {
        if (isKeyboard && lastOpenedDropdown && lastOpenedDropdown !== dropdown) {
            closeDropdown(lastOpenedDropdown);
        }
        dropdown.querySelector('.dropdown-content').style.display = 'block';
        lastOpenedDropdown = dropdown;
    }
    function closeDropdown(dropdown) {
            dropdown.querySelector('.dropdown-content').style.display = 'none';
            if (lastOpenedDropdown === dropdown) {
                lastOpenedDropdown = null;
            }
    }

    function toggleSidebar() {
        if (sidebar.style.right === '0px') {
            sidebar.style.right = '-250px';
            accesibilidadSideBar(-1);
        } else {
            sidebar.style.right = '0px';
            accesibilidadSideBar(0);
        }
    }
    function accesibilidadSideBar(tabIndexValor){
        sidebarOptions.forEach(function(sidebarOption) {
            sidebarOption.tabIndex = tabIndexValor;
        });
    }



    function ejecutarUnallamadaEnespeficicoAlApi(){
        return Math.floor(Math.random() * 3) + 1;
    }


    /*Funciones para mostrar los dialogos respuestas y realizar una operacion si se confirma la operacion*/
    /*Con estas operaciones puedes disparar cuadros de dialogo y mostrar cuadros de repuestas*/
    function dispararDialogoResultado(src,encabezado,contenido,boton) {
        console.log("|7| dispararDialogoResultado");
        var respuestaApi = new CustomEvent('respuestaApi', {
            detail : {
                src: src,
                encabezado: encabezado,
                contenido: contenido,
                boton: boton}
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

    /*Funciones para logOut del navBar y sideBar */
    //Probablemente para el log out no necesite un mensaje que le diga que se salio con exito, esto solo esta aqui para 
    //Visualizar un ejemplo
    logOutNavBar.addEventListener('click', async function(event) {
        var resultadoDialogo = await dispararEventoAbrirDialogoOperacion("logOut");
        if (resultadoDialogo) {
            var respuestaEjemplo = ejecutarUnallamadaEnespeficicoAlApi();
            switch (respuestaEjemplo) {
                case 1:
                    /**/
                    /*Si solo quieres lanzar una accion al momento de aceptar solo rempleza aqui la funcion en lugar de crear
                    un dialogo respuesta*/
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
        }
    });
    logOutNavBar.addEventListener('keydown',async function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            var resultadoDialogo = await dispararEventoAbrirDialogoOperacion("logOut");
            console.log(resultadoDialogo);
            if (resultadoDialogo) {
                console.log(resultadoDialogo);
                var respuestaEjemplo = ejecutarUnallamadaEnespeficicoAlApi();
                switch (respuestaEjemplo) {
                    case 1:
                        /**/
                        /*Si solo quieres lanzar una accion al momento de aceptar solo rempleza aqui la funcion en lugar de crear
                        un dialogo respuesta*/
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
            }
        }
    });
    logOutSideBar.addEventListener('click', async function(event) {
        var resultadoDialogo = await dispararEventoAbrirDialogoOperacion("logOut");
        if (resultadoDialogo) {
            var respuestaEjemplo = ejecutarUnallamadaEnespeficicoAlApi();
            switch (respuestaEjemplo) {
                case 1:
                    /**/
                    /*Si solo quieres lanzar una accion al momento de aceptar solo rempleza aqui la funcion en lugar de crear
                    un dialogo respuesta*/
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
        }
    });
    logOutSideBar.addEventListener('keydown',async function(event) {
        if (event.key === 'Enter' || event.keyCode === 13) {
            var resultadoDialogo = await dispararEventoAbrirDialogoOperacion("logOut");
            console.log(resultadoDialogo);
            if (resultadoDialogo) {
                console.log(resultadoDialogo);
                var respuestaEjemplo = ejecutarUnallamadaEnespeficicoAlApi();
                switch (respuestaEjemplo) {
                    case 1:
                        /**/
                        /*Si solo quieres lanzar una accion al momento de aceptar solo rempleza aqui la funcion en lugar de crear
                        un dialogo respuesta*/
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
            }
        }
    });

});



