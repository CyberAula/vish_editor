VISH.Samples = (function(V,undefined){
	
	var samples = [		
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
					'type'        : 'flashcard',
					'areaid'      : 'center',
					'canvasid'    : 'myCanvas',
					'jsoncontent' : '{"name": "myFirstFlashcard","description": "flashcard explanation","type": "flashcard","backgroundSrc": "media/images/background.jpg","pois": [{"id": 1,"x": 200,"y": 325,"templateNumber": 0,"zonesContent": [{"type": "text","content": "El tantalio o tántalo es un elemento químico de número atómico 73, que se sitúa en el grupo 5 de la tabla periódica de los elementos. Su símbolo es Ta. Se trata de un metal de transición raro, azul grisáceo, duro, que presenta brillo metálico y resiste muy bien la corrosión. Se encuentra en el mineral tantalita. Es fisiológicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricación de instrumentos quirúrgicos y en implantes. En ocasiones se le llama tántalo, pero el único nombre reconocido por la Real Academia Española es tantalio."}]},{"id": 2,"x": 458,"y": 285,"templateNumber": 1,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "image","content": "media/images/3.jpg"}]},{"id": 3,"x": 658,"y": 285,"templateNumber": 0,"zonesContent": [{"type": "video","content": [{"mimetype": "video/webm","src": "media/videos/video1.webm"},{"mimetype": "video/mp4","src": "http://video-js.zencoder.com/oceans-clip.mp4"}]}]},{"id": 4,"x": 458,"y": 457,"templateNumber": 2,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "empty","content": ""},{"type": "text","content": "El tantalio o tántalo es un elemento químico de número atómico 73, que se sitúa en el grupo 5 de la tabla periódica de los elementos. Su símbolo es Ta. Se trata de un metal de transición raro, azul grisáceo, duro, que presenta brillo metálico y resiste muy bien la corrosión. Se encuentra en el mineral tantalita. Es fisiológicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricación de instrumentos quirúrgicos y en implantes. En ocasiones se le llama tántalo, pero el único nombre reconocido por la Real Academia Española es tantalio."}]}]}',
					'js'          : 'js/mods/fc/VISH.Mods.fc.js'
				}
			]
		}
		
	];

	return {
		samples: samples
	};

})(VISH);