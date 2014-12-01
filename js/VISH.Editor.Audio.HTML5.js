VISH.Editor.Audio.HTML5 = (function(V,$,undefined){

	var init = function(){	
	};

	var drawAudioWithWrapper = function(audioTag){
		var sources = V.Audio.HTML5.getSources(audioTag);
		if(sources.length > 0){
			var options = {};
			options.timestamp = true;
			drawAudio(sources,options);
		}
	};

	var drawAudioWithUrl = function(url){
		var options = {};
		options.timestamp = true;
		drawAudio([{src: url}],options);
	};

	var drawAudio = function(sources,options,area,style){
		var current_area;
		if(area){
			current_area = area;
		}	else {
			current_area = V.Editor.getCurrentArea();
		}
		current_area.attr('type','audio');

		//Default options
		var autoplay = false;
			
		//Replace defeault options if options hash is defined
		if(options){
			if(options['autoplay']){
				autoplay = options['autoplay'];
			}
		}
			
		var template = V.Editor.getTemplate(area);

		var nextAudioId = V.Utils.getId();
		var idToDragAndResize = "draggable" + nextAudioId;

		var audioTag = document.createElement('audio');
		audioTag.setAttribute('id', idToDragAndResize);
		audioTag.setAttribute('draggable', true);
		audioTag.setAttribute('class', template + "_audio");
		audioTag.setAttribute('title', "Click to drag");
		audioTag.setAttribute('controls', "controls");
		audioTag.setAttribute('preload', "metadata");
		audioTag.setAttribute('autoplayonslideenter',autoplay);
		if(style){
			audioTag.setAttribute('style', style);
		}
		
		$(current_area).html("");
		$(current_area).append(audioTag);

		//Insert sources after append audio
		V.Audio.HTML5.addSourcesToAudioTag(sources,audioTag,{timestamp:true});

		V.Editor.addDeleteButton($(current_area));

		$("#" + idToDragAndResize).draggable({cursor: "move"});

		V.Editor.Tools.loadToolsForZone(current_area);
	};


	/*
	 * Renderer
	 */
	var renderAudioFromWrapper = function(audioTag,options){
		var sources = V.Audio.HTML5.getSources(audioTag);
		if(sources.length > 0){
			var options = options || {};
			return V.Audio.HTML5.renderAudioFromSources(sources,options);
		}
	};

	var renderAudioWithURL = function(url,options){
		return V.Audio.HTML5.renderAudioFromSources([{src: url}],options);
	};


	return {
		init 						: init,
		drawAudioWithWrapper		: drawAudioWithWrapper,
		drawAudioWithUrl			: drawAudioWithUrl,
		drawAudio 					: drawAudio,
		renderAudioFromWrapper		: renderAudioFromWrapper,
		renderAudioWithURL			: renderAudioWithURL
	};

}) (VISH, jQuery);
