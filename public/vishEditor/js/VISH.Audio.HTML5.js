VISH.Audio.HTML5 = (function(V,$,undefined){
		
	var init = function(){
	};

	/*
	 * Rendering
	 */
	 var renderAudioFromJSON = function(audioJSON, options){
		var renderOptions = {};

		renderOptions.elId = (audioJSON['id']) ? audioJSON['id'] : V.Utils.getId();
		renderOptions.style = audioJSON['style'];
		renderOptions.controls = audioJSON['controls'];
		renderOptions.autoplay = audioJSON['autoplay'];
		renderOptions.loop = audioJSON['loop'];
		
		//Params forced by options
		if(options){
			if(options.id){
				renderOptions.elId = options.id;
			}
			if(options.extraClasses){
				renderOptions.extraClasses = options.extraClasses;
			}
			if(options.controls === false){
				renderOptions.controls = options.controls;
			}
		};

		return renderAudioFromSources(getSourcesFromJSON(audioJSON),renderOptions);
	};

	var renderAudioFromSources = function(sources,options){
		var elId = "";
		var extraClasses = "";
		var controls = "controls='controls' ";
		var autoplay = "";
		var loop = "";
		var style = "";
		
		if(options){
			if(options['elId']){
				elId = "id='"+options['elId']+"'";
			}
			if(options['extraClasses']){
				extraClasses = extraClasses + options['extraClasses'];
			}
			if(options.controls === false){
				controls = "";
			}
			if(typeof options.autoplay != "undefined"){
				autoplay = "autoplayonslideenter='" + options.autoplay + "' ";
			}
			if(options['loop'] === true){
				loop = "loop='loop' ";
			}
			if(options['style']){
				style = "style='" + options['style'] + "' ";
			}
		}

		var audio = "<audio " + elId + " class='" + extraClasses + "' preload='metadata' " + controls + autoplay + loop + style + ">";
		$.each(sources, function(index, source){
			if(typeof source.src == "string"){
				var mimeType = (source.mimeType)?"type='" + source.mimeType + "' ":"";
				audio = audio + "<source src='" + source.src + "' " + mimeType + ">";
			}	
		});

		if(sources.length>0){
			audio = audio + "<p>Your browser does not support HTML5 audio.</p>";
		}

		audio = audio + "</audio>";

		return audio;
	};


	/*
	 * Utils
	 */

	var getSources = function(audioDOM){
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
		var extension = source.split('.').pop();
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
		getSources 				: getSources,
		getSourcesFromJSON		: getSourcesFromJSON,
		getAudioMimeType		: getAudioMimeType
	};

})(VISH,jQuery);