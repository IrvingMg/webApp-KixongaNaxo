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

function leerColectasPaginado(ordenarPor, siguienteLote){
    const limiteLote = 5;
    let lote; 

    if(siguienteLote == null){
        lote = db.collection("colectas").orderBy(ordenarPor[0], ordenarPor[1]).limit(limiteLote);
    } else {
        lote = siguienteLote;
    }

    return lote.get()
    .then(function (documentSnapshots) {
        const ultimoVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        
        listaColectas(documentSnapshots);

        if(ultimoVisible){
            return db.collection("colectas").orderBy(ordenarPor[0], ordenarPor[1]).startAfter(ultimoVisible).limit(limiteLote);
        } else {
            return null;
        }
    });
}


function leerColectas(ordenarPor) {
    db.collection("colectas").orderBy(ordenarPor[0], ordenarPor[1])
    .get()
    .then(function(query) {
        const totalResultados = query.size;

        if(totalResultados != 0) {
            etiquetaResultados(totalResultados);
            listaColectas(query);
        } else {
            mensajeContenedor("No se encontraron resultados para mostrar.");
        }
    });
}