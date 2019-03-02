/* Controla el acceso a páginas de usuarios no registrados */
function accesoPagina() {
    $.post( "http://localhost:5001/webapp-kixonganaxo/us-central1/accesoPagina", //Cambiar URL para producción 
        { urlPath: window.location.pathname }
    ).done(function(acceso) {
        if(!acceso){
            window.location.assign("iniciar-sesion.html");
        }
    });
}

/* Activa o desactiva las alertas del sistema tipo 'mensaje-error' y 'mensaje-advertencia' */
function alertaSistema(mensaje, tipo){
    //Reseta el estilo del elemento
    $(".mdc-snackbar").removeClass("mensaje-error")
    $(".mdc-snackbar").removeClass("mensaje-advertencia")

    if(tipo == null) {
        $(".mdc-snackbar").trigger("operacionExitosa");
    }

    if(tipo === "mensaje-error") {
        $(".mdc-text-field").addClass("mdc-text-field--invalid");
    }
    
    if(tipo === "mensaje-advertencia") {
        $(".mdc-snackbar__dismiss").addClass("boton-advertencia");
    }
    
    $(".mdc-snackbar").addClass("mdc-snackbar--open " + tipo);
    $(".mdc-snackbar__label").html(mensaje);

    $("#cerrar-snackbar").click(function() {
        $(".mdc-snackbar").removeClass("mdc-snackbar--open " + tipo);
    });
}

/* Convierte el criterio de ordenamiento en valores válidos para Cloud Firestore */
function criteriofiltro(valorSelect) {
    let criterio;

    switch(valorSelect) {
        case "t-asc":
            criterio = ["titulo", "asc"];
        break;
        case "l-asc":
            criterio = ["lugar", "asc"];
        break;
        case "f-asc":
            criterio = ["fecha", "asc"];
        break;
        case "t-desc":
            criterio = ["titulo", "desc"];
        break;
        case "l-desc":
            criterio = ["lugar", "desc"];
        break;
        default:
            criterio = ["fecha", "desc"];
    }

    return criterio;
}

/* Función para crear lista de resultados con paginación */
//Variables globales necesarias para paginar
let siguientePag;
let totalResultados;
let resultadosVisibles = 0;
function listaResultados(nombreColeccion, nombreLista, idUsuario, nombreUsuario) {
    const ordenCriterio = criteriofiltro($("#filtro-opciones").val());
    const limitePag = 5;
    
    leerTotalResultados(nombreColeccion, idUsuario, nombreUsuario).then(function(total) {
        totalResultados = total;

        if(totalResultados != 0){
            $("#mensaje-default").remove();
            $("#btn-mas").prop("disabled", false);

            leerPagResultados(nombreColeccion, ordenCriterio, limitePag, siguientePag, idUsuario, nombreUsuario).then(function(objetoRes) {
                resultadosVisibles += objetoRes.resultadosPag.size;
                siguientePag = objetoRes.siguientePag;
    
                $("#chip-resultados").html("Resultados " + resultadosVisibles + " de " + totalResultados);
                itemsLista(objetoRes.resultadosPag, nombreLista);
    
                if(resultadosVisibles === totalResultados){
                    $("#btn-mas").prop("disabled", true); 
                }
            });    
        }
    });
}

/* Manejadores de eventos */
function eventos() {

    //Eventos *.html
    $("#cerrar-sesion").click(function() {
        cerrarSesion();
    });

    // Eventos de iniciar-sesion.html y registrar.html
    $("#contrasena-visible").click(function() {
        visibilidadContrasena();
    });

    // Eventos de iniciar-sesion.html
    $("#form-login").submit(function() {
        iniciarSesion();
    });

    $("#form-restablecer").submit(function() {
        restablecerContrasena();
    });

    // Eventos de registrar.html
    $("#form-registrar").submit(function() {
        crearCuenta();
    });

    // Eventos de formato-planeacion.html
    if($("#form-nuevaPlaneacion1").get().length){
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");
        if(docId) {
            $("#planeacion1-siguiente").attr("href", "material-campo.html?query=" + docId);
            editarFormatoPlaneacion(docId);
        }

        $("#form-nuevaPlaneacion1").submit(function() {
            crearColecta(docId);
        });
    }

    // Eventos de material-campo.html
    if($("#lista-items-material").get().length) {
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");
        
        editarListaMaterial(docId);
    }

    $("#agregar-material").click(function() {
        let itemMaterial = $("#item-material").val();
        $("#item-material").val("");

        event.preventDefault();
        
        if(itemMaterial) {
            agregarItemIconoLista(itemMaterial, "lista-items-material");
            $("#mensaje-default").remove();
            $("#form-nuevaPlaneacion2").prop("disabled", false);
        }
    });

    $("#lista-items-material").on("click", "#eliminar-item", function(){
        $(this).closest("li").next().remove();
        $(this).closest("li").remove();
    });

    $("#form-nuevaPlaneacion2").click(function() {
        crearListaMaterial();
    });

    $("#planeacion2-siguiente").click(function(){ 
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");

        $("#planeacion2-siguiente").attr("href", "info-consulta.html?query=" + docId);
    });

    $("#planeacion2-atras").click(function(){ 
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");

        $("#planeacion2-atras").attr("href", "formato-planeacion.html?query=" + docId);
    });

    //Eventos de info-consulta.html
    if($("#lista-items-info").get().length) {
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");
        
        editarListaInfoConsulta(docId);
    }

    $("#agregar-enlace").click(function() {
        const itemEnlace = $("#item-enlace").val();
        $("#item-enlace").val("");

        event.preventDefault();
        
        if(itemEnlace){
            agregarItemIconoLista("Enlace: " + itemEnlace, "lista-items-info");
            $("#mensaje-default").remove();
            $("#form-nuevaPlaneacion3").prop("disabled", false);
        }
    });

    $("#agregar-archivo").click(function() {
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");
        event.preventDefault();

        if($("#item-archivo").val()) {
            const storageRef = storage.ref();
            const file = $("#item-archivo").get(0).files[0];
            const metadata = {
                contentType: file.type
            };
            const uploadTask = storageRef.child("info-consulta/"+ docId + "/" + file.name).put(file, metadata);

            uploadTask.on('state_changed', function(snapshot){
                let progress = Math.round( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
                
                alertaSistema("Por favor, espere mientras se carga el archivo. Cargado: " + progress + "%" , "mensaje-advertencia");
            }, function(error) {
                alertaSistema(error.message, "mensaje-error");
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    alertaSistema("Archivo " + file.name + " cargado con éxito.");
                    agregarItemIconoLista("Archivo: " +file.name, "lista-items-info");

                    $("#item-archivo").val("");
                    $("#mensaje-default").remove();
                    $("#form-nuevaPlaneacion3").prop("disabled", false);
                });
            });
        }
    });

    $("#lista-items-info").on("click", "#eliminar-item", function(){
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");
        const liElement = $(this).closest("li");
        const item = liElement.find("span").text();
        let nombre;

        if(item.search("Enlace: ") === 0) {
            nombre = item.substring(8);
            console.log(nombre);
            liElement.next().remove();
            liElement.remove();
        } else {
            nombre = item.substring(9);
            const storageRef = storage.ref();
            const desertRef = storageRef.child("info-consulta/"+ docId + "/" + nombre);

            desertRef.delete().then(function() {
                liElement.next().remove();
                liElement.remove();
            }).catch(function(error) {
                alertaSistema(error.message, "mensaje-error");
            });
        }
    });

    $("#form-nuevaPlaneacion3").click(function() {
        crearListaInfoConsulta();
    });

    $("#planeacion3-atras").click(function(){ 
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");

        $("#planeacion3-atras").attr("href", "material-campo.html?query=" + docId);
    });

    $("#planeacion3-publicar").click(function(){ 
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");
        const documento = {"publico": true};

        actualizarDocumento("colectas", documento, docId);
        
        $(".mdc-snackbar").bind("operacionExitosa", function() {
            window.location.assign("planeaciones.html");
        });  
    });

    // Eventos de index.html, planeaciones.html y etiquetas.html 
    if($("#lista-colectas").get().length){
        listaResultados("colectas", "lista-colectas");
    }

    if($("#lista-planeaciones").get().length){
        const user = firebase.auth().currentUser;
        listaResultados("colectas", "lista-planeaciones", user.uid);
    }

    if($("#lista-etiquetas").get().length){
        const user = firebase.auth().currentUser;
        listaResultados("colectas", "lista-etiquetas", user.uid, user.displayName);
    }

    $("#filtro-opciones").change(function(){
        siguientePag = null;
        resultadosVisibles = 0;
        $("#btn-mas").prop("disabled", false); 
        $(".lista-resultados").empty();

        if($("#lista-colectas").get().length){
            listaResultados("colectas", "lista-colectas");
        }

        if($("#lista-planeaciones").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-planeaciones", user.uid);
        }

        if($("#lista-etiquetas").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-etiquetas", user.uid, user.displayName);
        }
    });

    $("#btn-mas").click(function() {
        if($("#lista-colectas").get().length){
            listaResultados("colectas", "lista-colectas");
        }

        if($("#lista-planeaciones").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-planeaciones", user.uid);
        }

        if($("#lista-etiquetas").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-etiquetas", user.uid, true);
        }
    });

    // Eventos de index.html
    $("#lista-colectas").on("click", "li", function() {
        const docId = $(this).closest("li").attr("id");
        window.location.replace("consulta-planeacion.html?query=" + docId);
    });

    // Eventos de planeaciones.html    
    $("#lista-planeaciones").on("click", ".lista-resultados-item", function() {
        const docId = $(this).closest("li").attr("id");
        window.location.replace("formato-planeacion.html?query=" + docId);
    });

    $("#lista-planeaciones").on("click", "#btn-eliminar", function() {
        const itemSelecionado = $(this).closest("li");
        const docId = itemSelecionado.attr("id");
        const docTitulo = itemSelecionado.find(".mdc-typography--body1").text();

        $("#id-documento").html(docId);
        $("#my-dialog-title").html(docTitulo);
        $(".mdc-dialog").addClass("mdc-dialog--open");
    });

    $("#planeaciones-dialog-aceptar").click(function() {
        const docId = $("#id-documento").text();
        borrarDocumento("colectas", docId);
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });

    $("#dialog-cancelar").click(function() {
        $(".mdc-dialog").removeClass("mdc-dialog--open");
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
            console.log(user.displayName);
            if(!user.emailVerified) {
                alertaSistema("Por favor, verifique su dirección de correo electrónico.", "mensaje-advertencia");
            }
        } else {
            accesoPagina();
        }
        opcionesBarNavegacion(user);
        eventos();
    });
}

$(document).ready(function() {
    aplicacionWeb();
});