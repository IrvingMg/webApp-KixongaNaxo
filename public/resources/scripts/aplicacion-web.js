/* La función verifica que la url accesada sea publica 
 * y devuelve un valor booleano */
function accesoPagina() {
    $.post( "http://localhost:5001/webapp-kixonganaxo/us-central1/accesoPagina", //Cambiar URL para producción 
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
    let ordenarPor = valoresFirestore(valorFiltro);
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
        ordenarPor = valoresFirestore(valorFiltro);

        $("#index-listaRes").empty();
        $("#index-verMas").prop("disabled", false); 
        
        listaResultados("colectas", ordenarPor, "index-listaRes");
    });

    $("#index-verMas").click(function() {
        listaResultados("colectas", ordenarPor, "index-listaRes");
    });

    $("#index-listaRes").on("click", "li", function() {
        const docId = $(this).closest("li").attr("id");
        window.location.assign("consultar-formato.html?query=" + docId);
    });
}

function pagIniciarSesion() {
    $("#is-form").submit(function() {
        iniciarSesion();
    });
    
    $("#is-verContrasena").click(function() {
        visibilidadContrasena("is-verContrasena", "is-contrasena");
    });
}

function pagRestablecerContrasena() {
    $("#rc-form").submit(function() {
        restablecerContrasena();
    });
}

function pagRegistrar() {
    $("#reg-form").submit(function() {
        crearCuenta();
    });

    $("#reg-verContrasena").click(function() {
        visibilidadContrasena("reg-verContrasena", "reg-contrasena");
    });
}

function pagMisPlaneaciones() {
    const user = firebase.auth().currentUser;
    let valorFiltro = $("#mp-filtro").val();
    let ordenarPor = valoresFirestore(valorFiltro);
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
        ordenarPor = valoresFirestore(valorFiltro);

        $("#mp-listaRes").empty();
        $("#mp-verMas").prop("disabled", false); 
        
        listaResultados("colectas", ordenarPor, "mp-listaRes", user.uid);
    });

    $("#mp-verMas").click(function() {
        listaResultados("colectas", ordenarPor, "mp-listaRes", user.uid);
    });

    $("#mp-listaRes").on("click", ".lista-resultados-item", function() {
        const docId = $(this).closest("li").attr("id");
        window.location.assign("planear-formato.html?query=" + docId);
    });

    $("#mp-listaRes").on("click", "#eliminar-itemListaRes", function() {
        const itemSelecionado = $(this).closest("li");
        const docId = itemSelecionado.attr("id");
        const docTitulo = itemSelecionado.find(".mdc-typography--body1").text();

        $("#mp-dialogTitulo").html(docTitulo);
        $("#mp-docId").html(docId);
        $(".mdc-dialog").addClass("mdc-dialog--open");
    });

    $("#mp-dialogCancelar").click(function() {
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });

    $("#mp-dialogAceptar").click(function() {
        const docId = $("#mp-docId").text();
    
        eliminarColecta(docId);
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });
}

function pagPlanearFormato() {
    const params = new URLSearchParams(location.search.substring(1));
    let docId = params.get("query");

    if($("#planearFormato").length && docId) {
        $("#pf-siguiente").attr("href", "planear-material.html?query=" + docId);
        editarFormatoPlaneacion(docId);
    }

    $("#pf-form").submit(function() {
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
        $("#pm-siguiente").attr("href", "planear-info.html?query=" + docId);
        $("#pm-atras").attr("href", "planear-formato.html?query=" + docId);
        editarListaMaterial(docId);
    }

    $("#pm-agregarItem").click(function() {
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
        $("#pi-atras").attr("href", "planear-material.html?query=" + docId);
        editarListaInfoConsulta(docId);
    }

    $("#pi-agregarEnlace").click(function() {
        event.preventDefault();

        const itemEnlace = $("#pi-itemEnlace").val();

        if(itemEnlace) {
            $("#pi-mensajeDefault").remove();
            $("#pi-guardarItems").prop("disabled", false);

            compItemListaIcono("Enlace: "+itemEnlace, "pi-listaItems");
            
            $("#pi-itemEnlace").val("");
        }
    });

    $("#pi-agregarArchivo").click(function() {
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
    let ordenarPor = valoresFirestore(valorFiltro);
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
        ordenarPor = valoresFirestore(valorFiltro);

        $("#me-listaRes").empty();
        $("#me-verMas").prop("disabled", false); 
        
        listaResultados("colectas", ordenarPor, "me-listaRes", user.uid, user.displayName);
    });

    $("#me-verMas").click(function() {
        listaResultados("colectas", ordenarPor, "me-listaRes", user.uid, user.displayName);
    });

    $("#me-listaRes").on("click", ".lista-resultados-item", function() {
        const docId = $(this).closest("li").attr("id");
        window.location.assign("etiquetar.html?query=" + docId);
    });

    $("#me-listaRes").on("click", "#eliminar-itemListaRes", function() {
        const itemSelecionado = $(this).closest("li");
        const docId = itemSelecionado.attr("id");
        const docTitulo = itemSelecionado.find(".mdc-typography--body1").text();

        $("#me-dialogTitulo").html(docTitulo);
        $("#me-docId").html(docId);
        $(".mdc-dialog").addClass("mdc-dialog--open");
    });

    $("#me-dialogCancelar").click(function() {
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });

    $("#me-dialogAceptar").click(function() {
        const docId = $("#me-docId").text();
    
        eliminarEtiquetas(docId, user.uid, user.displayName);
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });
}

function pagConsultarFormato() {
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");

    if($("#consultarFormato").length){
        $("#cf-verFormato").attr("href", "consultar-formato.html?query=" + docId);
        $("#cf-verEtiquetas").attr("href", "consultar-etiquetas.html?query=" + docId);
    
        buscarDocPorId("colectas", docId).then(function(documento) {
            compFormatoPlaneacion(documento.data());
        });
    }

    $("#cf-verPdf").click(function() {
        //Corregir...    
        html2canvas(document.getElementById('consultarFormato')).then(function(canvas){
            var wid = canvas.width;
            var hgt = canvas.height;
            var img = canvas.toDataURL("image/png");
            var doc = new jsPDF('p','px', [wid, hgt]);
            var width = doc.internal.pageSize.width;    
            doc.addImage(img,'JPEG',0,0, width, hgt);
            doc.save('Test.pdf');
        });
    });
}

function pagConsultarEtiquetas() {
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");

    if($("#consultarEtiquetas").length){
        $("#ce-verFormato").attr("href", "consultar-formato.html?query=" + docId);
        $("#ce-verEtiquetas").attr("href", "consultar-etiquetas.html?query=" + docId);

        buscarDocPorId("colectas", docId).then(function(documento) {
            compSelectColector(documento);
        });
    }

    $("#ce-nombreColector").change(function(){
        const usuarioId = $("#ce-nombreColector").val();
        $("#ce-listaItems").empty();

        buscarEtiquetasColectasPorUsuario(docId, usuarioId)
        .then(function(documentos) {
            compItemsListaEtiquetas(documentos);
        });
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
    });
}

$(document).ready(function() {
    aplicacionWeb();
});