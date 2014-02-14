VISH.Editor.EVideo = (function(V,$,undefined){

	//Internal
	var initialized = false;

	//Store enriched videos data
	var eVideos;
	//Direct access to current balls (balls[ballId] = ball)
	var balls;

	//Link to open chapters fancybox
	var hiddenLinkToAddChapters;


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
		var hiddenLinkToAddVideos = $('<a href="#video_fancybox" style="display:none"></a>');
		$(hiddenLinkToAddVideos).fancybox({
			'autoDimensions' : false,
			'width': 800,
			'height': 600,
			'scrolling': 'no',
			'padding' : 0,
			"onStart"  : function(data) {
				V.Editor.Video.setAddContentMode(V.Constant.EVIDEO);
				V.Editor.Utils.loadTab('tab_video_youtube');
			},
			"onClosed"  : function(data) {
				V.Editor.Video.setAddContentMode(V.Constant.NONE);
			}
		});
		$(document).on("click", 'div.change_evideo_button', function(){
			V.Editor.setCurrentContainer($(V.Slides.getCurrentSlide()).find(".evideoBody"));
			$(hiddenLinkToAddVideos).trigger("click");
		});

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
					var significativeNumbers = formatedDuration.split(":").join("").length;
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
						var titleName = $(chapter).find(".eVideoIndexEntryBody").html();
						if(typeof titleName == "string"){
							$("#eVideoChaptersTextArea").val(titleName);
						}

						//Ball field
						var ball = balls[$(chapter).attr("ballid")];
						if((typeof ball != "undefined")&&(typeof ball.letter == "string")){
							$("#eVideoChaptersBall_wrapper").find("span").html(VISH.I18n.getTrans("i.ItemAndBall", {letter: "<span class='letterInChapterDialog'>"+ball.letter+"</span>"}));
							$("#eVideoChaptersBall_wrapper").show();
						}

						//Time field
						try {
							var cTime = Math.round(parseFloat($(chapter).attr("etime")));
						} catch(e) {
							var cTime = 0;
						}
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

		//Chapters screen events
		$(document).on('change', '#eVideochapters_hours', _onChapterTimeChange);
		$(document).on('change', '#eVideochapters_minutes', _onChapterTimeChange);
		$(document).on('change', '#eVideochapters_seconds', _onChapterTimeChange);

		$(document).on('click', '#eVideoChaptersButtons_wrapper a[buttonaction="Ok"]', _onAddChapter);
		$(document).on('click', '#eVideoChaptersButtons_wrapper a[buttonaction="Cancel"]', function(){
			$.fancybox.close();
		});
	};

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

	var _onEditChapter = function(event){
		var chapter = $("ul.evideoChapters li").has(event.target);

		//Mark chapter has selected
		$("ul.evideoChapters li").removeClass("selected");
		$(chapter).addClass("selected");

		//Open chapter edit screen
		$(hiddenLinkToAddChapters).trigger("click");
	};

	var _onRemoveChapter = function(event){
		var chapter = $("ul.evideoChapters li").has(event.target);
		console.log("On remove chapter");
		console.log(chapter);
	};

	var _getCurrentChapter = function(){
		return $(V.Slides.getCurrentSlide()).find(".evideoChapters li.selected");
	};

	var _onChapterTimeChange = function(){
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

	var _onAddChapter = function(){
		console.log("Add Chapter");
		$.fancybox.close();
	};


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
		$(eVideoIndexBodyActions).html('<button type="button" class="btn btn-small slidesScrollbarButton evideoAddChapterButton addSlideButtonDisabled"><i class="icon-plus"></i><span>'+V.I18n.getTrans("i.AddItem")+'</span></button>');
		$(eVideoIndexBody).prepend(eVideoIndexBodyActions);	

		return "<article id='"+slidesetId+"' type='"+V.Constant.EVIDEO+"' slidenumber='"+options.slideNumber+"'><div class='delete_slide'></div><img class='help_in_slide help_in_evideo' src='"+V.ImagesPath+"vicons/helptutorial_circle_blank.png'/>" + V.Utils.getOuterHTML(videoBox) + V.Utils.getOuterHTML(indexBox) + "</article>";
	};


	var _drawEVideo = function(eVideoJSON,eVideoDOM){
		if(!eVideoJSON){
			//Default values
			eVideoJSON = {};
			eVideoJSON.pois = [];
		}

		var eVideoId = $(eVideoDOM).attr("id");

		if(typeof eVideos[eVideoId] == "undefined"){
			eVideos[eVideoId] = eVideoJSON;

			//Create balls array grounded on pois hashes
			eVideoJSON.balls = [];
			$(eVideoJSON.pois).each(function(index,poi){
				eVideoJSON.balls.push(poi);
			});

			eVideoJSON.balls = ((eVideoJSON.balls.filter(function(ball){
				return ((typeof ball.etime!= "undefined") && (!isNaN(parseFloat(ball.etime))) && (parseFloat(ball.etime)>0));
			})).map(function(ball){
				ball.letter = _getLetterForBall(eVideoJSON,ball);
				ball.etime = parseFloat(ball.etime);
				ball.eVideoId = eVideoId;
				return ball;
			})).sort(function(A,B){
				return A.etime>B.etime;
			}).map(function(ball){
				balls[ball.id] = ball;
				return ball;
			});
		}

		if(eVideos[eVideoId].drawed === true){
			//Already drawed
			return;
		}

		eVideos[eVideoId].drawed = true;

		var eVideoObject = _getEVideoObjectFromJSON(eVideoJSON);
		if(typeof eVideoObject != "undefined"){
			_renderVideo(eVideoObject,eVideoDOM);
		}
	};

	var _getLetterForBall = function(eVideoJSON,ball){
		var letter = undefined;
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

	var _getCurrentEVideoJSON = function(){
		return eVideos[$(V.Slides.getCurrentSlide()).attr("id")];
	};

	var _getCurrentVideo = function(){
		return V.EVideo.getVideoFromVideoBox($(V.Slides.getCurrentSlide()).find(".evideoBox"));
	};

	/*
	 * Callback from the V.Editor.Video module to add the video
	 */
	var onVideoSelected = function(contentToAdd,eVideoDOM){
		if(!eVideoDOM){
			eVideoDOM = V.Slides.getCurrentSlide();
		}

		if($(eVideoDOM).attr("type")===V.Constant.EVIDEO){
			_renderVideo(contentToAdd,eVideoDOM);
		}

		$.fancybox.close();
	};

	var _renderVideo = function(videoObj,eVideoDOM){
		$(eVideoDOM).addClass("temp_shown");
		
		//Clean dummy properties...
		$(eVideoDOM).find("div.change_evideo_button").remove();
		$(eVideoDOM).find("div.evideoBody").css("margin-top","0px");

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

		var durationDOM = $(videoHeader).find(".evideoDuration");
		var videoDuration = V.Video.getDuration(video);
		var formatedDuration = V.Utils.fomatTimeForMPlayer(videoDuration);
		$(durationDOM).html(formatedDuration);

		var significativeNumbers = formatedDuration.split(":").join("").length;
		$(video).attr("sN",significativeNumbers);

		V.EVideo.fitVideoInVideoBox(videoBox);

		$(videoHeader).show();
		$(videoFooter).show();

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

		$(eVideoDOM).removeClass("temp_shown");
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

			$(li).html("");
			$(li).append(infoDiv);
			$(li).append(actionDiv);
		});

		//Add ball Letter to index.
		$(chapterList).each(function(value,li){
			var ballId = $(li).attr("ballid");
			var ballLetter = balls[ballId].letter;
			$(li).find(".eVideoIndexEntryNumber").html((value+1) + " (" + ballLetter + "). ");
		});
	};

	var _renderBalls = function(eVideoDOM,eVideoJSON){
		var videoBox = $(eVideoDOM).find(".evideoBox");
		var videoDOM = V.EVideo.getVideoFromVideoBox(videoBox);
		var duration = V.Video.getDuration(videoDOM);

		$(eVideoJSON.balls).each(function(index,ball){
			_drawBall(eVideoDOM,eVideoJSON,ball,duration);
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
		var ballSliderWrapper = $("<div class='ballSliderWrapper'><div class='ballSlider'></div></div>");
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
			}, start: function(event,ui){
				var ballId = $(event.target).find("span.ballTimeSpan").attr("ballid");
				var selectedChapter = $(eVideoDOM).find("ul.evideoChapters").find("li[ballid='"+ballId+"']");
				$(selectedChapter).addClass("active");
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
				var ballWrapper = $("<div class='ballWrapper'><div class='ballLine'></div><div class='ballImg' ballTime='"+ ball.etime +"'><span class='ballLetterSpan'>"+ ball.letter +"</span></div><span class='ballTimeSpan' eVideoId='"+ ball.eVideoId +"' ballid='"+ ball.id +"' balltime='"+ ball.etime +"' videoDuration='"+ duration +"'>" + V.Utils.fomatTimeForMPlayer(ball.etime) + "</span></div>");
				var handler = $(ballSlider).find(".ui-slider-handle");
				$(handler).append(ballWrapper);
			}
		});
	};

	var _reOrderBalls = function(eVideoDOM,eVideoJSON){
		eVideos[eVideoJSON.id].balls.sort(function(A,B){
			return A.etime>B.etime;
		});
		_renderIndex(eVideoDOM,eVideos[eVideoJSON.id]);
	};

	////////////////
	// Slideset Callbacks
	////////////////

	/*
	 * Complete the eVideo scaffold to draw the virtual tour in the presentation
	 */
	var draw = function(slidesetJSON,scaffoldDOM){
		_drawEVideo(slidesetJSON,scaffoldDOM);
	};

	var onEnterSlideset = function(eVideo){
		//Load arrows
	};

	var onLeaveSlideset = function(eVideo){
	};

	var loadSlideset = function(eVideo){
		//Show Arrows
		$("#subslides_list").find("div.draggable_sc_div[ddend='scrollbar']").show();
	};

	var unloadSlideset = function(eVideo){
	};

	var beforeCreateSlidesetThumbnails = function(eVideo){
		_drawPois(eVideo);
	};

	var beforeRemoveSlideset = function(eVideo){
		var eVideoId = $(eVideo).attr("id");
		if(typeof eVideos[eVideoId] !== "undefined"){
			delete eVideos[eVideoId];
		}
	};

	var beforeRemoveSubslide = function(eVideo,subslide){
		var subslideId = $(subslide).attr("id");
		var slideNumber = $(subslide).attr("slideNumber");

		//Remove the subslide markers (if exist)
		var markers = _getCurrentTour().markers;
		Object.keys(markers).forEach(function(key){
			var marker = markers[key];
			if(marker.slide_id===subslideId){
				_removeMarker(marker);
			} else {
				//Adjust pinImages of the rest of the markers
				var markerArrow = $(".draggable_sc_div[slide_id='"+marker.slide_id+"']");
				var markerSlideNumber = $(markerArrow).attr("slideNumber");
				if(markerSlideNumber > slideNumber){
					$(markerArrow).attr("slideNumber", markerSlideNumber-1);
					marker.setIcon(_getPinImageForSlideNumber(markerSlideNumber-1));
				}
			}
		});

		// //Adjust pinImages of the rest of markers
		// var rMl = removedMarkers.length;
		// for(var k=0; k<rMl; k++){
		// 	var deletedSlideNumber = removedMarkers[k].slideNumber;
		// 	Object.keys(markers).forEach(function(key){
		// 		var marker = markers[key];
		// 		if(marker.slideNumber > deletedSlideNumber){
		// 			marker.slideNumber = marker.slideNumber-1;
		// 			marker.setIcon(_getPinImageForSlideNumber(marker.slideNumber));
		// 		}
		// 	});
		// }

	}


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
	 * Redraw the pois of the virtual tour
	 * This actions must be called after thumbnails have been rewritten
	 */
	var _drawPois = function(eVideoDOM){
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

		return;

		//Drag&Drop POIs

		$("div.draggable_sc_div").draggable({
			start: function( event, ui ) {
				var position = $(event.target).css("position");
				if(position==="fixed"){
					//Start d&d in background
					$(event.target).attr("ddstart","background");
				} else {
					//Start d&d in scrollbar
					//Compensate change to position fixed with margins
					var current_offset = $(event.target).offset();
					$(event.target).css("position", "fixed");
					$(event.target).css("margin-top", (current_offset.top) + "px");
					$(event.target).css("margin-left", (current_offset.left) + "px");
					$(event.target).attr("ddstart","scrollbar");
				}
			},
			stop: function(event, ui) {
				// //Chek if poi is inside map

				// var canvas = $(eVideoDOM).find("div.vt_canvas");
				// var xDif = ($(eVideoDOM).outerWidth() - $(canvas).outerWidth())/2;
				// var yDif = ($(eVideoDOM).outerHeight() - $(canvas).outerHeight())/2;
				// var vt_offset = $(eVideoDOM).offset();
				// var poi_offset = $(event.target).offset();

				// //Compensate margins and adjust to put marker in map
				// var myX = poi_offset.left-vt_offset.left-xDif+25;
				// var myY = poi_offset.top-vt_offset.top-yDif+34;

				// var point = new google.maps.Point(myX,myY);
				// var position = _getCurrentTour().overlay.getProjection().fromContainerPixelToLatLng(point);
				// var insideMap = _isPositionInViewport(position);

				// //Check that the vtour is showed at the current moment
				// insideMap = (insideMap && V.Editor.Slideset.getCurrentSubslide()==null);

				// if(insideMap){
				// 	$(event.target).attr("ddend","background");

				// 	//Drop inside background from scrollbar
				// 	//Transform margins to top and left
				// 	var newTop = $(event.target).cssNumber("margin-top") +  $(event.target).cssNumber("top");
				// 	var newLeft = $(event.target).cssNumber("margin-left") +  $(event.target).cssNumber("left");
				// 	$(event.target).css("margin-top", "0px");
				// 	$(event.target).css("margin-left", "0px");
				// 	$(event.target).css("top", newTop+"px");
				// 	$(event.target).css("left", newLeft+"px");

				// 	var slide_id = $(event.target).attr("slide_id");
				// 	var marker = _addMarkerToPosition(position,slide_id);
				// 	$(event.target).hide();

				// } else {
				// 	//Drop outside background (always from scrollbar in virtual tours)
				// 	//Return to original position
				// 	$(event.target).animate({ top: 0, left: 0 }, 'slow', function(){
				// 		//Animate complete
				// 		$(event.target).css("position", "absolute");
				// 		//Original margins
				// 		$(event.target).css("margin-top","-20px");
				// 		$(event.target).css("margin-left","12px");
				// 		$(event.target).attr("ddend","scrollbar");
				// 	});
				// }
			}
		});
	};


	var getThumbnailURL = function(eVideo){
		return (V.ImagesPath + "templatesthumbs/tEVideo.png");
	};


	////////////////////
	// JSON Manipulation
	////////////////////

	/*
	 * Used by VISH.Editor module to save the virtual tour in the JSON
	 */
	var getSlideHeader = function(eVideoDOM){
		var eVideoId = $(eVideoDOM).attr('id');
		var eVideo = eVideos[eVideoId];

		var slide = {};
		slide.id = eVideoId;
		slide.type = V.Constant.EVIDEO;

		slide.width = "100%";
		slide.height = "100%";

		//Get pois
		var pois = [];
		for(var key in eVideo.markers){
			var marker = eVideo.markers[key];
			var poi = {};
			// poi.lat = marker.position.lat().toString();
			// poi.lng = marker.position.lng().toString();
			// poi.slide_id = marker.slide_id;
			pois.push(poi);
		};
		slide.pois = pois;

		slide.slides = [];

		return slide;
	};


	/////////////////
	// Clipboard
	/////////////////
	var preCopyActions = function(eVideoJSON,eVideoDOM){
	};

	var postCopyActions = function(eVideoJSON,eVideoDOM){
	};


	return {
		init 				 			: init,
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
		getSlideHeader					: getSlideHeader,
		getThumbnailURL					: getThumbnailURL,
		preCopyActions					: preCopyActions,
		postCopyActions					: postCopyActions
	};

}) (VISH, jQuery);