VISH.Video.HTML5 = (function(V,$,undefined){
		
	//Is the event trigger by the user or via code
	var playTriggeredByUser = true;
	var pauseTriggeredByUser = true;
	var seekTriggeredByUser = true;


	var init = function(){
	};

	/* 
	 * HTML5 Video API
	 */

	var playVideo = function(videoId,currentTime){
		var video = $("#"+videoId)[0];
		if((typeof currentTime === 'number')&&(video.currentTime !== currentTime)){
			seekTriggeredByUser = false;
			video.currentTime = currentTime;
		}
		if(video.paused){
			playTriggeredByUser = false;
			video.play();
		}
	};

	var pauseVideo = function(videoId,currentTime){
		var video = $("#"+videoId)[0];
		if((typeof currentTime === 'number')&&(video.currentTime !== currentTime)){
			seekTriggeredByUser = false;
			video.currentTime = currentTime;
		}
		if(!video.paused){
			pauseTriggeredByUser = false;
			video.pause();
		}
	};

	var seekVideo = function(videoId,currentTime){
		var video = $("#"+videoId)[0];
		if((typeof currentTime === 'number')&&(video.currentTime !== currentTime)){
			seekTriggeredByUser = false;
			video.currentTime = currentTime;
		}
	};

	var showControls = function(showControls){
		var videos = $("video");
		$.each(videos, function(index, video) {
			if(!showControls){
				$(video).removeAttr("controls");
			} else {
				$(video).attr("controls",true);
			}
		});
	};


	/* 
	 * ViSH Viewer features
	 */

	var setMultimediaEvents = function(){
		var multimediaEls = $("video, audio");
		$.each(multimediaEls, function(index, mEl){

			var isVideo = (mEl.tagName==="VIDEO");
			var isAudio = !isVideo;
			
			if(isVideo){
				var mElType = "VIDEO";
			} else if(isAudio){
				var mElType = "AUDIO";
			}

			mEl.addEventListener('play', function(){
				// V.Debugging.log("Play at " + mEl.currentTime);
				var params = new Object();
				params.multimediaType = mElType;
				params.type = "HTML5";
				params.id = mEl.id;
				params.currentTime = mEl.currentTime;
				params.slideNumber = V.Slides.getCurrentSlideNumber();
				var eventId = (isVideo ? V.Constant.Event.onPlayVideo : V.Constant.Event.onPlayAudio);
				V.EventsNotifier.notifyEvent(eventId,params,playTriggeredByUser);
				playTriggeredByUser = true;
			}, false);
			mEl.addEventListener('pause', function(){
				// V.Debugging.log("Pause " + mEl.currentTime);
				var params = new Object();
				params.multimediaType = mElType;
				params.type = "HTML5";
				params.id = mEl.id;
				params.currentTime = mEl.currentTime;
				params.slideNumber = V.Slides.getCurrentSlideNumber();
				var eventId = (isVideo ? V.Constant.Event.onPauseVideo : V.Constant.Event.onPauseAudio);
				V.EventsNotifier.notifyEvent(eventId,params,pauseTriggeredByUser);
				pauseTriggeredByUser = true;
			}, false);
			mEl.addEventListener('ended', function(){
				// V.Debugging.log("Ended " + mEl.currentTime);
			}, false);
			mEl.addEventListener("error", function(err){
                // V.Debugging.log("mEl error: " + err);
            }, false);
			mEl.addEventListener("seeked", function(err){
                // V.Debugging.log("Seek at " + mEl.currentTime);
                var params = new Object();
                params.multimediaType = mElType;
				params.type = "HTML5";
				params.id = mEl.id;
				params.currentTime = mEl.currentTime;
				params.slideNumber = V.Slides.getCurrentSlideNumber();
				var eventId = (isVideo ? V.Constant.Event.onSeekVideo : V.Constant.Event.onSeekAudio);
				V.EventsNotifier.notifyEvent(eventId,params,seekTriggeredByUser);
				seekTriggeredByUser = true;
            }, false);

            if(isVideo){
				//PREVENT KEYBOARD EVENTS ON FIREFOX!
				$(mEl).focus(function(event){
					this.blur();
				});
            }

		});
	};
	
	/**
	 * Function to play all videos and audios of a slide
	 */
	var playMultimedia = function(slide){
		var multimediaEls = $(slide).find("video, audio");
		$.each(multimediaEls, function(index,mEl){
			if ($(mEl).attr("wasplayingonslideleave")=="true"){
				mEl.play();
			} else if ($(mEl).attr("wasplayingonslideleave")=="false"){
				//Do nothing
			} else if (typeof $(mEl).attr("wasplayingonslideleave") == "undefined"){
				//No wasplayingonslideleave attr
				
				//Check autoplayonsliddenter attr
				if ($(mEl).attr("autoplayonslideenter")=="true"){
					mEl.play();
				}
			}
		});
	};
	
	/**
	 * Function to stop all videos and audios of a slide
	 */
	var stopMultimedia = function(slide){
		var multimediaEls = $(slide).find("video, audio");
		$.each(multimediaEls, function(index,mEl){
			var playing = !mEl.paused;
			$(mEl).attr("wasplayingonslideleave",playing);
			if(playing){
				mEl.pause();
			}
		});
	};


	/*
	 * Rendering
	 */

	 var renderVideoFromJSON = function(videoJSON, options){
		var renderOptions = options || {};

		if(typeof renderOptions.id == "undefined"){
			renderOptions.id = ((typeof videoJSON != "undefined")&&(videoJSON['id'])) ? videoJSON['id'] : V.Utils.getId();
		}
		if(typeof renderOptions.controls == "undefined"){
			renderOptions.controls = videoJSON['controls'];
		}
		if(typeof renderOptions.poster == "undefined"){
			if((typeof videoJSON['poster'] == "string")&&((/^\/[\w\/]+example_poster_image/g).test(videoJSON['poster']))){
				//Default HTML5 poster. Update route.
				videoJSON['poster'] = getDefaultPosterURL();
			}
			renderOptions.poster = videoJSON['poster'];
		}

		renderOptions.style = videoJSON['style'];
		renderOptions.autoplay = videoJSON['autoplay'];
		renderOptions.loop = videoJSON['loop'];
		
		return renderVideoFromSources(getSourcesFromJSON(videoJSON),renderOptions);
	};

	var renderVideoFromSources = function(sources,options){
		var video = $("<video></video>");

		$(video).attr("preload","metadata");

		if((options)&&(options.extraAttrs)){
			for(var key in options.extraAttrs){
				$(video).attr(key,options.extraAttrs[key]);
			}
		}

		if(options){
			if(options['id']){
				$(video).attr("id",options['id']);
			}
			if(typeof options.onVideoReady == "string"){
				//Look for the function
				try {
					var onVideoReadySplit = options.onVideoReady.split(".");
					var onVideoReadyFunction = window[onVideoReadySplit[0]];
					for(var k=1; k<onVideoReadySplit.length; k++){
						onVideoReadyFunction = onVideoReadyFunction[onVideoReadySplit[k]];
					}
					if(typeof onVideoReadyFunction == "function"){
						$(video).attr("onloadeddata",options.onVideoReady + '(this)');
					}
				} catch(e){}
			}
			if(options['extraClasses']){
				var extraClassesLength = options['extraClasses'].length;
				for(var i=0; i<extraClassesLength; i++){
					$(video).addClass(options['extraClasses'][i]);
				}
			}
			if(options.controls !== false){
				$(video).attr("controls","controls");
			}
			if(typeof options.autoplay != "undefined"){
				$(video).attr("autoplayonslideenter",options.autoplay);
			}
			if(typeof options['poster'] == "string"){
				$(video).attr("poster",options['poster']);
			}
			if(options['loop'] === true){
				$(video).attr("loop","loop");
			}
			if(options['style']){
				$(video).attr("style",options['style']);
			}
		}

		//Default callback
		if(typeof $(video).attr("onloadeddata") == "undefined"){
			$(video).attr("onloadeddata",'VISH.Video.HTML5.onVideoReady(this)');
		};

		video = V.Utils.getOuterHTML(video);
		video = video.split("</video>")[0];

		//Write sources (we can't loaded it to the DOM directly, because then they will start to load, before been actually rendered)
		if((!options)||(options.loadSources !== false)){
			$.each(sources, function(index, source){
				if(typeof source.src == "string"){
					var sourceSrc = source.src;
					if((typeof options != "undefined")&&(options.timestamp === true)){
						sourceSrc = V.Utils.addParamToUrl(sourceSrc,"timestamp",""+new Date().getTime());
					}
					var mimeType = (source.mimeType)?"type='" + source.mimeType + "' ":"";
					video = video + "<source src='" + sourceSrc + "' " + mimeType + ">";
				}
			});

			if(sources.length>0){
				video = video + "<p>Your browser does not support HTML5 video.</p>";
			}
		}

		video = video + "</video>";

		return video;
	};

	var addSourcesToVideoTag = function(sources,videoTag,options){
		var options = options || {};

		$.each(sources, function(index, source){
			if(typeof source.src == "string"){
				var sourceSrc = source.src;
				if(options.timestamp === true){
					sourceSrc = V.Utils.addParamToUrl(sourceSrc,"timestamp",""+new Date().getTime());
				}
				var mimeType = (source.mimeType)?"type='" + source.mimeType + "' ":"";
				$(videoTag).append("<source src='"+sourceSrc+"' " + mimeType + ">");
			}
		});
		if(sources.length>0){
			$(videoTag).append("<p>Your browser does not support HTML5 video.</p>");
		}

		if(options.initTimer===true){
			_initLoadedTimerForVideo(videoTag);
		}
	};

	var _initLoadedTimerForVideo = function(videoTag){
		var videoTimer = setInterval(function(){
			var nAttempts = (typeof $(videoTag).attr("loadAttempts") != "undefined") ? parseInt($(videoTag).attr("loadAttempts")) : 1;
			if(($(videoTag).attr("loaded")==="true")||(nAttempts>3)){
				clearTimeout(videoTimer);
			} else {
				$(videoTag).attr("loadAttempts",nAttempts+1)
				_reloadTimestampSources(videoTag);
			}
		},10000);
	};

	var _reloadTimestampSources = function(videoTag){
		V.Debugging.log("ViSH.Video.HTML5 Module [BETA VERSION]: _reloadTimestampSources called");

		var sources = V.Video.HTML5.getSources(videoTag);
		sources.map(function(source){
			source.src = V.Utils.addParamToUrl(source.src,"timestamp",""+new Date().getTime());
			return source;
		});

		$(videoTag).children().remove();

		if($(videoTag).attr("loaded")==="true"){
			return;
		}

		$(videoTag).load();

		addSourcesToVideoTag(sources,videoTag,{timestamp: true,initTimer: false});

		setTimeout(function(){
			$(videoTag).load();
		},500);

		// $(videoTag).find("source").each(function(index,source){
		// 	var sourceSrc = $(source).attr("src");
		// 	//addParam method will remove the previous param
		// 	sourceSrc = V.Utils.addParamToUrl(sourceSrc,"timestamp",""+new Date().getTime());
		// 	$(source).attr("src",sourceSrc);
		// });
		// if($(videoTag).attr("loaded")!=="true"){
		// 	$(videoTag).load();
		// }
	};

	var onVideoReady = function(video){
		//Check state (based on http://www.w3schools.com/tags/av_prop_readystate.asp)
		if((typeof video != "undefined")&&((video.readyState == 4)||(video.readyState == 3))){
			$(video).attr("loaded","true");
		}
	};

	/*
	 * Utils
	 */

	var getSources = function(videoDOM){
		if(typeof videoDOM == "string"){
			var sources = [];
			//Prevent video to be rendered in a non appropriate time.
			var srcPattern = new RegExp("src=(\'||\")([a-z-.://0-9]+)","g");

			// var videoDOM = "<video controls='controls'><source src='http://vishub.org/videos/3366.webm' type='video/webm' ><source src='http://vishub.org/videos/3366.mp4' type='video/mp4' ><p>Your browser does not support HTML5 video.</p></video>";
			var found;
			while(found = srcPattern.exec(videoDOM)){
				if(found.length>2){
					sources.push(found[2]);
				}
				srcPattern.lastIndex = found.index+1;
			};

			return sources.map(function(value){ return {"src": value, "mimeType": getVideoMimeType(value)}});
		}

		try {
			return $(videoDOM).find("source").map(function(){ return {"src": this.src, "mimeType": getVideoMimeType(this.src)}});
		} catch(e){
			return [];
		}
		
		return [];
	};

	var getSourcesFromJSON = function(videoJSON){
		if(typeof videoJSON != "object"){
			return [];
		}

		if(typeof videoJSON.sources == "string"){
			try {
				var sources = JSON.parse(videoJSON.sources);
			} catch (e){
				return [];
			}
		} else if(typeof videoJSON.sources == "object"){
			var sources = videoJSON.sources;
		}

		if(typeof sources != "undefined"){
			//Compatibility with old VE versions (now the attr type is called mimeType)
			$.each(sources, function(index, source){
				if(typeof source.type != "undefined"){
					source.mimeType = source.type;
				}
			});
		}

		return sources;
	};

	var getVideoMimeType = function(url){
		var source = (V.Object.getObjectInfo(url)).source;
		return "video/" + source.split('.').pop().split("?")[0];
	};

	var getPoster = function(videoDOM){
		if(typeof videoDOM == "string"){
			//Prevent video to be rendered in a non appropriate time.
			var posterPattern = new RegExp("poster=(\'||\")([a-z.://0-9?=%]+)","g");
			// var videoDOM = "<video poster='http://vishub.org/pictures/44.png' controls='controls'><source src='http://vishub.org/videos/3366.webm' type='video/webm' ><source src='http://vishub.org/videos/3366.mp4' type='video/mp4' ><p>Your browser does not support HTML5 video.</p></video>";
			var found = posterPattern.exec(videoDOM);
			if((typeof found != "undefined")&&(found != null)&&(found.length>2)){
				return found[2];
			}

			return undefined;
		}

		return $(videoDOM).attr("poster");
	};

	var getDefaultPosterURL = function(){
		return V.ImagesPath + "vicons/example_poster_image.jpg";
	};

	return {
		init 					: init,
		renderVideoFromJSON		: renderVideoFromJSON,
		renderVideoFromSources	: renderVideoFromSources,
		addSourcesToVideoTag	: addSourcesToVideoTag,
		setMultimediaEvents 	: setMultimediaEvents,
		playMultimedia			: playMultimedia,
		stopMultimedia			: stopMultimedia,
		playVideo 				: playVideo,
		pauseVideo 				: pauseVideo,
		seekVideo				: seekVideo,
		showControls 			: showControls,
		getSources 				: getSources,
		getSourcesFromJSON		: getSourcesFromJSON,
		getVideoMimeType		: getVideoMimeType,
		getPoster				: getPoster,
		getDefaultPosterURL		: getDefaultPosterURL,
		onVideoReady 			: onVideoReady
	};

})(VISH,jQuery);