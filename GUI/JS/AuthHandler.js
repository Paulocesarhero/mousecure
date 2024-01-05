window.onload = function() {
    rol = leerCookie("rol")
    let navBarUser = document.getElementsByTagName("header")[0].cloneNode(true);
    let mainUser = document.getElementsByTagName("main")[0].cloneNode(true);    
    let scriptDocumentsGeneral = [
        '../JS/navBarFunctionality.js', //Obligatorio
        '../JS/CuadroDialogoFunctionality.js', //Obligatorio
        '../JS/PantallaAlert.js'
    ];

    let styleDocumentsGeneral = [
        '../CSS/navBarStyle.css', //Obligatorio
        '../CSS/CuadroDialogo.css', //Obligatorio
        '../css/PantallaAlert.css'
    ];

    inicioSesion = leerCookie("inicioSesion")

    document.getElementsByTagName("header")[0].remove();
    document.getElementsByTagName("main")[0].remove();

    function agregarCSSJSComponentes(doc){
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleDocumentsGeneral[doc];
        document.head.appendChild(link);

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptDocumentsGeneral[doc];
        document.head.appendChild(script);
    }

    if(inicioSesion === "true"){
        agregarCSSJSComponentes(0)
        agregarCSSJSComponentes(1)
        document.body.appendChild(navBarUser);

        if(rol===rolDoc){
            styleDocumentsSpecific.forEach(function(href) {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            });

            document.body.appendChild(mainUser);

            scriptDocumentsSpecific.forEach(function(src) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = src;
                document.head.appendChild(script);
            });         

        }else{
            tipoAlerta = 1
            agregarCSSJSComponentes(2)
        }
    }else{
        //Se debe de agregar el navbar del landingpage
        tipoAlerta = 0
        agregarCSSJSComponentes(2)
    }
}