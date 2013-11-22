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

	var drawEVideo = function(evideoJSON){
		console.log("draw EVideo");
		console.log(evideoJSON);

		var evideoDOM = $("#"+evideoJSON.id);
		console.log(evideoDOM);
	}

	return {
		init			: init,
		addBall 		: addBall,
		drawEVideo		: drawEVideo,
		loadEVideo		: loadEVideo
	};

}) (VISH, jQuery);