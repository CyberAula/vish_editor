VISH.Samples.API = (function(V,undefined){
	
	var video = {
      'id'     : '1534',
      'title'         :  'Midnight Sun',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'John Doe',
      'poster' : "http://d1p69vb2iuddhr.cloudfront.net/assets/www/demo/midnight_sun_800-e460322294501e1d5db9ab3859dd859a.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    };
    
    var videoList = {
    'videos'        : [
    {
      'id'     : '1534',
      'title'         :  'HTML5 Demo',
      'description'   :  'HTML5 (HyperText Markup Language, version 5) es la quinta revision importante del lenguaje basico de la World Wide Web, HTML. HTML5 especifica dos variantes de sintaxis para HTML: un clasico HTML (text/html), la variante conocida como HTML5 y una variante XHTML conocida como sintaxis XHTML5 que debera ser servida como XML (XHTML) (application/xhtml+xml).1 2 Esta es la primera vez que HTML y XHTML se han desarrollado en paralelo.',
      'author'        :  'Awesome Videos',
      'poster' : "http://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Sasso_lungo_da_passo_pordoi.jpg/250px-Sasso_lungo_da_passo_pordoi.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1535',
      'title'         :  'Paisaje bonito',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://d1p69vb2iuddhr.cloudfront.net/assets/www/demo/midnight_sun_800-e460322294501e1d5db9ab3859dd859a.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1536',
      'title'         :  'Otro paisaje bonito',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://1.bp.blogspot.com/-DFj9INluj80/TfiNl7q3DbI/AAAAAAAAAws/hVJu13VbKEY/s1600/paisaje.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1537',
      'title'         :  'Verde',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://www.forodefotos.com/attachments/naturaleza/12983d1281113830-fotos-de-paisaje-fotos-de-paisaje.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1538',
      'title'         :  'Noche',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://ro18.blogspot.es/img/paisaje.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1539',
      'title'         :  'Puesta de sol',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://walpaper.es/images/wallpapers/Paisaje-fotografia-HDR-656343.jpeg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1540',
      'title'         :  'Cayuco',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://3.bp.blogspot.com/-a-WrZZf0WJo/TsEBPXjUQXI/AAAAAAAAFBg/kh0aS9Kemag/s1600/PAISAJE+JUANMA.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1541',
      'title'         :  'Aves',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://images.artelista.com/artelista/obras/fichas/8/3/3/8619208014133041.JPG",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1542',
      'title'         :  'Delfines',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://4.bp.blogspot.com/-CfZKEdXcXtg/TijG57sIFWI/AAAAAAAAARQ/O8FP1OQ0a0w/s1600/delfines-saltando.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1543',
      'title'         :  'Gato',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://www.10puntos.com/wp-content/uploads/2010/09/gato-lindo.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1544',
      'title'         :  'Otro gato',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://neko.koiora.net/files/2011/06/Gato17.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    },
    {
      'id'     : '1545',
      'title'         :  'Gato ninja',
      'description'   :  'Awesome HTML5 video example',
      'author'        :  'Aldo Gordillo',
      'poster' : "http://www.sarda.es/fotos/gato_volador/gato_volador.jpg",
      'sources': '['                                                                                                         +
                    '{ "type": "video/webm", "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_720p.webm"},'  + 
                    '{ "type": "video/mp4",  "src": "http://media.jilion.com/videos/demo/midnight_sun_sv1_360p.mp4" }'   +
                 ']'
    }
    ]};
    
    var flashList = {
    'flashes'       : [
    {
      'id'     : '1534',
      'title'         :  'HTML5 Demo',
      'description'   :  'Flash Object Test',
      'author'        :  'FlashMan',
      'content'       :  '<embed width="100%" height="100%" id="player_api" src="/media/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
    },
    {
        'id'     : '1535',
        'title'         :  'HTML5 Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="/media/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
    },
    {
        'id'     : '1536',
        'title'         :  'HTML5 Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="/media/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
    },
    {
        'id'     : '1537',
        'title'         :  'HTML5 Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="/media/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
    },
    {
        'id'     : '1538',
        'title'         :  'HTML5 Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="/media/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
    },
    {
        'id'     : '1539',
        'title'         :  'HTML5 Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="/media/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
    },
    {
        'id'     : '1540',
        'title'         :  'HTML5 Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="/media/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
    },
    {
        'id'     : '1541',
        'title'         :  'HTML5 Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="/media/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
    },
    {
        'id'     : '1542',
        'title'         :  'HTML5 Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="/media/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
    },
    {
        'id'     : '1543',
        'title'         :  'HTML5 Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<iframe width="560" height="315" src="http://www.youtube.com/embed/1hR7EtD6Bns" frameborder="0" allowfullscreen></iframe>'
    }
    ]};
    
    
	return {
		videoList: videoList,
		flashList: flashList
	};

})(VISH);