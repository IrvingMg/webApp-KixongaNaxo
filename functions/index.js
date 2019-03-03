const functions = require('firebase-functions');

exports.accesoPagina = functions.https.onRequest((request, response) => {
	const urlPath = request.body.urlPath;
	const pathRestringida = 
		[
			"/mis-planeaciones.html", "/mis-etiquetas.html", "/planear-formato.html", 
			"/planear-material.html", "/planear-info.html", "/etiquetar.html"
		];
	
	let acceso = true;
	for(index in pathRestringida) {
		if(urlPath === pathRestringida[index]) {
			acceso = false;
		}
	}
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.send(acceso);
});