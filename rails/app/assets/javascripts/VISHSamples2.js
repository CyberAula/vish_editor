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
					'body'   : 'Ejemplo de flashcard pa tí...'
				},
				{
					'type'        : 'flashcard',
					'areaid'      : 'center',
					'canvasid'    : 'myCanvas',
					'jsoncontent' : '{"name": "myFirstFlashcard","description": "flashcard explanation","type": "flashcard","backgroundSrc": "media/images/background.jpg","pois": [{"id": 1,"x": 200,"y": 325,"templateNumber": 0,"zonesContent": [{"type": "text","content": "El tantalio o tántalo es un elemento químico de número atómico 73, que se sitúa en el grupo 5 de la tabla periódica de los elementos. Su símbolo es Ta. Se trata de un metal de transición raro, azul grisáceo, duro, que presenta brillo metálico y resiste muy bien la corrosión. Se encuentra en el mineral tantalita. Es fisiológicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricación de instrumentos quirúrgicos y en implantes. En ocasiones se le llama tántalo, pero el único nombre reconocido por la Real Academia Española es tantalio."}]},{"id": 2,"x": 458,"y": 285,"templateNumber": 1,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "image","content": "media/images/3.jpg"}]},{"id": 3,"x": 658,"y": 285,"templateNumber": 0,"zonesContent": [{"type": "video","content": [{"mimetype": "video/webm","src": "media/videos/video1.webm"},{"mimetype": "video/mp4","src": "http://video-js.zencoder.com/oceans-clip.mp4"}]}]},{"id": 4,"x": 458,"y": 457,"templateNumber": 2,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "empty","content": ""},{"type": "text","content": "El tantalio o tántalo es un elemento químico de número atómico 73, que se sitúa en el grupo 5 de la tabla periódica de los elementos. Su símbolo es Ta. Se trata de un metal de transición raro, azul grisáceo, duro, que presenta brillo metálico y resiste muy bien la corrosión. Se encuentra en el mineral tantalita. Es fisiológicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricación de instrumentos quirúrgicos y en implantes. En ocasiones se le llama tántalo, pero el único nombre reconocido por la Real Academia Española es tantalio."}]}]}',
					'js'          : 'js/mods/fc/VISH.Mods.fc.js'
				}
			]
		},
		{
			'id'       :'vish9',
			'template' :'t2',
			'elements':[
				{
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'FLASHCARD 2...'
				},
				{
					'type'        : 'flashcard',
					'areaid'      : 'center',
					'canvasid'    : 'myCanvas2',
					'jsoncontent' : '{"name": "myFirstFlashcard","description": "flashcard explanation","type": "flashcard","backgroundSrc": "media/images/background2.png","pois": [{"id": 1,"x": 200,"y": 325,"templateNumber": 0,"zonesContent": [{"type": "text","content": "texto texto texto"}]},{"id": 2,"x": 458,"y": 285,"templateNumber": 1,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "image","content": "media/images/plata.jpg"}]},{"id": 3,"x": 658,"y": 285,"templateNumber": 0,"zonesContent": [{"type": "video","content": [{"mimetype": "video/webm","src": "media/videos/video1.webm"},{"mimetype": "video/mp4","src": "http://video-js.zencoder.com/oceans-clip.mp4"}]}]},{"id": 4,"x": 458,"y": 457,"templateNumber": 2,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "empty","content": ""},{"type": "text","content": "texto 2 texto 2."}]}]}',
					'js'          : 'js/mods/fc/VISH.Mods.fc.js'
				}
			]
		}
		
		];

	return {
		samples: samples
	};

})(VISH);