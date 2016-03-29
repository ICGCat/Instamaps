/**
 * require geocat.web
 * require Listjs http://www.listjs.com/docs/list-api
 * require url https://github.com/websanova/js-url
 */
var privatGaleria = url('?private');
var aplicacionsGaleria = url('?aplicacions');

//per GA
defineTipusUser(); //mira si el usuario es random (geocat.web)
	
if(typeof url('?uid') == "string"){
	$.removeCookie('uid', { path: '/' });
	$.cookie('uid', url('?uid'), {path:'/'});
	privatGaleria = "1";
	checkUserLogin();
}

$("body").on("change-lang", function(event, lang){
	$('#galeriaSort>div>input').attr("placeholder", window.lang.convert("Cerca"));
	$('#obtenirUrlPublica').attr("placeholder", window.lang.convert("Cerca"));
	//Canviem textos botons galeria
	jQuery("#btn-editar").attr('title',window.lang.convert('Editar'));
	jQuery("#btn-grup").attr('title',window.lang.convert('Col·laborar'));
	jQuery("#btn-enllacar").attr('title',window.lang.convert('Enllaça'));
	jQuery("#btn-esborrar").attr('title',window.lang.convert('Esborrar'));
	jQuery("#btn-privat").attr('title',window.lang.convert('El mapa només és visible a la teva galeria privada'));
	jQuery("#btn-public").attr('title',window.lang.convert('El mapa és visible a la galeria pública'));
	
	
});

$('#galeriaSort>input').attr("placeholder", window.lang.convert("Cerca"));

var galeria;
//PRIVATE GALLERY
if ((typeof privatGaleria == "string") && (typeof $.cookie('uid') !== "undefined")){
	var isGeolocal = isGeolocalUser();
	
	galeria = Galeria({
		tipusApp:1,
		publica: false,
		isGeolocal: isGeolocal
	});
	
	var data = {uid: $.cookie('uid')};
	loadGaleria(data).then(function(results){
		galeria.drawGaleria(results);
		galeria.escriuResultats(results.results.length);
	});
	
	if(aplicacionsGaleria){
		$('#typesTabs a:last').tab('show');
	}
	
	window.addEventListener("message", galeria.onMessage, true);
}else{ 
//PUBLIC GALLERY
	var isGeolocal = isGeolocalUser();
	
	var options = {
		tipusApp:1,
		publica: true,
		isGeolocal: isGeolocal
	};
	
	if(url('file') === "galeria_geolocal.html"){
		options.tipusApp = 2;
	}
	
	galeria = Galeria(options);
	
	galeria.drawGaleria();
	
	//cargar el número de mapas
	galeria.getNumMaps().then(function(results){
		if (results.status == "OK"){
			$('.sp_total_maps').html(results.results);
		}else{
			$('.total_maps').hide();
		}
	});
}

window.lang.run();