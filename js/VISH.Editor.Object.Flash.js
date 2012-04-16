VISH.Editor.Object.Flash = (function(V,$,undefined){
	
	
	var drawFlashObjectWithSource = function(src){
		
	  var current_area = VISH.Editor.getCurrentArea();
	  var template = VISH.Editor.getTemplate();

	  var nextFlashId = VISH.Editor.getId();
	  var idToDrag = "draggable" + nextFlashId;
	  var idToResize = "resizable" + nextFlashId;
	  current_area.attr('type','swf');
	   
	  var embedDiv = document.createElement('div');
	  embedDiv.setAttribute('id', idToDrag);
	  $(embedDiv).addClass('object_wrapper')
	  $(embedDiv).addClass(template + "_swf")
	  
	  var embedTag = document.createElement('embed');
	  embedTag.setAttribute('id', idToResize );
	  embedTag.setAttribute('class', template + "_swf");
	  embedTag.setAttribute('title', "Click to drag");
	  embedTag.setAttribute('src', src);
	  $(embedDiv).append(embedTag) 
	  
	  $(current_area).html("");
	  $(current_area).append(embedDiv)
	  	    
	  VISH.Editor.addDeleteButton($(current_area));
	    	
	  //RESIZE
	  $("#menubar").before("<div id='sliderId"+nextFlashId+"' class='theslider'><input id='imageSlider"+nextFlashId+"' type='slider' name='size' value='1' style='display: none; '></div>");
	            
	  $("#imageSlider"+nextFlashId).slider({
	    from: 1,
	    to: 8,
	    step: 0.5,
	    round: 1,
	    dimension: "x",
	    skin: "blue",
	    onstatechange: function( value ){
	      VISH.Editor.Object.resizeObject(idToResize,325*value);
	    }
	  });

	  $("#" + idToDrag).draggable({cursor: "move"});
	}
			
	return {
		drawFlashObjectWithSource : drawFlashObjectWithSource
	};

}) (VISH, jQuery);
