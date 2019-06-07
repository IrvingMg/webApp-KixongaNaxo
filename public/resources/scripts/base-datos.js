/* Recibe el nombre de una colección y un objeto con los valores del documento.
 * La función crea el documento en la base de datos y escribe el id 
 * de forma oculta en la alerta del sistema */
function crearDoc(nombreColeccion, documento) {
    return db.collection(nombreColeccion).add(documento)
    .then(function(docRef) {
        // TODO: Comentar para Testing
        /*$("#app-docId").html(docRef.id);
        appAlerta("Información guardada con éxito.", "mensaje-exito");*/
    })
    .catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

/* Recibe el nombre de una colección, un objeto con los valores del documento,
y el id del documento a actualizar */
function actualizarDoc(nombreColeccion, documento, docId) {
    return db.collection(nombreColeccion).doc(docId).update(documento)
    .then(function() {
        // TODO: Comentar para Testing
        //appAlerta("Información guardada con éxito.", "mensaje-exito");
    })
    .catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

/* Recibe el nombre de una colección y el id del documento a eliminar */
function eliminarDoc(nombreColeccion, docId) {
    return db.collection(nombreColeccion).doc(docId).delete().then(function() {
        // TODO: Comentar para Testing
        //appAlerta("Información eliminada con éxito.", "mensaje-exito");
    }).catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

function buscarDocPorId(nombreColeccion, docId) {
    return db.collection(nombreColeccion).doc(docId).get() 
    .then(function(doc) {
        return doc;
    });
}

/* Recibe el id de un documento de colecta.
 * La función devuelve todos los documentos etiqueta relacionados con una colecta */
function buscarEtiquetasPorColecta(colectaId) {
    return db.collection("etiquetas").where("id_colecta", "==", colectaId).get();
}

/* Recibe el id de un documento de colecta y el id de un usuario y su nombre.
 * La función devuelve todos los documentos etiqueta relacionados con una colecta 
 * pertenecientes a un usuario */
function buscarEtiquetasColectasPorUsuario(docId, usuarioId, nombreUsuario) {
    return db.collection("etiquetas")
        .where("colector", "==", {"id_usuario": usuarioId, "nombre_usuario": nombreUsuario})
        .where("id_colecta", "==", docId)
        .orderBy("nombre_comun", "asc").get(); 
}

/* Obtiene el tamaño de una colección */
function leerTotalResultados(nombreColeccion, idUsuario, nombreUsuario) {
    let query;

    /* Si se recibe el parámetro idUsuario se hace una consulta por usuario
    sino se hace una consulta de los documentos públicos */
    if(idUsuario) {
        if(nombreUsuario){
            query = db.collection("colectas")
            .where("participantes", "array-contains", {"id_usuario" : idUsuario, "nombre_usuario": nombreUsuario})
        } else {
            query = db.collection(nombreColeccion).where("id_usuario", "==", idUsuario);
        }
    } else {
        query = db.collection(nombreColeccion).where("publico", "==", true);
    }

    return query
    .get()
    .then(function(docs) {
        return docs.size;
    });
}

/* Obtiene resultados de una colección por páginas/lotes */
function leerPagResultados(nombreColeccion, ordenCriterio, limitePag, siguientePag, idUsuario, nombreUsuario) {
    let pagina; 
    // Si es la primera vez que se invoca a la función devuelve la primera página de resultados
    if(siguientePag == null){
        if(idUsuario) {
            if(nombreUsuario){
                pagina = db.collection(nombreColeccion)
                .where("participantes", "array-contains", {"id_usuario" : idUsuario, "nombre_usuario": nombreUsuario})
                .orderBy(ordenCriterio[0], ordenCriterio[1]).limit(limitePag);
            } else {
                pagina = db.collection(nombreColeccion).where("id_usuario", "==", idUsuario)
                    .orderBy(ordenCriterio[0], ordenCriterio[1]).limit(limitePag);
            }
        } else {
            pagina = db.collection(nombreColeccion).where("publico", "==", true)
                .orderBy(ordenCriterio[0], ordenCriterio[1]).limit(limitePag);
        }            
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
                if(idUsuario) {
                    if(nombreUsuario) {
                        siguientePag =  db.collection(nombreColeccion)
                        .where("participantes", "array-contains", {"id_usuario" : idUsuario, "nombre_usuario": nombreUsuario})
                        .orderBy(ordenCriterio[0], ordenCriterio[1])
                        .startAfter(ultimoVisible).limit(limitePag);
                    } else {
                        siguientePag =  db.collection(nombreColeccion).where("id_usuario", "==", idUsuario)
                            .orderBy(ordenCriterio[0], ordenCriterio[1])
                            .startAfter(ultimoVisible).limit(limitePag);
                    }
                } else {
                    siguientePag =  db.collection(nombreColeccion).where("publico", "==", true)
                        .orderBy(ordenCriterio[0], ordenCriterio[1])
                        .startAfter(ultimoVisible).limit(limitePag);
                }
            } else {
                siguientePag = null;
            }
            
            return {resultadosPag, siguientePag};
        });
}

/* Recibe un string con el tipo de ordenamiento de la lista de resultados.
 * La función devuelve un Array con valores válidos para ordenar los resultados en Firestore */
function valorOrdenamiento(valorFiltro) {
    let ordenarPor;

    switch(valorFiltro) {
        case "t-asc":
            ordenarPor = ["titulo", "asc"];
        break;
        case "l-asc":
            ordenarPor = ["lugar", "asc"];
        break;
        case "f-asc":
            ordenarPor = ["fecha", "asc"];
        break;
        case "t-desc":
            ordenarPor = ["titulo", "desc"];
        break;
        case "l-desc":
            ordenarPor = ["lugar", "desc"];
        break;
        default:
            ordenarPor = ["fecha", "desc"];
    }
    return ordenarPor;
}