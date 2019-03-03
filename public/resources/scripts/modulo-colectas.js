/* Opcionalmente, recibe el id de un documento para actualizarlo.
 * La función crea o actualiza la información del formato de planeación
 * de una colecta */
function crearColecta(docId) {
    event.preventDefault();

    const user = firebase.auth().currentUser;
    const formValores = $("#pf-form").serializeArray();
    let planeacion = {};
 
    for(let i = 0; i < formValores.length; i++) {
        planeacion[formValores[i].name] = formValores[i].value;
    }
    
    planeacion["id_usuario"] = user.uid;
    planeacion["participantes"] = [];
    planeacion["material-campo"] = [
        "Tijeras de podar", "Navaja o cuchillo", "Lupa", "Cinta métrica", "Bolsas de plástico",
        "Periódico", "Cartón corrugado", "Prensa", "GPS Manual"];
    planeacion["info-consulta"] = []
    planeacion["publico"] = false;

    if(docId) {
        actualizarDoc("colectas", planeacion, docId);
    } else {
        crearDoc("colectas", planeacion);
    }
}

function crearListaMaterial(docId){
    const itemsLista = $("#pm-listaItems span").get();
    let planeacion = {"material-campo" : []};

    for(index in itemsLista) {
        planeacion["material-campo"].push(itemsLista[index].innerText);
    }
    
    actualizarDoc("colectas", planeacion, docId);
}

function crearListaInfoConsulta(docId, archivosSubir, nombreArchivosEliminar){
    const itemsLista = $("#pi-listaItems span").get();
    const totalSubir = archivosSubir.length;
    const totalEliminar = nombreArchivosEliminar.length;
    let casoGuardar;
    let archivosSubidos = 0;
    let archivosEliminados = 0;
    let planeacion = {"info-consulta" : []};
    
    for(index in itemsLista) {
        planeacion["info-consulta"].push(itemsLista[index].innerText);
    }

    /* Casos para guardar lista
     * Caso 1: Se eliminarán archivos y luego se subirán otros.
     * Caso 2: Únicamente se eliminarán archivos.
     * Caso 3: Únicamente se subirán archivos.
     * Caso 4: No se eliminarán archivos ni se subirán.*/
    if(totalEliminar && totalSubir) {
        casoGuardar = 1;
    } else if(totalEliminar) {
        casoGuardar = 2;
    } else if(totalSubir) {
        casoGuardar = 3;
    } else {
        casoGuardar = 4;
    }

    switch(casoGuardar) {
        case 1:
            for(index in nombreArchivosEliminar) {
                eliminarArchivo("info-consulta/"+docId+"/"+nombreArchivosEliminar[index]);
            }

            $("#planearInfo").bind("ArchivoEliminado", function() {
                archivosEliminados++;
                if(archivosEliminados === totalEliminar) {
                    for(index in archivosSubir) {
                        guardarArchivo(docId, archivosSubir[index]);
                    }
        
                    $("#planearInfo").bind("ArchivoSubido", function() {
                        archivosSubidos++;
                        if(archivosSubidos === totalSubir) {
                            actualizarDoc("colectas", planeacion, docId);
                        }
                    });
                }
            });
            break;
        case 2:
            for(index in nombreArchivosEliminar) {
                eliminarArchivo("info-consulta/"+docId+"/"+nombreArchivosEliminar[index]);
            }

            $("#planearInfo").bind("ArchivoEliminado", function() {
                archivosEliminados++;
                if(archivosEliminados === totalEliminar) {
                    actualizarDoc("colectas", planeacion, docId);
                }
            });
            break;
        case 3:
            for(index in archivosSubir) {
                guardarArchivo(docId, archivosSubir[index]);
            }

            $("#planearInfo").bind("ArchivoSubido", function() {
                archivosSubidos++;
                if(archivosSubidos === totalSubir) {
                    actualizarDoc("colectas", planeacion, docId);
                }
            });
            break;
        default:
            actualizarDoc("colectas", planeacion, docId);
    }
}

/* Recibe el id de un documento para leer su información y cargarla en el formato
 * de planeación para que pueda ser editada */
function editarFormatoPlaneacion(docId) {
    leerDocumento("colectas", docId).then(function(documento) {
        let doc = documento.data();

        for(let name in doc){
            if(name === "tipo") {
                if(doc[name] === "Interés específico") {
                    $("#pf-especifica").prop("checked", true);
                }
            } else {
                $("[name="+ name +"]").focus();
                $("[name="+ name +"]").val(doc[name]);
            }
        }
    });   
}

/* Recibe el id de un documento para leer su información y cargarla en la lista
 * de material de campo para que pueda ser editada */
function editarListaMaterial(docId) {
    leerDocumento("colectas", docId).then(function(documento) {
        let doc = documento.data();

        if(doc["material-campo"].length){
            $("#pm-mensajeDefault").remove();
            $("#pm-guardarItems").prop("disabled", false);
        }

        for(let index in doc["material-campo"]) {
            compItemListaIcono(doc["material-campo"][index], "pm-listaItems");
        }
    });   
}

/* Recibe el id de un documento para leer su información y cargarla en la lista
 * de información de consulta para que pueda ser editada */
function editarListaInfoConsulta(docId) {
    leerDocumento("colectas", docId).then(function(documento) {
        let doc = documento.data();

        if(doc["info-consulta"].length){
            $("#pi-mensajeDefault").remove();
            $("#pi-guardarItems").prop("disabled", false);
        }

        for(let index in doc["info-consulta"]) {
            compItemListaIcono(doc["info-consulta"][index], "pi-listaItems");
        }
    });   
}

/* Recibe el id de un documento de la colección 'colectas'.
 * La función elimina toda la información relacionada a la colecta tanto en
 * almacenamiento como en base de datos */
function eliminarColecta(docId) {
    buscarEtiquetasPorColecta(docId).then(function(documentos) {
        console.log(1);
        documentos.forEach(function(etiqueta) {
            console.log(2);
            eliminarDoc("etiquetas", etiqueta.id);
            eliminarArchivo("audios/"+etiqueta.id+"/");
            eliminarArchivo("fotografias/"+etiqueta.id +"/");
        });
    });
    console.log(3);
    eliminarArchivo("info-consulta/"+docId+"/");
    eliminarDoc("colectas", docId);
}

function consultaFormatoPlaneacion(docId) {
    leerDocumento("colectas", docId).then(function(documento) {
        compFormatoPlaneacion(documento.data());
    });
}

function consultaEtiquetas(docId, tipoEtiqueta) {
    leerDocumento("colectas", docId).then(function(documento) {
        compListaEtiquetas(documento.data(), tipoEtiqueta);
    });
}

function eliminarEtiquetas(docId, usuarioId) {
    leerEtiquetas(docId, usuarioId).then(function(docs){
        docs.forEach(function(doc) {
            borrarDocumento("etiquetas", doc.id);
        });
    });
}

/* Recibe un string con el tipo de ordenamiento de la lista de resultados.
 * La función devuelve un Array con valores válidos para ordenar los resultados en Firestore */
function valoresFirestore(valorFiltro) {
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

/* Recibe el nombre de la colección en la que se buscarán los documentos, el criterio de ordenamiento
 * de los resultados y el id del elemento en el que se mostrará la lista. Opcionalmente, se envía el id 
 * y nombre del usuario. 
 * La función genera la lista de resultados de colectas, planeaciones y etiquetas de manera paginada */
let siguientePag;
let totalResultados;
let resultadosVisibles = 0;
function listaResultados(nombreColeccion, ordenarPor, elementoId, idUsuario, nombreUsuario) {
    leerTotalResultados(nombreColeccion, idUsuario, nombreUsuario).then(function(totalDocumentos) {
        totalResultados = totalDocumentos;

        if(totalResultados != 0){
            const limitePag = 5;

            leerPagResultados(nombreColeccion, ordenarPor, limitePag, siguientePag, idUsuario, nombreUsuario)
            .then(function(objetoRes) {
                resultadosVisibles += objetoRes.resultadosPag.size;
                siguientePag = objetoRes.siguientePag;
    
                compItemsListaResultados(objetoRes.resultadosPag, elementoId);

                $("#"+elementoId).trigger("ConsultaExitosa");
            });    
        }
    });
}

// Función de prueba...
function crearEtiqueta(nombrePlanta) {
    const user = firebase.auth().currentUser;
    let etiqueta = {
        "id_usuario" : user.uid,
        "id_colecta" : "Z3aqqLXBNxf5ZIi8tpGV", 
        "fecha_colecta" : "2019-03-01",
        "fotografias" : ["string"],
        "ubicacion" : { 
            "longitud" : "number", 
            "latitud" : "number", 
            "altitud" : "number"
        },
        "caracteristicas_lugar" :"string",
        "nombre_comun" : nombrePlanta,
        "nombre_cientifico" : "string",
        "habito" : "string",
        "diametro" : "number",
        "abundancia" : "number",
        "descripcion_planta" : "string",
        "descripcion_flores" : "string",
        "descripcion_hojas" : "string",
        "descripcion_latex" : "string",
        "familia_botanica" : "string",
        "info_etnobotanica" : "string",
        "uso_medicinal" : "string",
        "modo_empleo" : "string",
        "numero_colecta" : "number",
        "audios" : ["string"]
    };

    agregarDocumento("etiquetas", etiqueta);
}