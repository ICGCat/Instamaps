/**
 * 
 * require: WidgetsGeolocal, 
 */
;(function(global, $){

	var VisorGeolocal = function(options){
		return new VisorGeolocal.init(options);
	};
	
	var visorOptions = {
		controls: {},
	};
	
	VisorGeolocal.prototype = {
			
		addWidgetsControl: function(){
			var self = this,
			ctr_widgets,
			visor = self.visor,
			_map = visor.map;
			
			ctr_widgets = L.control.widgets({
				title: window.lang.convert('Ginys')
			});
			ctr_widgets.addTo(_map);
			
			self.controls.widgetsControl = ctr_widgets;
			
			return self;
		},
		
		resizeMap: function(){
			var self = this,
			visor = self.visor,
			map = visor.visor,
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
					widgets: false
				};
			}else{
				optionsBtn = {
					widgets: true
				};
			}
			self._redrawButtons(optionsBtn);
			return self;
		},
		
		_redrawButtons: function(options){
			var self = this;
			
			if(options.widgets && self.controls.widgetsControl){
				self.controls.widgetsControl.showBtn();
			}else if(self.controls.widgetsControl){
				self.controls.widgetsControl.hideBtn();
			}
		},
		
		_loadPublicMap: function(mapConfig){
			var self = this,
			visor = self.visor,
			map = visor.map,
			nomUser = mapConfig.entitatUid.split("@"),
			nomEntitat = mapConfig.nomEntitat,
			infoHtml = '';
			
			//TODO  ver si podemos usar un objeto usuario para almacenar este tipo de cosas.
			//cambiamos la cookie del perfil
			$.cookie('perfil', 'geolocal', {path:'/'});
			checkUserLogin();
			
			//cambiamos el info
			infoHtml += '<div style="color:#ffffff">';
			if (nomEntitat!=undefined) infoHtml +='<p>'+nomEntitat+'</p>';
			infoHtml += '</div>';
			
			//destruir el creado en el visor
			$('#infoMap').popover('destroy');
			$('#infoMap').popover({
				placement : 'bottom',
				html: true,
				content: infoHtml
			});
			$('#infoMap').on('show.bs.popover', function () {
				$(this).attr('data-original-title', window.lang.convert($(this).data('lang-title')));		
			});
			
			_gaq.push(['_setAccount', 'UA-46332195-6']);
			$('.brand-txt').hide();//#496: Traiem "Instamaps" dels visors de Geolocal
			$('.img-circle2-icon').hide();

			if (mapConfig.options.barColor){
				$('#navbar-visor').css('background-color', mapConfig.options.barColor);
			}

			if (mapConfig.options.textColor){
				$('#navbar-visor').css('color', mapConfig.options.textColor).css('border-color', '#ffffff');
				$('.navbar-brand').css('color', mapConfig.options.textColor);
				$('#mapTitle').css('color', mapConfig.options.textColor);
				$('#mapTitle h3').css('color', '#ffffff');
				$('.navbar-inverse .navbar-nav > li > a').css('color', mapConfig.options.textColor);
				$('#menu_user > a > span').removeClass('green').css('color', mapConfig.options.textColor);
				$('.navbar-form').css('border-color', 'transparent');
				$('.bt-sessio').css('border-color', '#ffffff');
			}

			if (mapConfig.options.fontType){
				$('#navbar-visor').css('font-family', mapConfig.options.fontType);
			}

			$('.escut').show();
			if (mapConfig.logo){
				$('.escut img').prop('src', '/logos/'+mapConfig.logo);
			}
			
			return self;
		},
		
		drawEmbed: function(){
			var self = this;
			
			self.widgetscontrol = true;
			
			return self;
		},
		
		draw: function(){
			var self = this,
			visor = self.visor,
			map = visor.map,
			mapConfig = visor._mapConfig;
			
			$(window).resize(_.debounce(function(){
				self.resizeMap();
			},150));
			
			self._listenEvents();
			
			if(visor.embed){
				self.drawEmbed();
			}
			
			if(!visor.rtoolbar){
				if(!self.widgetscontrol){
					self.addWidgetsControl();
				}
			}
			
			self._addLogosGeolocal();
			
			self._loadPublicMap(mapConfig);
			
			return self;
		},
		
		_addLogosGeolocal: function(){
			var self = this,
			visor = self.visor,
			map = visor.map;
			
			visor.addLogoInstamap();
	   		
	   		$.get("templates/logosGeolocal.html",function(data){
	   			visor.controls.controlLogos.addLogoHtml(data);
			});
			
	   		return self;
		},
		
		_showwigetsEvent: function(){
			$.publish('trackEvent',{event:['_trackEvent', 'visor', 'widgets']});
		},
		
		_listenEvents: function(){
			var self = this,
			visor = self.visor,
			_map = visor.map;
			if(_map){
				_map.on('showwigets', self._showwigetsEvent, self);
			}
		}
		
	};
	
	VisorGeolocal.init = function(options){
		var self = this;
		self = $.extend(self, visorOptions, options);
	};
	
	VisorGeolocal.init.prototype = VisorGeolocal.prototype;
	
	global.VisorGeolocal = VisorGeolocal;
	
}(window, jQuery));