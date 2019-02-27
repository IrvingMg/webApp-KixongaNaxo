/* Agrega un documento a la colección indicada */
function agregarDocumento(nombreColeccion, doc, docId) {
    let query;
    //Si recibe id de documento, actualízalo, sino crea uno nuevo
    if(docId) {
        query =  db.collection(nombreColeccion).doc(docId).update(doc);
    } else {
        query = db.collection(nombreColeccion).add(doc);
    }

    query
    .then(function(docRef) {
        alertaSistema("Información guardada con éxito.");
    })
    .catch(function(error) {
        alertaSistema(error.message, "mensaje-error");
    });
}

/* Elimina un documento de la colección indicada a partir de su ID */
function borrarDocumento(nombreColeccion, docId) {
    db.collection(nombreColeccion).doc(docId).delete().then(function() {
        alertaSistema("Información eliminada con éxito.");
        location.reload();
    }).catch(function(error) {
        alertaSistema(error.message, "mensaje-error");
    });
}

/* Obtiene un documento de la colección indicada a partir de su ID */
function leerDocumento(nombreColeccion, docId) {
    return db.collection(nombreColeccion).doc(docId).get() 
    .then(function(doc) {
        return doc;
    });
}

/* Obtiene el tamaño de una colección */
function leerTotalResultados(nombreColeccion, idUsuario) {
    let query;

    /* Si se recibe el parámetro idUsuario se hace una consulta por usuario
    sino se hace una consulta de los documentos públicos */
    if(idUsuario) {
        query = db.collection(nombreColeccion).where("id_usuario", "==", idUsuario);
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
function leerPagResultados(nombreColeccion, ordenCriterio, limitePag, siguientePag, idUsuario) {
    let pagina; 

    // Si es la primera vez que se invoca a la función devuelve la primera página de resultados
    if(siguientePag == null){
        if(idUsuario) {
            pagina = db.collection(nombreColeccion).where("id_usuario", "==", idUsuario)
                .orderBy(ordenCriterio[0], ordenCriterio[1]).limit(limitePag);
        } else {
            pagina = db.collection(nombreColeccion).where("publico", "==", false)
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
                    siguientePag =  db.collection(nombreColeccion).where("id_usuario", "==", idUsuario)
                        .orderBy(ordenCriterio[0], ordenCriterio[1])
                        .startAfter(ultimoVisible).limit(limitePag);
                } else {
                    siguientePag =  db.collection(nombreColeccion).where("publico", "==", false)
                        .orderBy(ordenCriterio[0], ordenCriterio[1])
                        .startAfter(ultimoVisible).limit(limitePag);
                }
            } else {
                siguientePag = null;
            }
            
            return {resultadosPag, siguientePag};
        });
}