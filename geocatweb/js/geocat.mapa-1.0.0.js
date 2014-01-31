var map, controlCapes;
var factorH = 50;
var factorW = 0;
var _htmlDadesObertes = [];
var capaUsrPunt, capaUsrLine, capaUsrPol;
var mapConfig = {};
var dades1,dades2;

jQuery(document).ready(function() {
	map = new L.IM_Map('map', {
		typeMap : 'topoMap',
		maxZoom : 19,
	// drawControl: true
	}).setView([ 41.431, 1.8580 ], 8);
	
	//iniciamos los controles
	initControls();
	
	if(typeof url('?businessid') == "string"){
		if (!$.cookie('uid')){
			window.location.href = paramUrl.loginPage;
		}
		
		var data = {
			businessId: url('?businessid'),
			uid: $.cookie('uid')
		};
		
		getMapByBusinessId(data).then(function(results){
			if (results.status == "ERROR"){
				//TODO mostrar mensaje de error y hacer alguna accion por ejemplo redirigir a la galeria				
				return false;
			}
			mapConfig = results.results;
			mapConfig.options = $.parseJSON( mapConfig.options );
			mapConfig.newMap = false;
			$('#nomAplicacio').html(mapConfig.nomAplicacio);
			
			loadMapConfig(mapConfig).then(function(){
				avisDesarMapa();
			});
		},function(results){
			window.location.href = paramUrl.loginPage;
		});
	}else{
		mapConfig.newMap = true;
		avisDesarMapa();
		/*
		loadMapConfig(mapConfig).then(function(){
			mapConfig.newMap = true;
			avisDesarMapa();
		});
		*/
	}
	
	//carrega las capas del usuario si esta loginat
	if ($.cookie('uid')){
		var data = {uid: $.cookie('uid')};
		carregaDadesUsuari(data);
	}
		
	jQuery('.bt_publicar').on('click',function(){
		$('#dialgo_publicar #nomAplicacio').removeClass("invalid");
		$( ".text_error" ).remove();
		$('#dialgo_publicar').modal('show');
	});
	
	jQuery('#dialgo_publicar .btn-primary').on('click',function(){
		publicarMapa();
	});
	
	jQuery('#dialgo_leave .btn-primary').on('click',function(){
		leaveMapa();
	});

	
	//$.fn.editable.defaults.mode = 'inline';

//	$('.bt_save').on('click', function(event) {
//		saveMap();
//	});
	
	$('#btn-add-twitter-layer').click(function(){
		addTwitterLayer(jQuery("#hashtag_twitter_layer").val());
	});
	
	$('#nomAplicacio').editable({
		type: 'text',
		success: function(response, newValue) {
					var data = {
					 	businessId: url('?businessid'), 
					 	nom: newValue, 
					 	uid: $.cookie('uid')
					 }
			 
					updateMapName(data).then(function(results){
						if(results.status!='OK') $('#nomAplicacio').html(results.results.nom);
				},function(results){
					$('#nomAplicacio').html(mapConfig.nomAplicacio);				
				});	
		 }
	});
	
	$('.leaflet-remove').click(function() {
		alert( "Handler for .click() called." );
	});	
	
	  jQuery('#socialShare').share({
	        networks: ['email','facebook',/*'googleplus',*/'twitter','linkedin','pinterest'],
	        theme: 'square',
//	        title: 'InstaMapes',
//	        urlToShare: 'http://www.google.com'
//	        urlToShare: 'http://localhost/geocatweb/mapa.html?businessId='+url('?businessid')
	    });	
	  
		jQuery('#socialShare').on('click', function(evt){
			evt.preventDefault();
			console.debug('on click social');
//			var $thisIndex = jQuery(this).index();
//			var socialId = "";
//			switch($thisIndex){
//				case 0:
//					socialId = "email";
//					break;
//				case 1:
//					socialId = "facebook";
//					break;
//				case 2:
//					socialId = "googleplus";
//					break;
//				case 3:
//					socialId = "twitter";
//					break;
//				case 4:
//				socialId = "linkedin";
//				break;
//				case 5:
//					socialId = "pinterest";
//					break;
//			}
			
			
//			var url = 'http://localhost/geocatweb/mapa.html'+$('#permalink').attr('href');
//			
//			shortUrl(url).then(function(results){
//				$('#socialShare').share('refresh',{
//														url: results.data.url, 
//														text: $(document).attr('title'), 
//														pageDesc: window.lang.convert("InstaMapes")
//														}
//									).then(function(){
//				
//										var $this = $('.pop').get( $thisIndex );
//										window.open(jQuery($this).attr('href'),'t','toolbar=0,resizable=1,status=0,width=640,height=528');
//				});
//				
//				return false;
//				
//			}); 		
//			console.debug('Entra a on click!');
	});
		
}); // Final document ready

function addClicksInici() {
	jQuery('.bt_llista').on('click', function() {
		activaPanelCapes();
	});
	
	jQuery(document).on('click', function(e) {
        if(e.target.id.indexOf("popovercloseid" )!=-1)
        {
       	 var pop=e.target.id.split("#");
       	 var ddv="#"+pop[1];
       	 jQuery(ddv).popover('hide');
       	 //addCapaMunicipis();	        
        }
    });
}

function addOpcionsFonsMapes() {
	jQuery('.div_gr3 div').on('click', function() {
		var fons = jQuery(this).attr('id');
		if (fons == 'topoMap') {
			map.topoMap();
		} else if (fons == 'topoGrisMap') {
			map.topoGrisMap();
		} else if (fons == 'ortoMap') {
			map.ortoMap();
		} else if (fons == 'terrainMap') {
			map.terrainMap();
		} else if (fons == 'colorMap') {
			gestionaPopOver(this);
		} else if (fons == 'historicMap') {
		
		}
	});
}

function gestionaPopOver(pop) {
	jQuery('.popover').popover('hide');
	jQuery('.pop').not(pop).popover('hide');
	jQuery(pop).popover('toggle');
	jQuery(".popover").css('left', pLeft());
	jQuery('.popover-title').append('<span id="popovercloseid#'+jQuery(pop).attr('id')+'" class="glyphicon glyphicon-remove bt_tanca"></span>');
}

function addControlsInici() {
	sidebar = L.control.sidebar('sidebar', {
		position : 'left',
		closeButton : false
	});

	map.addControl(sidebar);
	setTimeout(function() {
		sidebar.show();
	}, 500);

	controlCapes = L.control.orderlayers(null, null, {
		collapsed : false,
		id : 'div_capes'
	}).addTo(map);

	ctr_llistaCapes = L.control({
		position : 'topright'
	});
	ctr_llistaCapes.onAdd = function(map) {

		this._div = L.DomUtil.create('div', 'div_barrabotons btn-group-vertical');

		var btllista = L.DomUtil.create('div', 'leaflet-bar btn btn-default btn-sm bt_llista');
		this._div.appendChild(btllista);
		btllista.innerHTML = '<span class="glyphicon glyphicon-th-list grisfort"></span>';

		var btcamera = L.DomUtil.create('div', 'leaflet-bar btn btn-default btn-sm bt_captura');
		this._div.appendChild(btcamera);
		btcamera.innerHTML = '<span class="glyphicon glyphicon-camera grisfort"></span>';

		var btprint = L.DomUtil.create('div', 'leaflet-bar btn btn-default btn-sm bt_print');
		this._div.appendChild(btprint);
		btprint.innerHTML = '<span class="glyphicon glyphicon-print grisfort"></span>';
		
//		var btsave = L.DomUtil.create('div', 'leaflet-bar btn btn-default btn-sm bt_save');
//		this._div.appendChild(btsave);
//		btsave.innerHTML = '<span class="glyphicon glyphicon-floppy-disk grisfort"></span>';		

		var btinfo = L.DomUtil.create('div', 'leaflet-bar btn btn-default btn-sm bt_info');
		this._div.appendChild(btinfo);
		btinfo.innerHTML = '<span class="glyphicon glyphicon-info-sign grisfort"></span>';
		
		return this._div;
	};
	ctr_llistaCapes.addTo(map);

}

function redimensioMapa() {
	jQuery(window).resize(function() {
		factorH = jQuery('.navbar').css('height').replace(/[^-\d\.]/g, '');
		jQuery('#map').css('top', factorH + 'px');
		jQuery('#map').height(jQuery(window).height() - factorH);
		jQuery('#map').width(jQuery(window).width() - factorW);
	});
	jQuery(window).trigger('resize');
}

var opt = {
	placement : 'right',
	container : 'body'
};
var optB = {
	placement : 'bottom',
	container : 'body'
};

function addToolTipsInici() {
	//eines mapa
	$('.bt_llista').tooltip('destroy').tooltip({
		placement : 'left',
		container : 'body',
		title : window.lang.convert("LLista de capes")
	});
	$('.bt_captura').tooltip('destroy').tooltip({
		placement : 'left',
		container : 'body',
		title : window.lang.convert("Capturar la vista del mapa")
	});
	$('.bt_print').tooltip('destroy').tooltip({
		placement : 'left',
		container : 'body',
		title : window.lang.convert("Imprimir la vista del mapa")
	});
	$('.bt_save').tooltip('destroy').tooltip({
		placement : 'left',
		container : 'body',
		title : window.lang.convert("Desar el mapa actual")
	});	
	$('.bt_info').tooltip('destroy').tooltip({
		placement : 'left',
		container : 'body',
		title : window.lang.convert("Veure informació al fer clic sobre el mapa")
	});
	
	jQuery.map(jQuery('[data-toggle="tooltip"]'), function (n, i){
		var title = $(n).attr('title');
		if (title == ""){
			title = $(n).attr('data-original-title');
		}
		$(n).attr('data-original-title', window.lang.convert(title));
	    var title = $(n).attr('title', $(n).attr('data-original-title'));
	});
		
	$('.div_carrega_dades').tooltip(optB);
	$('.div_gr3 div').tooltip(optB);
	$('.div_gr2 div').tooltip(optB);
	$('.add_costat_r').tooltip(opt);
	$('.taronja').tooltip(opt);
	$('.white').tooltip(opt);
	$('#div_punt').tooltip(optB);
	$('#div_linia').tooltip(optB);
	$('#div_area').tooltip(optB);
	$('.bt_publicar').tooltip(opt);
	
	//cercador
	jQuery(".leaflet-control-search .search-button, .glyphicon-search").attr('title',window.lang.convert('Cercar llocs a Catalunya ...'));
	jQuery(".leaflet-control-search .search-input").attr('placeholder',window.lang.convert('Cercar llocs a Catalunya ...'));
}

function activaPanelCapes(obre) {
	if (obre) {
		jQuery('.leaflet-control-layers').animate({
			width : 'show'
		});

	} else {
		jQuery('.leaflet-control-layers').animate({
			width : 'toggle'
		});

	}
	var cl = jQuery('.bt_llista span').attr('class');
	if (cl.indexOf('grisfort') != -1) {
		jQuery('.bt_llista span').removeClass('grisfort');
		jQuery('.bt_llista span').addClass('greenfort');
	} else {
		jQuery('.bt_llista span').removeClass('greenfort');
		jQuery('.bt_llista span').addClass('grisfort');
	}
}

var estilP={'iconFons':'awesome-marker-web awesome-marker-icon-orange',
		'iconGlif':'',
		'colorGlif':'#333333'};

var estilV={'iconFonsL':'vector-web vector-orange',
		'weightL':'5',
		'colorL':'#FFC400',
		'iconFonsP':'vector-web vector-orange_p',
		'weightP':'5',
		'colorP':'#FFC400'		
};

function changeDefaultVectorStyle(estilV){
	drawControl.options.polygon.shapeOptions.color=estilV.colorP;
	drawControl.options.polyline.shapeOptions.color=estilV.colorL;
}

function changeDefaultPointStyle(estilP) {
	var _iconFons=estilP.iconFons.replace('awesome-marker-web awesome-marker-icon-','');
	var _iconGlif=estilP.iconGlif;	
	if(_iconGlif.indexOf("fa fa-")!=-1){_iconGlif=estilP.iconGlif.replace('fa fa-','');};
	
	var _colorGlif=estilP.colorGlif;
	
	if(_iconFons.indexOf("_r")!=-1){ //sóc rodó		
		
		defaultPunt.options.shadowSize = new L.Point(1, 1);
		
		if(_iconGlif==""){//no tin glif
		defaultPunt.options.iconAnchor= new L.Point(7, 7);
		defaultPunt.options.iconSize = new L.Point(14, 14);
		
		
		}else{
			
		defaultPunt.options.iconAnchor= new L.Point(14, 14);
		defaultPunt.options.iconSize = new L.Point(28, 28);
		}
	}else{ // sóc punt
		defaultPunt.options.iconAnchor= new L.Point(14, 42);
		defaultPunt.options.iconSize = new L.Point(28, 42);
		defaultPunt.options.shadowSize = new L.Point(36, 16);
		
	}
	
	defaultPunt.options.icon=_iconGlif;
	defaultPunt.options.markerColor=_iconFons;
	defaultPunt.options.iconColor=_colorGlif;
	
} 

function addDialegsEstils() {
	jQuery('#div_mes_punts').on("click", function(e) {	
		jQuery('#dialog_estils_punts').modal('toggle');
		jQuery('#dialog_estils_linies').modal('hide');
		jQuery('#dialog_estils_arees').modal('hide');	
	});

	jQuery('#div_mes_linies').on("click", function(e) {	
		jQuery('#dialog_estils_linies').modal('toggle');
		jQuery('#dialog_estils_punts').modal('hide');
		jQuery('#dialog_estils_arees').modal('hide');	
	});
	
	jQuery('#div_mes_arees').on("click", function(e) {	
		jQuery('#dialog_estils_arees').modal('toggle');	
		jQuery('#dialog_estils_linies').modal('hide');
		jQuery('#dialog_estils_punts').modal('hide');	
	});
	
	jQuery('#dialog_estils_punts .btn-success').on('click',function(){		
		jQuery('#div_punt').removeClass();
		jQuery('#div_punt').addClass(jQuery('#div_punt0').attr('class'));
		jQuery('#div_punt').css('color',estilP.colorGlif);
		jQuery('#dialog_estils_punts').modal('toggle');		
		changeDefaultPointStyle(estilP);
				
	});
	
	jQuery('#dialog_estils_linies .btn-success').on('click',function(){		
		//jQuery('#div_linia').removeClass();
		jQuery('#div_linia').css('background-position',jQuery('#div_linia0').css('background-position'));		
		jQuery('#dialog_estils_linies').modal('toggle');		
		changeDefaultVectorStyle(estilV);
				
	});
	
	jQuery('#dialog_estils_arees .btn-success').on('click',function(){		
		//jQuery('#div_area').removeClass();
		//jQuery('#div_area').addClass(jQuery('#div_area0').attr('class'));	
		jQuery('#div_area').css('background-position',jQuery('#div_area0').css('background-position'));	
		jQuery('#dialog_estils_arees').modal('toggle');		
		changeDefaultVectorStyle(estilV);
				
	});
	
	jQuery('#dialog_estils_punts .btn-default').on('click',function(){			
		jQuery('#dialog_estils_punts').modal('toggle');
	})
	
		
	jQuery(document).on('click', ".bs-punts li", function(e) {
		jQuery(".bs-punts li").removeClass("estil_selected");
		jQuery('#div_punt0').removeClass();
		estilP.iconFons=jQuery('div', this).attr('class');
		jQuery('#div_punt0').addClass(estilP.iconFons+" "+estilP.iconGlif);
		jQuery(this).addClass("estil_selected");		
	});
	
	jQuery(document).on('click', ".bs-linies li", function(e) {
		jQuery(".bs-linies li").removeClass("estil_selected");
		jQuery('#div_linia0').removeClass();
		estilV.iconFonsL=jQuery('div', this).attr('class');
		estilV.colorL=jQuery('div', this).css('color');
		jQuery('#div_linia0').addClass(estilV.iconFonsL);
		jQuery(this).addClass("estil_selected");		
	});
	
	jQuery(document).on('click', ".bs-arees li", function(e) {
		jQuery(".bs-arees li").removeClass("estil_selected");
		jQuery('#div_area0').removeClass();
		estilV.iconFonsP=jQuery('div', this).attr('class');
		estilV.colorP=jQuery('div', this).css('color');
		jQuery('#div_area0').addClass(estilV.iconFonsP);
		jQuery(this).addClass("estil_selected");		
	});
	
	jQuery(document).on('click', ".bs-colors li", function(e) {
		jQuery(".bs-colors li").removeClass("estil_selected");
		estilP.colorGlif=jQuery('div', this).css('background-color');
		nClass=jQuery('div', this).attr('class');
		jQuery('.bs-glyphicons li').css('color',estilP.colorGlif);
		if(nClass=="c_white"){
			jQuery('.bs-glyphicons li').css('background-color','#aaaaaa');	
		}else{
			jQuery('.bs-glyphicons li').css('background-color','#FFFFFF');	
		}
		jQuery('#div_punt0').css('color',estilP.colorGlif);
		jQuery(this).addClass("estil_selected");
	});
	
	jQuery(document).on('click', ".bs-glyphicons li", function(e) {
		jQuery(".bs-glyphicons li").removeClass("estil_selected");
		jQuery('#div_punt0').removeClass();
		estilP.iconGlif=jQuery('span', this).attr('class');
		jQuery('#div_punt0').addClass(estilP.iconFons+" "+estilP.iconGlif);
		jQuery(this).addClass("estil_selected");
	});
}

function creaPopOverMesFons() {
	jQuery("#div_mesfons")
	.popover(
	{
		content : '<div id="div_menu_mesfons" class="div_gr3">'
				+ '<div id="historicMap" lang="ca"  data-toggle="tooltip" title="Catalunya 1936" class="div_fons_10"></div>'
				+ '</div>',
		container : 'body',
		html : true,
		trigger : 'manual'
	}).click(function(e){
		jQuery('.bt_tanca').click(function(e){
			jQuery(this).popover('hide');
        });
        e.preventDefault();
	});
	
	jQuery('#div_menu_mesfons div').tooltip(optB);

	jQuery(document).on('click', "#div_menu_mesfons div", function(e) {
		var fons = jQuery(this).attr('id');
		if (fons == 'historicMap') {
			map.historicMap();
		}
	});
		
	jQuery("#div_mesfons").on('click',function(e){
		gestionaPopOver(this);
		
	});
}

function creaPopOverMesFonsColor() {
	jQuery("#colorMap")
	.popover(
	{
		content : '<div id="div_menufons" class="div_gr3">'
				+ '<div id="nit" lang="ca"  data-toggle="tooltip" title="Nit" class="div_fons_6"></div>'
				+ '<div id="sepia" lang="ca"  data-toggle="tooltip" title="Sèpia" class="div_fons_7"></div>'
				+ '<div id="zombie" lang="ca"  data-toggle="tooltip" title="Zombie" class="div_fons_8"></div>'
				+ '<div id="orquidea" lang="ca"  data-toggle="tooltip" title="Orquídea" class="div_fons_9"></div>'
				+ '</div>',
		container : 'body',
		html : true,
		trigger : 'manual'
	});

	jQuery('#div_menufons div').tooltip(optB);

	jQuery(document).on('click', "#div_menufons div", function(e) {
		var fons = jQuery(this).attr('id');
		map.colorMap(fons);
	});
}

function creaPopOverMevasDades(){
	jQuery(".div_dades_usr").popover(
		{
			content : '<ul class="nav nav-tabs etiqueta">'
					+ '<li><a href="#id_mysrvj" data-toggle="tab" id="#id_serveisv">Serveis vector</a></li>'
					+ '<li><a href="#id_mysrvw" data-toggle="tab">Serveis WMS</a></li>'
					+ '</ul>'
					+ '<div class="tab-content">'
					+ '<div class="tab-pane fade" id="id_mysrvj"></div>'
					+ '<div class="tab-pane fade" id="id_mysrvw"></div>'
					+ '</div>',
			container : 'body',
			html : true,
			trigger : 'manual'
	});
}

function loadPopOverMevasDades(){
	jQuery(".div_dades_usr").on('click', function() {
		var data = {uid: $.cookie('uid')};
		gestionaPopOver(this);		
				
		var source1 = jQuery("#meus-wms-template").html();
		var template1 = Handlebars.compile(source1);
		var html1 = template1(dades1[0]);
		
		var source2 = jQuery("#meus-tematic-template").html();
		var template2 = Handlebars.compile(source2);
		var html2 = template2(dades2[0]);
		
		jQuery("#id_mysrvw").append(html1);
		jQuery("#id_mysrvj").append(html2);
		
		jQuery(".usr_wms_layer").on('click', function(event) {
			event.preventDefault();
			var _this = jQuery(this);
			var data = {
				uid: $.cookie('uid'),
				businessId: mapConfig.businessId,
				servidorWMSbusinessId: _this.data("businessid"),
				layers: _this.data("layers"),
				calentas:false,
				activas:false,
				visibilitats:true
			};
			
			addServerToMap(data).then(function(results){
//				console.debug(results);
//				mapConfig = results.results;
				if(results.status==='OK'){
					var index = results.results.servidorsWMS.length -1;
					var value = results.results.servidorsWMS[index];
					
					 var newWMS = L.tileLayer.wms(value.url, {
						 layers: value.layers,
						 format: value.imgFormat,
						 transparent: value.transparency,
						 version: value.version,
						 opacity: value.opacity,
						 crs: value.epsg,
						 businessId: value.businessId//Jess
						 });
						 if (value.capesActiva == true || value.capesActiva == "true"){
						 newWMS.addTo(map);
						 }
						 controlCapes.addOverlay(newWMS, value.serverName, true); 				

					activaPanelCapes(true);						
				}
			
			});
			
		});
	
		jQuery(".usr_tematic_layer").on('click', function(event) {
			event.preventDefault();
			var _this = jQuery(this);
			
			carregarCapa(_this.data("businessid"));
		
		});
		
		jQuery("span.glyphicon-remove").on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			var _this = jQuery(this);

			//console.debug(_this.data("businessid"));
			
			var data = {
				uid: $.cookie('uid'),
				businessId: _this.data("businessid")
			};

			deleteTematicLayerAll(data).then(function(results){
				console.debug(results);
				if (results.status == "OK"){
					_this.parent().remove();
				}
			});
		});
		
	});
	
}

function refrescaPopOverMevasDades(){
	console.debug("refrescaPopOverMevasDades");
	//carrega las capas del usuario
	var data = {uid: $.cookie('uid')};
	jQuery.when(getAllServidorsWMSByUser(data), getAllTematicLayerByUid(data)).then(function(results1, results2){
		dades1=results1;
		dades2=results2;
	},function(results){
		window.location.href = paramUrl.loginPage;
	});
}

function carregarCapa(businessId){
	var data = {
		uid: $.cookie('uid'),
		businessId: businessId
	};
	
	getTematicLayerByBusinessId(data).then(function(results){
		console.debug(results);
		//TODO
		//agregar la capa tematica al mapa. Leer los features y cargarlos
		var capaPunts=null;
		var capaLinies=null;
		var capaPoligons=null;
		if (results.status=="OK") {
			for (geometry in results.results.geometries.features.features){
				var geometria=results.results.geometries.features.features[geometry].geometry;
				var coordinates=""+geometria.coordinates;
				var tipus=geometria.type;
				if (tipus=="Point") {
					var coords=coordinates.split(",");
					if (capaPunts==null) {
						capaPunts = new L.FeatureGroup();
						var latlng = L.latLng(coords[0],coords[1]);
						var circle=L.circleMarker(latlng,200);
						capaPunts.addLayer(circle);
					}
					else {
						var latlng = L.latLng(coords[0],coords[1]);
						var circle=L.circleMarker(latlng,200);
						capaPunts.addLayer(circle);
					}					
					capaPunts.addTo(map);
				}
				if (tipus=="LineString"){
					var coords=coordinates.split(",");
					if (capaLinies==null){
						capaLinies = new L.FeatureGroup();
						var i=0;
						var j=0;
						var llistaPunts=[];
						while (i< coords.length){
							var c1=coords[i];
							var c2=coords[i+1];
							var punt=new L.LatLng(c1, c2);
							llistaPunts[j]=punt;
							i=i+2;
							j++;
						}
						var polyline =  L.polyline(llistaPunts, {color: 'red'})
						capaLinies.addLayer(polyline);
					}
					else {
						var i=0;
						var j=0;
						var llistaPunts=[];
						while (i< coords.length){
							var c1=coords[i];
							var c2=coords[i+1];
							var punt=new L.LatLng(c1, c2);
							llistaPunts[j]=punt;
							i=i+2;
							j++;
						}
						var polyline =  L.polyline(llistaPunts, {color: 'red'});						
						capaLinies.addLayer(polyline);
					}					
					capaLinies.addTo(map);
				}
				if (tipus=="Polygon") {
					var coords=coordinates.split(",");
					if (capaPoligons==null){
						capaPoligons = new L.FeatureGroup();
						var i=0;
						var j=0;
						var llistaPunts=[];
						while (i< coords.length){
							var c1=coords[i];
							var c2=coords[i+1];
							var punt=new L.LatLng(c1, c2);
							llistaPunts[j]=punt;
							i=i+2;
							j++;
						}
						var polygon = new L.Polygon(llistaPunts,{color: 'red'});
						capaPoligons.addLayer(polygon);
					}
					else {
						var i=0;
						var j=0;
						var llistaPunts=[];
						while (i< coords.length){
							var c1=coords[i];
							var c2=coords[i+1];
							var punt=new L.LatLng(c1, c2);
							llistaPunts[j]=punt;
							i=i+2;
							j++;
						}
						var polygon = new L.Polygon(llistaPunts,{color: 'red'});
						capaPoligons.addLayer(polygon);				
					}
					capaPoligons.addTo(map);
				}
			}
			
			if (capaPunts!=null){
				controlCapes.addOverlay(capaPunts,results.results.title, true);
			}
			if (capaLinies!=null){
				controlCapes.addOverlay(capaLinies,results.results.title, true);
			}
			if (capaPoligons!=null){
				controlCapes.addOverlay(capaPoligons,results.results.title, true);
			}
			activaPanelCapes(true);	
		}
		else {
			alert(results.status)
		};
	});
}

function creaPopOverDadesExternes() {
	jQuery(".div_dades_ext").on('click', function() {

		//gestionaPopOver(this);
		$('#dialog_dades_ex').modal('show');
		
		jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
			var tbA = e.target.attributes.href.value;

			if (tbA == "#id_do") {
				jQuery(tbA).empty();
				jQuery(tbA).html(_htmlDadesObertes.join(' '));

				jQuery(tbA+" a.label").on('click', function(e) {
					if(e.target.id !="id_do"){
						addCapaDadesObertes(e.target.id,jQuery(e.target).text());
					}
				});
			}else if(tbA == "#id_srvw"){
				jQuery(tbA).empty();
				jQuery(tbA).html(_htmlServeisWMS.join(' '));
				jQuery(tbA+" a.label").on('click', function(e) {
					if(e.target.id !="id_srvw"){
					//addCapaDadesObertes(e.target.id,jQuery(e.target).text());
						console.info("hola");
					}
				});	
			}else if(tbA == "#id_xs"){//Jess
				
				jQuery(tbA).html(
						
						'<h4><a id="add_twitter_layer" href="#" class="label label-primary" data-toggle="modal" data-target="#modal_twitter_layer">Twitter</a>&nbsp;'+
						'<a id="add_panoramio_layer" href="javascript:addPanoramioLayer();" class="label label-primary">Panoramio</a>&nbsp;'+
						'<a id="add_wikipedia_layer" href="javascript:addWikipediaLayer();" class="label label-primary">Wikipedia</a></h4>'						
				);
				
			}
			
		});
	})
}

function pLeft() {
	return jQuery(".leaflet-left").css('left');
}

var capaDadaOberta;

function addCapaDadesObertes(dataset,nom_dataset) {

	var url = paramUrl.dadesObertes + "dataset=" + dataset;

	var estil_do = retornaEstilaDO(dataset);
	var lastZIndex = controlCapes._lastZIndex+1;
	capaDadaOberta = new L.GeoJSON.AJAX(url, {
		onEachFeature : popUp,
		nom : dataset,
		tipus : 'Marker',
		businessId : '-1',
		dataType : "jsonp",
		zIndex: lastZIndex,
		pointToLayer : function(feature, latlng) {
			if(dataset.indexOf('meteo')!=-1){
				return L.marker(latlng, {icon:L.icon({					
					    iconUrl: feature.style.iconUrl,
					    iconSize:     [44, 44], 
					    iconAnchor:   [22, 22], 				   
					    popupAnchor:  [-3, -3] 
				})});
			}else if(dataset.indexOf('incidencies')!=-1){
				var inci=feature.properties.descripcio_tipus;
				var arr = ["Obres", "Retenció", "Cons", "Meterologia" ];
				var arrIM = ["st_obre.png", "st_rete.png", "st_cons.png", "st_mete.png" ];
				var imgInci="/geocatweb/img/"+arrIM[jQuery.inArray( inci, arr )];
				return L.marker(latlng, {icon:L.icon({					
				    iconUrl: imgInci,
				    iconSize:     [30, 26], 
				    iconAnchor:   [15, 13], 				   
				    popupAnchor:  [-3, -3] 
			})});
			}else if(dataset.indexOf('cameres')!=-1){
				return L.marker(latlng, {icon:L.icon({					
				    iconUrl: "/geocatweb/img/st_came.png",
				    iconSize:     [30, 26], 
				    iconAnchor:   [15, 13], 				   
				    popupAnchor:  [-3, -3] 
			})});
			}else{
			return L.circleMarker(latlng, estil_do);
			}
		}
	});
	if(typeof url('?businessid') == "string"){
		var data = {
				uid:$.cookie('uid'),
				mapBusinessId: url('?businessid'),
				serverName: nom_dataset,
				serverType: t_dades_obertes,
				calentas: false,
	            activas: true,
	            visibilitats: true,
	            epsg: '4326',
	            transparency: true,
	            visibilitat: 'O',
				options: '{"tipus": "Marker", "dataset":"'+dataset+'"}'
		};
		
		createServidorInMap(data).then(function(results){
			if (results.status == "OK"){
				capaDadaOberta.options.businessId = results.results.businessId;
				capaDadaOberta.addTo(map)
				controlCapes.addOverlay(capaDadaOberta, nom_dataset, true);
				activaPanelCapes(true);
			}
		});
		
	}else{
		capaDadaOberta.addTo(map)
		controlCapes.addOverlay(capaDadaOberta, nom_dataset, true);
		activaPanelCapes(true);
	}
	//capaDadaOberta.on('layeradd',objecteUserAdded)
}


function addCapaMunicipis() {
	var url = "/llibreries/dades/json/municipis.geojson";
	capaDadaOberta = new L.GeoJSON.AJAX(url, {
		onEachFeature : popUp,
		nom : "Minicipis",
		tipus : 'Poligon',
		businessId : '-1',
		style:{"color": "#ff7800","weight": 1,"opacity": 0.65}
	});
	capaDadaOberta.addTo(map)
	controlCapes.addOverlay(capaDadaOberta, "Municipis", true);
	activaPanelCapes(true);
}

function loadingMap(accio){	
	if(accio){		
		if(jQuery('.search-load').css('display')!='block'){
			jQuery('.search-load').show();
		}	
	}else{
		jQuery('.search-load').hide();
	}	
}

function popUp(f, l) {
	var out = [];
	if (f.properties) {
		for (key in f.properties) {
			if(key!='gml_id'){
				if(key=='Name' || key=='Description'){
					out.push(f.properties[key]);
				}else if(key=='link' || key=='Web'){				
					ll=f.properties[key];
					if(ll.indexOf('.gif')!=-1){
						out.push('<img width="100" src="'+ll+'"/>');
					}else{
						out.push('<b>'+key +'</b>:<a target="_blank" href="'+ll+'"/>'+ll+'</a>');
					}
				}else{
					out.push("<b>"+key + "</b>: " + f.properties[key]);
				}
			}
		}
		l.bindPopup(out.join("<br />"));
	}
}

function generaLListaDadesObertes() {
	getLListaDadesObertes().then(function(results) {
		_htmlDadesObertes.push('<div><ul class="bs-dadesO">');
		$.each(results.dadesObertes, function(key, dataset) {
			_htmlDadesObertes.push('<li><a class="label label-explora" lang="ca" title="Afegir capa" href="#" id="'
				+ dataset.dataset
				+ '">'
				+ dataset.text
				+ '</a>'
				+ '<a target="_blank" lang="ca" title="Informació de les dades" href="'+dataset.urn+'"><span class="glyphicon glyphicon-info-sign info-explora"></span></a>'							
				+'</li>');
		});
		_htmlDadesObertes.push('</ul></div>');
	});
}

function loadMapConfig(mapConfig){
	console.debug(mapConfig);
	var dfd = jQuery.Deferred();
	if (!jQuery.isEmptyObject( mapConfig )){
		jQuery('#businessId').val(mapConfig.businessId);
		//TODO ver los errores de leaflet al cambiar el mapa de fondo 
		//cambiar el mapa de fondo a orto y gris
		if (mapConfig.options.fons != 'topoMap'){
			map.setActiveMap(mapConfig.options.fons);
			map.setMapColor(mapConfig.options.fonsColor);
			//map.gestionaFons();
		}
			
		if (mapConfig.options.bbox){
			var bbox = mapConfig.options.bbox.split(",");
			var southWest = L.latLng(bbox[1], bbox[0]),
		    northEast = L.latLng(bbox[3], bbox[2]),
		    bounds = L.latLngBounds(southWest, northEast);
			map.fitBounds( bounds ); 
		}
	
		//carga las capas en el mapa
		jQuery.each(mapConfig.servidorsWMS, function(index, value){
			
			if (value.epsg == "4326"){
				value.epsg = L.CRS.EPSG4326;
			}else if (value.epsg == "25831"){
				value.epsg = L.CRS.EPSG25831;
			}else if (value.epsg == "23031"){
				value.epsg = L.CRS.EPSG23031;
			}else{
				value.epsg = map.crs;
			}
			
			//Si la capa es de tipus wms
			if(value.serverType == t_wms){
				
				var newWMS = L.tileLayer.wms(value.url, {
				    layers: value.layers,
				    format: value.imgFormat,
				    transparent: value.transparency,
				    version: value.version,
				    opacity: value.opacity,
				    crs: value.epsg,
				    businessId: value.businessId
				});
				
				if (value.capesActiva == true || value.capesActiva == "true"){
					newWMS.addTo(map);
				}
				
				controlCapes.addOverlay(newWMS, value.serverName, true);				

			//Si la capa es de tipus dades obertes
			}else if(value.serverType == t_dades_obertes){
				var options = jQuery.parseJSON( value.options );
				var url_param = paramUrl.dadesObertes + "dataset=" + options.dataset;
				var estil_do = retornaEstilaDO(options.dataset);				
				
				var capaDadaOberta = new L.GeoJSON.AJAX(url_param, {
					onEachFeature : popUp,
					nom : value.serverName,
					tipus : options.tipus,
					businessId : value.businessId,
					dataType : "jsonp",
					zIndex: value.capesOrdre,
					pointToLayer : function(feature, latlng) {
						return L.circleMarker(latlng, estil_do);
					}
				});	
				
				if (value.capesActiva == true || value.capesActiva == "true"){
					capaDadaOberta.addTo(map);
				}
				
				controlCapes.addOverlay(capaDadaOberta, value.serverName, true);				

			//Si la capa es de tipus xarxes socials	
			}else if(value.serverType == t_xarxes_socials){
				
				var options = jQuery.parseJSON( value.options );
				
				if(options.xarxa_social == 'twitter') loadTwitterLayer(value, options.hashtag);
				else if(options.xarxa_social == 'panoramio') loadPanoramioLayer(value);
				else if(options.xarxa_social == 'wikipedia') loadWikipediaLayer(value);
			}
		});
				
	}else{
		
	}
	
	var source = $("#map-properties-template").html();
	var template = Handlebars.compile(source);
	var html = template(mapConfig);
	$('#frm_publicar').append(html);
	
	$('.make-switch').bootstrapSwitch();
	//$('.make-switch').bootstrapSwitch('setOnLabel', "<i class='glyphicon glyphicon-ok glyphicon-white'></i>");		
	//$('.make-switch').bootstrapSwitch('setOffLabel', "<i class='glyphicon glyphicon-remove'></i>");
		
	dfd.resolve();
	
	return dfd.promise();
}

function publicarMapa(){
	if(isBlank($('#dialgo_publicar #nomAplicacio').val())){
		$('#dialgo_publicar #nomAplicacio').addClass("invalid");
		$('#dialgo_publicar #nomAplicacio').after("<span class=\"text_error\" lang=\"ca\">El camp no pot estar buit</span>");
		return false;
	}
		
	var options = {};
	options.tags = jQuery('#dialgo_publicar #optTags').val();
	options.description = jQuery('#dialgo_publicar #optDescripcio').val();
	options.bbox = map.getBounds().toBBoxString();
	options.llegenda = jQuery('#llegenda_chk').bootstrapSwitch('state');
	options.layers = jQuery('#layers_chk').bootstrapSwitch('state');
	options.social = jQuery('#social_chk').bootstrapSwitch('state');
	options.fons = map.getActiveMap();
	options.fonsColor = map.getMapColor();
		
	console.debug(options);
	
	options = JSON.stringify(options);
	
	var newMap = true;
	
	if (jQuery('#businessId').val() != ""){
		newMap = false;
	}
	
	var data = {
		nom: jQuery('#dialgo_publicar #nomAplicacio').val(),
		uid: $.cookie('uid'),
		visibilitat: 'O',
		tipusApp: 'vis',
		options: options
	}
	
	if (newMap){
		createMap(data).then(function(results){
			if (results.status == "ERROR"){
				//TODO Mensaje de error
			}else{
				mapConfig = results.results;
				mapConfig.options = $.parseJSON( mapConfig.options );
				jQuery('#businessId').val(mapConfig.businessId);
				mapConfig.newMap = false;
				
			}
		});
	}else{
		data.businessId = jQuery('#businessId').val();
		updateMap(data).then(function(results){
			if (results.status == "ERROR"){
				//TODO Mensaje de error
			}else{
				mapConfig = results.results;
				mapConfig.options = $.parseJSON( mapConfig.options );
				$('#dialgo_publicar').modal('hide');
				mapConfig.newMap = false;
			}	
		});
	}
}

/*TODO estas funciones estaban pensadas para prevenir al usaurio al abandonar 
la pagína sin publicar el mapa. La idea era que al entrar en un mapa nuevo
se creara el mapa en la BD y que el si el usuario abandona la página sin publicar se 
mostrara el mensaje de advertencia y se borrara el mapa.
*/
function avisDesarMapa(){
	//console.debug(mapConfig.newMap);
	if (mapConfig.newMap){
		jQuery(window).on('beforeunload',function(event){
			//$('#dialgo_leave').modal('show');
			//event.stopPropagation();
			//event.preventDefault();
			//console.debug("antes de ir e");
			//return "Mensaje de aviso que no se muestra en Firefox";
		});
	}else{
		jQuery(window).off('beforeunload',function(){
			return true;
		});
	}
}

function leaveMapa(){
	console.debug("borrar el mapa e ir a la galeria");
}

function initControls(){
	addControlsInici();
	addClicksInici();
	addOpcionsFonsMapes();
	addToolTipsInici();
	redimensioMapa();
	creaPopOverDadesExternes();
	creaPopOverMevasDades();
	generaLListaDadesObertes();
	creaAreesDragDropFiles();
	creaPopOverMesFonsColor();
	tradueixMenusToolbar();
	addDrawToolbar();
	activaEdicioUsuari();
	addDialegsEstils();
	addControlCercaEdit();
	creaPopOverMesFons();
	generaLlistaServeisWMS();
}

function addTwitterLayer(hashtag){
	
	var lastZIndex = controlCapes._lastZIndex+1;//Jess
	var twitter = new L.Twitter({
						hashtag: hashtag,
						nom: 'twitter_'+ hashtag,
						zIndex: lastZIndex, 
						businessId: '-1'
					});

	//Si el mapa existeix a BD
	if(typeof url('?businessid') == "string"){
		
		var data = {
				uid:$.cookie('uid'),
				mapBusinessId: url('?businessid'),
				serverName: 'twitter_'+ hashtag,
				serverType: t_xarxes_socials,
				calentas: false,
	            activas: true,
	            visibilitats: true,
	            epsg: '4326',
	            transparency: true,
	            visibilitat: 'O',
				options: '{"xarxa_social": "twitter", "hashtag": "'+hashtag+'"}'
		};
		
		createServidorInMap(data).then(function(results){
			if (results.status == "OK"){
				twitter.options.businessId = results.results.businessId;
				twitter.addTo(map);
				controlCapes.addOverlay(twitter, 'twitter_'+ hashtag, true);
				activaPanelCapes(true);
			}else{
				console.debug('error create server in map');
			}
		});

		
	}else{
		twitter.addTo(map);
		controlCapes.addOverlay(twitter, 'twitter_'+ hashtag, true);
		activaPanelCapes(true);
	}	
} 

function loadTwitterLayer(layer, hashtag){
	
	var twitter = new L.Twitter({
		hashtag: hashtag,
		nom: layer.serverName,
		zIndex: layer.capesOrdre, 
		businessId: layer.businessId
	});	
	
	if (layer.capesActiva == true || layer.capesActiva == "true"){
		twitter.addTo(map);
	}
	
	controlCapes.addOverlay(twitter, layer.serverName, true);		
}

function addPanoramioLayer(){
	
	var lastZIndex = controlCapes._lastZIndex+1;//Jess
	var panoramio = new L.Panoramio({
						maxLoad: 10, 
						maxTotal: 250, 
						zIndex: lastZIndex,
						nom : 'panoramio_'+lastZIndex,
						businessId: '-1'
					});
	
	if(typeof url('?businessid') == "string"){
		var data = {
				uid:$.cookie('uid'),
				mapBusinessId: url('?businessid'),
				serverName: 'panoramio_'+ lastZIndex,
				serverType: t_xarxes_socials,
				calentas: false,
	            activas: true,
	            visibilitats: true,
	            epsg: '4326',
	            transparency: true,
	            visibilitat: 'O',
				options: '{"xarxa_social": "panoramio"}'
		};
		
		createServidorInMap(data).then(function(results){
			if (results.status == "OK"){
				panoramio.options.businessId = results.results.businessId;
				panoramio.addTo(map);
				controlCapes.addOverlay(panoramio, 'panoramio_'+ lastZIndex, true);
				activaPanelCapes(true);
			}else{
				console.debug('error create server in map');
			}
		});

		
	}else{
		panoramio.addTo(map);
		controlCapes.addOverlay(panoramio, 'panoramio_'+lastZIndex, true);
		activaPanelCapes(true);
	}	
}

function loadPanoramioLayer(layer){
	
	var panoramio = new L.Panoramio({
		maxLoad: 10, 
		maxTotal: 250, 
		zIndex: layer.capesOrdre,
		nom : layer.serverName,
		businessId: layer.businessId
	});	
	
	if (layer.capesActiva == true || layer.capesActiva == "true"){
		panoramio.addTo(map);
	}
	controlCapes.addOverlay(panoramio, layer.serverName, true);	
}

function addWikipediaLayer(){
	
	console.debug('Add wikipedia layer');
	var lastZIndex = controlCapes._lastZIndex+1;//Jess
	var wikipedia = new L.Wikipedia({
						zIndex: lastZIndex,
						nom : 'wikipedia_'+lastZIndex,
						businessId: '-1'
					});
	
	if(typeof url('?businessid') == "string"){
		
		var data = {
				uid:$.cookie('uid'),
				mapBusinessId: url('?businessid'),
				serverName: 'wikipedia_'+ lastZIndex,
				serverType: t_xarxes_socials,
				calentas: false,
	            activas: true,
	            visibilitats: true,
	            epsg: '4326',
	            transparency: true,
	            visibilitat: 'O',
				options: '{"xarxa_social": "wikipedia"}'
		};
		
		createServidorInMap(data).then(function(results){
			if (results.status == "OK"){
				wikipedia.options.businessId = results.results.businessId;
				wikipedia.addTo(map);
				controlCapes.addOverlay(wikipedia, 'wikipedia_'+ lastZIndex, true);
				activaPanelCapes(true);
			}else{
				console.debug('error create server in map');
			}
		});

		
	}else{
		wikipedia.addTo(map);
		controlCapes.addOverlay(wikipedia, 'wikipedia_'+lastZIndex, true);
		activaPanelCapes(true);
	}	
}

function loadWikipediaLayer(layer){
	
	var wikipedia = new L.Wikipedia({
		zIndex: layer.capesOrdre,
		nom : layer.serverName,
		businessId: layer.businessId
	});	
	
	if (layer.capesActiva == true || layer.capesActiva == "true"){
		wikipedia.addTo(map);
	}
	controlCapes.addOverlay(wikipedia, layer.serverName, true);	
}

//function saveMap(){
//	console.debug('Save Map.......');
//	
//	//Comprovar si est� logat!!
//	if($.cookie('uid')=== null || $.cookie('uid')===''){
//		alert('Falta fer missatge no pots guardar sense estar logat!!!');
//		return;
//	}
//	
//	
//	if(typeof url('?businessid') == "string"){//s'ha de fer update del mapa
//		
//		var options = "{\"tags\":\""+ mapConfig.options.tags +"\",\"description\":\""+mapConfig.options.description+"\",\"bbox\":\""+ map.getBounds().toBBoxString()+"\",\"llegenda\":"+mapConfig.options.llegenda+",\"layers\":"+mapConfig.options.layers+",\"social\":"+mapConfig.options.social+",\"fons\":\""+ map.getActiveMap()+"\",\"foncsColor\":\""+ map.options.mapColor+"\"}";
//		var nomMapa = $('#nomAplicacio').html();
//		var data = {
//			businessId: url('?businessid'),
//			uid: $.cookie('uid'),
//			nom: nomMapa,
//			visibilitat: 'O',//FALTA!! NO ES GUARDA ENLLOC?
//			clauVisor: mapConfig.clau,
//			thumbnail: mapConfig.thumbnail,
//			options: options
//		};	
//		
//		//Update info i dades generals del mapa
//		doUpdateMap(data).then(function(results){
//			if(results.status==='OK'){
//				alert('save Map ok!');
//			}else{
////				$('#modal_login_ko').modal('toggle');
//				alert('save Map KO!');
//			}				
//		},function(results){
//			$('#modal_login_ko').modal('toggle');					
//		});		
//		
////		//Update de les capes del mapa
////		var listLayers = controlCapes._layers;
////		int size = listLayers.lenght();
////		for(int i=0;i<size);i++{
////			
////		}
//		
//	}else{//S'ha de crear un mapa nou
//		alert("S'ha de crear un mapa nou!");
//	}
//	
//}

function myRemoveLayer(obj){
	
	console.debug('Arriba a myRemoveLayer');
	map.removeLayer(obj.layer);
	//Eliminem la capa de controlCapes, i actualitzem valors zindex de la resta
	var removeZIndex = obj.layer.options.zIndex;
	controlCapes.removeLayer(obj.layer);
	controlCapes._lastZIndex--;
	var obj = controlCapes._layers;
	for (var i in obj) {
		if (obj[i].layer.options.zIndex > removeZIndex) obj[i].layer.options.zIndex--;
	}
	
}

function updateEditableElements(){
	console.debug('updateEditableElements');
	$('.leaflet-name .editable').editable({
		type: 'text',
			success: function(response, newValue) {
				var id = this.id;
				if(typeof url('?businessid') == "string"){
					var data = {
					 	businessId: controlCapes._layers[this.id].layer.options.businessId, //url('?businessid') 
					 	uid: $.cookie('uid'),
					 	serverName: newValue
					 }
					var oldName = this.innerHTML;
					
					updateServidorWMSName(data).then(function(results){
						if(results.status==='OK'){
//						console.debug('udpate map name OK');
						controlCapes._layers[id].name = newValue;
					}else{
						controlCapes._layers[id].name = oldName;
						$('.leaflet-name label span#'+id).text(results.results.nom);
					}				
				},function(results){
					controlCapes._layers[id].name = oldName;
					var obj = $('.leaflet-name label span#'+id).text();
					$('.leaflet-name label span#'+id).text(oldName);
				});	
			}else{
				controlCapes._layers[id].name = newValue;
			}		
	 }
	});
}


function carregaDadesUsuari(data){
	console.debug("carregaDadesUsuari");
	//console.debug(data);
	jQuery.when(getAllServidorsWMSByUser(data), getAllTematicLayerByUid(data)).then(function(results1, results2){
		if (results1[0].status == "ERROR"){
			//TODO mostrar mensaje de error y hacer alguna accion por ejemplo redirigir a la galeria				
			return false;
		}
		dades1=results1;
		dades2=results2;
		//console.debug(dades1);
		//console.debug(dades2);
		loadPopOverMevasDades();
	},function(results){
		window.location.href = paramUrl.loginPage;
	});
}