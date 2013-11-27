VISH.EVideo = (function(V,$,undefined){

	var evideos;
	// myEvideo = evideos['evideoId'] has:
	// myEvideo.balls = [ball1,ball2,...,ball3];
	//Each ball has id, time and ?¿... and a associated slide id


	var init = function(presentation){
		if(!evideos){
			evideos = new Array();
		}
		console.log("evideo init");
	};


	/*  Sync can be true if you want the arrows to be synchronized 
	*   (moving at the same time and at the same position) or false if not
	*/
	var addBall = function(evideoId, ball){
		// if((!poi)||(!poi.x)||(!poi.y)||(poi.x > 100)||(poi.y > 100)){
		// 	//Corrupted poi
		// 	return;
		// }

		// var flashcard_div = $("#"+ fcId);
		// var poiId = V.Utils.getId(fcId + "_poi");
		// var div_to_add = "<div class='fc_poi' id='" + poiId + "' style='position:absolute;left:"+poi.x+"%;top:"+poi.y+"%'></div>";
		// flashcard_div.append(div_to_add);

		// if(typeof flashcards[fcId] === "undefined"){
		// 	flashcards[fcId] = new Object();
		// 	flashcards[fcId].arrows = [];
		// }

		// //Add arrow
		// var arrow = new Object();
		// arrow.id = poiId;
		// if(sync){
		// 	arrow.position = 0;
		// } else {
		// 	var rand_pos = Math.floor(Math.random()*TOTAL_FRAMES+1)*FRAME_WIDTH;  //position in pixels
		// 	arrow.position = rand_pos;
		// }
		// arrow.slide_id = poi.slide_id;
		// arrow.x = poi.x;
		// arrow.y = poi.y;
		
		// flashcards[fcId].arrows.push(arrow);
		// pois[arrow.id] = arrow;

		// //Add event to the arrow
		// $("#" + poiId).click(function(event){
		// 	V.Events.onFlashcardPoiClicked(poiId);
		// });
	};

	var loadEVideo = function(evideoId){
		console.log("Load EVideo");
		console.log(evideoId);
	}

	var drawEVideo = function(evideoJSON){ // here we have to add the html parsed in Javascript
		console.log("draw EVideo");
		console.log(evideoJSON);

		var evideoDOM = $("#"+evideoJSON.id);

		var videoBox =  $("<div class='videoBox'></div>");
		$(evideoDOM).append(videoBox);

		$(videoBox).append($("<div class = 'hide_button2' onClick= 'show()'>x</div>"));

		var videoDiv =  $("<div id = 'videoDiv'></div>");
		$(videoBox).append(videoDiv);
		var myvideoId = V.Utils.getId();

		var videoPlayer = $("<video id= '" + myvideoId + "' poster='videos/webvtt_talk.png' style='width:100%' preload='metadata'></video>")
		$(videoDiv).append(videoPlayer);
		$(videoPlayer).append("<source src='https://dl.dropboxusercontent.com/u/16070658/html5_video_index/videos/webvtt_talk.webm'></source><source src='videos/webvtt_talk.mp4'></source><track class='nav' src='videos/webvtt_talk_navigation.vtt' kind='chapters' srclang='en'></track><track class='cc' src='videos/webvtt_talk_captions.vtt' kind='captions' label='captions' srclang='en' default></track>");

		
		var controls = $("<div class='controls'>");
		$(videoBox).append(controls);

		$(controls).append("<div class='button'><img class='play' src='images/play.png'></img></div>");

		var positionview = $("<div class='positionview'>");
		$(controls).append(positionview);


		var pViewContent = $("<div class='transportbar'><div class='position'></div><div class= 'segmentDiv'></div></div><ul class='segments' title='chapter navigation' aria-describedby='keys'></ul></div><div class='time'><span class='curTime'>00:00</span>/<span class='duration'>00:00</span></div>");
		$(controls).append(pViewContent);
		$(videoBox).append("<div style='display: block; clear: both;'></div>");

		var transcriptBox = $("<div class='transcriptBox'></div>");
		$(videoBox).append(transcriptBox);
		$(transcriptBox).append("<div id = 'hide_button' onClick= 'hide()''>x</div><div id='navigation' style= 'background-color:#FAF9F8; border:2px black solid;'><ul id='chapters'></ul>")
	
		//console.log(evideoDOM);
	}

	return {
		init			: init,
		addBall 		: addBall,
		drawEVideo		: drawEVideo,
		loadEVideo		: loadEVideo
	};

}) (VISH, jQuery);