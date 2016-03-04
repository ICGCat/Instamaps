/**
 * Gestio del temàtic de tipus Categories 
 */

function showModalTematicCategories(data){
	//console.debug("showModalTematicCategories");
	jQuery('.modal').modal('hide');
	jQuery('#dialog_tematic_rangs').modal('show');
	
	//se ponen los off para evitar el doble evento
	//TODO hay que revisar como evitar el doble evento.
	jQuery('#dialog_tematic_rangs .btn-success').off('click');
	jQuery('#dialog_tematic_rangs .btn-success').on('click',function(e){
		jQuery('#dialog_tematic_rangs').hide();
		jQuery('#info_uploadFile').show();
		busy=true;
		jQuery("#div_uploading_txt").html("");
		jQuery("#div_uploading_txt").html(
			'<div id="div_upload_step1" class="status_current" lang="ca">1. '+window.lang.convert('Creant categories')+'<span class="one">.</span><span class="two">.</span><span class="three">.</div>'+
			'<div id="div_upload_step2" class="status_uncheck" lang="ca">2. '+window.lang.convert('Processant la resposta')+'</div>'
		);	
		createTematicLayerCategories(e);
	});	
	
	jQuery('#palet_warning').hide();
	
	jQuery(".ramp").off('click');
	jQuery(".ramp").on('click',function(evt){
		var _this = jQuery(this);
		var brewerClass = _this.attr('class').replace("ramp ","");
		jQuery("#dialog_tematic_rangs").data("paleta", brewerClass);
		if (jQuery('#list_tematic_values').html() !== ""){
			updatePaletaRangs();
		}
	});
	
	jQuery("#dialog_tematic_rangs").data("capamare", data);
	
	jQuery('#tipus_agrupacio_grp').hide();
	jQuery('#num_rangs_grp').hide();
	jQuery('#list_tematic_values').html("");
	jQuery('#dialog_tematic_rangs .btn-success').hide();
	
	jQuery('.btn-reverse-palete').off('click');
	jQuery('.btn-reverse-palete').on('click',function(evt){
		var glyp = jQuery('.btn-reverse-palete.glyphicon');
		var reverse = false;
		if(glyp.hasClass('glyphicon-arrow-down')){
			reverse = true;
			glyp.removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up');
		}else{
			reverse = false;
			glyp.removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down');
		}
		jQuery("#dialog_tematic_rangs").data("reverse",reverse);
		if (jQuery('#list_tematic_values').html() !== ""){
			updatePaletaRangs();
		}
	});
	
	var dataTem={
		businessId: data.businessid,
		uid: jQuery.cookie('uid')
	};
	
	if(data.tipus == t_url_file){
		var urlFileLayer = controlCapes._layers[data.leafletid].layer;
		jQuery("#dialog_tematic_rangs").data("visualitzacio", urlFileLayer.options);
		var fields = {};
		fields[window.lang.convert('Escull el camp')] = '---';
		//Recollim propName de les geometries de la capa
		var dataNames = urlFileLayer.options.propName.split(',');
		jQuery.each(dataNames, function( index, value ) {
			fields[value] = value;
		});
		
		//creamos el select con los campos
		var source1 = jQuery("#tematic-layers-fields").html();
		var template1 = Handlebars.compile(source1);
		var html1 = template1({fields:fields});
		jQuery('#dataField').html(html1);
		
		jQuery('#dataField').off('change');
		jQuery('#dataField').on('change',function(e){
			var this_ = jQuery(this);
			if (this_.val() == "---"){
				jQuery('#tipus_agrupacio_grp').hide();
				jQuery('#num_rangs_grp').hide();
				jQuery('#list_tematic_values').html("");
				jQuery('#dialog_tematic_rangs .btn-success').hide();
			}else{				
				readDataUrlFileLayer(urlFileLayer, this_.val()).then(function(results){
					jQuery("#dialog_tematic_rangs").data("values", results);
					getTipusValuesVisualitzacio(results);
				});			
			}
		});			
		
	}else{//Si es una visualitzacio
		getVisualitzacioByBusinessId(dataTem).then(function(results){
			if (results.status == "OK"){
				var visualitzacio = results.results;
				jQuery("#dialog_tematic_rangs").data("visualitzacio", visualitzacio);
				var fields = {};
				fields[window.lang.convert('Escull el camp')] = '---';
				var dataNames = [];
				if (visualitzacio.options){
					//var options = JSON.parse(visualitzacio.options);
					var options;
					if(typeof (visualitzacio.options)=="string"){
						try {
							options = JSON.parse(visualitzacio.options);
						}
						catch (err) {
							options = visualitzacio.options;	
						}
						
					}else{
						
						options = visualitzacio.options;	
					}
					
					if(options.propName){
						dataNames = options.propName.split(',');
						jQuery.each(dataNames, function( index, value ) {
							fields[value] = value;
						});
					}else{
						if (results.geometries && results.geometries.options){
							dataNames = results.geometries.options.split(',');
							jQuery.each(dataNames, function( index, value ) {
								fields[value] = value;
							});
						}
					}
				}else{
					if (results.geometries && results.geometries.options){
						dataNames = results.geometries.options.split(',');
						jQuery.each(dataNames, function( index, value ) {
							fields[value] = value;
						});
					}
				}
				
				//creamos el select con los campos
				var source1 = jQuery("#tematic-layers-fields").html();
				var template1 = Handlebars.compile(source1);
				var html1 = template1({fields:fields});
				jQuery('#dataField').html(html1);
				
				jQuery('#dataField').off('change');
				jQuery('#dataField').on('change',function(e){
					var this_ = jQuery(this);
					if (this_.val() == "---"){
						jQuery('#tipus_agrupacio_grp').hide();
						jQuery('#num_rangs_grp').hide();
						jQuery('#list_tematic_values').html("");
						jQuery('#dialog_tematic_rangs .btn-success').hide();
					}else{
						readDataVisualitzacio(visualitzacio, this_.val()).then(function(results){
							jQuery("#dialog_tematic_rangs").data("values", results);
							getTipusValuesVisualitzacio(results);
						});

					}
				});				
			}else{
				//TODO error
				console.debug("getVisualitzacioByBusinessId ERROR");				
			}
		},function(results){
			//TODO error
			console.debug("getVisualitzacioByBusinessId ERROR");
		});	
	}
				
}

function getTipusValuesVisualitzacio(results){
	//console.debug("getTipusValuesVisualitzacio");
	if (results.length === 0){
		var warninMSG="<div class='alert alert-danger'><strong>"+window.lang.convert('Aquest camp no te valors')+"<strong>  <span class='fa fa-warning sign'></span></div>";
		jQuery('#list_tematic_values').html(warninMSG);
		jQuery('#dialog_tematic_rangs .btn-success').hide();
	}else{
		var nodata = [];
		var arr = jQuery.grep(results, function( n, i ) {
			var isText = false;
			if (!jQuery.isNumeric(n)){
				if (n == "Sense valor" || n == "Sin valor" || n == "Empty value" || n == NODATA_VALUE){
					nodata.push(n);
				}else{
					isText = true;
				}
			}
			return isText;
		});
		if (nodata.length !== 0){
			jQuery("#dialog_tematic_rangs").data("nodata",true);
		}
		if (arr.length === 0){ //rangos
			jQuery('#tipus_agrupacio_grp').show();
			jQuery('#num_rangs_grp').show();
			jQuery('#list_tematic_values').html("");
			
			jQuery( "input:radio[name=rd_tipus_agrupacio]").on('change',function(e){
				var this_ = jQuery(this);
				if (this_.val() == "U"){
					jQuery('#num_rangs_grp').hide();
					showVisualitzacioDataUnic(results).then(function(results1){
						loadTematicValueTemplate(results1,'unic');
					});
				}else{
					jQuery('#list_tematic_values').html("");
					jQuery('#dialog_tematic_rangs .btn-success').hide();
					jQuery('#num_rangs_grp').show();
					jQuery('#cmb_num_rangs').val("---");
					jQuery('#list_tematic_values').html("");
					jQuery('#dialog_tematic_rangs .btn-success').hide();
				}
			});
			
			jQuery('#cmb_num_rangs').on('change',function(e){
				var this_ = jQuery(this);
				if (this_.val() == "---"){
					jQuery('#list_tematic_values').html("");
					jQuery('#dialog_tematic_rangs .btn-success').hide();
				}else{
					createRangsValues(this_.val());
				}
			});
			
			jQuery('#rd_tipus_rang').click().change();		
		}else{ //unicos
			jQuery('#tipus_agrupacio_grp').hide();
			jQuery('#num_rangs_grp').hide();
			showVisualitzacioDataUnic(results).then(function(results1){
				loadTematicValueTemplate(results1,'unic');
			});
		}
	}
}

function showVisualitzacioDataUnic(values){
	//console.debug("showVisualitzacioDataUnic");
	var defer = jQuery.Deferred();
	var visualitzacio = jQuery("#dialog_tematic_rangs").data("visualitzacio");
	var paleta = jQuery("#dialog_tematic_rangs").data("paleta");
	var reverse = jQuery("#dialog_tematic_rangs").data("reverse");
	jQuery("#dialog_tematic_rangs").data("tipusrang","unic");
	
	//Ordenar valores
	values.sort(sortByValueMax);
	paleta = paleta ? paleta : 'Paired';
	var scale = createScale(paleta, values.length, reverse);
	var ftype = transformTipusGeometry(visualitzacio.geometryType);
	var valuesStyle = jQuery.map( values, function( a, i) {
		return {v: a, style: createIntervalStyle(i,ftype,scale), index: i};
	});
	
	defer.resolve(valuesStyle);
	return defer.promise();
}

function createIntervalStyle(index, geometryType, paleta, nodata){
	//console.debug("createIntervalStyle");
	var defStyle;
		
	var ftype = transformTipusGeometry(geometryType);
		
	if (ftype == t_marker){
		defStyle = jQuery.extend({}, default_circulo_style);
		defStyle.fillColor = paleta(index).hex();
		if(nodata){
			defStyle.fillColor = NODATA_COLOR;
		}
		defStyle.isCanvas = true;		
	}else if (ftype == t_polyline){
		defStyle = jQuery.extend({}, default_line_style);
		defStyle.color = paleta(index).hex();
		if(nodata){
			defStyle.color = NODATA_COLOR;
		}
	}else if (ftype == t_polygon){
		defStyle = jQuery.extend({}, default_area_style);
		defStyle.color = paleta(index).hex();
		if(nodata){
			defStyle.color = NODATA_COLOR;
		}
	}
	defStyle.geometryType = ftype;
	return defStyle;
}

function showTematicRangs(){
	//TODO cambiar nombre a la funcion
	//console.debug("showTematicRangs");
	var values = jQuery("#dialog_tematic_rangs").data("rangs");
	var visualitzacio = jQuery("#dialog_tematic_rangs").data("visualitzacio");
	var paleta = jQuery("#dialog_tematic_rangs").data("paleta");
	var reverse = jQuery("#dialog_tematic_rangs").data("reverse");
	jQuery("#dialog_tematic_rangs").data("tipusrang","rangs");
	paleta = paleta ? paleta : 'Paired';
	var scale = createScale(paleta, values.length, reverse);
			
	var defer = jQuery.Deferred();
	var valuesStyle = [];
	var ftype = transformTipusGeometry(visualitzacio.geometryType);
	valuesStyle = jQuery.map( values, function( a, i ) {
		if (a.nodata){
			return {v: a, style: createIntervalStyle(i,ftype,scale,true), index: i};
		}else{
			return {v: a, style: createIntervalStyle(i,ftype,scale,false), index: i};
		}
	});
	defer.resolve(valuesStyle);
	return defer.promise();
}

function div2RangStyle(tematic, tdElem){
	//console.debug("div2RangStyle");
	var rangStyle;
	
	var ftype = transformTipusGeometry(tematic.geometrytype);
	var divElement;	
	if (ftype == t_marker){
		divElement = tdElem.find('div');
		rangStyle = {
			borderColor :  "#ffffff",
			borderWidth :  2,
			simbolSize: parseInt(parseInt(divElement.css('height'))/2.4),
			color: jQuery.Color(divElement.css('background-color')).toHexString(),
			opacity: 90
		};
	}else if (ftype == t_polyline){
		divElement = tdElem.find('canvas')[0].getContext("2d");
		rangStyle = {
			lineWidth :  divElement.lineWidth,
			color: divElement.strokeStyle,
		};
	}else if (ftype == t_polygon){
		divElement = tdElem.find('canvas')[0].getContext("2d");
		rangStyle = {
			borderColor :  divElement.strokeStyle,
			borderWidth :  divElement.lineWidth,
			color: jQuery.Color(divElement.fillStyle).toHexString(),
			opacity: Math.round(jQuery.Color(divElement.fillStyle).alpha()*100)
		};
	}
	return rangStyle;
}

function createTematicLayerCategories(event){
//	console.debug("createTematicLayerCategories"); //al guardar
	_gaq.push(['_trackEvent', 'mapa', tipus_user+'estils', 'categories', 1]);
	
	var tematic = jQuery("#dialog_tematic_rangs").data("tematic");
	var visualitzacio = jQuery("#dialog_tematic_rangs").data("visualitzacio");
//	console.debug(visualitzacio);
	var tematicFrom = jQuery("#dialog_tematic_rangs").data("capamare");
	var capaMare = controlCapes._layers[tematicFrom.leafletid].layer;
	var rangsTr = jQuery('#list_tematic_values tbody tr');
		
	var rangs = [];
	jQuery.each(rangsTr, function( index, value ) {
		var _this = jQuery(value);
		var tdRang, tdMin, tdMax;
		var tdVal;
		var rang = {};
		var rangEstil;
		if (_this.children().length == 2){
			tdRang = _this.find('td:eq(0)');
			tdVal = _this.find('td:eq(1)');
			rangEstil = div2RangStyle(tematicFrom, tdVal);
			rang.estil = rangEstil;
			rang.valueMax = tdRang.text();
			rang.valueMin = tdRang.text();
			rangs.push(rang);
		}else{
			tdMin = _this.find('td:eq(0)');
			tdMax = _this.find('td:eq(1)');
			tdVal = _this.find('td:eq(2)');
			rangEstil = div2RangStyle(tematicFrom, tdVal);
			rang.estil = rangEstil; 
			rang.valueMin = tdMin.find('input').val();
			rang.valueMax = tdMax.find('input').val();
			rangs.push(rang);
		}
	});	
	
	var estils = {
		estils: rangs,
		dataField: jQuery('#dataField').val().toLowerCase(),
		labelField: jQuery('#dataField').val().toLowerCase()
	};
	var data1 = {};
	if(visualitzacio.tipus == t_url_file){
		data1 = {
			uid: $.cookie('uid'),
			businessId1: capaMare.options.businessId
		};
		crearFitxerPolling(data1).then(function(results) {
			var tmpFile="";
			if (results.status=="OK"){
				tmpFile = results.tmpFilePath;
				//Definim interval de polling en funcio de la mida del fitxer
				var pollTime =3000;
				//Fem polling
				(function(){							
					pollBuffer = function(){
						$.ajax({
							url: paramUrl.polling +"pollingFileName="+ results.tmpFileName,
							dataType: 'json',
							type: 'get',
							success: function(data){
								//console.debug(data);
								jQuery('#dialog_tematic_rangs').hide();
								jQuery('#info_uploadFile').show();
								if(data.status.indexOf("PAS 1")!=-1 && busy){
									
									jQuery("#div_uploading_txt").html("");
									jQuery("#div_uploading_txt").html(
											'<div id="div_upload_step1" class="status_current" lang="ca">1. '+window.lang.convert('Creant categories')+'<span class="one">.</span><span class="two">.</span><span class="three">.</div>'+
											'<div id="div_upload_step2" class="status_uncheck" lang="ca">2. '+window.lang.convert('Processant la resposta')+'</div>'	
									);									
									
								}else if((data.status.indexOf("PAS 2") || data.status.indexOf("PAS 3"))!=-1 && busy){
									jQuery("#div_uploading_txt").html(
											'<div id="div_upload_step1" class="status_check" lang="ca">1. '+window.lang.convert('Categories creades')+'<span class="one">.</span><span class="two">.</span><span class="three">.</div>'+
											'<div id="div_upload_step2" class="status_current" lang="ca">2. '+window.lang.convert('Processant la resposta')+'</div>'	
									);										
								}else if(data.status.indexOf("OK")!=-1 && busy){
									clearInterval(pollInterval);
									
									jQuery("#div_uploading_txt").html("");
									jQuery("#div_uploading_txt").html(
											'<div id="div_upload_step1" class="status_check" lang="ca">1. '+window.lang.convert('Categories creades')+' <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div>'+
											'<div id="div_upload_step2" class="status_check" lang="ca">2. '+window.lang.convert('Processant la resposta')+' <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div>'
									);									
									
									loadURLfileLayer(data.results).then(function(results){
										activaPanelCapes(true);
									});
									busy=false;					
									jQuery('#info_uploadFile').hide();
									
								}else if(data.status.indexOf("ERROR")!=-1 && busy){
									console.error("Error calculant l'operació");
									console.error(data);
									busy = false;
									
									clearInterval(pollInterval);
									jQuery('#info_uploadFile').hide();
									
									$('#dialog_error_upload_txt').html("");
									
									$('#dialog_error_upload_txt').html(window.lang.convert("Error calculant l'operació"));										
									
									$('#dialog_error_upload').modal('show');
								}
								else if (!busy){
									clearInterval(pollInterval);
									jQuery('#info_uploadFile').hide();
								}
							}
						});
					};
					
					pollInterval = setInterval(function(){
						pollBuffer();
					},pollTime);
					
				})();
				
				var options = {
						url: capaMare.options.url,
						tem: tem_clasic,
						style: estils,
						origen: capaMare.options.businessId,
						tipus : t_url_file,
						tipusFile: capaMare.options.tipusFile,
						tipusAcc: capaMare.options.tipusAcc,
						tipusCodi: capaMare.options.tipusCodi,
						tipusFont: capaMare.options.tipusFont,
						nomCampCodi: capaMare.options.nomCampCodi,
						estil_do: estils,
						epsgIN: capaMare.options.epsgIN,
						geometryType: capaMare.options.geometryType,
						colX: capaMare.options.colX,
						colY: capaMare.options.colY,
						dinamic: capaMare.options.dinamic
					};
			
					var data = {
						uid:$.cookie('uid'),
						mapBusinessId: url('?businessid'),
						serverName: capaMare.options.nom+" "+window.lang.convert("Categories"),
						serverType: capaMare.options.tipus,
						calentas: false,
				        activas: true,
				        visibilitats: true,
				        order: capesOrdre_sublayer,				
				        epsg: capaMare.options.epsgIN,
				        transparency: true,
				        opacity: 1,
				        visibilitat: 'O',
				        url: capaMare.options.url,
						options: JSON.stringify(options),
						tmpFilePath: tmpFile,
						tipusTematic:"t_url_file",
						urlTematic:paramUrl.createServidorInMap  
					};
					
					callActions(data);
					/*createServidorInMap(data);/*.then(function(results){
						busy=false;					
						jQuery('#info_uploadFile').hide();
						loadURLfileLayer(results.results).then(function(results){
							
							activaPanelCapes(true);
						});
					});*/
			}
			else {
				jQuery('#info_uploadFile').hide();		
				busy=false;
			}
					
		 });
	}else{
		data1 = {
			uid: $.cookie('uid'),
			businessId1: capaMare.options.businessId
		};
		crearFitxerPolling(data1).then(function(results) {
			var tmpFile="";
			if (results.status=="OK"){
				tmpFile = results.tmpFilePath;
				//Definim interval de polling en funcio de la mida del fitxer
				var pollTime =3000;
				//Fem polling
				(function(){							
					pollBuffer = function(){
						$.ajax({
							url: paramUrl.polling +"pollingFileName="+ results.tmpFileName,
							dataType: 'json',
							type: 'get',
							success: function(data){
								//console.debug(data);
								jQuery('#dialog_tematic_rangs').hide();
								jQuery('#info_uploadFile').show();
								if(data.status.indexOf("PAS 1")!=-1 && busy){
									
									jQuery("#div_uploading_txt").html("");
									jQuery("#div_uploading_txt").html(
											'<div id="div_upload_step1" class="status_current" lang="ca">1. '+window.lang.convert('Creant categories')+'<span class="one">.</span><span class="two">.</span><span class="three">.</div>'+
											'<div id="div_upload_step2" class="status_uncheck" lang="ca">2. '+window.lang.convert('Processant la resposta')+'</div>'	
									);									
									
								}else if((data.status.indexOf("PAS 2")!=-1 || data.status.indexOf("PAS 3")!=-1) && busy){
									jQuery("#div_uploading_txt").html(
											'<div id="div_upload_step1" class="status_check" lang="ca">1. '+window.lang.convert('Categories creades')+'<span class="one">.</span><span class="two">.</span><span class="three">.</div>'+
											'<div id="div_upload_step2" class="status_current" lang="ca">2. '+window.lang.convert('Processant la resposta')+'</div>'	
									);										
								}else if(data.status.indexOf("OK")!=-1 && busy){
									clearInterval(pollInterval);
									
									jQuery("#div_uploading_txt").html("");
									jQuery("#div_uploading_txt").html(
											'<div id="div_upload_step1" class="status_check" lang="ca">1. '+window.lang.convert('Categories creades')+' <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div>'+
											'<div id="div_upload_step2" class="status_check" lang="ca">2. '+window.lang.convert('Processant la resposta')+' <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div>'
									);									
									var defer = $.Deferred();
									readVisualitzacio(defer, data.visualitzacio, data.layer).then(function(results){
										activaPanelCapes(true);
									});
									jQuery('#info_uploadFile').hide();		
									busy=false;
								}else if(data.status.indexOf("ERROR")!=-1 && busy){
									console.error("Error calculant l'operació");
									console.error(data);
									busy = false;
									
									clearInterval(pollInterval);
									jQuery('#info_uploadFile').hide();
									
									$('#dialog_error_upload_txt').html("");
									
									$('#dialog_error_upload_txt').html(window.lang.convert("Error calculant l'operació"));										
									
									$('#dialog_error_upload').modal('show');
								}
								else if (!busy){
									clearInterval(pollInterval);
									jQuery('#info_uploadFile').hide();
								}
							}
						});
					};
					
					pollInterval = setInterval(function(){
						pollBuffer();
					},pollTime);
					
				})();
				var options = {
						url: capaMare.options.url,
						tem: tem_clasic,
						style: estils,
						origen: capaMare.options.businessId,
						tipus : t_url_file,
						tipusFile: capaMare.options.tipusFile,
						estil_do: estils,
						epsgIN: capaMare.options.epsgIN,
						geometryType: capaMare.options.geometryType,
						colX: capaMare.options.colX,
						colY: capaMare.options.colY,
						dinamic: capaMare.options.dinamic
				};

				var data = {
						businessId: tematicFrom.businessid,//businessId id de la visualización de origen
						uid: $.cookie('uid'),//uid id de usuario
				        mapBusinessId: url('?businessid'),//mapBusinessId id del mapa donde se agrega la visualización	           
				        nom: capaMare.options.nom+" "+window.lang.convert("Categories"),
				        activas: true,
				        order: capesOrdre_sublayer,//order (optional) orden de la capa en el mapa
				        dataField: jQuery('#dataField').val(),//¿?¿?¿?¿?
						tem: tem_clasic,//visualitzacio.from,//tem_simple
						estils: JSON.stringify(estils),
						tmpFilePath: tmpFile,
						tipusTematic:"t_visualitzacio_categories",
						urlTematic:paramUrl.createVisualitzacioTematica  
					};
					
					callActions(data);
			}
			else {
				jQuery('#info_uploadFile').hide();		
				busy=false;
			}
		
			
			
			/*createVisualitzacioTematica(data);/*.then(function(results){
				jQuery('#info_uploadFile').hide();		
				busy=false;
				if(results.status == 'OK'){
					var defer = $.Deferred();
					readVisualitzacio(defer, results.visualitzacio, results.layer).then(function(results){
						activaPanelCapes(true);
					});				
				}
			});		*/
		});				
	}
	
	event.preventDefault();
	event.stopImmediatePropagation();
	
}

function updatePaletaRangs(){
	//console.debug("updatePaletaRangs");
	var paleta = jQuery("#dialog_tematic_rangs").data("paleta");
	var tematicFrom = jQuery("#dialog_tematic_rangs").data("capamare");
	
	var values = jQuery("#dialog_tematic_rangs").data("values");
	var rangs = jQuery("#dialog_tematic_rangs").data("rangs");
	
	var tipusrang = jQuery("#dialog_tematic_rangs").data("tipusrang");
	var reverse = jQuery("#dialog_tematic_rangs").data("reverse");
	
	var val_leng = 0;
	if (tipusrang == 'rangs'){
		val_leng = rangs.length;
	}else{
		val_leng = values.length;
	}
	
	var ftype = transformTipusGeometry(tematicFrom.geometrytype);
	paleta = paleta ? paleta : 'Paired';
	var scale = createScale(paleta, val_leng, reverse);
		
	if (ftype == t_marker){
		jQuery('#list_tematic_values tbody td div').each(function(i, elm){
			var color = scale(i).hex();
			jQuery(elm).css('background-color', color);
		});
	}else if (ftype == t_polyline){
		jQuery('#list_tematic_values canvas').each(function(i, elm){
			var color = scale(i).hex();
			addGeometryInitLRang(elm, {style:{color: color}});
		});
	}else if (ftype == t_polygon){
		jQuery('#list_tematic_values canvas').each(function(i, elm){
			var color = scale(i).hex();
			addGeometryInitPRang(elm, {style:{color: color}});
		});
	}
}

function createRangsValues(rangs){
	//console.debug("createRangsValues");
	var values = jQuery("#dialog_tematic_rangs").data("values");
	var tematic = jQuery("#dialog_tematic_rangs").data("tematic");
	var visualitzacio = jQuery("#dialog_tematic_rangs").data("visualitzacio");
	var nodata = jQuery("#dialog_tematic_rangs").data("nodata");
	var reverse = jQuery("#dialog_tematic_rangs").data("reverse");
		
	values = jQuery.grep(values, function( n, i ) {
		return (n != NODATA_VALUE && jQuery.isNumeric(parseFloat(n)));
	});
	values.sort(function(a,b){return a-b;});
	
	var min = parseFloat(values[0]);
	var max = parseFloat(values[values.length-1]);
	var deltaR = (max - min)/rangs;
	deltaR = parseFloat(deltaR.toFixed(2));
	var newRangs = [];
	var i = 0;
	while (min < max && i < rangs){
		if (i == (rangs-1)){
			newRangs.push({min: min, max: max});
		}else{
			var tmpmax = parseFloat((min+deltaR).toFixed(2));
			newRangs.push({min: min, max: tmpmax});
			min = tmpmax;
		}
		i++;
	}
	if (nodata){
		newRangs.push({min: NODATA_VALUE, max: NODATA_VALUE, nodata:true});
	}
	
	jQuery("#dialog_tematic_rangs").data("rangs", newRangs);
	showTematicRangs().then(function(results){
		loadTematicValueTemplate(results,'rangs');
	});
}

function loadTematicValueTemplate(results, rtype){

	var source1;
	var geometryType = results[0].style.geometryType;
	if (!geometryType){
		geometryType = results[0].style.tipus;
	}
	var ftype = transformTipusGeometry(geometryType);
	if (ftype == t_marker){
		if (rtype == 'rangs'){
			source1 = jQuery("#tematic-values-rangs-punt-template").html();
		}else{
			source1 = jQuery("#tematic-values-unic-punt-template").html();
		}
		
	}else if (ftype == t_polyline){
		if (rtype == 'rangs'){
			source1 = jQuery("#tematic-values-rangs-polyline-template").html();
		}else{
			source1 = jQuery("#tematic-values-unic-polyline-template").html();
		}
		
	}else if (ftype == t_polygon){
		if (rtype == 'rangs'){
			source1 = jQuery("#tematic-values-rangs-polygon-template").html();
		}else{
			source1 = jQuery("#tematic-values-unic-polygon-template").html();
		}
	}
	
	//match ints and floats/decimals
	var floatRegex = new RegExp('[-+]?([0-9]*.[0-9]+|[0-9]+)');
	var resultsFloat = [];
	var i=0;
	jQuery.grep(results, function( n, i ) {
		if (floatRegex.test(n.v)) {
			resultsFloat[i]=n;
			i++;
		}
			
	});
	
	
	
	var template1 = Handlebars.compile(source1);
	var html1 = "";
	if (resultsFloat.length>0) {
		resultsFloat.sort(function(a,b){return a.v-b.v;});
		html1 = template1({values:resultsFloat});
	}
	else {
		results.sort();
		html1 = template1({values:results});
	}
	
	
	
	jQuery('#list_tematic_values').html(html1);
	jQuery('#dialog_tematic_rangs .btn-success').show();
	if (ftype == t_marker){
		jQuery('#list_tematic_values div.awesome-marker-web').on('click',function(e){
			var _this = this;
			var _$this = $(this);
			
			$("#temp_color_pallete").remove();
			
			_$this.after('<div id="temp_color_pallete" class="dropdown-menu"></div>');
			
			$("#temp_color_pallete").css({'top':_$this.position().top,'left':_$this.position().left+25}).colorPalette().on('selectColor', function(e) {
				_$this.css('background-color',e.color);
				$("#temp_color_pallete").remove();
			});
		});
		
	}else if (ftype == t_polyline){
		jQuery('#list_tematic_values canvas').each(function(i, val){
			addGeometryInitLRang(val, results[i]);
		});
		
		jQuery('#list_tematic_values canvas').on('click',function(e){
			var _this = this;
			var _$this = $(this);
			
			$("#temp_color_pallete").remove();
			
			_$this.after('<div id="temp_color_pallete" class="dropdown-menu"></div>');
			
			$("#temp_color_pallete").css({'top':_$this.position().top,'left':_$this.position().left+25}).colorPalette().on('selectColor', function(e) {
				var canvas = _this;
				var style = {style:{}};
				style.style.color = e.color;
				addGeometryInitLRang(canvas, style);
				$("#temp_color_pallete").remove();
			});
			
		});
		
	}else if (ftype == t_polygon){
		jQuery('#list_tematic_values canvas').each(function(i, val){
			addGeometryInitPRang(val, results[i]);
		});
		
		jQuery('#list_tematic_values canvas').on('click',function(e){
			var _this = this;
			var _$this = $(this);
			
			$("#temp_color_pallete").remove();
			
			_$this.after('<div id="temp_color_pallete" class="dropdown-menu"></div>');
			
			$("#temp_color_pallete").css({'top':_$this.position().top,'left':_$this.position().left+25}).colorPalette().on('selectColor', function(e) {
				var canvas = _this;
				var style = {style:{}};
				style.style.color = e.color;
				addGeometryInitPRang(canvas, style);
				$("#temp_color_pallete").remove();
			});
			
		});
	}
}

function addGeometryInitLRang(canvas, style){
	var	cv_ctx_l=canvas.getContext("2d");
	var scale = 0.7;
	
	cv_ctx_l.clearRect(0, 0, canvas.width, canvas.height);
		
	cv_ctx_l.shadowColor = '#999';
	cv_ctx_l.shadowBlur = 4;
	cv_ctx_l.shadowOffsetX = 2;
	cv_ctx_l.shadowOffsetY = 2;
	
	cv_ctx_l.moveTo(0.7*scale,39.42*scale);
	cv_ctx_l.lineTo(2.05*scale,34.43*scale);
	cv_ctx_l.lineTo(3.62*scale,31.00*scale);
	cv_ctx_l.lineTo(5.95*scale,27.72*scale);
	cv_ctx_l.lineTo(8.17*scale,25.61*scale);
	cv_ctx_l.lineTo(10.72*scale,23.84*scale);
	cv_ctx_l.lineTo(13.059*scale,22.73*scale);
	cv_ctx_l.lineTo(15.32*scale,22.28*scale);
	cv_ctx_l.lineTo(17.76*scale,22.08*scale);
	cv_ctx_l.lineTo(20.30*scale,21.47*scale);
	cv_ctx_l.lineTo(23.28*scale,20.51*scale);
	cv_ctx_l.lineTo(25.88*scale,18.90*scale);
	cv_ctx_l.lineTo(28.265*scale,16.83*scale);
	cv_ctx_l.lineTo(29.9*scale,14.71*scale);
	cv_ctx_l.lineTo(31.89*scale,12.195*scale);
	cv_ctx_l.lineTo(33.62*scale,9.42*scale);
	cv_ctx_l.lineTo(34.81*scale,6.64*scale);
	cv_ctx_l.lineTo(35.46*scale,3.92*scale);
	cv_ctx_l.lineTo(35.52*scale,0.54*scale);
	cv_ctx_l.strokeStyle=style.style.color;
	cv_ctx_l.lineWidth=3;
	cv_ctx_l.stroke(); 	
}

function addGeometryInitPRang(canvas, style){
	var	cv_ctx_p=canvas.getContext("2d");
	var scale = 0.7;
	
	cv_ctx_p.clearRect(0, 0, canvas.width, canvas.height);
		
	cv_ctx_p.shadowColor = '#999';
	cv_ctx_p.shadowBlur = 4;
	cv_ctx_p.shadowOffsetX = 2;
	cv_ctx_p.shadowOffsetY = 2;
	
	cv_ctx_p.moveTo(5.13*scale,15.82*scale);
	cv_ctx_p.lineTo(25.49*scale,5.13*scale);
	cv_ctx_p.lineTo(37.08*scale,13.16*scale);
	cv_ctx_p.lineTo(20.66*scale,38.01*scale);
	cv_ctx_p.lineTo(2.06*scale,33.67*scale);
	cv_ctx_p.closePath();
	cv_ctx_p.strokeStyle="#ffffff"; //hex
	cv_ctx_p.fillStyle=jQuery.Color(style.style.color).alpha(0.75).toRgbaString(); //rgba
	cv_ctx_p.lineWidth=1;
	cv_ctx_p.fill();
	cv_ctx_p.stroke();
}

function readDataUrlFileLayer(urlFileLayer, key){
	
	var defer = jQuery.Deferred();
	var data = {};
	var dataValues = [];	
	
	jQuery.each( urlFileLayer._layers, function(i,feature) {
		//var value = feature.properties[key.toLowerCase()];
		var value = feature.feature.properties[key];
		if(!data[value]){
			data[value] = value;
			dataValues.push(value);
		}
	});
	
	defer.resolve(dataValues);
	return defer.promise();
}

function readDataVisualitzacio(visualitzacio, key){
	//console.debug("readDataVisualitzacio");
	var defer = jQuery.Deferred();
	var data = {};
	var dataValues = [];
	jQuery.each(visualitzacio.estil, function(index, item){
		jQuery.each( item.geometria.features, function(i,feature) {
			//var value = feature.properties[key.toLowerCase()];
			var value = feature.properties[key];
			//Si es blanc assignem categoria "Sense valor" com una més
			//if(isBlank(value)) value = window.lang.convert("Sense valor");
			if(isBlank(value)) value = "nodata";
			if(!data[value]){
				data[value] = value;
				dataValues.push(value);
			}
		});
	});
	defer.resolve(dataValues);
	return defer.promise();
}

function createScale(paleta, length, reverse){
	var scale = ColorScales.createScale(paleta, length, reverse);
	return scale;
}
