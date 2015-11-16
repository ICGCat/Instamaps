L.Control.OrderLayers = L.Control.Layers.extend({
		options : {
			collapsed : true,
			position : 'topright',
			title: 'Title',
			autoZIndex : false
		},

		initialize : function (baseLayers, groupedOverlays, options) {
			var i,
			j;
			L.Util.setOptions(this, options);

			this._layers = {};
			this._lastZIndex = 0;
			this._handlingClick = false;
			this._groupList = [];
			this._domGroups = [];

			for (i in baseLayers) {
				for (var j in baseLayers[i].layers) {
					this._addLayer(baseLayers[i].layers[j], j, baseLayers[i], false);
				}
			}

			for (i in groupedOverlays) {
				for (var j in groupedOverlays[i].layers) {
					//this._addLayer(groupedOverlays[i].layers[j], j, groupedOverlays[i], true);
					
					this._addLayer(groupedOverlays[i].layers[j], j,true,null, groupedOverlays[i]);
				}
			}
			
			
		},

		onAdd : function (map) {
			this._initLayout();
			this._update();

			map
			.on('layeradd', this._onLayerChange, this)
			.on('layerremove', this._onLayerChange, this);

			return this._container;
		},

		onRemove : function (map) {
			map
			.off('layeradd', this._onLayerChange)
			.off('layerremove', this._onLayerChange);
		},

		addBaseLayer : function (layer, name, group) {
			this._addLayer(layer, name, group, false);
			this._update();
			return this;
		},

		addOverlay: function (layer, name, overlay, groupLeafletId,group) {
			this._addLayer(layer, name, overlay, groupLeafletId,group);
		
		//addOverlay : function (layer, name, group) {
		//	this._addLayer(layer, name, group, true);
			this._update();
			return this;
		},

		removeLayer : function (obj) {
			/*
			var id = L.Util.stamp(layer);
			delete this._layers[id];
			this._update();
			return this;
			*/
			
			
			var id = L.stamp(obj.layer);
			if(!obj.sublayer){
				delete this._layers[id];
			}else{
//				console.debug("this delete:");
			console.debug(this._layers);
				delete this._layers[obj.layerIdParent]._layers[id];
			}

			this._update();
			return this;
			
			
			
			
		},
		
		getLayersFromGroupId:function(groupId){
			var resp_Layer=[];	
			
			for(group in this._groupList){
				
				if( this._groupList[group].id == groupId ){
								 
					for(layer in this._layers){
							console.info(this._layers[layer])	;							
							
							
							for(sublayer in this._layers[layer]._layers){
								console.info(this._layers[layer]._layers[sublayer])	;
								//resp_Layer.push(this._layers[layer]._layers[sublayer]);
							}
							
							
							resp_Layer.push(this._layers[layer]);
							
					}
					
				}
			}
			
		return resp_Layer;
			
			
			
			
		},
		
		updateGroupName:function(oldName,newName,groupId){
		
		var resp_Layer=[];	
			
				for(group in this._groupList){
				
				if( this._groupList[group].groupName == oldName && this._groupList[group].id==groupId){
					
					 this._groupList[group].groupName =newName; 
					 this._groupList[group].name =newName; 					 
					for(layer in this._layers){
										
						if( this._layers[layer].layer.options.group && this._layers[layer].layer.options.group.name == oldName ){
							this._layers[layer].layer.options.group.name = newName;
							resp_Layer.push(this._layers[layer].layer);
							
							for(sublayer in this._layers[layer]._layers){
							this._layers[layer]._layers[sublayer].layer.options.group.name = newName;
								resp_Layer.push(this._layers[layer]._layers[sublayer]);
							}
							
							
							
							
						}
					}
					
				}
			}
			
		return resp_Layer;	
			
		},
		
		removeGroup : function (groupName,groupId){
			console.info("Entro ha esborra he esborrat");
			if(groupName){
				console.info("he esborrat");
				console.info(this._groupList);
				//leaflet-control-accordion-layers-0
			for(group in this._groupList){
				
				if( this._groupList[group].groupName == groupName && this._groupList[group].id == groupId){
					
					
					for(layer in this._layers){
						
						console.info(this._layers[layer]);
						
						if( this._layers[layer].layer.options.group && this._layers[layer].layer.options.group.name == groupName ){
							//var id = L.stamp(obj.layer);
							delete this._layers[layer];
						}
					}
					
					
					console.info("he esborrat");
					console.info(this._groupList[group]);					
					delete this._groupList[group];					
					this._update();
					break;
				}
			}
			
		}
		},	

		_initLayout : function () {
			var modeMapa = ($(location).attr('href').indexOf('/mapa.html')!=-1);
			var className = 'leaflet-control-layers',
			container = this._container = L.DomUtil.create('div', className);

			//Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
			container.setAttribute('aria-haspopup', true);

			if (!L.Browser.touch) {
				L.DomEvent.disableClickPropagation(container);
				L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation);
			} else {
				L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
			}
			
			var section = document.createElement('section');
			section.className = 'ac-container ' + className + '-list';
			
			//var form = this._form = L.DomUtil.create('form');
			
			var form = this._form = L.DomUtil.create('div', className + '-list');
			
			if(this.options.title) {
				var title = L.DomUtil.create('h3', className + '-title editable');
				title.innerHTML = this.options.title;
				title.id='nomAplicacio';
				form.appendChild(title);
			}
			
			
			section.appendChild( form );

			if (this.options.collapsed) {
				if (!L.Browser.android) {
					L.DomEvent
					.on(container, 'mouseover', this._expand, this)
					.on(container, 'mouseout', this._collapse, this);
				}
				var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
				link.href = '#';
				link.title = 'Layers';

				if (L.Browser.touch) {
					L.DomEvent
					.on(link, 'click', L.DomEvent.stop)
					.on(link, 'click', this._expand, this);
				} else {
					L.DomEvent.on(link, 'focus', this._expand, this);
				}

				this._map.on('click', this._collapse, this);
				// TODO keyboard accessibility
				
			} else {
				this._expand();
			}

			
			
			
			
			
			var strLayersList = 'layers-list';
			this._baseLayersList = L.DomUtil.create('div', className + '-base', form);			
			//this._separator = L.DomUtil.create('div', className + '-separator', form);
			this._overlaysList = L.DomUtil.create('div', className + '-overlays ', form);
			this._addButton = L.DomUtil.create('div', 'addVerd', form);		
			var addBT=L.DomEvent.on(this._addButton, 'click', this._addGroupFromScratch, this);
			$(addBT).tooltip({
				placement : 'left',
				container : 'body',
				title : window.lang.convert("Nou grup")
			});
			//this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

			container.appendChild(section);
			
			// process options of ac-container css class - to options.container_width and options.container_maxHeight
			for(var c = 0; c < (containers = container.getElementsByClassName('ac-container')).length; c++ ){
				if (this.options.container_width) {
					containers[c].style.width = this.options.container_width;
				}	
					
				// set the max-height of control to y value of map object
				this._default_maxHeight = this.options.container_maxHeight ?  this.options.container_maxHeight : (this._map._size.y - 70);
				containers[c].style.maxHeight = this._default_maxHeight + "px";
				
			}
			
			window.onresize = this._on_resize_window.bind(this);
			
		},
			
		_on_resize_window : function(){
			// listen to resize of screen to reajust de maxHeight of container
			for(var c = 0; c < containers.length; c++ ){
				// input the new value to height
				containers[c].style.maxHeight = (window.innerHeight-90) < this._removePxToInt(this._default_maxHeight) ? (window.innerHeight - 90) + "px" : this._removePxToInt(this._default_maxHeight) + "px";
			}
		},
    
        // remove the px from a css value and convert to a int
        _removePxToInt: function( value ){
        	//console.info (value);
        	
        	
            if(typeof(value)=="number"){return value;
            }else{return parseInt(value.replace( "px", ""));}
        	
        	
        },

		//_addLayer : function (layer, name, group, overlay) {
		
        _createGroupFromScratch:function(position){
        	console.info("_createGroupFromScratch: pos "+ position);
        	console.info("_createGroupFromScratch: length "+ this._groupList.length);
        	var pos=this._groupList.length;
			var posTXT;						
			if(position== 1 && pos==0){ //estic afegint una capa nova i grup nou				
				console.info("estic afegint una capa nova i no existeix gruo");
				return group={"groupName":"Capes","name":"Capes","id":pos,"expanded":true};				
			}else if(position== 1 && pos>0){ //estic afegint una capa però ja existeix un grup 
				console.info("estic afegint una capa nova a un grup existent");				
				return this._groupList[this._groupList.length -1];							
			}else if(position==0){ //usuari afegeix grup nou buit								
				console.info("usuari afegeix grup nou");				
				return group={"groupName":"Capes "+this._groupList.length,"name":"Capes "+this._groupList.length,"id":this._groupList.length,"expanded":true};
				
				
			}
			
        	
        },
        
        getGroupWhereIBelong:function(){
        	
        	var pos=this._groupList.length;
        	if( pos>0){ //estic afegint una capa però ja existeix un grup 						
				return this._groupList[this._groupList.length -1];	
        	}else{        		
        		return null;	
        	}	
        },
        
        
        _addGroupFromScratch:function(){       
        	var container = this._overlaysList;        	
        	var obj={}; 
        	console.info(" _addGroupFromScratch");
        	var group=this._createGroupFromScratch(0);
        	
        	obj.group=group;
        	//obj.group={"groupName":"Tema "+this._groupList.length,"name":"Tema "+this._groupList.length,"id":this._groupList.length,"expanded":true};        	              	
        	//var groupId = this._groupList.push(obj.group) - 1; 
        	this._groupList.push(obj.group) 
        	this._addGroup(container,obj,null);        	
        },
        
        _addGroupFromObject:function(group){
        	
        	console.info("_addGroupFromObject");
        	var container = this._overlaysList;        	
        	var obj={};        	
        	obj.group=group;       	
        	this._groupList.push(obj.group) 
        	this._addGroup(container,obj,null);  
        	
        },
        
        _addGroup:function(container,_obj, _menu_item_checkbox){
        	
      
        	var _id;
        	console.info(obj);
        	var obj=_obj;
        
        
        	if(obj.group){_id=obj.group.id;
        	}else if(obj.layer){_id=obj.layer.options.group.id;
        	}else{
        		
        		console.info(obj);
        	}
        	
        	
        	
        	var groupContainer = this._domGroups[_id];
        
        	
        	
			if (!groupContainer) {
				console.info(obj);
				
				groupContainer = document.createElement('div');
				groupContainer.id = 'leaflet-control-accordion-layers-' + obj.group.id;				
				// verify if group is expanded
				var s_expanded = obj.group.expanded ? ' checked = "true" ' : '';				
				// verify if type is exclusive
				var s_type_exclusive = this.options.exclusive ? ' type="radio" ' : ' type="checkbox" ';				
				inputElement = '<input id="ac' + obj.group.id + '" name="accordion-1" class="menu" ' + s_expanded + s_type_exclusive + '/>';
				//inputLabel   = '<label for="ac' + obj.group.id + '">' + obj.group.name + '</label>';				
				inputLabel = document.createElement('label');								
				var _for=document.createAttribute('for');
				_for.value="ac" + obj.group.id;
				inputLabel.setAttributeNode(_for);
				var spanGroup=document.createElement('span');
				spanGroup.innerHTML =obj.group.name;
				inputLabel.className='label_ac';
				spanGroup.className='span_ac editable';
				spanGroup.id='mv-'+obj.group.id;
				spanGroup.groupId=obj.group.id;
				spanGroup.groupName=obj.group.name;
				inputLabel.appendChild(spanGroup);
				var col = L.DomUtil.create('span', 'tema_verd glyphicon glyphicon-remove group-conf');				
				col.id='mv-'+obj.group.id;
				col.groupId=obj.group.id;
				col.groupName=obj.group.name;
				L.DomEvent.on(col, 'click', this._onRemoveGroup, this);
				inputLabel.appendChild(col);
				
				$(col).tooltip({
					placement : 'left',
					container : 'body',
					title : window.lang.convert("Esborrar grup")
				});
				
				
				var col = L.DomUtil.create('span', 'tema_verd_move glyphicon glyphicon-move group-conf');
				//L.DomEvent.on(col, 'click', this._onRemoveTeme, this);
				col.id='mv-'+obj.group.id;
				col.groupName=obj.group.name;
				col.groupId=obj.group.id;
				inputLabel.appendChild(col);	
				$(col).tooltip({
					placement : 'left',
					container : 'body',
					title : window.lang.convert("Moure grup")
				});
				article = document.createElement('article');
				article.className = 'ac-large';
				
				if( _menu_item_checkbox){				
				article.appendChild( _menu_item_checkbox );
				}
				
				// process options of ac-large css class - to options.group_maxHeight property
				if(this.options.group_maxHeight){
					article.style.maxHeight = this.options.group_maxHeight;
				}
				
				groupContainer.innerHTML = inputElement;
				groupContainer.appendChild( inputLabel);
				groupContainer.appendChild( article );
				container.appendChild(groupContainer); 

				this._domGroups[obj.group.id] = groupContainer;
			} else {
				if( _menu_item_checkbox){	
				groupContainer.lastElementChild.appendChild(_menu_item_checkbox );
				}
			}
        	
        	
        	
        	
    },
        
        
		_addLayer: function (layer, name, overlay, groupLeafletId,group1){
			var id = L.Util.stamp(layer);

			
			/*
			this._layers[id] = {
				layer : layer,
				name : name,
				overlay : overlay
			};
			*/			
			console.info(layer.options);
			console.info(layer.options.group);
			//console.info(layer.options.group.name);

			if(groupLeafletId){
				this._layers[groupLeafletId]._layers[id] = {
						layer: layer,
						name: name,
						overlay: overlay,
						sublayer: true,
						layerIdParent: groupLeafletId
					};			
			}else{
				this._layers[id] = {
						layer: layer,
						name: name,
						overlay: overlay,
						sublayer: false,
						_layers: {}
					};			
			}
			
			console.info(layer.options.group);
			var group=layer.options.group;
			
			var _heCreat=false;
			
			if(!group){
				
			/*	
			console.info(this._groupList.length)	;
			var pos=this._groupList.length -1;
			var posTXT;
			
			pos==-1 ? pos=0:pos=pos;
			
			pos==0 ? posTXT="":posTXT=pos;
			
			group={"groupName":"Capes "+posTXT,"name":"Capes "+posTXT,"id":pos,"expanded":true};
			
			console.info(group);
			//this._groupList.push(group);
			*/
				
			console.info("passo valor 1");	
			group=this._createGroupFromScratch(1);	
			_heCreat=true;
				
			}
			
			
			
			
			if (group) {
			
				
			var groupId = this._groupList.indexOf(group);
			
			//if(!group.groupName){group.groupName="Tema"+groupId;};	
				// if not find the group search for the name
				//console.info(group.groupName);	
				if( groupId === -1 ){
					for( g in this._groupList){
						if( this._groupList[g].groupName == group.groupName ){
							groupId = g;
							break;
						}
					}
				}

				if (groupId === -1) {
					groupId = this._groupList.push(group) - 1;
				}

			if(this._layers[id]){
				console.info(this._layers[id]);
				//if(!this._layers[id].options){this._layers[id].options;}
				
						this._layers[id].layer.options.group = {
							name : group.groupName,
							id : groupId,
							expanded : group.expanded
						};
						
						
				if(_heCreat){
					
					console.info("he creat grup")
					
					if( getModeMapa()){
						
						console.info("estic mode mapa");
						
						console.info(this._layers[id].layer.options.businessId);
						console.info(this._layers[id].layer.options);
						var data = {
							 	businessId: this._layers[id].layer.options.businessId, //url('?businessid') 
							 	uid: $.cookie('uid'),
							 	options:JSON.stringify(this._layers[id].layer.options)
							 }
						
						updateServidorWMSOptions(data).then(function(results){
							console.info(results);
							if(results.status==='OK'){
								console.debug(results);
								console.debug(data);
							}
						});	
						
				}
					
					
					
					
				}		
						
				
			}
			
			}

			if (this.options.autoZIndex && layer.setZIndex) {
				this._lastZIndex++;
				layer.setZIndex(this._lastZIndex);
			}
		},

		_update : function () {
			if (!this._container) {
				return;
			}
		
			
			
			this._domGroupsTMP=this._groupList;
			this._groupList = [];
			this._domGroupsTM2=this._domGroups;
			this._baseLayersList.innerHTML = '';
			this._overlaysList.innerHTML = '';
			this._domGroups.length = 0;

			console.info(this._domGroupsTMP);
			console.info(this._domGroups);
			var that=this;
			this._domGroupsTMP.forEach(function (item, index, array) {
			
				that._addGroupFromObject(item);
			});
			
			var baseLayersPresent = false,
			overlaysPresent = false,
			i,
			obj;

			for (i in this._layers) {
				obj = this._layers[i];							
				this._addItem(obj);
				
			
				
				overlaysPresent = overlaysPresent || obj.overlay;
				baseLayersPresent = baseLayersPresent || !obj.overlay;
			}
			
		
			/*
			if(this._domGroups.length < this._domGroupsTMP.length ){
				
				console.info("Entro");
				var fullGrups=[];
				this._domGroups.forEach(function (item, index, array) {
					fullGrups.push(parseInt(item.id.replace("leaflet-control-accordion-layers-",'')));
				});
				
			    var emptyGrups=[];
				this._domGroupsTMP.forEach(function (item, index, array) {
					emptyGrups.push(item.id);
				});
					
				
				var recoveryGroup=this._diferences(emptyGrups,fullGrups);
				
				console.info( recoveryGroup);
				var that_GroupTMP=this._domGroupsTMP;
				var that=this;
				recoveryGroup.forEach(function (item, index, array) {
				
					console.info(item);
					
					 for (var i=0; i < that_GroupTMP.length; i++) {
					        if (that_GroupTMP[i].id === item) {
					        	
					        	console.info(that_GroupTMP[i]);
					      	that._addGroupFromObject(that_GroupTMP[i]);
					      	break;
					        }
					    }
				});
					 
					
				
				
			}
			
		*/
		},

		
		
		_diferences:function (a1, a2)
		{
		  var a=[], diff=[];
		  for(var i=0;i<a1.length;i++)
		    a[a1[i]]=true;
		  for(var i=0;i<a2.length;i++)
		    if(a[a2[i]]) delete a[a2[i]];
		    else a[a2[i]]=true;
		  for(var k in a)
		    diff.push(parseInt(k));
		  return diff;
		},
		
		
		
		
		
		
		_onLayerChange : function (e) {
			var obj = this._layers[L.Util.stamp(e.layer)];

			if (!obj) {
				return;
			}

			if (!this._handlingClick) {
				this._update();
			}

			var type = obj.overlay ?
				(e.type === 'layeradd' ? 'overlayadd' : 'overlayremove') :
				(e.type === 'layeradd' ? 'baselayerchange' : null);

			if (type) {
				this._map.fire(type, obj);
			}
		},

		// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
		_createRadioElement : function (name, checked) {

			var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
			if (checked) {
				radioHtml += ' checked="checked"';
			}
			radioHtml += '/>';

			var radioFragment = document.createElement('div');
			radioFragment.innerHTML = radioHtml;

			return radioFragment.firstChild;
		},

		_addItem : function (obj) {
			
			
			
			
			var _menu_item_checkbox = document.createElement('div'),
			input,
			checked = this._map.hasLayer(obj.layer),
			container;
		
			var _leaflet_input = document.createElement('div');
			if (obj.overlay) {
				
				_menu_item_checkbox.className = "leaflet-row"; 
				
				input = document.createElement('input');
				//input = L.DomUtil.create('input');
				input.id='input-'+obj.layer.options.businessId;
				input.type = 'checkbox';
				//input.className = 'leaflet-control-layers-selector';
				input.className = 'checkbox_styled sr-only';
				input.defaultChecked = checked;
								
			} else {
				input = this._createRadioElement('leaflet-base-layers', checked);

			}
			
			_leaflet_input.className="leaflet-input";
			
			input.layerId = L.Util.stamp(obj.layer);						
			var label_for = document.createElement('label');			
			var _for=document.createAttribute('for');
			_for.value='input-'+obj.layer.options.businessId;
			label_for.setAttributeNode(_for);			
			//label_for.innerHTML="--";
			_leaflet_input.appendChild(input);
			_leaflet_input.appendChild(label_for);			
			
			
			var _leaflet_name = document.createElement('div');
			_leaflet_name.className = 'leaflet-name';
			var _label_buit = document.createElement('label');			
			var nomCapa= document.createElement('span');
			
			nomCapa.innerHTML = ' ' + obj.name;
			nomCapa.className = 'editable';
			nomCapa.id=input.layerId;
			nomCapa.innerHTML = ' ' + obj.name;			
			L.DomEvent.on(input, 'click', this._onInputClick, this);
				
			_label_buit.appendChild(nomCapa);
			
			if(obj.layer.options.tipus == t_visualitzacio || obj.layer.options.tipus == t_tematic || obj.layer.options.tipus == t_dades_obertes || obj.layer.options.tipus == t_json || obj.layer.options.tipus == t_url_file){
				var count = document.createElement('span');
				count.className = 'layer-count';
				count.id='count-'+obj.layer.options.businessId;
				count.innerHTML = ' (' + obj.layer.getLayers().length + ')';		
				//name.appendChild(count);
				_label_buit.appendChild(count);
			}
			
			_leaflet_name.appendChild(_label_buit);			
			_menu_item_checkbox.appendChild(_leaflet_input);
			_menu_item_checkbox.appendChild(_leaflet_name);
			
			var container;
			var modeMapa = ($(location).attr('href').indexOf('/mapa.html')!=-1);

			
			var col;
			
			
			if (obj.overlay) {
				
				
				if(modeMapa){
				
					col = L.DomUtil.create('div', 'leaflet-conf glyphicon glyphicon-cog opcio-conf');					
					L.DomEvent.on(col, 'click', this._showOptions, this);					
					col.layerId = input.layerId;					
					_menu_item_checkbox.appendChild(col);
					
					
										
					
					col = L.DomUtil.create('div', 'conf-'+obj.layer.options.businessId+' leaflet-remove glyphicon glyphicon-remove subopcio-conf');
					col.layerId = input.layerId;
					L.DomEvent.on(col, 'click', this._onRemoveClick, this);
					_menu_item_checkbox.appendChild(col);	
					
															
					
					if(obj.layer.options.source){
						col = L.DomUtil.create('div', 'data-table-'+obj.layer.options.businessId+' leaflet-data-table glyphicon glyphicon-list-alt');
						col.layerId = input.layerId;
						L.DomEvent.on(col, 'click', this._onOpenDataTable, this);
						_menu_item_checkbox.appendChild(col);					
					}		
					
					if(obj.layer.options.tipus && obj.layer.options.tipus.indexOf(t_wms) == -1 && obj.layer.options.tipus.indexOf(t_geojsonvt) == -1){
						col = L.DomUtil.create('div', 'conf-'+obj.layer.options.businessId+' leaflet-download glyphicon glyphicon-save subopcio-conf');
						col.layerId = input.layerId;
						L.DomEvent.on(col, 'click', this._onDownloadClick, this);
						_menu_item_checkbox.appendChild(col);					
					}
					
										
					
					
					if(obj.layer.options.tipus && obj.layer.options.tipus.indexOf(t_wms) != -1){
						
						col = L.DomUtil.create('div', 'conf-'+obj.layer.options.businessId+' leaflet-trans glyphicon glyphicon-adjust subopcio-conf');
						col.layerId = input.layerId;
						L.DomEvent.on(col, 'click', this._onTransparenciaClick, this);
						_menu_item_checkbox.appendChild(col);	
						
						$(col).tooltip({
							placement : 'bottom',
							container : 'body',
							title : window.lang.convert("Transparència")
						});
						
					}
					
					
					col = L.DomUtil.create('div', 'conf-'+obj.layer.options.businessId+' leaflet-move glyphicon glyphicon-move subopcio-conf');
					col.layerId = input.layerId;
					//L.DomEvent.on(col, 'click', this._onDownClick, this);
					_menu_item_checkbox.appendChild(col);	
					
					$(col).tooltip({
						placement : 'bottom',
						container : 'body',
						title : window.lang.convert("Moure")
					});
				
					/*
					col = L.DomUtil.create('div', 'conf-'+obj.layer.options.businessId+' leaflet-down glyphicon glyphicon-chevron-down subopcio-conf');
					col.layerId = input.layerId;
					L.DomEvent.on(col, 'click', this._onDownClick, this);
					label.appendChild(col);	
					
					col = L.DomUtil.create('div', 'conf-'+obj.layer.options.businessId+' leaflet-up glyphicon glyphicon-chevron-up subopcio-conf');
					L.DomEvent.on(col, 'click', this._onUpClick, this);
					col.layerId = input.layerId;
					label.appendChild(col);		
						*/
					
				}else{
					

					if(obj.layer.options.source){
						col = L.DomUtil.create('div', 'data-table-'+obj.layer.options.businessId+' leaflet-data-table glyphicon glyphicon-list-alt');
						col.layerId = input.layerId;
						L.DomEvent.on(col, 'click', this._onOpenDataTable, this);
						_menu_item_checkbox.appendChild(col);					
					}				
					
					
				
					if(obj.layer.options.tipus.indexOf(t_geojsonvt) == -1 && obj.layer.options.tipus.indexOf(t_wms) == -1 && 
							!jQuery.isEmptyObject(downloadableData) && downloadableData[obj.layer.options.businessId] && downloadableData[obj.layer.options.businessId]!=undefined &&
							downloadableData[obj.layer.options.businessId][0].chck){
						col = L.DomUtil.create('div', 'conf-'+obj.layer.options.businessId+' leaflet-download-visor glyphicon glyphicon-save');
						L.DomEvent.on(col, 'click', this._onDownloadClick, this);
						col.layerId = input.layerId;
						_menu_item_checkbox.appendChild(col);	
						
						$(col).tooltip({
							placement : 'left',
							container : 'body',
							title : window.lang.convert("Descàrrega")
						});
					}
					
					
				
					if(obj.layer.options.tipus && obj.layer.options.tipus.indexOf(t_wms) != -1){
						
						col = L.DomUtil.create('div', 'conf-'+obj.layer.options.businessId+' leaflet-trans-visor glyphicon glyphicon-adjust');
						col.layerId = input.layerId;
						L.DomEvent.on(col, 'click', this._onTransparenciaClick, this);
						_menu_item_checkbox.appendChild(col);	
						
						$(col).tooltip({
							placement : 'bottom',
							container : 'body',
							title : window.lang.convert("Transparència")
						});
						
					}
				
				
				
				
				}
				
				
				
				container = this._overlaysList;
			} else {
				container = this._baseLayersList;
			}
			
					
			//container.appendChild(row);
			var sublayers = obj._layers;
			//console.info(obj);
			for (j in sublayers) { 
				
				//console.info(sublayers[j]);
				var row_sublayer = this._createSubItem(sublayers[j],input.layerId, modeMapa);
				_menu_item_checkbox.appendChild(row_sublayer);
				
			}
			
			
				this._addGroup(container,obj, _menu_item_checkbox);
				
				
				
				
				
				
			
			
			//Afegim tooltips
			$(".data-table-"+obj.layer.options.businessId+".leaflet-data-table").tooltip({
				placement : 'bottom',
				container : 'body',
				title : window.lang.convert("dades")
			});
			
			$(".opcio-conf").tooltip({
				placement : 'bottom',
				container : 'body',
				title : window.lang.convert("opcions")
			});		
			
			if(modeMapa) updateEditableElements();
			map.fireEvent('addItemFinish'); 

			return _menu_item_checkbox;
		},
		_createSubItem: function(sublayer,layerIdParent, modeMapa){
			
			var row_sublayer = L.DomUtil.create('div', 'leaflet-row leaflet-subrow');
			
			var label_sublayer = L.DomUtil.create('label', ''),
			    input_sublayer,
			    checked = this._map.hasLayer(sublayer.layer);

			input_sublayer = L.DomUtil.create('input');
			input_sublayer.id='input-'+sublayer.layer.options.businessId;
			input_sublayer.type = 'checkbox';
			//input_sublayer.className = 'leaflet-control-layers-selector';
			input_sublayer.className = 'checkbox_eye sr-only';
			input_sublayer.defaultChecked = checked;

			input_sublayer.layerId = L.stamp(sublayer.layer);
			input_sublayer.layerIdParent = layerIdParent; //input.layerId;
			
			L.DomEvent.on(input_sublayer, 'click', this._onInputClick, this);

			var name_sublayer = document.createElement('span');
			name_sublayer.className = 'editable';
			name_sublayer.idParent=layerIdParent;
			name_sublayer.id=L.stamp(sublayer.layer);
			name_sublayer.innerHTML = ' ' + sublayer.name;
			
			var col_sublayer = L.DomUtil.create('div', 'leaflet-input');
			
			var label_for = document.createElement('label');			
			var _for=document.createAttribute('for');
			_for.value='input-'+sublayer.layer.options.businessId;
			label_for.setAttributeNode(_for);			
			//label_for.innerHTML="--";
		
			
			
			
			col_sublayer.appendChild(input_sublayer);
			col_sublayer.appendChild(label_for);
			
			
			
			
			
			
			
			row_sublayer.appendChild(col_sublayer);
			col_sublayer = L.DomUtil.create('div', 'leaflet-name');
			col_sublayer.appendChild(label_sublayer);
			row_sublayer.appendChild(col_sublayer);
			label_sublayer.appendChild(name_sublayer);
			
			if(modeMapa){
				col_sublayer = L.DomUtil.create('div', 'leaflet-remove glyphicon glyphicon-remove opcio-conf');
				L.DomEvent.on(col_sublayer, 'click', this._onRemoveClick, this);
				col_sublayer.layerId = input_sublayer.layerId;
				col_sublayer.layerIdParent = layerIdParent;
				row_sublayer.appendChild(col_sublayer);				
			}
			return row_sublayer;
			
		},
		
		
		_onInputClick : function () {
			
			console.info("aqui");
			
			var i, input, obj,
		    inputs = this._form.getElementsByTagName('input'),
		    inputsLen = inputs.length;

		this._handlingClick = true;
		var checkHeat = false;
		var id, parentId;
		
		var currentbid = arguments[0].currentTarget.id.replace("input-", "");
		console.info(arguments[0].currentTarget.layerIdParent);
		//tractament en cas heatmap
		if(arguments[0].currentTarget.layerIdParent){
			id = arguments[0].currentTarget.layerId;
			parentId = arguments[0].currentTarget.layerIdParent;
			console.info(parentId);
			console.info(controlCapes._layers[parentId]._layers[id]);
			console.info(arguments[0].currentTarget.value);
			checkHeat = isHeat(controlCapes._layers[parentId]._layers[id]) && arguments[0].currentTarget.value == "on";
		}
		
		for (i = 0; i < inputsLen; i++) {
			input = inputs[i];
			
			
			//obj = this._layers[input.layerId];
			
		    //if ( !obj ) { continue; }

		    if(!input.layerId){
		    	continue;
		    }else if(!input.layerIdParent){
				obj = this._layers[input.layerId];	
			}else{
				obj = this._layers[input.layerIdParent]._layers[input.layerId];
			}
			
			//Si la capa clickada �s heatmap i s'ha d'activar, i la que estem tractant tb, no s'ha de mostrar
			
			console.info(obj);
			
			if(isHeat(obj) && checkHeat && obj.layer._leaflet_id != id ){
				input.checked = false;
			}
			console.info(obj);
			//Afegir
			if (input.checked && !this._map.hasLayer(obj.layer)) {
				console.info(obj);
				this._map.addLayer(obj.layer);	
				
				if (obj.layer.options.tipus.indexOf(t_vis_wms)!= -1){
					
					var optionsUtfGrid = {
				            layers : obj.layer.options.businessId,
				            crs : L.CRS.EPSG4326,
				            srs: "EPSG:4326",
				            transparent : true,
				            format : 'utfgrid',
				            nom : obj.layer.options.nom + " utfgrid",
					    	tipus: obj.layer.options.tipus,
					    	businessId: obj.layer.options.businessId         
					}
					var utfGrid = createUtfGridLayer(obj.layer._url,optionsUtfGrid);
					this._map.addLayer(utfGrid);
					obj.layer.options.utfGridLeafletId = utfGrid._leaflet_id;
					
				}
				//Si hem activat capa de tipus tematic categories, mostrem la seva llegenda
				
				
				if(currentbid == obj.layer.options.businessId && obj.layer.options.tipusRang 
						&& obj.layer.options.tipusRang==tem_clasic){
					thisLoadMapLegendEdicio(obj.layer);
				}
				
			} else if (!input.checked && this._map.hasLayer(obj.layer)) {

				console.info(obj);
				//Si es vis_wms, hem d'eliminar tb la capa utfgrid
				if(obj.layer.options.tipus.indexOf(t_vis_wms)!= -1){
					var utfGridLayer = this._map._layers[obj.layer.options.utfGridLeafletId];
					this._map.removeLayer(utfGridLayer);
				}
				
				console.info(obj);
				this._map.removeLayer(obj.layer);
				
				//Si hem desactivat capa de tipus tematic categories, mostrem la seva llegenda
				if(currentbid == obj.layer.options.businessId && obj.layer.options.tipusRang 
						&& obj.layer.options.tipusRang==tem_clasic){
					thisEmptyMapLegendEdicio(obj.layer);
				}
			}
			
		}

		this._handlingClick = false;

		this._refocusOnMap();
			/*
			var i,
			input,
			obj,
			inputs = this._form.getElementsByTagName('input'),
			inputsLen = inputs.length;

			console.info(inputs.length);
			
			this._handlingClick = true;

			for (i = 0; i < inputsLen; i++) {
				input = inputs[i];
			
				obj = this._layers[input.layerId];
				
			    if ( !obj ) { continue; }

				if (input.checked && !this._map.hasLayer(obj.layer)) {
					this._map.addLayer(obj.layer);

				} else if (!input.checked && this._map.hasLayer(obj.layer)) {
					
				
					
					this._map.removeLayer(obj.layer);
				}
			}

			this._handlingClick = false;
		
		*/
		
		
		
		},
		_onUpClick: function(e) {
			$('.tooltip').hide();
			var layerId = e.currentTarget.layerId;
			var inputs = this._form.getElementsByTagName('input');
			var obj = this._layers[layerId];
			
			if(!obj.overlay) {
				return;
			}
			
			var replaceLayer = null;
			for(var i=0; i < inputs.length; i++) {
				if(!inputs[i].layerIdParent){
					var auxLayer = this._layers[inputs[i].layerId];
					if(auxLayer.overlay && ((obj.layer.options.zIndex - 1) === auxLayer.layer.options.zIndex)) {
						replaceLayer = auxLayer;
						break;
					}				
				}
			}
			
			var newZIndex = obj.layer.options.zIndex - 1;
			if(replaceLayer) {
				
				if(typeof url('?businessid') == "string"){
					var data = {
							uid: $.cookie('uid'),
							businessId: url('?businessid'),
							servidorWMSbusinessId: obj.layer.options.businessId +','+replaceLayer.layer.options.businessId,
				            order: newZIndex+','+ (newZIndex+1)
						};			
					
					updateServersOrderToMap(data).then(function(results){
						if(results.status!='OK')
							return;//SI no ha anat be el canvi a BD. que no es faci tampoc a client, i es mostri un error
					},function(results){
						return;//SI no ha anat be el canvi a BD. que no es faci tampoc a client, i es mostri un error
					});				
				}
				
				obj.layer.options.zIndex = newZIndex;
				replaceLayer.layer.options.zIndex = newZIndex+1;
				
				this._map.fire('changeorder', obj, this);
			}
		},
		
		_onDownClick: function(e) {
			$('.tooltip').hide();
			var layerId = e.currentTarget.layerId;
			var inputs = this._form.getElementsByTagName('input');
			var obj = this._layers[layerId];
			
			if(!obj.overlay) {
				return;
			}
			
			var replaceLayer = null;
			for(var i=0; i < inputs.length; i++) {
				if(!inputs[i].layerIdParent){
					var auxLayer = this._layers[inputs[i].layerId];
					if(auxLayer.overlay && ((obj.layer.options.zIndex + 1) === auxLayer.layer.options.zIndex)) {
						replaceLayer = auxLayer;
						break;
					}				
				}
			}
			
			var newZIndex = obj.layer.options.zIndex + 1;
			if(replaceLayer) {
				
				if(typeof url('?businessid') == "string"){
					var data = {
							uid: $.cookie('uid'),
							businessId: url('?businessid'),
							servidorWMSbusinessId: obj.layer.options.businessId +','+replaceLayer.layer.options.businessId,
				            order: newZIndex+','+ (newZIndex-1)
						};			
					
					updateServersOrderToMap(data).then(function(results){
						if(results.status!='OK')
							return;//SI no ha anat be el canvi a BD. que no es faci tampoc a client, i es mostri un error
					},function(results){
						return;//SI no ha anat be el canvi a BD. que no es faci tampoc a client, i es mostri un error
					});				
				}
				
				obj.layer.options.zIndex = newZIndex;
				replaceLayer.layer.options.zIndex = newZIndex-1;
				
				this._map.fire('changeorder', obj, this);
			}
		},
		
		
		_onRemoveGroup:function(e){
			$('.tooltip').hide();						
				 L.DomEvent.stop(e);			
				console.info(e.currentTarget.groupName);				
				console.info(e.currentTarget.groupId);		
			$('#dialog_delete_group').modal('show');
			$('#dialog_delete_group #nom_group_delete').text(e.currentTarget.groupName);
			$('#dialog_delete_group .btn-danger').data("group", e.currentTarget);
			//$('#dialog_delete_capa .btn-danger').data("obj", obj);	
			
		},
		
		_onRemoveClick: function(e) {
			$('.tooltip').hide();
			var layerId = e.currentTarget.layerId;
			var layerIdParent = e.currentTarget.layerIdParent;
			var lbusinessId = [];
			if(!layerIdParent){
				var obj = this._layers[layerId];
				lbusinessId.push(obj.layer.options.businessId);
				for(i in obj._layers){
					lbusinessId.push(obj._layers[i].layer.options.businessId);
				}
			}else{
				var objParent = this._layers[layerIdParent];
				var obj = objParent._layers[layerId];
				lbusinessId.push(obj.layer.options.businessId);
			}
			
			
			if(!obj.overlay) {
				return;
			}
			
			if(typeof url('?businessid') == "string"){
				var data = {
						businessId: url('?businessid'),
						uid: $.cookie('uid'),
						servidorWMSbusinessId: lbusinessId.toString()
					};			
				
				$('#dialog_delete_capa').modal('show');
				$('#dialog_delete_capa #nom_capa_delete').text(obj.layer.options.nom);
				$('#dialog_delete_capa .btn-danger').data("data", data);
				$('#dialog_delete_capa .btn-danger').data("obj", obj);	
				
			
			}		
			
		},
			
		_onDeleteClick : function(obj){
			var node = obj.target.parentElement.childNodes[0];
			n_obj = this._layers[node.layerId];
			
			// verify if obj is a basemap and checked to not remove
			if( !n_obj.overlay && node.checked ){
				return false;
			}	
			
			if( this._map.hasLayer(n_obj.layer) ){
				this._map.removeLayer(n_obj.layer);
			}
			this.removeLayer(n_obj.layer); 
			obj.target.parentNode.remove();
			
			return false;
		},
		_onEditNameClick: function(e) {
			
			var layerId = e.currentTarget.layerId;
			var obj = this._layers[layerId];
			
			if(!obj.overlay) {
				return;
			}
		},
		_onOpenDataTable: function(e) {
			
//			console.debug("_onOpenDataTable");
			$('.tooltip').hide();
			
			$('#modal_data_table').modal('show');
			
			var layerId = e.currentTarget.layerId;
			var obj = this._layers[layerId];
			download_layer = obj;		
//			console.debug(obj);
			
			fillModalDataTable(obj);
		},	
		
		_onTransparenciaClick:function(e){
			var layerId = e.currentTarget.layerId;
			var obj = this._layers[layerId];		
			var op =obj.layer.options.opacity;
			console.info(obj);
			if(!op){
				
				
				console.info(op);
			}
			console.info(op);
			
			if(!op){op=1;obj.layer.options.fillOpacity=1;}else{	
				
				if(op==0){op=1}else{			
					op=(parseFloat(op)-0.25)				
				}				
			}		
			
			try{
				
				obj.layer.setOpacity(op);	
			} catch(err){
				console.info(op);
				//obj.layer.options.opacity=op;
				obj.layer.options.fillOpacity=op;
				obj.layer.setStyle({fillOpacity:op});	
			}
			
		
			
			
			if( getModeMapa()){
				var data = {
					 	businessId: obj.layer.options.businessId, //url('?businessid') 
					 	uid: $.cookie('uid'),
					 	opacity:op
					 }
				
				updateServidorWMSOpacity(data).then(function(results){
					if(results.status==='OK'){
						//console.debug(results);
					}
				});	
				
		}
			
			
			
			
			
			
			
			
			
		},
		
		_onDownloadClick: function(e) {
			
//			console.debug("_onDownloadClick");
			
			$('.tooltip').hide();
			var layerId = e.currentTarget.layerId;
			var obj = this._layers[layerId];
			download_layer = obj;
			
			if(obj.layer.options.tipusRang && (obj.layer.options.tipusRang == tem_cluster || obj.layer.options.tipusRang == tem_heatmap )){
				$('#modal-body-download-not-available').show();
				$('#modal-body-download-error').hide();
				$('#modal-body-download').hide();
				$('#modal_download_layer .modal-footer').show();
				$('#bt_download_tancar').show();
				$('#bt_download_accept').hide();			
				$('#modal_download_layer').modal('show');
			}else{
				$('#modal-body-download-not-available').hide();
				$('#modal-body-download-error').hide();
				$('#modal-body-download').show();
				$('#modal_download_layer .modal-footer').show();
				$('#bt_download_tancar').hide();
				$('#bt_download_accept').show();			
				$('#modal_download_layer').modal('show');
			}
		},
		_showOptions: function(e){
			var layerId = e.currentTarget.layerId;
			var inputs = this._form.getElementsByTagName('input');
			var obj = this._layers[layerId];
			//console.debug('openConfig:'+obj.layer.options.businessId);
			showConfOptions(obj.layer.options.businessId);
			//jQuery(".conf-"+obj.layer.options.businessId+"").show();
		},

		_expand : function () {
			L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
		},

		_collapse : function () {
			this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
		}
	});

L.control.orderlayers = function (baseLayers, overlays, options) {
	return new L.Control.OrderLayers(baseLayers, overlays, options);
};

function isHeat(obj){
	
	//return false;
	return (obj.layer.options.tipusRang && obj.layer.options.tipusRang.indexOf('heatmap')!=-1);
}

function showConfOptions(businessId){
	jQuery(".conf-"+businessId+"").toggle("fast");
	addTooltipsConfOptions(businessId);
}

function updateCheckStyle(){
	$('.leaflet-input input').iCheck({
	    checkboxClass: 'icheckbox_flat-blue',
	    radioClass: 'iradio_flat-blue'
	});		
}

function thisFillModalDataTable(obj){
	fillModalDataTable(obj);
}

function thisLoadMapLegendEdicio(obj){
	loadMapLegendEdicio(obj);
}


function thisEmptyMapLegendEdicio(obj){
	emptyMapLegendEdicio(obj);
}



