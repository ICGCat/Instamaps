/*
 * Funcionalitat de publicació del mapa
 * require: jquery, geocat.web, geocat.ajax, geocat.utils, geocat.canvas, geocat.legend, geocat.config, dropzone, share, lang, bootstrap.switch, bootstrap.formhelpers, bootstrap.colorpallete, jquery.url 
 */
(function ( $, window, document, undefined ) {
   "use strict";
   	var Publicar = {
   			
   		mapConfig:null,
        map:null,	
   			
   			 params_visor: {
    		"paramsVisor" : [
				{
					"param": "zoomcontrol",
					"text":"Control de zoom",
					"visor": true,
					"iframe": true
				},
				{
					"param": "openinstamaps",
					"text":"Control de ampliar el mapa",
					"iframe": true
				},
				{
					"param": "homecontrol",
					"text":"Control de tornar a la vista inicial",
					"visor": true
				},
				{
					"param": "locationcontrol",
					"text":"Control de localització",
					"visor": true
				},
				{
					"param": "searchcontrol",
					"text":"Control de cerca",
					"visor": true
				},
				{
					"param": "routingcontrol",
					"text":"Control de routing",
					"visor": true
				},
				{
					"param": "sharecontrol",
					"text":"Control de compartir en xarxes socials",
					"visor": true
				},
				{
					"param": "likecontrol",
					"text":"Control de M'agrada",
					"visor": true,
					"iframe": true
				},
				{
					"param": "fonscontrol",
					"text":"Control de fons",
					"visor": true
				},
				{
					"param": "layerscontrol",
					"text":"Control de capes",
					"visor": true,
					"iframe": true
				},
				{
					"param": "control3d",
					"text":"Control de 3D",
					"visor": true
				},
				{
					"param": "snapshotcontrol",
					"text":"Control captura imatge",
					"visor": true
				},
				{
					"param": "printcontrol",
					"text":"Control d'impressió",
					"visor": true
				},
				{
					"param": "geopdfcontrol",
					"text":"Control GeoPdf",
					"visor": true
				},
				{
					"param": "llegenda",
					"text":"Llegenda en el visor",
					"visor": true
				},
				{
					"param": "minimapcontrol",
					"text":"Control minimapa",
					"visor": true,
					"iframe": false
				},
				{
					"param": "mouseposition",
					"text":"Coordenades del ratolí",
					"visor": true
				},
				{
					"param": "scalecontrol",
					"text":"Control d'escala",
					"visor": true
				}				
			] 
        },
        
        init: function() {
        	this.containerId = '#funcio_publicar';
        	//By using the object PROJ you can reference it with "this" (i.e. this.whatever();), easy peazy "namespacing"
            //Example:
        	this.buttonClass = "bt_publicar";
        	this.disabledClass = "bt_publicar_disabled";
        	this.cache();
        	this.subscriptions();
        	this.button;
        	this.bindEvents();
                                    
            return this;
        },
        
        cache: function(){
        	this.container = $(this.containerId);
        },
        
        _setMapConfig: function(mapConfig){
        	this.mapConfig = mapConfig;
        },
        
        _setMap: function(map){
        	this.map = map;
        },
        
        addControl: function(){
        	var that = this;
        	if(arguments[0]){ //container id
        		this.containerId = arguments[0];
        		this.container = $(this.containerId);
        	}
        	        	
        	if(arguments[1]){ //uid
        		this.uid = arguments[1];
        	}
        	
        	if(arguments[2]){ //collaborateuid
        		this.collaborateuid = arguments[2];
        	}
        	
        	this._addHtmlInterficiePublicar();
        	
        	if(this.collaborateuid){
        		this._addHtmlInterficiePublicarDisable();
        	}
        	
        	this._addHtmlModalPublicar();
        	this._addHtmlModalIframePublicar();
        	
        	//require web
        	if (isRandomUser(this.uid)){
        		this.button.on('click',function(){
        			$('.modal').modal('hide');
        			_gaq.push(['_trackEvent', 'mapa', tipus_user+'publicar', 'pre-publicar', 1]);
        			
        			$('#dialgo_publicar_random').modal('show');
        			
        			$('#dialgo_publicar_random .bt-sessio').on('click',function(){
        				$(window).off('beforeunload');
        				$(window).off('unload');
        				window.location = paramUrl.loginPage+"?from=mapa";
        			});
        			
        			$('#dialgo_publicar_random .bt_orange').on('click',function(){
        				$(window).off('beforeunload');
        				$(window).off('unload');
        				window.location = paramUrl.registrePage+"?from=mapa";
        			});
        		});		
        	}else{
        		//publicar el mapa solo para registrados
        		this.button.on('click',function(){
        			_gaq.push(['_trackEvent', 'mapa', tipus_user+'publicar', 'pre-publicar', 1]);
        			
        			$.publish('reloadMapConfig','publicar/');
        		});
        	}
        },
        
        _updateModalPublicar: function(){
        	//actualizar los campos del dialogo publicar
			       	
        	//require utils
        	var that = this;
        	if (isDefaultMapTitle(that.mapConfig.nomAplicacio)) $('#nomAplicacioPub').val("");
			else $('#nomAplicacioPub').val(that.mapConfig.nomAplicacio);
        	if (that.mapConfig.visibilitat == visibilitat_open){
				$("input[name=publicitat][value=public]").prop('checked', true);	
				$("input[name=privacitat][value=obert]").prop('checked', true);	
				$('#map_clau').val('');
			}else{
				$("input[name=publicitat][value=privat]").prop('checked', true);				
				if (that.mapConfig.clau){
					$("input[name=privacitat][value=restringit]").prop('checked', true);
					$('#map_clau').prop('disabled',true);
					$('#map_clau').val(randomString(10));
				}else{
					$("input[name=privacitat][value=obert]").prop('checked', true);				
					$('#map_clau').prop('disabled',true);
					$('#map_clau').val('');
				}
			}
			if(that.mapConfig.options){
				$('#optDescripcio').val(that.mapConfig.options.description);
				$('#optTags').val(that.mapConfig.options.tags);	
				if (that.mapConfig.options.llegenda){
					$('#llegenda_chk').bootstrapSwitch('state', true, true);
				}else{
					$('#llegenda_chk').bootstrapSwitch('state', false, false);
				}
				if (that.mapConfig.options.llegenda){
					$('#div_llegenda_chk2').show();
					if (that.mapConfig.options.tipusllegenda && that.mapConfig.options.tipusllegenda=="dinamica"){
						$('#llegenda_chk2').bootstrapSwitch('state', true, true);
						$('#txt_llegenda_chk2').html("La llegenda permet a l'usuari seleccionar la capa del seu interès.");
					}
					else {
						$('#llegenda_chk2').bootstrapSwitch('state', false, false);
						$('#txt_llegenda_chk2').html("La llegenda del conjunt de les capes es mostra de manera contínua.");
					}
				}
			}
			
			that._createModalConfigDownload();
			
			that._createModalVisor();

			$('#dialgo_publicar #nomAplicacioPub').removeClass("invalid");
			$( ".text_error" ).remove();
			$('.modal').modal('hide');
			$('#dialgo_publicar').modal('show');
						
			if(isGeolocalUser()){ //solo usuarios geolocal
				//aspecte
				if (that.mapConfig.options){
					if(that.mapConfig.options.barColor){
						$('#dv_fill_menu_bar').css('background-color',that.mapConfig.options.barColor);
						$("#in_fill_menu_bar").val(that.mapConfig.options.barColor);
					}
					
					if(that.mapConfig.options.textColor){
						$('#dv_color_text_bar').css('background-color',that.mapConfig.options.textColor);
						$("#in_color_text_bar").val(that.mapConfig.options.textColor);
					}
					
					if(that.mapConfig.options.fontType){
						$('.bfh-selectbox').bfhselectbox().bfhfonts({font: that.mapConfig.options.fontType, available: 'Arial,Calibri,Courier New,Franklin Gothic Medium,Geneva,Helvetica,Times New Roman,Verdana'});
					}else{
						$('.bfh-selectbox').bfhselectbox().bfhfonts({font:'Arial', available: 'Arial,Calibri,Courier New,Franklin Gothic Medium,Geneva,Helvetica,Times New Roman,Verdana'});
					}
					
					//contacte
					if(that.mapConfig.options.contacte){
						$('#contacte').val(this.mapConfig.options.contacte);
					}
					
				}else{
					$('#dv_fill_menu_bar').css('background-color',"#333333");
					$("#in_fill_menu_bar").val("#333333");
					
					$('#dv_color_text_bar').css('background-color',"#9d9d9d");
					$("#in_color_text_bar").val("#9d9d9d");
					
					$('.bfh-selectbox').bfhselectbox().bfhfonts({font:'Arial', available: 'Arial,Calibri,Courier New,Franklin Gothic Medium,Geneva,Helvetica,Times New Roman,Verdana'});		
				}
				//escut
				if(that.mapConfig.logo){
					$(".logo").prop('src',"/logos/"+that.mapConfig.logo);
				}
				$('#geolocal_tab').attr("style","display:inline");
			}else{
				$(".modal-public-aspect").hide();
			}
			
			//Dialeg publicar
			$('#publish-private').tooltip({
				placement : 'bottom',
				container : 'body'
			});
			$('#publish-public').tooltip({
				placement : 'bottom',
				container : 'body'
			});
						
			//Si mapconfig legend, activat, es mostra
			if(that.mapConfig.options != null && that.mapConfig.options.llegenda){
				//require geocat.legend
				createModalConfigLegend();
				$('#dialgo_publicar .modal-body .modal-legend').show();
			}else{
				$('#dialgo_publicar .modal-body .modal-legend').hide();
			}
			
			//Traducció dels textos del modal de publicar
    		$('#titlePublicar').text(window.lang.convert($('#titlePublicar').text()));
    		$('#id_info_tab').text(window.lang.convert($('#id_info_tab').text()));
    		$('#id_privacitat_tab').text(window.lang.convert($('#id_privacitat_tab').text()));
    		$('#id_llegenda_tab').text(window.lang.convert($('#id_llegenda_tab').text()));
    		$('#id_reuse_tab').text(window.lang.convert($('#id_reuse_tab').text()));
    		
    		$('#nomAplicacioPub').attr("placeholder", window.lang.convert("Nom"));
		    $('#optDescripcio').attr("placeholder", window.lang.convert("Descripció"));
		    $('#optTags').attr("placeholder", window.lang.convert("Etiquetes")); 
			$('#publish-warn-text').text(window.lang.convert('El mapa es publicarà amb la vista actual: àrea geogràfica, nivell de zoom i capes visibles'));
					    
		    $('#llegendaTitle').text(window.lang.convert($('#llegendaTitle').text()));
		    $('#textLegend').text(window.lang.convert($('#textLegend').text()));
		    
		    $('#checkObert').text(window.lang.convert($('#checkObert').text()));
		    $('#checkRestringit').text(window.lang.convert($('#checkRestringit').text()));
		    $('#txtPublic').text(window.lang.convert($('#txtPublic').text()));
		    $('#txtPrivat').text(window.lang.convert($('#txtPrivat').text()));
		    $('#checkPublic').text(window.lang.convert($('#checkPublic').text()));
		    $('#checkPrivat').text(window.lang.convert($('#checkPrivat').text()));
		    $('#txtVisible').text(window.lang.convert($('#txtVisible').text()));
		    $('#txtNoVisible').text(window.lang.convert($('#txtNoVisible').text()));
		    $('#resetClau').text(window.lang.convert($('#resetClau').text()));
		    
		    $('#cancelPublicar').text(window.lang.convert($('#cancelPublicar').text()));
		    $('#okPublicar').text(window.lang.convert($('#okPublicar').text()));
			
			var v_url = window.location.href;
			if (!url('?id')){
				v_url += "&id="+$('#userId').val();
			}
			v_url = v_url.replace('localhost',DOMINI);			
			var urlMap = v_url.replace('mapa','visor');		
			urlMap = urlMap.replace('#no-back-button','');
			
			$("#urlVisorMap a").attr("href", urlMap);
			$('#urlMap').val(urlMap);
			$('#iframeMap').val('<iframe width="640" height="480" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'+urlMap+'&embed=1" ></iframe>');
			
			$('a[href^="#id_info').click();
		},
        
        _addHtmlInterficiePublicar: function(){
        	this.container.append(
    			'<div class="'+this.buttonClass+'" data-toggle="tooltip" data-lang-title="Desa\'l i decideix si fer-lo públic o privat" title="Desa\'l i decideix si fer-lo públic o privat">'+
    			'<span lang="ca">Publicar el mapa</span>'+
    			'</div>'
    		);
        	
        	this.button = $('.'+this.buttonClass);
        	
        	this.button.tooltip({
        		placement : 'right',
        		container : 'body'
        	});
        },
        
        _addHtmlInterficiePublicarDisable: function(){
        	this.container.children().removeClass(this.buttonClass).addClass(this.disabledClass);
        },
        
        _addHtmlModalPublicar: function(){
        	var that = this;
        	$.get("templates/modalPublicar.html",function(data){
        		//TODO ver como pasar el modal container
        		$('#mapa_modals').append(data);       		
        		
        		
        		
        		$('.make-switch').bootstrapSwitch();
            	//Configurar Llegenda
            	$('input[name="my-legend-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {
            		if(state.value == true) {
            			//require geocat.legend
            			createModalConfigLegend();
            			//mostrar el checkbox de triar tipus de llegenda
            			$('#div_llegenda_chk2').attr("style","display:block;");
            			$('#llegenda_chk2').bootstrapSwitch('state', true, true);
            		}else{
            			$('#dialgo_publicar .modal-body .modal-legend').hide();
            			//ocultar el checkbox de triar tipus de llegenda
            			$('#div_llegenda_chk2').attr("style","display:none;");
            		}
            	});	
            	$('input[name="my-legend-checkbox2"]').on('switchChange.bootstrapSwitch', function(event, state) {
            		if(state.value == true) {
            			$('#txt_llegenda_chk2').html("La llegenda permet a l'usuari seleccionar la capa del seu interès.");
    				}
    				else {
    					$('#txt_llegenda_chk2').html("La llegenda del conjunt de les capes es mostra de manera contínua.");
    				}
            	});

           	 	$('input:radio[name="privacitat"]').change(function() {
            	        if ($(this).val() == 'obert') {
            	        	if (that.mapConfig.clau){
                				$('#map_clau').val('');
                			}else{
                				$('#map_clau').prop('disabled',true);
                			}
            	        } else {
            	        	if (that.mapConfig.clau){
                				$('#map_clau').val(randomString(10));
                				$('#map_clau').prop('disabled',true);
                			}else{
                				$('#map_clau').prop('disabled',false);
                			}
            	        }
            	});           	
            	
            	 
            	$('#resetClau').on('click',function(){
             		var mapData = {
             			businessId: that.mapConfig.businessId,
             			uid: that.uid
             		};
             		//require ajax
             		resetClauMapa(mapData).then(function(results){
             			that.mapConfig.clau = null;
             			$('#map_clau').val('');
             		});
             	});
            	//require dropzone
    			$('#file-logo').dropzone({ 
    			    url: paramUrl.uploadLogo,
    			    maxFilesize: 100,
    			    maxFiles: 1,
    			    paramName: "uploadfile",
    			    maxThumbnailFilesize: 1,
    			    acceptedFiles: 'image/*',
    			    dictDefaultMessage: "<span lang='ca'>Arrossega aquí la teva imatge del teu escut o logo</span>",
    			    init: function() {
    			      var myDropZone = this;
    			      this.on('success', function(file, json) {
    			    	  myDropZone.removeAllFiles();
    			    	  $(".logo").prop('src',"/logos/"+json.filePath+"?"+ + (+new Date()));
    			      });
    			      this.on('addedfile', function(file) {
    			    	  this.options.url = paramUrl.uploadLogo+"businessId="+that.mapConfig.businessId;
    			      });
    			    }
    			});
    			
    			//require colorPallete
    		    $('#colorpalette_menu_bar').colorPalette()
    		      .on('selectColor', function(e) {
    		    	$("#dv_fill_menu_bar").css("background-color",e.color);
    		    	$("#in_fill_menu_bar").val(e.color);
    		    });
    		    
    		    $('#colorpalette_text_bar').colorPalette()
    		      .on('selectColor', function(e) {
    		    	$("#dv_color_text_bar").css("background-color",e.color);
    		    	$("#in_color_text_bar").val(e.color);
    		    });
            	
    		    $("#in_fill_menu_bar").on('keyup',function(){
    		    	var _this = $(this).val();
    		    	if(isHexColor(_this)){
    		    		$("#dv_fill_menu_bar").css("background-color",_this);
    		    	}
    		    });
    		    
    		    $("#in_color_text_bar").on('keyup',function(){
    		    	var _this = $(this).val();
    		    	if(isHexColor(_this)){
    		    		$("#dv_color_text_bar").css("background-color",_this);
    		    	}
    		    });
    		    
    		    $('#dialgo_publicar .btn-primary').on('click',function(){
    				that._loadPublicarData(false);
    			});
    		    
        	});
        	
        	$.get("templates/modalPublicarRandom.html",function(data){
        		//TODO ver como pasar el modal container
        		$('#mapa_modals').append(data);
        	});
        	
        },
        
        _addHtmlModalIframePublicar: function(){
        	$.get("templates/modalIframePublicar.html",function(data){
        		//TODO ver como pasar el modal container
        		$('#mapa_modals').append(data);
        	});
        },
        
        _getUrlMap: function(){
        	var v_url = window.location.href;
        	if (!url('?id')){
        		v_url += "&id="+$('#userId').val();
        	}
        	v_url = v_url.replace('localhost',DOMINI);
        	v_url = v_url.replace('mapa','visor');
        	return v_url;
        },
        
        _addShareButtons: function(){
        	var that = this;
        	$('#socialSharePublicar').html('');
        	var v_url = that._getUrlMap();
        	if (v_url.indexOf("mapacolaboratiu=si")>-1) v_url=v_url.replace("&mapacolaboratiu=si","");
        	//require ajax
        	shortUrl(v_url).then(function(results){
        		//require share
        		$('#socialSharePublicar').share({
        			networks: ['email','facebook','googleplus','twitter','linkedin','pinterest'],
        			theme: 'square',
        			urlToShare: results.id
        		});
        		
        		$('#socialSharePublicar .pop-social').on('click', function(event){
        			_gaq.push(['_trackEvent', $(this).attr('data-from'), tipus_user+'compartir-publicar', $(this).attr('data-type'), 1]);
        			window.open($(this).attr('href'),'t','toolbar=0,resizable=1,status=0,width=640,height=528');
                    return false;
        		});				
        	});
        },
        
        _updateDownloadableData: function(){
        	var downloadableDataPub = {};
        	$(".downloadable-subrow").each(function(index,element){
        		var businessId = $(element).attr('data-businessid');
        		var obj = {
    				chck : $(element).children( "div.icheckbox_flat-blue").hasClass('checked'),
    				businessId : businessId
        		};
        		if(downloadableDataPub[businessId]){
        			downloadableDataPub[businessId] = [];			
        		}
        		if(!downloadableDataPub[businessId]){
        			downloadableDataPub[businessId] = [];			
        		}
        		downloadableDataPub[businessId].push(obj);
        	});	
        	this.downloadableData = downloadableDataPub;
        	downloadableData = downloadableDataPub;
        },
        
        _loadPublicarData: function(fromCompartir){
        	this.fromCompartir = fromCompartir;
        	//requiere utils
        	if(!fromCompartir){//Si no venim de compartir, fem validacions del dialeg de publicar
        		if(isBlank($('#dialgo_publicar #nomAplicacioPub').val())){
        			$('#dialgo_publicar #nomAplicacioPub').addClass("invalid");
        			$('#dialgo_publicar #nomAplicacioPub').nextAll('.text_error').remove();
        			$('#dialgo_publicar #nomAplicacioPub').after("<span class=\"text_error\" lang=\"ca\">"+window.lang.convert('El camp no pot estar buit')+"</span>");
        			return false;
        		}else if(isDefaultMapTitle($('#dialgo_publicar #nomAplicacioPub').val())){
        			$('#dialgo_publicar #nomAplicacioPub').addClass("invalid");
        			$('#dialgo_publicar #nomAplicacioPub').nextAll('.text_error').remove();
        			$('#dialgo_publicar #nomAplicacioPub').after("<span class=\"text_error\" lang=\"ca\">"+window.lang.convert("Introdueix un nom vàlid per a la publicació del mapa")+"</span>");
        			return false;
        		}
        	}
        	
        	$.publish('getMap','publicar/');
        },
        
        _publicarMapa: function(){
        	var that = this;
        	var options = {};
        	var _map = this.map;
        	options.tags = $('#dialgo_publicar #optTags').val();
        	options.description = $('#dialgo_publicar #optDescripcio').val();
						
			options.mapa3D=estatMapa3D;
			if(estatMapa3D){					
				disparaEventMapa=false;
				mapaEstatNOPublicacio=false;					
				mapaVista3D.getPosicioCamera3D().then(function (cameraPos) {		
				options.camera3D=cameraPos;								
				});								
							
				mapaVista3D.retornaPosicio2D().then(function (bbox) {					
					options.center = bbox.centerLat+","+bbox.centerLng;
					options.zoom = bbox.zoomLevel;
					options.bbox = bbox.lng0+","+bbox.lat0+","+bbox.lng1+","+bbox.lat1;
				});
				
			}else{
				options.center = _map.getCenter().lat+","+_map.getCenter().lng;
				options.zoom = _map.getZoom();
				options.bbox = _map.getBounds().toBBoxString();
			}	
        	
			var logo = null;
        	if(isGeolocalUser()){
        		//aspecte
            	options.fontType = $('.bfh-selectbox input[type=hidden]').val();
            	options.textColor = rgb2hex($('#dv_color_text_bar').css('background-color'));
            	options.barColor = rgb2hex($('#dv_fill_menu_bar').css('background-color'));
            	options.contacte = $('#contacte').val();
            	if($(".logo").prop('src') != '/logos/blank.gif'){
            		logo = $(".logo").prop('src').match(/([\w\d_-]*)\.?[^\\\/]*$/i)[0];
            		if(logo.indexOf('?') != -1){
            			logo = logo.substring(0,logo.indexOf('?'));
                	}
            	}
        	}
        	
        	var visibilitat = visibilitat_open;
        	
        	if ($("input[name=publicitat]:checked").val()=="public"){        	
        		visibilitat = visibilitat_open;
        	}else{
        		visibilitat = visibilitat_privat;
        	}
        		
        	//TODO de los botones ver nuevos botones
        	options.llegenda = $('#llegenda_chk').bootstrapSwitch('state');
        	
        	if ($('#llegenda_chk2').bootstrapSwitch('state')){
        		options.tipusllegenda="dinamica";
        	}        		
        	else{
        		options.tipusllegenda="estatica";
        	}
        	
        	if(options.llegenda){
        		//TODO funcion en el modulo
        		//require geocat.legend
        		updateMapLegendData();
        	}else{
        		mapLegend = {};
        	}
        	
        	//Revisio de capes amb permis de descarrega
        	this._updateDownloadableData();
        	
        	//Revisamos los parametros del visor e iframe
        	this._updateParamsData();
        	
        	options.layers = true;
        	options.social = true;
        	options.fons = _map.getActiveMap();
        	options.fonsColor = _map.getMapColor();
        	options.idusr = $('#userId').val();
        	//Issue #467: S'ha de respectar el que es selecciona al publicar sobre si una capa és descarregable o no.
        	options.downloadable = this.downloadableData;
        	options.params = this.paramsData; 
        	
        	options = JSON.stringify(options);
        		
        	var newMap = true;
        	
        	if ($('#businessId').val() != ""){
        		newMap = false;
        	}
        	
        	var layers = $(".leaflet-control-layers-selector").map(function(){
        		return {businessId: this.id.replace('input-',''), activa: $(this).is(':checked')};
        	}).get();
        	        	
        	//Atencio miro estat de les capes
        	reOrderGroupsAndLayers(true); 	
        	
        	var nomApp = $('#nomAplicacio').html();
        	
        	if(!that.fromCompartir) nomApp = $('#dialgo_publicar #nomAplicacioPub').val();
        	
        	var nomIndexacio=nomApp;			
        	(nomIndexacio.length > 100)?nomIndexacio=nomIndexacio.substring(0,100):nomIndexacio;			
        	//nomIndexacio=nomIndexacio.replace(/[^0-9a-zA-Z ]/g, "");
        	//nomIndexacio=nomIndexacio.replace(/\s/g, "-");
			nomIndexacio= encodeURI(nomIndexacio);
        	
        	var urlMap = that._getUrlMap(); 
        	urlMap=urlMap+"&title="+nomIndexacio;
        	
        	urlMap = urlMap.replace('mapa','visor');		
			urlMap = urlMap.replace('#no-back-button','');
			urlMap=urlMap+"&3D="+estatMapa3D;
        	
        	$("#urlVisorMap a").attr("href", urlMap);
        	
        	$('#urlMap').val(urlMap);
        	$('#iframeMap').val('<iframe width="640" height="480" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="'+urlMap+'&embed=1" ></iframe>');
        	
        	var data = {
        		nom: nomApp, //jQuery('#dialgo_publicar #nomAplicacio').val(),
        		uid: that.uid,
        		visibilitat: visibilitat,
        		tipusApp: 'vis',
        		options: options,
        		logo: logo,
        		legend: JSON.stringify(mapLegend),
        		layers: JSON.stringify(layers)
        	};
        	
        	//Enregistrem tipus de fons i visibilitat
        	_gaq.push(['_trackEvent', 'mapa', tipus_user+'publicar', visibilitat+"#"+_map.options.typeMap, 1]);

        	//crear los archivos en disco
        	var layersId = getBusinessIdOrigenLayers();
        	var laydata = {
        		uid: that.uid,
        		servidorWMSbusinessId: layersId
        	};
        	//require ajax
        	publicarCapesMapa(laydata);
        	
        	//Captura Map per la Galeria
        	//require geocat.canvas
        	capturaPantalla(CAPTURA_GALERIA);
        	this.createWMSFromMap();
        	
        	if(!that.mapConfig.clau){
        		if ($("input[name=privacitat]:checked").val()=="restringit"){    	
        			if($.trim($('#map_clau').val()) != ""){
        				data.clauVisor = $.trim($('#map_clau').val());
        			}
        		}
        		this._callPublicarMapa(data, newMap, that.fromCompartir);
        	}else{
        		if($("input[name=privacitat]:checked").val()=="obert" || visibilitat == visibilitat_open){
        			var mapData = {
        				businessId: that.mapConfig.businessId,
        				uid: that.uid
        			};
        			//require ajax
        			resetClauMapa(mapData).then(function(results){
        				that.mapConfig.clau = null;
        				$('#map_clau').val('');
        				that._callPublicarMapa(data, newMap, that.fromCompartir);
        			});
        		}else{
        			that._callPublicarMapa(data, newMap, that.fromCompartir);
        		}
        	}
        	
        },
        
        _callPublicarMapa: function(data, newMap, fromCompartir){
        	var that = this;
        	if (newMap){
        		//require ajax
        		createMap(data).then(function(results){
        			if (results.status == "ERROR"){
        				//TODO Mensaje de error
        			}else{
        				var mapConfig = results.results;
        				mapConfig.options = $.parseJSON( mapConfig.options );
        				mapConfig.newMap = false;
        				that._setMapConfig(mapConfig);
        				
        				$.publish('updateMapConfig', mapConfig);
        				
        				var mapData = {
        					businessId: that.mapConfig.businessId,
        					uid: that.uid
        				};
        				//require ajax
        				publicarMapConfig(mapData);
        				
        				$('#businessId').val(that.mapConfig.businessId);
        			}
        		});
        	}else{
        		data.businessId = $('#businessId').val();
        		//require ajax
        		updateMap(data).then(function(results){
        			if (results.status == "ERROR"){
        				//TODO Mensaje de error
        			}else{
        				var mapConfig = results.results;
        				mapConfig.options = $.parseJSON( mapConfig.options );
        				mapConfig.newMap = false;
        				that._setMapConfig(mapConfig);
        				
        				$.publish('updateMapConfig', mapConfig);
        				        				
        				var mapData = {
        					businessId: that.mapConfig.businessId,
        					uid: that.uid
        				};
        				
        				//require ajax
        				publicarMapConfig(mapData);
        				
        				if(!fromCompartir){
        					$('#dialgo_publicar').modal('hide');
        					//update map name en el control de capas
        					$('#nomAplicacio').text(that.mapConfig.nomAplicacio);
        					$('#nomAplicacio').editable('setValue', that.mapConfig.nomAplicacio);
        					$('#dialgo_url_iframe').modal('show');
        					that._addShareButtons();
							
							jQuery('#dialgo_url_iframe').on('hidden.bs.modal', function (e) {
								if(estatMapa3D){
									disparaEventMapa=true;
									mapaEstatNOPublicacio=true;	
								}
							});	
						}
        			}
        		});
        	}
        },
        
        _createModalConfigDownload: function(){
        	var count = 0;
        	var html = window.lang.convert('Escull les capes de dades que els altres usuaris d\'Instamaps podran baixar-se i reutilitzar')+'<br/><br/>'; 
        	html += '<label class="control-label" lang="ca">'+
        		window.lang.convert('Capes reutilitzables pels altres usuaris:')+
        		'</label>&nbsp;<span class="glyphicon glyphicon-download-alt"></span>';
        	
        	html += '<div id="div_downloadable">'+
        			'<div class="separate-downloadable-row-all"></div>'+
        			'<div class="downloadable-subrow-all">'+
        			'<div class="col-md-9 downloadable-name-all">'+
        				window.lang.convert('Totes')+
        			'</div>'+
        			'<input id="downloadable-chck-all" class="col-md-1 download-chck" type="checkbox">'+
        			'</div>';
        	html += '<div class="separate-downloadable-row-all"></div>';	
        	
        	$.each(controlCapes._layers, function(i, item){
        		var layer = item.layer;
        		var layerName = layer.options.nom;
        		var checked = "";
        		
        		var tipusLayer = "";
        		if(layer.options.tipus) tipusLayer = layer.options.tipus;        		
        		//Si no es WMS
        		if(tipusLayer.indexOf(t_wms)== -1){
        			//Si té checkec definit
        			if(downloadableData[layer.options.businessId]){
        				if(downloadableData[layer.options.businessId][0].chck) {
        					checked = 'checked="checked"';
        				}
        			}else{//Sino per defecte check
        				checked = 'checked="checked"'
        			}		
        			
        			html += '<div class="downloadable-subrow" data-businessid="'+layer.options.businessId+'">'+
        						'<div class="col-md-9 downloadable-name">'+
        							layerName+
        						'</div>'+
        						'<input id="downloadable-chck" class="col-md-1 downloadable-chck" type="checkbox" '+checked+' >'+
        					'</div>';		
        			html+='<div class="separate-downloadable-row"></div>';			
        		}
        	});	
        	
        	$('#dialgo_publicar #id_reuse').html(html);	
        	
        	$('#div_downloadable input').iCheck({
        	    checkboxClass: 'icheckbox_flat-blue',
        	    radioClass: 'iradio_flat-blue'
        	});
        	
        	$('.downloadable-subrow-all input').on({
        		'ifChecked': function(event){
        			$('.downloadable-subrow input').iCheck('check');
        		},
        		'ifUnchecked': function(event){
        			$('.downloadable-subrow input').iCheck('uncheck');
        		} 
        	});
        },
        
        _createModalVisor: function(){
        	var self = this,
        	count = 0,
        	html = "";
        	        	
        	var source = $("#list-parameter-fields").html();
        	var template = Handlebars.compile(source);
        	html = template(self.params_visor);
        
        	$('#dialgo_publicar .list-parameters').html(html);	
        	
        	$('#div_params_visor input').iCheck({
        	    checkboxClass: 'icheckbox_flat-blue',
        	    radioClass: 'iradio_flat-blue'
        	});
        	
        	self._loadConfigParams();
        	
        	$('.visor-subrow-all #visor-chck-all').on({
        		'ifChecked': function(event){
        			$('.visor-subrow .visor-chck').iCheck('check');
        		},
        		'ifUnchecked': function(event){
        			$('.visor-subrow .visor-chck').iCheck('uncheck');
        		} 
        	});
        	
        	$('.visor-subrow-all #iframe-chck-all').on({
        		'ifChecked': function(event){
        			$('.visor-subrow .iframe-chck').iCheck('check');
        		},
        		'ifUnchecked': function(event){
        			$('.visor-subrow .iframe-chck').iCheck('uncheck');
        		} 
        	});
        },
        
        _updateParamsData: function(){
        	var self = this;
        	var paramsDataPub = {iframe:{}, visor:{}};
        	
        	$('.col-visor div.icheckbox_flat-blue').map(function(){
        		var _$this = $(this);
        		var paramname = _$this.closest( ".visor-subrow" ).data('param');
        		if(_$this.hasClass('checked')){
        			paramsDataPub.visor[paramname] = 1;
        		}else{
        			paramsDataPub.visor[paramname] = 0;
        		}
        	});
        	
        	$('.col-iframe div.icheckbox_flat-blue').map(function(){
        		var _$this = $(this);
        		var paramname = _$this.closest( ".visor-subrow" ).data('param');
        		if(_$this.hasClass('checked')){
        			paramsDataPub.iframe[paramname] = 1;
        		}else{
        			paramsDataPub.iframe[paramname] = 0;
        		}
        	});
        	self.paramsData = paramsDataPub;
        },
        
        _loadConfigParams: function(){
        	var self = this,
        	mapConfig = self.mapConfig;
        	if(mapConfig.options!=null && mapConfig.options.params){
        		var params = mapConfig.options.params;
        		if(!$.isEmptyObject(params.visor)){
        			var visor = params.visor;
        			$.each(visor, function(key, value){
        				var selector = '.visor-subrow[data-param="'+key+'"]';
        				var elem = $(selector).find('.visor-chck');
        				if(value === 1){
        					elem.iCheck('check');
        				}else{
        					elem.iCheck('uncheck');
                		}
        			});
        		}
        		if(!$.isEmptyObject(params.iframe)){
        			var iframe = params.iframe;
        			$.each(iframe, function(key, value){
        				var selector = '.visor-subrow[data-param="'+key+'"]';
        				var elem = $(selector).find('.iframe-chck');
        				if(value === 1){
        					elem.iCheck('check');
        				}else{
        					elem.iCheck('uncheck');
                		}
        			});
        		}
        	}
        },
        
        //********* Nova funcio per crear WMS*************//
        createWMSFromMap:function(){
        	var data=getCapesVectorActives();
        	
        	data.request="createWMSfromMap";
            data.entitatUid=_UsrID,
            data.businessId=mapConfig.businessId;
            data.nomAplicacio=mapConfig.nomAplicacio;
            data.modeMapa=getModeMapa();                                           
            
            createMapToWMS(data).then(
                        
            function(results) {
            	if (results.status == "OK") {
            		$('#div_urlMapWMS').show();
                    $('#urlMapWMS').val(results.url);
                }else if (results.status == "VOID") {  
                	$('#div_urlMapWMS').hide();
                }else{
                    $('#div_urlMapWMS').hide();
                    $('#urlMapWMS').val(results.msg);
                }
        	});
        },
        /**********Events**************/
        
        bindEvents: function(){
        	//$.publish('galeria/load',{mas:1,del:"asdasdasd"});
        },
        
        subscriptions: function() {
        	var that = this;
        	$.subscribe('publicar/loadMapConfig',function(e, data){
        		that._setMapConfig(data);
        		that._updateModalPublicar();
        	});
        	
        	$.subscribe('publicar/setMap',function(e, data){
        		that._setMap(data);
        		that._publicarMapa();
        	});
        	
        	//Here is where the Observer Pattern kicks in nicely
            //I'm done with the listeners, and I'm letting everyone that is subscribed know that.
            //You can also namespace easily with "/" like so: ("enable/Select") or ("enable/Move") etc.
            $.publish( "listeners/are/set/up" );
        }
   	}
   
   	//Registre module if AMD is present:
   	if(typeof define === "function" && define.amd){
   		define([], function(){return Publicar.init();} );
   	}
   	
   	//Initialize the whole thing. Can be referenced anywhere in your code after it has been declared.
   	window.Publicar = Publicar.init();
})( jQuery, window, document );
