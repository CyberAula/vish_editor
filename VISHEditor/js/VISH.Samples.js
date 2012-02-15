VISH.Samples = (function(V,undefined){
	
	var samples = [
		{
			'id'       :'vish1',
			'template' :'t1',
			'elements':[
				{
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Ejemplo de flora'
				},
				{
					'type'   : 'text',
					'areaid' : 'left',
					'body'   : '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas orci nisl, euismod a posuere ac, commodo quis ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec sollicitudin risus laoreet velit dapibus bibendum. Nullam cursus sollicitudin hendrerit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc ullamcorper tempor bibendum. Morbi gravida pretium leo, vitae scelerisque quam mattis eu. Sed hendrerit molestie magna, sit amet porttitor nulla facilisis in. Donec vel massa mauris, sit amet condimentum lacus.</p>'
				},
				{
					'type'   : 'image',
					'areaid' : 'right',
					'body'   : 'http://www.asturtalla.com/arbol.jpg'		
				}
			]
		},
		{
			'id'       :'vish2',
			'template' :'t2',
			'elements':[
				{
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Ejemplo de fauna...'
				},
				{
					'type'   : 'image',
					'areaid' : 'center',
					'body'   : 'http://www.absoluthuelva.com/wp-content/uploads/2009/03/donana.jpg'		
				}
			]
		},
		{
			'id'       :'vish3',
			'template' :'t1',
			'elements':[
				{
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Sensores'
				},
				{
					'type'   : 'text',
					'areaid' : 'left',
					'body'   : '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas orci nisl, euismod a posuere ac, commodo quis ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec sollicitudin risus laoreet velit dapibus bibendum. Nullam cursus sollicitudin hendrerit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc ullamcorper tempor bibendum. Morbi gravida pretium leo, vitae scelerisque quam mattis eu. Sed hendrerit molestie magna, sit amet porttitor nulla facilisis in. Donec vel massa mauris, sit amet condimentum lacus.</p>'
				},
				{
					'type'   : 'image',
					'areaid' : 'right',
					'body'   : 'http://www.satec.es/es-ES/NuestraActividad/CasosdeExito/PublishingImages/IMG%20Do%C3%B1ana/do%C3%B1ana_fig2.png'		
				}
			]
		},
		{
			'id'       :'vish4',
			'template' :'t2',
			'elements':[
				{
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Puesta de sol...'
				},
				{
					'type'   : 'image',
					'areaid' : 'left',
					'body'   : 'http://www.viajes.okviajar.es/wp-content/uploads/2010/11/parque-donana.jpg'		
				}
			]
		},
		{
			'id'       :'vish5',
			'template' :'t2',
			'elements':[
				{
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Experimento virtual1'
				},
				{
					'type'   : 'swf',
					'areaid' : 'left',
					'body'   : 'swf/virtualexperiment_1.swf'		
				}
			]
		},
		{
			'id'       :'vish6',
			'template' :'t2',
			'elements':[
				{
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Experimento virtual2'
				},
				{
					'type'    : 'applet',
					'areaid'  : 'left',
					'archive' : 'Wave.class', //archive param of the applet
					'code'    : 'Wave.class',
					'width'   : 200,
					'height'  : 150,
					'params'  : '<param name=image value="Banna.jpg"><param name=horizMotion value=0.03>'
				}
			]
		},
		{
			'id'       :'vish7',
			'template' :'t2',
			'elements':[
				{
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Experimento virtual3'
				},
				{
					'type'    : 'applet',
					'areaid'  : 'left',
					'archive' : 'applets/Clock.class', //archive param of the applet
					'code'    : 'Clock.class',
					'width'   : 310,
					'height'  : 160,
					'params'  : '<PARAM NAME=text VALUE="#00ff"><PARAM NAME=bgcolor VALUE="#00aaaa"><PARAM NAME=bordersize VALUE="35"><PARAM NAME=border_outside VALUE="#00ffaa"><PARAM NAME=border_inside VALUE="#0000FF"><PARAM NAME=fonttype VALUE="0"><PARAM NAME="GMT" VALUE="true"><PARAM NAME="correction" VALUE="3600000">'
				}
			]
		},
		{
			'id'       :'vish8',
			'template' :'t2',
			'elements':[
				{
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Ejemplo de flashcard...'
				},
				{
					'type'   : 'flashcard',
					'areaid' : 'center',
					'body'   : '<canvas id="myCanvas">Your browser does not support canvas</canvas>',
					'js'     : ''
				}
			]
		},
		
		];

	return {
		samples: samples
	};

})(VISH);