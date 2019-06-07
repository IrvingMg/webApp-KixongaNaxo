function eliminarArchivo(path) {
    const storageRef = storage.ref();
    const desertRef = storageRef.child(path);

    desertRef.delete().then(function() {
        appAlerta("Archivo eliminado con éxito", "mensaje-exito");
        $("#planearInfo").trigger("ArchivoEliminado");
        $("#etiquetar").trigger("ArchivoEliminado");
    }).catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

function guardarArchivo(archivo, path) {
    const storageRef = storage.ref();
    const metadata = { contentType: archivo.type };
    const uploadTask = storageRef.child(path).put(archivo, metadata);

    return uploadTask.on('state_changed', function(snapshot){
        let progress = Math.floor( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
        // TODO: Comentar para Testing
        //appAlerta("Cargando " + progress + "% del archivo "+ archivo.name, "mensaje-advertencia");
    }, function(error) {
        appAlerta(error.message, "mensaje-error");
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            // TODO: Comentar para Testing
            //appAlerta("Archivo " + archivo.name + " cargado con éxito.", "mensaje-exito");
            //$("#planearInfo").trigger("ArchivoSubido");
            //$("#etiquetar").trigger("ArchivoSubido");
        });
    });
}

function descargarArchivo(path) {
    const storageRef = storage.ref();
    const pathReference = storageRef.child(path);

    pathReference.getDownloadURL().then(function(url) {
        $("#cfotos-galeria").append(
            `<li class="mdc-image-list__item">
                <img class="mdc-image-list__image" src="`+url+`">
            </li>`
        );
    }).catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

function obtenerURL(path) {
    const storageRef = storage.ref();
    const pathReference = storageRef.child(path);

    return pathReference.getDownloadURL();
}