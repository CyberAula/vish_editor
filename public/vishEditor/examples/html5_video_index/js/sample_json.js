var vquiz_sample = {
	"VEVersion":"0.7",
	"type":"presentation",
	"title":"Enriched Video Example",
	"description":"First Enriched Video Example",
	"avatar":"http://vishub.org/pictures/311.jpg",
	"tags":["Science","Quiz","Video"],
	"age_range":"12 - 30",
	"subject":["Astronomy"],
	"language":"independent",
	"educational_objectives":"MOOCs",
	"adquired_competencies":"More engaged videos",
	"author":"ViSH Editor Team",
	"slides":[
		{
			"id":"article1",
			"type":"vquiz",
			"sources":"[{ 'type': 'video/webm', 'src': 'https://dl.dropboxusercontent.com/u/16070658/html5_video_index/videos/webvtt_talk.webm'},{ 'type': 'video/mp4', 'src': 'videos/webvtt_talk.mp4'}]",
        	"poster":"videos/webvtt_talk.png",
			"pois":[
                {
                        "id":"article1_poi1",                        
                        "time":"67.3",
                        "slide_id":"article1_article1"
                },{
                        "id":"article1_poi2",
                        "time": "127",
                        "slide_id":"article1_article2"
                },{
                        "id":"article1_poi3",
                        "time": "300",
                        "slide_id":"article1_article3"
                },{
                        "id":"article1_poi4",
                        "time": "1400",
                        "slide_id":"article1_article4"
                }
        	],
			"slides":[
				{
					"id":"article1_article1",
					"type":"standard",
					"template":"t2",
					"elements":[
						{
							"id":"article4_article1_zone1",
							"type":"object",
							"areaid":"left",
							"body":"<iframe src=\"http://www.youtube.com/embed/P4boyXQuUIw?wmode=opaque\" frameborder=\"0\" id=\"resizableunicID3\" class=\"t2_object\" wmode=\"opaque\"></iframe>",
							"style":"position: relative; width:100%; height:98.7%; top:0%; left:0%;"
						}
					]
				},{
					"id":"article1_article2",
					"type":"standard",
					"template":"t7",
					"elements":[
						{
							"id":"article4_article3_zone1",
							"type":"image",
							"areaid":"header",
							"body":"http://vishub.org/pictures/315.jpeg",
							"style":"position: relative; width:101.9%; height:190.4%; top:-69.2%; left:-0.1%;"
						},{
							"id":"article4_article3_zone2",
							"type":"text",
							"areaid":"left",
							"body":"The image shows the Alpha Particle X-Ray Spectrometer (APXS) on NASA's Curiosity rover, with the Martian landscape in the background.<div class=\"vish-parent-font5\" style=\"font-weight: normal; \"><span class=\"vish-font5 vish-fontHelvetica\" style=\"color:undefined;undefined;\"></span></div>"},
						{
							"id":"article4_article3_zone3",
							"type":"image",
							"areaid":"center",
							"body":"http://vishub.org/pictures/316.jpeg",
							"style":"position: relative; width:129.1%; height:110.6%; top:-5.2%; left:-10.9%;"
						},{
							"id":"article4_article3_zone4",
							"type":"text",
							"areaid":"subheader",
							"body":"<div class=\"vish-parent-font4\" style=\"font-weight: normal; \"><span class=\"vish-font4 vish-fontHelvetica\" style=\"color:undefined;undefined;\">Image credit: NASA/JPL-Caltech/MSSS</span><span class=\"vish-font4 vish-fontHelvetica\" style=\"color:undefined;undefined;\"></span></div>"
						}
					]
				},{
					"id":"article1_article3",
					"type":"standard",
					"template":"t10",
					"elements":[
						{
							"id":"article4_article4_zone1",
							"type":"object",
							"areaid":"center",
							"body":"<iframe src=\"http://en.wikipedia.org/wiki/Curiosity_rover?wmode=transparent\" id=\"resizableunicID6\" class=\"t10_object\" wmode=\"opaque\"></iframe>","style":"position: relative; width:100%; height:100%; top:0%; left:0%;"
						}
					]
				},{
					"id":"article1_article4",
					"type":"standard",
					"template":"t10",
					"elements":[
						{
							"id":"article4_article4_zone1",
							"type":"object",
							"areaid":"center",
							"body":"<iframe src=\"http://en.wikipedia.org/wiki/Curiosity_rover?wmode=transparent\" id=\"resizableunicID6\" class=\"t10_object\" wmode=\"opaque\"></iframe>","style":"position: relative; width:100%; height:100%; top:0%; left:0%;"
						}
					]
				}
			]
		}
	]
}