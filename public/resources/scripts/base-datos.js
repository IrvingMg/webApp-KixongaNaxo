/* Agrega un documento a la colección indicada */
function agregarDocumento(nombreColeccion, documento) {
    return db.collection(nombreColeccion).add(documento)
    .then(function(docRef) {
        appAlerta("Información guardada con éxito.");
        return docRef.id;
    })
    .catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

/* Actualiza un documento a partir de su ID */
function actualizarDocumento(nombreColeccion, documento, docId) {
    db.collection(nombreColeccion).doc(docId).update(documento)
    .then(function() {
        appAlerta("Información guardada con éxito.");
    })
    .catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

/* Elimina un documento de la colección indicada a partir de su ID */
function borrarDocumento(nombreColeccion, docId) {
    db.collection(nombreColeccion).doc(docId).delete().then(function() {
        appAlerta("Información eliminada con éxito.");
    }).catch(function(error) {
        appAlerta(error.message, "mensaje-error");
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

function leerEtiquetas(docId, usuarioId) {
    return db.collection("etiquetas").where("id_usuario", "==", usuarioId ).where("id_colecta", "==", docId)
            .orderBy("nombre_comun", "asc").get(); 
}