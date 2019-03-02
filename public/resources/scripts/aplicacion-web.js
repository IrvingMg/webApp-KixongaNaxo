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

/* Recibe un string con el mensaje de la alerta y otro string con el tipo de mensaje.
 * La función permite mostrar mensajes del sistema después de realizar una operación */
function appAlerta(mensaje, tipo){
    //Reseta el estilo de la alerta
    $(".mdc-snackbar").removeClass("mensaje-error")
    $(".mdc-snackbar").removeClass("mensaje-advertencia")

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
    /* Variables globales: 'resultadosVisibles', 'totalResultados' y 'siguientePag'
     * declaradas en 'modulo-colectas.js' */
    const user = firebase.auth().currentUser;
    let valorFiltro = $("#index-filtro").val();
    let ordenarPor = valoresFirestore(valorFiltro);

    if($("#index").length) {
        compBarNavegacion(user, "index-barNav");
        listaResultados("colectas", ordenarPor, "index-listaRes");
    }

    $("#index-barNav").on("click", "#cerrarSesion", function(){
        cerrarSesion();
    });

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

/* Separar en funciones... */
function eventos() {

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
                let progress = Math.floor( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
                
                appAlerta("Por favor, espere mientras se carga el archivo. Cargado: " + progress + "%" , "mensaje-advertencia");
            }, function(error) {
                appAlerta(error.message, "mensaje-error");
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    appAlerta("Archivo " + file.name + " cargado con éxito.");
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
                appAlerta(error.message, "mensaje-error");
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

    // Eventos de planeaciones.html y etiquetas.html 

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

        if($("#lista-planeaciones").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-planeaciones", user.uid);
        }

        if($("#lista-etiquetas").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-etiquetas", user.uid, true);
        }
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
            if(!user.emailVerified) {
                appAlerta("Por favor, revise su correo electrónico y verifique su cuenta.", "mensaje-advertencia");
            }
        } else {
            accesoPagina();
        }

        pagIndex();
        pagIniciarSesion();
        pagRestablecerContrasena();
        pagRegistrar();
    });
}

$(document).ready(function() {
    aplicacionWeb();
});