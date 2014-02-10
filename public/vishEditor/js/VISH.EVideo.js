VISH.EVideo = (function(V,$,undefined){

	//Internal vars
	var eVideos;
	// myEvideo = eVideos['eVideoId'] has:
	// myEvideo.balls = [ball1,ball2,...,ball3];
	// Each ball has id, time and an associated slide id
	// myEvideo.nextBall points to the next ball that can be displayed
	// myEvideo.prevBalls store all the displayed balls
	// myEvideo.displayedBall ball that is currently displayed
	// myEvideo.status stores the status of the eVideo

	var _seeking = false;
	var _displayVol = true;
	var _lastVideoEndedCall;
	var initialized = false;

	//Time range around the ball, in which we will show its associated slide. Currently 300ms
	var RANGE = 0.3;


	/* Init methods */

	var init = function(){
		if(!initialized){
			initialized = true;
			eVideos = new Array();
			_loadEvents();
		}
	};

	var _loadEvents = function(){
		if(V.Status.getDevice().desktop){
			$(document).on("click", '.evideoPlayButtonWrapper', _onClickToggleVideo);
		} else {
			V.EventsNotifier.registerCallback(V.Constant.Event.onSimpleClick, function(params){
				var target = params.event.target;
				if($(target).hasClass("evideoPlayButtonWrapper") || $(target).hasClass("evideoPlayButton")){
					_onClickToggleVideo(params.event);
				};
			});
		}

		$(document).on("click", '.evideoToggleIndex.maximized, .evideoIndexSide.maximized', _minimizeIndex);
		$(document).on("click", '.evideoToggleIndex.minimized, .evideoIndexSide.minimized', _maximizeIndex);
		$(document).on("click", '.evideoChapters li', _onClickChapter);

		V.EventsNotifier.registerCallback(V.Constant.Event.onSubslideClosed, function(params){
			var subslideId = params.slideId;
			var slideset =$($("#" + subslideId).parent());
			if($(slideset).attr("type")==V.Constant.EVIDEO){
				var eVideoId = $(slideset).attr("id");
				_onCloseBall(eVideoId);
			}
		});
	};

	var _prepareJSON = function(eVideoJSON){
		eVideoJSON.balls = [];

		if(eVideoJSON.pois){
			$(eVideoJSON.pois).each(function(index,value){
				eVideoJSON.balls.push(value);
			});
			eVideoJSON.balls = ((eVideoJSON.balls.filter(function(ball){
				return ((typeof ball.etime!= "undefined") && (!isNaN(parseFloat(ball.etime))) && (parseFloat(ball.etime)>0));
			})).map(function(ball){
				ball.etime = parseFloat(ball.etime);
				ball.eVideoId = eVideoJSON.id;
				return ball;
			})).sort(function(A,B){
				return parseFloat(A.etime)>parseFloat(B.etime);
			});
		};

		return eVideoJSON;
	};


	/* Draw Methods */

	var draw = function(eVideoJSON){
		var eVideoId = eVideoJSON.id;
		var slidesetDOM = $("#"+eVideoId);


		//0. Prepare JSON (order balls, etc)
		eVideoJSON = _prepareJSON(eVideoJSON);

		//1. Store videoJSON
		eVideos[eVideoId] = eVideoJSON;

		//2. VIDEO
		var videoBox =  $("<div class='evideoBox'></div>");
		$(slidesetDOM).append(videoBox);

		var videoHeader =  $("<div class='evideoHeader' style='display:none'><div class='evideoTime'><span class='evideoCurTime'>00:00</span><span class='evideoTimeSlash'>/</span><span class='evideoDuration'>00:00</span></div></div>");
		$(videoBox).append(videoHeader);

		var videoBody =  $("<div class = 'evideoBody'></div>");
		$(videoBox).append(videoBody);

		var footer = $("<div class='evideoFooter' style='display:none'></div>");
		
		var controls = $("<div class='evideoControls'>");
		//Play button
		$(controls).append("<div class='evideoControlButtonWrapper evideoPlayButtonWrapper'><img class='evideoControlButton evideoPlayButton' src='"+V.ImagesPath + "customPlayer/eVideoPlay.png'></img></div>");
		//Volume button
		var volButton = $("<div class='evideoControlButtonWrapper evideoVolButtonWrapper'><img class='evideoControlButton evideoVolButton' src='"+V.ImagesPath + "customPlayer/eVideoSound.png'></img></div>");
		$(volButton).append("<div class='evideoVolSliderWrapper'><div class='evideoVolSlider'></div></div>");
		$(controls).append(volButton);
		//Progress bar
		var progressBarWrapper = $("<div class='evideoProgressBarWrapper'></div>");
		var progressBar = $("<div class='evideoProgressBarSliderWrapper'><div class='evideoProgressBarSlider'></div></div>");
		var videoSegments = $("<div class='segmentDiv'></div><ul class='evideoSegments'></ul>");
		$(progressBarWrapper).append(progressBar);
		$(progressBarWrapper).append(videoSegments);
		$(controls).append(progressBarWrapper);

		$(footer).append(controls);
		$(videoBox).append(footer);

		//2.1 Position Slider
		var posSlider = $(controls).find(".evideoProgressBarSlider");
		$(posSlider).slider({
			orientation: "horizontal",
			range: "min",
			min: 0,
			max: 100,
			value: 0,
			step: 0.1,
			slide: function(event, ui){
				//Keep the handler inside the gutter. JQuery UI modification is needed: http://stackoverflow.com/questions/1273428/how-do-i-stop-the-jquery-ui-slider-from-sliding-beyond-the-gutter
			}, start: function(event,ui){
				_seeking = true;
				_displayVol = false;
			}, stop: function(event, ui){
				var video = $(videoBody).children()[0];
				_updateProgressBar(video,ui.value);
				setTimeout(function(){
					_seeking = false;
				},700);
				setTimeout(function(){
					_displayVol = true;
				},100);
			}, create: function(event,ui){
			}
		});

		//2.2 Volume Slider
		var volSlider = $(controls).find(".evideoVolSlider");
		$(volSlider).slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 100,
			value: 100,
			slide: function( event, ui ) {
				var video = $(".evideoBox").has(event.target).find(".evideoBody").children()[0];
				_onVolumeChange(video,ui.value);
			}
		});

		var hoverTimeout;
		$(volButton).hover(function(event){
			if(_displayVol){
				hoverTimeout = setTimeout(function(){
					var sliderWrapper = $(".evideoControls").has(event.target).find(".evideoVolSliderWrapper");
					$(sliderWrapper).show();
				},150);
			}
		}, function(event){
			clearTimeout(hoverTimeout);
			var sliderWrapper = $(".evideoControls").has(event.target).find(".evideoVolSliderWrapper");
			$(sliderWrapper).hide();
		});

		//3. INDEX
		var indexBox = $("<div class='evideoIndexBox'></div>");
		var indexSide = $("<div class='evideoIndexSide maximized'><div class='evideoToggleIndex maximized'></div></div>");
		var indexBody = $("<div class='evideoIndexBody'><ul class='evideoChapters'></ul></div>");
		$(indexBox).append(indexBody);
		$(indexBox).append(indexSide);
		$(slidesetDOM).append(indexBox);

		//4. Render video and wait for video to load
		_renderVideo(eVideoId);
	};

	var _renderVideo = function(eVideoId){
		var eVideoJSON = eVideos[eVideoId];
		if((typeof eVideoJSON != "object")||(typeof eVideoJSON.video != "object")){
			return;
		}

		var videoBody = $("#"+eVideoId).find(".evideoBody");
		$(videoBody).attr("videoType",eVideoJSON.video.type);

		switch(eVideoJSON.video.type){
			case V.Constant.MEDIA.HTML5_VIDEO:
				var video = $(V.Video.HTML5.renderVideoFromJSON(eVideoJSON.video,{controls: false, poster: false}));
				$(video).addClass("temp_hidden");
				$(video).attr("videoType",eVideoJSON.video.type);
				$(video).attr("eVideoId",eVideoJSON.id);
				$(videoBody).append(video);
				V.Video.onVideoReady(video,_onVideoReady);
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				var videoWrapper = $(V.Video.Youtube.renderVideoFromJSON(eVideoJSON.video));
				$(videoBody).attr("source", $(videoWrapper).attr("source"));
				$(videoBody).attr("ytcontainerid", $(videoWrapper).attr("ytcontainerid"));
				V.Video.Youtube.loadYoutubeObject($(videoBody),{controls: false, onReadyCallback: function(event){
					var iframe = event.target.getIframe();
					var video = $("#"+iframe.id);
					$(video).attr("videoType",eVideoJSON.video.type);
					$(video).attr("eVideoId",eVideoJSON.id);
					_onVideoReady(video);
				}});
				break;
			default:
				return;
		};
	};

	var _onVideoReady = function(video){
		//5. When video is ready, fit it, load events and continue to render index and balls
		var videoBody = $(video).parent();
		var videoBox = $(videoBody).parent();
		var videoHeader = $(videoBox).find(".evideoHeader");
		var videoFooter = $(videoBox).find(".evideoFooter");
		var videoType = $(video).attr("videotype");

		var durationDOM = $(videoHeader).find(".evideoDuration");
		var videoDuration = V.Video.getDuration(video);
		var formatedDuration = _fomatTime(videoDuration);
		$(durationDOM).html(formatedDuration);

		var significativeNumbers = formatedDuration.split(":").join("").length;
		$(video).attr("sN",significativeNumbers);

		$(video).removeClass("temp_hidden");

		_fitVideoInVideoBox(videoBox);

		$(videoHeader).show();
		$(videoFooter).show();

		//video events
		V.Video.onTimeUpdate(video,_onTimeUpdate);
		V.Video.onStatusChange(video,_onStatusChange);

		//Init vars
		var eVideoDOM = $(videoBox).parent();
		var eVideoId = $(eVideoDOM).attr("id");

		//Filter corrupted balls
		eVideos[eVideoId].balls = (eVideos[eVideoId].balls.filter(function(ball){
			return ball.etime <= videoDuration;
		}));

		//Fix
		if(videoType==V.Constant.Video.Youtube){
			//YouTube API returns duration applying a Math.round over a float value.
			//Maybe some balls are lower than videoDuration, but they really aren't in a correct value.
			//Apply patch to fix it
			var youtubeDuration = videoDuration-1;
			eVideos[eVideoId].balls = (eVideos[eVideoId].balls.map(function(ball){
				if(ball.etime > youtubeDuration){
					 ball.etime = youtubeDuration;
				}
				return ball;
			}));
		}

		eVideos[eVideoId].prevBalls = [];
		_updateNextBall(video,0);

		//6. Render index
		_renderIndex(eVideoDOM,eVideos[eVideoId]);

		//7. Render balls
		// _renderBalls(eVideoDOM,eVideos[eVideoId]);

		//Fire initial onTimeUpdate event for YouTube videos. (The same as HTML5 videos)
		if(videoType==V.Constant.Video.Youtube){
			_onTimeUpdate(video,0);
		};
		
	};

	var _fitVideoInVideoBox = function(videoBox){
		var video = _getVideoFromVideoBox(videoBox);
		var eVideoBody = $(videoBox).find(".evideoBody");
		$(eVideoBody).css("height","85%");

		$(video).css("max-height","none");
		$(video).css("max-width","none");

		switch($(video).attr("videoType")){
			case V.Constant.MEDIA.HTML5_VIDEO:
				V.Utils.fitChildInParent(video);
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				break;
			default:
				break;
		}
		
		var videoHeight = $(video).height();
		var videoBody = $(video).parent();
		$(videoBody).height(videoHeight);

		var videoHeader = $(videoBox).find(".evideoHeader");
		var videoFooter = $(videoBox).find(".evideoFooter");
		var videoHeight = $(video).height();
		var videoWidth = $(video).width();

		$(videoHeader).addClass("temp_shown");
		$(videoFooter).addClass("temp_shown");
		var totalVideoBoxHeight = $(videoHeader).height() + videoHeight + $(videoFooter).height();
		$(videoHeader).removeClass("temp_shown");
		$(videoFooter).removeClass("temp_shown");

		//Remove margin from videoHeader to get videoBox height appropiattely
		$(videoHeader).css("margin-top","0px");
		var freeHeight = $(videoBox).height() - totalVideoBoxHeight;

		$(videoHeader).css("margin-top",freeHeight/2+"px");
		$(videoHeader).width(videoWidth);
		$(videoFooter).width(videoWidth);

		$(video).css("max-height","100%");
		$(video).css("max-width","100%");
	};

	/* Index */

	var _renderIndex = function(eVideoDOM,eVideoJSON){
		var indexBody = $(eVideoDOM).find(".evideoIndexBox");
		var eVideoChapters = $(indexBody).find(".evideoChapters");

		$(eVideoJSON.balls).each(function(index,ball){
			var item = document.createElement('li');
			$(item).attr("ballid",ball.id);
			$(item).attr("etime",ball.etime);
			if(typeof ball.name != "string"){
				var video = _getVideoFromVideoBox($(eVideoDOM).find(".evideoBox"));
				ball.name = "" + _fomatTime(ball.etime,parseInt($(video).attr("sN")));
			}

			$(item).html("<span class='eVideoIndexEntryNumber'>"+ (index+1) + ". " + "</span><span class='eVideoIndexEntryBody'>" + ball.name + "</span>");
			$(eVideoChapters).append(item);
		});
	};

	/* Events */

	var _onTimeUpdate = function(video,currentTime){
		_updateCurrentTime(video,currentTime);
		
		var nextBall = _getJSONFromVideo(video).nextBall;
		if(typeof nextBall != "undefined"){
			if(Math.abs(currentTime - nextBall.etime) < RANGE){
				_triggerBall(nextBall,video);
			}
		}
	};

	var _onStatusChange = function(video,status){
		if(status===V.Constant.EVideo.Status.Ended){
			_onVideoEnded(video);
		} else {
			_updatePlayButton(video,status);
		}
	};

	

	var _onVideoEnded = function(video){
		//Prevent multiple onVideoEnded calls
		var dN = Date.now();
		if(typeof _lastVideoEndedCall != "undefined"){
			var diff = dN - _lastVideoEndedCall;
			if(diff < 500){
				return;
			}
		}
		_lastVideoEndedCall = Date.now();

		//OnVideoEnded
		_updateCurrentTime(video,V.Video.getDuration(video));

		//Prepare balls for a posible restarting
		_beforeSeek(video,0);
	};

	var _onVolumeChange = function(video,volume){
		V.Video.setVolume(video,volume);
	};


	/* Load methods */

	var onEnterSlideset = function(eVideoDOM){
		var eVideoId = $(eVideoDOM).attr("id");
		var videoDOM = _getVideoFromVideoBox($(eVideoDOM).find(".evideoBox"));
		var eVideoJSON = eVideos[eVideoId];

		switch(eVideoJSON.estatusBeforeLeave){
			case V.Constant.EVideo.Status.Playing:
				V.Video.play(videoDOM);
				break;
			case V.Constant.EVideo.Status.Paused:
			case V.Constant.EVideo.Status.Ended:
			default:
				break;
		};
	};

	var onLeaveSlideset = function(eVideoDOM){
		var eVideoId = $(eVideoDOM).attr("id");
		var videoDOM = _getVideoFromVideoBox($(eVideoDOM).find(".evideoBox"));
		var eVideoJSON = eVideos[eVideoId];
		eVideoJSON.estatusBeforeLeave = V.Video.getStatus(videoDOM);

		switch(eVideoJSON.estatusBeforeLeave){
			case V.Constant.EVideo.Status.Playing:
				V.Video.pause(videoDOM);
				break;
			case V.Constant.EVideo.Status.Paused:
			case V.Constant.EVideo.Status.Ended:
			default:
				break;
		};
	};


	/* Events */

	var _onClickToggleVideo = function(event){
		var videoBox = $(".evideoBox").has(event.target);
		var video = _getVideoFromVideoBox(videoBox);
		_togglePlay(video);
	};

	var _togglePlay = function(video){
		var vStatus = V.Video.getStatus(video);
		if (vStatus == V.Constant.EVideo.Status.Playing){
			V.Video.pause(video);
		} else {
			V.Video.play(video);
		}
	};

	var _updateProgressBar = function(video,value){
		var duration = V.Video.getDuration(video);
		var timeToSeek = duration * value/100;
		_beforeSeek(video,timeToSeek);
		V.Video.seekTo(video,timeToSeek);
	};

	var _onClickChapter = function(event){
		var chapter = event.target;
		if($(event.target).tagName != "LI"){
			chapter = $(event.target).parent();
		}
		var chapterTime = parseFloat($(chapter).attr("etime"));
		var eVideoIndexBox = $(".evideoIndexBox").has(chapter);
		var videoBox = $(eVideoIndexBox).parent().find(".evideoBox");
		var video = _getVideoFromVideoBox(videoBox);
		_onChapterSelected(video,chapterTime);
	};

	var _onChapterSelected = function(video,chapterTime){
		var timeToSeek = chapterTime-(RANGE*0.5);
		var duration = V.Video.getDuration(video);

		if(timeToSeek <= duration){
			_beforeSeek(video,timeToSeek);
			V.Video.seekTo(video,timeToSeek);
			//Force _onTimeUpdate
			_onTimeUpdate(video,timeToSeek);
		}
	};

	var _beforeSeek = function(videoDOM,timeToSeek){
		_resetBallParams(videoDOM);
		_updateNextBall(videoDOM,timeToSeek);
	};


	/* UI methods */

	var _updateCurrentTime = function(video,currentTime){
		var videoBox = _getVideoBoxFromVideo(video);
		var currentTime = (typeof currentTime != "undefined") ? currentTime : V.Video.getCurrentTime(video);

		if(!_seeking){
			//Update progress bar
			var progressBar = $(videoBox).find("div.evideoProgressBarSlider");
			var percentage = (100*currentTime)/V.Video.getDuration(video);
			$(progressBar).slider("value",percentage);
		}

		//Update current time field
		var currentTimeField = $(videoBox).find(".evideoCurTime");
		$(currentTimeField).html(_fomatTime(currentTime,parseInt($(video).attr("sN"))));
	};

	var _updatePlayButton = function(video,vStatus){
		var videoBox = _getVideoBoxFromVideo(video);
		var eVideoPlayButton = $(videoBox).find(".evideoPlayButton");
		if(vStatus == V.Constant.EVideo.Status.Playing){
			$(eVideoPlayButton).attr("src", V.ImagesPath + "customPlayer/eVideoPause.png");
		} else {
			$(eVideoPlayButton).attr("src", V.ImagesPath + "customPlayer/eVideoPlay.png");
		}
	};

	var _minimizeIndex = function(event){
		event.stopPropagation();
		var eVideoIndexBox = $(".evideoIndexBox").has(event.target);
		var indexBody = $(eVideoIndexBox).find(".evideoIndexBody");
		$(eVideoIndexBox).find(".evideoChapters li").hide();

		var animationId = V.Utils.getId("animation");	
		$(eVideoIndexBox).animate({width: "5%"}, 1000, function(){ V.Utils.checkAnimationsFinish(animationId,2,_onFinishMinimizeIndex,eVideoIndexBox)});
		var indexBodyWidth = $(eVideoIndexBox).width()*0.05;
		$(indexBody).animate({width: indexBodyWidth + ""}, 1000, function(){ V.Utils.checkAnimationsFinish(animationId,2,_onFinishMinimizeIndex,eVideoIndexBox)});
	};

	var _onFinishMinimizeIndex = function(eVideoIndexBox){
		var eVideoBox = $(eVideoIndexBox).parent().find(".evideoBox");
		$(eVideoBox).css("width","93%");
		_updateIndexButtonUI(eVideoIndexBox,false);
		_redimensionateVideoAfterIndex(eVideoBox);
	};

	var _maximizeIndex = function(){
		event.stopPropagation();
		var eVideoIndexBox = $(".evideoIndexBox").has(event.target);
		var indexBody = $(eVideoIndexBox).find(".evideoIndexBody");
		var animationId = V.Utils.getId("animation");
		$(eVideoIndexBox).animate({width: "28%"}, 1000, function(){ V.Utils.checkAnimationsFinish(animationId,2,_onFinishMaximizeIndex,eVideoIndexBox)});
		$(indexBody).animate({width: "78%"}, 1000, function(){ V.Utils.checkAnimationsFinish(animationId,2,_onFinishMaximizeIndex,eVideoIndexBox)});
	};

	var _onFinishMaximizeIndex = function(eVideoIndexBox){
		var eVideoBox =  $(eVideoIndexBox).parent().find(".evideoBox");
		$(eVideoBox).css("width","70%");
		$(eVideoIndexBox).find(".evideoChapters li").show();
		_updateIndexButtonUI(eVideoIndexBox,true);
		_redimensionateVideoAfterIndex(eVideoBox);
	};

	var _updateIndexButtonUI = function(eVideoIndexBox,maximized){
		var eVideoIndexSide =  $(eVideoIndexBox).find(".evideoIndexSide");
		var button = $(eVideoIndexSide).find(".evideoToggleIndex");
		if(maximized===true){
			$(eVideoIndexSide).removeClass("minimized").addClass("maximized");
			$(button).removeClass("minimized").addClass("maximized");
		} else {
			$(eVideoIndexSide).removeClass("maximized").addClass("minimized");
			$(button).removeClass("maximized").addClass("minimized");
		}
	};

	var _redimensionateVideoAfterIndex = function(videoBox){
		_fitVideoInVideoBox(videoBox);
	};

	var _fixForWrongProgressBarRendering = function(videoBox){
		var progressBar = $(videoBox).find("div.evideoProgressBarSlider");
		$(progressBar).css("overflow","hidden");
		var progressBarMarker = $(progressBar).find(".ui-slider-handle");
		$(progressBarMarker).css("height","122%");
		$(progressBarMarker).css("margin-top","0%");

		var eVideoVolSlider = $(videoBox).find(".evideoVolSlider");
		$(eVideoVolSlider).css("overflow","hidden");
		var eVideoVolSliderMarker = $(eVideoVolSlider).find(".ui-slider-handle");
		$(eVideoVolSliderMarker).css("width","125%");
		$(eVideoVolSliderMarker).css("left","-20%");
	};

	var afterSetupSize = function(increase,increaseW){
		var eVideosDOM = $("section.slides > article[type='enrichedvideo'");
		$(eVideosDOM).each(function(index,eVideoDOM){
			resizeEVideoAfterSetupSize(eVideoDOM,increase,increaseW);
		});
	};

	var resizeEVideoAfterSetupSize = function(eVideoDOM,increase,increaseW){
		var videoBox = $(eVideoDOM).find(".evideoBox");
		_fitVideoInVideoBox(videoBox);

		//Resize and center index button
		var videoIndexBox = $(eVideoDOM).find(".evideoIndexBox");
		var indexBody = $(videoIndexBox).find(".evideoIndexBody");
		var indexSide = $(videoIndexBox).find(".evideoIndexSide");
		
		var button = $(videoIndexBox).find(".evideoToggleIndex");
		//Resize it
		var buttonDimensions = V.ViewerAdapter.getDimensionsForResizedButton(increase,18,0.75);
		$(button).width(buttonDimensions.width);
		$(button).height(buttonDimensions.height);

		//Center vertically
		$(button).css("top",($(indexSide).height() - $(button).height())/2 + "px");
		//Relocate it horizontally
		var indexSideWidth = $(indexSide).width() - ($(indexBody).width()+$(indexBody).cssNumber("padding-right"));
		$(button).css("left", Math.max(0,(indexSideWidth - $(button).width())/2.5) + "px");
	};



	/* Ball Management */

	var _updateNextBall = function(videoDOM,cTime){
		if(typeof cTime != "number"){
			return;
		}

		var eVideoId = $(videoDOM).attr("evideoid");
		
		if(typeof eVideos[eVideoId].nextBall != "undefined"){
			eVideos[eVideoId].prevBalls.push(eVideos[eVideoId].nextBall);
		}
		
		var nextBall = undefined;
		$(eVideos[eVideoId].balls).each(function(index,ball){
			if((ball.etime > cTime)&&(eVideos[eVideoId].prevBalls.indexOf(ball)==-1)){
				nextBall = ball;
				return false;
			}
		});

		//No more balls on this eVideo
		eVideos[eVideoId].nextBall = nextBall;

		// V.Debugging.log("_updateNextBall");
		// if(nextBall){
		// 	V.Debugging.log(_fomatTime(nextBall.etime));
		// 	V.Debugging.log(nextBall.name);
		// } else {
		// 	V.Debugging.log("There are no next ball");
		// }

	};

	var _triggerBall = function(ball,videoDOM){
		var eVideoJSON = eVideos[ball.eVideoId];
		if(typeof eVideoJSON.displayedBall != "undefined"){
			//Prevent several balls to be displayed at the same time.
			return;
		}

		var currentStatus = V.Video.getStatus(videoDOM);
		if(currentStatus == V.Constant.EVideo.Status.Playing){
			V.Video.pause(videoDOM);
		}
		eVideoJSON.estatusBeforeTriggerBall = currentStatus;
		eVideoJSON.displayedBall = ball;
		eVideos[ball.eVideoId] = eVideoJSON;

		setTimeout(function(){
			var videoBox = _getVideoBoxFromVideo(videoDOM);
			var subslideDOM = $("#"+ball.slide_id);
			if($(subslideDOM).hasClass("show_in_smartcard")){
				$(videoBox).addClass("temp_hidden");
			}	
		},1500);
		V.Slides.openSubslide(ball.slide_id);
	};

	var _onCloseBall = function(eVideoId){
		var eVideoJSON = eVideos[eVideoId];
		var videoBox = $("#"+eVideoId).find(".evideoBox");
		$(videoBox).removeClass("temp_hidden");
		var videoDOM = _getVideoFromVideoBox(videoBox);
		var cTime = V.Video.getCurrentTime(videoDOM);

		_updateNextBall(videoDOM,cTime);
		eVideoJSON.displayedBall = undefined;

		// if(Math.abs(cTime - eVideos[eVideoId].nextBall.etime) < RANGE){
		// 	//TODO: Several balls very close... dont change state and show new ball instead.
		// };

		if(eVideoJSON.estatusBeforeTriggerBall === V.Constant.EVideo.Status.Playing){
			V.Video.play(videoDOM);
		}
	};

	var _resetBallParams = function(videoDOM){
		var eVideoId = $(videoDOM).attr("evideoid");
		eVideos[eVideoId].displayedBall = undefined;
		eVideos[eVideoId].nextBall = undefined;
		eVideos[eVideoId].prevBalls = [];
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
		var position = $(V.Slides.getCurrentSlide()).find(".evideoProgressBar");
		$(segmentDiv).append(marker);
		$(segments).append(ball);
		marker.className = 'evideoMarker';
		ball.className = 'evideoBall';
		var time = parseFloat(ballJSON.etime);
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



	// Utils

	var _getVideoFromVideoBox = function(videoBox){
		return $(videoBox).find(".evideoBody").children()[0];
	};

	var _getVideoBoxFromVideo = function(video){
		return $(".evideoBox").has(video);
	};

	var _getJSONFromVideo = function(video){
		return eVideos[$(video).attr("evideoid")];
	};

	var _fomatTime = function(s,sN){
		sN = (typeof sN == "number" ? sN : -1);

		//Get whole hours
		var h = Math.floor(s/3600);
		s -= h*3600;

		//Get remaining minutes
		var m = Math.floor(s/60); 
		s -= m*60;
		s = Math.round(s);

		return ((h<1 && sN<5) ? '' : h + ":") + ((sN>3) ? '0'+m : m) + ":" + (s < 10 ? '0'+s : s);
	};

	return {
		init				: init,
		draw				: draw,
		onEnterSlideset		: onEnterSlideset,
		onLeaveSlideset		: onLeaveSlideset,
		afterSetupSize		: afterSetupSize
	};

}) (VISH, jQuery);