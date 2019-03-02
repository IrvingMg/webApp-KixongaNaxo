const functions = require('firebase-functions');

exports.accesoPagina = functions.https.onRequest((request, response) => {
	let acceso;
	const urlPath = request.body.urlPath;
	const pathRestringida = 
		[
			"/etiquetas.html", "/etiquetar.html", "/formato-planeacion.html", 
			"/info-consulta.html", "/material-campo.html", "/planeaciones.html"
		];
	
	if (urlPath === pathRestringida[0] ||
		urlPath === pathRestringida[1] ||
		urlPath === pathRestringida[2] ||
		urlPath === pathRestringida[3] ||
		urlPath === pathRestringida[4] ||
		urlPath === pathRestringida[5] ) 
	{
		acceso = false
	} else {
		acceso = true;
	}
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.send(acceso);
});