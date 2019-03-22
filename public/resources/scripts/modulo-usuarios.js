function iniciarSesion() {
    const formValores = $("#is-form").serializeArray();
    const email = formValores[0].value;
    const password = formValores[1].value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function() {
        window.location.replace("index.html");
    })
    .catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

function cerrarSesion() {
    firebase.auth().signOut()
    .catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

function restablecerContrasena() {
    const correo = $("#rc-correo").val();
    
    firebase.auth().sendPasswordResetEmail(correo).then(function() {
        $("#rc-correo").focusout();
        $("#rc-form").trigger("reset");
        appAlerta(
            "Correo enviado. Por favor, revise su correo electrónico y siga las instrucciones.", 
            "mensaje-exito"
        );
    }).catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

function crearCuenta() {
    const formValores = $("#reg-form").serializeArray();
    const nombre = formValores[0].value;
    const email = formValores[1].value;
    const password = formValores[2].value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function() {
        firebase.auth().currentUser.updateProfile({
            displayName: nombre,
          })
          .catch(function(error) {
            appAlerta(error.message, "mensaje-error");
        });
        verificarCorreo();
    })
    .catch(function(error){
        appAlerta(error.message, "mensaje-error");
    })
}

/* La función envía un correo de verificación al terminar el registro de usuario */
function verificarCorreo() {
    const user = firebase.auth().currentUser;

    user.sendEmailVerification()
    .then(function() {
        window.location.replace("index.html");
    })
    .catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

/* Recibe el id del boton que cambia la visibilidad de la contraseña, 
 * y el id de un elemento input type="password".
 * La función muestra y oculta la contraseña de un input type="password" */
function visibilidadContrasena(botonId, inputId) {
    const elemento = $("#"+botonId);
    let icono;
    let tituloValor;
    let tipoValor;

    if ( elemento.html() === "visibility" ) {
        icono = "visibility_off";
        tituloValor = "Ocultar contraseña";
        tipoValor = "text";
    } else {
        icono = "visibility";
        tituloValor = "Mostrar contraseña";
        tipoValor = "password";
    }
    
    elemento.html(icono);
    elemento.attr("title", tituloValor);
    $("#"+inputId).attr("type", tipoValor);
}