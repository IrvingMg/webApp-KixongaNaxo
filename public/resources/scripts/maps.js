let map;
let marcador;
let infowindow;

function crearMapa() {
  	const teotitlan = new google.maps.LatLng(18.135228, -97.0902307);
  	infowindow = new google.maps.InfoWindow();
	  map = new google.maps.Map(document.getElementById("pf-mapa"), {center: teotitlan, zoom: 8});
}

function buscarLugar(lugar) {
	if(marcador) {
		marcador.setMap(null);
	}

	const request = {
		query: lugar,
		fields: ['name', 'geometry'],
	};
	const service = new google.maps.places.PlacesService(map);
	service.findPlaceFromQuery(request, function(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				crearMarcador(results[i]);
			}
			map.setCenter(results[0].geometry.location);
		}
	});
}

function crearMarcador(place) {
	$("#pf-latitud").val(place.geometry.location.lat());
	$("#pf-longitud").val(place.geometry.location.lng());
	marcador = new google.maps.Marker({
    	map: map,
		position: place.geometry.location,
  	});
  	google.maps.event.addListener(marcador, 'click', function() {
    	infowindow.setContent(place.name);
    	infowindow.open(map, this);
  	});
}