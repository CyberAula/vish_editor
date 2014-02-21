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
	var _blockTimeUpdate = false;
	var _displayVol = true;
	
	var _lastVideoEndedCall;
	var MIN_TIME_BETWEEN_TOGGLE_INDEX = 1600;

	var VOL_INITIAL = 100;
	var _lastVolumeValue = VOL_INITIAL;

	var initialized = false;

	//Time range around the ball, in which we will show its associated slide. Currently 300ms
	var RANGE = 0.3;
	var BOTTOM_RANGE = RANGE/2;
	var TOP_RANGE = RANGE;
	var RANGE_BETWEEN_BALLS = BOTTOM_RANGE + 2*TOP_RANGE;

	var SEEK_WAIT = 700;


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
			$(document).on("click", '.evideoPlayButtonWrapper', onClickToggleVideo);
		} else {
			V.EventsNotifier.registerCallback(V.Constant.Event.onSimpleClick, function(params){
				var target = params.event.target;
				if($(target).hasClass("evideoPlayButtonWrapper") || $(target).hasClass("evideoPlayButton")){
					onClickToggleVideo(params.event);
				};
			});
		}

		$(document).on("click", '.evideoToggleIndex.maximized:not(.disabled), .evideoIndexSide.maximized:not(.disabled)', _minimizeIndex);
		$(document).on("click", '.evideoToggleIndex.minimized:not(.disabled), .evideoIndexSide.minimized:not(.disabled)', _maximizeIndex);
		$(document).on("click", '.evideoChapters li', _onClickChapter);
		$(document).on("click", 'div.ballWrapper div.ballImg', _onClickBall);
		$(document).on("click", 'div.ballWrapper div.ballLine', _onClickBallLine);

		V.EventsNotifier.registerCallback(V.Constant.Event.onSubslideClosed, function(params){
			var subslideId = params.slideId;
			var slideset =$($("#" + subslideId).parent());
			if($(slideset).attr("type")==V.Constant.EVIDEO){
				var eVideoId = $(slideset).attr("id");
				_onCloseBall(eVideoId);
			}
		});
	};

	var loadEventsForControls = function(videoBox){
		//2.1 Position Slider
		var controls = $(videoBox).find(".evideoControls");
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
				var video = getVideoFromVideoBox(videoBox);
				_updateProgressBar(video,ui.value);
				setTimeout(function(){
					_seeking = false;
				},SEEK_WAIT);
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
			value: VOL_INITIAL,
			slide: function( event, ui ) {
				var video = getVideoFromVideoBox($(".evideoBox").has(event.target));
				_onVolumeChange(video,ui.value);
			}
		});

		var hoverTimeout;
		var volButton = $(controls).find(".evideoVolButtonWrapper");
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
	};

	var _prepareJSON = function(eVideoJSON){
		eVideoJSON.balls = [];

		if(eVideoJSON.pois){
			$(eVideoJSON.pois).each(function(index,value){
				eVideoJSON.balls.push(value);
			});
			eVideoJSON.balls = ((eVideoJSON.balls.filter(function(ball){
				return ((typeof ball.etime!= "undefined") && (!isNaN(parseFloat(ball.etime))) && (parseFloat(ball.etime)>=0));
			})).map(function(ball){
				ball.etime = parseFloat(ball.etime);
				ball.eVideoId = eVideoJSON.id;
				return ball;
			})).sort(function(A,B){
				return A.etime>B.etime;
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
		var videoBox = renderVideoBoxDummy();
		$(slidesetDOM).append(videoBox);

		//2.1 Position Slider
		//2.2 Volume Slider
		loadEventsForControls(videoBox);

		//3. INDEX
		var indexBox = renderIndexBoxDummy();
		$(slidesetDOM).append(indexBox);

		//4. Render video and wait for video to load
		_renderVideo(eVideoId);
	};

	var renderVideoBoxDummy = function(){
		var videoBox =  $("<div class='evideoBox'></div>");
		
		var videoHeader =  $("<div class='evideoHeader' style='display:none'><div class='evideoTime'><span class='evideoCurTime'>00:00</span><span class='evideoTimeSlash'>/</span><span class='evideoDuration'>00:00</span></div></div>");
		
		var videoBody =  $("<div class = 'evideoBody'></div>");

		var footer = $("<div class='evideoFooter' style='display:none'></div>");
		var controls = $("<div class='evideoControls'>");
		//Play button
		var playButton = $("<div class='evideoControlButtonWrapper evideoPlayButtonWrapper'><img class='evideoControlButton evideoPlayButton' src='"+V.ImagesPath + "customPlayer/eVideoPlay.png'></img></div>");
		//Volume Button
		var volButton = $("<div class='evideoControlButtonWrapper evideoVolButtonWrapper'><img class='evideoControlButton evideoVolButton' src='"+V.ImagesPath + "customPlayer/eVideoSound.png'></img></div>");
		$(volButton).append("<div class='evideoVolSliderWrapper'><div class='evideoVolSlider'></div></div>");
		//Progress bar
		var progressBarWrapper = $("<div class='evideoProgressBarWrapper'></div>");
		var progressBar = $("<div class='evideoProgressBarSliderWrapper'><div class='evideoProgressBarSlider'></div></div>");
		$(progressBarWrapper).append(progressBar);
		$(controls).append(playButton);
		$(controls).append(volButton);
		$(controls).append(progressBarWrapper);
		$(footer).append(controls);
		
		$(videoBox).append(videoHeader);
		$(videoBox).append(videoBody);
		$(videoBox).append(footer);

		return videoBox;
	};

	var renderIndexBoxDummy = function(){
		var indexBox = $("<div class='evideoIndexBox'></div>");
		var indexSide = $("<div class='evideoIndexSide maximized disabled'><div class='evideoToggleIndex maximized disabled'></div></div>");
		var indexBody = $("<div class='evideoIndexBody'><ul class='evideoChapters'></ul></div>");
		$(indexBox).append(indexBody);
		$(indexBox).append(indexSide);
		return indexBox;
	};

	var _renderVideo = function(eVideoId){
		var eVideoJSON = eVideos[eVideoId];
		if((typeof eVideoJSON != "object")||(typeof eVideoJSON.video != "object")){
			return;
		}

		var videoBody = $("#"+eVideoId).find(".evideoBody");
		$(videoBody).attr("videoType",eVideoJSON.video.type);

		//Start loading
		var loadingContainer = $("<div class='loadingEVideoContainer'></div>");
		$(videoBody).append(loadingContainer);
		$(videoBody).addClass("loadingEVideoContainerWrapper");
		V.Utils.Loader.startLoadingInContainer(loadingContainer);

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
		var eVideoDOM = $(videoBox).parent();
		var eVideoId = $(eVideoDOM).attr("id");
		var videoHeader = $(videoBox).find(".evideoHeader");
		var videoFooter = $(videoBox).find(".evideoFooter");
		var videoType = $(video).attr("videotype");

		//Stop loading
		var loadingContainer = $(videoBody).find(".loadingEVideoContainer");
		$(loadingContainer).remove();
		$(videoBody).removeClass("loadingEVideoContainerWrapper");

		var durationDOM = $(videoHeader).find(".evideoDuration");
		var videoDuration = V.Video.getDuration(video);
		if(videoDuration===0){
			//Some mobile devices can't get the video duration on YouTube videos due to a YouTube Iframe API bug
			//Get duration from JSON
			videoDuration = parseFloat(eVideos[eVideoId].video.duration);
		}
		var formatedDuration = V.Utils.fomatTimeForMPlayer(videoDuration);
		$(durationDOM).html(formatedDuration);

		var significativeNumbers = formatedDuration.split(":").join("").length;
		$(video).attr("sN",significativeNumbers);

		$(video).removeClass("temp_hidden");

		fitVideoInVideoBox(videoBox);

		$(videoHeader).show();
		$(videoFooter).show();

		//video events
		V.Video.onTimeUpdate(video,onTimeUpdate);
		V.Video.onStatusChange(video,onStatusChange);

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
		renderIndex(eVideoDOM,eVideos[eVideoId]);

		//7. Render balls
		_renderBalls(eVideoDOM,eVideos[eVideoId]);

		//8. Link chapters and balls
		_linkChaptersAndBalls(eVideoDOM,eVideos[eVideoId]);

		//Fire initial onTimeUpdate event for YouTube videos. (The same as HTML5 videos)
		if(videoType==V.Constant.Video.Youtube){
			onTimeUpdate(video,0);
		};
	};

	var fitVideoInVideoBox = function(videoBox){
		var video = getVideoFromVideoBox(videoBox);
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

	var renderIndex = function(eVideoDOM,eVideoJSON){
		var indexBody = $(eVideoDOM).find(".evideoIndexBox");
		var eVideoChapters = $(indexBody).find(".evideoChapters");

		$(eVideoJSON.balls).each(function(index,ball){
			var item = document.createElement('li');
			$(item).attr("ballid",ball.id);
			$(item).attr("etime",ball.etime);
			if(typeof ball.name != "string"){
				var video = getVideoFromVideoBox($(eVideoDOM).find(".evideoBox"));
				ball.name = "" + V.Utils.fomatTimeForMPlayer(ball.etime,parseInt($(video).attr("sN")));
			}

			$(item).html("<span class='eVideoIndexEntryNumber'>"+ (index+1) + ". " + "</span><span class='eVideoIndexEntryBody'>" + ball.name + "</span>");
			$(eVideoChapters).append(item);
		});

		var indexSide = $(indexBody).find(".evideoIndexSide");
		var toggleIndexButton = $(indexSide).find(".evideoToggleIndex");
		$(indexSide).removeClass("disabled");
		$(toggleIndexButton).removeClass("disabled");

		//Hover events
		if(!V.Editing){
			$(eVideoChapters).find("li").hover(function(event){
				var representedBallId = $(event.target).attr("representedBallId");
				var target = (typeof representedBallId == "string") ? event.target : $(event.target).parent();
				representedBallId = $(target).attr("representedBallId");
				var ballWrapper = $(eVideoDOM).find(".ballWrapper[ballid='"+representedBallId+"']");
				$(".ballWrapper").removeClass("selected");
				$(ballWrapper).addClass("selected");
			}, function(event){
				var representedBallId = $(event.target).attr("representedBallId");
				var target = (typeof representedBallId == "string") ? event.target : $(event.target).parent();
				representedBallId = $(target).attr("representedBallId");
				var ballWrapper = $(eVideoDOM).find(".ballWrapper[ballid='"+representedBallId+"']");
				$(ballWrapper).removeClass("selected");
			});
		}
	};

	/* Events */

	var onTimeUpdate = function(video,currentTime){
		_updateCurrentTime(video,currentTime);
		
		if(!V.Editing){
			var nextBall = _getJSONFromVideo(video).nextBall;
			if(typeof nextBall != "undefined"){
				var tDiff = currentTime - nextBall.etime;
				if((-BOTTOM_RANGE < tDiff)&&(tDiff< TOP_RANGE)){
				// if(Math.abs(tDiff)<RANGE){
					_triggerBall(nextBall,video);
				}
			}
		}
	};

	var onStatusChange = function(video,status){
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
		_lastVideoEndedCall = dN;

		//OnVideoEnded
		_updateCurrentTime(video,V.Video.getDuration(video));

		//Prepare balls for a posible restarting
		_beforeSeek(video,0);
	};

	var _onVolumeChange = function(video,volume){
		if((volume >= 50)&&(_lastVolumeValue < 50)){
			_updateVolumeImg(video,volume);
		} else if((volume < 50)&&(volume > 0)&&((_lastVolumeValue > 50)||(_lastVolumeValue==0))){
			_updateVolumeImg(video,volume);
		} else {
			_updateVolumeImg(video,volume);
		}
		_lastVolumeValue = volume;

		V.Video.setVolume(video,volume);
	};

	var _updateVolumeImg = function(video,volume){
		var videoBox = getVideoBoxFromVideo(video);
		var volButton = $(videoBox).find(".evideoControlButton.evideoVolButton");
		if(volume >= 50){
			$(volButton).attr("src",V.ImagesPath + "customPlayer/eVideoSound.png");
		} else if((volume < 50)&&(volume > 0)){
			$(volButton).attr("src",V.ImagesPath + "customPlayer/eVideoSoundLow.png");
		} else {
			$(volButton).attr("src",V.ImagesPath + "customPlayer/eVideoSoundMute.png");
		}
	};

	/* Load methods */

	var onEnterSlideset = function(eVideoDOM){
		var eVideoId = $(eVideoDOM).attr("id");
		var videoBox = $(eVideoDOM).find(".evideoBox");
		var videoDOM = getVideoFromVideoBox(videoBox);
		var eVideoJSON = eVideos[eVideoId];

		$(eVideoDOM).removeClass("temp_shown");

		switch(eVideoJSON.estatusBeforeLeave){
			case V.Constant.EVideo.Status.Playing:
				V.Video.play(videoDOM);
				break;
			case V.Constant.EVideo.Status.Paused:
			case V.Constant.EVideo.Status.Ended:
				//Fix hidden handler on HTML5 Videos (due to z-index bug in video tags)
				var videoBody = $(videoBox).find(".evideoBody");
				if($(videoBody).attr("videotype")==V.Constant.Video.HTML5){
					var posSlider = $(videoBox).find(".evideoProgressBarSlider");
					$(posSlider).css("opacity",0.9);
					setTimeout(function(){
						$(posSlider).css("opacity",1);
					},500);
				}
				break;
			default:
				break;
		};
	};

	var onLeaveSlideset = function(eVideoDOM){
		var eVideoId = $(eVideoDOM).attr("id");
		var videoBox = $(eVideoDOM).find(".evideoBox");
		var videoDOM = getVideoFromVideoBox(videoBox);
		var eVideoJSON = eVideos[eVideoId];

		$(eVideoDOM).addClass("temp_shown");

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

	var onClickToggleVideo = function(event){
		var videoBox = $(".evideoBox").has(event.target);
		var video = getVideoFromVideoBox(videoBox);
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
		if(event.target.tagName != "LI"){
			chapter = $(event.target).parent();
		}

		var chapterTime = parseFloat($(chapter).attr("etime"));
		var eVideoIndexBox = $(".evideoIndexBox").has(chapter);
		var videoBox = $(eVideoIndexBox).parent().find(".evideoBox");
		var video = getVideoFromVideoBox(videoBox);

		var options;
		var ballId = $(chapter).attr("ballid");
		var ball = getBallOfEVideo(_getJSONFromVideo(video),ballId);
		if(typeof ball.slide_id != "undefined"){
			//The chapter points to a ball
			options = {
				"nextBallId" : ballId
			};
		}

		_onChapterSelected(video,chapterTime,options);
	};

	var _onClickBall = function(event){
		var ballDOM = event.target;
		var ballTime = parseFloat($(ballDOM).attr("ballTime"));
		var videoBox = $(".evideoBox").has(ballDOM);
		var video = getVideoFromVideoBox(videoBox);
		_onChapterSelected(video,ballTime);
	};

	var _onClickBallLine = function(event){
		var ballLine = event.target;
		var ballTime = parseFloat($(ballLine).attr("ballTime"));
		var videoBox = $(".evideoBox").has(ballLine);
		var video = getVideoFromVideoBox(videoBox);
		_onChapterSelected(video,ballTime);
	};

	var _onChapterSelected = function(video,chapterTime,options){
		var timeToSeek = chapterTime;
		var duration = V.Video.getDuration(video);

		if(timeToSeek <= duration){
			_beforeSeek(video,timeToSeek,options);
			V.Video.seekTo(video,timeToSeek);
			//Force onTimeUpdate
			onTimeUpdate(video,timeToSeek);
			_blockTimeUpdate = true;
			setTimeout(function(){
				_blockTimeUpdate = false;
			},SEEK_WAIT);
		}
	};

	var _beforeSeek = function(videoDOM,timeToSeek,options){
		if(!V.Editing){
			_resetBallParams(videoDOM);
			_updateNextBall(videoDOM,timeToSeek,options);
		}
	};


	/* UI methods */

	var _updateCurrentTime = function(video,currentTime){
		if(_blockTimeUpdate){
			return;
		}

		var videoBox = getVideoBoxFromVideo(video);
		var currentTime = (typeof currentTime != "undefined") ? currentTime : V.Video.getCurrentTime(video);

		if(!_seeking){
			//Update progress bar
			var progressBar = $(videoBox).find("div.evideoProgressBarSlider");
			var percentage = (100*currentTime)/V.Video.getDuration(video);
			$(progressBar).slider("value",percentage);
		}

		//Update current time field
		var currentTimeField = $(videoBox).find(".evideoCurTime");
		$(currentTimeField).html(V.Utils.fomatTimeForMPlayer(currentTime,parseInt($(video).attr("sN"))));
	};

	var _updatePlayButton = function(video,vStatus){
		var videoBox = getVideoBoxFromVideo(video);
		var eVideoPlayButton = $(videoBox).find(".evideoPlayButton");
		if(vStatus == V.Constant.EVideo.Status.Playing){
			$(eVideoPlayButton).attr("src", V.ImagesPath + "customPlayer/eVideoPause.png");
		} else {
			$(eVideoPlayButton).attr("src", V.ImagesPath + "customPlayer/eVideoPlay.png");
		}
	};

	var _minimizeIndex = function(event){
		event.stopPropagation();

		if(V.Utils.delayFunction("toggleIndexCall",function(){_minimizeIndex(event)}, MIN_TIME_BETWEEN_TOGGLE_INDEX)){
			return;
		}

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

	var _maximizeIndex = function(event){
		event.stopPropagation();

		if(V.Utils.delayFunction("toggleIndexCall",function(){_maximizeIndex(event)}, MIN_TIME_BETWEEN_TOGGLE_INDEX)){
			return;
		}

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
		fitVideoInVideoBox(videoBox);
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
		fitVideoInVideoBox(videoBox);

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

		//Balls
		var videoFooter = $(videoBox).find(".evideoFooter");
		$(videoBox).find(".ballWrapper").height($(videoFooter).height());
	};

	var _renderBalls = function(eVideoDOM,eVideoJSON){
		var videoBox = $(eVideoDOM).find(".evideoBox");
		var progressBarWrapper = $(videoBox).find("div.evideoProgressBarWrapper");
		var videoDOM = getVideoFromVideoBox(videoBox);
		var duration = V.Video.getDuration(videoDOM);
		if(duration===0){
			//Patch to fix YouTube Iframe API bug
			var eVideoId = $(eVideoDOM).attr("id");
			duration = parseFloat(eVideos[eVideoId].video.duration);
		}

		_lastLeft = undefined;
		$(eVideoJSON.balls).each(function(value,ball){
			_drawBall(ball,progressBarWrapper,duration);
		});

		var videoFooter = $(videoBox).find(".evideoFooter");
		$(videoBox).find(".ballWrapper").height($(videoFooter).height());

		//Hover events
		$(progressBarWrapper).find(".ballWrapper").hover(function(event){
			var target = ($(event.target).hasClass("ballWrapper")) ? event.target : $(event.target).parent();
			var ballId = $(target).attr("ballId");
			var chapter = $(eVideoDOM).find("ul.evideoChapters li[representedballid='"+ballId+"']");
			$(".ul.evideoChapters li").removeClass("hover");
			$(chapter).addClass("hover");
		}, function(event){
			var target = ($(event.target).hasClass("ballWrapper")) ? event.target : $(event.target).parent();
			var ballId = $(target).attr("ballId");
			var chapter = $(eVideoDOM).find("ul.evideoChapters li[representedballid='"+ballId+"']");
			$(chapter).removeClass("hover");
		});
	};

	var _lastLeft;
	var _lastDrawedBallWrapper;
	var _drawBall = function(ball,progressBarWrapper,duration){
		var left = (ball.etime*100/duration);

		//Group Balls (not simple link timestamps)
		if(typeof ball.slide_id != "undefined"){
			if(typeof _lastLeft != "undefined"){
				if(left - _lastLeft < RANGE_BETWEEN_BALLS){

					//Look for the last drawed ball to represent this ball
					if(typeof _lastDrawedBallWrapper != "undefined"){
						$(_lastDrawedBallWrapper).attr("ballGroup","true");
						var rBalls;
						try {
							rBalls = JSON.parse($(_lastDrawedBallWrapper).attr("rBalls"));
						} catch (e){}
						if(typeof rBalls == "undefined"){
							rBalls = [];
						}
						rBalls.push(ball.id);
						$(_lastDrawedBallWrapper).attr("rBalls",JSON.stringify(rBalls));
					}
					return;
				}
			}
			_lastLeft = left;
		}

		var ballWrapper = $("<div class='ballWrapper' ballid='"+ball.id+"' ballTime='"+ ball.etime +"'><div class='ballLine' ballTime='"+ ball.etime +"'></div></div>");
		if(typeof ball.slide_id != "undefined"){
			$(ballWrapper).attr("slide_id",ball.slide_id);
			$(ballWrapper).append("<div class='ballImg' ballTime='"+ ball.etime +"'></div>");
		}

		$(ballWrapper).css("left",left+"%");
		$(progressBarWrapper).append(ballWrapper);
		_lastDrawedBallWrapper = ballWrapper;
	};

	var _linkChaptersAndBalls = function(eVideoDOM,eVideoJSON){
		var indexBody = $(eVideoDOM).find(".evideoIndexBox");
		var eVideoChapters = $(indexBody).find(".evideoChapters li");

		//Add ball references to chapters
		$(eVideoChapters).each(function(index,li){
			var ballId = $(li).attr("ballId");
			var ballWrapper = $(eVideoDOM).find(".ballWrapper[ballid='"+ballId+"']");
			if(ballWrapper.length == 0){
				//Look for a group ball
				var groupBallsWrapper = $(eVideoDOM).find(".ballWrapper[ballgroup='true']");
				$(groupBallsWrapper).each(function(value,gBall){
					var rBalls;
					try {
						rBalls = JSON.parse($(gBall).attr("rBalls"));
					} catch(e) {}
					if(typeof rBalls == "object"){
						if(rBalls.indexOf(ballId)!=-1){
							ballWrapper = gBall;
							return false;
						}
					}
				});
			}
			var representedBallId = $(ballWrapper).attr("ballid");
			if(typeof representedBallId == "string"){
				$(li).attr("representedBallId",representedBallId);
			}
		});

		//Add chapter references to balls
		//TODO. May be not neccesary.
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
		var lookForNextBallId = ((options)&&(options.nextBallId));
		$(eVideos[eVideoId].balls).each(function(index,ball){
			if(lookForNextBallId){
				if((ball.id === options.nextBallId)&&(typeof ball.slide_id != "undefined")){
					nextBall = ball;
					return false;
				}
			} else {
				if(((typeof ball.slide_id != "undefined"))&&(ball.etime >= cTime)&&(eVideos[eVideoId].prevBalls.indexOf(ball)==-1)){
					nextBall = ball;
					return false;
				}
			}
		});

		//No more balls on this eVideo
		eVideos[eVideoId].nextBall = nextBall;

		// V.Debugging.log("_updateNextBall");
		// if(nextBall){
		// 	V.Debugging.log(V.Utils.fomatTimeForMPlayer(nextBall.etime));
		// 	V.Debugging.log(nextBall.name);
		// } else {
		// 	V.Debugging.log("There are no next ball");
		// }

	};

	var _triggerBall = function(ball,videoDOM){
		if(typeof eVideos[ball.eVideoId].displayedBall != "undefined"){
			//Prevent several balls to be displayed at the same time.
			return;
		}

		var currentStatus = V.Video.getStatus(videoDOM);
		if(currentStatus == V.Constant.EVideo.Status.Playing){
			V.Video.pause(videoDOM);
		}
		eVideos[ball.eVideoId].estatusBeforeTriggerBall = currentStatus;

		_displayBall(ball,videoDOM);
	};

	var _displayBall = function(ball,videoDOM){
		eVideos[ball.eVideoId].displayedBall = ball;
		setTimeout(function(){
			var videoBox = getVideoBoxFromVideo(videoDOM);
			var subslideDOM = $("#"+ball.slide_id);
			if($(subslideDOM).hasClass("show_in_smartcard")){
				$(videoBox).addClass("temp_hidden_soft");
			}
		},1500);
		V.Slides.openSubslide(ball.slide_id);
	};

	var _onCloseBall = function(eVideoId){
		var eVideoJSON = eVideos[eVideoId];
		var videoBox = $("#"+eVideoId).find(".evideoBox");
		$(videoBox).removeClass("temp_hidden_soft");
		var videoDOM = getVideoFromVideoBox(videoBox);
		var cTime = V.Video.getCurrentTime(videoDOM);
		var prevBall = jQuery.extend({}, eVideoJSON.displayedBall); //displayedBall points to the ball we are closing
		_updateNextBall(videoDOM,prevBall.etime);
		eVideoJSON.displayedBall = undefined;

		var nextBall = eVideos[eVideoId].nextBall;
		var showNextBall = false;
		if(nextBall){
			if((nextBall.etime - prevBall.etime) < RANGE_BETWEEN_BALLS){
				showNextBall = true;
			};
		}

		if(showNextBall===true){
			_displayBall(nextBall,videoDOM);
			return;
		};


		var videoStatus = V.Video.getStatus(videoDOM);
		if(eVideoJSON.estatusBeforeTriggerBall === V.Constant.EVideo.Status.Playing){
			if(videoStatus == V.Constant.EVideo.Status.Paused){
				V.Video.play(videoDOM);
			}
		}
		if(videoStatus == V.Constant.EVideo.Status.Ended){
			//Prepare video for a possible restarting
			_beforeSeek(videoDOM,0);
		}
	};

	var _resetBallParams = function(videoDOM){
		var eVideoId = $(videoDOM).attr("evideoid");
		eVideos[eVideoId].displayedBall = undefined;
		eVideos[eVideoId].nextBall = undefined;
		eVideos[eVideoId].prevBalls = [];
	};


	// Utils

	var getVideoFromVideoBox = function(videoBox){
		return $(videoBox).find(".evideoBody").children()[0];
	};

	var getVideoBoxFromVideo = function(video){
		return $(".evideoBox").has(video);
	};

	var _getJSONFromVideo = function(video){
		return eVideos[$(video).attr("evideoid")];
	};

	var getBallOfEVideo = function(eVideoJSON,ballId){
		var bL = eVideoJSON.balls.length;
		for(var i=0; i<bL; i++){
			var ball = eVideoJSON.balls[i];
			if(ball.id==ballId){
				return ball;
			}
		};
		return undefined;
	};

	return {
		init					: init,
		draw					: draw,
		onEnterSlideset			: onEnterSlideset,
		onLeaveSlideset			: onLeaveSlideset,
		renderVideoBoxDummy		: renderVideoBoxDummy,
		renderIndexBoxDummy		: renderIndexBoxDummy,
		fitVideoInVideoBox 		: fitVideoInVideoBox,
		renderIndex 			: renderIndex,
		loadEventsForControls	: loadEventsForControls,
		onClickToggleVideo		: onClickToggleVideo,
		onStatusChange			: onStatusChange,
		onTimeUpdate			: onTimeUpdate,
		getVideoFromVideoBox	: getVideoFromVideoBox,
		getVideoBoxFromVideo 	: getVideoBoxFromVideo,
		getBallOfEVideo			: getBallOfEVideo,
		afterSetupSize			: afterSetupSize
	};

}) (VISH, jQuery);