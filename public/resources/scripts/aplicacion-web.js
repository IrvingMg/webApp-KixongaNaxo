/* Activa/desactiva alertas del sistema tipo 'mensaje-error' y 'mensaje-advertencia' */
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

function init() {
    let sesionIniciada;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            sesionIniciada = true;
     
            if(!user.emailVerified) {
                alertaSistema("Por favor, verifique su dirección de correo electrónico.", "mensaje-advertencia");
            }
        } else {
            accesoPagina();
            sesionIniciada = false;
        }
        opcionesBarNavegacion(sesionIniciada);

        //Eventos
        $("#contrasena-visible").click(function() {
            visibilidadContrasena();
        });

        $("#form-registrar").submit(function() {
            crearCuenta();
        });

        $("#form-login").submit(function() {
            iniciarSesion();
        });

        $("#form-restablecer").submit(function() {
            restablecerContrasena();
        });

        $("#cerrar-sesion").click(function() {
            cerrarSesion();
        });

        $("#form-nuevaPlaneacion1").submit(function() {
            crearColecta();
        });

        let siguienteLote;
        let ordenarPor;
        $("#filtro-opciones").ready( function(){
            ordenarPor = criteriofiltro($("#filtro-opciones").val());

            leerColectasPaginado(ordenarPor, siguienteLote).then(function(lote){
                siguienteLote = lote;
            });
        });

        $("#filtro-opciones").change(function(){
            $("#lista-colectas").empty();
            siguienteLote = null;
            ordenarPor = criteriofiltro($("#filtro-opciones").val());
            leerColectasPaginado(ordenarPor, siguienteLote).then(function(lote){
                siguienteLote = lote;
            });
        });

        $("#mas-colectas").click(function() {
            if(siguienteLote){
                leerColectasPaginado(ordenarPor, siguienteLote).then(function(lote){
                    siguienteLote = lote;
                });
            }
        });

    });
}

$(document).ready(function() {
    init();   
});