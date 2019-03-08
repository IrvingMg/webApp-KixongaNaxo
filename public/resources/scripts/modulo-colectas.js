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
    
    for(let index in itemsLista) {
        planeacion["info-consulta"].push(itemsLista[index].innerText);
    }

    if(!totalEliminar && !totalSubir) {
        actualizarDoc("colectas", planeacion, docId);
    } else {
        for(let index in nombreArchivosEliminar) {
            eliminarArchivo("info-consulta/"+docId+"/"+nombreArchivosEliminar[index]);
        }

        for(let index in archivosSubir) {
            guardarArchivo(archivosSubir[index], "info-consulta/"+ docId + "/" + archivosSubir[index].name);
        }

        $("#planearInfo").bind("ArchivoEliminado", function() {
            archivosEliminados++;
            if(archivosEliminados === totalEliminar && archivosSubidos === totalSubir) {
                actualizarDoc("colectas", planeacion, docId);
            }
        });

        $("#planearInfo").bind("ArchivoSubido", function() {
            archivosSubidos++;
            if(archivosSubidos === totalSubir && archivosEliminados === totalEliminar) {
                actualizarDoc("colectas", planeacion, docId);
            }
        });
    }
}

/* Recibe el id de un documento para leer su información y cargarla en el formato
 * de planeación para que pueda ser editada */
function editarFormatoPlaneacion(docId) {
    buscarDocPorId("colectas", docId).then(function(documento) {
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
    buscarDocPorId("colectas", docId).then(function(documento) {
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
    buscarDocPorId("colectas", docId).then(function(documento) {
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

function editarEtiqueta(docId) {
    buscarDocPorId("etiquetas", docId).then(function(documento) {
        let doc = documento.data();

        for(let name in doc) {
            if(name != "fotografias") {
                $("[name="+ name +"]").focus();
                $("[name="+ name +"]").val(doc[name]);
            }
        }
    
        $("[name=latitud]").val(doc["ubicacion"]["latitude"]);
        $("[name=longitud]").val(doc["ubicacion"]["longitude"]);
        $("[name=longitud]").focus();
        $("[name=latitud]").focus();
   })
}

function guardarEtiqueta(etiquetaId, fotos, fotosEliminar) {
    const nuevasFotos = $("#etiquetar-fotografias").get(0).files;
    let etiqueta = {};
    let latitud;
    let longitud;
    let fotosSubir = [];
    let eliminados = 0;
    let subidos = 0;

    const formValores = $("#etiquetar-form").serializeArray();

    for(let index in formValores) {
        if(formValores[index]["name"] === "latitud") {
            latitud = parseFloat(formValores[index]["value"]);
        } else if(formValores[index]["name"] === "longitud") {
            longitud = parseFloat(formValores[index]["value"]);
        } else {
            etiqueta[formValores[index]["name"]] = formValores[index]["value"];
        }
    }
    const ubicacion = new firebase.firestore.GeoPoint(latitud, longitud);
    etiqueta["ubicacion"] = ubicacion;
  
    if(!nuevasFotos.length && !fotosEliminar.length) {
        actualizarDoc("etiquetas", etiqueta, etiquetaId);
    } else {
        for(let i = 0; i < nuevasFotos.length; i++) {
            fotos.push(nuevasFotos[i].name);
            fotosSubir.push(nuevasFotos[i]);
        }
        etiqueta["fotografias"] = fotos;

        for(let index in fotosEliminar) {
            eliminarArchivo("fotos/"+etiquetaId+"/"+fotosEliminar[index]);
        }

        for(let index in fotosSubir) {
            guardarArchivo(fotosSubir[index] ,"fotos/"+ etiquetaId + "/" + fotosSubir[index].name);
        }

        $("#etiquetar").bind("ArchivoEliminado", function() {
            eliminados++;
            if(eliminados === fotosEliminar.length && subidos === fotosSubir.length) {
                actualizarDoc("etiquetas", etiqueta, etiquetaId);
            }
        });

        $("#etiquetar").bind("ArchivoSubido", function() {
            subidos++;
            if(eliminados === fotosEliminar.length && subidos === fotosSubir.length) {
                actualizarDoc("etiquetas", etiqueta, etiquetaId);
            }
        });
    }
}

/* Recibe el id de un documento de la colección 'colectas'.
 * La función elimina toda la información relacionada a la colecta tanto en
 * almacenamiento como en base de datos */
function eliminarColecta(docId) {
    buscarEtiquetasPorColecta(docId).then(function(documentos) {
        documentos.forEach(function(etiqueta) {
            const doc = etiqueta.data();
            //Elimina fotografías y audios relacionados a la etiqueta
            for(let index in doc["fotografias"]) {
                const nombreArchivo = doc["fotografias"][index];

                eliminarArchivo("fotos/"+etiqueta.id+"/"+nombreArchivo);
            }

            for(let index in doc["audios"]) {
                const nombreArchivo = doc["audios"][index];

                eliminarArchivo("audios/"+etiqueta.id+"/"+nombreArchivo);
            }
            //Elimina la etiqueta relacionada a la colecta
            eliminarDoc("etiquetas", etiqueta.id);
        });
        
        buscarDocPorId("colectas", docId).then(function(documento) {
            const doc = documento.data();
            //Elimina los archivos de información de consulta
            for(let index in doc["info-consulta"]) {
                const elemento = doc["info-consulta"][index];
                if(elemento.search("Archivo: ") === 0) {
                    const nombreArchivo = elemento.substring(9);
                
                    eliminarArchivo("info-consulta/"+docId+"/"+nombreArchivo);
                }
            }
            //Elimina la colecta
            eliminarDoc("colectas", docId);
        });
    });
}

function eliminarEtiquetas(docId, usuarioId, nombreUsuario) {
    buscarEtiquetasColectasPorUsuario(docId, usuarioId, nombreUsuario).then(function(documentos){
        documentos.forEach(function(etiqueta) {
            const doc = etiqueta.data();
            //Elimina fotografías y audios relacionados a la etiqueta
            for(let index in doc["fotografias"]) {
                const nombreArchivo = doc["fotografias"][index];

                eliminarArchivo("fotos/"+etiqueta.id+"/"+nombreArchivo);
            }

            for(let index in doc["audios"]) {
                const nombreArchivo = doc["audios"][index];

                eliminarArchivo("audios/"+etiqueta.id+"/"+nombreArchivo);
            }
            //Elimina la etiqueta del usuario relacionada a la colecta
            eliminarDoc("etiquetas", etiqueta.id);
        });
        //Elimina al usuario como participante de la colecta
        buscarDocPorId("colectas",docId).then(function(documento) {
            const participantes = documento.data()["participantes"];
            const index = participantes.indexOf({"id_usuario": usuarioId, "nombre_usuario": nombreUsuario});
            participantes.splice(index, 1);
            actualizarDoc("colectas", {"participantes": participantes}, docId);
        });
    });
}

/* Recibe los datos de un formato de planeación  y su id.
 * La función genera un archivo pdf con la información del documento */
function formatoPlaneacionPDF(infoFormato, docId) {
    const doc = new jsPDF("p", "cm", "letter");
    const margenIzq = 3;
    const margenDer = 3; 

    doc.setFontSize(16);
    doc.text(infoFormato.titulo, margenIzq, nuevaLinea(0));
    doc.setFontSize(11);
    doc.text(infoFormato["participantes"].length + " colectores", margenIzq, nuevaLinea(1));
    doc.line(margenIzq, nuevaLinea(2), doc.internal.pageSize.getWidth() - margenDer, nuevaLinea(2));

    const nombreCampo = ["Responsable", "Objetivo", "Tipo de colecta", "Fecha de colecta", 
        "Lugar de colecta", "Especies de interés", "Material de campo", 
        "Información de consulta","Información adicional"];
    const indices = ["responsable", "objetivo", "tipo", "fecha", "lugar", 
        "especies", "material-campo", "info-consulta","info-adicional"];
        
    let contenido = [];
    for(let i=0; i < indices.length; i++) {
        contenido.push([nombreCampo[i], infoFormato[indices[i]] ]);
    }

    doc.autoTable({
        columnStyles: {0: {fontSize: 11, textColor: [0, 0, 0]}},
        body: contenido,
        margin: {top: nuevaLinea(3), left: margenIzq, right: 3}
    });

    doc.save(docId+".pdf");
}


function etiquetaPDF(infoEtiqueta, etiquetaId) {
    const doc = new jsPDF("p", "cm", "letter");
    const margenIzq = 3;
    const margenDer = 3; 

    doc.setFontSize(16);
    doc.text("Etiqueta de herbario", margenIzq, nuevaLinea(0));
    doc.line(margenIzq, nuevaLinea(1), doc.internal.pageSize.getWidth() - margenDer, nuevaLinea(1));
 

    const nombreCampo = ["Nombre común", "Nombre científico", "Familia botánica", 
        "Descripción de la planta", "Sitio de colecta", "Ubicación GPS", "Información etnobotánica",
        "Uso medicinal", "Modo de empleo", "Fecha de colecta", "Colector", "Número de colecta"];
    const indices = ["nombre_comun", "nombre_cientifico", "familia_botanica",
        "descripcion_planta", "lugar", "ubicacion", "info_etnobotanica", "uso_medicinal", "modo_empleo", 
        "fecha_colecta", "colector", "numero_colecta"];
        
    let contenido = [];
    for(let i=0; i < indices.length; i++) {
        let valorCampo = infoEtiqueta[indices[i]];

        if(nombreCampo[i] === "Ubicación GPS") {
            valorCampo = valorCampo["latitude"] + ", "+ valorCampo["longitude"]; 
        }
        if(nombreCampo[i] === "Colector") {
            valorCampo = valorCampo[0]["nombre_usuario"];
        }

        contenido.push([nombreCampo[i], valorCampo]);
    }

    doc.autoTable({
        columnStyles: {0: {fontSize: 11, textColor: [0, 0, 0]}},
        body: contenido,
        margin: {top: nuevaLinea(2), left: margenIzq, right: 3}
    });

    doc.save(etiquetaId+".pdf");
}

function nuevaLinea(numRenglon) {
    const margenSup = 2.5;
    const alturaTexto = 0.5;

    return margenSup + alturaTexto * numRenglon;
};