 QUnit.test("Prueba: TAW-1",function (assert) {
    const doc = {
        "titulo": "Colecta Test",
        "lugar": "Teotitlán de Flores Magón",
        "fecha": "2019-06-03",
        "publico": true
    };
    const response = crearDoc("colectas", doc);

    return response.then(function() {
        assert.ok(true);
    });
});

QUnit.test("Prueba: TAW-2",function (assert) {
    const response = actualizarDoc("colectas", {
        "material-campo": ["Item 1","Item 2"]
    }, "ziOhhf8MpzhPiJCBjAXU"); //TODO: Cambiar el id del documento

    return response.then(function() {
        assert.ok(true);
    });
});

QUnit.test("Prueba: TAW-3",function (assert) {
    const done = assert.async();
    const file = new File(["test"], "test.txt", {
        type: "text/plain",
      });
    const response = guardarArchivo(file, "test/test.txt");

    setTimeout(function() {
        assert.ok(response);
        done();
    });
});

QUnit.test("Prueba: TAW-4",function (assert) {
    const response = leerPagResultados("colectas", ["titulo", "asc"], 5, null);

    return response.then(function(value) {
        const val = Array.isArray(value["resultadosPag"]["docs"]);
        assert.ok(val);
    });
});

QUnit.test("Prueba: TAW-5",function (assert) {
    const response = eliminarDoc("colectas", "CzlH5IZSRrOMNCYD69gT");

    return response.then(function() {
        assert.ok(true);
    });
});

QUnit.test("Prueba: TAW-6",function (assert) {
    const response = leerPagResultados("colectas", ["titulo", "asc"], 100, null);

    return response.then(function(value) {
        const docs = value["resultadosPag"]["docs"];

        for(let i = 0; i < docs.length; i++) {
            if(!docs[i].data()["publico"]) {
                assert.ok(false);
            }
        }
        assert.ok(true);
    });
});

QUnit.test("Prueba: TAW-7",function (assert) {
    const response = obtenerURL("test/test.txt");

    return response.then(function(url) {
        assert.ok(url);
    });
});

QUnit.test("Prueba: TAW-8",function (assert) {
    const doc = {
        "titulo": "Colecta Test",
        "publico": true,
        "responsable": "Test", 
        "objetivo": "Test",
        "tipo": "Test",
        "fecha": "2019-06-03",
        "lugar": "Teotitlán de Flores Magón", 
        "especies": "Test",
        "material-campo": "Test", 
        "info-consulta": "Test",
        "info-adicional": "Test",
        "participantes": []
    };
    const response = formatoPlaneacionPDF(doc, "Test");
    
    assert.ok(response);
});