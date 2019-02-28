/* Controla el acceso a páginas de usuarios no registrados */
function accesoPagina() {
    $.post( "http://localhost:5001/webapp-kixonganaxo/us-central1/accesoPagina", //Cambiar URL para producción 
        { urlPath: window.location.pathname }
    ).done(function(data) {
        if(!data){
            window.location.replace("iniciar-sesion.html");
        }
    });
}

/* Activa o desactiva las alertas del sistema tipo 'mensaje-error' y 'mensaje-advertencia' */
function alertaSistema(mensaje, tipo){
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
function listaResultados(nombreColeccion, nombreLista, idUsuario) {
    const ordenCriterio = criteriofiltro($("#filtro-opciones").val());
    const limitePag = 5;
    
    leerTotalResultados(nombreColeccion, idUsuario).then(function(total) {
        totalResultados = total;

        if(totalResultados != 0){
            leerPagResultados(nombreColeccion, ordenCriterio, limitePag, siguientePag, idUsuario).then(function(objetoRes) {
                resultadosVisibles += objetoRes.resultadosPag.size;
                siguientePag = objetoRes.siguientePag;
    
                $("#chip-resultados").html("Resultados " + resultadosVisibles + " de " + totalResultados);
                itemsLista(objetoRes.resultadosPag, nombreLista);
    
                if(resultadosVisibles === totalResultados){
                    $("#btn-mas").prop("disabled", true); 
                }
            });    
        } else {
            mensajeContenedor("No se encontraron resultados para mostrar.");
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
        
        agregarItemIconoLista(itemMaterial, "lista-items-material");
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

    $("#planeacion3-finalizar").click(function(){ 
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");

        console.log("Finalizar y publicar");
    });

    //Eventos de info-consulta.html
    $("#planeacion3-atras").click(function(){ 
        const params = new URLSearchParams(location.search.substring(1));
        const docId = params.get("query");

        $("#planeacion3-atras").attr("href", "material-campo.html?query=" + docId);
    });

    // Eventos de consulta-planeacion.html
    if($("#formato-planeacion").get().length){
        consultaFormatoPlaneacion();
    }

    // Eventos de index.html, planeaciones.html y etiquetas.html 
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
    });

    $("#btn-mas").click(function() {
        if($("#lista-colectas").get().length){
            listaResultados("colectas", "lista-colectas");
        }

        if($("#lista-planeaciones").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-planeaciones", user.uid);
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

    $("#dialog-aceptar").click(function() {
        const docId = $("#id-documento").text();
        borrarDocumento("colectas", docId);
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });

    $("#dialog-cancelar").click(function() {
        $(".mdc-dialog").removeClass("mdc-dialog--open");
    });

    
}

/* Función principal de la aplicación web */
function aplicacionWeb() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if(!user.emailVerified) {
                alertaSistema("Por favor, verifique su dirección de correo electrónico.", "mensaje-advertencia");
            }
        } else {
            accesoPagina();
        }
        opcionesBarNavegacion(user);
        eventos();

        if($("#lista-colectas").get().length){
            listaResultados("colectas", "lista-colectas");
        }

        if($("#lista-planeaciones").get().length){
            const user = firebase.auth().currentUser;
            listaResultados("colectas", "lista-planeaciones", user.uid);
        }
    });
}

$(document).ready(function() {
    aplicacionWeb();
});

//Funciones para incluir en otros archivos...
//Corregir función
function consultaFormatoPlaneacion() {
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");

    leerDocumento("colectas", docId).then(function(documento) {
        const encabezado =
        `<h5 class="mdc-typography--headline5">`+ documento.data().titulo +`</h5>
        <p class="mdc-typography--body2">`+ documento.data().id_participantes.length +` colectores</p>`;
        $(".encabezado-section").html(encabezado);

        const nombre = ["Responsable", "Objetivo", "Tipo de colecta", "Fecha de colecta", 
            "Lugar de colecta", "Especies de interés", "Material de campo", 
            "Información de consulta","Información adicional"];
        const indiceVal = ["responsable", "objetivo", "tipo", "fecha", "lugar", 
            "especies", "material-campo", "info-consulta","info-adicional"];

        let formato = "";
        for(let i = 0; i < nombre.length; i++) {
            formato += 
            `<li>
                <p class="mdc-typography--body1 h7">`+ nombre[i] +`</p>
                <p class="mdc-typography--body1 texto-info">` +  documento.data()[indiceVal[i]] + `</p>
            </li>
            `;
        } 
        $(".lista-info-consulta").html(formato);
    });
}

function editarFormatoPlaneacion(docId) {
    leerDocumento("colectas", docId).then(function(documento) {
        let doc = documento.data();

        for(let name in doc){
            if(name === "tipo") {
                if(doc[name] != "Exploratoria")
                $("#tipo-especifico").prop("checked", true);;
            } else {
                $("[name="+ name +"]").focus();
                $("[name="+ name +"]").val(doc[name]);
            }
        }
    });   
}

function editarListaMaterial(docId) {
    leerDocumento("colectas", docId).then(function(documento) {
        let doc = documento.data();

        for(let index in doc["material-campo"]) {
            agregarItemIconoLista(doc["material-campo"][index], "lista-items-material");
        }
    });   
}

function crearColecta(docId) {
    const formValores = $("#form-nuevaPlaneacion1").serializeArray();
    const user = firebase.auth().currentUser;
    let planeacion = {};
 
    event.preventDefault();
    
    for(let i = 0; i < formValores.length; i++){
        if(formValores[i].value != "") {
            planeacion[formValores[i].name] = formValores[i].value;
        } else {
            planeacion[formValores[i].name] = "No hay información disponible."
        }
    }
    planeacion["id_usuario"] = user.uid;
    planeacion["id_participantes"] = [];
    planeacion["material-campo"] = [
        "Tijeras de podar", "Navaja o cuchillo", "Lupa", "Cinta métrica", "Bolsas de plástico",
        "Periódico", "Cartón corrugado", "Prensa", "GPS Manual"];
    planeacion["info-consulta"] = []
    planeacion["publico"] = false;

    if(docId) {
        actualizarDocumento("colectas", planeacion, docId);
    } else {
        agregarDocumento("colectas", planeacion).then(function(docId) {
            $("#planeacion1-siguiente").attr("href", "material-campo.html?query=" + docId);
        });
    }
    
}

function crearListaMaterial(){
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");

    const itemsLista = $("#lista-items-material span").get();
    let planeacion = {"material-campo" : []};

    for(index in itemsLista) {
        planeacion["material-campo"].push(itemsLista[index].innerText);
    }
    
    actualizarDocumento("colectas", planeacion, docId);
}