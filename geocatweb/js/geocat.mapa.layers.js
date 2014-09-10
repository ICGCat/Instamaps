//
//function objecteUserAdded(f){
//	
//	var fId = this.toGeoJSON().features.length;
//	
//	var feature = f.layer.toGeoJSON();
//	
//	//Invertim lng,lat perque es recuperi be desde el servidor despres
//    if(f.layer.options.tipus == t_marker){
//          var lng = feature.geometry.coordinates[0]
//          feature.geometry.coordinates[0] = feature.geometry.coordinates[1];
//          feature.geometry.coordinates[1] = lng;         
//    }else if(f.layer.options.tipus==t_polyline){
//          for(var i=0;i<feature.geometry.coordinates.length;i++){
//                var lng = feature.geometry.coordinates[i][0]
//                feature.geometry.coordinates[i][0] = feature.geometry.coordinates[i][1];
//                feature.geometry.coordinates[i][1] = lng;
//          }
//    }else if(f.layer.options.tipus==t_polygon){
//          var lcoordinates = [];
//          $.each( feature.geometry.coordinates[0], function(i,val) {
//                lcoordinates.push([val[1], val[0]]);
//          }); 
//          feature.geometry.coordinates[0] = lcoordinates;                  
//    }       
//
//	feature.properties = {
//		nom : f.layer.properties.nom,
//		text : f.layer.properties.text,
//		slotf1 : 'data 1',
//		slotf2 : 'data 2',
//		slotf3 : 'data 3',
//		slotf4 : 'data 4',
//		slotf5 : 'data 5',
//		slotf6 : 'data 6',
//		slotf7 : 'data 7',
//		slotf8 : 'data 8',
//		slotf9 : 'data 9',
//		slotf10 : 'data 10'
//	};
//
//	var features = JSON.stringify(feature);
//
//	var dades = JSON.stringify({
//		type : 'Dades',
//		id : fId,
//		fields : {
//			slotd1 : "feature" + fId,
//			slotd2 : 'data 2',
//			slotd3 : 'data 3',
//			slotd4 : 'data 4',
//			slotd5 : 'data 5',
//			slotd6 : 'data 6',
//			slotd7 : 'data 7',
//			slotd8 : 'data 8',
//			slotd9 : 'data 9',
//			slotd10 : 'data 10',
//		}
//	});
//
//	var rangs = getFeatureStyle(f,fId);
//	rangs = JSON.stringify(rangs);
//	
//	if (fId == 1) {
//		// Add feature and Layer
//		var data = {
//			uid : jQuery.cookie('uid'),
//			description : 'Description '+f.layer.properties.capaNom,
//			nom : f.layer.properties.capaNom,
//            calentas: false,           
//            activas: true,
//            visibilitats: true,				
//			publica : true,
//			order: controlCapes._lastZIndex+1,
//			geomField : 'the_geom',
//			idGeomField : 'nom',
//			dataField : 'slotd1',
//			idDataField : 'slotd1',
//			features : features,
//			dades : dades,
//			rangs : rangs,
//			tipusRang: tem_origen,
//			mapBusinessId: url('?businessid'),
//			geometryType: f.layer.options.tipus
//		};
//		var _this = this;
//		
//		createTematicLayerFeature(data).then(function(results) {
//				if(results.status === 'OK'){
//					_this.options.businessId = results.results.businessId;
//					f.layer.properties.capaBusinessId = results.results.businessId;
//					f.layer.properties.businessId = results.feature.properties.businessId;
//					f.layer.properties.feature = results.feature;
//					finishAddFeatureToTematic(f.layer);
//				}else{
//					//ERROR: control Error
//					console.debug('addTematicLayerFeature ERROR');
//				}
//			},function(results){
//				console.debug('addTematicLayerFeature ERROR');
//		});
//
//	} else if (this.getLayers().length > 1) {
//	
//		var data = {
//			uid : jQuery.cookie('uid'),
//			features : features,
//			dades : dades,
//			rangs : rangs,
//			businessId: this.options.businessId
//		};				
//				
//		addFeatureToTematic(data).then(function(results) {
//			if(results.status === 'OK'){
//				f.layer.properties.businessId = results.feature.properties.businessId;
//				f.layer.properties.capaBusinessId = results.results.businessId;
//				f.layer.properties.feature = results.feature;
//				finishAddFeatureToTematic(f.layer);					
//			}else{
//				//ERROR: control Error
//				console.debug("addFeatureToTematic ERROR");
//			}
//		},function(results){
//			console.debug("addFeatureToTematic ERROR");
//		});
//	}
//}
//
//function getFeatureStyle(f, fId){
//	var rangs = {};
//	//ESTIL MARKER
//	if(f.layer.options.tipus == t_marker){
//		if (!f.layer._ctx){
//			rangs = {
//				color : f.layer.options.icon.options.fillColor,//Color principal
//				marker: f.layer.options.icon.options.markerColor,//Si es de tipus punt_r o el color del marker
//				simbolColor: f.layer.options.icon.options.iconColor,//Glyphon
//				radius : f.layer.options.icon.options.radius,//Radius
//				iconSize : f.layer.options.icon.options.iconSize.x+"#"+f.layer.options.icon.options.iconSize.y,//Size del cercle
//				iconAnchor : f.layer.options.icon.options.iconAnchor.x+"#"+f.layer.options.icon.options.iconAnchor.y,//Anchor del cercle
//				simbol : f.layer.options.icon.options.icon,//tipus glyph
//				simbolSize : f.layer.options.icon.options.simbolSize,//mida glyphon
////				puntTMP.options.symbolSize = style.symbolSize;//mida glyphon
//				opacity : (f.layer.options.opacity * 100),
//				label : false,
//				labelSize : 10,
//				labelFont : 'arial',
//				labelColor : '#000000',
//			};
//		}else{
//			rangs = {
//				color : f.layer.options.fillColor,
//				simbolSize : f.layer.options.radius,
//				opacity : (f.layer.options.fillOpacity * 100),
//				label : false,
//				labelSize : 10,
//				labelFont : 'arial',
//				labelColor : '#000000',
//				borderWidth : f.layer.options.weight,
//				borderColor : f.layer.options.color,
//			};
//		}
//	//ESTIL LINE
//	}else if(f.layer.options.tipus == t_polyline){
//		rangs = {
//			color : f.layer.options.color,
//			lineWidth : f.layer.options.weight,
//			lineStyle : 'solid',
//			borderWidth : 2,
//			borderColor : f.layer.options.color,
//			opacity : (f.layer.options.opacity * 100),
//			label : false,
//			labelSize : 10,
//			labelFont : 'arial',
//			labelColor : '#000000',
//		};	
//	//ESTIL POLIGON		
//	}else{
//		var fillColor = f.layer.options.color;
//		if(f.layer.options.fillColor) fillColor = rgb2hex(f.layer.options.fillColor);
//		
//		rangs = {
//			color : fillColor,
//			fillColor: fillColor,
//			fillOpacity: f.layer.options.fillOpacity,
//			lineWidth : f.layer.options.dashArray,
//			lineStyle : 'solid',
//			borderWidth : f.layer.options.dashArray,
//			borderColor : f.layer.options.color,
//			opacity : (f.layer.options.fillOpacity * 100),
//			label : false,
//			labelSize : 10,
//			labelFont : 'arial',
//			labelColor : '#000000'
//		};		
//	}
//	return rangs;
//}
