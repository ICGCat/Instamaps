var drawControl;
var featureActive,crt_Editing,crt_Remove;
var defaultPunt;






function addDrawToolbar() {
	capaUsrPunt = new L.FeatureGroup();
	capaUsrPunt.options = {
		businessId : '-1',
		nom : 'capaPunts1',
		tipus : 'Marker'
	};
	capaUsrLine = new L.FeatureGroup({
		businessId : '-1',
		nom : 'capa1',
		tipus : 'Linea'
	});
	capaUsrLine.options = {
		businessId : '-1',
		nom : 'capaLinea1',
		tipus : 'Line'
	};
	capaUsrPol = new L.FeatureGroup({
		businessId : '-1',
		nom : 'capa1',
		tipus : 'Pol'
	});
	capaUsrPol.options = {
		businessId : '-1',
		nom : 'capaPol1',
		tipus : 'Pol'
	};
	map.addLayer(capaUsrPunt);
	map.addLayer(capaUsrLine);
	map.addLayer(capaUsrPol);

	var ptbl = L.Icon.extend({
		options : {
			shadowUrl : null,
			iconAnchor : new L.Point(14, 40),
			iconSize : new L.Point(28, 40)
			
		}
	});
	

	
	defaultPunt= L.AwesomeMarkers.icon({
		icon : '',
		markerColor : 'orange',
		iconAnchor : new L.Point(14, 42),
		iconSize : new L.Point(28, 42),
		iconColor : '#000000',
		prefix : 'fa'
	});

	var options = {
		draw : false,
		polyline : {
			guidelineDistance : 2,
			repeatMode:true,
			shapeOptions : {
				color : '#FFC400',
				weight : 5,
				opacity : 1
			}
		},
		polygon : {
			allowIntersection : true, // Restricts shapes
			repeatMode:true,
			guidelineDistance : 2,
			shapeOptions : {
				color : '#FFC400',
				weight : 5,
				opacity : 0.7
			}
		},
		 
		marker:{repeatMode:true,
			icon:L.icon({iconUrl:'/geocatweb/css/images/blank.gif'})
		},
		
		edit : false
	};

	drawControl = new L.Control.Draw(options);
	map.addControl(drawControl);
	
	
	

}




function showEditText(accio){
	
	jQuery('.search-edit').animate({
		height :accio
	});
	
}

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

	map.on('draw:created',
					function(e) {
						var type = e.layerType, layer = e.layer;
						// console.info(e);
						// if (type === 'marker') {
						
						// }
						if (type === 'marker') {

							
							 layer=L.marker([layer.getLatLng().lat,layer.getLatLng().lng],
							 {icon: defaultPunt}).addTo(map);
							 layer.bindPopup('TODO: Esborra Editar ');
							capaUsrPunt.addLayer(layer).on('layeradd',
									objecteUserAdded);
							
							crt_Editing=new L.EditToolbar.Edit(map, {
						        featureGroup: capaUsrPunt,
						        selectedPathOptions: drawControl.options.edit.selectedPathOptions
						    });
							crt_Remove=new L.EditToolbar.Delete(map, {
						        featureGroup: capaUsrPunt
						    });
							
							
							
						} else if (type === 'polyline') {
							layer.bindPopup('TODO: Esborra Editar ');
							capaUsrLine.addLayer(layer).on('layeradd',
									objecteUserAdded);
							
							
							crt_Editing=new L.EditToolbar.Edit(map, {
						        featureGroup: capaUsrLine,
						        selectedPathOptions: drawControl.options.edit.selectedPathOptions
						    });
							crt_Remove=new L.EditToolbar.Delete(map, {
						        featureGroup: capaUsrLine
						    });
							
							
							
						} else if (type === 'polygon') {
							layer.bindPopup('TODO: Esborra Editar ');
							capaUsrPol.addLayer(layer).on('layeradd',
									objecteUserAdded);
							
							

							crt_Editing=new L.EditToolbar.Edit(map, {
						        featureGroup: capaUsrPol,
						        selectedPathOptions: drawControl.options.edit.selectedPathOptions
						    });
							crt_Remove=new L.EditToolbar.Delete(map, {
						        featureGroup: capaUsrPol
						    });
							
							
						}

						if (capaUsrPunt.toGeoJSON().features.length == 1) {
							controlCapes.addOverlay(capaUsrPunt,
									capaUsrPunt.options.nom, true);
							
							activaPanelCapes(true);
						}
						if (capaUsrLine.toGeoJSON().features.length == 1) {
							controlCapes.addOverlay(capaUsrLine,
									capaUsrLine.options.nom, true);
							//showEditText(layer);
							activaPanelCapes(true);
						}
						if (capaUsrPol.toGeoJSON().features.length == 1) {
							controlCapes.addOverlay(capaUsrPol,
									capaUsrPol.options.nom, true);
							//showEditText(layer);
							activaPanelCapes(true);
						}
						
						
						showEditText('show');
						
						
					});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
