VISH.Audio.HTML5 = (function(V,$,undefined){
		
	var init = function(){
	};

	/*
	 * Rendering
	 */
	var renderAudioFromJSON = function(audioJSON, options){
		var renderOptions = options || {};

		if(typeof renderOptions.id == "undefined"){
			renderOptions.id = ((typeof audioJSON != "undefined")&&(audioJSON['id'])) ? audioJSON['id'] : V.Utils.getId();
		}
		if(typeof renderOptions.controls == "undefined"){
			renderOptions.controls = audioJSON['controls'];
		}

		renderOptions.style = audioJSON['style'];
		renderOptions.autoplay = audioJSON['autoplay'];
		renderOptions.loop = audioJSON['loop'];
		
		return renderAudioFromSources(getSourcesFromJSON(audioJSON),renderOptions);
	};

	var renderAudioFromSources = function(sources,options){
		var audio = $("<audio></audio>");

		$(audio).attr("preload","metadata");
		$(audio).addClass("veaudioelement");

		if((options)&&(options.extraAttrs)){
			for(var key in options.extraAttrs){
				$(audio).attr(key,options.extraAttrs[key]);
			}
		}

		if(options){
			if(options['id']){
				$(audio).attr("id",options['id']);
			}
			if(typeof options.onAudioReady == "string"){
				//Look for the function
				try {
					var onAudioReadySplit = options.onAudioReady.split(".");
					var onAudioReadyFunction = window[onAudioReadySplit[0]];
					for(var k=1; k<onAudioReadySplit.length; k++){
						onAudioReadyFunction = onAudioReadyFunction[onAudioReadySplit[k]];
					}
					if(typeof onAudioReadyFunction == "function"){
						$(audio).attr("onloadeddata",options.onAudioReady + '(this)');
					}
				} catch(e){}
			}
			if(options['extraClasses']){
				var extraClassesLength = options['extraClasses'].length;
				for(var i=0; i<extraClassesLength; i++){
					$(audio).addClass(options['extraClasses'][i]);
				}
			}
			if(options.controls !== false){
				$(audio).attr("controls","controls");
			}
			if(typeof options.autoplay != "undefined"){
				$(audio).attr("autoplayonslideenter",options.autoplay);
			}
			if(options['loop'] === true){
				$(audio).attr("loop","loop");
			}
			if(options['style']){
				$(audio).attr("style",options['style']);
			}
		}

		//Default callback
		if(typeof $(audio).attr("onloadeddata") == "undefined"){
			$(audio).attr("onloadeddata",'VISH.Audio.HTML5.onAudioReady(this)');
		};

		audio = V.Utils.getOuterHTML(audio);
		audio = audio.split("</audio>")[0];

		//Write sources (we can't loaded it to the DOM directly, because then they will start to load, before been actually rendered)
		if((!options)||(options.loadSources !== false)){
			$.each(sources, function(index, source){
				if(typeof source.src == "string"){
					var sourceSrc = source.src;
					if((typeof options != "undefined")&&(options.timestamp === true)){
						sourceSrc = V.Utils.addParamToUrl(sourceSrc,"timestamp",""+new Date().getTime());
					}
					var mimeType = (source.mimeType)?"type='" + source.mimeType + "' ":"";
					audio = audio + "<source src='" + sourceSrc + "' " + mimeType + ">";
				}
			});

			if(sources.length>0){
				audio = audio + "<p>Your browser does not support HTML5 audio.</p>";
			}
		}

		audio = audio + "</audio>";

		return audio;
	};

	var addSourcesToAudioTag = function(sources,audioTag,options){
		var options = options || {};

		$.each(sources, function(index, source){
			if(typeof source.src == "string"){
				var sourceSrc = source.src;
				if(options.timestamp === true){
					sourceSrc = V.Utils.addParamToUrl(sourceSrc,"timestamp",""+new Date().getTime());
				}
				var mimeType = (source.mimeType)?"type='" + source.mimeType + "' ":"";
				$(audioTag).append("<source src='"+sourceSrc+"' " + mimeType + ">");
			}
		});
		if(sources.length>0){
			$(audioTag).append("<p>Your browser does not support HTML5 audio.</p>");
		}
	};

	var onAudioReady = function(audio){
		//Check state (based on http://www.w3schools.com/tags/av_prop_readystate.asp)
		if((typeof audio != "undefined")&&((audio.readyState == 4)||(audio.readyState == 3))){
			$(audio).attr("loaded","true");
		}
	};

	/*
	 * Utils
	 */

	var getSources = function(audioDOM){
		if(typeof audioDOM == "string"){
			var sources = V.Video.HTML5.getSources(audioDOM);
			return sources.map(function(source){ return {"src": source.src, "mimeType": getAudioMimeType(source.src)}});
		}

		try {
			return $(audioDOM).find("source").map(function(){ return {"src": this.src, "mimeType": getAudioMimeType(this.src)}});
		} catch(e){
			return [];
		}

		return [];
	};

	var getSourcesFromJSON = function(audioJSON){
		//We can get the sources in the same way that HTML5 Video Tags
		return V.Video.HTML5.getSourcesFromJSON(audioJSON);
	};

	var getAudioMimeType = function(url){
		var source = (V.Object.getObjectInfo(url)).source;
		var extension = source.split('.').pop().split("?")[0];
		var mimeType;
		switch(extension){
			case "ogg":
				mimeType = "ogg";
				break;
			case "mp3":
				mimeType = "mpeg";
				break;
			case "wav":
				mimeType = "wav";
				break;
			default:
				mimeType = extension;
				break;
		}
		return "audio/" + mimeType;
	};

	return {
		init 					: init,
		renderAudioFromJSON		: renderAudioFromJSON,
		renderAudioFromSources	: renderAudioFromSources,
		addSourcesToAudioTag	: addSourcesToAudioTag,
		onAudioReady 			: onAudioReady,
		getSources 				: getSources,
		getSourcesFromJSON		: getSourcesFromJSON,
		getAudioMimeType		: getAudioMimeType
	};

})(VISH,jQuery);