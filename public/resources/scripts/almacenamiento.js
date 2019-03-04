function eliminarArchivo(path) {
    const storageRef = storage.ref();
    const desertRef = storageRef.child(path);

    desertRef.delete().then(function() {
        appAlerta("Archivo eliminado con éxito", "mensaje-exito");
        $("#planearInfo").trigger("ArchivoEliminado");
    }).catch(function(error) {
        appAlerta(error.message, "mensaje-error");
    });
}

function guardarArchivo(docId, archivo) {
    const storageRef = storage.ref();
    const metadata = { contentType: archivo.type };
    const uploadTask = storageRef.child("info-consulta/"+ docId + "/" + archivo.name).put(archivo, metadata);

    uploadTask.on('state_changed', function(snapshot){
        let progress = Math.floor( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
        
        appAlerta("Cargando " + progress + "% del archivo "+ archivo.name, "mensaje-advertencia");
    }, function(error) {
        appAlerta(error.message, "mensaje-error");
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            appAlerta("Archivo " + archivo.name + " cargado con éxito.", "mensaje-exito");
            $("#planearInfo").trigger("ArchivoSubido");
        });
    });
}
