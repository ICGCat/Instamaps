/**
 * require geocat.ajax-1.0.0
 * require geocat.web-1.0.0
 * require geocat.mapa.edit-data-table
 * require url.min
 * require leaflet
 * require L.IM_Map
 * require L.IM_controlFons
 * require jQuery.cookie
 * require geocat.utils
 * require geocat.constants
 * require instamaps.visor.geolocal
 */

;(function(global, $){
	
	var Visor = function(options){
		return new Visor.init(options);
	}
	
	var map_ = new L.IM_Map('map', {
	  	zoomAnimation:false,
        typeMap : 'topoMapGeo',
        minZoom: 2,
        maxZoom : 19,
        zoomControl: true,
        timeDimension: true,
	    timeDimensionControl: true,
	    timeDimensionControlOptions:{
	    	speedSlider:false
	    }
	}).setView([ 41.431, 1.8580 ], 8);
	
	var visorOptions = {
		addDefaultZoomControl: true,
		controls: {},
		map: map_
	};
	
	var changeInitVisor = function(){
		$('.container').css('width','95%');
		//TODO ver como hacer para no depender del timeout
		//if (!isIframeOrEmbed()) setTimeout('activaPanelCapes(false)',3000);
	};
	
	Visor.prototype = {
		addLogoInstamap: function(){
			var self = this;
			$.get("templates/logoInstamaps.html",function(data){
				self.controls.controlLogos.addLogoHtml(data);
			});
   			
			return self;
   		},
   		
   		removeLogoInstamap: function(){
			var self = this;
			self.controls.controlLogos.removeLogo({
				className: 'logo_instamaps'
			});
			
			return self;
   		},
   		
   		resizeMap: function(){
			var self = this,
			map = self.map,
			optionsBtn = {},
			factorH = 0,
			factorW = 0,
			_window = $( window ),
			widthW = _window.width(),
			heightW = _window.height(),
			_mapDiv = $('#map'),
			cl = jQuery('.bt_llista span').attr('class');
			if(self.embed){//Pel cas visor, embeded
				factorH = 0;
			}else{
				factorH = $('.navbar').css('height').replace(/[^-\d\.]/g, '');
			}
			_mapDiv.css('top', factorH + 'px');
			_mapDiv.height(heightW - factorH);
			_mapDiv.width(widthW - factorW);
						
			if(widthW<500 || heightW<=350){
				optionsBtn = {
					openInstamaps: true,	
					home: false,
					routing: false,
					search: false,
					location: false,
					share: false,
					snapshot: false,
					print: false,
					geopdf: false,
					c3d: false,
					mousePosition: false,
					scale: false,
					fons: false,
					legend: false,
					layers: false,
					minimap: false,
					widgets: false
				};
			}else{
				optionsBtn = {
					openInstamaps: false,	
					home: true,
					routing: true,
					search: true,
					location: true,
					share: true,
					snapshot: true,
					print: true,
					geopdf: true,
					c3d: true,
					mousePosition: true,
					scale: true,
					fons: true,
					legend: true,
					layers: true,
					minimap: true,
					widgets: true
				};
			}
			self._redrawButtons(optionsBtn);
			map.invalidateSize();
			/*
			if(self.embed || width<500 || height<=350){
				$('.leaflet-control-gps').attr("style","display:none");
				$('#dv_bt_Find').attr("style","display:none");
				$('#dv_bt_Routing').attr("style","display:none");
				$('.bt_captura').attr("style","display:none");
				$('.bt_print').attr("style","display:none");
				$('.bt_geopdf').attr("style","display:none");
				$('.leaflet-control-mouseposition').attr("style","display:none");
				$('.leaflet-control-scale').attr("style","display:none");
				$('.leaflet-control-minimap').attr("style","display:none");
				activaLlegenda(true);
				if (self.llegenda) setTimeout("activaLlegenda(false)", 500);
			}
			if(width>500){
				$('.leaflet-control-gps').attr("style","display:block");
				$('#dv_bt_Find').attr("style","display:block");
				$('#dv_bt_Routing').attr("style","display:block");
				$('.bt_captura').attr("style","display:block");
				$('.bt_print').attr("style","display:block");
				$('.bt_geopdf').attr("style","display:block");
				$('.leaflet-control-mouseposition').attr("style","display:block");
				$('.leaflet-control-scale').attr("style","display:block");
				$('.leaflet-control-minimap').attr("style","display:block");
				activaLlegenda(true);
				if (self.llegenda) setTimeout("activaLlegenda(false)", 500);
			}
			if(self.embed && widthW<=360) {
				$('.bt_llista').attr("style","display:none");
				$('.leaflet-control-layers').attr("style","display:none");
			}
			else if (self.embed) {
				$('.bt_llista').attr("style","display:block");
				$('.leaflet-control-layers').attr("style","display:block");
				$('.control-btn-fons').attr("style","display:none");
				activaPanelCapes(false);
			}
			if (cl){
				if (cl.indexOf('grisfort') == -1) {
					jQuery('.bt_llista span').removeClass('greenfort');
					jQuery('.bt_llista span').addClass('grisfort');
				}
			}
			//TODO ver el tema 3D
			if(estatMapa3D){ActDesOpcionsVista3D(true)};
			*/
			return self;
		},
		
		_redrawButtons: function(options){
			var self = this;
			if(options.home && self.controls.homeControl){
				self.controls.homeControl.showBtn();
			}else if(self.controls.homeControl){
				self.controls.homeControl.hideBtn();
			}
			
			if(options.openInstamaps && self.controls.openInstamapsControl){
				self.controls.openInstamapsControl.showBtn();
			}else if(self.controls.openInstamapsControl){
				self.controls.openInstamapsControl.hideBtn();
			}
			
			if(options.routing && self.controls.routingControl){
				self.controls.routingControl.showBtn();
			}else if(self.controls.routingControl){
				self.controls.routingControl.hideBtn();
			}
			
			if(options.location && self.controls.locationControl){
				self.controls.locationControl.showBtn();
			}else if(self.controls.locationControl){
				self.controls.locationControl.hideBtn();
			}
			
			if(options.share && self.controls.shareControl){
				self.controls.shareControl.showBtn();
			}else if(self.controls.shareControl){
				self.controls.shareControl.hideBtn();
			}
			
			if(options.search && self.controls.searchControl){
				self.controls.searchControl.showBtn();
			}else if(self.controls.searchControl){
				self.controls.searchControl.hideBtn();
			}
			
			if(options.snapshot && self.controls.snapshotControl){
				self.controls.snapshotControl.showBtn();
			}else if(self.controls.snapshotControl){
				self.controls.snapshotControl.hideBtn();
			}
			
			if(options.print && self.controls.printControl){
				self.controls.printControl.showBtn();
			}else if(self.controls.printControl){
				self.controls.printControl.hideBtn();
			}
			
			if(options.geopdf && self.controls.geopdfControl){
				self.controls.geopdfControl.showBtn();
			}else if(self.controls.geopdfControl){
				self.controls.geopdfControl.hideBtn();
			}
			
			if(options.c3d && self.controls.control3d){
				self.controls.control3d.showBtn();
			}else if(self.controls.control3d){
				self.controls.control3d.hideBtn();
			}
			
			if(options.mousePosition && self.controls.mousePositionControl){
				self.controls.mousePositionControl.showBtn();
			}else if(self.controls.mousePositionControl){
				self.controls.mousePositionControl.hideBtn();
			}
			
			if(options.scale && self.controls.scaleControl){
				self.controls.scaleControl.showBtn();
			}else if(self.controls.scaleControl){
				self.controls.scaleControl.hideBtn();
			}
			
			if(options.fons && self.controls.fonsControl){
				self.controls.fonsControl.showBtn();
			}else if(self.controls.fonsControl){
				self.controls.fonsControl.hideBtn();
			}
			
			if(options.legend && self.controls.llegendaControl){
				self.controls.llegendaControl.showBtn();
			}else if(self.controls.llegendaControl){
				self.controls.llegendaControl.hideBtn();
			}
			
			if(options.layers && self.controls.layersControl){
				self.controls.layersControl.showBtn();
			}else if(self.controls.layersControl){
				self.controls.layersControl.hideBtn();
			}
			
			if(options.minimap && self.controls.minimapControl){
				self.controls.minimapControl.showBtn();
			}else if(self.controls.minimapControl){
				self.controls.minimapControl.hideBtn();
			}
			return self;
		},
   		
		hideControl: function(control){
			var self = this;
			if(self.controls[control]){
				self.controls[control].hideBtn();
			}
			return self;
		},
		
		showControl: function(control){
			var self = this;
			if(self.controls[control]){
				self.controls[control].showBtn();
			}
			return self;
		},
		
		removeCapes: function(){
			var self = this;
			//var map = self.map;
			//map.removeControl(self.controlCapes);
			$('.bt_llista').hide();
			return self;
		},
		
		drawEmbed: function(){
			var self = this;
			$('#navbar-visor').hide();
			$('#searchBar').css('top', '0');
			self.addDefaultZoomControl = false;
			
			self.mouseposition = true;
			self.scalecontrol = true;
			self.minimapcontrol = true;
			self.fonscontrol = true;
			
			self.openinstamaps = false;
			self.homecontrol = true;
			self.locationcontrol = true;
			self.sharecontrol = true;
			self.searchcontrol = true;
			self.routingcontrol = true;
			
			self.layerscontrol = false;
			self.control3d = true;
			self.snapshotcontrol = true;
			self.printcontrol = true;
			self.geopdfcontrol = true;
			
			self.llegenda = true;
			
			$.publish('trackEvent',{event:['_trackEvent', 'visor', 'embed']});
			return self;
		},
		
		addMousePositionControl: function(){
			var self = this,
			ctr_position,
			_map = self.map;
			ctr_position = L.control.coordinates({
	  			position : 'bottomright',
	  			'emptystring':' ',
	  			'numDigits': 2,
	  			'numDigits2': 6,
	  			'prefix': 'ETRS89 UTM 31N',
	  			'prefix2': 'WGS84',
	  			'separator': ' ',
	  			'showETRS89':true
	  		}).addTo(_map);
			
			self.controls.mousePositionControl = ctr_position;
			
			return self;
		},
		
		addScaleControl: function(){
			var self = this,
			ctr_scale,
			_map = self.map;
			ctr_scale = L.control.escala({
				position : 'bottomright', 
				'metric':true,
				'imperial':false
			}).addTo(_map);
			
			self.controls.scaleControl = ctr_scale;
			
			return self;
		},
		
		addMinimapControl: function(options){
			var self = this,
			_minTopo,
			ctr_minimap,
			_map = self.map,
			_options = { 
				toggleDisplay: true, 
				autoToggleDisplay: false,
				minimized: true,
				mapOptions: {trackResize: false}
			};
			
			_options = $.extend(_options, options);
			
			_minTopo = new L.TileLayer(URL_MQ, {
				minZoom: 0, 
				maxZoom: 19, 
				subdomains:subDomains});
			
			ctr_minimap = L.control.minimapa(_minTopo, _options).addTo(_map)._minimize();
			
			self.controls.minimapControl = ctr_minimap;
			
			return self;
		},
		
		addFonsControl: function(){
			var self = this,
			ctr_fons,
			_map = self.map;
			ctr_fons = new L.IM_controlFons({
				title: window.lang.convert('Escollir el mapa de fons'),
			}).addTo(_map);
			
			self.controls.fonsControl = ctr_fons;
			
			return self;
		},
		
		addLayersControl: function(button){
			var self = this,
			btn_ctr_layers,
			_mapConfig = self.mapConfig,
			_map = self.map;
			
			button = (button !== undefined) ? button : true;
			
			btn_ctr_layers = L.control.layersBtn({
				mapConfig: _mapConfig,
				title: window.lang.convert('Llista de capes'),
				button: button
			});
			btn_ctr_layers.addTo(_map);
			
			self.controls.layersControl = btn_ctr_layers;
			
			return self;
		},
		
		addOpenInstamapsControl: function(){
			var self = this,
			ctr_linkViewMap,
			_map = self.map;
			
			ctr_linkViewMap = L.control.openInstamaps({
				businessid: self.businessid,
				urlwms: self.urlwms,
				layername: self.layername,
				title: window.lang.convert('Veure a InstaMaps'),
				fn: function(event) {
					_gaq.push (['_trackEvent', 'visor', 'veure a instamaps', 'label embed', 1]);
				}
			});
			ctr_linkViewMap.addTo(_map);
			
			self.controls.openInstamapsControl = ctr_linkViewMap;
		},
		
		addHomeControl: function(){
			var self = this,
			ctr_vistaInicial,
			_mapConfig = self.mapConfig,
			_map = self.map;
			
			ctr_vistaInicial = L.control.home({
				mapConfig: _mapConfig,
				title: window.lang.convert('Vista inicial')
			});
			ctr_vistaInicial.addTo(_map);
			
			self.controls.homeControl = ctr_vistaInicial;
			
			return self;
		},
		
		addShareControl: function(){
			var self = this,
			ctr_shareBT,
			v_url = window.location.href,
			_map = self.map;
			
			if(v_url.indexOf('localhost')!=-1){
				v_url = v_url.replace('localhost',DOMINI);
			}
			shortUrl(v_url).then(function(results){
				$('#socialShare_visor').share({
					networks: ['email','facebook','googleplus','twitter','linkedin','pinterest'],
					//orientation: 'vertical',
					//affix: 'left center',
					theme: 'square',
					urlToShare: results.id
				});
			});	
			
			$('.share-square a').attr('target','_blank');
			
			ctr_shareBT = L.control.share({
				title: window.lang.convert('Compartir')
			});
			ctr_shareBT.addTo(_map);
			
			self.controls.shareControl = ctr_shareBT;
			
		},
		
		addRoutingControl: function(){
			var self = this,
			ctr_routingBT,
			_map = self.map;
			
			ctr_routingBT = L.control.routingControl({
				title: window.lang.convert('Routing'),
				lang: web_determinaIdioma()
			});
			
			ctr_routingBT.addTo(_map);
			
			self.controls.routingControl = ctr_routingBT;
			
			return self;
		},
		
		addLocationControl: function(){
			var self = this,
			ctr_gps,
			_map = self.map;
			
			//TODO agregar las opciones por defecto al control
			ctr_gps = L.control.locationControl({
				autoCenter: true,		//move map when gps location change
				style: {
					radius: 6,		//marker circle style
					weight:3,
					color: '#e03',
					fill: true,
					fillColor: '#e03',
					opacity: 1,
					fillOpacity: 0.5},
				title: window.lang.convert('Centrar mapa a la seva ubicació'),
				textErr: window.lang.convert('Error del GPS'),	//error message on alert notification
				callErr: null		//function that run on gps error activating
			});
						
			_map.addControl(ctr_gps);
			
			self.controls.locationControl = ctr_gps;
			
			return self;
		},
		
		addSearchControl: function(){
			var self = this,
			ctr_findBT,
			_map = self.map;
			
			ctr_findBT = L.control.searchControl({
				title: window.lang.convert('Cercar'),
				searchUrl: paramUrl.searchAction+"searchInput={s}",
				inputplaceholderText: window.lang.convert('Cercar llocs al món o coordenades  ...')
			});
			_map.addControl(ctr_findBT);
			//TODO generar el control del search
			//addControlCercaEdit();
			
			self.controls.searchControl = ctr_findBT;
			
			return self;
		},
		
		addSnapshotControl: function(){
			var self = this,
			ctr_snapshot,
			_map = self.map;
			
			ctr_snapshot = L.control.snapshot({
				title: window.lang.convert('Capturar la vista del mapa')
			});
			ctr_snapshot.addTo(_map);
			
			self.controls.snapshotControl = ctr_snapshot;
			
			return self;
		},
		
		addPrintControl: function(){
			var self = this,
			ctr_printmap,
			_map = self.map;
			
			ctr_printmap = L.control.printmap({
				title: window.lang.convert('Imprimir la vista del mapa')
			});
			ctr_printmap.addTo(_map);
			
			self.controls.printControl = ctr_printmap;
			
			return self;
		},
		
		addGeopdfControl: function(){
			var self = this,
			ctr_geopdf,
			_map = self.map;
			
			ctr_geopdf = L.control.geopdf({
				title: window.lang.convert('Descarrega mapa en format GeoPDF')
			});
			ctr_geopdf.addTo(_map);
			
			self.controls.geopdfControl = ctr_geopdf;
			
			return self;
		},
		
		addLlegenda: function(){
			var self = this,
			ctr_legend,
			_map = self.map;
			
			ctr_legend = L.control.legend({
				title: window.lang.convert('Llegenda')
			});
			ctr_legend.addTo(_map);
			
			self.controls.llegendaControl = ctr_legend;
			
			return self;
		},
		
		addControl3d: function(){
			var self = this,
			ctr_3d,
			_map = self.map;
			
			ctr_3d = L.control.control3d({
				title: window.lang.convert('Canviar vista')
			});
			ctr_3d.addTo(_map);
			
			self.controls.control3d = ctr_3d;
			
			return self;
		},
		
		addControlLogos: function(){
			var self = this,
			ctr_logos,
			_map = self.map;
			
			ctr_logos = L.control.logos();
			ctr_logos.addTo(_map);
			
			self.controls.controlLogos = ctr_logos;
			
			return self;
		},
		
		drawMap: function(){
			var self = this,
			_map = self.map;
			map = self.map;
			
			self._listenEvents();
			return self;
		},
		
		drawControls: function(){
			var self = this;
			
			self.addControlLogos();
			
			if(!self.mouseposition){
				self.addMousePositionControl();
			}
			if(!self.scalecontrol){
				self.addScaleControl();
			}
			if(!self.minimapcontrol){
				self.addMinimapControl();
			}
			
			if(!self.fonscontrol){
				self.addFonsControl();
			}
			if(!self.ltoolbar){
				if(self.embed){
					if(!self.openinstamaps ){
						self.addOpenInstamapsControl();
					}
				}
				if(!self.homecontrol){
					self.addHomeControl();
				}
				if(!self.locationcontrol){
					self.addLocationControl();
				}
				if(!self.sharecontrol){
					self.addShareControl();
				}
				if(!self.searchcontrol){
					self.addSearchControl();
				}
				if(!self.routingcontrol){
					self.addRoutingControl();
				}
			}
			
			if(!self.rtoolbar){
				if(!self.layerscontrol){
					self.addLayersControl();
				}else{
					self.addLayersControl(false);
				}
				if(!self.control3d){
					self.addControl3d();
				}
				if(!self.snapshotcontrol){
					self.addSnapshotControl();
				}
				if(!self.printcontrol){
					self.addPrintControl();
				}
				if(!self.geopdfcontrol){
					self.addGeopdfControl();
				}
			}else{
				self.addLayersControl(false);
			}
			
			if(!self.llegenda){
				self.addLlegenda();
			}
			
			return self;
		},
		
		loadErrorPage: function(){
			//TODO redirect a la pagina de error 404
			window.location.href = paramUrl.galeriaPage;
		},
		
		loadLoginPage: function(){
			window.location.href = paramUrl.loginPage;
		},
		
		//hace el redirect para que el invitado al colaborativo pueda ver que puede editar el mapa
		loadMapaColaboratiuPage: function(){
			var self = this,
			_businessid = self.businessid;
			window.location = paramUrl.mapaPage+"?businessid="+_businessid+"&mapacolaboratiu=si";
		},
		
		_loadPasswordModal: function(){
			var self = this,
			_businessid = self.businessid;
			
			$('#dialog_password').modal('show');

			$('#dialog_password .btn-primary').on('click',function(){
				var clau = $.trim($('#inputPassword').val());
				if(clau == ""){
					$('#password_msg').removeClass('hide');
				}else{
					$('#password_msg').addClass('hide');
					var data = {
						clauVisor: clau,
						businessId: _businessid
					};
					loadPrivateMapByBusinessId(data).then(function(results){
						if(results.status == "ERROR"){
							$('#password_msg').removeClass('hide');
						}else{
							self._beforeLoadConfig(results);
							$('#password_msg').addClass('hide');
							$('#dialog_password').modal('hide');
						}
					});
				}
			});
			
			return self;
		},
		
		_colaboratiuToLogin: function(){
			var self = this,
			_uid = self.uid;
			$.removeCookie('uid', { path: '/' });
			$.cookie('collaboratebid', _businessid, {path:'/'});
			$.cookie('collaborateuid', _uid, {path:'/'});
			self.loadLoginPage();
			
			return self;
		},
		
		_beforeLoadConfig: function(results){
			var self = this,
			_map = self.map,
			_uid = self.uid,
			_businessid = self.businessid,
			_mapacolaboratiu = self.mapacolaboratiu;
			
			if ( _mapacolaboratiu && !$.cookie('uid')) {
				self._colaboratiuToLogin();
			}
			else if (_mapacolaboratiu && _uid!=$.cookie('uid')) {
				self._colaboratiuToLogin();
			}
			else if (url('?mapacolaboratiu') && _uid==$.cookie('uid')) {
				self.loadMapaColaboratiuPage();
			}
			var mapConfig = $.parseJSON(results.results);
			if(mapConfig.options){
				mapConfig.options = $.parseJSON(mapConfig.options);
				if(mapConfig.options.llegenda === false){
					self.llegenda = true; //ocultar la llegenda
				}
			}
			self._mapConfig = mapConfig;
			_map.fire('loadconfig', mapConfig);
			$.publish('loadConfig', mapConfig);
			
			return self;
		},
		
		fireLoadConfig: function(){
			var self = this,
			_map = self.map,
			mapConfig = self._mapConfig;
			
			_map.fire('visorconfig', mapConfig);
			
			return self;
		},
		
		loadMapConfig: function(){
			var self = this,
			_map = self.map,
			_uid = self.uid,
			_businessid = self.businessid,
			_mapacolaboratiu = self.mapacolaboratiu,
			data = {
				businessId: _businessid,
				id: _uid,
				mapacolaboratiu: _mapacolaboratiu,
				uid: _uid	
			};
			getCacheMapByBusinessId(data).then(function(results){
				if (results.status == "ERROR"){
					self.loadErrorPage();
				}else if (results.status == "PRIVAT"){
					//ocultar las pelotas
					self._hideLoading();
					//mostar modal con contraseña
					self._loadPasswordModal();
				}else{
					self._beforeLoadConfig(results);
				}
			});
			
			return self;
		},
		
		loadApp: function(){
			var self = this,
			_map = self.map,
			mapConfig = self._mapConfig;
			
			self._loadPublicMap(mapConfig);
			
			return self;
		},
		
		_loadPublicMap: function(mapConfig){
			var self = this,
				nomUser = mapConfig.entitatUid.split("@"),
				nomEntitat = mapConfig.nomEntitat,
				infoHtml = '';
			
			$('meta[name="og:title"]').attr('content', "Mapa "+mapConfig.nomAplicacio);
			
			$.cookie('perfil', 'instamaps', {path:'/'});
			checkUserLogin();
			
			infoHtml += '<p>'+nomUser[0]+'</p>';
			
			if (mapConfig.options){
				var desc=mapConfig.options.description;

				desc==""?desc=mapConfig.nomAplicacio:desc=desc;

				$('meta[name="description"]').attr('content', desc+' - Fet amb InstaMaps.cat');
				$('meta[name="og:description"]').attr('content', desc+' - Fet amb InstaMaps.cat');

				var urlThumbnail = GEOCAT02 + paramUrl.urlgetMapImage+ "&request=getGaleria&update=false&businessid=" + url('?businessid');
				$('meta[name="og:image"]').attr('content', urlThumbnail);

				if (mapConfig.options.description!=undefined) infoHtml += '<p>'+mapConfig.options.description+'</p>';
				if (mapConfig.options.tags!=undefined) infoHtml += '<p>'+mapConfig.options.tags+'</p>';
				
				$('.escut').hide();
			}
			$("#mapTitle").html(mapConfig.nomAplicacio + '<span id="infoMap" lang="ca" class="glyphicon glyphicon-info-sign pop" data-toggle="popover" title="Informació" data-lang-title="Informació" ></span>');

			$('#infoMap').popover({
				placement : 'bottom',
				html: true,
				content: infoHtml
			});

			$('#infoMap').on('show.bs.popover', function () {
				$(this).attr('data-original-title', window.lang.convert($(this).data('lang-title')));		
			});
		
			//TODO quitar la global ya que se usa en el control de capas.
			downloadableData = (mapConfig.options && mapConfig.options.downloadable?
					mapConfig.options.downloadable:[]);
			
			mapConfig.newMap = false;
			$('#nomAplicacio').html(mapConfig.nomAplicacio);
			
			self._loadMapConfig(mapConfig).then(function(){
				
			});
		},
		
		_loadMapConfig: function(mapConfig){
			var self = this,
			_map = self.map,
			_layers = self.instamapsLayers,
			dfd = $.Deferred();
			
			if (!$.isEmptyObject( mapConfig )){
				
				$('#businessId').val(mapConfig.businessId);
				//TODO ver los errores de leaflet al cambiar el mapa de fondo
				//cambiar el mapa de fondo a orto y gris
				if (mapConfig.options != null){
					var fons = mapConfig.options.fons;
					if (fons == 'topoMap'){
						_map.topoMap();
					}else if (fons == 'topoMapGeo') {
						_map.topoMapGeo();
					}else if (fons == 'ortoMap') {
						_map.ortoMap();
					}else if (fons == 'terrainMap') {
						_map.terrainMap();
					}else if (fons == 'topoGrisMap') {
						_map.topoGrisMap();
					}else if (fons == 'historicOrtoMap') {
						_map.historicOrtoMap();
					}else if (fons == 'historicMap') {
						_map.historicMap();
					}else if (fons == 'hibridMap'){
						_map.hibridMap();
					}else if (fons == 'historicOrtoMap46'){
						_map.historicOrtoMap46();
					}else if (fons == 'alcadaMap'){
						_map.alcadaMap();
					}else if (fons == 'colorMap') {
						_map.colorMap(mapConfig.options.fonsColor);
					}else if (fons == 'naturalMap') {
						_map.naturalMap();
					}else if (fons == 'divadminMap') {
						_map.divadminMap();
					}
					_map.setActiveMap(mapConfig.options.fons);
					_map.setMapColor(mapConfig.options.fonsColor);
				}
				
				//carga las capas en el mapa
				var controlCapes = (self.controls.layersControl) ? self.controls.layersControl.control : null;
				_layers._loadAllLayers(mapConfig, controlCapes).then(function(){
					self._updateLayerControl();
				});
				
				self._hideLoading();
			}
			dfd.resolve();
			return dfd.promise();
		},
				
		_drawVisor: function(){
			var self = this,
			map = self.map,
			mapConfig = self._mapConfig;
			
			if(self.embed){
				self.drawEmbed();
			}
			
			if(mapConfig.tipusAplicacioId == TIPUS_APLIACIO_INSTAMAPS){
				self._initCenter().drawMap().resizeMap().drawControls().fireLoadConfig().loadApp()._addTooltips()._hideLoading();
				
				if(self.embed){
					self.addLogoInstamap();
				}
				
			}else if(mapConfig.tipusAplicacioId == TIPUS_APLIACIO_GEOLOCAL){
				self._initCenter().drawMap().resizeMap().drawControls().fireLoadConfig().loadApp()
				._drawVisorGeolocal()._addTooltips()._hideLoading();
			}
			
			return self;
		},
		
		_drawVisorGeolocal: function(){
			var self = this;
			
			var visorGeolocal = VisorGeolocal({visor:self}).draw();
			
			return self;
		},
		
		_drawVisorSimple: function(){
			var self = this;
			
			var visorSimple = VisorSimple({visor:self}).draw();
			
			return self;
		},
		
		_initCenter: function(){
			var self = this,
			_map = self.map,
			mapConfig = self._mapConfig;
			
			var hash = location.hash;
			hashControl = new L.Hash(_map);
			var parsed = hashControl.parseHash(hash);
			if (parsed){
				hashControl.update();
			}else{
				if(mapConfig.options){
					if (mapConfig.options.center){
						var opcenter = mapConfig.options.center.split(",");
						_map.setView(L.latLng(opcenter[0], opcenter[1]), mapConfig.options.zoom);
					}else if (mapConfig.options.bbox){
						var bbox = mapConfig.options.bbox.split(",");
						var southWest = L.latLng(bbox[1], bbox[0]);
					    var northEast = L.latLng(bbox[3], bbox[2]);
					    var bounds = L.latLngBounds(southWest, northEast);
					    _map.fitBounds( bounds );
					}
				}
			}
			return self;
		},
		
		draw: function(){
			var self = this,
			   	_map = self.map;
			
			changeInitVisor();
			
			$(window).resize(_.debounce(function(){
				self.resizeMap();
			},150));
			
			if(self.businessid){
				self.loadMapConfig();
				_map.on('loadconfig', self._drawVisor, self);
			}else{
				if(self.urlwms){ //cloudifier
					if(self.embed){
						self.drawEmbed();
					}
					self.drawMap().resizeMap().drawControls()._drawVisorSimple()._hideLoading();
				}else{
					self.loadErrorPage();
				}
			}
			
			if(!self.embed){
				$.publish('trackEvent',{event:['_trackEvent', 'visor', 'no embed']});
			}
		},
		
		_addTooltips: function(){
			var self = this;
			$('[data-toggle="tooltip"]').tooltip({container: 'body'});
			return self;
		},
		
		_updateLang: function(e, data){
			var self = this;
			//TODO esto deberia ir en cada control que es responsable de toda su funcionalidad
			jQuery('body').on('show.bs.tooltip','[data-toggle="tooltip"]',function(){
				jQuery(this).attr('data-original-title', window.lang.convert(jQuery(this).data('lang-title')));
			});
			//Add tooltip caixa cerca
			jQuery(".leaflet-control-search .search-button, .glyphicon-search").attr('title',window.lang.convert('Cercar llocs o coordenades ...'));
			jQuery(".leaflet-control-search .search-input").attr('placeholder',window.lang.convert('Cercar llocs o coordenades ...'));
			
			return self;
		},
		
		_updateLayerControl: function(e, data){
			var self = this;
			var controlCapes = (self.controls.layersControl) ? self.controls.layersControl.control : null;
			if(controlCapes){
				controlCapes.forceUpdate();
			}
			return self;
		},
		
		_showRoutingEvent: function(){
			$.publish('trackEvent',{event:['_trackEvent', 'visor', this.tipusUser+'routing', 'label routing', 1]});
		},
		
		_mapsnapshotEvent: function(){
			$.publish('trackEvent',{event:['_trackEvent', 'visor', this.tipusUser+'captura pantalla', 'label captura', 1]});
		},
		
		_mapprintEvent: function(){
			$.publish('trackEvent',{event:['_trackEvent', 'visor', this.tipusUser+'print', 'label print', 1]});
		},
		
		_mapgeopdfEvent: function(){
			$.publish('trackEvent',{event:['_trackEvent', 'visor', this.tipusUser+'geopdf', 'label geopdf', 1]});
		},
		
		_map3dmodeEvent: function(){
			$.publish('trackEvent',{event:['_trackEvent', 'visor', this.tipusUser + '3D', 'label 3D', 1]});
		},
		
		_hideLoading: function(){
			$('#div_loading').hide();
			return this;
		},
		
		_listenEvents: function(){
			var self = this,
				_map = self.map;
			if(_map){
				_map.on('showRouting', self._showRoutingEvent, self);
				_map.on('mapsnapshot', self._mapsnapshotEvent, self);
				_map.on('mapprint', self._mapprintEvent, self);
				_map.on('mapgeopdf', self._mapgeopdfEvent, self);
				_map.on('map3dmode', self._map3dmodeEvent, self);
			}
			$.subscribe('change-lang',self._updateLang);
		}
	};
	
	Visor.init = function(options){
		var self = this;
		self = $.extend(self, visorOptions, options);
		self.instamapsLayers = InstamapsLayers(visorOptions);
	}
	
	Visor.init.prototype = Visor.prototype;
	
	global.Visor = Visor;
	
}(window, jQuery));