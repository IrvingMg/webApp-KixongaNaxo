/* Redirecciona en caso de ingresar a una página para usuarios registrados */
function permisoPagina() {
    const permiso = $("body").attr("id");

    if (permiso === "no-publico") {
        window.location.replace("index.html");
    }
}

/* Recibe un valor booleando indicando si se ha iniciado sesión
y genera una cadena con las opciones de la barra de navegación */
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
            <button type="button" class="mdc-button mdc-button--raised bar-nav-boton" id="cerrar-sesion">
                <span class="mdc-button__label">Cerrar sesión</span>
            </button>`;
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
    let sesionIniciada;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            sesionIniciada = true;
            console.log("Sesión iniciada");
            
        } else {
            permisoPagina();
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

        $("#cerrar-sesion").click(function() {
            cerrarSesion();
        });
    });
}

$(document).ready(function() {
    init();
});