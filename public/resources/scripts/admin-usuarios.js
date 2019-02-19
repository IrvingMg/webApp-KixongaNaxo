/* Funciones para el registro de usuarios */
function crearCuenta() {
    const formValores = $("#form-registrar").serializeArray();
    const nombre = formValores[0].value;
    const email = formValores[1].value;
    const password = formValores[2].value;

    event.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function() {
        console.log("Registro exitoso");
        firebase.auth().currentUser.updateProfile({
            displayName: nombre,
          })
          .catch(function(error) {
            alertaSistema(error.message, "mensaje-error");
        });
        verificarCorreo();
    })
    .catch(function(error){
        alertaSistema(error.message, "mensaje-error");
    })
}

function verificarCorreo() {
    const user = firebase.auth().currentUser;

    user.sendEmailVerification()
    .then(function() {
        window.location.replace("index.html");
    })
    .catch(function(error) {
        alertaSistema(error.message, "mensaje-error");
    });
}

function restablecerContrasena() {
    const correo = $("#rest-correo").val();
    event.preventDefault();

    firebase.auth().sendPasswordResetEmail(correo).then(function() {
        $("#rest-correo").focusout();
        $("#form-restablecer").trigger("reset");
        alertaSistema("Correo enviado. Revise su correo electrónico y siga las instrucciones.", "");
    }).catch(function(error) {
        alertaSistema(error.message, "mensaje-error");
    });
}

function visibilidadContrasena() {
    const elemento = $("#contrasena-visible");
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
    $("#reg-contrasena").attr("type", tipoValor);
    $("#login-contrasena").attr("type", tipoValor);
}

/* Funciones para el inicio/cierre de sesión de usuarios*/
function iniciarSesion() {
    const formValores = $("#form-login").serializeArray();
    const email = formValores[0].value;
    const password = formValores[1].value;
    
    event.preventDefault();
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function() {
        window.location.replace("index.html");
    })
    .catch(function(error) {
        alertaSistema(error.message, "mensaje-error");
    });
}

function cerrarSesion() {
    firebase.auth().signOut()
    .catch(function(error) {
        alertaSistema(error.message, "mensaje-error");
    });
}