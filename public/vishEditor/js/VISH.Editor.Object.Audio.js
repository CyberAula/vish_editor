VISH.Editor.Object.Audio = (function(V,$,undefined){

var init = function(){
	
};



var drawAudioWithUrl = function (url){
    drawAudio([[url,_getAudioType(url)]])
}

var _getAudioType = function(url){
	var source = (V.Object.getObjectInfo(url)).source;
    return "audio/" + source.split('.').pop();
}

var drawAudio = function(sources,options, area, style){
    var current_area;
    if(area){
        current_area = area;
    }   else {
        current_area = V.Editor.getCurrentArea();
    }


    var template = V.Editor.getTemplate(current_area);

    var nextVideoId = V.Utils.getId();
    current_area.attr('type','audio');
     
    var nextAudioId = V.Utils.getId();
    var idAudioToDragAndResize = "draggable" + nextAudioId;


    var audioTag = document.createElement('audio');
    audioTag.setAttribute('controls', "controls");
    audioTag.setAttribute('draggable', true);
    audioTag.setAttribute('id', idAudioToDragAndResize);
    //audioTag.setAttribute('class', template + "_video");
    audioTag.setAttribute('title', "Click to drag");
    audioTag.setAttribute('preload', "metadata");
    if(style){
            audioTag.setAttribute('style', style);
    }
 
$(sources).each(function(index, source) {

      // Hacemos esta operación para cada una de las fuentes
      // Realmente lo que hace aquí es crear un elemento source.

     var audioSource = document.createElement('source');

      audioSource.setAttribute('src', source[0]);

		  if(source[1]){
		    audioSource.setAttribute('type', source[1]);
		  }
		  $(audioTag).append(audioSource);
    });
  
  var fallbackText = document.createElement('p');
    $(fallbackText).html("Your browser does not support HTML5 audio.");
    $(audioTag).append(fallbackText);
    
    $(current_area).html("");
    $(current_area).append(audioTag)
    
    V.Editor.addDeleteButton($(current_area));

    $("#" + idAudioToDragAndResize).draggable({cursor: "move"});

    V.Editor.Tools.loadToolsForZone(current_area);
}


	
var generateAudioPreviewWrapper = function(url){
	return "<audio class='objectPreview' controls><source src='"+ url +"'>Your browser does not support the audio element.</audio>";
}
		
  var renderAudioFromSources = function(sources){
    var rendered = "<audio class='objectPreview' preload='metadata' controls='controls'>";
    $.each(sources, function(index, source) {
       rendered = rendered + "<source src='" + source + "' " + _getAudioType(source) + ">";
    });   
    rendered = rendered + "</audio>";
    return rendered;
  };
return {
		init : init,
		generateAudioPreviewWrapper : generateAudioPreviewWrapper,
		drawAudioWithUrl		: drawAudioWithUrl,
    renderAudioFromSources : renderAudioFromSources
	};

}) (VISH, jQuery);
