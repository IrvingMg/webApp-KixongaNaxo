/* Redirecciona en caso de ingresar a una página para usuarios registrados */
function permisoPagina() {
    const permiso = $("body").attr("id");

    if (permiso === "no-publico") {
        window.location.replace("iniciar-sesion.html");
    }
}

/* Recibe un valor booleando indicando si se ha iniciado sesión
y retorna una cadena con las opciones a mostrar en la barra de navegación */
function opcionesBarNavegacion(sesion) {
    let opcionesBarNav;
    
    if (sesion) {  
        opcionesBarNav = 
            `<a href="planeaciones.html" class="enlace-boton">
                <button class="mdc-button mdc-button--raised bar-nav-boton">
                    <span class="mdc-button__label">Mis planeaciones</span>
                </button>
            </a>
            <a href="etiquetas.html" class="enlace-boton">
                <button class="mdc-button mdc-button--raised bar-nav-boton">
                    <span class="mdc-button__label">Mis etiquetas</span>
                </button>
            </a>
            <a href="index.html" class="enlace-boton">
                <button class="mdc-button mdc-button--raised bar-nav-boton">
                    <span class="mdc-button__label">Cerrar sesión</span>
                </button>
            </a>`;
    } else {
        opcionesBarNav =
            `<a href="iniciar-sesion.html" class="enlace-boton">
                <button class="mdc-button mdc-button--raised bar-nav-boton">
                    <span class="mdc-button__label">Iniciar sesión</span>
                </button>
            </a>
            <a href="registrar.html" class="enlace-boton">
                <button class="mdc-button mdc-button--raised bar-nav-boton">
                    <span class="mdc-button__label">Registrarse</span>
                </button>
            </a>`;
    }

    $("#bar-nav-menu").html(opcionesBarNav);
}

function init() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          console.log(displayName);
          console.log(email);
          console.log(emailVerified);
            opcionesBarNavegacion(true);
        } else {
            permisoPagina();
            opcionesBarNavegacion(false);
        }
    });
}

$(document).ready(function(){
    init();

    //Funciones de admin-usuarios.js
    $("#contrasena-visible").click(function(){
        visibilidadContrasena();
    });

    $("#form-registrar").submit(function(){
        crearCuenta();
    });
    //Fin
});