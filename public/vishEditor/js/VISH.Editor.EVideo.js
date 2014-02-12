VISH.Editor.EVideo = (function(V,$,undefined){

	//Internal
	var initialized = false;

	//Store enriched videos data
	var eVideos;

	var init = function(){
		if(!initialized){
			eVideos = {};
			_loadEvents();
			initialized = true;
		}
	};

	var _loadEvents = function(){
		//Select Video Event
		var hiddenLinkToAddVideos = $('<a id="hidden_button_to_selectVideoSourceForEVideo" href="#video_fancybox" style="display:none"></a>');
		$(hiddenLinkToAddVideos).fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
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
		$(eVideoIndexBodyActions).html('<button type="button" class="btn btn-small slidesScrollbarButton evideoAddChapterButton addSlideButtonDisabled"><i class="icon-plus"></i><span>'+V.I18n.getTrans("i.AddChapter")+'</span></button>');
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
			eVideos[eVideoId].balls = {};
		}

		if(eVideos[eVideoId].drawed === true){
			//Already drawed
			return;
		}

		eVideos[eVideoId].drawed = true;
		$(eVideoDOM).addClass("temp_shown");
		$(eVideoDOM).removeClass("temp_shown");
	};

	var _getCurrentEVideoJSON = function(){
		return eVideos[$(V.Slides.getCurrentSlide()).attr("id")];
	};

	/*
	 * Callback from the V.Editor.Video module to add the video
	 */
	var onVideoSelected = function(contentToAdd,eVideoDOM){
		if(!eVideoDOM){
			eVideoDOM = V.Slides.getCurrentSlide();
		}

		if($(eVideoDOM).attr("type")===V.Constant.EVIDEO){
			$(eVideoDOM).find("div.change_evideo_button").remove();
			$(eVideoDOM).find("div.evideoBody").css("margin-top","0px");
			_renderVideo(contentToAdd,eVideoDOM);
		}

		$.fancybox.close();
	};

	var _renderVideo = function(videoObj,eVideoDOM){
		var videoBody = $(eVideoDOM).find(".evideoBody");
		var eVideoId = $(eVideoDOM).attr("id");
		var objectInfo = V.Object.getObjectInfo(videoObj);
		switch(objectInfo.type){
			case V.Constant.MEDIA.HTML5_VIDEO:
				var sources = (typeof objectInfo.source == "object") ? objectInfo.source : [{src: objectInfo.source}];
				var video = $(V.Video.HTML5.renderVideoFromSources(sources,{controls: false, poster: false}));
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
		console.log("On video ready");
		console.log(video);

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
	}

	var beforeRemoveSlideset = function(eVideo){
		var eVideoId = $(eVideo).attr("id");
		if(typeof eVideos[eVideoId] !== "undefined"){
			delete eVideos[eVideoId];
		}
	}

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

	/*
	 * Redraw the pois of the virtual tour
	 * This actions must be called after thumbnails have been rewritten
	 */
	var _drawPois = function(eVideoDOM){
		var eVideoJSON = _getCurrentEVideoJSON();
		if(!eVideoJSON){
			return;
		}


		return;


		var markers = eVideo.markers;
		
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

				if(typeof markers[slide_id] != "undefined"){
					$(arrowDiv).hide();
				}
			};
		});


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