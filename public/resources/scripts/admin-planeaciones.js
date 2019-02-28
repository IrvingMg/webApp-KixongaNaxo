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
    planeacion["id_participantes"] = [];
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

function consultaFormatoPlaneacion() {
    const params = new URLSearchParams(location.search.substring(1));
    const docId = params.get("query");

    leerDocumento("colectas", docId).then(function(documento) {
        const encabezado =
        `<h5 class="mdc-typography--headline5">`+ documento.data().titulo +`</h5>
        <p class="mdc-typography--body2">`+ documento.data().id_participantes.length +` colectores</p>`;
        $(".encabezado-section").html(encabezado);

        const nombre = ["Responsable", "Objetivo", "Tipo de colecta", "Fecha de colecta", 
            "Lugar de colecta", "Especies de interés", "Material de campo", 
            "Información de consulta","Información adicional"];
        const indiceVal = ["responsable", "objetivo", "tipo", "fecha", "lugar", 
            "especies", "material-campo", "info-consulta","info-adicional"];

        let formato = "";
        for(let i = 0; i < nombre.length; i++) {
            formato += 
            `<li>
                <p class="mdc-typography--body1 h7">`+ nombre[i] +`</p>
                <p class="mdc-typography--body1 texto-info">` +  documento.data()[indiceVal[i]] + `</p>
            </li>
            `;
        } 
        $(".lista-info-consulta").html(formato);
    });
}