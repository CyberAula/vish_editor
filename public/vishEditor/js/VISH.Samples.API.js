VISH.Samples.API = (function(V,undefined){
	
  var recommendationList = [
    { "id"                : "1",
      "url"               : "http://vishub.org/excursions/144",
      "title"             : "Nanogame",
      "author"            : "Enrique Barra",
      "description"       : " bla bla bla",
      "image"             : "http://vishub.org/assets/logos/original/excursion-05.png",
      "views"             : "56",
      "favourites"        : "3",
      "number_of_slides"  : "8"
    },
    { "id"                : "2",
      "url"               : "http://vishub.org/excursions/83",
      "title"             : "Flascard Curiosity",
      "author"            : "Evita Tassiopolu",
      "description"       : " bla bla bla 2",
      "image"             : "http://www.topsecretwriters.com/wp-content/uploads/2012/08/curiosityrover.jpg",
      "views"             : "563",
      "favourites"        : "13",
      "number_of_slides"  : "2"
    },
    { "id"                : "3",
      "url"               : "http://vishub.org/excursions/55",
      "title"             : "Madrid´s Planetarium",
      "author"            : "Nestor Toribio",
      "description"       : " bla bla bla",
      "image"             : "http://upload.wikimedia.org/wikipedia/commons/0/06/Planetarium_WPKiW.jpg",
      "views"             : "56",
      "favourites"        : "33",
      "number_of_slides"  : "8"
    },
    { "id"                : "4",
      "url"               : "http://vishub.org/excursions/14",
      "title"             : "Earth explained",
      "author"            : "Enrique Barra",
      "description"       : " bla bla bla",
      "image"             : "http://upload.wikimedia.org/wikipedia/commons/2/22/Earth_Western_Hemisphere_transparent_background.png",
      "views"             : "156",
      "favourites"        : "3",
      "number_of_slides"  : "8"
    },
    { "id"                : "5",
      "url"               : "http://vishub.org/excursions/81",
      "title"             : "Planets: Mars",
      "author"            : "Barbara Kieslinger ",
      "description"       : " bla bla bla 2",
      "image"             : "http://static.giantbomb.com/uploads/scale_small/0/4866/192066-mars.jpg",
      "views"             : "463",
      "favourites"        : "23",
      "number_of_slides"  : "2"
    },
    { "id"                : "6",
      "url"               : "http://vishub.org/excursions/56",
      "title"             : "Galileo",
      "author"            : "Nestor Toribio",
      "description"       : " bla bla bla",
      "image"             : "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRjinxT31jvvelugew_ydynnvzXcJRLSeTAMYPfEcFZsbvxAlHP",
      "views"             : "1256",
      "favourites"        : "33",
      "number_of_slides"  : "8"
    }    
  ];


  var excursionsList = {
     'excursions': [
        VISH.Samples.full_samples, VISH.Samples.quiz_samples, VISH.Samples.magnetic_gifs, 
        VISH.Samples.basic_samples, VISH.Samples.fc_sample, VISH.Samples.samples_vtour,
        VISH.Samples.samplesv01, VISH.Samples.test
     ]
  }

  
  var flashcardList = {
    'flashcards': [
    {
      "id"      : "1120",
      "VEVersion":"0.2",
      "type":"flashcard",
      "author":"",
      "slides":[
        {
          "id":"article4",
          "type":"flashcard",
          "background":"url(http://4.bp.blogspot.com/-fsV8poJXoJc/ULe8nkVbaVI/AAAAAAAAA-M/Q2vW16z6Ivc/s1600/Imagen16.png)",
          "pois":[
            {
              "id":"article4_poi1",
              "x":"36.875",
              "y":"67.33333333333333",
              "slide_id":"article4_article1"
            },{
              "id":"article4_poi2",
              "x":"55.375",
              "y":"68.16666666666667",
              "slide_id":"article4_article2"
            },{
              "id":"article4_poi3",
              "x":"45.875",
              "y":"5.5",
              "slide_id":"article4_article3"
            }
          ],
          "slides":[
            {
              "id":"article4_article1",
              "type":"standard",
              "template":"t2",
              "elements":[
                {
                  "id":"article4_article1_zone1",
                  "type":"image",
                  "areaid":"left",
                  "body":"http://1.bp.blogspot.com/_KaMLeO20q1Q/TGk8gfWkp7I/AAAAAAAAAHI/80bTifiIk6M/s1600/24+Do%C3%B1ana.JPG",
                  "style":"position: relative; width:110.31518624641834%; height:97.1590909090909%; top:2.0833333333333335%; left:-1.146131805157593%;"
                }
              ]
            },
            {
              "id":"article4_article2",
              "type":"standard",
              "template":"t2",
              "elements":[
                {
                  "id":"article4_article2_zone1",
                  "type":"image",
                  "areaid":"left",
                  "body":"http://farm9.staticflickr.com/8504/8367119464_f8ff09456d.jpg",
                  "style":"position: relative; width:103.15186246418338%; height:90.53030303030303%; top:3.0303030303030303%; left:-0.5730659025787965%;"
                }
              ]
            },{
              "id":"article4_article3",
              "type":"standard",
              "template":"t2",
              "elements":[
                {
                  "id":"article4_article3_zone1",
                  "type":"image",
                  "areaid":"left",
                  "body":"http://cabeceras.eldiariomontanes.es/imagenes-municipios/galerias/5348/mf01z4411811x1492-452.jpg",
                  "style":"position: relative; width:119.05444126074498%; height:129.54545454545453%; top:-2.6515151515151514%; left:-3.5816618911174785%;"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id"      : "1115","VEVersion":"0.2","type":"flashcard","author":"","slides":[{"id":"article4","type":"flashcard","background":"url(http://www.exploringnature.org/graphics/endangered_species/endangered_animals200.jpg)","pois":[{"id":"article4_poi1","x":"15.625","y":"8.5","slide_id":"article4_article3"},{"id":"article4_poi2","x":"77.75","y":"11.5","slide_id":"article4_article1"},{"id":"article4_poi3","x":"17.125","y":"58.833333333333336","slide_id":"article4_article2"}],"slides":[{"id":"article4_article3","type":"standard","template":"t10","elements":[{"id":"article4_article3_zone1","type":"image","areaid":"center","body":"http://d30mmglg94tqnw.cloudfront.net/wp-content/plugins/magic-gallery/uploads/12/komodo-dragon_6771_600x450.jpg","style":"position: relative; width:49.62406015037594%; height:66.22073578595318%; top:15.719063545150501%; left:24.18546365914787%;"}]},{"id":"article4_article1","type":"standard","template":"t10","elements":[{"id":"article4_article1_zone1","type":"image","areaid":"center","body":"http://www.golden-gate-park.com/wp-content/uploads/2011/03/bison_bufflo_in_golden_gate_park.jpg","style":"position: relative; width:60.526315789473685%; height:67.3913043478261%; top:15.719063545150501%; left:20.17543859649123%;"}]},{"id":"article4_article2","type":"standard","template":"t10","elements":[{"id":"article4_article2_zone1","type":"image","areaid":"center","body":"http://wfiles.brothersoft.com/e/elephant_88059-1600x1200.jpg","style":"position: relative; width:115.91478696741855%; height:116.05351170568562%; top:-2.842809364548495%; left:-0.7518796992481203%;"}]}]}]
    },
    {
        "id"        : "111",
        "title"     : "Chess: The Art of Learning",
        "description"   : "The Art of Learning, a journey in the pursuit of excellence.\nAmazing presentation with images, videos and 3d objects, generated by Vish Editor.",
        "avatar"    : "/vishEditor/images/excursion_thumbnails/excursion-10.png",
        "author"    : "John Doe",
        "type"      : "flashcard",
        "tags"      : ["Samples","Test","Development"],
        "author" : "",
        "theme"  : "theme1",
        "age_range" : "4 - 14",
        "subject" : "Media Education",
        "language" : "en",
        "educational_objectives" : "bla bla bla 3",
        "adquired_competencies" : "pupils will be smarter",
        "slides" : [
        {
          "id"      : "article1",
          "type"      : "flashcard",
          "background"  : "url(http://html.rincondelvago.com/000563580.png)",
          "pois": [
              {"id": "article1_poi1",
                "x" : "11",
                "y" : "4.5",
                "slide_id": "article1_article1"},
               {"id": "article1_poi2",
                "x" : "47",
                "y" : "34",
                "slide_id": "article1_article2"},
               {"id": "article1_poi3",
                "x" : "84",
                "y" : "81",
                "slide_id": "article1_article3"}],
          "slides" : [{
          "id" : "article1_article1",
          "template" : "t1",
          "elements" : [{
            "id" : "article1_article1_zone1",
            "type" : "image",
            "areaid" : "left",
            "body" : "http://blogs.20minutos.es/cronicaverde/files/parque_nacional_donana_lince_iberico.jpg",
            "style" : "position: relative; width:97.82608695652173%; height:80.10752688172043%; top:0%; left:0%;"
          }, {
            "id" : "article1_article1_zone2",
            "type" : "text",
            "areaid" : "header",
            "body" : "<div class=\"vish-parent-font3 vish-parent-font6\" style=\"text-align: center; font-weight: normal; \"><span class=\"vish-font3 vish-fontarial\"><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"><span style=\"font-family: helvetica;\"><span style=\"font-weight: bold;\">Chess</span>: The Art of Learning</span></span><br></span></div>"
          }, {
            "id" : "article1_article1_zone3",
            "type" : "text",
            "areaid" : "subheader",
            "body" : "<div class=\"vish-parent-font3 vish-parent-font4\" style=\"text-align: right; font-weight: normal; \"><span class=\"vish-font3 vish-fontarial\"><span class=\"vish-font4 vish-fontHelvetica\" style=\"undefined;\"><span style=\"font-style: italic; font-family: helvetica;\">by Aldo Gordillo&nbsp; </span></span><br></span></div>"
          }]
        }, {
          'id'       :'article1_article2',
          'template' :'t2',
          'elements':[
            {
              'id'     : 'article1_article2_zone1',
              'type'   : 'text',
              'areaid' : 'header',
              'body'   : 'Experimento virtual1'
            },
            {
              'id'     : 'article1_article2_zone2',
              'type'   : 'object',
              'areaid' : 'left',
              'body'   : '<embed width="99%" height="99%" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash"></embed>'
            }]
        }, {
          "id" : "article1_article3",
          "template" : "t6",
          "elements" : [{
            "id" : "article1_article3_zone1",
            "type" : "text",
            "areaid" : "header",
            "body" : "<div class=\"vish-parent-font3 vish-parent-font6 vish-parent-font4\" style=\"font-weight: normal; \"><span class=\"vish-font3 vish-fontHelvetica\" style=\"\"><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"><span style=\"color: rgb(219, 150, 0);\">Iberian</span></span><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"> </span><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"><span style=\"color: rgb(32, 24, 21);\">Lynx</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class=\"vish-font4 vish-fontHelvetica\" style=\"undefined;\"><span style=\"color: rgb(113, 113, 117);\">Reproduction</span></span><br></span></div>"
          }, {
            "id" : "article1_article3_zone2",
            "type" : "image",
            "areaid" : "left",
            "body" : "http://i13.photobucket.com/albums/a288/inkslinger0611/drawings/Iberian.jpg",
            "style" : "position: relative; width:380.95238095238096%; height:218.69565217391303%; top:-36.231884541718856%; left:-58.201090494791664%;"
          }, {
            "id" : "article1_article3_zone3",
            "type" : "image",
            "areaid" : "center",
            "body" : "http://i13.photobucket.com/albums/a288/inkslinger0611/drawings/Iberian.jpg",
            "style" : "position: relative; width:357.14285714285717%; height:205.2173913043478%; top:-45.41062894074813%; left:-193.12174479166666%;"
          }, {
            "id" : "article1_article3_zone4",
            "type" : "text",
            "areaid" : "right",
            "body" : "<div class=\"vish-parent-font2\" style=\"text-align: center; font-weight: normal; \"><span class=\"vish-font2 vish-fontHelvetica\" style=\"\">During the mating season the female leaves her territory in search of a male. The typical gestation period is about two months; the cubs are born between March and September, with a peak of births in March and April. A litter consists of two or three (rarely one, four or five) kittens weighing between 200 and 250 grams (7.1 and 8.8 oz).The kittens become independent at seven to 10 months old, but remain with the mother until around 20 months old. Survival of the young depends heavily on the availability of prey species. In the wild, both males and females reach sexual maturity at one year old, though in practice they rarely breed until a territory becomes vacant; one female was known not to breed until five years old when its mother died.</span></div>"
          }]
        }]
        }]
      },
      {
        "id"        : "222",
        "title"     : "Curiosity",
        "description"   : "The Art of Learning, a journey in the pursuit of excellence.\nAmazing presentation with images, videos and 3d objects, generated by Vish Editor.",
        "avatar"    : "/vishEditor/images/excursion_thumbnails/excursion-12.png",
        "author"    : "Comepiedras volador",
        "type"      : "flashcard",
        "tags"      : ["Samples","Test","Development"],
        "theme"     : "theme1",
        "age_range" : "4 - 14",
        "subject" : "Media Education",
        "language" : "en",
        "educational_objectives" : "Known the comepiedras volador",
        "adquired_competencies" : "pupils will be smarter",
        "slides" : [
        {
          "id"      : "article1",
          "type"      : "flashcard",
          "background"  : "url(http://images.freshnessmag.com/wp-content/uploads//2012/08/nasa-NASA-curiosity-mars-rover-00.jpg)",
          "pois": [
              {"id": "article1_poi1",
                "x" : "11",
                "y" : "4.5",
                "slide_id": "article1_article1"},
               {"id": "article1_poi2",
                "x" : "47",
                "y" : "34",
                "slide_id": "article1_article2"},
               {"id": "article1_poi3",
                "x" : "84",
                "y" : "81",
                "slide_id": "article1_article3"}],
          "slides" : [{
          "id" : "article1_article1",
          "template" : "t1",
          "elements" : [{
            "id" : "article1_article1_zone1",
            "type" : "image",
            "areaid" : "left",
            "body" : "http://blogs.20minutos.es/cronicaverde/files/parque_nacional_donana_lince_iberico.jpg",
            "style" : "position: relative; width:97.82608695652173%; height:80.10752688172043%; top:0%; left:0%;"
          }, {
            "id" : "article1_article1_zone2",
            "type" : "text",
            "areaid" : "header",
            "body" : "<div class=\"vish-parent-font3 vish-parent-font6\" style=\"text-align: center; font-weight: normal; \"><span class=\"vish-font3 vish-fontarial\"><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"><span style=\"font-family: helvetica;\"><span style=\"font-weight: bold;\">Chess</span>: The Art of Learning</span></span><br></span></div>"
          }, {
            "id" : "article1_article1_zone3",
            "type" : "text",
            "areaid" : "subheader",
            "body" : "<div class=\"vish-parent-font3 vish-parent-font4\" style=\"text-align: right; font-weight: normal; \"><span class=\"vish-font3 vish-fontarial\"><span class=\"vish-font4 vish-fontHelvetica\" style=\"undefined;\"><span style=\"font-style: italic; font-family: helvetica;\">by Aldo Gordillo&nbsp; </span></span><br></span></div>"
          }]
        }, {
          'id'       :'article1_article2',
          'template' :'t2',
          'elements':[
            {
              'id'     : 'article1_article2_zone1',
              'type'   : 'text',
              'areaid' : 'header',
              'body'   : 'Experimento virtual1'
            },
            {
              'id'     : 'article1_article2_zone2',
              'type'   : 'object',
              'areaid' : 'left',
              'body'   : '<embed width="99%" height="99%" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash"></embed>'
            }]
            }, {
          "id" : "article1_article3",
          "template" : "t6",
          "elements" : [{
            "id" : "article1_article3_zone1",
            "type" : "text",
            "areaid" : "header",
            "body" : "<div class=\"vish-parent-font3 vish-parent-font6 vish-parent-font4\" style=\"font-weight: normal; \"><span class=\"vish-font3 vish-fontHelvetica\" style=\"\"><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"><span style=\"color: rgb(219, 150, 0);\">Iberian</span></span><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"> </span><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"><span style=\"color: rgb(32, 24, 21);\">Lynx</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class=\"vish-font4 vish-fontHelvetica\" style=\"undefined;\"><span style=\"color: rgb(113, 113, 117);\">Reproduction</span></span><br></span></div>"
          }, {
            "id" : "article1_article3_zone2",
            "type" : "image",
            "areaid" : "left",
            "body" : "http://i13.photobucket.com/albums/a288/inkslinger0611/drawings/Iberian.jpg",
            "style" : "position: relative; width:380.95238095238096%; height:218.69565217391303%; top:-36.231884541718856%; left:-58.201090494791664%;"
          }, {
            "id" : "article1_article3_zone3",
            "type" : "image",
            "areaid" : "center",
            "body" : "http://i13.photobucket.com/albums/a288/inkslinger0611/drawings/Iberian.jpg",
            "style" : "position: relative; width:357.14285714285717%; height:205.2173913043478%; top:-45.41062894074813%; left:-193.12174479166666%;"
          }, {
            "id" : "article1_article3_zone4",
            "type" : "text",
            "areaid" : "right",
            "body" : "<div class=\"vish-parent-font2\" style=\"text-align: center; font-weight: normal; \"><span class=\"vish-font2 vish-fontHelvetica\" style=\"\">During the mating season the female leaves her territory in search of a male. The typical gestation period is about two months; the cubs are born between March and September, with a peak of births in March and April. A litter consists of two or three (rarely one, four or five) kittens weighing between 200 and 250 grams (7.1 and 8.8 oz).The kittens become independent at seven to 10 months old, but remain with the mother until around 20 months old. Survival of the young depends heavily on the availability of prey species. In the wild, both males and females reach sexual maturity at one year old, though in practice they rarely breed until a territory becomes vacant; one female was known not to breed until five years old when its mother died.</span></div>"
          }]
        }]
        }]
      }
    ]};

  var smartcardList = {
    'excursions': [
        flashcardList.flashcards[0],
        flashcardList.flashcards[1],
        flashcardList.flashcards[2],
        flashcardList.flashcards[3],
        flashcardList.flashcards[3],
        flashcardList.flashcards[3],
        VISH.Samples.fc_sample, 
        VISH.Samples.samples_vtour
    ]
  };

	var imageList = {
		'pictures': [
		{
			"id":54,
			"title":"ClintEastwood.jpg",
			"description":null,
			"author":"Demo",
			"src":"http://www.dan-dare.org/dan%20simpsons/TheSimpsonsEveryoneEver800.jpg"
		},
		{
      "id":55,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://3.bp.blogspot.com/--H0o8mc28bA/TxrsnMAFMDI/AAAAAAAAARs/eOCVIXKlm9I/s1600/sala-cine.jpg"
    },
		{
      "id":56,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://www.deviantart.com/download/46036660/The_Simpsonzu_by_spacecoyote.jpg"
    },
		{
      "id":57,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://www.granadablogs.com/pateandoelmundo/wp-content/uploads/2009/10/_061.jpg"
    },
		{
      "id":58,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://www.revistaintime.com/wp-content/uploads/2012/03/el-padrino-2.jpg"
    },
		{
      "id":59,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://cinealdesnudo.files.wordpress.com/2011/12/el-indomable-will-hunting.jpg"
    },
		{
      "id":60,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://politicamenteconservador.blogia.com/upload/20060818041914-el-senor-de-los-anillos2.jpg"
    },
		{
      "id":61,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://despertando.me/wp-content/uploads/2012/04/el-se%C3%B1or-de-los-anillos.jpg"
    },
		{
      "id":62,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://4.bp.blogspot.com/-Fh_v8PYbVg0/TyGdKEiYmKI/AAAAAAAAAPI/MKdfZ224aEQ/s1600/el_senor_de_los_anillos_la_batalla_por_la_tierra_media_2_the_rise_of_the_witchking-181035.jpg"
    },
		{
      "id":63,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://1.bp.blogspot.com/_9PpLM82o3g0/S8uPONu3kaI/AAAAAAAAC9A/thHNALuFxdE/s1600/Gandalf-vs-El-Balrog-gandalf-7018563-1280-960.jpg"
    },
		{
      "id":64,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"NOVAACARGAR"
    },
		{
      "id":65,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://www.deviantart.com/download/46036660/The_Simpsonzu_by_spacecoyote.jpg"
    },
		{
      "id":66,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://www.deviantart.com/download/46036660/The_Simpsonzu_by_spacecoyote.jpg"
    },
		{
      "id":67,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://www.deviantart.com/download/46036660/The_Simpsonzu_by_spacecoyote.jpg"
    },
		{
      "id":68,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://www.deviantart.com/download/46036660/The_Simpsonzu_by_spacecoyote.jpg"
    },
		{
			"id":69,
			"title":"ClintEastwoooood.jpg",
			"description": "this is clint",
			"author":"Demo",
			"src":"http://upload.wikimedia.org/wikipedia/en/4/47/Simpsons_on_Tracey_Ullman.png"
		}
		]
	};
	
	var imageListLittle = {
    'pictures': [
    {
      "id":54,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://www.dan-dare.org/dan%20simpsons/TheSimpsonsEveryoneEver800.jpg"
    },
    {
      "id":55,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://3.bp.blogspot.com/--H0o8mc28bA/TxrsnMAFMDI/AAAAAAAAARs/eOCVIXKlm9I/s1600/sala-cine.jpg"
    },
    {
      "id":56,
      "title":"ClintEastwood.jpg",
      "description":null,
      "author":"Demo",
      "src":"http://www.deviantart.com/download/46036660/The_Simpsonzu_by_spacecoyote.jpg"
    }
    ]
  };
	
	
	var imageListDummy = {
    'pictures': []
  };
	
	
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
		
		
	var videoListLittle = {
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
    }
    ]};
		
		
	var videoListDummy = {
    'videos'        : []
	};	
    
		
  var flashList = {
    'flashes'       : [
    {
      'id'     : '1534',
      'title'         :  'Profe',
      'description'   :  'Flash Object Test',
      'author'        :  'FlashMan',
      'content'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    },
    {
        'id'     : '1535',
        'title'         :  'Youtube video about HTML5',
        'description'   :  'HTML5 (HyperText Markup Language, version 5) es la quinta revision importante del lenguaje basico de la World Wide Web, HTML.',
        'author'        :  'W3C',
        'content'       :  '<iframe width="560" height="315" src="http://www.youtube.com/embed/1hR7EtD6Bns?wmode=opaque" frameborder="0" allowfullscreen></iframe>'
    },
    {
        'id'     : '1536',
        'title'         :  'Global excursion',
        'description'   :  'Iframe example',
        'author'        :  'Vish',
        'content'       :  '<iframe width="100%" height="100%" src="http://www.globalexcursion-project.eu"></iframe>'
    },
    {
        'id'     : '1537',
        'title'         :  'Image',
        'description'   :  'Image Embed',
        'author'        :  'Globedia',
        'content'       :  '<embed width="100%" src="http://globedia.com/imagenes/noticias/2011/2/10/encuentran-octava-maravilla-mundo-destruida-125-anos_2_585286.jpg"></embed>'
    },
    {
        'id'     : '1538',
        'title'         :  'Profe Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    },
    {
        'id'     : '1539',
        'title'         :  'Profe Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    },
    {
        'id'     : '1540',
        'title'         :  'Profe Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    },
    {
        'id'     : '1541',
        'title'         :  'Profe Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    },
    {
        'id'     : '1542',
        'title'         :  'Profe Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    },
    {
        'id'     : '1543',
        'title'         :  'Youtube video',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'content'       :  '<iframe width="560" height="315" src="http://www.youtube.com/embed/1hR7EtD6Bns" frameborder="0" allowfullscreen></iframe>'
    }
    ]};
    
		
		var flashListLittle = {
    'flashes'       : [
    {
      'id'     : '1534',
      'title'         :  'Profe',
      'description'   :  'Flash Object Test',
      'author'        :  'FlashMan',
      'content'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    },
    {
        'id'     : '1535',
        'title'         :  'Youtube video about HTML5',
        'description'   :  'HTML5 (HyperText Markup Language, version 5) es la quinta revision importante del lenguaje basico de la World Wide Web, HTML.',
        'author'        :  'W3C',
        'content'       :  '<iframe width="560" height="315" src="http://www.youtube.com/embed/1hR7EtD6Bns?wmode=opaque" frameborder="0" allowfullscreen></iframe>'
    },
    {
        'id'     : '1536',
        'title'         :  'Global excursion',
        'description'   :  'Iframe example',
        'author'        :  'Vish',
        'content'       :  '<iframe width="100%" height="100%" src="http://www.globalexcursion-project.eu"></iframe>'
    }
    ]};
		
		
	 var flashListDummy = {
    'flashes'       : []
	 };
	   
			 
   var liveList = [
    {
      'id'     : '1534',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
      {
      'id'     : '1535',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1536',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1537',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1538',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1539',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1540',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1541',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1542',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1543',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1544',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1545',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1546',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1547',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
		  {
      'id'     : '1548',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    }
    ];
    
    
    var liveListLittle = [
    {
      'id'     : '1534',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
    {
      'id'     : '1535',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    },
    {
      'id'     : '1548',
      'title'         :  'Do\u00f1ana Test',
      'description'   :  'Parque Nacional de Do\u00f1ana (Spain) ',
      'author'        :  'Demo',
      'fulltext'       :  'http://www.youtube.com/watch?v=5TVrUFxzOk8'
    }
    ];
    
    
   var liveListDummy = [];
	 

	 var objectList = [
    {
      'id'     : '1534',
      'title'         :  'Game Strauss',
      'description'   :  'Fichero PDF',
      'author'        :  'Conspirazzi',
      'object'        :  'http://www.conspirazzi.com/e-books/game-strauss.pdf'
    },
		{
      'id'     : '1536',
      'title'         :  'Profe',
      'description'   :  'Flash Object Test',
      'author'        :  'FlashMan',
      'object'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    },
    {
        'id'     : '1537',
        'title'         :  'Youtube video about HTML5',
        'description'   :  'HTML5 (HyperText Markup Language, version 5) es la quinta revision importante del lenguaje basico de la World Wide Web, HTML.',
        'author'        :  'W3C',
        'object'       :  '<iframe width="560" height="315" src="http://www.youtube.com/embed/1hR7EtD6Bns?wmode=opaque" frameborder="0" allowfullscreen></iframe>'
    },
    {
        'id'     : '1538',
        'title'         :  'Global excursion',
        'description'   :  'Iframe example',
        'author'        :  'Vish',
        'object'       :  '<iframe width="100%" height="100%" src="http://www.globalexcursion-project.eu"></iframe>'
    },
    {
        'id'     : '1539',
        'title'         :  'Image',
        'description'   :  'Image Embed',
        'author'        :  'Globedia',
        'object'       :  '<embed width="100%" src="http://globedia.com/imagenes/noticias/2011/2/10/encuentran-octava-maravilla-mundo-destruida-125-anos_2_585286.jpg"></embed>'
    },
    {
        'id'     : '1540',
        'title'         :  'Profe Demo',
        'description'   :  'Flash Object Test 2',
        'author'        :  'FlashMan',
        'object'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    }
    ];
	 
	 var objectListLittle = [
    {
      'id'     : '1534',
      'title'         :  'Game Strauss',
      'description'   :  'Fichero PDF',
      'author'        :  'Conspirazzi',
      'object'       :  'http://www.conspirazzi.com/e-books/game-strauss.pdf'
    },
    {
      'id'     : '1536',
      'title'         :  'Profe',
      'description'   :  'Flash Object Test',
      'author'        :  'FlashMan',
      'object'       :  '<embed width="100%" height="100%" id="player_api" src="examples/contents/swf/virtualexperiment.swf" type="application/x-shockwave-flash" wmode="opaque"></embed>'
    },
    {
        'id'     : '1537',
        'title'         :  'Youtube video about HTML5',
        'description'   :  'HTML5 (HyperText Markup Language, version 5) es la quinta revision importante del lenguaje basico de la World Wide Web, HTML.',
        'author'        :  'W3C',
        'object'       :  '<iframe width="560" height="315" src="http://www.youtube.com/embed/1hR7EtD6Bns?wmode=opaque" frameborder="0" allowfullscreen></iframe>'
    }
    ];
    
    
   var objectListDummy = [];
	 
	 var tagsList = {
   	'tags': ["ActionScript","AppleScript","Asp","BASIC","C","C++","Clojure","COBOL","ColdFusion","Erlang",
		"Fortran","Groovy","Haskell","Java","JavaScript","Lisp","Perl","PHP","Python","Ruby","Scala","Scheme"]
   };

   var thumbnailsList =
     {
      "pictures"        : [
        { "title" : "Thumbnail 1",    "description" : "Sample excursion thumbnail 1",    "src" : "/vishEditor/images/excursion_thumbnails/excursion-01.png" },
        { "title" : "Thumbnail 2",    "description" : "Sample excursion thumbnail 2",    "src" : "/vishEditor/images/excursion_thumbnails/excursion-02.png" },
        { "title" : "Thumbnail 3",    "description" : "Sample excursion thumbnail 3",    "src" : "/vishEditor/images/excursion_thumbnails/excursion-03.png" },
        { "title" : "Thumbnail 4",    "description" : "Sample excursion thumbnail 4",    "src" : "/vishEditor/images/excursion_thumbnails/excursion-04.png" },
        { "title" : "Thumbnail 5",    "description" : "Sample excursion thumbnail 5",    "src" : "/vishEditor/images/excursion_thumbnails/excursion-05.png" },
        { "title" : "Thumbnail 6",    "description" : "Sample excursion thumbnail 6",    "src" : "/vishEditor/images/excursion_thumbnails/excursion-06.png" },
        { "title" : "Thumbnail 7",    "description" : "Sample excursion thumbnail 7",    "src" : "/vishEditor/images/excursion_thumbnails/excursion-07.png" },
        { "title" : "Thumbnail 8",    "description" : "Sample excursion thumbnail 8",    "src" : "/vishEditor/images/excursion_thumbnails/excursion-08.png" },
        { "title" : "Thumbnail 9",    "description" : "Sample excursion thumbnail 9",    "src" : "/vishEditor/images/excursion_thumbnails/excursion-09.png" },
        { "title" : "Thumbnail 10",   "description" : "Sample excursion thumbnail 10",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-10.png" },
        { "title" : "Thumbnail 11",   "description" : "Sample excursion thumbnail 11",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-11.png" },
        { "title" : "Thumbnail 12",   "description" : "Sample excursion thumbnail 12",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-12.png" },
        { "title" : "Thumbnail 13",   "description" : "Sample excursion thumbnail 13",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-13.png" },
        { "title" : "Thumbnail 14",   "description" : "Sample excursion thumbnail 14",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-14.png" },
        { "title" : "Thumbnail 15",   "description" : "Sample excursion thumbnail 15",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-15.png" },
        { "title" : "Thumbnail 16",   "description" : "Sample excursion thumbnail 16",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-16.png" },
        { "title" : "Thumbnail 17",   "description" : "Sample excursion thumbnail 17",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-17.png" },
        { "title" : "Thumbnail 18",   "description" : "Sample excursion thumbnail 18",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-18.png" },
        { "title" : "Thumbnail 19",   "description" : "Sample excursion thumbnail 19",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-19.png" },
        { "title" : "Thumbnail 20",   "description" : "Sample excursion thumbnail 20",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-20.png" },
        { "title" : "Thumbnail 21",   "description" : "Sample excursion thumbnail 21",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-21.png" },
        { "title" : "Thumbnail 22",   "description" : "Sample excursion thumbnail 22",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-22.png" },
        { "title" : "Thumbnail 23",   "description" : "Sample excursion thumbnail 23",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-23.png" },
        { "title" : "Thumbnail 24",   "description" : "Sample excursion thumbnail 24",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-24.png" },
        { "title" : "Thumbnail 25",   "description" : "Sample excursion thumbnail 25",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-25.png" },
        { "title" : "Thumbnail 26",   "description" : "Sample excursion thumbnail 26",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-26.png" },
        { "title" : "Thumbnail 27",   "description" : "Sample excursion thumbnail 27",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-27.png" },
        { "title" : "Thumbnail 28",   "description" : "Sample excursion thumbnail 28",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-28.png" },
        { "title" : "Thumbnail 29",   "description" : "Sample excursion thumbnail 29",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-29.png" },
        { "title" : "Thumbnail 30",   "description" : "Sample excursion thumbnail 30",   "src" : "/vishEditor/images/excursion_thumbnails/excursion-30.png" }
      ]
    };

    var LREImageList = {
      "results":[
        {
          "meta":{
            "id":157132,
            "provider":"ILBE",
            "langBlocks":[
              {
                "language":"x-mt-it",
                "title":"Fauna e Floara dell'Israele",
                "description":"Questa risorsa ha le fotografie, le descrizioni di alcuna della flora e fauna dell'Israele"
              },
              {
                "language":"x-mt-fr",
                "title":"Faune et Floara de l'Israel",
                "description":"Cette ressource a des photographies, des descriptions d'une partie de la flore et la faune de l'Israel"
              },
              {
                "language":"x-mt-de",
                "title":"Fauna und Floara von Israel",
                "description":"Dieses Hilfsmittel hat Fotographien, Beschreibungen von etwas von der Flora und Fauna von Israel"
              },
              {
                "language":"x-mt-es",
                "title":"Fauna y Floara de Israel",
                "description":"Este recurso tiene las fotografías, las descripciones de algo de la flora y fauna de Israel"
              },
              {
                "language":"en",
                "title":"Fauna and Floara of Israel",
                "description":"This resource has photographs, descriptions of some of the flora and Fauna of Israel"
              },
              {
                "language":"x-mt-pt",
                "title":"Fauna e Floara de Israel",
                "description":"Este recurso tem fotografias, descrições de algum do flora e fauna de Israel"
              },
              {
                "language":"x-mt-el",
                "title":"Πανίδα και Floara του Ισραήλ",
                "description":"Αυτό το στοιχείο συμπεριφοράς έχει τις φωτογραφίες, περιγραφές μερικές από τη χλωρίδα και την πανίδα του Ισραήλ"
              }
            ],
            "rights":{
              "cc":false,
              "url":"",
              "by":false,
              "nc":false,
              "nd":false,
              "sa":false
            },
            "expressions":[
              {
                "language":"en",
                "manifestations":[
                  {
                    "player":"webBrowser",
                    "urls":[
                      "http://oer.eun.org/VWClc0HZLsQohR_gIPB3Tm41jgwk"
                    ]
                  }
                ]
              }
            ]
          },
          "para":{
            "commentsInfo":{
              "count":0
            },
            "favouritesInfo":{
              "count":0
            },
            "idsTuple":{
              "expressionID":0,
              "globalLREID":157132,
              "manifestationID":0,
              "socialID":"157132/0/0"
            },
            "opinionsInfo":{
              "downCount":0,
              "upCount":0
            },
            "ratingsInfo":{
              "average":0,
              "count":0,
              "sum":0
            },
            "tagsInfo":{
              "labels":[

              ]
            }
          }
        },
        {
          "meta":{
            "id":249838,
            "provider":"TD",
            "langBlocks":[
              {
                "language":"en",
                "title":"Design Inspired by Nature",
                "description":"In this stills collage produced for Teachers' Domain, see several examples of everyday inventions that were either inspired by nature or are similar in form and function to plants or animals."
              }
            ],
            "rights":{
              "cc":false,
              "url":"http://www.teachersdomain.org/terms_of_use.html",
              "by":false,
              "nc":false,
              "nd":false,
              "sa":false
            },
            "expressions":[
              {
                "language":"en",
                "manifestations":[
                  {
                    "player":"landingPage",
                    "urls":[
                      "http://oer.eun.org/VWClc0LSLsIrhB_gIPJ4Rgn51X81"
                    ]
                  },
                  {
                    "player":"webBrowser",
                    "urls":[
                      "http://oer.eun.org/VWClc0LSLsIrhR_gIPJ4RgU23uqf"
                    ]
                  }
                ]
              }
            ]
          },
          "para":{
            "commentsInfo":{
              "count":0
            },
            "favouritesInfo":{
              "count":0
            },
            "idsTuple":{
              "expressionID":0,
              "globalLREID":249838,
              "manifestationID":0,
              "socialID":"249838/0/0"
            },
            "opinionsInfo":{
              "downCount":0,
              "upCount":0
            },
            "ratingsInfo":{
              "average":0,
              "count":0,
              "sum":0
            },
            "tagsInfo":{
              "labels":[

              ]
            }
          }
        },
        {
          "meta":{
            "id":253883,
            "provider":"NASAPHOTOJOURNAL",
            "langBlocks":[
              {
                "language":"x-mt-it",
                "title":"Hamersley ': Non abbastanza Come 'Il Cratere Dell'Aquila '",
                "description":"Questo mosaico approssimativo di immagine di allineare-colore dalla macchina fotografica panoramica sull'occasione del vagabondo di esplorazione del Marte mostra l'obiettivo nicknamed \"Hamersley\" all'interno \"del cratere di Fram.\" La natura del materiale dell'affioramento visto in questa posizione si interrompe visibilmente. Alcune zone egualmente hanno fare uno strato di che può essere distintivo da che cosa gli scienziati hanno visto precedentemente in \"cratere dell'aquila.\" L'occasione sta viaggiando verso \"una resistenza dubbed grande cratere.\" Può ritornare a Fram per ulteriore analisi delle relativi roccie e terrenise permessi di tempo. Le immagini in questo mosaico sono state prese sul solenoide 87 con le macchine fotografiche panoramica 480 -, 530- ed i filtri 600-nanometer."
              },
              {
                "language":"x-mt-de",
                "title":"Hamersley ': Nicht Durchaus Wie ' Adler-Krater '",
                "description":"Dieses ungefähre Zutreffendfarbe Bildmosaik von der panoramischen Kamera auf der Mars Erforschung-Vagabund-Gelegenheit zeigt das Ziel, das nicknamed ist \"Hamersley\" innerhalb \"des Fram Kraters.\" Die Natur des Zutageliegenmaterials, das in diesen Standort gesehen wird, wird sichtbar gestört. Etwas Bereiche haben auch das Überlagern, das sein kann unterscheidend von, was Wissenschaftler sahen vorher in \"Adler-Krater.\" Gelegenheit reist in Richtung zu einer großer Krater betitelten \"Ausdauer.\" Sie kann zu Fram für weitere Analyse seiner Felsen und Bodens zurückgehen wenn Zeiterlaubnis. Die Bilder in diesem Mosaik wurden auf Solenoid 87 mit der panoramischen Kamera 480 -, 530- und Filter 600-nanometer genommen."
              },
              {
                "language":"x-mt-fr",
                "title":"Hamersley ': Pas tout à fait Comme Le 'Cratère d'Aigle '",
                "description":"Cette mosaïque approximative d'image de vrai-couleur de l'appareil-photo panoramique sur l'occasion de vagabond d'exploration de Mars montre la cible surnommée \"Hamersley\" dans le \"cratère de Fram.\" La nature du matériel d'affleurement vu dans cet emplacement est visiblement perturbée. Quelques zones ont également poser qui peut être distinctif dece que les scientifiques ont vu précédemment en \"cratère d'aigle.\" L'occasion voyage vers une \"résistance doublée grand par cratère.\" Elle peut retourner à Fram pour davantage d'analyse de ses roches et sols si des laisux de temps. Les images dans cette mosaïque ont été prises sur le solénoïde 87 avec l'appareil-photo panoramique 480 -, 530- et filtres 600-nanometer."
              },
              {
                "language":"x-mt-es",
                "title":"Hamersley ': No absolutamente Como El ' Cráter Del Águila '",
                "description":"Este mosaico aproximado de la imagen del verdadero-color de la cámara fotográfica panorámica en la oportunidad del rover de la exploración de Marte muestra la blanco apodada \"Hamersley\" dentro del \"cráter de Fram.\" La naturaleza del material del afloramiento considerado en esta localización se interrumpe visiblemente. Algunas áreas también tienen acodar que pueda ser distintivo de lo que vieron los científicos previamenteen \"cráter del águila.\" La oportunidad está viajando hacia una \"resistencia doblada cráter grande.\" Puede volver a Fram para el análisis adicional de sus rocas y suelos si los permisos del tiempo. Las imágenes en este mosaico fueron adquiridas el solenoide 87 con la cámara fotográfica panorámica 480 -, 530- y filtros 600-nanometer."
              },
              {
                "language":"en",
                "title":"Hamersley' : Not Quite Like 'Eagle Crater'",
                "description":"This approximate true-color image mosaic from the panoramic camera on the Mars Exploration Rover Opportunity shows the target nicknamed \"Hamersley\" within \"Fram Crater.\" The nature of the outcrop material seen in this location is visibly disrupted. Some areas also have layering that may be distinctive from what scientists saw previously in \"Eagle Crater.\" Opportunity is traveling toward a large crater dubbed \"Endurance.\" It may return to Fram for further analysis of its rocks and soils if time permits. The images in this mosaic were taken on sol 87 with the panoramic camera's 480-, 530- and 600-nanometer filters."
              },
              {
                "language":"x-mt-pt",
                "title":"Hamersley ': Não completamente Como ' A Cratera Da Águia '",
                "description":"Este mosaic aproximado da imagem da verdadeiro-cor da câmera panoramic na oportunidade do vagabundo da exploração de Marte mostra o alvo nicknamed \"Hamersley\" dentro de \"da cratera Fram.\" A natureza do material do outcrop visto nestaposição disrupted visivelmente. Algumas áreas têm também mergulhar que pode ser distintivo de o que os cientistas viram previamente da \"na cratera águia.\" A oportunidade está viajando para cratera grande uma \"resistência dubbed.\" Pode retornar a Fram para uma análise mais adicional de seus rochas e solos se licenças do tempo. As imagens neste mosaic foram feitas exame no solenóide 87 com a câmera panoramic 480 -, 530- e filtros 600-nanometer."
              }
            ],
            "rights":{
              "cc":false,
              "url":"http://creativecommons.org/publicdomain/mark/1.0/",
              "by":false,
              "nc":false,
              "nd":false,
              "sa":false
            },
            "expressions":[
              {
                "language":"en",
                "manifestations":[
                  {
                    "player":"landingPage",
                    "urls":[
                      "http://oer.eun.org/VWClc0HbKM4qhR_gIPB5TFHGMCw1"
                    ]
                  }
                ]
              }
            ]
          },
          "para":{
            "commentsInfo":{
              "count":0
            },
            "favouritesInfo":{
              "count":0
            },
            "idsTuple":{
              "expressionID":0,
              "globalLREID":253883,
              "manifestationID":0,
              "socialID":"253883/0/0"
            },
            "opinionsInfo":{
              "downCount":0,
              "upCount":0
            },
            "ratingsInfo":{
              "average":0,
              "count":0,
              "sum":0
            },
            "tagsInfo":{
              "labels":[

              ]
            }
          }
        },
        {
          "meta":{
            "id":253896,
            "provider":"NASAPHOTOJOURNAL",
            "langBlocks":[
              {
                "language":"x-mt-it",
                "title":"Roccie Sedimentarie Di Schiaparelli",
                "description":"Versione no. MOC2-403, il 26 di MGS MOC giugno 2003 alcuni dei risultati di formazione immagine di alta risoluzione più importanti del centro globale di esperimento della macchina fotografica del orbiter del Marte dell'ispettore del Marte (MGS) (MOC)sulle scoperte circa la presenza e la natura del record sedimentario della roccia su Marte. Questo vecchio cratere di effetto del meteor in bacino nordoccidentale di Schiaparelli esibisce una vista spettacolare della roccia fatta uno strato di e sedimentaria. Ilcratere (1.4 miglio) largo 2.3 chilometri può completamente essere riempito una volta di sedimento; il materiale più successivamente è stato corroso alla relativa forma attuale. Ledozzine degli strati di spessore simile e le proprietà fisiche ora sono espresse nelle nozze raggrum-come la pila nel mezzo del cratere. La luce solare che illumina la scena dalla parte di sinistra indica che il cerchio, o la parte superiore di MESA, alla metà del cratere si leva in piedi più superiore agli altri strati scala-fatti un passo. Le proprietà fisiche dell'uniforme e l'assestamento di questi strati potrebbero indicare che originalmente sono state depositate in un lago (è possibile che il cratere era allaparte inferiore di lago molto più grande, di un bacino riempientesi di Schiaparelli); alternativamente, gli strati sono stati depositati sistemandosi dell'atmosfera in un ambiente asciutto. Questa immagine è stata acquistata il 3 giugno 2003 ed è situata vicino a 0.9S, 346.2W."
              },
              {
                "language":"en",
                "title":"Schiaparelli Sedimentary Rocks",
                "description":"MGS MOC Release No. MOC2-403, 26 June 2003 Some of the most important high resolution imaging results of the Mars Global Surveyor (MGS) Mars Orbiter Camera (MOC) experiment center on discoveries about the presence and nature of the sedimentary rock record on Mars. This old meteor impact crater in northwestern Schiaparelli Basin exhibits a spectacular view of layered, sedimentary rock. The 2.3 kilometer (1.4 miles) wide crater may have once been completely filled with sediment; the material was later eroded to its present form. Dozens of layers of similar thickness and physical properties are now expressed in a wedding cake-like stack in the middle of the crater. Sunlight illuminating the scene from the left shows that the circle, or mesa top, at the middle of the crater stands higher than the other stair-stepped layers. The uniform physical properties and bedding of these layers might indicate that they were originally deposited in a lake (it is possible that the crater was at the bottom of a much larger lake, filling Schiaparelli Basin); alternatively, the layers were deposited by settling out of the atmosphere in a dry environment. This picture was acquired on June 3, 2003, and is located near 0.9S, 346.2W."
              },
              {
                "language":"x-mt-pt",
                "title":"Rochas Sedimentary De Schiaparelli",
                "description":"Liberação no. MOC2-403 de MGS MOC, 26 junho 2003alguns dos resultados de alta resolução os mais importantes da imagem latente do centro global da experiência da câmera do orbiter de Marte do surveyor de Marte (MGS) (MOC) em descobertas sobre a presença e a natureza do registro sedimentary da rocha em Marte. Esta cratera velha do impacto do meteoro na bacia do noroeste deSchiaparelli exibe uma vista espectacular da rocha mergulhada, sedimentary. A cratera de 2.3 quilômetros (1.4 milha) de largura pode uma vez completamente ter sido enchida com o sedimento; o material foi corroído mais tarde a seu formulário atual. As dúzias das camadas de espessura similar e as propriedades físicas são expressadas agora em um casamento endureç-como a pilha no meio da cratera. A luz solar que ilumina a cena da esquerda mostra que o círculo, ou o alto do mesa, no meio da cratera estão mais altamente do que as outras camadas escada-pisadas. As propriedades físicas e o fundamento uniformes destas camadas puderam indicar que estiveram depositadas originalmente em um lago (é possível que a cratera estava no fundo de um lago muito maior, de umabacia de enchimento de Schiaparelli); alternativamente, as camadas foram depositadas estabelecindo-se fora da atmosfera em um ambiente seco. Este retrato foi adquirido junho em 3, 2003, e éficado situado perto de 0.9S, 346.2W."
              }
            ],
            "rights":{
              "cc":false,
              "url":"http://creativecommons.org/publicdomain/mark/1.0/",
              "by":false,
              "nc":false,
              "nd":false,
              "sa":false
            },
            "expressions":[
              {
                "language":"en",
                "manifestations":[
                  {
                    "player":"landingPage",
                    "urls":[
                      "http://oer.eun.org/VWClc0HbKMcpgh_gIPB5TLh4hjKH"
                    ]
                  }
                ]
              }
            ]
          },
          "para":{
            "commentsInfo":{
              "count":0
            },
            "favouritesInfo":{
              "count":0
            },
            "idsTuple":{
              "expressionID":0,
              "globalLREID":253896,
              "manifestationID":0,
              "socialID":"253896/0/0"
            },
            "opinionsInfo":{
              "downCount":0,
              "upCount":0
            },
            "ratingsInfo":{
              "average":0,
              "count":0,
              "sum":0
            },
            "tagsInfo":{
              "labels":[

              ]
            }
          }
        },
        {
          "meta":{
            "id":253900,
            "provider":"NASAPHOTOJOURNAL",
            "langBlocks":[
              {
                "language":"x-mt-it",
                "title":"Banda del radar de 28 ottobre 2005, flyby di Titan",
                "description":"Questo programma della luna Titan del Saturno mostra la posizione tracciata con il rilevamento del radar di Cassini usando il relativo modo sintetico di formazione immagine del radar dell'apertura durante 28 ottobre 2005, flyby. La banda del radarè sovrapposta su un'immagine di falso-colore fatta dalle osservazionidal telescopio dello spazio del Hubble della NASA. La posizione del luogo di atterraggio di Huygens è contrassegnata nel colore rossoall'estrema destra. La sovrapposizione fra i dati di Huygens e la volontà di dati del radar dà i nuovi indizii alla natura della superficie vista dalla sonda di Huygens, che ha atterrato su Titan nelmese di gennaio del 2005. Del 28 la banda ottobre è di lunghezza circa 6.150 chilometri (3.821 miglio), estendendosi del nordda 7 gradi fino 18 gradi di latitudine del sud ed ad ovest da 179 gradi fino 320 gradi di longitudine ad ovest. La risoluzione spaziale delle immagini del radar varia da circa 300 tester (980 piedi) per il pixel a circa 1.5 chilometro (0.93 miglia) per il pixel.Quattro passaggi del radar del Cassini hanno rivelato una varietà di caratteristiche geologiche, compreso i crateri di effetto,di depositi vento-saltati, di scanalature e di caratteristiche cryovolcanic. La missione di Cassini-Huygens è un progetto cooperativo della NASA, dell'Ente Spaziale Europeo e dell'agenzia italiana dello spazio. Il laboratorio di propulsione del getto, una divisione della California Institute of Technology A Pasadena, gestisce la missione per la direzione di missione di scienza della NASA, Washington, D.C. The Cassini che il orbiter è stato progettato,sviluppato e montato a JPL. Lo strumento del radar è stato costruito da JPL e l'agenzia italiana dello spazio, funzionante con i membri della squadra dal unito Dichiara e parecchi paesi europei. Per le più informazioni sulla chiamata di missione di Cassini-Huygens"
              },
              {
                "language":"x-mt-de",
                "title":"Radar-Schwade von Okt. 28, 2005, Titan Flyby",
                "description":"Diese Karte von Mond Titan Saturns zeigt den Standort, der mit dem Cassini Radarkartographen mit seinem synthetischen Blendenöffnung Radar-Belichtung Modus während des Okt.28, 2005, Flyby abgebildet wird. Die RadarSchwade wird auf einem Falschfarbe Bild gelegt, das von den Beobachtungen durch Platz-Teleskop Hubble NASAs gebildet wird. Der Standort der Huygens Landungsites wird im Rot auf dem weit rechten gekennzeichnet. Die Deckung zwischen den Huygens Daten und dem Radardatenwillen geben neue Anhaltspunkte zur Natur der Oberfläche, die durch die Huygens Prüfspitze gesehen wird, die auf Titan im Januar 2005 landete. Die Okt. 28 Schwade ist ungefähr 6.150 Kilometer (3.821 Meilen) lang und dehnt sich von 7 Grad Nord auf 18 Grad Südbreite und von 179 Grad West auf 320 Grad Westlänge aus. Die räumliche Zerlegung der Radarbilder reicht von ungefähr 300 Metern (980 Fuß) pro Pixel bis zu ungefähr 1.5 Kilometern (0.93 Meilen) pro Pixel. Cassinis deckten vier Radardurchläufe eine Vielzahl der geologischen Merkmale, einschließlich Auswirkung Krater,der Wind-durchgebrannten Ablagerungen, der Führungen und der cryovolcanic Merkmale auf. Die Cassini-Huygens Mission ist ein kooperatives Projekt der NASAS, der Europäischen Weltraumorganisationund der italienischen Platz-Agentur. Das Strahl Antrieb-Labor, eine Abteilung der California Institutes of Technology in Pasadena, handhat die Mission für Direktorat Mission Wissenschaft der NASAS, Washington, D.C. The Cassini, das Orbiter konzipiert war, sich entwickelt und an JPL zusammengebaut. Das Radarinstrument wurde durch JPL und die italienische Platz-Agentur aufgebaut und arbeitete mit Teambauteilen von den Vereinigten Staaten und von einigen europäischen Ländern. Zu mehr Information über den Cassini-Huygens Mission Besuch"
              },
              {
                "language":"x-mt-fr",
                "title":"Bandage de radar oct. de 28, 2005, flyby de Titan",
                "description":"Cette carte du Titan de la lune de Saturne montre l'emplacement tracé avec le cartographe de radar de Cassini enutilisant son mode synthétique de formation image de radar d'ouverture pendant oct. 28, 2005, flyby. Le bandage de radar est superposé à une image de faux-couleur faite à partir des observations par le télescope de l'espace de Hubble de NASA's. L'emplacement du site d'atterrissage de Huygens est marqué dansle rouge sur loin le droit. La superposition entre les données de Huygens et la volonté de données de radar donnent de nouveaux indices à la nature de la surface vue par la sonde de Huygens, qui a débarqué sur le Titan en janvier 2005. Le bandage oct. de 28 est d'environ 6.150 kilomètres de long (3.821 milles), s'étendant de 7 degrés de du nord à 18 degrés de latitude du sud et de 179 degrés d'occidental à 320 degrés de longitude occidentale. La résolution spatiale des images de radar s'étend d'environ 300 mètres (980 pieds) par Pixel à environ 1.5 kilomètre (0.93 mille) par Pixel. Quatre passages du radar de Cassini ont indiqué une variété de dispositifs géologiques, y compris des cratères d'impact, de dépôts vent-soufflés, de canaux et de dispositifs cryovolcanic. La mission de Cassini-Huygens est un projet coopératif de la NASA, de l'Agence européenne de l'espace et de l'agence italienne de l'espace. Le laboratoire depropulsion de Voyager en jet, une division de la California Institute of Technology À Pasadena, contrôle la mission pour la direction de mission de la Science de la NASA, Washington, D.C. The Cassini que la navette spatiale a été conçue, développé et réuni à JPL. L'instrument de radar a été construit par JPL et l'agence italienne de l'espace, fonctionnant avec des membres d'équipe des Etats-Unis et plusieurs pays européens. Pour plus d'informations sur la visite de mission de Cassini-Huygens"
              },
              {
                "language":"x-mt-es",
                "title":"Andana del radar del de oct. 28 de 2005, flyby delTitán",
                "description":"Esta correspondencia del Titán de la luna de Saturno muestra la localización asociada con el mapper del radar de Cassini usando su modo sintetizado de la proyección de imagen del radar de la abertura durante de oct. el 28 de 2005, flyby. La andana del radar se sobrepone en una imagen del falso-color hecha de observaciones por el telescopio del espacio de Hubble de NASÁs. La localización del sitio del aterrizaje de Huygens está marcada en rojo en el lejos derecho. El traslapo entre los datosde Huygens y la voluntad de los datos del radar da nuevas pistas a la naturaleza de la superficie considerada por la punta de prueba de Huygens, que aterrizó en Titán en enero de 2005. La andanade oct. del 28 tiene cerca de 6.150 kilómetros de largo (3.821 millas), extendiendo a partir de 7 grados de del norte a 18 grados de latitud del sur y de 179 grados de del oeste a 320 grados de longitud del oeste. La resolución espacial de las imágenes del radar seextiende de cerca de 300 contadores (980 pies) por el pixel a cerca de1.5 kilómetros (0.93 milla) por el pixel. Cuatro pasos del radar de Cassini revelaron una variedad de características geológicas, incluyendo los cráteres del impacto, de depósitos viento-soplados, de canales y de características cryovolcanic. La misión de Cassini-Huygens es un proyecto cooperativo de la NASA, de la Agencia Espacial Europea y de la agencia italiana del espacio. El laboratorio de la propulsión del jet, división de la California Institute of Technology En Pasadena, maneja la misión para la dirección de la misión de la ciencia de la NASA, Washington,D.C. The Cassini que el orbiter fue diseñado, convertido y ensambladoen JPL. El instrumento del radar fue construido por JPL y la agencia italiana del espacio, trabajando con los miembros del equipo de los Estados Unidos y de varios países europeos. Para más información sobre la visita de la misión de Cassini-Huygens"
              },
              {
                "language":"en",
                "title":"Radar Swath of Oct. 28, 2005, Titan Flyby",
                "description":"This map of Saturn's moon Titan shows the location mapped with the Cassini radar mapper using its synthetic aperture radar imaging mode during the Oct. 28, 2005, flyby. The radar swath is superimposed on a false-color image made from observations by NASA's Hubble Space Telescope. The location of the Huygens landing site is marked in red on the far right. The overlap between the Huygens data and the radar data will give new clues to the nature of the surface seen by the Huygens probe, which landed on Titan in January 2005. The Oct. 28 swath is about 6,150 kilometers long (3,821 miles), extending from 7 degrees north to 18 degrees south latitude and 179 degrees west to 320 degrees west longitude. The spatial resolution of the radar images ranges from about 300 meters (980 feet) per pixel to about 1.5 kilometers (0.93 miles) per pixel. Cassini's four radar passes revealed a variety of geologic features, including impact craters, wind-blown deposits, channels and cryovolcanic features. The Cassini-Huygens mission is a cooperative project of NASA, the European Space Agency and the Italian Space Agency. The Jet Propulsion Laboratory, a division of the California Institute of Technology in Pasadena, manages the mission for NASA's Science Mission Directorate, Washington, D.C. The Cassini orbiter was designed, developed and assembled at JPL. The radar instrument was built by JPL and the Italian Space Agency, working with team members from the United States and several European countries. For more information about the Cassini-Huygens mission visit"
              },
              {
                "language":"x-mt-pt",
                "title":"Swath do radar outubro de 28, 2005, demostração aérea de Titan",
                "description":"Este mapa da lua Titan de Saturno mostra a posição traçada com o cartógrafo do radar de Cassini usando sua modalidade sintética da imagem latente do radar da abertura durante outubro o 28, 2005, demostração aérea. O swath do radar é sobreposto em uma imagem da falso-cor feita das observações pelo telescópio do espaço de Hubble de NASA. A posição do local da aterragem de Huygens é marcada no vermelho no distante direito. A sobreposição entre os dados de Huygens e a vontade dos dadosdo radar dá indícios novos à natureza da superfície vista pela ponta de prova de Huygens, que aterrou em Titan em janeiro 2005. O swath outubro de 28 tem aproximadamente 6.150 quilômetros de comprimento (3.821 milhas), estendendo de 7 graus norte a 18 graus de latitude sul e de 179 graus ocidental a 320 graus de longitude ocidental. A definição spatial das imagens do radar varia de aproximadamente 300 medidores (980 pés) por o pixel a aproximadamente1.5 quilômetro (0.93 milha) por o pixel. Passagens do radar de Cassini quatro revelaram uma variedade de características geologic, including crateras do impacto, de depósitos vento-fundidos, de canaletas e de características cryovolcanic. A missão de Cassini-Huygens é um projeto cooperativo da NASA, da agência de espaço européia e da agência italiana do espaço. O laboratório da propulsão do jato, uma divisão da California Institute of Technology Em Pasadena, controla a missão para o directorate da missão da ciência da NASA, Washington, C.C.  Cassini que o orbiter foi projetado, tornado e montado em JPL. O instrumento do radar foi construído por JPL e pela agência italiana do espaço, trabalhando com membros da equipe dos estados unidos e de diversos países europeus. Para mais informação sobre a visitada missão de Cassini-Huygens"
              }
            ],
            "rights":{
              "cc":false,
              "url":"http://creativecommons.org/publicdomain/mark/1.0/",
              "by":false,
              "nc":false,
              "nd":false,
              "sa":false
            },
            "expressions":[
              {
                "language":"en",
                "manifestations":[
                  {
                    "player":"landingPage",
                    "urls":[
                      "http://oer.eun.org/VWClc0LSJcMhih_gIPJ5TpiQpQej"
                    ]
                  }
                ]
              }
            ]
          },
          "para":{
            "commentsInfo":{
              "count":0
            },
            "favouritesInfo":{
              "count":0
            },
            "idsTuple":{
              "expressionID":0,
              "globalLREID":253900,
              "manifestationID":0,
              "socialID":"253900/0/0"
            },
            "opinionsInfo":{
              "downCount":0,
              "upCount":0
            },
            "ratingsInfo":{
              "average":0,
              "count":0,
              "sum":0
            },
            "tagsInfo":{
              "labels":[

              ]
            }
          }
        }
      ]
    };
                
		
	return {
    recommendationList  : recommendationList,
    excursionsList    : excursionsList,
    smartcardList     : smartcardList,
    flashcardList     : flashcardList,
		imageList         : imageList,
		imageListLittle   : imageListLittle,
		imageListDummy    : imageListDummy,
		videoList         : videoList,
		videoListLittle   : videoListLittle,
		videoListDummy    : videoListDummy,
		flashList         : flashList,
		flashListLittle   : flashListLittle,
		flashListDummy    : flashListDummy,
		liveList          : liveList,
    liveListLittle    : liveListLittle,
    liveListDummy     : liveListDummy,
		objectList        : objectList,
    objectListLittle  : objectListLittle,
    objectListDummy   : objectListDummy,
		tagsList          : tagsList,
    thumbnailsList    : thumbnailsList,
    LREImageList      : LREImageList
	};

})(VISH);