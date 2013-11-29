VISH.EVideo = (function(V,$,undefined){

	var evideos;
	var video; 
	var duracion;
	var balls = []; // Ball array time-ordered
	var nextBall; 
	var prevNextBall; 
	var RANGE = 0.300; //seconds around the ball where we should stop
	// myEvideo = evideos['evideoId'] has:
	// myEvideo.balls = [ball1,ball2,...,ball3];
	//Each ball has id, time and ?¿... and a associated slide id


	var initialized = false;

	var init = function(presentation){

		if(!initialized){
			initialized = true;
			_loadEvents();


		}

		if(!evideos){
			evideos = new Array();
		}
		// console.log("evideo init");
	};

	var _loadEvents = function(){
		console.log("_loadEvents");
		$(document).on("click", '.play', _onClickPlayVideo);
		$(document).on("click", '.transportbar', _onClickTransportBar);
		$(document).on("click", '.hide_button', _hide);
		$(document).on("click", '.hide_button2', _show);
				


	}


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
		// console.log("Load EVideo");
		// console.log(evideoId);
	}

	var drawEVideo = function(evideoJSON){ // here we have to add the html parsed in Javascript
		// console.log("draw EVideo");
		// console.log(evideoJSON);

		var evideoDOM = $("#"+evideoJSON.id);


		var videoBox =  $("<div class='videoBox'></div>");
		$(evideoDOM).append(videoBox);

		$(videoBox).append($("<div class = 'hide_button2'>x</div>"));

		var videoDiv =  $("<div class = 'videoDiv'></div>");
		$(videoBox).append(videoDiv);
		var myvideoId = V.Utils.getId();


		var videoPlayer = $("<video id= '" + myvideoId + "' poster='videos/webvtt_talk.png' style='width:100%; 	height: 100% !important;'  preload='metadata'></video>")
		$(videoDiv).append(videoPlayer);
		$(videoPlayer).append("<source src='https://dl.dropboxusercontent.com/u/16070658/html5_video_index/videos/webvtt_talk.webm'></source><source src='videos/webvtt_talk.mp4'></source><track class='nav' src='videos/webvtt_talk_navigation.vtt' kind='chapters' srclang='en'></track><track class='cc' src='videos/webvtt_talk_captions.vtt' kind='captions' label='captions' srclang='en' default></track>");

		
		var controls = $("<div class='controls'>");
		$(videoBox).append(controls);

		$(controls).append("<div class='e_button'><img class='play' src='images/evideo/play.png'></img></div>");

		var positionview = $("<div class='positionview'></div>");
		$(controls).append(positionview);


		var pViewContent = $("<div class='transportbar'><div class='position'></div><div class= 'segmentDiv'></div></div><ul class='segments' title='chapter navigation' aria-describedby='keys'></ul></div>");
		$(controls).append("<div class='time'><span class='curTime'>00:00</span>/<span class='duration'>00:00</span></div>");
		$(positionview).append(pViewContent);
		$(videoBox).append("<div style='display: block; clear: both;'></div>");

		var transcriptBox = $("<div class='transcriptBox'></div>");
		$(evideoDOM).append(transcriptBox);
		$(transcriptBox).append("<div class='hide_button'>x</div><div class='navigation' style= 'background-color:#FAF9F8; border:2px black solid;'><ul class='chapters'></ul>")
	
		video = $('#' + myvideoId)[0];
		// console.log("video");
		// console.log(video);


		//Vars

		// console.log("duracion");
		// console.log(duracion);


		$(video).on("loadeddata", function(){
			if(video.readyState == 4){
				_init(video,evideoJSON);
				var t = _secondsTimeSpanToHMS(video.duration.toFixed(0));
						$('.duration').html(t);
			duracion = video.duration.toFixed(2);
			} else {
				console.log("Video not loaded appropriately");
			}
		});



var _init = function(video,evideoJSON){
	$(video).on("timeupdate", function(){
		_curTimeUpdate();
		var time = video.currentTime;

		if(typeof nextBall == "object"){
			if(Math.abs(time - nextBall.time) < RANGE){
				if(nextBall.showed == false){
					_popUp(_onCloseSubslide,nextBall);
				}
			}
		}
	});
   	_getBalls(evideoJSON);
   	_getNextBall(0);
	_paintBalls();
	_paintIndex();



}
		//console.log(evideoDOM);

}

	var _onClickPlayVideo = function(evt){
		video = _getCurrentEVideo();
		_togglePlay(video);
	}

	var _togglePlay = function(video){

		if (video.paused == false) {
			video.pause();
			$(V.Slides.getCurrentSlide()).find(".play").attr("src","images/evideo/play.png");
		} else {
			video.play();
			$(V.Slides.getCurrentSlide()).find(".play").attr("src","images/evideo/pause.png");
		}
}




	var _onClickTransportBar = function(evt){

		var video = _getCurrentEVideo();
		console.log("SEEK");
		console.log(video);

		//this ahora es evt.target

		var bar_width = $('.positionview').outerWidth();
		//var bar_width = document.getElementById('positionview').offsetWidth; // "!it calculates the size of bar_width dinamically, even when you resize the navigation window.
		// console.log("bar_width: ");
		// console.log(videon);
		var offset = $(evt.target).offset();
		var distanceDifference = evt.pageX - offset.left; //eliminar número mágico
		var percentWidth = ((distanceDifference*100) / bar_width)*0.99;
		video.currentTime = (percentWidth * video.duration) / 100;

		nextBall = null;
		_getNextBall(video.currentTime);
		_resetShowParams();
	}



	var _getNextBall = function(time){
			if(typeof time != "number"){
				return null;
			}

			var myNextball;
			var pTime = video.duration;
			for (i = 0; i < balls.length; i++) {
				var ball = balls[i];
				var ballTime = parseFloat(ball.time);
				if((ballTime < pTime)&&(ballTime > 0)&&(ballTime > time)){
					if(ball != nextBall){
						myNextball = ball;
						break;
					}
				}
			}
			if(myNextball){
				nextBall = myNextball;
			} else {
				nextBall = undefined;
			}
			return nextBall;
	}



	var _resetShowParams = function(){
		$(balls).each(function(index,ball){
			ball.showed = false;
		});	
	}

	var _popUp = function(callback, ball){
	var video = _getCurrentEVideo();
	video.pause();
	var slide = ball.slide_id;
	ball.showed = true;
	var a = confirm(slide);
	if(a){
		if(typeof callback == "function"){
			callback();
		}
		}
	}



var _onCloseSubslide = function(){
	var video = _getCurrentEVideo();
	var prevNextBall = nextBall;
	_getNextBall(video.currentTime);
	if(nextBall-prevNextBall < RANGE){
		_popUp(_onCloseSubslide,nextBall);		
	} else {
		video.play();
	}
}

var _getBalls = function(evideoJSON){
	for (i = 0; i < evideoJSON.pois.length; i++) {
		var ball = {};
		ball.id = evideoJSON.pois[i].id;
		ball.time = parseFloat(evideoJSON.pois[i].time);
		ball.slide_id = evideoJSON.pois[i].slide_id;
		ball.showed = false;
		ball.minTime = ball.time - RANGE;
		ball.maxTime = ball.time + RANGE;
		balls.push(ball);
	}

	balls.sort(function(A,B){
    	return A.time>B.time;
	});
}


var _paintIndex = function(){
	var video = _getCurrentEVideo();
	for (i = 0; i < balls.length; i++) {
		var item = document.createElement('li');
		item.id = balls[i].id;
		var link = document.createElement('a');
		link.setAttribute('ident', i);
		link.setAttribute('time', balls[i].time);
		link.innerHTML = balls[i].id + ': ' + balls[i].slide_id + ' ---> '+  balls[i].time;
		$(item).append(link);
		$(V.Slides.getCurrentSlide()).find(".chapters").append(item);
	}

		$(V.Slides.getCurrentSlide()).find(".chapters li a").on("click", function(event){
		video.currentTime = $(event.target).attr("time");
	    _popUp(_onCloseSubslide,balls[parseInt($(event.target).attr("ident"))]); //migrated to JQuery working
	});
}
var _videoPlayPause = function(evt) {
	var video = _getCurrentEVideo();
	if (evt.keyCode == "32") { // space bar
		_togglePlay(video);
	}
	if (evt.keyCode == "13") { // enter key
		seekChapter(this.getAttribute('data-chapter'));
		// stop event from bubbling
		evt = evt||event; /* get IE event ( not passed ) */
		evt.stopPropagation? evt.stopPropagation() : evt.cancelBubble = true;
	}
}


var _paintBalls = function(){
	for (i = 0; i < balls.length; i++) {
		_paintBall(balls[i]);
	}
}

var _paintBall = function(ballJSON){
	var video = _getCurrentEVideo();
	var segmentDiv = $(V.Slides.getCurrentSlide()).find(".segmentDiv");
	var ball = document.createElement('li');
	var marker = document.createElement('div');
	var segments = 	$(V.Slides.getCurrentSlide()).find(".segments");
	var position = $(V.Slides.getCurrentSlide()).find(".transportbar");
	$(segmentDiv).append(marker);
	$(segments).append(ball);
	marker.className = 'marker';
	ball.className = 'ball';
	var time = parseFloat(ballJSON.time);
   	var duration = parseFloat(video.duration);
   	var bar_width = $(V.Slides.getCurrentSlide()).find(".positionview").width();

   	var perc = bar_width / duration;
   	ball.style.left = ((Math.round((bar_width*time/video.duration) - 10 ) * 100)/($(segments).width()))  + 0.85 + "%"; //we add 8 to adjust the ball
   	marker.style.left =((Math.round((bar_width*time/video.duration)) * 100)/($(position).width())) + 0.2 + "%";
   	ball.onclick = function () {
		video.currentTime = time;
		_popUp(_onCloseSubslide,ballJSON);
	}
}

var _eraseBalls = function(){
	$(V.Slides.getCurrentSlide()).find(".segmentDiv").html('');
	$(V.Slides.getCurrentSlide()).find(".segments").html('');
}

var _curTimeUpdate = function(evt) {
	var video = _getCurrentEVideo();
	var bar_width = $(V.Slides.getCurrentSlide()).find(".positionview").outerWidth();;
	var tiemp = video.currentTime.toFixed(1);
	$(V.Slides.getCurrentSlide()).find(".curTime").html(tiemp);
	
	var percentWidth = (100*video.currentTime)/video.duration;
	// var wid = (Math.round(bar_width*video.currentTime/video.duration) * 100)/($('.transportbar').width()) + "%";
	console.log("percentWidth");
	console.log(percentWidth);
	$(".position").css("width", percentWidth + "%"); //for the html to draw
}

var _hide = function() {
	$(V.Slides.getCurrentSlide()).find(".transcriptBox").hide();
	$(V.Slides.getCurrentSlide()).find(".hide_button2").show();
	$(V.Slides.getCurrentSlide()).find(".videoBox").css("width", '90%');
	$(V.Slides.getCurrentSlide()).find(".videoDiv").css("width", '100%');
	$(V.Slides.getCurrentSlide()).find(".controls").css("width", '100%');
	_eraseBalls();
	_paintBalls();
}

/*
 * shows the transcriptBox in which the ball index is defined
 *
*/

var _show = function(){
	$(V.Slides.getCurrentSlide()).find(".videoBox").css("width", '60%');
	_eraseBalls();
	_paintBalls();
	$(V.Slides.getCurrentSlide()).find(".transcriptBox").show();
	$(V.Slides.getCurrentSlide()).find(".hide_button2").hide();
}

var _secondsTimeSpanToHMS = function(s) {
	var display;
    var h = Math.floor(s/3600); //Get whole hours
   
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;

     if(h <1){
     	display = (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds

     }else{
     	display =  h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
     }
    return display;
}


// Helpers

var _getCurrentEVideo = function(){
	return $(V.Slides.getCurrentSlide()).find("video")[0];
}



	return {
		init			: init,
		addBall 		: addBall,
		drawEVideo		: drawEVideo,
		loadEVideo		: loadEVideo
	};

}) (VISH, jQuery);