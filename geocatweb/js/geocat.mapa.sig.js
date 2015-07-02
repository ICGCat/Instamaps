function addHtmlInterficieFuncionsSIG(){
	
	jQuery("#funcio_SIG").append(
	'	<h5 lang="ca">Escull la funció que vols executar</h5>'+
	'	<div class="div_gr3_fons">'+
	'		<div id="buffer" lang="ca" class="div_sig_1"></div>'+
	'		<div id="interseccio" lang="ca" class="div_sig_2"></div>'+
	'		<div id="tag" lang="ca" class="div_sig_3"></div>'+
	'		<div id="centroide" lang="ca" class="div_sig_4"></div>'+
	'		<div id="filter" lang="ca" class="div_sig_5"></div>'+
	'	</div>'		
	);
	$('.div_sig_1 #buffer').tooltip({placement : 'bottom',container : 'body',title :'BUffer'});
	$('.div_sig_2 #interseccio').tooltip({placement : 'bottom',container : 'body',title : 'Intersecció'});
	$('.div_sig_3 #tag').tooltip({placement : 'bottom',container : 'body',title : 'Tag'});
	$('.div_sig_4 #centroide').tooltip({placement : 'bottom',container : 'body',title : 'Centroide'});
	$('.div_sig_5 #filter').tooltip({placement : 'bottom',container : 'body',title : 'Filter'});
	
	jQuery("#buffer").on('click',function(e){
		openBufferModal();
	});
	
	jQuery("#interseccio").on('click',function(e){
		openIntersectionModal();
	});
	
	jQuery("#tag").on('click',function(e){
		openTagModal();
	});
	
	jQuery("#centroide").on('click',function(e){
		openCentroideModal();
	});
	
	jQuery("#filter").on('click',function(e){
		openFilterModal();
	});
}

function openFilterModal(){
	addHtmlModalLayersFilter();
	addHtmlModalFieldsFilter();
	showFilterLayersModal();
	jQuery('#list_filter_values').html("");
	$('#dialog_layers_filter').modal('show');
}


function openBufferModal(){
	 addHtmlModalBuffer();
	 createModalConfigLayers("buffer");
	 $('#dialog_buffer').modal('show');
	 jQuery('#dialog_buffer .btn-primary').on('click',function(){
			//Cridar funció buffer
		var businessId = $("input[name='downloadable-chck']:checked").parent().attr('data-businessId');
		 
		var data = {
			uid: $.cookie('uid'),
			businessId1: businessId,
			radi: $("#distancia").val()
		};
		buffer(data).then(function(results){
			if (results.status == "ERROR"){
				//TODO Mensaje de error
			}else{
				console.debug(results);				
				var data2 = {
					uid: $.cookie('uid'),
					mapBusinessId: url('?businessid'),
					serverName:results.serverName,
					path:results.path,
					//tmpFilePath:'E://usuaris//m.ortega//temp//tmp.geojson',
					tmpFilePath:tmpdir +'tmp.geojson',
					midaFitxer:results.midaFitxer,
					sourceExtension:'geojson',
					markerStyle:JSON.stringify(getMarkerRangFromStyle(defaultPunt)),
					lineStyle:JSON.stringify(getLineRangFromStyle(canvas_linia)),
					polygonStyle:JSON.stringify(getPolygonRangFromStyle(canvas_pol))
				}
				doUploadFile(data2).then(function(results){
					if (results.status="OK") {
						addDropFileToMap(results);

					}
				});
			}
		});
	});		
}

function openIntersectionModal(){
	 addHtmlModalIntersection();
	 createModalConfigLayers2("intersection");
	 $('#dialog_intersection').modal('show');
	 jQuery('#dialog_intersection .btn-primary').on('click',function(){
			//Cridar funció buffer
		var businessId1 = $("input[name='downloadable-chck']:checked").parent().attr('data-businessId');
		var businessId2 = $("input[name='downloadable-chck2']:checked").parent().attr('data-businessId');
		 
		var data = {
			uid: $.cookie('uid'),
			businessId1: businessId1,
			businessId2: businessId2
		};
		intersection(data).then(function(results){
			if (results.status == "ERROR"){
				//TODO Mensaje de error
			}else{
				console.debug(results);				
				var data2 = {
					uid: $.cookie('uid'),
					mapBusinessId: url('?businessid'),
					serverName:results.serverName,
					path:results.path,
					tmpFilePath:tmpdir +'tmp.geojson',
					midaFitxer:results.midaFitxer,
					sourceExtension:'geojson',
					markerStyle:JSON.stringify(getMarkerRangFromStyle(defaultPunt)),
					lineStyle:JSON.stringify(getLineRangFromStyle(canvas_linia)),
					polygonStyle:JSON.stringify(getPolygonRangFromStyle(canvas_pol))
				}
				doUploadFile(data2).then(function(results){
					if (results.status="OK") {
						addDropFileToMap(results);
						 $('#dialog_intersection').modal('hide');
					}
				});
			}
		});
	});		
}

function openTagModal(){
	 addHtmlModalTag();
	 createModalConfigLayers2("tag");
	 $('#dialog_tag').modal('show');
	 jQuery('#dialog_tag .btn-primary').on('click',function(){
			//Cridar funció buffer
		var businessId1 = $("input[name='downloadable-chck']:checked").parent().attr('data-businessId');
		var businessId2 = $("input[name='downloadable-chck2']:checked").parent().attr('data-businessId');
		 
		var data = {
			uid: $.cookie('uid'),
			businessId1: businessId1,
			businessId2: businessId2
		};
		tag(data).then(function(results){
			if (results.status == "ERROR"){
				//TODO Mensaje de error
			}else{
				console.debug(results);				
				var data2 = {
					uid: $.cookie('uid'),
					mapBusinessId: url('?businessid'),
					serverName:results.serverName,
					path:results.path,
					tmpFilePath:tmpdir +'tmp.geojson',
					midaFitxer:results.midaFitxer,
					sourceExtension:'geojson',
					markerStyle:results.markerEstil
				}
				doUploadFile(data2).then(function(results){
					if (results.status="OK") {
						addDropFileToMap(results);
						 $('#dialog_tag').modal('hide');
					}
				});
			}
		});
	});		
}

function openCentroideModal(){
	addHtmlModalCentroid();
	createModalConfigLayers("centroide");
	 $('#dialog_centroid').modal('show');
	 jQuery('#dialog_centroid .btn-primary').on('click',function(){
			//Cridar funció buffer
		var businessId1 = $("input[name='downloadable-chck']:checked").parent().attr('data-businessId');
			 
		var data = {
			uid: $.cookie('uid'),
			businessId1: businessId1
		};
		centroid(data).then(function(results){
			if (results.status == "ERROR"){
				//TODO Mensaje de error
			}else{
				console.debug(results);				
				var data2 = {
					uid: $.cookie('uid'),
					mapBusinessId: url('?businessid'),
					serverName:results.serverName,
					path:results.path,
					//tmpFilePath:'E://usuaris//m.ortega//temp//tmp2.geojson',
					tmpFilePath:tmpdir +'tmp.geojson',
					midaFitxer:results.midaFitxer,
					sourceExtension:'geojson',
					markerStyle:JSON.stringify(getMarkerRangFromStyle(defaultPunt)),
					lineStyle:JSON.stringify(getLineRangFromStyle(canvas_linia)),
					polygonStyle:JSON.stringify(getPolygonRangFromStyle(canvas_pol))
				}
				doUploadFile(data2).then(function(results){
					if (results.status="OK") {
						addDropFileToMap(results);
						$('#dialog_centroid').modal('hide');
					}
				});
			}
		});
	});		
}

function addHtmlModalBuffer(){	
	jQuery('#mapa_modals').append('<!-- Modal Buffer -->'+
			'<div id="dialog_buffer" class="modal fade">'+
				'<div class="modal-dialog">'+
					'<div class="modal-content">'+
						'<div class="modal-header">'+
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
							'<h4 lang="ca" class="modal-title">Buffer</h4>'+
						'</div>'+
						'<div class="modal-body">'+
							'<form id="frm_buffer">'+
			'					<div class="modal-layers-sig">'+
			'					</div>'+
			'					<br>'+
			'					<section>'+
			'						<fieldset>'+
			'							<label class="control-label" lang="ca">Radi</label>:'+
			'							<input lang="ca" id="distancia" type="text" required'+
			'						class="form-control my-border" value="">'+
			'						</fieldset>'+
			'					</section>'+
			'				</form>		'+			
			'			</div>'+
			'			<div class="modal-footer">'+
			'				<button lang="ca" type="button" class="btn btn-default" data-dismiss="modal">Cancel·lar</button>'+
			'				<button lang="ca" type="button" class="btn btn-primary">Buffer</button>'+
			'			</div>'+
			'		</div>'+
			'		<!-- /.modal-content -->'+
			'	</div>'+
			'	<!-- /.modal-dialog -->'+
			'</div>'+
			'<!-- /.modal -->'+
			'<!-- Fi Modal Buffer -->');
}

function createModalConfigLayers(tipus){
	var count = 0;
	var html = '<label class="control-label" lang="ca">'+
					window.lang.convert('Capes disponibles:')+
				'</label>';
	
	jQuery.each(controlCapes._layers, function(i, item){
		
		var layer = item.layer;
		var layerName = layer.options.nom;
		var checked = "";
		console.debug(layer);
		var tipusLayer = "";
		if(layer.options.tipus) tipusLayer = layer.options.tipus;
		
		//Si no es WMS
		if(tipusLayer.indexOf(t_wms)== -1){
				
			html += '<div class="downloadable-subrow" data-businessid="'+layer.options.businessId+'">'+
							'<div class="col-md-9 downloadable-name">'+
								layerName+
							'</div>'+
							'<input id="downloadable-chck" name="downloadable-chck" class="col-md-1 downloadable-chck" type="radio"  >'+
						'</div>';		
			html+='<div class="separate-downloadable-row"></div>';			
		}
	});	
	
	html+='';
	
	if (tipus=="buffer") $('#dialog_buffer .modal-body .modal-layers-sig').html(html);
	if (tipus=="centroide") $('#dialog_centroid .modal-body .modal-layers-sig').html(html);
}

function addHtmlModalIntersection(){	
	jQuery('#mapa_modals').append('<!-- Modal Intersection -->'+
			'<div id="dialog_intersection" class="modal fade">'+
				'<div class="modal-dialog">'+
					'<div class="modal-content">'+
						'<div class="modal-header">'+
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
							'<h4 lang="ca" class="modal-title">Intersecció</h4>'+
						'</div>'+
						'<div class="modal-body">'+
							'<form id="frm_buffer">'+
			'					<div class="modal-layers-sig">'+
			'					</div>'+
			'				</form>		'+			
			'			</div>'+
			'			<div class="modal-footer">'+
			'				<button lang="ca" type="button" class="btn btn-default" data-dismiss="modal">Cancel·lar</button>'+
			'				<button lang="ca" type="button" class="btn btn-primary">Intersecció</button>'+
			'			</div>'+
			'		</div>'+
			'		<!-- /.modal-content -->'+
			'	</div>'+
			'	<!-- /.modal-dialog -->'+
			'</div>'+
			'<!-- /.modal -->'+
			'<!-- Fi Modal Intersection -->');
}

function createModalConfigLayers2(tipus){
	var count = 0;
	var html = '<label class="control-label" lang="ca">'+
					window.lang.convert('Capes disponibles')+":"+
				'</label>';
	if (tipus=="tag") {
		html = '<label class="control-label" lang="ca">'+
		window.lang.convert('Capes de polígons disponibles')+":"+
	'</label>';
	}
	jQuery.each(controlCapes._layers, function(i, item){		
		var layer = item.layer;
		var layerName = layer.options.nom;
		var checked = "";
		console.debug(layer);
		var tipusLayer = "";
		if(layer.options.tipus) tipusLayer = layer.options.tipus;
		
		//Si no es WMS
		if(tipusLayer.indexOf(t_wms)== -1){
			if (tipus=="tag") {
				if (layer.options.geometryType=="polygon"){
					html += '<div class="downloadable-subrow" data-businessid="'+layer.options.businessId+'">'+
					'<div class="col-md-9 downloadable-name">'+
						layerName+
					'</div>'+
					'<input id="downloadable-chck" name="downloadable-chck" class="col-md-1 downloadable-chck" type="radio"  >'+
				    '</div>';		
				   html+='<div class="separate-downloadable-row"></div>';
				}
			}	
			else {
				html += '<div class="downloadable-subrow" data-businessid="'+layer.options.businessId+'">'+
								'<div class="col-md-9 downloadable-name">'+
									layerName+
								'</div>'+
								'<input id="downloadable-chck" name="downloadable-chck" class="col-md-1 downloadable-chck" type="radio"  >'+
							'</div>';		
				html+='<div class="separate-downloadable-row"></div>';
			}
		}
	});	
	
	html+='';
	
	if (tipus=="intersection") {
		html += '<label class="control-label" lang="ca">'+
					window.lang.convert('Capes per fer intersecció')+":"+
			    '</label>';
	}
	if (tipus=="union"){
		html += '<label class="control-label" lang="ca">'+
					window.lang.convert('Capes per fer unió')+":"+
				'</label>';
	}
	if (tipus=="tag"){
		html += '<label class="control-label" lang="ca">'+
					window.lang.convert('Capes de punts disponibles')+":"+
				'</label>';
	}
	
	jQuery.each(controlCapes._layers, function(i, item){	
		var layer = item.layer;
		var layerName = layer.options.nom;
		var checked = "";
		var tipusLayer = "";
		if(layer.options.tipus) tipusLayer = layer.options.tipus;
		
		//Si no es WMS
		if(tipusLayer.indexOf(t_wms)== -1){
			if (tipus=="tag") {
				if (layer.options.geometryType=="marker"){
					html += '<div class="downloadable-subrow" data-businessid="'+layer.options.businessId+'">'+
					'<div class="col-md-9 downloadable-name">'+
						layerName+
					'</div>'+
					'<input id="downloadable-chck2" name="downloadable-chck2" class="col-md-1 downloadable-chck" type="radio"  >'+
				'</div>';		
		html+='<div class="separate-downloadable-row"></div>';
				}
			}
			else {
				html += '<div class="downloadable-subrow" data-businessid="'+layer.options.businessId+'">'+
							'<div class="col-md-9 downloadable-name">'+
								layerName+
							'</div>'+
							'<input id="downloadable-chck2" name="downloadable-chck2" class="col-md-1 downloadable-chck" type="radio"  >'+
						'</div>';		
				html+='<div class="separate-downloadable-row"></div>';
			}
		}
	});	
	
	html+='';
	
	if (tipus=="intersection") $('#dialog_intersection .modal-body .modal-layers-sig').html(html);
	if (tipus=="union")  $('#dialog_union .modal-body .modal-layers-sig').html(html);
	if (tipus=="tag")  $('#dialog_tag .modal-body .modal-layers-sig').html(html);
}

function addHtmlModalTag(){	
	jQuery('#mapa_modals').append('<!-- Modal Tag -->'+
			'<div id="dialog_tag" class="modal fade">'+
				'<div class="modal-dialog">'+
					'<div class="modal-content">'+
						'<div class="modal-header">'+
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
							'<h4 lang="ca" class="modal-title">Tag</h4>'+
						'</div>'+
						'<div class="modal-body">'+
							'<form id="frm_buffer">'+
			'					<div class="modal-layers-sig">'+
			'					</div>'+
			'				</form>		'+			
			'			</div>'+
			'			<div class="modal-footer">'+
			'				<button lang="ca" type="button" class="btn btn-default" data-dismiss="modal">Cancel·lar</button>'+
			'				<button lang="ca" type="button" class="btn btn-primary">Tag</button>'+
			'			</div>'+
			'		</div>'+
			'		<!-- /.modal-content -->'+
			'	</div>'+
			'	<!-- /.modal-dialog -->'+
			'</div>'+
			'<!-- /.modal -->'+
			'<!-- Fi Modal Tag -->');
}



function addHtmlModalUnion(){	
	jQuery('#mapa_modals').append('<!-- Modal Union -->'+
			'<div id="dialog_union" class="modal fade">'+
				'<div class="modal-dialog">'+
					'<div class="modal-content">'+
						'<div class="modal-header">'+
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
							'<h4 lang="ca" class="modal-title">Union</h4>'+
						'</div>'+
						'<div class="modal-body">'+
							'<form id="frm_buffer">'+
			'					<div class="modal-layers-sig">'+
			'					</div>'+
			'				</form>		'+			
			'			</div>'+
			'			<div class="modal-footer">'+
			'				<button lang="ca" type="button" class="btn btn-default" data-dismiss="modal">Cancel·lar</button>'+
			'				<button lang="ca" type="button" class="btn btn-primary">Union</button>'+
			'			</div>'+
			'		</div>'+
			'		<!-- /.modal-content -->'+
			'	</div>'+
			'	<!-- /.modal-dialog -->'+
			'</div>'+
			'<!-- /.modal -->'+
			'<!-- Fi Modal Union -->');
}

function addHtmlModalCentroid(){
	jQuery('#mapa_modals').append('<!-- Modal Centroide -->'+
			'<div id="dialog_centroid" class="modal fade">'+
				'<div class="modal-dialog">'+
					'<div class="modal-content">'+
						'<div class="modal-header">'+
							'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
							'<h4 lang="ca" class="modal-title">Centroide</h4>'+
						'</div>'+
						'<div class="modal-body">'+
							'<form id="frm_buffer">'+
			'					<div class="modal-layers-sig">'+
			'					</div>'+
			'					<br>'+
			'				</form>		'+			
			'			</div>'+
			'			<div class="modal-footer">'+
			'				<button lang="ca" type="button" class="btn btn-default" data-dismiss="modal">Cancel·lar</button>'+
			'				<button lang="ca" type="button" class="btn btn-primary">Centroide</button>'+
			'			</div>'+
			'		</div>'+
			'		<!-- /.modal-content -->'+
			'	</div>'+
			'	<!-- /.modal-dialog -->'+
			'</div>'+
			'<!-- /.modal -->'+
			'<!-- Fi Modal Centroide -->');
}

function addHtmlModalLayersFilter(){
	
	jQuery('#mapa_modals').append(
	'	<!-- Modal Filter Layers -->'+
	'		<div class="modal fade" id="dialog_layers_filter">'+
	'		<div class="modal-dialog">'+
	'			<div class="modal-content">'+
	'				<div class="modal-header">'+
	'					<button type="button" class="close" data-dismiss="modal"'+
	'						aria-hidden="true">&times;</button>'+
	'					<h4 class="modal-title" lang="ca">Tria una capa per aplicar-hi el filtre</h4>'+
	'				</div>'+
	'				<div class="modal-body">'+
	'					<script id="filter-layers-template" type="text/x-handlebars-template">'+
	'					<div class="panel-warning">'+					
	'					<ul class="bs-dadesO_USR panel-heading">'+
	'						{{#each layers}}'+
	'						<li><a class="usr_filter_layer lable-usr" data-leafletid="{{layer._leaflet_id}}" data-businessId="{{layer.options.businessId}}" data-geometryType="{{layer.options.geometryType}}" data-tipus="{{layer.options.tipus}}">{{name}}</a></li>'+
	'						{{/each}}'+
	'					</ul>'+	
	'					</div>'+
	'					</script>'+
	'					<div id="list_filter_layers"></div>'+
	'			</div>'+
	'				<div class="modal-footer">'+
	'				</div>'+
	'			</div>'+
	'			<!-- /.modal-content -->'+
	'		</div>'+
	'		<!-- /.modal-dialog -->'+
	'	</div>'+
	'	<!-- /.modal -->'+
	'	<!-- fi Modal Tematics Layers -->'		
	);
	
}

function showFilterLayersModal(){
	//console.debug("showTematicLayersModal");
	var warninMSG="<div class='alert alert-danger'><strong>"+window.lang.convert('No pots aplicar filtre a cap capa del mapa')+
	"<strong>  <span class='fa fa-warning sign'></span></div>";
	jQuery('.modal').modal('hide');
	
	jQuery('#dialog_layers_filter').modal('show');
	
	
	var layers = [];
	jQuery.each( controlCapes._layers, function( key, value ) {
		var layerOptions = this.layer.options;
		layers.push(this);
		}

	);
	// fi each
	if(layers.length ==0){
		$('#list_filter_layers').html(warninMSG);		
		return;
	}
	layers = {layers: layers};

	var source = jQuery("#filter-layers-template").html();
	var template = Handlebars.compile(source);
	var html = template(layers);
	$('#list_filter_layers').html(html);
	
	$('.usr_filter_layer').on('click',function(e){
		var _this = jQuery(this);
		var data = _this.data();
			
		showModalFilterFields(data);
		
	});
}

function showModalFilterFields(data){
//	console.debug("showModalTematicCategories");
	jQuery('.modal').modal('hide');
	jQuery('#dialog_filter_rangs').modal('show');
	
	jQuery('#dialog_filter_rangs .btn-success').on('click',function(e){
		
	});	
	
	jQuery("#dialog_filter_rangs").data("capamare", data);
	
	jQuery('#dialog_filter_rangs .btn-success').hide();
	
	var dataTem={
		businessId: data.businessid,
		uid: jQuery.cookie('uid')
	};
//	console.debug(data);
	
	$('#visFilter').val(data.businessid);
	
	if(data.tipus == t_url_file){
		var urlFileLayer = controlCapes._layers[data.leafletid].layer;
		jQuery("#dialog_filter_rangs").data("visualitzacio", urlFileLayer.options);
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
		
		jQuery('#dataField').on('change',function(e){
			var this_ = jQuery(this);
			if (this_.val() == "---"){
				jQuery('#list_filter_values').html("");
				jQuery('#dialog_filter_rangs .btn-success').hide();
			}else{
				jQuery('#dialog_tematic_rangs .btn-success').show();
				readDataUrlFileLayer(urlFileLayer, this_.val()).then(function(results){
					jQuery("#dialog_filter_rangs").data("values", results);
					getTipusValuesVisualitzacio(results);
				});
				
				
			}
		});			
		
	}else{//Si es una visualitzacio
		getVisualitzacioByBusinessId(dataTem).then(function(results){
			if (results.status == "OK"){
				var visualitzacio = results.results;
				jQuery("#dialog_filter_rangs").data("visualitzacio", visualitzacio);
				var fields = {};
				fields[window.lang.convert('Escull el camp')] = '---';
				if (visualitzacio.options){
					var options = JSON.parse(visualitzacio.options);
					var dataNames = options.propName.split(',');
					jQuery.each(dataNames, function( index, value ) {
						fields[value] = value;
					});
				}else{
					if (results.geometries && results.geometries.options){
						var dataNames = results.geometries.options.split(',');
						jQuery.each(dataNames, function( index, value ) {
							fields[value] = value;
						});
					}
				}
				//creamos el select con los campos
				var source1 = jQuery("#tematic-layers-fields").html();
				var template1 = Handlebars.compile(source1);
				var html1 = template1({fields:fields});
				jQuery('#dataField_filter').html(html1);
				
				jQuery('#dataField_filter').on('change',function(){
					var this_ = jQuery(this);
					if (this_.val() == "---"){
						jQuery('#dialog_filter_rangs .btn-success').hide();
					}else{
										
						readDataVisualitzacio(visualitzacio, this_.val()).then(function(results){
							jQuery("#dialog_filter_rangs").data("values", results);
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
			if(isBlank(value)) value = window.lang.convert("Sense valor");
			
			if(!data[value]){
				data[value] = value;
				dataValues.push(value);
			}
		});
	});
	defer.resolve(dataValues);
	return defer.promise();
}

function addHtmlModalFieldsFilter(){
	
	jQuery('#mapa_modals').append(
	'	<!-- Modal Filter -->'+
	'		<div class="modal fade" id="dialog_filter_rangs">'+
	'		<div class="modal-dialog">'+
	'			<div class="modal-content">'+
	'				<div class="modal-body">'+
	'					<div class="labels_fields">'+
	'					    <input type="hidden" name="visFilter"  id="visFilter" value="">'+ 
	'						<span>1.</span><span lang="ca">Escull el camp per filtrar</span>:'+
	'						<select name="dataField_filter" id="dataField_filter">'+
	'						</select>'+
	'					</div>'+
	'					<script id="tematic-layers-fields" type="text/x-handlebars-template">'+
	'						{{#each fields}}'+
	'						<option value="{{this}}">{{@key}}</option>'+
	'						{{/each}}'+
	'					</script>'+
	'					<br/>'+				
	'					<div id="list_filter_values"></div>'+
	'				<div class="modal-footer">'+
	'					<button type="button" class="btn btn-default" data-dismiss="modal" lang="ca">Tancar</button>'+
	'         			<button type="button" class="btn btn-success" lang="ca">Filtrar</button>'+
	'				</div>'+
	'			</div>'+
	'			<!-- /.modal-content -->'+
	'		</div>'+
	'		<!-- /.modal-dialog -->'+
	'	</div>'+
	'	<!-- /.modal -->'+
	'	<!-- fi Modal Tematics Rangs -->'		
	);
}

function getTipusValuesVisualitzacio(results){
	//console.debug("getTipusValuesVisualitzacio");
	if (results.length == 0){
		var warninMSG="<div class='alert alert-danger'><strong>"+window.lang.convert('Aquest camp no te valors')+"<strong>  <span class='fa fa-warning sign'></span></div>";
		jQuery('#list_filter_values').html(warninMSG);
		jQuery('#dialog_filter_rangs .btn-success').hide();
	}else{
		var arr = jQuery.grep(results, function( n, i ) {
			return !jQuery.isNumeric(n);
		});
		var checkboxes = "";
		jQuery.grep(results, function( n, i ) {
			var check =  "<input type='checkbox' name='filterValue' value='"+n+"' id='filter_"+i+"' class='col-md-1 download'/>"+n;
			checkboxes += check +"<br/>" ;
		});
		var html = "2. Escull els valors pels que vols filtrar:<br/>";
		html += checkboxes;
		var filtres="";
		var i=0;
		jQuery('#list_filter_values').html(html);
		jQuery('#dialog_filter_rangs .btn-success').show();
		jQuery('#dialog_filter_rangs .btn-success').on('click',function(e){
			filtres="";
			$('input[name="filterValue"]:checked').each(function() {
				   filtres=filtres+escape(this.value)+",";
				   i++;
			});		
			
			var data = {
				mapBusinessId: url('?businessid'),
				uid: $.cookie('uid'),
				businessId: $('#visFilter').val(),
				campFiltre: $('#dataField_filter option:selected' ).val(),
				valorsFiltre: filtres
			};
			console.debug(data);
			filterVisualitzacio(data).then(function(results){
				if (results.status=="OK"){
					console.debug(results);
					var defer = $.Deferred();
					readVisualitzacio(defer, results.visualitzacio, results.layer);
					activaPanelCapes(true);
					$('#dialog_filter_rangs').modal('hide');
				}
				else {

				}
			});
			
		});
	}
}