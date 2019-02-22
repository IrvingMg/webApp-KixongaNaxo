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

function mensajeContenedor(mensaje){
    $("#contenedor").html(
        `<p class="mdc-typography--body1 cont-mensaje">`+ mensaje +`</p>`
    );
}

function etiquetaResultados(totalResultados){
    $("#chip-resultados").html("Resultados " + totalResultados);
}

function listaColectas(query) {
    query.forEach(function(doc) {
        // Verifica que la planeación de la colecta haya finalizado
        if(doc.data().publico === false) {
            let item = 
                `<li>
                    <div class="mdc-card mdc-card--outlined">
                        <div class="mdc-card__primary-action lista-resultados-item">
                            <span class="mdc-list-item__text">
                                <p class="mdc-typography--body1 h7">`+ doc.data().titulo +`</p>
                                <p class="mdc-typography--body2">`+ doc.data().lugar +`</p>
                                <p class="mdc-typography--body2">`+ doc.data().fecha +`</p>
                            </span>
                        </div>
                    </div>
                </li>`;
            $("#lista-colectas").append(item);
        }
    });

}

function listaPrivada(){
    query.forEach(function(doc){
        let item = 
            `<li>
                <div class="mdc-card mdc-card--outlined">
                    <div class="mdc-card__primary-action lista-resultados-item">
                        <span class="mdc-list-item__text">
                            <p class="mdc-typography--body1 h7">`+ doc.data().titulo +`</p>
                            <p class="mdc-typography--body2">`+ doc.data().lugar +`</p>
                            <p class="mdc-typography--body2">`+ doc.data().fecha +`</p>
                        </span>
                    </div>
                    <div class="mdc-card__actions">
                        <div class="mdc-card__action-buttons">
                            <button class="mdc-button  mdc-card__action mdc-card__action--button">
                                <i class="material-icons mdc-button__icon">delete</i>
                                <span class="mdc-button__label">Eliminar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </li>`
        $("#lista-privada").append(item);
    });
}