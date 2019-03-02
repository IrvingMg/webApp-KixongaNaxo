function crearColecta(docId) {
    const formValores = $("#form-nuevaPlaneacion1").serializeArray();
    const user = firebase.auth().currentUser;
    let planeacion = {};
 
    event.preventDefault();
    
    for(let i = 0; i < formValores.length; i++){
        if(formValores[i].value != "") {
            planeacion[formValores[i].name] = formValores[i].value;
        } else {
            planeacion[formValores[i].name] = "No hay información disponible."
        }
    }
    planeacion["id_usuario"] = user.uid;
    planeacion["participantes"] = [];
    planeacion["material-campo"] = [
        "Tijeras de podar", "Navaja o cuchillo", "Lupa", "Cinta métrica", "Bolsas de plástico",
        "Periódico", "Cartón corrugado", "Prensa", "GPS Manual"];
    planeacion["info-consulta"] = []
    planeacion["publico"] = false;

    if(docId) {
        actualizarDocumento("colectas", planeacion, docId);
    } else {
        agregarDocumento("colectas", planeacion).then(function(docId) {
            $("#planeacion1-siguiente").attr("href", "material-campo.html?query=" + docId);
        });
    }
    
}

function crearListaMaterial(){
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");

    const itemsLista = $("#lista-items-material span").get();
    let planeacion = {"material-campo" : []};

    for(index in itemsLista) {
        planeacion["material-campo"].push(itemsLista[index].innerText);
    }
    
    actualizarDocumento("colectas", planeacion, docId);
}

function crearListaInfoConsulta(){
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");

    const itemsLista = $("#lista-items-info span").get();
    let planeacion = {"info-consulta" : []};

    for(index in itemsLista) {
        planeacion["info-consulta"].push(itemsLista[index].innerText);
    }
    
    actualizarDocumento("colectas", planeacion, docId);
}

function editarFormatoPlaneacion(docId) {
    leerDocumento("colectas", docId).then(function(documento) {
        let doc = documento.data();

        for(let name in doc){
            if(name === "tipo") {
                if(doc[name] != "Exploratoria")
                $("#tipo-especifico").prop("checked", true);;
            } else {
                $("[name="+ name +"]").focus();
                $("[name="+ name +"]").val(doc[name]);
            }
        }
    });   
}

function editarListaMaterial(docId) {
    leerDocumento("colectas", docId).then(function(documento) {
        let doc = documento.data();

        if(doc["material-campo"].length){
            $("#mensaje-default").remove();
            $("#form-nuevaPlaneacion2").prop("disabled", false);
        }

        for(let index in doc["material-campo"]) {
            agregarItemIconoLista(doc["material-campo"][index], "lista-items-material");
        }
    });   
}

function editarListaInfoConsulta(docId) {
    leerDocumento("colectas", docId).then(function(documento) {
        let doc = documento.data();

        if(doc["info-consulta"].length){
            $("#mensaje-default").remove();
            $("#form-nuevaPlaneacion3").prop("disabled", false);
        }

        for(let index in doc["info-consulta"]) {
            agregarItemIconoLista(doc["info-consulta"][index], "lista-items-info");
        }
    });   
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