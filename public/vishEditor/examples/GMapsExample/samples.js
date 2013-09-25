var samples_vtour = {
	//Basic Metadata
	"id" 			: "1987",
	"title" 		: "Toledo Virtual Tour",
	"description" 	: "Virtual Tour example with ViSH Editor",
	"author" 		: "Aldo",
	"avatar" 		: "/assets/logos/original/excursion-10.png",
	"tags"			: ["Samples","Test","Development","Virtual Tour"],
	//Pedagogical metadata
	"age_range" 	: "4 - 14",
	"subject" 		: "Media Education",
	"educational_objectives" 	: "Amazing educational Virtual Tour",
	"adquired_competencies" 	: "Pupils will be smarter",
	//ViSH Editor data
	"type"			: "VirtualTour",
	"theme"	 		: "theme1",
	"language" 		: "en",
	"slides" : [
		{
			"id" 	: "article5",
			"type"	: "VirtualTour",
			//Virtual Tour metadata
			"map_service"	: "Google Maps",
			"center"		: 
				{
					"lat": 		"41.23",
					"long": 	"-366.3",
				},
			"zoom"			: 5,
			"mapType" 		: "roadmap",
			"width" 		: "100%",
			"height" 		: "100%",
 			"pois": [
 				{	"id"		: "article5_poi1",
 					"lat" 		: "40.24",
 				  	"long" 		: "-3.6",
 				  	"slide_id"	: "article5_article1"
 				},
 				{	"id"		: "article5_poi2",
 				  	"lat" 		: "41.2",
 				  	"long" 		: "2.1",
 				  	"slide_id"	: "article5_article2"
 				},
 				{	"id"		: "article5_poi3",
 				  	"lat" 		: "37.26",
 				  	"long" 		: "-5.97",
 				  	"slide_id"	: "article5_article3"
 				},
 				{	"id"		: "article5_poi4",
 				  	"lat" 		: "43.26",
 				  	"long" 		: "-5.97",
 				  	"slide_id"	: "article5_article4"
 				},
 			],
 			"tours": [
 				{
 					//Tour metadata
 					"id" 	: "article5_tour1",
 					"path"	: [
 						"article5_poi1","article5_poi2","article5_poi3"
 					]
 				}
 			],
			"slides" : [
				{
					"id" 		: "article5_article1",
					"template" 	: "t1",
					"elements" 	: [
					{
						"id" : "article5_article1_zone1",
						"type" : "image",
						"areaid" : "left",
						"body" : "http://blogs.20minutos.es/cronicaverde/files/parque_nacional_donana_lince_iberico.jpg",
						"style" : "position: relative; width:97.82608695652173%; height:80.10752688172043%; top:0%; left:0%;"
					}, {
						"id" : "article5_article1_zone2",
						"type" : "text",
						"areaid" : "header",
						"body" : "<div class=\"vish-parent-font3 vish-parent-font6\" style=\"text-align: center; font-weight: normal; \"><span class=\"vish-font3 vish-fontarial\"><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"><span style=\"font-family: helvetica;\"><span style=\"font-weight: bold;\">Chess</span>: The Art of Learning</span></span><br></span></div>"
					}, {
						"id" : "article5_article1_zone3",
						"type" : "text",
						"areaid" : "subheader",
						"body" : "<div class=\"vish-parent-font3 vish-parent-font4\" style=\"text-align: right; font-weight: normal; \"><span class=\"vish-font3 vish-fontarial\"><span class=\"vish-font4 vish-fontHelvetica\" style=\"undefined;\"><span style=\"font-style: italic; font-family: helvetica;\">by Aldo Gordillo&nbsp; </span></span><br></span></div>"
					}]
				}, 
				{
					'id'       	:'article5_article2',
					'template' 	:'t2',
					'elements'	: [
						{
		                    'id'     : 'article5_article2_zone1',
							'type'   : 'text',
							'areaid' : 'header',
							'body'   : 'Experimento virtual1'
						},
						{
		          			'id'     : 'article5_article2_zone2',
							'type'   : 'object',
							'areaid' : 'left',
							'body'   : '<embed width="99%" height="99%" src="contents/swf/virtualexperiment_1.swf" type="application/x-shockwave-flash"></embed>'
		        		}
		    		]
		    	}, 
		    	{
					"id" : "article5_article3",
					"template" : "t6",
					"elements" : [
						{
							"id" : "article5_article3_zone1",
							"type" : "text",
							"areaid" : "header",
							"body" : "<div class=\"vish-parent-font3 vish-parent-font6 vish-parent-font4\" style=\"font-weight: normal; \"><span class=\"vish-font3 vish-fontHelvetica\" style=\"\"><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"><span style=\"color: rgb(219, 150, 0);\">Iberian</span></span><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"> </span><span class=\"vish-font6 vish-fontHelvetica\" style=\"undefined;\"><span style=\"color: rgb(32, 24, 21);\">Lynx</span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class=\"vish-font4 vish-fontHelvetica\" style=\"undefined;\"><span style=\"color: rgb(113, 113, 117);\">Reproduction</span></span><br></span></div>"
						}, {
							"id" : "article5_article3_zone2",
							"type" : "image",
							"areaid" : "left",
							"body" : "http://i13.photobucket.com/albums/a288/inkslinger0611/drawings/Iberian.jpg",
							"hyperlink" : "http://www.google.es",
							"style" : "position: relative; width:380.95238095238096%; height:218.69565217391303%; top:-36.231884541718856%; left:-58.201090494791664%;"
						}, {
							"id" : "article5_article3_zone4",
							"type" : "image",
							"areaid" : "center",
							"body" : "http://i13.photobucket.com/albums/a288/inkslinger0611/drawings/Iberian.jpg",
							"style" : "position: relative; width:357.14285714285717%; height:205.2173913043478%; top:-45.41062894074813%; left:-193.12174479166666%;"
						}, {
							"id" : "article5_article3_zone5",
							"type" : "text",
							"areaid" : "right",
							"body" : "<div class=\"vish-parent-font2\" style=\"text-align: center; font-weight: normal; \"><span class=\"vish-font2 vish-fontHelvetica\" style=\"\">During the mating season the female leaves her territory in search of a male. The typical gestation period is about two months; the cubs are born between March and September, with a peak of births in March and April. A litter consists of two or three (rarely one, four or five) kittens weighing between 200 and 250 grams (7.1 and 8.8 oz).The kittens become independent at seven to 10 months old, but remain with the mother until around 20 months old. Survival of the young depends heavily on the availability of prey species. In the wild, both males and females reach sexual maturity at one year old, though in practice they rarely breed until a territory becomes vacant; one female was known not to breed until five years old when its mother died.</span></div>"
						}
					]
				},
				{
					"id":"article5_article4",
					"type":"standard",
					"template":"t2",
					"elements":[
						{
							"id":"article5_article4_zone1",
							"type":"object",
							"areaid":"left",
							"body":"<iframe src=\"http://www.youtube.com/embed/VAEp2gT-2a8?wmode=opaque\" frameborder=\"0\" id=\"resizableunicID_7\" class=\"t2_object\" wmode=\"opaque\"></iframe>",
							"style":"position: relative; width:99.9390243902439%; height:99.6774193548387%; top:2.225806451612903%; left:2.3536585365853657%;"
						}
					]
				}
			]
		}
	]
};