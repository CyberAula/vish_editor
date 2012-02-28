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
			'id'       :'vish8',
			'template' :'t2',
			'elements':[
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
					'type'        : 'flashcard',
					'areaid'      : 'center',
					'canvasid'    : 'myCanvas2',
					'jsoncontent' : '{"name": "myFirstFlashcard","description": "flashcard explanation","type": "flashcard","backgroundSrc": "media/images/background2.png","pois": [{"id": 1,"x": 200,"y": 325,"templateNumber": 0,"zonesContent": [{"type": "text","content": "texto texto texto"}]},{"id": 2,"x": 458,"y": 285,"templateNumber": 1,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "image","content": "media/images/plata.jpg"}]},{"id": 3,"x": 658,"y": 285,"templateNumber": 0,"zonesContent": [{"type": "video","content": [{"mimetype": "video/webm","src": "media/videos/video1.webm"},{"mimetype": "video/mp4","src": "http://video-js.zencoder.com/oceans-clip.mp4"}]}]},{"id": 4,"x": 458,"y": 457,"templateNumber": 2,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "empty","content": ""},{"type": "text","content": "texto 2 texto 2."}]}]}',
					'js'          : 'js/mods/fc/VISH.Mods.fc.js'
				}
			]
		},
		{
			'id'       :'vish10',
			'template' :'t2',
			'elements':[
				{
					'type'     : 'openquestion',
					'areaid'   : 'header',
					'body'     : 'Do you like this slide?',
					'posturl'  : 'http://localhost/quiz/adfklkdf'
				}
			]
		},
		{
			'id'       :'vish11',
			'template' :'t2',
			'elements':[
				{
					'type'     : 'mcquestion',
					'areaid'   : 'header',
					'body'     : 'Do you like this slide?',
					'posturl'  : 'http://localhost/quiz/adfklkdf',
					'options'  : [
						'yes',
						'no',
						'maybe'
					],
					'rightanswer' : 0
				}
			]
		},
		
		];

	return {
		samples: samples
	};

})(VISH);