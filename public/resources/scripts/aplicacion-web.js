/* La función verifica que la url accesada sea publica 
 * y devuelve un valor booleano */
function accesoPagina() {
    $.post( "https://us-central1-webapp-kixonganaxo.cloudfunctions.net/accesoPagina",
        { urlPath: window.location.pathname }
    ).done(function(acceso) {
        if(!acceso){
            window.location.assign("iniciar-sesion.html");
        }
    });
}

/* Recibe un string con el mensaje de la alerta y otro string con el tipo de mensaje.
 * La función permite mostrar mensajes del sistema después de realizar una operación */
function appAlerta(mensaje, tipo){
    //Reseta el estilo de la alerta
    $(".mdc-snackbar").removeClass("mensaje-error");
    $(".mdc-snackbar").removeClass("mensaje-advertencia");
    $(".mdc-snackbar").removeClass("boton-advertencia");

    if(tipo == "mensaje-exito") {
        $(".mdc-snackbar").trigger("OperacionExitosa");
    }

    if(tipo === "mensaje-error") {
        $(".mdc-text-field").addClass("mdc-text-field--invalid");
    }
    
    if(tipo === "mensaje-advertencia") {
        $(".mdc-snackbar__dismiss").addClass("boton-advertencia");
    }
    
    $("#appAlerta").addClass("mdc-snackbar--open " + tipo);
    $(".mdc-snackbar__label").html(mensaje);

    $("#app-cerrarAlerta").click(function() {
        $(".mdc-snackbar").removeClass("mdc-snackbar--open " + tipo);
    });
}

function pagIndex() {
    let valorFiltro = $("#index-filtro").val();
    let ordenarPor = valorOrdenamiento(valorFiltro);
    /* Variables globales: 'resultadosVisibles', 'totalResultados' y 'siguientePag'
     * declaradas en 'modulo-colectas.js' */

    if($("#index").length) {
        listaResultados("colectas", ordenarPor, "index-listaRes");
    }

    $("#index-listaRes").bind("ConsultaExitosa", function() {
        $("#index-totalRes").html("Resultados " + resultadosVisibles + " de " + totalResultados);
        $("#index-mensajeDefault").remove();
        $("#index-verMas").prop("disabled", false);
        
        if(resultadosVisibles === totalResultados){
            $("#index-verMas").prop("disabled", true); 
        }
    });

    $("#index-filtro").change(function(){
        siguientePag = null;
        resultadosVisibles = 0;
        valorFiltro = $("#index-filtro").val();
        ordenarPor = valorOrdenamiento(valorFiltro);

        $("#index-listaRes").empty();
        $("#index-verMas").prop("disabled", false); 
        
        listaResultados("colectas", ordenarPor, "index-listaRes");
    });

    $("#index-verMas").click(function() {
        listaResultados("colectas", ordenarPor, "index-listaRes");
    });

    $("#index-listaRes").on("click", "li", function() {
        const docId = $(this).closest("li").attr("id");
        if(docId != "index-mensajeDefault") {
            window.location.assign("consultar-formato.html?query=" + docId);
        }
    });
}

function pagIniciarSesion() {
    $("#is-form").submit(function(event) {
        event.preventDefault();
        iniciarSesion();
    });
    
    $("#is-verContrasena").click(function() {
        visibilidadContrasena("is-verContrasena", "is-contrasena");
    });
}

function pagRestablecerContrasena() {
    $("#rc-form").submit(function(event) {
        event.preventDefault();
        restablecerContrasena();
    });
}

function pagRegistrar() {
    $("#reg-form").submit(function(event) {
        event.preventDefault();
        crearCuenta();
    });

    $("#reg-verContrasena").click(function() {
        visibilidadContrasena("reg-verContrasena", "reg-contrasena");
    });
}

function pagMisPlaneaciones() {
    const user = firebase.auth().currentUser;
    let valorFiltro = $("#mp-filtro").val();
    let ordenarPor = valorOrdenamiento(valorFiltro);
    let planeacionEliminar = null;
    /* Variables globales: 'resultadosVisibles', 'totalResultados' y 'siguientePag'
     * declaradas en 'modulo-colectas.js' */
    
    if($("#misPlaneaciones").length) {
        listaResultados("colectas", ordenarPor, "mp-listaRes", user.uid);
    }

    $("#mp-listaRes").bind("ConsultaExitosa", function() {
        $("#mp-totalRes").html("Resultados " + resultadosVisibles + " de " + totalResultados);
        $("#mp-mensajeDefault").remove();
        $("#mp-verMas").prop("disabled", false);
        
        if(resultadosVisibles === totalResultados){
            $("#mp-verMas").prop("disabled", true); 
        }
    });

    $("#mp-filtro").change(function(){
        siguientePag = null;
        resultadosVisibles = 0;
        valorFiltro = $("#mp-filtro").val();
        ordenarPor = valorOrdenamiento(valorFiltro);

        $("#mp-listaRes").empty();
        $("#mp-verMas").prop("disabled", false); 
        
        listaResultados("colectas", ordenarPor, "mp-listaRes", user.uid);
    });

    $("#mp-verMas").click(function() {
        listaResultados("colectas", ordenarPor, "mp-listaRes", user.uid);
    });

    $("#mp-listaRes").on("click", ".lista-resultados-item", function() {
        const docId = $(this).closest("li").attr("id");

        if(docId != "mp-mensajeDefault") {
            window.location.assign("planear-formato.html?query=" + docId);
        }
    });

    $("#mp-listaRes").on("click", "#eliminar-itemListaRes", function() {
        const itemSelecionado = $(this).closest("li");
        const docId = itemSelecionado.attr("id");
        const docTitulo = itemSelecionado.find(".mdc-typography--body1").text();

        planeacionEliminar = itemSelecionado;
        
        $("#mp-dialogTitulo").html(docTitulo);
        $("#mp-docId").html(docId);
        $(".mdc-dialog").addClass("mdc-dialog--open");
    });

    $("#mp-dialogCancelar").click(function() {
        planeacionEliminar = null;
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });

    $("#mp-dialogAceptar").click(function() {
        const docId = $("#mp-docId").text();
    
        eliminarColecta(docId);
        $(planeacionEliminar).remove();
        planeacionEliminar = null;
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });
}

function pagPlanearFormato() {
    const params = new URLSearchParams(location.search.substring(1));
    let docId = params.get("query");

    if($("#planearFormato").length) {
        crearMapa();
    }

    $("#pf-form").keypress(function(event) {
        if(event.which == 13) {
            event.preventDefault();
        }
    });

    $("#pf-buscarMaps").click(function() {
        const lugar = $("#pf-lugar").val();
        if(lugar !== "") {
            buscarLugar(lugar);
        }
    });

    $("#pf-lugar").keypress(function(e) {
        if(e.which == 13) {
            const lugar = $("#pf-lugar").val();
            if(lugar !== "") {
                buscarLugar(lugar);
            }
        }
    });

    $("#pf-lugar").change(function(e) {
        const lugar = $("#pf-lugar").val();
        if(lugar !== "") {
            buscarLugar(lugar);
        }
    });

    if($("#planearFormato").length && docId) {
        $("#pf-tabMaterial").attr("href", "planear-material.html?query=" + docId);
        $("#pf-tabInfo").attr("href", "planear-info.html?query=" + docId);
        $("#pf-siguiente").attr("href", "planear-material.html?query=" + docId);
        editarFormatoPlaneacion(docId);
    }

    $("#pf-form").submit(function(event) {
        event.preventDefault();
        crearColecta(docId);

        $(".mdc-snackbar").bind("OperacionExitosa", function() {
            docId = $("#app-docId").text();
            $("#pf-siguiente").attr("href", "planear-material.html?query=" + docId);
        });
    });
}

function pagPlanearMaterial() {
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");

    if($("#planearMaterial").length) {
        $("#pf-tabFormato").attr("href", "planear-formato.html?query=" + docId);
        $("#pf-tabInfo").attr("href", "planear-info.html?query=" + docId);
        $("#pm-siguiente").attr("href", "planear-info.html?query=" + docId);
        $("#pm-atras").attr("href", "planear-formato.html?query=" + docId);
        editarListaMaterial(docId);
    }

    $("#pm-agregarItem").click(function(event) {
        event.preventDefault();

        const itemMaterial = $("#pm-itemMaterial").val();

        if(itemMaterial) {
            $("#pm-mensajeDefault").remove();
            $("#pm-guardarItems").prop("disabled", false);

            compItemListaIcono(itemMaterial, "pm-listaItems");
            
            $("#pm-itemMaterial").val("");
        }
    });

    $("#pm-listaItems").on("click", "#eliminar-itemListaIcono", function(){
        $(this).closest("li").next().remove();
        $(this).closest("li").remove();
    });

    $("#pm-guardarItems").click(function() {
        crearListaMaterial(docId);
    });
}

function pagPlanearInfo() {
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");
    let archivosSubir = [];
    let nombreArchivosSubir = [];
    let nombreArchivosEliminar = [];

    if($("#planearInfo").length) {
        $("#pf-tabFormato").attr("href", "planear-formato.html?query=" + docId);
        $("#pf-tabMaterial").attr("href", "planear-material.html?query=" + docId);
        $("#pi-atras").attr("href", "planear-material.html?query=" + docId);
        editarListaInfoConsulta(docId);
    }

    $("#pi-agregarEnlace").click(function(event) {
        event.preventDefault();

        let itemEnlace = $("#pi-itemEnlace").val();
        if(itemEnlace.search("https://") >= 0) {
        } else {
            itemEnlace = "https://" + itemEnlace;
        }

        if(itemEnlace) {
            $("#pi-mensajeDefault").remove();
            $("#pi-guardarItems").prop("disabled", false);

            compItemListaIcono("Enlace: "+itemEnlace, "pi-listaItems");
            
            $("#pi-itemEnlace").val("");
        }
    });

    $("#pi-agregarArchivo").click(function(event) {
        event.preventDefault();

        const itemArchivo = $("#pi-itemArchivo").val();

        if(itemArchivo) {
            const itemArchivo = $("#pi-itemArchivo").get(0).files[0];

            archivosSubir.push(itemArchivo);
            nombreArchivosSubir.push(itemArchivo.name);
            
            $("#pi-mensajeDefault").remove();
            $("#pi-guardarItems").prop("disabled", false);

            compItemListaIcono("Archivo: "+itemArchivo.name, "pi-listaItems");

            $("#pi-itemArchivo").val("");
        }
    });

    $("#pi-listaItems").on("click", "#eliminar-itemListaIcono", function(){
        const itemSelecionado = $(this).closest("li");
        const itemSelTexto = itemSelecionado.find("span").text();
        let itemNombre;

        if(itemSelTexto.search("Enlace: ") === 0) {
            itemNombre = itemSelTexto.substring(8);
            itemSelecionado.next().remove();
            itemSelecionado.remove();
        } else {
            itemNombre = itemSelTexto.substring(9);
            
            const index = nombreArchivosSubir.indexOf(itemNombre);
            if(index >= 0) {
                archivosSubir.splice(index, 1);
                nombreArchivosSubir.splice(index, 1);
            } else {
                nombreArchivosEliminar.push(itemNombre);
            }
 
            itemSelecionado.next().remove();
            itemSelecionado.remove();
        }
    });

    $("#pi-guardarItems").click(function() {
        crearListaInfoConsulta(docId, archivosSubir, nombreArchivosEliminar);
    });

    $("#pi-publicar").click(function(){ 
        const documento = {"publico": true};

        actualizarDoc("colectas", documento, docId);
        
        $(".mdc-snackbar").bind("OperacionExitosa", function() {
            window.location.assign("mis-planeaciones.html");
        });  
    });
}

function pagMisEtiquetas() {
    const user = firebase.auth().currentUser;
    let valorFiltro = $("#mp-filtro").val();
    let ordenarPor = valorOrdenamiento(valorFiltro);
    let etiquetasEliminar = null;
    /* Variables globales: 'resultadosVisibles', 'totalResultados' y 'siguientePag'
     * declaradas en 'modulo-colectas.js' */
    
    if($("#misEtiquetas").length) {
        listaResultados("colectas", ordenarPor, "me-listaRes", user.uid, user.displayName);
    }

    $("#me-listaRes").bind("ConsultaExitosa", function() {
        $("#me-totalRes").html("Resultados " + resultadosVisibles + " de " + totalResultados);
        $("#me-mensajeDefault").remove();
        $("#me-verMas").prop("disabled", false);
        
        if(resultadosVisibles === totalResultados){
            $("#me-verMas").prop("disabled", true); 
        }
    });

    $("#me-filtro").change(function(){
        siguientePag = null;
        resultadosVisibles = 0;
        valorFiltro = $("#me-filtro").val();
        ordenarPor = valorOrdenamiento(valorFiltro);

        $("#me-listaRes").empty();
        $("#me-verMas").prop("disabled", false); 
        
        listaResultados("colectas", ordenarPor, "me-listaRes", user.uid, user.displayName);
    });

    $("#me-verMas").click(function() {
        listaResultados("colectas", ordenarPor, "me-listaRes", user.uid, user.displayName);
    });

    $("#me-listaRes").on("click", ".lista-resultados-item", function() {
        const docId = $(this).closest("li").attr("id");

        if(docId != "me-mensajeDefault") {
            window.location.assign("etiquetar.html?query=" + docId);
        }
    });

    $("#me-listaRes").on("click", "#eliminar-itemListaRes", function() {
        const itemSelecionado = $(this).closest("li");
        const docId = itemSelecionado.attr("id");
        const docTitulo = itemSelecionado.find(".mdc-typography--body1").text();

        etiquetasEliminar = itemSelecionado;
        $("#me-dialogTitulo").html(docTitulo);
        $("#me-docId").html(docId);
        $(".mdc-dialog").addClass("mdc-dialog--open");
    });

    $("#me-dialogCancelar").click(function() {
        etiquetasEliminar = null;
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });

    $("#me-dialogAceptar").click(function() {
        const docId = $("#me-docId").text();
    
        eliminarEtiquetas(docId, user.uid, user.displayName);
        $(etiquetasEliminar).remove();
        etiquetasEliminar = null;
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });
}

function pagConsultarFormato() {
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");
    let infoFormato;

    if($("#consultarFormato").length){
        $("#cf-verFormato").attr("href", "consultar-formato.html?query=" + docId);
        $("#cf-verEtiquetas").attr("href", "consultar-etiquetas.html?query=" + docId);
    
        buscarDocPorId("colectas", docId).then(function(documento) {
            compFormatoPlaneacion(documento.data());
            infoFormato = documento.data();
        });
    }

    $("#cf-verPdf").click(function() {
        formatoPlaneacionPDF(infoFormato, docId);
    });
}

function pagConsultarEtiquetas() {
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");
    let etiquetas = [];

    if($("#consultarEtiquetas").length){
        $("#ce-verFormato").attr("href", "consultar-formato.html?query=" + docId);
        $("#ce-verEtiquetas").attr("href", "consultar-etiquetas.html?query=" + docId);

        buscarDocPorId("colectas", docId).then(function(documento) {
            compSelectColector(documento);
        });
    }

    $("#ce-nombreColector").change(function(){
        const usuario = $("#ce-nombreColector").val().split(",");
        const usuarioId = usuario[0];
        const nombreUsuario = usuario[1];
        
        $("#ce-listaItems").empty();
        buscarEtiquetasColectasPorUsuario(docId, usuarioId, nombreUsuario)
        .then(function(documentos) {
            compItemsListaEtiquetas(documentos);
            documentos.forEach(function(doc) {
                etiquetas.push(doc);
            });
        });
    });

    $("#ce-listaItems").on("click", "#ce-verPdf", function() {
        const etiquetaId = $(this).closest("li").attr("id");
        
        infoEtiqueta = etiquetas.find(function(doc) {
            return doc.id === etiquetaId;
        }).data();
        buscarDocPorId("etiquetas", etiquetaId).then(function(documento) {
            etiquetaPDF(infoEtiqueta, etiquetaId);
        });
    });

    $("#ce-listaItems").on("click", "#ce-verFotos", function() {
        const etiquetaId = $(this).closest("li").attr("id");
        window.open("consultar-fotos.html?query="+etiquetaId);
    });    
}

function pagConsultarFotos() {
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");
    
    if($("#consultarFotos").length){
        buscarDocPorId("etiquetas", docId).then(function(documento) {
            const nombrePlanta = documento.data()["nombre_comun"];
            const fotosPlanta = documento.data()["fotografias"];

            $("#cfotos-nombrePlanta").html(nombrePlanta);
            if(fotosPlanta.length) {
                $("#cfotos-mensajeDefault").remove();
                for(index in fotosPlanta) {
                    descargarArchivo("fotos/"+docId+"/"+fotosPlanta[index]);
                }
            }
        });
    }
}

function pagEtiquetar() {
    const user = firebase.auth().currentUser;
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");
    let etiquetaId;
    let etiqueta;
    let fotos = [];
    let fotosSubir = [];
    let fotosEliminar = [];

    if($("#etiquetar").length) {
        buscarDocPorId("colectas", docId).then(function(doc) {
            $("#etiquetar-nombreColecta").html(doc.data()["titulo"]);
            $("#etiquetar-lugarColecta").html(doc.data()["lugar"]);
            $("#etiquetar-fechaColecta").html(doc.data()["fecha"]);

            const infoConsulta = doc.data()["info-consulta"];
            compListaInfoConsulta(infoConsulta);
        });

        buscarEtiquetasColectasPorUsuario(docId, user.uid, user.displayName).then(function(documentos) {
            etiqueta = documentos["docs"][0].data();
            etiquetaId = documentos["docs"][0].id;
            fotos = etiqueta["fotografias"];
            const audios = etiqueta["audios"];
            
            compListaPlantas(documentos);
            compListaFotos(fotos, etiquetaId);
            compNotasCampo(audios);
            editarEtiqueta(etiquetaId);
        });
    }

    $("#etiquetar-form").keypress(function(event) {
        if(event.which == 13) {
            event.preventDefault();
        }
    });

    $("#etiquetar-listaPlantas").on("click", "li", function() {
        etiquetaId = $(this).attr("id");

        $(".mdc-list-item--selected").removeClass("mdc-list-item--selected");
        $(this).find("div").addClass("mdc-list-item--selected");
        $("#etiquetar-listaFotos").empty();
        $("#etiquetar-listaNotasCampo").empty();

        buscarDocPorId("etiquetas", etiquetaId).then(function(documento) {
            etiqueta = documento.data();
            fotos = etiqueta["fotografias"];
            const audios = etiqueta["audios"];
            
            $("#etiquetar-nombrePlanta").html(etiqueta["nombre_comun"]);
            compListaFotos(fotos, etiquetaId);
            compNotasCampo(audios);
            editarEtiqueta(etiquetaId);
        });
    });

    $("#etiquetar-listaFotos").on("click", "button", function(event) {
        event.preventDefault();

        const fotoEliminar = $(this).attr("id");
        let index = fotos.indexOf(fotoEliminar);
        fotosEliminar.push(fotoEliminar);
        fotos.splice(index,1); 
        $(this).closest("li").remove();
    });

    $("#etiquetar-listaNotasCampo").on("click", "#etiquetar-descAudio", function() {
        const nombreArchivo = $(this).closest("li").attr("id");
        if(nombreArchivo) {
            obtenerURL("audios/"+etiquetaId+"/"+nombreArchivo).then(function(url) {
                window.open(url);
            });
        }
    });

    $("#etiquetar-listaInfoConsulta").on("click", "button", function() {
        const nombreArchivo = $(this).attr("id");
        if(nombreArchivo) {
            obtenerURL("info-consulta/"+docId+"/"+nombreArchivo).then(function(url) {
                window.open(url);
            });
        }
    });  

    $("#etiquetar-form").submit(function(event) {
        event.preventDefault();
        guardarEtiqueta(etiquetaId, fotos, fotosEliminar);
    });    
}

function aplicacionWeb() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if(!user.emailVerified) {
                appAlerta("Por favor, revise su correo electrónico y verifique su cuenta.", "mensaje-advertencia");
            }
        } else {
            accesoPagina();
        }

        compBarNavegacion(user, "app-barNav");
        $("#app-barNav").on("click", "#cerrarSesion", function(){
            cerrarSesion();
            location.reload();
        });

        pagIndex();
        pagIniciarSesion();
        pagRestablecerContrasena();
        pagRegistrar();
        pagMisPlaneaciones();
        pagPlanearFormato();
        pagPlanearMaterial();
        pagPlanearInfo();
        pagMisEtiquetas();
        pagConsultarFormato();
        pagConsultarEtiquetas();
        pagConsultarFotos();
        pagEtiquetar();
    });
}

$(document).ready(function() {
    aplicacionWeb();
});