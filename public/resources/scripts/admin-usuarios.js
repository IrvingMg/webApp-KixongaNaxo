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
            const errorMessage = error.message;
            console.log(errorMessage);
        });
        verificarCorreo();
    })
    .catch(function(error){
        const errorMessage = error.message;
        console.log(errorMessage);
    })
}

function verificarCorreo(){
    const user = firebase.auth().currentUser;

    user.sendEmailVerification()
    .then(function() {
        window.location.replace("index.html");
    })
    .catch(function(error) {
        const errorMessage = error.message;
        console.log(errorMessage);
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
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}

function cerrarSesion() {
    firebase.auth().signOut()
    .catch(function(error) {
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}