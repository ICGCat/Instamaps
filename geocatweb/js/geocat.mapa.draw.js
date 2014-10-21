/**
 * Funcionalitats d'afegir features al mapa (punts, línies poligons) i
 * edició de les seves característiques: estils, coordenades, 
 * dades, capa on pertanyen...
 * */

var drawControl;
var featureActive,crt_Editing,crt_Remove;
var defaultPunt;
var canvas_linia={"id":"cv_linia","strokeStyle":"#FFC500","lineWidth":"3","tipus":"linia"};
var canvas_pol={"id":"cv_pol","strokeStyle":"#FFC500","opacity":"0.5","fillStyle":"rgba(255, 197, 0,0.5)","lineWidth":"3","tipus":"pol"};
var canvas_obj_l,cv_ctx_l;
var canvas_obj_p,cv_ctx_p;
var objEdicio={'esticEnEdicio':false,'obroModalFrom':'creaCapa','featureID':null,'esticSobre':false,'edicioPopup':'textFeature'};


function addDialegEstilsDraw() {
	
	addHtmlInterficieDraw();
	
	jQuery('#div_mes_punts').on("click", function(e) {	
		obrirMenuModal('#dialog_estils_punts','toggle',from_creaCapa);
	});

	jQuery('#div_mes_linies').on("click", function(e) {			
		obrirMenuModal('#dialog_estils_linies','toggle',from_creaCapa);
	});
	
	jQuery('#div_mes_arees').on("click", function(e) {	
		obrirMenuModal('#dialog_estils_arees','toggle',from_creaCapa);
	});
}

/**
 * Funcio que obre el menu dialeg d'estils per punts, linies i poligons
 * */
function obrirMenuModal(_menuClass,estat,_from){
	objEdicio.obroModalFrom=_from;
	
	//Udate dialog estils a mostrar
	if(_from == from_creaCapa){
		
		if(_menuClass.indexOf("arees")!=-1){
			var defPol = document.getElementById("cv_pol").getContext("2d");
			var fillColor = defPol.fillStyle;
			if(fillColor.indexOf("rgb")!=-1) fillColor = rgb2hex(defPol.fillStyle);
			var icon = {color: defPol.strokeStyle,
						fillOpacity : getRgbAlpha(defPol.fillStyle),
						fillColor: fillColor,//rgb2hex(defPol.fillStyle),
						weight: defPol.lineWidth,
						tipus: t_polygon
					};
			updateDialogStyleSelected(icon);
			
		}else if(_menuClass.indexOf("linies")!=-1){
			var defLine = document.getElementById("cv_linia").getContext("2d");
			var icon = {color: defLine.strokeStyle,
						weight: defLine.lineWidth,
						tipus: t_polyline
					};
			updateDialogStyleSelected(icon);			
		
		}else{//es t_marker

			 var styleProps = $("#div_punt").css(["width","height","color","background-color","font-size"]);
			 var punt_class = $("#div_punt").attr("class");
			 var lclass = punt_class.split(" ");
			 
			 //Si es punt inicial per defecte
			 if(punt_class == "dibuix_punt"){
					var icon = {icon: "",//glyph
						 	iconColor: "#000000",
						 	isCanvas: false,
						 	className: "awesome-marker",
						 	markerColor: 'orange',
						 	tipus: t_marker
				};
				updateDialogStyleSelected(icon);				 
			 }else if (punt_class.indexOf("punt_r")!=-1){
				 	

				 	//Es punt sense glyphon, CANVAS
				 	if(!lclass[3] || lclass[3] === "fa-"){
						var icon = {icon: "",//glyph
								 	iconColor: rgb2hex(styleProps.color),
								 	fillColor: rgb2hex(styleProps["background-color"]),
								 	radius: getRadiusFromMida(styleProps.width),
								 	isCanvas: true,
								 	tipus: t_marker
						};
						updateDialogStyleSelected(icon);
						
				 	}else{//Es punt amb glyphon
					 	var iconGlyph = "";
					 	if(lclass[3]) iconGlyph = lclass[3];
					 	
					 	var font = " font"+styleProps["font-size"].substring(0,2);
						var icon = {icon: iconGlyph.substring(3) + font,//glyph
								 	iconColor: rgb2hex(styleProps.color),
								 	divColor: rgb2hex(styleProps["background-color"]),
								 	isCanvas: false,
								 	markerColor: punt_class,
								 	tipus: t_marker
						};
						updateDialogStyleSelected(icon);					 	
				 	}
			 }else{//Pintxo
				var markerColor = (lclass[1].split("-"))[3];
			 	var iconGlyph = "";
			 	if(lclass[3]) iconGlyph = lclass[3];
			 	
				var icon = {icon: iconGlyph.substring(3),//glyph
						 	iconColor: rgb2hex(styleProps.color),
						 	isCanvas: false,
						 	className: "awesome-marker",
						 	markerColor: markerColor,
						 	tipus: t_marker
				};
				updateDialogStyleSelected(icon);
			 }
		}
	}	
	
    if (jQuery.isPlainObject( _from )){
    	if (_from.from == tem_clasic){
    		//TODO
    		/*
    		jQuery('.fila-awesome-markers').hide();
            activaPuntZ();
            jQuery('#dialog_tematic_rangs').modal('hide');
            jQuery(_menuClass).modal(estat);
            */
    	}else{
    		

    		
    		var layers_from = controlCapes._layers[_from.leafletid].layer.getLayers();
        	if( layers_from.length > num_max_pintxos){
                jQuery('.fila-awesome-markers').hide();
                jQuery('#filaM').hide();
                estilP.iconGlif = "fa fa-";
                activaPuntZ();
        	}else{
        		jQuery('#filaM').show();
                jQuery('.fila-awesome-markers').show();
               
        	}
        	jQuery('.modal').modal('hide');     
            jQuery(_menuClass).modal(estat);
    	}
    }else{
    	jQuery('.fila-awesome-markers').show();
    	jQuery('#filaM').show();
    	jQuery('.modal').modal('hide');     
        jQuery(_menuClass).modal(estat);
    }
    
}

function initCanvas(){
	addGeometryInitP(document.getElementById(canvas_pol.id));
	addGeometryInitP(document.getElementById(canvas_pol.id+"0"));
	addGeometryInitL(document.getElementById(canvas_linia.id));	
	addGeometryInitL(document.getElementById(canvas_linia.id+"0"));
	
    $('#colorpalette_pf').colorPalette().on('selectColor', function(e) {   	
    $('.fill_color_pol').css('background-color',e.color);
    $('.fill_color_pol').css('color',e.color);
    	canvas_pol.fillStyle="rgba("+hexToRgb(e.color).r+", "+hexToRgb(e.color).g+", "+hexToRgb(e.color).b+","+jQuery('#cmb_trans').val()+")";
    	addGeometryInitP(document.getElementById("cv_pol0"));
    });	
    
    $('#colorpalette_pl').colorPalette().on('selectColor', function(e) {   	
    $('.border_color_pol').css('border-color',e.color);
    	canvas_pol.strokeStyle=e.color;
    	addGeometryInitP(document.getElementById("cv_pol0"));  
    });
	
	$('#colorpalette_ll').colorPalette().on('selectColor', function(e) {   	
    $('.border_color_linia').css('background-color',e.color);
		canvas_linia.strokeStyle=e.color;
		addGeometryInitL(document.getElementById("cv_linia0"));
	});
 
	$('#colorpalette_icon').colorPalette().on('selectColor', function(e) {  
		 $('.fill_color_icon').css('background-color',e.color);
			estilP.colorGlif=e.color;			
			jQuery('.bs-glyphicons li').css('color',estilP.colorGlif);
			if(e.color=="#FFFFFF"){
				jQuery('.bs-glyphicons li').css('background-color','#aaaaaa');	
			}else{
				jQuery('.bs-glyphicons li').css('background-color','#FFFFFF');	
			}
			jQuery('#div_punt0').css('color',estilP.colorGlif);
			jQuery(this).addClass("estil_selected");
	});
	


	$('#colorpalette_punt').colorPalette().on('selectColor', function(e) {  
		 $('.fill_color_punt').css('background-color',e.color);			
		 if(!jQuery('#div_puntZ').hasClass("estil_selected")){
				activaPuntZ();				
		 }else{		 
			estilP.divColor=e.color;				
			jQuery('#div_punt0').css('background-color',estilP.divColor);
		 }
		    jQuery('#div_punt9').css('background-color',e.color);		
		});
	
	var options = {
			colors:[['#ffc500', '#ff7f0b', '#ff4b3a', '#ae59b9', '#00afb5', '#7cbd00', '#90a6a9', '#ebf0f1']]
	};
	
	$('#colorpalette_marker').colorPalette(options).on('selectColor', function(e) {  
		 $('.fill_color_marker').css('background-color',e.color);	
		 activaPuntM(e.color);
	});	

	jQuery("#cmb_trans").on('change', function(e) { 
    	var color=rgb2hex($('.fill_color_pol').css('background-color'));
    	canvas_pol.opacity=jQuery(this).val();
    	canvas_pol.fillStyle="rgba("+hexToRgb(color).r+", "+hexToRgb(color).g+", "+hexToRgb(color).b+","+canvas_pol.opacity+")";
    	addGeometryInitP(document.getElementById("cv_pol0"));
    });
    
    jQuery("#cmb_gruix").on('change', function(e) { 
    	canvas_pol.lineWidth=jQuery(this).val();
    	addGeometryInitP(document.getElementById("cv_pol0"));
    });
    
    jQuery("#cmb_gruix_l").on('change', function(e) { 
    	canvas_linia.lineWidth=jQuery(this).val();
    	addGeometryInitL(document.getElementById("cv_linia0"));
    });
}

function addGeometryInitL(canvas){
	var	cv_ctx_l=canvas.getContext("2d");
	cv_ctx_l.clearRect(0, 0, canvas.width, canvas.height);
	cv_ctx_l.moveTo(0.7,39.42);
	cv_ctx_l.lineTo(2.05,34.43);
	cv_ctx_l.lineTo(3.62,31.00);
	cv_ctx_l.lineTo(5.95,27.72);
	cv_ctx_l.lineTo(8.17,25.61);
	cv_ctx_l.lineTo(10.72,23.84);
	cv_ctx_l.lineTo(13.059,22.73);
	cv_ctx_l.lineTo(15.32,22.28);
	cv_ctx_l.lineTo(17.76,22.08);
	cv_ctx_l.lineTo(20.30,21.47);
	cv_ctx_l.lineTo(23.28,20.51);
	cv_ctx_l.lineTo(25.88,18.90);
	cv_ctx_l.lineTo(28.265,16.83);
	cv_ctx_l.lineTo(29.9,14.71);
	cv_ctx_l.lineTo(31.89,12.195);
	cv_ctx_l.lineTo(33.62,9.42);
	cv_ctx_l.lineTo(34.81,6.64);
	cv_ctx_l.lineTo(35.46,3.92);
	cv_ctx_l.lineTo(35.52,0.54);
	cv_ctx_l.strokeStyle=canvas_linia.strokeStyle;
	cv_ctx_l.lineWidth=canvas_linia.lineWidth;
	cv_ctx_l.stroke(); 	
}

function addGeometryInitP(canvas){
	var	cv_ctx_p=canvas.getContext("2d");
	cv_ctx_p.clearRect(0, 0, canvas.width, canvas.height);
	cv_ctx_p.moveTo(5.13,15.82);
	cv_ctx_p.lineTo(25.49,5.13);
	cv_ctx_p.lineTo(37.08,13.16);
	cv_ctx_p.lineTo(20.66,38.01);
	cv_ctx_p.lineTo(2.06,33.67);
	cv_ctx_p.closePath();
	cv_ctx_p.strokeStyle=canvas_pol.strokeStyle;
	
	if(canvas_pol.fillStyle.indexOf("rgb")!= -1) cv_ctx_p.fillStyle = canvas_pol.fillStyle;
	else cv_ctx_p.fillStyle=hexToRgba(canvas_pol.fillStyle,canvas_pol.opacity );
	
//	cv_ctx_p.fillStyle=canvas_pol.fillStyle;
	cv_ctx_p.lineWidth=canvas_pol.lineWidth;
//	cv_ctx_p.opacity=canvas_pol.opacity;
	cv_ctx_p.fill();
	cv_ctx_p.stroke(); 
}

//Funcio inicialitzar i afegir drawControl
function addDrawToolbar() {
	initCanvas();
	
	var ptbl = L.Icon.extend({
		options : {
			shadowUrl : null,
			iconAnchor : new L.Point(14, 40),
			iconSize : new L.Point(28, 40)
		}
	});

	defaultPunt= L.AwesomeMarkers.icon(default_marker_style);

	var options = {
		draw : false,
		polyline : {
			guidelineDistance : 2,
			repeatMode:false,
			shapeOptions : {
				color : '#FFC400',
				weight : 3,
				opacity : 1,
				tipus: t_polyline
			}
		},
		polygon : {
			allowIntersection : true, // Restricts shapes
			repeatMode:false,
			guidelineDistance : 2,
			shapeOptions : {
				color : '#FFC400',
				weight : 3,
				fillOpacity : 0.5,
				tipus: t_polygon
			}
		},
		marker:{repeatMode:false,
			icon:L.icon({iconUrl:'/geocatweb/css/images/blank.gif'})
		},
		edit : false
	};
	drawControl = new L.Control.Draw(options);
	map.addControl(drawControl);
}

//function showEditText(accio){
//	jQuery('.search-edit').animate({
//		height :accio
//	});
//}

function activaEdicioUsuari() {
	jQuery('#div_punt').on('click', function() {
		if(featureActive){featureActive.disable();}
		featureActive = new L.Draw.Marker(map, drawControl.options.marker);		 
		featureActive.enable();
	});

	jQuery('#div_linia').on('click', function() {
		if(featureActive){featureActive.disable();}
		featureActive = new L.Draw.Polyline(map, drawControl.options.polyline);
		featureActive.enable();
	});

	jQuery('#div_area').on('click', function() {
		if(featureActive){featureActive.disable();}
		featureActive = new L.Draw.Polygon(map, drawControl.options.polygon);
		featureActive.enable();
	});

	map.on('draw:drawstart',function(e){});
	
	//Edicio de feature existent
	map.on('click',function(e){
		if(crt_Editing){
			crt_Editing.disable();
		}
		if(objEdicio.esticEnEdicio){
			if(crt_Editing){
				crt_Editing.disable();
			}
			updateFeatureMove(objEdicio.featureID, crt_Editing._featureGroup._leaflet_id);			
		}
	});
	
	map.on('preclick',function(e){
		if(crt_Editing){
			crt_Editing.disable();
		}
	});
	
	//Afegir features: point, lines and polygons
	map.on('draw:created', function(e) {
		var type = e.layerType, layer = e.layer;
		var totalFeature;
		var tipusCat,tipusCatDes;
	
		_gaq.push(['_trackEvent', 'mapa', tipus_user+'dibuixar geometria', type, 1]);
		_kmq.push(['record', 'dibuixar geometria', {'from':'mapa', 'tipus user':tipus_user, 'type':type}]);

		if (type === t_marker) {
			tipusCat=window.lang.convert('Títol Punt');
			tipusCatDes=window.lang.convert('Descripció Punt');
			var nomDefecteCapa = window.lang.convert('Capa Punt');
			
			//Mira si és icona
			if(!defaultPunt.options.isCanvas){
				layer=L.marker([layer.getLatLng().lat,layer.getLatLng().lng],
					{icon: defaultPunt,isCanvas:defaultPunt.options.isCanvas,
					 tipus: t_marker}).addTo(map);
			}else{
				//Si és cercle sense glifon
				layer= L.circleMarker([layer.getLatLng().lat,layer.getLatLng().lng],
						{ radius : defaultPunt.options.radius, 
						  isCanvas:defaultPunt.options.isCanvas,
						  fillColor : defaultPunt.options.fillColor,
						  color :  defaultPunt.options.color,
						  weight :  defaultPunt.options.weight,
						  opacity :  defaultPunt.options.opacity,
						  fillOpacity : defaultPunt.options.fillOpacity,
						  tipus: t_marker}
						
				).addTo(map);
			}
			
			if(capaUsrActiva != null && capaUsrActiva.options.geometryType != t_marker){
				capaUsrActiva.removeEventListener('layeradd');
				capaUsrActiva = new L.FeatureGroup();
				var index = parseInt(controlCapes._lastZIndex)+1;
				capaUsrActiva.options = {
					businessId : '-1',
					nom : nomDefecteCapa+' '+ index,
					zIndex :  -1,
					tipus : t_tematic,
					geometryType: t_marker
				};				
				map.addLayer(capaUsrActiva);
				capaUsrActiva.on('layeradd',objecteUserAdded);
				
			}else if(capaUsrActiva == null){
				capaUsrActiva = new L.FeatureGroup();
				var index = parseInt(controlCapes._lastZIndex)+1;
				capaUsrActiva.options = {
					businessId : '-1',
					nom : nomDefecteCapa+' '+index,
					zIndex :  -1,
					tipus : t_tematic,
					geometryType: t_marker
				};
				map.addLayer(capaUsrActiva);
				capaUsrActiva.on('layeradd',objecteUserAdded);
			}
			
			layer.properties={'nom':tipusCat+' '+capaUsrActiva.getLayers().length,
					'text':tipusCatDes+' '+capaUsrActiva.getLayers().length,
					'capaNom':capaUsrActiva.options.nom,//TODO desactualitzat quan es canvii nom capa!
					'capaBusinessId':capaUsrActiva.options.businessId,
					'capaLeafletId': capaUsrActiva._leaflet_id,
					'tipusFeature':t_marker};			
			
			capaUsrActiva.addLayer(layer);
			
		} else if (type === t_polyline) {
			tipusCat=window.lang.convert('Títol Línia');
			tipusCatDes=window.lang.convert('Descripció Línia');
			var nomDefecteCapa = window.lang.convert('Capa Línia');
			
			if(capaUsrActiva != null && capaUsrActiva.options.geometryType != t_polyline){
				capaUsrActiva.removeEventListener('layeradd');
				capaUsrActiva = new L.FeatureGroup();
				var index = parseInt(controlCapes._lastZIndex)+1;
				capaUsrActiva.options = {
					businessId : '-1',
					nom : nomDefecteCapa+' '+index,
					zIndex :  -1,
					tipus : t_tematic,
					geometryType: t_polyline

				};
				map.addLayer(capaUsrActiva);
				capaUsrActiva.on('layeradd',objecteUserAdded);
			}else if(capaUsrActiva == null){
				capaUsrActiva = new L.FeatureGroup();
				var index = parseInt(controlCapes._lastZIndex)+1;
				capaUsrActiva.options = {
					businessId : '-1',
					nom : nomDefecteCapa+' '+index,
					zIndex :  -1,
					tipus : t_tematic,
					geometryType: t_polyline
				};
				map.addLayer(capaUsrActiva);
				capaUsrActiva.on('layeradd',objecteUserAdded);
			}
			
			layer.properties={'nom':tipusCat+' '+capaUsrActiva.getLayers().length,
					'text':tipusCatDes+' '+capaUsrActiva.getLayers().length,
					'capaNom':capaUsrActiva.options.nom,//TODO desactualitzat quan es canvii nom capa!
					'capaBusinessId':capaUsrActiva.options.businessId,
					'capaLeafletId': capaUsrActiva._leaflet_id,
					'tipusFeature':t_polyline,
					'mida': calculateDistance(layer.getLatLngs()) };		
			
			layer.addTo(map);
			capaUsrActiva.addLayer(layer);
			
		} else if (type === t_polygon) {
			tipusCat=window.lang.convert('Títol Polígon');
			tipusCatDes=window.lang.convert('Descripció Polígon');	
			var nomDefecteCapa = window.lang.convert('Capa Polígon');
			var mida = L.GeometryUtil.geodesicArea(layer.getLatLngs());
			
			if(capaUsrActiva != null && capaUsrActiva.options.geometryType != t_polygon){
				capaUsrActiva.removeEventListener('layeradd');
				capaUsrActiva = new L.FeatureGroup();
				var index = parseInt(controlCapes._lastZIndex)+1;
				capaUsrActiva.options = {
					businessId : '-1',
					nom : nomDefecteCapa+' '+index,
					zIndex :  -1,
					tipus : t_tematic,
					geometryType: t_polygon
				};
				map.addLayer(capaUsrActiva);				
				capaUsrActiva.on('layeradd',objecteUserAdded);
			}else if(capaUsrActiva == null){
				capaUsrActiva = new L.FeatureGroup();
				var index = parseInt(controlCapes._lastZIndex)+1;
				capaUsrActiva.options = {
					businessId : '-1',
					nom : nomDefecteCapa+' '+index,
					zIndex :  -1,
					tipus : t_tematic,
					geometryType: t_polygon
				};
				map.addLayer(capaUsrActiva);
				capaUsrActiva.on('layeradd',objecteUserAdded);
			}
			layer.properties={'nom':tipusCat+' '+capaUsrActiva.getLayers().length,
					'text':tipusCatDes+' '+capaUsrActiva.getLayers().length,
					'capaNom':capaUsrActiva.options.nom,//TODO desactualitzat quan es canvii nom capa!
					'capaBusinessId':capaUsrActiva.options.businessId,
					'capaLeafletId': capaUsrActiva._leaflet_id,
					'tipusFeature':t_polygon,
					'mida': calculateArea(layer.getLatLngs())};			
			
			layer.addTo(map);
			capaUsrActiva.addLayer(layer);			
		}
	});
	
}

//Funcio que crea Pop up de la feature quan te opcio d'edicio
function createPopupWindow(layer,type){
	//console.debug('createPopupWindow');
	var html = createPopUpContent(layer,type);
	layer.bindPopup(html,{'offset':[0,-25]});
	
	//eventos del popup
	jQuery(document).on('click', "#titol_pres", function(e) {
		modeEditText();
	});
	
	jQuery(document).on('click', "#des_pres", function(e) {
		modeEditText();
	});

	jQuery(document).on('click', ".bs-ncapa li a", function(e) {
		e.preventDefault();
		var accio;
		if(jQuery(this).attr('id').indexOf('#')!=-1){			
			accio=jQuery(this).attr('id').split("#");				
		}
		
		objEdicio.featureID=accio[1];
		if(accio[0].indexOf("layer_edit")!=-1){
			objEdicio.edicioPopup='textCapa';
			jQuery('#layer_accio').text(window.lang.convert('Canviar el nom de la capa'))
			jQuery('#capa_edit').val(jQuery('#cmbCapesUsr').val());
			modeLayerTextEdit();

		}else if(accio[0].indexOf("layer_add")!=-1){
			objEdicio.edicioPopup='nouCapa';
			jQuery('#layer_accio').text(window.lang.convert('Nom nova capa'))
			jQuery('#capa_edit').val("").attr('placeholder',window.lang.convert('Nova capa'));
			modeLayerTextEdit();
		}else{
			
		}
	});
	
	 jQuery(document).on('focus', ".bs-ncapa li select", function(e) {
		 $(this).data('cmbCapesUsr_old',$(this).val());
	 });	 
	 
	 jQuery(document).on('change', ".bs-ncapa li select", function(e) {
		    e.stopImmediatePropagation();
//		    console.debug('on change select cmbusrcapa');
			var accio;
			if(jQuery(this).attr('id').indexOf('-')!=-1){			
				accio=jQuery(this).attr('id').split("-");				
			}
			objEdicio.featureID=accio[1];
			
			var toBusinessId = jQuery(this).val().split("#");
			var fromBusinessId = $(this).data('cmbCapesUsr_old').split("#");
			//Actualitzem valor antic
			$(this).data('cmbCapesUsr_old',$(this).val());
			
			objEdicio.featureID=accio[1];
			var obj = map._layers[objEdicio.featureID];
			
			//Accio de moure la feature a la nova capa tematic creada
			var data = {
					uid: $.cookie('uid'),
		            businessId: obj.properties.businessId, //businessId de la feature
		            fromBusinessId: fromBusinessId[0], //businessId del tematico de origen
		            toBusinessId: toBusinessId[0] //businessId del tematico de destino
		    }
			
			moveFeatureToTematic(data).then(function(results){
				if(results.status=='OK'){
					var toLayer = controlCapes._layers[''+toBusinessId[1]+''].layer;//map._layers[''+toBusinessId[1]+''];
					var fromLayer = map._layers[''+fromBusinessId[1]+''];
					fromLayer.removeLayer(obj);
					toLayer.addLayer(obj);
					//Refresh de la capa
					controlCapes._map.removeLayer(toLayer);
					controlCapes._map.addLayer(toLayer);
					//Actualitzem capa activa
					if(capaUsrActiva) capaUsrActiva.removeEventListener('layeradd');
					capaUsrActiva = toLayer;
					capaUsrActiva.on('layeradd',objecteUserAdded);	
					//Actualitzem properties de la layer
					obj.properties.capaBusinessId = capaUsrActiva.options.businessId;
					obj.properties.capaNom = capaUsrActiva.options.nom;
					obj.properties.capaLeafletId = capaUsrActiva._leaflet_id;
					//Actualitzem popup del marker
					//var html = createPopUpContent(obj,obj.options.tipus);
					//obj.setPopupContent(html);
					map.closePopup();
					obj.openPopup();
					
					//update rangs
					getRangsFromLayer(capaUsrActiva);
					
					//NO CAL: com cridem addLayer, de controlCapes, ja s'actualitzen els comptadors de les capes
					//updateFeatureCount(fromBusinessId, toBusinessId);
					
				}else{
					console.debug("moveFeatureToTematic ERROR");
				}
			},function(results){
				console.debug("moveFeatureToTematic ERROR");
			});						
	 });
	 
	jQuery(document).on('click', ".bs-popup li a", function(e) {
		e.stopImmediatePropagation();
		var accio;
		if(jQuery(this).attr('id').indexOf('#')!=-1){			
			accio=jQuery(this).attr('id').split("#");				
		}
		objEdicio.featureID=accio[1];
		
		if(accio[0].indexOf("feature_edit")!=-1){

			//Update modal estils, amb estil de la feature seleccionada
			var obj = map._layers[accio[1]];
			if(obj.options.icon /*|| obj.options.icon.options.markerColor.indexOf("punt_r")!=-1*/){
				var icon = obj.options.icon.options;	
			}else{
				var icon = obj.options;
			}
			updateDialogStyleSelected(icon);

			
			if(accio[2].indexOf("marker")!=-1){
				obrirMenuModal('#dialog_estils_punts','toggle',from_creaPopup);
			}else if(accio[2].indexOf("polygon")!=-1){
				obrirMenuModal('#dialog_estils_arees','toggle',from_creaPopup);
			}else{
				obrirMenuModal('#dialog_estils_linies','toggle',from_creaPopup);
			}
		}else if(accio[0].indexOf("feature_remove")!=-1){
			map.closePopup();
			var data = {
	            businessId: map._layers[objEdicio.featureID].properties.businessId,
	            uid: $.cookie('uid')
	        };
			deleteFeature(data).then(function(results){
				if(results.status == 'OK'){
					var capaLeafletId = map._layers[objEdicio.featureID].properties.capaLeafletId;
					map._layers[capaLeafletId].removeLayer(map._layers[objEdicio.featureID]);
					if(map._layers[objEdicio.featureID]!= null) map.removeLayer(map._layers[objEdicio.featureID]);					
					//Actualitzem comptador de la capa
					updateFeatureCount(map._layers[capaLeafletId].options.businessId, null);
				}else{
					console.debug("ERROR deleteFeature");
				}
			},function(results){
				console.debug("ERROR deleteFeature");
			});	
		}else if(accio[0].indexOf("feature_text")!=-1){
			modeEditText();
		}else if(accio[0].indexOf("feature_move")!=-1){
			objEdicio.esticEnEdicio=true;
			var capaLeafletId = map._layers[objEdicio.featureID].properties.capaLeafletId;						
			//Actualitzem capa activa
			if (capaUsrActiva){
				capaUsrActiva.removeEventListener('layeradd');
			}
			capaUsrActiva = map._layers[capaLeafletId];
			
			var capaEdicio = new L.FeatureGroup();
			capaEdicio.addLayer(map._layers[objEdicio.featureID]);
			capaUsrActiva.removeLayer(map._layers[objEdicio.featureID]);
			map.addLayer(capaEdicio);
			
			var opcionsSel={
					color: '#FF1EE5',
					"weight": 7,
					opacity: 0.6,
					dashArray: '1, 1',
					fill: true,
					fillColor: '#fe57a1',
					fillOpacity: 0.1
				};
			
			crt_Editing=new L.EditToolbar.Edit(map, {
				featureGroup: capaEdicio,
				selectedPathOptions: opcionsSel
			});
			crt_Editing.enable();
			map.closePopup();
			
		}else if(accio[0].indexOf("feature_no")!=-1){
			jQuery('.popup_pres').show();
			jQuery('.popup_edit').hide();
			
		}else if(accio[0].indexOf("feature_ok")!=-1){
			if(objEdicio.edicioPopup=='textFeature'){
				var txtTitol=jQuery('#titol_edit').val();
				var txtDesc=jQuery('#des_edit').val();
				
				updateFeatureNameDescr(map._layers[objEdicio.featureID],txtTitol,txtDesc);

			}else if(objEdicio.edicioPopup=='textCapa'){
				if(jQuery('#capa_edit').val()!=""){
					jQuery('#cmbCapesUsr option:selected').text(jQuery('#capa_edit').val());	
					jQuery('.popup_pres').show();
					jQuery('.popup_edit').hide();
				}else{
					alert(window.lang.convert('Has de posar un nom de capa'));	
				}
			}else if(objEdicio.edicioPopup=='nouCapa'){
				if(jQuery('#capa_edit').val()!=""){
					generaNovaCapaUsuari(map._layers[objEdicio.featureID],jQuery('#capa_edit').val());
				}else{
					alert(window.lang.convert('Has de posar un nom de capa'));	
				}
			}
		}else{
		//accio tanca
			map.closePopup();
		}
	});	

	layer.on('popupopen', function(e){
		
		if(objEdicio.esticEnEdicio){//Si s'esta editant no es pot editar altre element
			map.closePopup();
		}else{
			//actualitzem popup
			jQuery('#cmbCapesUsr-'+layer._leaflet_id+'-'+layer.options.tipus+'').html(reFillCmbCapesUsr(layer.options.tipus, layer.properties.capaBusinessId));
			if (layer.properties.nom){
				jQuery('#titol_pres').text(layer.properties.nom).append(' <i class="glyphicon glyphicon-pencil blau"></i>');
			}
			if (layer.properties.text){
				jQuery('#des_pres').text(layer.properties.text).append(' <i class="glyphicon glyphicon-pencil blau"></i>');
			}			
		}
	});
}

function reFillCmbCapesUsr(type, businessIdCapa){
	var html = "";
	$.each( controlCapes._layers, function(i,val) {
		var layer = val.layer.options;
		if(layer.tipus==t_tematic && layer.geometryType==type && !layer.source){
	        html += "<option value=\"";
	        html += layer.businessId +"#"+val.layer._leaflet_id+"\"";
	        if(businessIdCapa == layer.businessId) html += " selected";
	        html += ">"+ layer.nom + "</option>";            		
		}
	});		
	return html;
}


function objecteUserAdded(f){
	
	var fId = this.toGeoJSON().features.length;
	
	var feature = f.layer.toGeoJSON();
	
	//Invertim lng,lat perque es recuperi be desde el servidor despres
    if(f.layer.options.tipus == t_marker){
          var lng = feature.geometry.coordinates[0]
          feature.geometry.coordinates[0] = feature.geometry.coordinates[1];
          feature.geometry.coordinates[1] = lng;         
    }else if(f.layer.options.tipus==t_polyline){
          for(var i=0;i<feature.geometry.coordinates.length;i++){
                var lng = feature.geometry.coordinates[i][0]
                feature.geometry.coordinates[i][0] = feature.geometry.coordinates[i][1];
                feature.geometry.coordinates[i][1] = lng;
          }
    }else if(f.layer.options.tipus==t_polygon){
          var lcoordinates = [];
          $.each( feature.geometry.coordinates[0], function(i,val) {
                lcoordinates.push([val[1], val[0]]);
          }); 
          feature.geometry.coordinates[0] = lcoordinates;                  
    }       

	feature.properties = {
		nom : f.layer.properties.nom,
		text : f.layer.properties.text,
		slotf1 : 'data 1',
		slotf2 : 'data 2',
		slotf3 : 'data 3',
		slotf4 : 'data 4',
		slotf5 : 'data 5',
		slotf6 : 'data 6',
		slotf7 : 'data 7',
		slotf8 : 'data 8',
		slotf9 : 'data 9',
		slotf10 : 'data 10'
	};

	var features = JSON.stringify(feature);

	var dades = JSON.stringify({
		type : 'Dades',
		id : fId,
		fields : {
			slotd1 : "feature" + fId,
			slotd2 : 'data 2',
			slotd3 : 'data 3',
			slotd4 : 'data 4',
			slotd5 : 'data 5',
			slotd6 : 'data 6',
			slotd7 : 'data 7',
			slotd8 : 'data 8',
			slotd9 : 'data 9',
			slotd10 : 'data 10',
		}
	});

	var rangs = getFeatureStyle(f,fId);
	rangs = JSON.stringify(rangs);
	
	if (fId == 1) {
		// Add feature and Layer
		var data = {
			uid : jQuery.cookie('uid'),
			description : 'Description '+f.layer.properties.capaNom,
			nom : f.layer.properties.capaNom,
            calentas: false,           
            activas: true,
            visibilitats: true,				
			publica : true,
			order: controlCapes._lastZIndex+1,
			geomField : 'the_geom',
			idGeomField : 'nom',
			dataField : 'slotd1',
			idDataField : 'slotd1',
			features : features,
			dades : dades,
			rangs : rangs,
			tipusRang: tem_origen,
			mapBusinessId: url('?businessid'),
			geometryType: f.layer.options.tipus
		};
		var _this = this;
		
		createTematicLayerFeature(data).then(function(results) {
				if(results.status === 'OK'){
					_this.options.businessId = results.results.businessId;
					f.layer.properties.capaBusinessId = results.results.businessId;
					f.layer.properties.businessId = results.feature.properties.businessId;
					f.layer.properties.feature = results.feature;
					finishAddFeatureToTematic(f.layer);
				}else{
					//ERROR: control Error
					console.debug('addTematicLayerFeature ERROR');
				}
			},function(results){
				console.debug('addTematicLayerFeature ERROR');
		});

	} else if (this.getLayers().length > 1) {
	
		var data = {
			uid : jQuery.cookie('uid'),
			features : features,
			dades : dades,
			rangs : rangs,
			businessId: this.options.businessId
		};				
				
		addFeatureToTematic(data).then(function(results) {
			if(results.status === 'OK'){
				f.layer.properties.businessId = results.feature.properties.businessId;
				f.layer.properties.capaBusinessId = results.results.businessId;
				f.layer.properties.feature = results.feature;
				finishAddFeatureToTematic(f.layer);					
			}else{
				//ERROR: control Error
				console.debug("addFeatureToTematic ERROR");
			}
		},function(results){
			console.debug("addFeatureToTematic ERROR");
		});
	}
}

function getFeatureStyle(f, fId){
	var rangs = {};
	//ESTIL MARKER
	if(f.layer.options.tipus == t_marker){
		if (!f.layer._ctx){
			rangs = {
				color : f.layer.options.icon.options.fillColor,//Color principal
				marker: f.layer.options.icon.options.markerColor,//Si es de tipus punt_r o el color del marker
				simbolColor: f.layer.options.icon.options.iconColor,//Glyphon
				radius : f.layer.options.icon.options.radius,//Radius
				iconSize : f.layer.options.icon.options.iconSize.x+"#"+f.layer.options.icon.options.iconSize.y,//Size del cercle
				iconAnchor : f.layer.options.icon.options.iconAnchor.x+"#"+f.layer.options.icon.options.iconAnchor.y,//Anchor del cercle
				simbol : f.layer.options.icon.options.icon,//tipus glyph
				simbolSize : f.layer.options.icon.options.simbolSize,//mida glyphon
//				puntTMP.options.symbolSize = style.symbolSize;//mida glyphon
				opacity : (f.layer.options.opacity * 100),
				label : false,
				labelSize : 10,
				labelFont : 'arial',
				labelColor : '#000000',
			};
		}else{
			rangs = {
				color : f.layer.options.fillColor,
				simbolSize : f.layer.options.radius,
				opacity : (f.layer.options.fillOpacity * 100),
				label : false,
				labelSize : 10,
				labelFont : 'arial',
				labelColor : '#000000',
				borderWidth : f.layer.options.weight,
				borderColor : f.layer.options.color,
			};
		}
	//ESTIL LINE
	}else if(f.layer.options.tipus == t_polyline){
		rangs = {
			color : f.layer.options.color,
			lineWidth : f.layer.options.weight,
			lineStyle : 'solid',
			borderWidth : 2,
			borderColor : f.layer.options.color,
			opacity : (f.layer.options.opacity * 100),
			label : false,
			labelSize : 10,
			labelFont : 'arial',
			labelColor : '#000000',
		};	
	//ESTIL POLIGON		
	}else{
		var fillColor = f.layer.options.color;
		if(f.layer.options.fillColor) fillColor = rgb2hex(f.layer.options.fillColor);
		
		rangs = {
			color : fillColor,
			fillColor: fillColor,
			fillOpacity: f.layer.options.fillOpacity,
			lineWidth : f.layer.options.dashArray,
			lineStyle : 'solid',
			borderWidth : f.layer.options.dashArray,
			borderColor : f.layer.options.color,
			opacity : (f.layer.options.fillOpacity * 100),
			label : false,
			labelSize : 10,
			labelFont : 'arial',
			labelColor : '#000000'
		};		
	}
	return rangs;
}


function finishAddFeatureToTematic(layer){
	var type = layer.options.tipus;
	
	//Afegir capa edicio a control de capes en cas que sigui nova
	if (capaUsrActiva.toGeoJSON().features.length == 1) {
		//Actualitzem zIndex abans d'afegir al control de capes
		capaUsrActiva.options.zIndex = controlCapes._lastZIndex+1; 								
		controlCapes.addOverlay(capaUsrActiva,	capaUsrActiva.options.nom, true);
		controlCapes._lastZIndex++;
		activaPanelCapes(true);
	}else{
		//Actualitzem comptador de la capa
	    updateFeatureCount(null, capaUsrActiva.options.businessId);		
	}
		
	createPopupWindow(layer,type);
	layer.openPopup();
}

function updateFeatureNameDescr(layer, titol, descr){
	layer.properties.nom=titol;
	layer.properties.text=descr;
	
	if (layer.properties.feature.properties){
		layer.properties.feature.properties.nom = titol;
		layer.properties.feature.properties.text = descr;
	}
		
	var feature = layer.toGeoJSON();
	feature.geometry = layer.properties.feature.geometry;
	if (layer.properties.feature.properties){	
		feature.properties = layer.properties.feature.properties;
	}else{
		feature.properties = layer.properties;
	}
    
	var features = JSON.stringify(feature);
	
    var data = {
		uid : jQuery.cookie('uid'),
		features : features,
		businessId: layer.properties.businessId
	};
    
    updateFeature(data).then(function(results){
    	if(results.status == 'OK'){
			jQuery('#titol_pres').text(titol).append(' <i class="glyphicon glyphicon-pencil blau"></i>');	
			jQuery('#des_pres').text(descr).append(' <i class="glyphicon glyphicon-pencil blau"></i>');
			jQuery('.popup_pres').show();
			jQuery('.popup_edit').hide();    		
    	}else{
    		console.debug("updateFeature ERROR");
    	}
    }, function(results){
    	console.debug("updateFeature ERROR");
    });
}

function updateFeatureMove(featureID, capaEdicioID){
    var layer = map._layers[featureID];
    var feature = layer.toGeoJSON();
    if (layer.properties.feature.properties){	
    	feature.properties = layer.properties.feature.properties;
    }else{
    	feature.properties = layer.properties;
    }
    feature.geometry = layer.properties.feature.geometry;      
        
    if(layer.properties.tipusFeature == t_marker){
        var newLatLng = layer.getLatLng();
        feature.geometry.coordinates[0] = newLatLng.lat;
        feature.geometry.coordinates[1] = newLatLng.lng;           
    }else{
	    var lcoordinates = [];
	    $.each(layer._latlngs, function(i,val) {
	    	lcoordinates.push([val.lat, val.lng]);
	    });              
	    if(layer.properties.tipusFeature == t_polyline){
	    	feature.geometry.coordinates = lcoordinates;
	    }else{
	    	lcoordinates.push(lcoordinates[0]);
	    	feature.geometry.coordinates[0] = lcoordinates;
	    }
    }
    
    var features = JSON.stringify(feature);
    
    var data = {
        uid : jQuery.cookie('uid'),
        features : features,
        businessId: layer.properties.businessId
    };
  
    updateFeature(data).then(function(results){
	    if(results.status == 'OK'){
	    	jQuery('.popup_pres').show();
	    	//jQuery('.popup_edit').hide();            
	    }else{
	        console.debug("updateFeature ERROR");
	    }
	}, function(results){
		  console.debug("updateFeature ERROR");
	});     
  
    //Retornem la geometria a la seva capa original
    capaUsrActiva.addLayer(layer);
    capaUsrActiva.on('layeradd',objecteUserAdded);//Deixem activat event layeradd, per la capa activa
    map._layers[capaEdicioID].removeLayer(layer);
    //Refresh de la capa
    controlCapes._map.removeLayer(capaUsrActiva);
    controlCapes._map.addLayer(capaUsrActiva);    
    map.removeLayer(map._layers[capaEdicioID]);
           
    //Fi edicio
    objEdicio.esticEnEdicio=false;
}

function fillCmbCapesUsr(type){
	var html = "";
	$.each( controlCapes._layers, function(i,val) {
		var layer = val.layer.options;
		if(layer.tipus==t_tematic && layer.geometryType==type && !layer.source){
	        html += "<option value=\"";
	        html += layer.businessId +"#"+val.layer._leaflet_id+"\"";
	        if(capaUsrActiva && (capaUsrActiva.options.businessId == layer.businessId)) html += " selected";
	        html += ">"+ layer.nom + "</option>";            		
		}
	});		
	return html;
}

function createPopUpContent(player,type){
	//console.debug("createPopUpContent");
	var html='<div class="div_popup">' 
	+'<div class="popup_pres">'							
	+'<div id="titol_pres">'+player.properties.nom+' <i class="glyphicon glyphicon-pencil blau"></i></div>'	
	+'<div id="des_pres">'+player.properties.text+' <i class="glyphicon glyphicon-pencil blau"></i></div>';
	
	if(type == t_polyline && player.properties.mida){
		html+='<div id="mida_pres"><b>'+window.lang.convert('Longitud')+':</b> '+player.properties.mida+'</div>';	
	}else if(type == t_polygon && player.properties.mida){
		html+='<div id="mida_pres"><b>'+window.lang.convert('Àrea')+':</b> '+player.properties.mida+'</div>';
	}
	
	//+'<div id="capa_pres">'
	html+='<ul class="bs-ncapa">'
		+'<li><span lang="ca" class="small">Capa actual: </span>'
			+'<select id="cmbCapesUsr-'+player._leaflet_id+'-'+type+'" data-leaflet_id='+player._leaflet_id+'>';
			html+= fillCmbCapesUsr(type);
			html+= '</select></li>'
		//+'<li><a id="layer_edit#'+player._leaflet_id+'#'+type+'" lang="ca" title="Canviar el nom de la capa" href="#"><span class="glyphicon glyphicon-pencil blau12"></span></a></li>'
	+'<li><a id="layer_add#'+player._leaflet_id+'#'+type+'" lang="ca" title="Crear una nova capa" href="#"><span class="glyphicon glyphicon-plus verd12"></span></a></li>'
	+'</ul>'	
	//'</div>'	
	+'<div id="footer_edit"  class="modal-footer">'
	+'<ul class="bs-popup">'						
	+'<li><a id="feature_edit#'+player._leaflet_id+'#'+type+'" lang="ca" href="#">Estils<span class="glyphicon glyphicon-map-marker verd"></span></a>   </li>'
	+'<li><a id="feature_move#'+player._leaflet_id+'#'+type+'" lang="ca" href="#">Editar<span class="glyphicon glyphicon-move magenta"></span></a>   </li>'
	+'<li><a id="feature_remove#'+player._leaflet_id+'#'+type+'" lang="ca" href="#">Esborrar<span class="glyphicon glyphicon-trash vermell"></span></a>   </li>'													
	+'</ul>'														
	+'</div>'
	+'</div>'	
	+'<div class="popup_edit">'
	+'<div style="display:block" id="feature_txt">'
	+'<input class="form-control" id="titol_edit" type="text" value="'+player.properties.nom+'" placeholder="">'
	+'<textarea id="des_edit" class="form-control" rows="2">'+player.properties.text+'</textarea>'							
	+'</div>'	
	+'<div  style="display:block" id="capa_txt">'
	+'<div id="layer_accio"></div>'
	+'<input class="form-control" id="capa_edit" type="text" value="'+player.properties.capaGrup+'" placeholder="">'
	+'</div>'
	+'<div class="modal-footer">'
	+'<ul class="bs-popup">'
	+'<li><a id="feature_no#'+player._leaflet_id+'#'+type+'"  class="btn btn-default btn-xs">Cancel.lar</a></li>'			
	+'<li><a id="feature_ok#'+player._leaflet_id+'#'+type+'"  class="btn btn-success btn-xs">Acceptar</a></li>'								
	+'</ul>'														
	+'</div>'								
	+'</div>'								
	+'</div>';
	return html;
}

function generaNovaCapaUsuari(feature,nomNovaCapa){
	var data = {
        uid: $.cookie('uid'),
        description: jQuery('#des_edit').val(),
        nom: nomNovaCapa,
        geometryType: feature.options.tipus,
        publica: true,
        geomField: 'the_geom',
        idGeomField: 'nom',
        dataField: 'slotd1',
        idDataField: 'slotd1',
        mapBusinessId: url('?businessid')
    };
	//Creem nova capa tematic
	createTematicLayerEmpty(data).then(function(results){
			if(results.status==='OK'){
				
				capaUsrActiva2= new L.FeatureGroup();
				capaUsrActiva2.options = {
					businessId : results.results.businessId,
					nom : nomNovaCapa,
					tipus: t_tematic,
					geometryType : feature.options.tipus
//					zIndex : controlCapes._lastZIndex//+1		
				};
				//Afegim nova capa al combo
				jQuery('#cmbCapesUsr-'+feature._leaflet_id+'-'+feature.options.tipus+'').append("<option selected value=\""+results.results.businessId+"\">"+nomNovaCapa+"</option>");	
				jQuery('.popup_pres').show();
				jQuery('.popup_edit').hide();
				
				map.addLayer(capaUsrActiva2);
				capaUsrActiva2.options.zIndex = controlCapes._lastZIndex+1;
				controlCapes.addOverlay(capaUsrActiva2,	capaUsrActiva2.options.nom, true);
				controlCapes._lastZIndex++;
				activaPanelCapes(true);
//				$(".layers-list").mCustomScrollbar({
//					   advanced:{
//					     autoScrollOnFocus: false,
//					     updateOnContentResize: true
//					   }           
//				});	
				//Accio de moure la feature a la nova capa tematic creada
				var data = {
					uid: $.cookie('uid'),
		            businessId: feature.properties.businessId, //businessId de la feature
		            fromBusinessId: feature.properties.capaBusinessId, //businessId del tematico de origen
		            toBusinessId: capaUsrActiva2.options.businessId //businessId del tematico de destino
			    };
				
				moveFeatureToTematic(data).then(function(results){
						if(results.status=='OK'){
							if(capaUsrActiva) capaUsrActiva.removeLayer(feature);
							capaUsrActiva2.addLayer(feature);//.on('layeradd', objecteUserAdded);
							//feature.openPopup();
							//Actualitzem capa activa
							if(capaUsrActiva) capaUsrActiva.removeEventListener('layeradd');
							capaUsrActiva = capaUsrActiva2;//map._layers[capaUsrActiva2._leaflet_id];;
							capaUsrActiva.on('layeradd',objecteUserAdded);	
							//Actualitzem properties de la layer
							feature.properties.capaBusinessId = capaUsrActiva.options.businessId;
							feature.properties.capaNom = capaUsrActiva.options.nom;	
							feature.properties.capaLeafletId = capaUsrActiva._leaflet_id;
							//Actualitzem popup del marker
//							var html = createPopUpContent(feature,feature.options.tipus);
							//feature.setPopupContent(html);
							map.closePopup();
							feature.openPopup();
							
							//update rangs
						    getRangsFromLayer(capaUsrActiva);
						    
							//Actualitzem comptador de la capa
						    updateFeatureCount(data.fromBusinessId, data.toBusinessId);
						    
						}else{
							console.debug("moveFeatureToTematic ERROR");
						}
					},function(results){
						console.debug("moveFeatureToTematic ERROR");
					});		
			}else{
				console.debug("createTematicLayerEmpty ERROR");
			}
		},function(results){
			console.debug("createTematicLayerEmpty ERROR");
		}
	);
}

function moveFeatureToLayer(feature_businessId,layer_fromBusinessId,layer_toBusinessId){
	var data = {
			uid: $.cookie('uid'),
            businessId: feature_businessId, //businessId de la feature
            fromBusinessId: layer_fromBusinessId, //businessId del tematico de origen
            toBusinessId: layer_toBusinessId //businessId del tematico de destino
        }				
		moveFeatureToTematic(data).then(function(results){
			if(results.status=='OK'){
				capaUsrActiva.removeLayer(feature);
				capaUsrActiva2.addLayer(feature);//.on('layeradd', objecteUserAdded);
				feature.openPopup();
				
				//update rangs
			    getRangsFromLayer(capaUsrActiva);
				
			}else{
				console.debug("moveFeatureToTematic ERROR");
			}
		},function(results){
			console.debug("moveFeatureToTematic ERROR");
		});	
}

function modeLayerTextEdit(){
	jQuery('#capa_txt').show();
	jQuery('#feature_txt').hide();
	jQuery('.popup_pres').hide();
	jQuery('.popup_edit').show();	
}

function modeEditText(){
	objEdicio.edicioPopup='textFeature';
	jQuery('#capa_txt').hide();
	jQuery('#feature_txt').show();
	var txtTitol=jQuery('#titol_pres').text();
	var txtDesc=jQuery('#des_pres').text();
	jQuery('#titol_edit').val(txtTitol);	
	jQuery('#des_edit').val(txtDesc);
	jQuery('.popup_pres').hide();
	jQuery('.popup_edit').show();	
}

/*funcio que actulitza l'estil seleccionat al dialeg d'estils, 
 * amb el de la feature que es col editar 
 * */
function updateDialogStyleSelected(icon){

	if(icon.tipus == t_polyline){
		
		canvas_linia.lineWidth = icon.weight;
		canvas_linia.strokeStyle = icon.color;
		
		$("#cmb_gruix_l option[value='"+icon.weight+"']").prop("selected", "selected");
		$('.border_color_linia').css('background-color',icon.color);
		addGeometryInitL(document.getElementById("cv_linia0"));			
		
	}else if(icon.tipus == t_polygon){
		
		canvas_pol.strokeStyle = icon.color;
		canvas_pol.opacity = icon.fillOpacity;
		canvas_pol.fillStyle = icon.fillColor; //rgb2hex(icon.fillColor);
		canvas_pol.lineWidth = icon.weight;
		
		$('.border_color_pol').css('border-color',icon.color);
		$('.fill_color_pol').css('color',icon.fillColor);
		$('.fill_color_pol').css('background-color',icon.fillColor);
		$("#cmb_gruix option[value='"+icon.weight+"']").prop("selected", "selected");
		$("#cmb_trans option[value='"+icon.fillOpacity+"']").prop("selected", "selected");
		
	    addGeometryInitP(document.getElementById("cv_pol0"));
	    
	}else{//es t_marker
		
		//Deselecciono estil al modal 
		jQuery("#div_puntM").removeClass("estil_selected");
		jQuery("#div_puntZ").removeClass("estil_selected");
		jQuery(".bs-glyphicons li").removeClass("estil_selected");		
		
		if(icon.isCanvas){//Si es un punt
			
			var midaPunt = getMidaFromRadius(icon.radius);
			
			estilP.iconFons = 'awesome-marker-web awesome-marker-icon-punt_r';
			estilP.iconGlif = 'fa fa-'+icon.icon;
			estilP.colorGlif = icon.iconColor;
			estilP.divColor = icon.fillColor;
			estilP.width = midaPunt+'px';
			estilP.height = midaPunt+'px';				
			
			jQuery("#div_puntZ").addClass("estil_selected");
			jQuery("#div_punt9").css("background-color",icon.fillColor);
			$('#cmb_mida_Punt option[value="'+midaPunt+'"]').prop("selected", "selected");
			jQuery("#dv_fill_color_punt").css("background-color",icon.fillColor);
			jQuery("#dv_fill_color_icon").css("background-color",icon.iconColor);
//			
		}else if(icon.markerColor.indexOf("punt_r")!=-1){
			
			var licon = icon.icon.split(" ");
			midaPunt = getMidaFromFont(licon[1]);
			
			estilP.iconFons = 'awesome-marker-web awesome-marker-icon-punt_r';
			estilP.iconGlif = 'fa fa-'+icon.icon;
			estilP.colorGlif =icon.iconColor;
			estilP.fontsize = licon[1];	
			estilP.width = midaPunt+'px';
			estilP.height = midaPunt+'px';
			estilP.divColor = icon.divColor;
			
			jQuery("#div_puntZ").addClass("estil_selected");
			jQuery("#div_punt9").css("background-color",icon.divColor);
			$('#cmb_mida_Punt option[value="'+midaPunt+'"]').prop("selected", "selected");
			
			jQuery("#dv_fill_color_punt").css("background-color",icon.divColor);
			jQuery("#dv_fill_color_icon").css("background-color",icon.iconColor);				
			
			jQuery(".bs-glyphicons li .fa-"+licon[0]).parent('li').addClass("estil_selected");
			jQuery("#dv_fill_color_icon").css("background-color",estilP.colorGlif);	
			jQuery('.bs-glyphicons li').css('color',estilP.colorGlif);
			if(estilP.colorGlif=="#FFFFFF"){
				jQuery('.bs-glyphicons li').css('background-color','#aaaaaa');	
			}else{
				jQuery('.bs-glyphicons li').css('background-color','#FFFFFF');	
			}			
			
			
		}else{//Si es marker
			
			estilP.iconFons = icon.className+'-web awesome-marker-icon-'+icon.markerColor;
			estilP.iconGlif = 'fa fa-'+icon.icon;
			estilP.colorGlif = icon.iconColor;
			estilP.fontsize = '14px';
			estilP.divColor = 'transparent';
			estilP.width = '28px';
			estilP.height = '42px';
			
			jQuery("#div_puntM").addClass("estil_selected");
			jQuery("#dv_fill_color_marker").css("background-color",getColorFromClass(icon.markerColor));
			jQuery('#div_punt_1').removeClass().addClass('awesome-marker-web awesome-marker-icon-'+icon.markerColor);
			
			jQuery(".bs-glyphicons li .fa-"+icon.icon).parent('li').addClass("estil_selected");
			jQuery("#dv_fill_color_icon").css("background-color",estilP.colorGlif);
			jQuery('.bs-glyphicons li').css('color',estilP.colorGlif);
			if(estilP.colorGlif=="#FFFFFF"){
				jQuery('.bs-glyphicons li').css('background-color','#aaaaaa');	
			}else{
				jQuery('.bs-glyphicons li').css('background-color','#FFFFFF');	
			}			
		}
		
		jQuery('#div_punt0').removeClass();
		jQuery('#div_punt0').addClass(estilP.iconFons+" "+estilP.iconGlif);
		jQuery('#div_punt0').css('width',estilP.width);
		jQuery('#div_punt0').css('height',estilP.height);	
		jQuery('#div_punt0').css('font-size',estilP.fontsize);
		jQuery('#div_punt0').css('background-color',estilP.divColor);
		jQuery('#div_punt0').css('color',estilP.colorGlif);			
	}
}

function getColorFromClass(classe){
	switch (classe)
	{
		case 'orange':
		  return '#ffc500';
		case 'darkorangeb':
		  return '#ff7f0b';
		case 'red':
		  return '#ff4b3a';
		case 'purple':
		  return '#ae59b9';	
		case 'blue':
		  return '#00afb5';
		case 'green':
		  return '#7cbd00';
		case 'darkgray':
		  return '#90a6a9';
		case 'gray':
		  return '#ebf0f1';		  
		 default:
			 return '#ffc500';
	} 		
}

function updateFeatureCount(fromBusinessId, toBusinessId){
	
	//Actualitzem comptador de la capa
	if(fromBusinessId){
		var sFromCount = $("#count-"+fromBusinessId).html();
		sFromCount = sFromCount.replace("(", " ");
		sFromCount = sFromCount.replace(")", " ");	
		var fromCount = parseInt(sFromCount.trim());
		fromCount=fromCount-1;
		$("#count-"+fromBusinessId).html(' ('+fromCount+')');		
	}

	if(toBusinessId){
		var sToCount = $("#count-"+toBusinessId).html();
		sToCount = sToCount.replace("(", " ");
		sToCount = sToCount.replace(")", " ");	
		var toCount = parseInt(sToCount.trim());
		toCount=toCount+1;
		$("#count-"+toBusinessId).html(' ('+toCount+')');		
	}
//	console.debug("Fi updateFeatureCount");
}

function addHtmlInterficieDraw(){
	jQuery("#funcio_draw").append(
		'<h5 lang="ca" id="funcio_draw_titol_1">Situar un punt</h5>'+
		'	<div class="add_costat_r" style="margin-right: 33%;">'+
		'	<div lang="ca" id="div_mes_punts" data-toggle="tooltip"	title="Més tipus de punts" class="icon-add taronja"></div>'+
		'</div>'+
		'<div style="height:50px ">'+
		'	<div id="div_punt" lang="ca" data-toggle="tooltip" title="Clica per situar un punt" class="dibuix_punt">'+
		'	</div>'+
		'</div>'+
		'<h5 lang="ca" id="funcio_draw_titol_2">Dibuixar una línia o un polígon</h5>'+
		'<div class="div_auto">'+
		'	<div id="div_linia" lang="ca" data-toggle="tooltip"	title="Clica per començar a dibuixar una línia"	class="dibuix_linia">'+
		'	<canvas id="cv_linia" width="40" height="40"></canvas>'+
		'	</div>'+
		'	<div class="add_costat">'+
		'		<div lang="ca" id="div_mes_linies" data-toggle="tooltip" title="Més estils de línia" class="icon-add taronja"></div>'+
		'	</div>'+
		'</div>'+
		'<div class="div_auto">'+
		'	<div id="div_area" lang="ca" data-toggle="tooltip" title="Clica per començar a dibuixar una àrea" class="dibuix_poligon">'+
		'	<canvas id="cv_pol" width="40" height="40"></canvas>'+
		'	</div>'+
		'	<div class="add_costat">'+
		'		<div lang="ca" id="div_mes_arees" data-toggle="tooltip" title="Més estils d\'àrees"	class="icon-add taronja"></div>'+
		'	</div>'+
		'</div>'
	);
}
