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
function listaResultados(nombreColeccion, nombreLista) {
    const ordenCriterio = criteriofiltro($("#filtro-opciones").val());
    const limitePag = 5;
    
    leerTotalResultados(nombreColeccion).then(function(total) {
        totalResultados = total;

        if(totalResultados != 0){
            leerPagResultados(nombreColeccion, ordenCriterio, limitePag, siguientePag).then(function(objetoRes) {
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

    // Barra de navegación 
    $("#cerrar-sesion").click(function() {
        cerrarSesion();
    });

    // Contenido
    $("#form-registrar").submit(function() {
        crearCuenta();
    });

    $("#form-login").submit(function() {
        iniciarSesion();
    });

    $("#form-restablecer").submit(function() {
        restablecerContrasena();
    });

    $("#form-nuevaPlaneacion1").submit(function() {
        crearColecta();
    });

    $("#contrasena-visible").click(function() {
        visibilidadContrasena();
    });

    $("#filtro-opciones").change(function(){
        siguientePag = null;
        resultadosVisibles = 0;
        $("#btn-mas").prop("disabled", false); 
        $(".lista-resultados").empty();

        if($("#lista-colectas").get().length){
            console.log("Lista colectas");
            listaResultados("colectas", "lista-colectas");
        }

        if($("#lista-planeaciones").get().length){
            console.log("Lista planeaciones");
            listaResultados("colectas", "lista-planeaciones");
        }
    });

    $("#btn-mas").click(function() {
        if($("#lista-colectas").get().length){
            listaResultados("colectas", "lista-colectas");
        }

        if($("#lista-planeaciones").get().length){
            listaResultados("colectas", "lista-planeaciones");
        }
    });

    $("#lista-colectas").on("click", "li", function() {
        const docId = $(this).attr("id");
        window.location.replace("consulta-planeacion.html?query=" + docId);
    });

    if($("#formato-planeacion").get().length){
        console.log("Leer..");
        formatoPlaneacion();
    }
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
            console.log("Lista colectas");
            listaResultados("colectas", "lista-colectas");
        }

        if($("#lista-planeaciones").get().length){
            console.log("Lista planeaciones");
            listaResultados("colectas", "lista-planeaciones");
        }
    });
}

$(document).ready(function() {
    aplicacionWeb();
});

function formatoPlaneacion() {
    const docId = location.search.substring(7);

    leerDocumento(docId).then(function(documento) {
        console.log(documento.data());
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