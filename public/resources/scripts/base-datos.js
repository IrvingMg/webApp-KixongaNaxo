/* Función para guardar el formato de planeación y crear una colecta*/
function crearColecta() {
    const formValores = $("#form-nuevaPlaneacion1").serializeArray();
    const user = firebase.auth().currentUser;
    let planeacion = {};
 
    event.preventDefault();
    
    for(let i = 0; i < formValores.length; i++){
        planeacion[formValores[i].name] = formValores[i].value;
    }
    planeacion["id_usuario"] = user.uid;
    planeacion["id_participantes"] = [];
    planeacion["material-campo"] = [];
    planeacion["info-consulta"] = []
    planeacion["publico"] = false;

    db.collection("colectas").add(planeacion)
    .then(function(docRef) {
        alertaSistema("Formato de planeación guardado con éxito.");
    })
    .catch(function(error) {
        alertaSistema(error.message, "mensaje-error");
    });
}

/* Obtiene el tamaño de una colección */
function leerTotalResultados(nombreColeccion) {
    return db.collection("colectas").where("publico", "==", false).get() //Cambiar valor de 'publico' a true
    .then(function(docs) {
        return docs.size;
    });
}

/* Obtiene resultados de una colección por páginas/lotes */
function leerPagResultados(nombreColeccion, ordenCriterio, limitePag, siguientePag) {
    let pagina; 

    // Si es la primera vez que se invoca a la función devuelve la primera página de resultados
    if(siguientePag == null){
        pagina = db.collection(nombreColeccion).orderBy(ordenCriterio[0], ordenCriterio[1]).limit(limitePag);
    } else {
        pagina = siguientePag;
    }

    return pagina
        .get()
        .then(function (documentSnapshots) {
            const ultimoVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
            const resultadosPag = documentSnapshots;
            let siguientePag;

            //Verifica que existen más resultados por mostrar
            if(ultimoVisible){
                siguientePag =  db.collection(nombreColeccion)
                    .orderBy(ordenCriterio[0], ordenCriterio[1]).startAfter(ultimoVisible).limit(limitePag);
            } else {
                siguientePag = null;
            }

            return {resultadosPag, siguientePag};
        });
}