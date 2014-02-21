VISH.Editor.Audio.HTML5 = (function(V,$,undefined){

	var init = function(){	
	};

	var drawAudioWithWrapper = function(audioTag){
		var sources = V.Audio.HTML5.getSources(audioTag);
		if(sources.length > 0){
			var options = {};
			drawAudio(sources,options);
		}
	};

	var drawAudioWithUrl = function (url){
		drawAudio([{src: url}]);
	};

	var drawAudio = function(sources,options,area,style){
		var current_area;
		if(area){
			current_area = area;
		}	else {
			current_area = V.Editor.getCurrentArea();
		}

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
		current_area.attr('type','audio');

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
			
		$(sources).each(function(index, source){
			var audioSource = document.createElement('source');
			audioSource.setAttribute('src', source.src);
			if(source.mimeType){
				audioSource.setAttribute('type', source.mimeType);
			} else {
				audioSource.setAttribute('type', V.Audio.HTML5.getAudioMimeType(source.src));
			}
			$(audioTag).append(audioSource);
		});

		var fallbackText = document.createElement('p');
		$(fallbackText).html("Your browser does not support HTML5 audio.");
		$(audioTag).append(fallbackText);

		$(current_area).html("");
		$(current_area).append(audioTag);

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
