VISH.EVideo = (function(V,$,undefined){

	//Old
	var state_vid;
	var video; 
	var myvideoId;
	var duracion;
	var balls = []; // Ball array time-ordered
	var nextBall; 
	var prevNextBall; 
	var eback = true;
	var RANGE = 0.300; //seconds around the ball where we should stop




	//Internals
	var evideos;
	// myEvideo = evideos['evideoId'] has:
	// myEvideo.balls = [ball1,ball2,...,ball3];
	// Each ball has id, time and an associated slide id

	var initialized = false;

	var init = function(presentation){
		V.Debugging.log("Module Init");
		if(!initialized){
			initialized = true;
			evideos = new Array();
			_loadEvents();
		}
	};

	var _loadEvents = function(){
		V.Debugging.log("Load Events");

		$(document).on("click", '.evideoPlayButton' , _onClickPlayVideo);
		$(document).on("click", '.evideoTransportbar', _onClickTransportBar);
		$(document).on("click", '.evideoBackButton', _toggle);

		V.EventsNotifier.registerCallback(V.Constant.Event.onFlashcardSlideClosed, function(params){ 
			var subslideId = params.slideNumber;
			V.Debugging.log("Se ha cerrado la slide: " + subslideId);
			_onCloseSubslide(subslideId);
		});
	};


	/* Draw Methods */

	var drawEVideo = function(evideoJSON){
		var evideoId = evideoJSON.id;
		var slidesetDOM = $("#"+evideoId);

		//0. Store videoJSON
		evideos[evideoId] = evideoJSON;

		//1. VIDEO
		var videoBox =  $("<div class='evideoBox'></div>");
		$(slidesetDOM).append(videoBox);

		var videoHeader =  $("<div class='evideoHeader'><div class='evideoTime'><span class='evideoCurTime'>00:00</span>/<span class='duration'>00:00</span></div></div>");
		$(videoBox).append(videoHeader);

		var videoBody =  $("<div class = 'evideoBody'></div>");
		$(videoBox).append(videoBody);

		var footer = $("<div class='evideoFooter'></div>");
		
		var controls = $("<div class='evideoControls'>");
		//Play button
		$(controls).append("<div class='evideoPlayButtonWrapper'><img class='evideoPlayButton' src='images/evideo/play.png'></img></div>");
		//Progress bar
		var progressBarWrapper = $("<div class='evideoProgressBarWrapper'></div>");
		var progressBar = $("<div class='evideoProgressBar'><div class='evideoPosition'></div></div>");
		var videoSegments = $("<div class='segmentDiv'></div><ul class='evideoSegments'></ul>");
		$(progressBarWrapper).append(progressBar);
		$(progressBarWrapper).append(videoSegments);
		$(controls).append(progressBarWrapper);

		$(footer).append(controls);
		$(videoBox).append(footer);

		//2. INDEX
		var indexBox = $("<div class='evideoIndexBox'></div>");
		var indexSide = $("<div class='evideoIndexSide'><div class='evideoBackButton'><img src='images/evideo/evideoArrows.jpg'/></div></div>");
		var indexBody = $("<div class='evideoIndexBody'><ul class='evideoChapters'></ul></div>");
		$(indexBox).append(indexBody);
		$(indexBox).append(indexSide);
		$(slidesetDOM).append(indexBox);
	};

	// var _init = function(video,evideoJSON){
	// 	$(video).on("timeupdate", function(){
	// 		_curTimeUpdate();
	// 		var time = video.currentTime;

	// 		if(typeof nextBall == "object"){
	// 			if(Math.abs(time - nextBall.time) < RANGE){
	// 				if(nextBall.showed == false){
	// 					_popUp(_onCloseSubslide,nextBall);
	// 				}
	// 			}
	// 		}
	// 	});
	// 	_getBalls(evideoJSON);
	// 	_getNextBall(0);
	// 	_paintBalls();
	// 	_paintIndex();
	// };


	/* Load Methods */
	var loadEVideo = function(evideoId){
		_renderVideo(evideoId);
	};

	var _renderVideo = function(evideoId){
		var evideoJSON = evideos[evideoId];
		if((typeof evideoJSON != "object")||(typeof evideoJSON.video != "object")){
			return;
		}

		// V.Debugging.log("loadEVideo " + evideoId);
		// V.Debugging.log(evideoJSON);
		var videoBody = $(V.Slides.getCurrentSlide()).find(".evideoBody");

		switch(evideoJSON.video.type){
			case V.Constant.MEDIA.HTML5_VIDEO:
				var video = $(V.Video.HTML5.renderVideoFromJSON(evideoJSON.video,{controls: false, poster: false}));
				$(video).on("loadeddata", _onVideoLoadedMetadata);
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				var video;
				break;
			default:
				return;
		}

		$(video).css("max-height","100%");
		$(video).css("max-width","100%");
		$(video).addClass("temp_hidden");
		$(videoBody).attr("videoType",evideoJSON.video.type);
		$(videoBody).append(video);
	};


	var _onVideoLoadedMetadata = function(event){
		var video = event.target;
		//Check state (based on http://www.w3schools.com/tags/av_prop_readystate.asp)
		if((video.readyState == 4)||(video.readyState == 3)){
			_onVideoReady(video);
		} else {
			// V.Debugging.log("Video not loaded appropriately");
		}
	};

	var _onVideoReady = function(video){
		$(video).removeClass("temp_hidden");
		V.Utils.fitChildInParent(video);
		
		//Center Vertically
		var videoBody = $(video).parent();
		var videoHeight = $(video).height();
		$(videoBody).height(videoHeight);

		var videoBox = _getCurrentEVideoBox();
		var videoHeader = $(videoBox).find(".evideoHeader");
		var videoFooter = $(videoBox).find(".evideoFooter");
		var totalVideoBoxHeight = $(videoHeader).height() + videoHeight + $(videoFooter).height();
		var freeHeight = $(videoBox).height() - totalVideoBoxHeight;
		$(videoHeader).css("margin-top",freeHeight/2+"px");

		var duration = _secondsTimeSpanToHMS(V.Video.getDuration(video));
		$(videoHeader).find(".duration").html(duration);
		// _init(video,evideoJSON);
	};





	var _toggle = function(){
		var currentSlide = $(V.Slides.getCurrentSlide());
		var indexBox = $(currentSlide).find(".evideoIndexBox");
		var navigation =  $(indexBox).find(".evideoIndexBody");
		var hide_button = $(indexBox).find(".evideoIndexSide");
		var hide_buttonW = $(hide_button).css("width");
		var hide_buttonPR = $(hide_button).css("padding-right");
		var hide_buttonPT = $(hide_button).css("padding-top");
		var videoBox = $(currentSlide).find(".evideoBox");
		var timeDiv = $(videoBox).find(".evideoHeader");

		if(eback == true){
			var animationTime = 1000;
			
			$(currentSlide).find(".segmentDiv").hide();
			$(currentSlide).find(".evideoSegments").hide();
			$(timeDiv).hide();

			$(hide_button).css("width", hide_buttonW);
			$(hide_button).css("padding-right", hide_buttonPR);
			$(hide_button).css("padding-top", hide_buttonPT);
		
			nAnimations = 4;
			$(navigation).animate({width: "0%"}, animationTime, function(){ _checkAnimationFinish(); });
			$(navigation).animate({"padding-right": "0%"},animationTime, function(){ _checkAnimationFinish(); });
			$(indexBox).animate({width: "5%"}, animationTime, function(){ _checkAnimationFinish(); });
			$(videoBox).animate({width: "92%", "margin-top": "8%"}, animationTime, function(){ _checkAnimationFinish(); });

		}else{
			$(currentSlide).find(".segmentDiv").hide();
			$(currentSlide).find(".evideoSegments").hide();
			$(timeDiv).hide();
			nAnimations = 4;
			$(navigation).animate({width: "58%"}, animationTime, function(){ _checkAnimationFinish() });
			$(navigation).animate({"padding-right": "5%"}, animationTime, function(){ _checkAnimationFinish(); });
			$(indexBox).animate({width: "36%"}, animationTime, function(){ _checkAnimationFinish(); });
			$(videoBox).animate({width: "62%", "margin-top": "18%"}, animationTime, function(){ _checkAnimationFinish(); });
		}
	};

	var nAnimationsFinished = 0;
	var nAnimations;

	var _checkAnimationFinish = function(){
		nAnimationsFinished = nAnimationsFinished +1;
		if(nAnimationsFinished===nAnimations){
			_onAnimationsFinish();
			nAnimationsFinished = 0;
		}
	};

	var _onAnimationsFinish = function(){
		if(eback==true){
			_hide();
		} else {
			_show()
		}
	};

	var _onClickPlayVideo = function(evt){
		video= _getCurrentEVideo();
		_togglePlay(video);
	};

	var _togglePlay = function(video){
		video = _getCurrentEVideo();
		if (video.paused == false) {
			video.pause();
				$(V.Slides.getCurrentSlide()).find(".evideoPlayButton").attr("src","images/evideo/play.png");
			} else {
				video.play();
				$(V.Slides.getCurrentSlide()).find(".evideoPlayButton").attr("src","images/evideo/pause.png");
			}
	};

	var _onClickTransportBar = function(evt){

		var video = _getCurrentEVideo();

		var bar_width = $('.evideoProgressBar').outerWidth();
		var offset = $(evt.target).offset();//this ahora es evt.target
		var distanceDifference = evt.pageX - offset.left; //eliminar número mágico
		var percentWidth = ((distanceDifference*100) / bar_width)*0.99;
		video.currentTime = (percentWidth * video.duration) / 100;

		nextBall = null;
		_getNextBall(video.currentTime);
		_resetShowParams();
	};

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
			}else{
			nextBall = undefined;
			}
				return nextBall;
	};

	var _resetShowParams = function(){
		$(balls).each(function(index,ball){
			ball.showed = false;
		});	
	};

	var _popUp = function(callback, ball){
		var video = _getCurrentEVideo();
		if (video.paused == false) {
			state_vid = true;
		}else{
			state_vid = false;
		}
			video.pause();
			var slide_id = ball.slide_id;
			ball.showed = true;

			V.Slides.openSubslide(slide_id,true);
	};

	var _onCloseSubslide = function(subslide_id){
		var video = $('#' + myvideoId)[0];
		var prevNextBall = nextBall;
		_getNextBall(video.currentTime);
		if(nextBall-prevNextBall < RANGE){
			_popUp(_onCloseSubslide,nextBall);		
		}else{
			if(state_vid == true){
				video.play(); // we have to know the previous state of the video
				$(V.Slides.getCurrentSlide()).find(".evideoPlayButton").attr("src","images/evideo/pause.png");
			}else{
				video.pause();
			}
		}
	};

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
	};

	var _paintIndex = function(){
		var video = _getCurrentEVideo();
		for (i = 0; i < balls.length; i++) {
			var item = document.createElement('li');
			item.id = balls[i].id;
			var link = document.createElement('a');
			link.setAttribute('ident', i);
			link.setAttribute('time', balls[i].time);
			link.innerHTML = (i+1) + '.'+ '    ' + balls[i].slide_id;
			$(item).append(link);
			$(V.Slides.getCurrentSlide()).find(".evideoChapters").append(item);
		}

		$(V.Slides.getCurrentSlide()).find(".evideoChapters li a").on("click", function(event){
		video.currentTime = $(event.target).attr("time");
		$(V.Slides.getCurrentSlide()).find(".evideoPlayButton").attr("src","images/evideo/play.png");
		_popUp(_onCloseSubslide,balls[parseInt($(event.target).attr("ident"))]); //migrated to JQuery working
		});
	};

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
	};

	var _paintBalls = function(){
		for (i = 0; i < balls.length; i++) {
			_paintBall(balls[i]);
		}
	};

	var _paintBall = function(ballJSON){
		var video = _getCurrentEVideo();
		var segmentDiv = $(V.Slides.getCurrentSlide()).find(".segmentDiv");
		var ball = document.createElement('li');
		var marker = document.createElement('div');
		var segments = 	$(V.Slides.getCurrentSlide()).find(".evideoSegments");
		var position = $(V.Slides.getCurrentSlide()).find(".evideoTransportbar");
		$(segmentDiv).append(marker);
		$(segments).append(ball);
		marker.className = 'evideoMarker';
		ball.className = 'evideoBall';
		var time = parseFloat(ballJSON.time);
	   	var duration = parseFloat(video.duration);
	   	var bar_width = $(V.Slides.getCurrentSlide()).find(".evideoProgressBar").width();

	   	var perc = bar_width / duration;
	   	ball.style.left = ((Math.round((bar_width*time/video.duration) - 10 ) * 100)/($(segments).width()))  + 0.42 + "%"; //we add 8 to adjust the ball
	   	marker.style.left =((Math.round((bar_width*time/video.duration)) * 100)/($(position).width())) + 0.2 + "%";
	   	ball.onclick = function () {
			video.currentTime = time;
			_popUp(_onCloseSubslide,ballJSON);
		}
	};

	var _eraseBalls = function(){
		$(V.Slides.getCurrentSlide()).find(".segmentDiv").html('');
		$(V.Slides.getCurrentSlide()).find(".evideoSegments").html('');
	};

	var _curTimeUpdate = function(evt) {
		var video = _getCurrentEVideo();
		var bar_width = $(V.Slides.getCurrentSlide()).find(".evideoProgressBar").outerWidth();;
		var tiemp = video.currentTime.toFixed(0);
		var tiemph= _secondsTimeSpanToHMS(tiemp);
		$(V.Slides.getCurrentSlide()).find(".evideoCurTime").html(tiemph);
		
		var percentWidth = (100*video.currentTime)/video.duration;
		$(V.Slides.getCurrentSlide()).find(".evideoPosition").css("width", percentWidth + "%"); //for the html to draw
	};

	var _hide = function() {
		currentSlide = $(V.Slides.getCurrentSlide());
		$(currentSlide).find(".evideoHeader").show();
		$(currentSlide).find(".evideoHeader").css("font-size", '1.6rem');
		$(currentSlide).find(".segmentDiv").show();
		$(currentSlide).find(".evideoSegments").show();
		_eraseBalls();
		_paintBalls();
		$(V.Slides.getCurrentSlide()).find(".evideoBall").css("margin-top", '4%');
		eback = false;
	};

	/*
	 * shows the indexBox in which the ball index is defined
	 *
	*/
	var _show = function(){
		currentSlide = $(V.Slides.getCurrentSlide());
		$(currentSlide).find(".evideoHeader").show();
		$(currentSlide).find(".evideoHeader").css("font-size", '1rem');
		$(currentSlide).find(".evideoHeader").css("margin-bottom", 'auto');
		$(currentSlide).find(".segmentDiv").show();
		$(currentSlide).find(".evideoSegments").show();
		_eraseBalls();
		_paintBalls();
		$(V.Slides.getCurrentSlide()).find(".evideoBall").css("margin-top", '5%');
		eback = true;
	}

	var _secondsTimeSpanToHMS = function(s) {
		var display;
		var h = Math.floor(s/3600); //Get whole hours

		s -= h*3600;
		var m = Math.floor(s/60); //Get remaining minutes
		s -= m*60;

		if(h <1){ // if h'd be > 1, we have space to that.
			display = (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
		}else{
			display =  h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
		}

		return display;
	};

	var _generateWrapper = function(videoId){
			var video_embedded = "http://www.youtube.com/embed/"+videoId;
			current_area=  $(V.Slides.getCurrentSlide()).find(".evideoBody");
			var width_height = V.Utils.dimentionsToDraw($(".evideoBody").width(), $(".evideoBody").height(), 325, 243 );    
			var wrapper = "<iframe src='"+video_embedded+"?wmode=opaque' frameborder='0' style='width:"+width_height.width+ "px; height:"+ width_height.height+ "px;'></iframe>";
			return wrapper;
	};
	 
	var generateWrapperForYoutubeVideoUrl = function (url){
			var videoId = V.Video.Youtube.getYoutubeIdFromURL(url);
			if(videoId!=null){
				return _generateWrapper(videoId);
			} else {
				return "Youtube Video ID can't be founded."
			}
	};


	// Utils

	var _getCurrentEVideo = function(){
		return $(V.Slides.getCurrentSlide()).find("video")[0];
	};

	var _getCurrentEVideoBox = function(){
		return $(V.Slides.getCurrentSlide()).find(".evideoBox");
	};

	return {
		init			: init,
		drawEVideo		: drawEVideo,
		loadEVideo		: loadEVideo
	};

}) (VISH, jQuery);