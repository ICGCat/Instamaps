/**
 * L.Control.LegendBtn
 */
L.Control.LegendBtn = L.Control.extend({
	options: {
		position: 'bottomright',
		id: 'mapLegend',
		className: 'info legend visor-legend mCustomScrollbar'
	},
	
	onAdd: function(map){
		var self = this,
			options = self.options,
			stop = L.DomEvent.stopPropagation,
			container = L.DomUtil.create('div', options.className);
		
		container.id = options.id;
		container.innerHTML = options.html;
		container.title = options.title;
		
		self._div = container;
		//map.on('loadlegend', this._updateMapConfig, this);
		
		L.DomEvent
			.on(container, 'click', stop)
			.on(container, 'mousedown', stop)
			.on(container, 'dblclick', stop)
			.on(container, 'click', L.DomEvent.preventDefault)
			.on(container, 'click', self._toggle, self);
		
		return container;
	},
	
	hide: function() {
		L.DomUtil.removeClass(this._div, 'greenfort');
		L.DomUtil.addClass(this._div, 'grisfort');
		this.options.control.hide();
	},
	
	show: function(e){
		L.DomUtil.removeClass(this._div, 'grisfort');
		L.DomUtil.addClass(this._div, 'greenfort');
		this.options.control.show();
	},
	
	_toggle: function(e){
		var collapsed = L.DomUtil.hasClass(this._div, 'grisfort');
		this[collapsed ? 'show' : 'hide']();
	}
	
});

L.control.legenbtn = function(options){
	return new L.Control.LegendBtn(options);
};