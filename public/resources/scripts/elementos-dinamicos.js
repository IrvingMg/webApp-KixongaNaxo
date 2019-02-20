/* Recibe un valor booleando indicando si se ha iniciado sesión
y genera una cadena con las opciones de la barra de navegación */
function opcionesBarNavegacion(sesionIniciada) {
    let opcionesBarNav;
    
    if (sesionIniciada) {  
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
            <button class="mdc-button mdc-button--raised bar-nav-boton" id="cerrar-sesion">
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