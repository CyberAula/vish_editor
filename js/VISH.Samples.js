VISH.Samples = (function(V,undefined){
	
	var samples = {
				'id'            :  '1',
                'title'         :  'Nanoyou',
                'description'   :  'This excursion is about nanotechnology',
                'author'        :  'Enrique Barra',
                'slides'        : [
		{
			'id'       :'vish1',
			'author'   : 'John Doe',
			'template' :'t1',
			'elements':[
				{
                    'id'     : '315',
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Ejemplo de flora'
				},
				{
                    'id'     : '316',
					'type'   : 'text',
					'areaid' : 'left',
					'body'   : '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas orci nisl, euismod a posuere ac, commodo quis ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec sollicitudin risus laoreet velit dapibus bibendum. Nullam cursus sollicitudin hendrerit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc ullamcorper tempor bibendum. Morbi gravida pretium leo, vitae scelerisque quam mattis eu. Sed hendrerit molestie magna, sit amet porttitor nulla facilisis in. Donec vel massa mauris, sit amet condimentum lacus.</p>'
				},
				{
                    'id'     : '317',
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
                    'id'     : '318',
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Ejemplo de fauna...'
				},
				{
                    'id'     : '319',
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
                    'id'     : '320',
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Sensores'
				},
				{
                    'id'     : '321',
					'type'   : 'text',
					'areaid' : 'left',
					'body'   : '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas orci nisl, euismod a posuere ac, commodo quis ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec sollicitudin risus laoreet velit dapibus bibendum. Nullam cursus sollicitudin hendrerit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc ullamcorper tempor bibendum. Morbi gravida pretium leo, vitae scelerisque quam mattis eu. Sed hendrerit molestie magna, sit amet porttitor nulla facilisis in. Donec vel massa mauris, sit amet condimentum lacus.</p>'
				},
				{
                    'id'     : '322',
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
                    'id'     : '323',
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Puesta de sol...'
				},
				{
                    'id'     : '324',
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
                    'id'     : '325',
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Experimento virtual1'
				},
				{
                    'id'     : '326',
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
                    'id'     	  : '327',
					'type'        : 'flashcard',
					'areaid'      : 'center',
					'canvasid'    : 'myCanvas',
					'jsoncontent' : '{"name": "myFirstFlashcard","description": "flashcard explanation","type": "flashcard","backgroundSrc": "media/images/background.jpg","pois": [{"id": 1,"x": 200,"y": 325,"templateNumber": 0,"zonesContent": [{"type": "text","content": "El tantalio o t�ntalo es un elemento qu�mico de n�mero at�mico 73, que se sit�a en el grupo 5 de la tabla peri�dica de los elementos. Su s�mbolo es Ta. Se trata de un metal de transici�n raro, azul gris�ceo, duro, que presenta brillo met�lico y resiste muy bien la corrosi�n. Se encuentra en el mineral tantalita. Es fisiol�gicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricaci�n de instrumentos quir�rgicos y en implantes. En ocasiones se le llama t�ntalo, pero el �nico nombre reconocido por la Real Academia Espa�ola es tantalio."}]},{"id": 2,"x": 458,"y": 285,"templateNumber": 1,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "image","content": "media/images/3.jpg"}]},{"id": 3,"x": 658,"y": 285,"templateNumber": 0,"zonesContent": [{"type": "video","content": [{"mimetype": "video/webm","src": "media/videos/video1.webm"},{"mimetype": "video/mp4","src": "http://video-js.zencoder.com/oceans-clip.mp4"}]}]},{"id": 4,"x": 458,"y": 457,"templateNumber": 2,"zonesContent": [{"type": "text","content": "Image shows silver rock"},{"type": "empty","content": ""},{"type": "text","content": "El tantalio o t�ntalo es un elemento qu�mico de n�mero at�mico 73, que se sit�a en el grupo 5 de la tabla peri�dica de los elementos. Su s�mbolo es Ta. Se trata de un metal de transici�n raro, azul gris�ceo, duro, que presenta brillo met�lico y resiste muy bien la corrosi�n. Se encuentra en el mineral tantalita. Es fisiol�gicamente inerte, por lo que, entre sus variadas aplicaciones, se puede emplear para la fabricaci�n de instrumentos quir�rgicos y en implantes. En ocasiones se le llama t�ntalo, pero el �nico nombre reconocido por la Real Academia Espa�ola es tantalio."}]}]}',
					'js'          : 'js/mods/fc/VISH.Mods.fc.js'
				}
			]
		},
		{
			'id'       :'vish9',
			'template' :'t2',
			'elements':[				
				{
                    'id'          : '328',
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
                    'id'       : '329',
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
                    'id'       : '330',
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
		{
			'id'       :'vish12',
			'template' :'t2',
			'elements':[
				{
                    'id'     : '331',
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Sublime HTML5 video!'
				},       
				{
                    'id'     : '332',
					'type'   : 'video',
					'areaid' : 'center',
					'controls' : true,
					'autoplay' : false,
					'loop' : false,
					'poster' : "http://d1p69vb2iuddhr.cloudfront.net/assets/www/demo/midnight_sun_800-e460322294501e1d5db9ab3859dd859a.jpg",
					'sources': '[{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},{"type": "video/mp4","src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4"}]'
				}
			]
		},
		{
			'id'       :'vish13',
			'template' :'t1',
			'elements':[
				{
                    'id'     : '333',
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Example of HTML5 video with autostart'
				},
				{
                    'id'     : '334',
					'type'   : 'text',
					'areaid' : 'left',
					'body'   : '<p> HTML5 is a language for structuring and presenting content for the World Wide Web, and is a core technology of the Internet originally proposed by Opera Software. It is the fifth revision of the HTML standard (created in 1990 and standardized as HTML4 as of 1997) and as of March 2012 is still under development. Its core aims have been to improve the language with support for the latest multimedia while keeping it easily readable by humans and consistently understood by computers and devices (web browsers, parsers, etc.). HTML5 is intended to subsume not only HTML 4, but XHTML 1 and DOM Level 2 HTML as well.</p>'
				},
				{
                    'id'     : '335',
					'type'   : 'video',
					'areaid' : 'right',
					'controls' : true,
					'autoplay' : true,
					'sources': '[{ "type": "video/webm", "src": "videos/kids.webm"},{"type": "video/mp4","src": "videos/kids.mp4"}]'
				}
			]
		},
		{
			'id'       :'vish14',
			'template' :'t1',
			'elements':[
				{
                    'id'     : '393',
					'type'   : 'text',
					'areaid' : 'header',
					'body'   : 'Example of Youtube video'
				},
				{
                    'id'     : '334',
					'type'   : 'text',
					'areaid' : 'left',
					'body'   : '<p> HTML5 is a language for structuring and presenting content for the World Wide Web, and is a core technology of the Internet originally proposed by Opera Software. It is the fifth revision of the HTML standard (created in 1990 and standardized as HTML4 as of 1997) and as of March 2012 is still under development. Its core aims have been to improve the language with support for the latest multimedia while keeping it easily readable by humans and consistently understood by computers and devices (web browsers, parsers, etc.). HTML5 is intended to subsume not only HTML 4, but XHTML 1 and DOM Level 2 HTML as well.</p>'
				},
				{
                    'id'     : '335',
					'type'   : 'iframe',
					'areaid' : 'right',
					'body'   : '<iframe width="324" height="243" src="http://www.youtube.com/embed/_jvDzfTRP4E" frameborder="0" allowfullscreen></iframe>'
				}
			]
		}
		]};

	return {
		samples: samples
	};

})(VISH);