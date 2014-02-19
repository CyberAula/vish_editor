VISH.Editor.EVideo = (function(V,$,undefined){

	//Internal
	var initialized = false;

	//Store enriched videos data
	var eVideos;
	//Direct access to current balls (balls[ballId] = ball)
	var balls;

	//Links to open video tab and chapters fancybox
	var hiddenLinkToAddVideos;
	var hiddenLinkToAddChapters;

	//Pointer to the current chapter JSON object
	// cChapterJSON: {name: "Name", ballId: "ballId", etime: 0, slideId: "slideId"}
	var _cChapter;

	//Time delta to order balls in the 'same' point
	var TIME_DELTA = 0.0001;

	var init = function(){
		if(!initialized){
			eVideos = {};
			balls = {};
			_loadEvents();
			initialized = true;
		}
	};

	var _loadEvents = function(){
		//Select Video Event
		hiddenLinkToAddVideos = $('<a id="hidden_button_to_change_video" href="#video_fancybox" style="display:none"></a>');
		$(hiddenLinkToAddVideos).fancybox({
			'autoDimensions' : false,
			'width': 800,
			'height': 600,
			'scrolling': 'no',
			'padding' : 0,
			"onStart"  : function(data){
				V.Editor.Video.setAddContentMode(V.Constant.EVIDEO);
				V.Editor.Utils.loadTab('tab_video_youtube');
			},
			"onClosed"  : function(data){
				V.Editor.Video.setAddContentMode(V.Constant.NONE);
			}
		});
		$(document).on("click", 'div.change_evideo_button', function(){
			onChangeVideo();
		});
		$(document.body).append(hiddenLinkToAddVideos);

		hiddenLinkToAddChapters = $('<a href="#chapters_fancybox" style="display:none"></a>');
		$(hiddenLinkToAddChapters).fancybox({
			'autoDimensions' : false,
			'height': 330,
			'width': 400,
			'scrolling': 'no',
			'showCloseButton': false,
			'padding' : 0,
			"onStart"  : function(data){
				var currentVideo = _getCurrentVideo();
				if(currentVideo){

					//Title field
					$("#eVideoChaptersTextArea").val("");

					//Ball field
					$("#eVideoChaptersBall_wrapper").hide();

					//Time field
					var videoDuration = V.Video.getDuration(currentVideo);
					var formatedDuration = V.Utils.fomatTimeForMPlayer(videoDuration);
					var significativeNumbers = parseInt($(V.Slides.getCurrentSlide()).attr("sN"));
					if(videoDuration){
						$("#eVideochapters_duration_value").val(formatedDuration);
						$("#eVideochapters_duration_value").attr("duration",videoDuration);
						$("#eVideochapters_duration_value").attr("sN",significativeNumbers);
						if(videoDuration < 60*60){
							_disableTimeInput($("#eVideochapters_hours"));
						} else {
							_enableTimeInput($("#eVideochapters_hours"));
						}

						if(videoDuration < 60){
							_disableTimeInput($("#eVideochapters_minutes"));
						} else {
							_enableTimeInput($("#eVideochapters_minutes"));
						}

						_enableTimeInput($("#eVideochapters_seconds"));

						_onChapterTimeChange();
					}

					//Load chapter values if we are editing an existing one
					var chapter = _getCurrentChapter();

					if(typeof chapter != "undefined"){

						//Title field
						var titleName = chapter.name;
						if(typeof titleName == "string"){
							$("#eVideoChaptersTextArea").val(titleName);
						}

						//Ball field
						var ball = balls[chapter.ballId];
						if((typeof ball != "undefined")&&(typeof ball.letter == "string")){
							$("#eVideoChaptersBall_wrapper").find("span").html(VISH.I18n.getTrans("i.ItemAndBall", {letter: "<span class='letterInChapterDialog'>"+ball.letter+"</span>"}));
							$("#eVideoChaptersBall_wrapper").show();
						}

						//Time field
						var cTime = chapter.etime;
						if(isNaN(cTime)){
							cTime = 0;
						}
						var durationsPerUnit = VISH.Editor.Utils.iso8601Parser.getDurationPerUnit("PT"+ cTime + "S",true);
						$("#eVideochapters_hours").val(durationsPerUnit[4]);
						$("#eVideochapters_minutes").val(durationsPerUnit[5]);
						$("#eVideochapters_seconds").val(durationsPerUnit[6]);
						_onChapterTimeChange();
					}

				}
			},
			"onComplete" : function(data){
			},
			"onClosed"  : function(data){
				$("ul.evideoChapters li").removeClass("selected");
				_cChapter = undefined;
			}
		});
		$(document).on("click", 'button.evideoAddChapterButton:not(.addSlideButtonDisabled)', function(){
			$("ul.evideoChapters li").removeClass("selected");
			$(hiddenLinkToAddChapters).trigger("click");
		});

		//Play button
		$(document).on("click", '.evideoPlayButtonWrapper', V.EVideo.onClickToggleVideo);

		//Chapter table actions
		$(document).on('click', 'div.eVideoChapterActions i.icon-edit', _onEditChapter);
		$(document).on('click', 'div.eVideoChapterActions i.icon-trash', _onRemoveChapter);
		$(document).on('click', 'div.eVideoChapterActions i.icon-arrow-down', _onDownChapter);
		$(document).on('click', 'div.eVideoChapterActions i.icon-arrow-up', _onUpChapter);
		$(document).on('click', 'div.eVideoChapterInfo', _onClickChapterInfo);

		//Chapters screen events
		$(document).on('keyup', '#eVideochapters_hours, #eVideochapters_minutes, #eVideochapters_seconds', _onChapterTimeChange);
		$(document).on('change', '#eVideochapters_hours, #eVideochapters_minutes, #eVideochapters_seconds', _onChapterTimeChange);

		$(document).on('click', '#eVideoChaptersButtons_wrapper a[buttonaction="Add"]', _onAddChapter);
		$(document).on('click', '#eVideoChaptersButtons_wrapper a[buttonaction="Cancel"]', _onCancelAddChapter);
	};

	var onChangeVideo = function(){
		var eVideoDOM = V.Slides.getCurrentSlide();
		if(!_isVideoCreated(eVideoDOM)){
			_onChangeVideo(eVideoDOM);
		} else {
			var options = {};
			options.width = 600;
			options.height = 135;
			options.notificationIconSrc = getThumbnailURL();
			options.notificationIconClass = "notificationIconDelete";
			options.text = V.I18n.getTrans("i.eVideoChangeNotification");
			var button1 = {};
			button1.text = V.I18n.getTrans("i.no");
			button1.callback = function(){
				$.fancybox.close();
			}
			var button2 = {};
			button2.text = V.I18n.getTrans("i.yes");
			button2.callback = function(){
				_onChangeVideo(eVideoDOM);
			}
			options.buttons = [button1,button2];
			V.Utils.showDialog(options);
		}
	};

	var _onChangeVideo = function(eVideoDOM){
		V.Editor.setCurrentContainer($(eVideoDOM).find(".evideoBody"));
		$(hiddenLinkToAddVideos).trigger("click");
	};

	/*
	 * Rendering functions
	 */

	var getDummy = function(slidesetId,options){
		var videoBox = V.EVideo.renderVideoBoxDummy();
		//Modify videoBox renderized from Viewer
		var eVideoBody = $(videoBox).find(".evideoBody");
		$(eVideoBody).css("margin-top","7.5%");
		$(eVideoBody).html('<div class="change_evideo_button"></div>');
		
		var indexBox = V.EVideo.renderIndexBoxDummy();
		//Modify indexBox renderized from Viewer
		$(indexBox).find(".evideoIndexSide").html("");
		var eVideoIndexBody = $(indexBox).find(".evideoIndexBody");
		var eVideoIndexBodyActions = $("<div class='evideoIndexBodyActions'></div>");
		$(eVideoIndexBodyActions).html('<button type="button" class="btn btn-small slidesScrollbarButton evideoAddChapterButton addSlideButtonDisabled"><i class="icon-plus"></i><span>'+V.I18n.getTrans("i.AddTimestampLink")+'</span></button>');
		$(eVideoIndexBody).prepend(eVideoIndexBodyActions);	

		return "<article class='temp_shown' id='"+slidesetId+"' type='"+V.Constant.EVIDEO+"' slidenumber='"+options.slideNumber+"'><div class='delete_slide'></div><img class='help_in_slide help_in_evideo' src='"+V.ImagesPath+"vicons/helptutorial_circle_blank.png'/>" + V.Utils.getOuterHTML(videoBox) + V.Utils.getOuterHTML(indexBox) + "</article>";
	};

	var _drawEVideo = function(eVideoJSON,eVideoDOM,videoToRender){
		if(!eVideoJSON){
			//Default values
			eVideoJSON = {};
			eVideoJSON.pois = [];
		}

		var eVideoId = $(eVideoDOM).attr("id");

		if(typeof eVideos[eVideoId] == "undefined"){
			eVideos[eVideoId] = eVideoJSON;
			eVideos[eVideoId].id = eVideoId;

			//Create balls array grounded on pois hashes
			eVideos[eVideoId].balls = [];
			$(eVideos[eVideoId].pois).each(function(index,poi){
				eVideos[eVideoId].balls.push(poi);
			});

			eVideos[eVideoId].balls = ((eVideos[eVideoId].balls.filter(function(ball){
				return ((typeof ball.etime!= "undefined") && (!isNaN(parseFloat(ball.etime))) && (parseFloat(ball.etime)>=0));
			})).map(function(ball){
				ball.letter = _getLetterForBall(eVideos[eVideoId],ball);
				ball.etime = parseFloat(ball.etime);
				ball.eVideoId = eVideoId;
				return ball;
			})).sort(function(A,B){
				return A.etime>B.etime;
			});
		}

		_updateBallsArray(eVideoId);

		if(eVideos[eVideoId].drawed === true){
			//Already drawed
			return;
		}

		eVideos[eVideoId].drawed = true;

		if(typeof videoToRender != "undefined"){
			//Clean video from eVideoDOM
			$(eVideoDOM).find(".evideoBody").html("");
		}

		var eVideoObject = (typeof videoToRender != "undefined") ? videoToRender : _getEVideoObjectFromJSON(eVideos[eVideoId]);
		if(typeof eVideoObject != "undefined"){
			_renderVideo(eVideoObject,eVideoDOM);
		}
	};

	var _getLetterForBall = function(eVideoJSON,ball){
		var letter = undefined;
		if(typeof ball.slide_id == "undefined"){
			return letter;
		}

		var slideId = ball.slide_id;
		$(eVideoJSON.slides).each(function(index,slide){
			if(slide.id === slideId){
				letter = String.fromCharCode(64+parseInt(index+1));
				return false;
			}
		});
		return letter;
	};

	var _getEVideoObjectFromJSON = function(eVideoJSON){
		var videoJSON = eVideoJSON.video;
		if(typeof videoJSON == "undefined"){
			return undefined;
		}
		switch(videoJSON.type){
			case V.Constant.Video.HTML5:
				var options = {};
				if(typeof videoJSON.poster == "string"){
					options.poster = videoJSON.poster;
				}
				var videoTag = V.Video.HTML5.renderVideoFromSources(V.Video.HTML5.getSourcesFromJSON(videoJSON),options);
				return videoTag;
			case V.Constant.Video.Youtube:
				return videoJSON.source;
			default:
				return undefined;
		}
	};

	/*
	 * Callback from the V.Editor.Video module to add the video
	 */
	var onVideoSelected = function(contentToAdd,eVideoDOM){
		if(!eVideoDOM){
			eVideoDOM = V.Slides.getCurrentSlide();
		}

		if($(eVideoDOM).attr("type")===V.Constant.EVIDEO){
			if(_isVideoCreated(eVideoDOM)){
				//Clean previous EVideo
				var eVideoId = $(eVideoDOM).attr("id");
				_removeAllBalls(eVideoDOM);
				delete eVideos[eVideoId];
				// _updateBallsArray(eVideoId);
				_drawEVideo(undefined,eVideoDOM,contentToAdd);
			} else {
				_renderVideo(contentToAdd,eVideoDOM);
			}	
		}

		$.fancybox.close();
	};

	var _renderVideo = function(videoObj,eVideoDOM){
		//Clean dummy properties...
		$(eVideoDOM).find("div.change_evideo_button").remove();
		$(eVideoDOM).find("div.evideoBody").css("margin-top","0px");

		var videoBody = $(eVideoDOM).find(".evideoBody");

		//Start loading
		var loadingContainer = $("<div class='loadingEVideoContainer'></div>");
		$(videoBody).append(loadingContainer);
		$(videoBody).addClass("loadingEVideoContainerWrapper");
		V.Utils.Loader.startLoadingInContainer(loadingContainer);

		//Render video
		var videoBody = $(eVideoDOM).find(".evideoBody");
		var eVideoId = $(eVideoDOM).attr("id");
		var objectInfo = V.Object.getObjectInfo(videoObj);
		switch(objectInfo.type){
			case V.Constant.MEDIA.HTML5_VIDEO:
				var sources = (typeof objectInfo.source == "object") ? objectInfo.source : [{src: objectInfo.source}];
				var options = {};
				options.controls = false;
				// if(typeof $(videoObj).attr("poster") == "string"){
				// 	options.poster = $(videoObj).attr("poster");
				// } else {
				// 	options.poster = false;
				// }
				options.poster = false;
				var video = $(V.Video.HTML5.renderVideoFromSources(sources,options));
				$(video).attr("videoType",V.Constant.MEDIA.HTML5_VIDEO);
				$(video).attr("eVideoId",eVideoId);
				$(videoBody).append(video);
				V.Video.onVideoReady(video,_onVideoReady);
				break;
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				var source = objectInfo.source;
				var videoWrapper = $(V.Video.Youtube.renderVideoFromSource(source));
				$(videoBody).attr("source", $(videoWrapper).attr("source"));
				$(videoBody).attr("ytcontainerid", $(videoWrapper).attr("ytcontainerid"));
				V.Video.Youtube.loadYoutubeObject($(videoBody),{controls: false, onReadyCallback: function(event){
					var iframe = event.target.getIframe();
					var video = $("#"+iframe.id);
					$(video).attr("videoType",V.Constant.MEDIA.YOUTUBE_VIDEO);
					$(video).attr("eVideoId",eVideoId);
					_onVideoReady(video);
				}});
				break;
			default:
				return;
		};
	};

	var _onVideoReady = function(video){
		var videoBody = $(video).parent();
		var videoBox = $(videoBody).parent();
		var eVideoDOM = $(videoBox).parent();
		var eVideoId = $(eVideoDOM).attr("id");
		var videoHeader = $(videoBox).find(".evideoHeader");
		var videoFooter = $(videoBox).find(".evideoFooter");
		var videoType = $(video).attr("videotype");

		//Stop loading
		var loadingContainer = $(videoBody).find(".loadingEVideoContainer");
		// V.Utils.Loader.stopLoadingInContainer(loadingContainer);
		$(loadingContainer).remove();
		$(videoBody).removeClass("loadingEVideoContainerWrapper");
		
		//Start rendering
		$(eVideoDOM).addClass("temp_shown_b");

		var durationDOM = $(videoHeader).find(".evideoDuration");
		var videoDuration = V.Video.getDuration(video);
		var formatedDuration = V.Utils.fomatTimeForMPlayer(videoDuration);
		$(durationDOM).html(formatedDuration);

		var significativeNumbers = formatedDuration.split(":").join("").length;
		$(video).attr("sN",significativeNumbers);
		$(eVideoDOM).attr("sN",significativeNumbers);

		V.EVideo.fitVideoInVideoBox(videoBox);

		$(videoHeader).show();
		$(videoFooter).show();

		//Filter corrupted balls
		eVideos[eVideoId].balls = (eVideos[eVideoId].balls.filter(function(ball){
			return ball.etime <= videoDuration;
		}));
		_updateBallsArray(eVideoId);

		//Enable chapters
		$(eVideoDOM).find(".evideoAddChapterButton").removeClass("addSlideButtonDisabled");
		
		//Events
		V.EVideo.loadEventsForControls(videoBox);
		V.Video.onTimeUpdate(video,V.EVideo.onTimeUpdate);
		V.Video.onStatusChange(video,V.EVideo.onStatusChange);

		_renderIndex(eVideoDOM,eVideos[eVideoId]);
		_renderBalls(eVideoDOM,eVideos[eVideoId]);

		//Fire initial onTimeUpdate event for YouTube videos. (The same as HTML5 videos)
		if(videoType==V.Constant.Video.Youtube){
			V.EVideo.onTimeUpdate(video,0);
		};

		$(eVideoDOM).removeClass("temp_shown_b");
	};

	var _renderIndex = function(eVideoDOM,eVideoJSON){
		//Clean before render
		var indexBody = $(eVideoDOM).find(".evideoIndexBox");
		var eVideoChapters = $(indexBody).find(".evideoChapters");
		$(eVideoChapters).html("");

		V.EVideo.renderIndex(eVideoDOM,eVideoJSON);

		//Add remove and edit buttons
		var chapterList = $(eVideoDOM).find(".evideoChapters li");
		$(chapterList).each(function(value,li){
			var infoDiv = $("<div class='eVideoChapterInfo'></div>");
			$(infoDiv).html($(li).html());
			var actionDiv = $("<div class='eVideoChapterActions'></div>");
			var editButton = $('<p title="edit"><i class="icon-button icon-edit"></i></p>');
			var removeButton = $('<p class="icon-trash-container" title="remove"><i class="icon-button icon-trash"></i></p>');
			$(actionDiv).prepend(removeButton);
			$(actionDiv).prepend(editButton);

			//Arrows
			var prevChapter = chapterList[value-1];
			var nextChapter = chapterList[value+1];
			var arrowUp = (typeof prevChapter != "undefined")&&(Math.round($(prevChapter).attr("etime"))==Math.round($(li).attr("etime")));
			var arrowDown = (typeof nextChapter != "undefined")&&(Math.round($(nextChapter).attr("etime"))==Math.round($(li).attr("etime")));
			var arrows = ((arrowUp)||(arrowDown));

			if(arrows){
				var arrows = $('<p class="icon-arrows-container"></p>');
				if(arrowUp){
					$(arrows).append('<i title="move up" class="icon-button icon-arrow-up"></i>');
				}
				if(arrowDown){
					$(arrows).append('<i title="move down" class="icon-button icon-arrow-down"></i>');
				}
				$(actionDiv).append(arrows);
			}

			$(li).html("");
			$(li).append(infoDiv);
			$(li).append(actionDiv);

			//Add ball Letter, time and id to lis.
			var ballId = $(li).attr("ballid");
			$(li).attr("id",ballId);
			var ballLetter = balls[ballId].letter;
			$(li).find(".eVideoIndexEntryNumber").html((value+1) + " [" + V.Utils.fomatTimeForMPlayer(balls[ballId].etime,parseInt($(eVideoDOM).attr("sN"))) + "]" + ((typeof ballLetter == "string") ? " (" + ballLetter + ") " : "") + ". ");
		
			//Adjust li height
			if(arrows){
				$(li).find("div.eVideoChapterInfo").css("min-height","60px");
			}
		});

	};


	// Ball rendering

	var _updateBalls = function(eVideoDOM){
		var eVideoId = $(eVideoDOM).attr("id");
		_reOrderBalls(eVideoDOM,eVideos[eVideoId]);
		_renderBalls(eVideoDOM,eVideos[eVideoId]);
	};

	var _reOrderBalls = function(eVideoDOM,eVideoJSON){
		eVideos[eVideoJSON.id].balls.sort(function(A,B){
			return A.etime>B.etime;
		}).map(function(ball){
			ball.letter = _getLetterForBall(eVideos[eVideoJSON.id],ball);
			return ball;
		});

		_renderIndex(eVideoDOM,eVideos[eVideoJSON.id]);
	};

	var _renderBalls = function(eVideoDOM,eVideoJSON){
		var videoBox = $(eVideoDOM).find(".evideoBox");
		var videoDOM = V.EVideo.getVideoFromVideoBox(videoBox);
		var duration = V.Video.getDuration(videoDOM);

		$(eVideoJSON.balls).each(function(index,ball){
			if(ball.drawed != true) {
				_drawBall(eVideoDOM,eVideoJSON,ball,duration);
			} else {
				_updateBall(eVideoDOM,eVideoJSON,ball,duration);
			}
		});

		var videoFooter = $(videoBox).find(".evideoFooter");
		$(videoBox).find(".ballSlider .ui-slider-handle").height($(videoFooter).height());
	};

	var _drawBall = function(eVideoDOM,eVideoJSON,ball,duration){
		if(ball.etime > duration){
			return;
		}

		var left = (ball.etime*100/duration);

		var videoBox = $(eVideoDOM).find(".evideoBox");
		var eVideoControls = $(videoBox).find("div.evideoControls");
		var ballSliderWrapper = $("<div ballid='"+ ball.id +"' class='ballSliderWrapper'><div class='ballSlider'></div></div>");
		$(eVideoControls).find(".evideoProgressBarSliderWrapper").append(ballSliderWrapper);

		var ballSlider = $(ballSliderWrapper).find(".ballSlider");
		$(ballSlider).slider({
			orientation: "horizontal",
			range: "min",
			min: 0,
			max: 100,
			value: left,
			step: 0.1,
			slide: function(event,ui){
				var ballTimeSpan = $(event.target).find("span.ballTimeSpan");
				var newTime = (parseFloat($(ballTimeSpan).attr("videoduration")) * ui.value)/100;
				$(ballTimeSpan).html(V.Utils.fomatTimeForMPlayer(newTime));
			}, change: function(event,ui){
				var ballTimeSpan = $(event.target).find("span.ballTimeSpan");
				var newTime = (parseFloat($(ballTimeSpan).attr("videoduration")) * ui.value)/100;
				$(ballTimeSpan).html(V.Utils.fomatTimeForMPlayer(newTime));
			}, start: function(event,ui){
				var ballId = $(event.target).find("span.ballTimeSpan").attr("ballid");
				var selectedChapter = $(eVideoDOM).find("ul.evideoChapters").find("li[ballid='"+ballId+"']");
				$(selectedChapter).addClass("active");
				_bringBallToFront(balls[ballId]);
			}, stop: function(event,ui){
				var ballTimeSpan = $(event.target).find("span.ballTimeSpan");
				var newTime = (parseFloat($(ballTimeSpan).attr("videoduration")) * ui.value)/100;
				var ballId = $(ballTimeSpan).attr("ballid");
				var ball = balls[ballId];
				ball.etime = newTime;

				var selectedChapter = $(eVideoDOM).find("ul.evideoChapters").find("li[ballid='"+ballId+"']");
				$(selectedChapter).removeClass("active");

				_reOrderBalls(eVideoDOM,eVideos[ball.eVideoId]);
			}, create: function(event,ui){

				var ballWrapper = $("<div class='ballWrapper' layer='1' ballid='"+ ball.id +"'><div class='ballLine'></div></div>");

				if(typeof ball.slide_id != "undefined"){
					var ballImg = $("<div class='ballImg' ballTime='"+ ball.etime +"'><span class='ballLetterSpan'>"+ ball.letter +"</span></div>");
					$(ballWrapper).append(ballImg);
					$(ballWrapper).attr("slide_id",ball.slide_id);
				}
		
				var ballTimeSpan = $("<span class='ballTimeSpan' eVideoId='"+ ball.eVideoId +"' ballid='"+ ball.id +"' balltime='"+ ball.etime +"' videoDuration='"+ duration +"'>" + V.Utils.fomatTimeForMPlayer(ball.etime) + "</span>");
				$(ballWrapper).append(ballTimeSpan);

				var handler = $(ballSlider).find(".ui-slider-handle");
				$(handler).append(ballWrapper);
			}
		});

		ball.drawed = true;
		balls[ball.id].drawed = true;
	};

	var _updateBall = function(eVideoDOM,eVideoJSON,ball,duration){
		var left = Math.min(100,(ball.etime*100/duration));
		var ballSliderWrapper = $(eVideoDOM).find(".ballSliderWrapper[ballid='"+ball.id+"']");
		var ballSlider = $(ballSliderWrapper).find(".ballSlider");
		var sliderValue = $(ballSlider).slider("value");
		if(Math.abs(left - sliderValue) > 0.05){
			//If the difference is less than step/2, nothing will change
			$(ballSlider).slider("value",left);
		}

		//Update letter
		if(typeof ball.slide_id != "undefined"){
			var ballLetterSpan = $(ballSliderWrapper).find("span.ballLetterSpan");
			$(ballLetterSpan).html(ball.letter);
		}
	};

	//////////////
	// Balls (i.e. Chapters) Management
	//////////////

	var _onAddChapter = function(){
		var chaptersFancy = $("#chapters_fancybox");
		var title = $(chaptersFancy).find("#eVideoChaptersTextArea").val();
		var time = _getEditableChapterTime();

		//Title  validation
		if((typeof title != "string")||(title.trim()=="")){
			title = V.I18n.getTrans("i.Untitled");
		}

		//Time validation
		var video = _getCurrentVideo();
		var duration = V.Video.getDuration(video);
		time = Math.max(0,Math.min(duration,time));

		var eVideoDOM = V.Slides.getCurrentSlide();
		var eVideoId = $(eVideoDOM).attr("id");

		var chapter = _getCurrentChapter();
		var _isEditingExistingChapter = ((typeof _getCurrentDOMChapter() != "undefined")&&(typeof chapter != "undefined"));
		if(_isEditingExistingChapter){
			//Edit existing chapter
			var ballId = chapter.ballId;
			balls[ballId].name = title;
			if(Math.round(time)!=Math.round(balls[ballId].etime)){
				balls[ballId].etime = time;
			}
			_updateBalls(eVideoDOM);
		} else {
			//Add new chapter (always without a slide associated)
			var ball = {};
			ball.id = V.Utils.getId(eVideoId + "_poi");
			ball.eVideoId = eVideoId;
			ball.name = title;
			ball.etime = time;
			if((typeof chapter != "undefined")&&(typeof chapter.slideId != "undefined")){
				ball.slide_id = chapter.slideId;
			}
			_addBall(ball);
			//addBall will call updateBalls after add it
		}

		_cChapter = undefined;
		$.fancybox.close();
	};

	var _onCancelAddChapter = function(){
		var chapter = _getCurrentChapter();
		if((typeof chapter != "undefined")&&(typeof chapter.slideId != "undefined")){
			_drawPois(V.Slides.getCurrentSlide());
		}
		_cChapter = undefined;
		$.fancybox.close();
	};

	var _onEditChapter = function(event){
		var chapter = $("ul.evideoChapters li").has(event.target);

		//Mark chapter has selected
		$("ul.evideoChapters li").removeClass("selected");
		$(chapter).addClass("selected");

		//Open chapter edit screen
		_updateCChapterFromDOM();
		$(hiddenLinkToAddChapters).trigger("click");
	};

	var _onRemoveChapter = function(event){
		var chapter = $("ul.evideoChapters li").has(event.target);

		var options = {};
		options.width = 375;
		options.height = 135;
		options.notificationIconSrc = V.ImagesPath + "customPlayer/eVideoMarker.png";
		options.notificationIconClass = "notificationIconDeleteTimestampLink";
		options.text = V.I18n.getTrans("i.areyousureNotification");
		var button1 = {};
		button1.text = V.I18n.getTrans("i.no");
		button1.callback = function(){
			$.fancybox.close();
		}
		var button2 = {};
		button2.text = V.I18n.getTrans("i.delete");
		button2.callback = function(){
			_removeChapter(chapter);
			$.fancybox.close();
		}
		options.buttons = [button1,button2];
		V.Utils.showDialog(options);
	};

	var _removeChapter = function(chapter){
		var ball = balls[$(chapter).attr("id")];
		if(typeof ball == "object"){
			_removeBall(ball);
		}		
	};

	var _onDownChapter = function(event){
		var chapter = $("ul.evideoChapters li").has(event.target);
		_exchangeChapters(chapter,$(chapter).next());
	};

	var _onUpChapter = function(event){
		var chapter = $("ul.evideoChapters li").has(event.target);
		_exchangeChapters(chapter,$(chapter).prev());
	};

	var _exchangeChapters = function(chapterA,chapterB){
		var ballA = balls[$(chapterA).attr("id")];
		var ballB = balls[$(chapterB).attr("id")];

		var timeBallA = ballA.etime;
		var timeBallB = ballB.etime;

		if(Math.round(timeBallA)!=Math.round(timeBallB)){
			return;
		}

		var eVideoId = ballA.eVideoId;
		var eVideoDOM = $("#" + eVideoId);

		var timeOrigin;
		var lastChangedTime;

		var chapterAisBefore = ($(chapterA).attr("id") === $(chapterB).prev().attr("id"));
		if(chapterAisBefore){
			timeOrigin = timeBallA;
			timeBallA = timeBallB + TIME_DELTA;
			lastChangedTime = timeBallA;
		} else {
			timeOrigin = timeBallB;
			timeBallB = timeBallA + TIME_DELTA;
			lastChangedTime = timeBallB;
		}

		eVideos[eVideoId].balls.map(function(ball){
			if(ball.id === ballA.id){
				ball.etime = timeBallA;
				return true;
			}
			if(ball.id === ballB.id){
				ball.etime = timeBallB;
				return true;
			}

			if((ball.etime > timeOrigin)&&(ball.etime < lastChangedTime)){
				ball.etime = lastChangedTime + TIME_DELTA;
				lastChangedTime = ball.etime;
			};
		});

		_updateBallsArray(eVideoId);
		_updateBalls(eVideoDOM);
	};

	var _onClickChapterInfo = function(event){
		//Bring ball to front (and all the other ones to the back)
		var chapter = $("ul.evideoChapters li").has(event.target);
		var ballId = $(chapter).attr("ballid");
		_bringBallToFront(balls[ballId]);
	};

	var _bringBallToFront = function(ball){
		if(typeof ball == "undefined"){
			return;
		}
		var eVideoDOM = $("#" + ball.eVideoId);
		var ballSliderWrapper = $(eVideoDOM).find("div.ballSliderWrapper[ballid='"+ball.id+"']");

		if(ballSliderWrapper.length > 0){
			$(eVideoDOM).find("div.ballSliderWrapper").attr("layer",2);
			$(ballSliderWrapper).attr("layer",1);
			_updateBallLayers(eVideoDOM);
		}
	};

	var _updateBallLayers = function(eVideoDOM){
		$(eVideoDOM).find("div.ballSliderWrapper").each(function(value,ballSliderWrapper){
			$(ballSliderWrapper).css("z-index",11 - parseInt($(ballSliderWrapper).attr("layer")));
		});
	};

	_addBallToCurrentTime = function(slideId){
		var eVideoDOM = V.Slides.getCurrentSlide();
		var eVideoId = $(eVideoDOM).attr("id");

		if(_isVideoCreated(eVideoDOM)){
			var cVideo = _getCurrentVideo();
			var cTime = Math.max(0,Math.min(Math.round(V.Video.getCurrentTime(cVideo)),V.Video.getDuration(cVideo)));
		}

		// Add the ball directly, without fancybox		
		// var ball = {};
		// ball.id = V.Utils.getId(eVideoId + "_poi");
		// ball.name = V.I18n.getTrans("i.Untitled");
		// ball.etime = (typeof cTime == "number") ? cTime : 0;
		// ball.slide_id = slideId;
		// ball.eVideoId = eVideoId;
		// _addBall(ball);

		// Use fancybox to add the ball
		// cChapterJSON: {ballId: "ballId", name: "Name", etime: 0, slideId: "slideId"}
		_cChapter = {};
		_cChapter.name = "";
		_cChapter.etime = (typeof cTime == "number") ? cTime : 0;
		_cChapter.slideId = slideId;

		$("ul.evideoChapters li").removeClass("selected");
		$(hiddenLinkToAddChapters).trigger("click");
	};

	var _addBall = function(ball){
		var eVideoDOM = $("#"+ball.eVideoId);
		eVideos[ball.eVideoId].balls.push(ball);
		balls[ball.id] = ball;
		_updateBalls(eVideoDOM);
	};

	var _removeBall = function(ball){
		var eVideoId = ball.eVideoId;
		var eVideoDOM = $("#"+eVideoId);
		
		//Remove ball from DOM
		var ballWrapper = $(eVideoDOM).find(".ballWrapper[ballid='"+ball.id+"']");
		if(ballWrapper.length === 1){
			$(ballWrapper).remove();
		};
		var chapter = $("#"+ball.id);
		$(chapter).remove();

		//Remove ball from JSON
		$(eVideos[eVideoId].balls).each(function(index,eball){
			if(ball.id===eball.id){
				eVideos[eVideoId].balls.splice(index,1);
				return false;
			}
		});
		delete balls[ball.id];

		_updateBalls(eVideoDOM);

		if(typeof ball.slide_id != "undefined"){
			_drawPois(eVideoDOM);
		}
	};

	var _removeAllBalls = function(eVideoDOM){
		var eVideoId = $(eVideoDOM).attr("id");

		//Remove balls from DOM
		var ballWrappers = $(eVideoDOM).find(".ballWrapper[ballid]");
		$(ballWrappers).each(function(index,ballWrapper){
			var chapter = $("#"+$(ballWrapper).attr("ballid"));
			$(chapter).remove();
		});
		$(ballWrappers).remove();

		//Remove balls from JSON
		$(eVideos[eVideoId].balls).each(function(index,eball){
			delete balls[eball.id];
		});
		eVideos[eVideoId].balls = [];

		_drawPois(eVideoDOM);
	};

	var _getCurrentChapter = function(updateFromDOM){
		return _cChapter;
	};

	var _getCurrentDOMChapter = function(){
		return $(V.Slides.getCurrentSlide()).find(".evideoChapters li.selected")[0];
	};

	var _updateCChapterFromDOM = function(){	
		var cDOMChapter = _getCurrentDOMChapter();
		if(typeof cDOMChapter != "undefined"){
			_cChapter = {};
			_cChapter.name = $(cDOMChapter).find(".eVideoIndexEntryBody").html();
			_cChapter.ballId = $(cDOMChapter).attr("ballid");
			try {
				_cChapter.etime = Math.round(parseFloat($(cDOMChapter).attr("etime")));
			} catch(e){}
		}
	};

	// Chapter form functionalities

	var _disableTimeInput = function(input){
		$(input).val(0);
		$(input).attr("readonly","readonly");
		$(input).parent().find(".tlt_input_title").addClass("tlt_input_title_disabled");
	};

	var _enableTimeInput = function(input){
		$(input).val(0);
		$(input).removeAttr("readonly");
		$(input).parent().find(".tlt_input_title").removeClass("tlt_input_title_disabled");
	};

	var _onChapterTimeChange = function(event){
		if((event)&&(event.keyCode===13)){
			$(event.target).blur();
			return;
		}

		var cTime = _getEditableChapterTime();
		if(typeof cTime == "number"){
			cTime = Math.max(0,Math.min(cTime,parseFloat($("#eVideochapters_duration_value").attr("duration"))));
			var sN = $("#eVideochapters_duration_value").attr("sN");
			$("#eVideochapters_current_value").val(V.Utils.fomatTimeForMPlayer(cTime,sN));
		} else {
			// $("#eVideochapters_current_value").val(V.I18n.getTrans("i.invalidvalue"));
			$("#eVideochapters_current_value").val("");
		}
	};

	var _getEditableChapterTime = function(){
		var hours = $("#eVideochapters_hours").val();
		var minutes = $("#eVideochapters_minutes").val();
		var seconds = $("#eVideochapters_seconds").val();

		if(jQuery.isNumeric(hours)&&jQuery.isNumeric(minutes)&&jQuery.isNumeric(seconds)){
			hours = parseInt(hours);
			minutes = parseInt(minutes);
			seconds = parseInt(seconds);
			return ((hours*60+minutes)*60+seconds);
		}

		return undefined;
	};


	////////////////
	// Slideset Callbacks
	////////////////

	/*
	 * Complete the eVideo scaffold to draw the slideset in the presentation
	 */
	var draw = function(slidesetJSON,scaffoldDOM){
		_drawEVideo(slidesetJSON,scaffoldDOM);
	};

	var onEnterSlideset = function(eVideoDOM){
	};

	var onLeaveSlideset = function(eVideoDOM){
	};

	var loadSlideset = function(eVideoDOM){
		$(eVideoDOM).removeClass("temp_shown");

		//Show Arrows
		$("#subslides_list").find("div.draggable_sc_div[ddend='scrollbar']").show();
	};

	var unloadSlideset = function(eVideoDOM){
		$(eVideoDOM).addClass("temp_shown");
	};

	var beforeCreateSlidesetThumbnails = function(eVideoDOM){
		_drawPois(eVideoDOM);
	};

	var beforeRemoveSlideset = function(eVideoDOM){
		var eVideoId = $(eVideoDOM).attr("id");
		if(typeof eVideos[eVideoId] !== "undefined"){
			delete eVideos[eVideoId];
			_updateBallsArray(eVideoId);
		}
	};

	var beforeRemoveSubslide = function(eVideoDOM,subslide){
		var subslideId = $(subslide).attr("id");
		var eVideoJSON = _getCurrentEVideoJSON();

		//Remove slide from JSON
		$(eVideoJSON.slides).each(function(index,slide){
			if(slide.id == subslideId){
				eVideos[eVideoJSON.id].slides.splice(index,1);
				return false;
			}
		});

		//Remove the timestamp links (if exist)
		$(eVideoJSON.balls).each(function(index,ball){
			if(ball.slide_id === subslideId){
				_removeBall(ball);
				return false;
			}
		});
		_updateBalls($(subslide).parent());
	};

	var afterCreateSubslide = function(eVideoDOM,subslide){
		var subslideId = $(subslide).attr("id");
		var eVideoJSON = _getCurrentEVideoJSON();

		//Add slide to JSON
		if(typeof eVideos[eVideoJSON.id].slides == "undefined"){
			eVideos[eVideoJSON.id].slides = [];
		}
		eVideos[eVideoJSON.id].slides.push({id: subslideId});
	};

	var _existPoiForSlideId = function(eVideoJSON,slideId){
		if((typeof eVideoJSON == "undefined")||(typeof slideId == "udnefined")){
			return false;
		}
		var _existPoiForSlideId = false;
		$(eVideoJSON.balls).each(function(index,ball){
			if(ball.slide_id===slideId){
				_existPoiForSlideId = true;
				return false;
			}
		});
		return _existPoiForSlideId;
	};

	/*
	 * Redraw the pois of the slideset
	 * This actions must be called after thumbnails have been rewritten
	 */
	var _drawPois = function(eVideoDOM){
		var slidesetDOM = eVideoDOM;
		var eVideoJSON = _getCurrentEVideoJSON();
		if(!eVideoJSON){
			return;
		}

		//Create arrows for existing subslides
		var subslides = $(eVideoDOM).find("article");
		$("#subslides_list").find("div.wrapper_barbutton").each(function(index,div){
			var slide = subslides[index];
			if(slide){
				var slide_id = $(slide).attr("id");
				var arrowDiv = $('<div class="draggable_sc_div" slide_id="'+ slide_id +'" slideNumber="'+(index+1)+'"" >');
				$(arrowDiv).append($('<img src="'+V.ImagesPath+'icons/flashcard_button.png" class="fc_draggable_arrow">'));
				$(arrowDiv).append($('<p class="draggable_number">'+String.fromCharCode(64+index+1)+'</p>'));
				$(div).prepend(arrowDiv);

				if(_existPoiForSlideId(eVideoJSON,slide_id)){
					$(arrowDiv).hide();
				}
			};
		});

		

		//Drag&Drop POIs
		$("div.draggable_sc_div").draggable({
			// revert: true,
			start: function( event, ui ) {
				var position = $(event.target).css("position");
				if(position==="absolute"){
					//Start d&d in scrollbar
					//Compensate change to position fixed with margins
					var current_offset = $(event.target).offset();
					$(event.target).css("position", "fixed");
					$(event.target).css("margin-top", (current_offset.top) + "px");
					$(event.target).css("margin-left", (current_offset.left) + "px");
					$(event.target).attr("ddstart","scrollbar");
				}
			},
			stop: function(event,ui) {
				//Chek if arrow is inside slideset

				var current_offset = $(event.target).offset();
				var slideset_offset = $(slidesetDOM).offset();
				var yOk = ((current_offset.top > (slideset_offset.top-10))&&(current_offset.top < (slideset_offset.top+$(slidesetDOM).outerHeight()-38)));
				var xOk = ((current_offset.left > (slideset_offset.left-5))&&(current_offset.left < (slideset_offset.left+$(slidesetDOM).outerWidth()-44)));
				var insideSlideset = ((yOk)&&(xOk));

				//Check that the Slideset is showed at the current moment
				insideSlideset = (insideSlideset && V.Editor.Slideset.getCurrentSubslide()==null);

				var isVideoCreated = _isVideoCreated(V.Slides.getCurrentSlide());

				if((insideSlideset)&&(isVideoCreated)){
					$(event.target).attr("ddend","background");

					if($(event.target).attr("ddstart")==="scrollbar"){
						//Drop inside slideset from scrollbar
						//Transform margins to top and left
						var newTop = $(event.target).cssNumber("margin-top") +  $(event.target).cssNumber("top");
						var newLeft = $(event.target).cssNumber("margin-left") +  $(event.target).cssNumber("left");
						$(event.target).css("margin-top", "0px");
						$(event.target).css("margin-left", "0px");
						$(event.target).css("top", newTop+"px");
						$(event.target).css("left", newLeft+"px");

						var slide_id = $(event.target).attr("slide_id");
						_addBallToCurrentTime(slide_id);
						$(event.target).hide();
					}

				} else {
					//Drop outside slideset or video not created
					//Invalid: Return to original position
					$(event.target).animate({ top: 0, left: 0 }, 'slow', function(){
						//Animate complete
						$(event.target).css("position", "absolute");
						//Original margins
						$(event.target).css("margin-top","-20px");
						$(event.target).css("margin-left","12px");
						$(event.target).attr("ddend","scrollbar");
					});
				}
			}
		});

		return;
	};

	var getThumbnailURL = function(eVideo){
		return (V.ImagesPath + "templatesthumbs/tEVideo.png");
	};


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Used by VISH.Editor module to save the slideset in the JSON
	 */
	var getSlideHeader = function(eVideoDOM){
		var eVideoId = $(eVideoDOM).attr('id');
		var eVideoJSON = eVideos[eVideoId];
		var videoDOM = _getVideoFromEVideo(eVideoDOM);
		var duration = V.Video.getDuration(videoDOM);

		var slide = {};
		slide.id = eVideoId;
		slide.type = V.Constant.EVIDEO;

		slide.video = {};
		slide.video.type = V.Video.getTypeVideo(videoDOM);
		switch(slide.video.type){
			case V.Constant.Video.HTML5:
				var sources = V.Video.HTML5.getSources(videoDOM);
				var sourcesString = '';
				$(sources).each(function(index, source) {
					if(index!==0){
						sourcesString = sourcesString + ',';
					}
					sourcesString = sourcesString + '{ "src": "' + source.src + '" , "type": "' + source.mimeType + '"}';
				});
				sourcesString = '[' + sourcesString + ']';
				slide.video.sources = sourcesString;
				slide.video.duration = duration;
				//TODO
				// slide.video.poster = ;
				break;
			case  V.Constant.Video.Youtube:
				slide.video.source = V.Video.Youtube.getEmbedSource(videoDOM);
				slide.video.duration = duration;
				break;
			default:
				break;
		};

		slide.width = "100%";
		slide.height = "100%";

		//Get pois
		var pois = [];

		$(eVideoJSON.balls).each(function(index,ball){
			var poi = {};
			poi.id = ball.id;
			poi.etime = _getValidatedBallTime(ball.etime,duration);
			if(typeof ball.slide_id != "undefined"){
				poi.slide_id = ball.slide_id;
			}
			poi.name = ball.name;
			pois.push(poi);
		});

		slide.pois = pois;
		slide.slides = [];

		return slide;
	};


	var _getValidatedBallTime = function(etime,duration){
		return Math.max(Math.min(etime,duration),0);
	};

	/////////////////
	// Clipboard
	/////////////////
	var preCopyActions = function(eVideoJSON,eVideoDOM){
	};

	var postCopyActions = function(eVideoJSON,eVideoDOM){
	};

	////////////////////
	// Utils
	////////////////////

	var _getCurrentEVideoJSON = function(){
		return eVideos[$(V.Slides.getCurrentSlide()).attr("id")];
	};

	var _getCurrentVideo = function(){
		return _getVideoFromEVideo(V.Slides.getCurrentSlide());
	};

	var _getVideoFromEVideo = function(eVideoDOM){
		return V.EVideo.getVideoFromVideoBox($(eVideoDOM).find(".evideoBox"));
	};

	var _isVideoCreated = function(eVideoDOM){
		var videoBox = $(eVideoDOM).find(".evideoBox");
		var video = V.EVideo.getVideoFromVideoBox(videoBox);
		return (typeof $(video).attr("videotype") != "undefined");
	};

	var _updateBallsArray = function(eVideoId){
		$(balls).each(function(index,ball){
			if(ball.eVideoId===eVideoId){
				balls.splice(index,1);
			}
		});

		if(typeof eVideos[eVideoId] != "undefined"){
			eVideos[eVideoId].balls.map(function(ball){
				balls[ball.id] = ball;
			});
		}
	};

	return {
		init 				 			: init,
		onChangeVideo					: onChangeVideo,
		getDummy						: getDummy,
		draw 							: draw,
		onVideoSelected					: onVideoSelected,
		onEnterSlideset					: onEnterSlideset,
		onLeaveSlideset					: onLeaveSlideset,
		loadSlideset					: loadSlideset,
		unloadSlideset					: unloadSlideset,
		beforeCreateSlidesetThumbnails	: beforeCreateSlidesetThumbnails,
		beforeRemoveSlideset			: beforeRemoveSlideset,
		beforeRemoveSubslide			: beforeRemoveSubslide,
		afterCreateSubslide				: afterCreateSubslide,
		getSlideHeader					: getSlideHeader,
		getThumbnailURL					: getThumbnailURL,
		preCopyActions					: preCopyActions,
		postCopyActions					: postCopyActions
	};

}) (VISH, jQuery);