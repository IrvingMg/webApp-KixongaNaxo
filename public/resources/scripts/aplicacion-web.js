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
        window.location.assign("consulta-planeacion.html?query=" + docId);
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
    
        eliminarColecta(docId); //Corregir función eliminarColecta
        /*
        $(".mdc-snackbar").bind("OperacionExitosa", function() {
            location.reload();
        });
        */
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


function eventos() {

    // Eventos de etiquetas.html 
    if($("#lista-etiquetas").get().length){
        const user = firebase.auth().currentUser;
        listaResultados("colectas", "lista-etiquetas", user.uid, user.displayName);
    }

    $("#filtro-opciones").change(function(){
        siguientePag = null;
        resultadosVisibles = 0;
        $("#btn-mas").prop("disabled", false); 
        $(".lista-resultados").empty();

        if($("#lista-etiquetas").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-etiquetas", user.uid, user.displayName);
        }
    });

    $("#btn-mas").click(function() {
        if($("#lista-etiquetas").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-etiquetas", user.uid, true);
        }
    });

    // Eventos de etiquetas.html    
    $("#lista-etiquetas").on("click", ".lista-resultados-item", function() {
        const docId = $(this).closest("li").attr("id");
        window.location.replace("etiquetar.html?query=" + docId);
    });

    $("#lista-etiquetas").on("click", "#btn-eliminar", function() {
        const itemSelecionado = $(this).closest("li");
        const docId = itemSelecionado.attr("id");
        const docTitulo = itemSelecionado.find(".mdc-typography--body1").text();

        $("#id-documento").html(docId);
        $("#my-dialog-title").html(docTitulo);
        $(".mdc-dialog").addClass("mdc-dialog--open");
    });

    $("#etiquetas-dialog-aceptar").click(function() {
        const docId = $("#id-documento").text();
        const user = firebase.auth().currentUser;

        eliminarEtiquetas(docId, user.uid);
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });

    // Eventos de consulta-planeacion.html
    if($("#consulta-planeacion").get().length){
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");

        $("#op-formato").attr("href", "consulta-planeacion.html?query=" + docId);
        $("#op-etiquetas").attr("href", "consulta-etiquetas.html?query=" + docId);
        consultaFormatoPlaneacion(docId);
    }

    // Eventos de consulta-etiquetas.html
    if($("#consulta-etiquetas").get().length){
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");
        const tipoEtiqueta = params.get("etiquetas");

        $("#op-formato").attr("href", "consulta-planeacion.html?query=" + docId);
        $("#op-etiquetas").attr("href", "consulta-etiquetas.html?query=" + docId);
        consultaEtiquetas(docId, tipoEtiqueta);
    }

    $("#etiquetas-colector").change(function(){
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");
        const usuarioId = $("#etiquetas-colector").val();
        $("#lista-etiquetas").empty();

        leerEtiquetas(docId, usuarioId)
        .then(function(docs) {
            compItemsListaEtiquetas(docs);
        });
    });
    
}

/* Función principal de la aplicación web */
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
    });
}

$(document).ready(function() {
    aplicacionWeb();
});