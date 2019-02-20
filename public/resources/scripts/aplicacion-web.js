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

function init() {
    let sesionIniciada;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            sesionIniciada = true;
            console.log("Sesión iniciada");
            if(!user.emailVerified) {
                alertaSistema("Por favor, verifique su dirección de correo electrónico.", "mensaje-advertencia");
            }
        } else {
            accesoPagina();
            sesionIniciada = false;
            console.log("Sesión cerrada");
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
        
    });
}

$(document).ready(function() {
    init();   
});