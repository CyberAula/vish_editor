VISH.Editor.Object.Flash = (function(V,$,undefined){
	
	
	var drawFlashObjectWithSource = function(src){
	  var current_area = VISH.Editor.getCurrentArea();
	  var template = VISH.Editor.getTemplate();

	  var nextFlashId = VISH.Utils.getId();
	  var idToDrag = "draggable" + nextFlashId;
	  var idToResize = "resizable" + nextFlashId;
	  current_area.attr('type','object');
	   
	  var embedDiv = document.createElement('div');
	  embedDiv.setAttribute('id', idToDrag);
	  $(embedDiv).addClass('object_wrapper');
	  $(embedDiv).addClass(template + "_object");
	  
	  var embedTag = document.createElement('embed');
	  embedTag.setAttribute('id', idToResize );
	  embedTag.setAttribute('class', template + "_object");
	  embedTag.setAttribute('src', src);
	  embedTag.setAttribute('wmode', 'opaque');
	  $(embedDiv).append(embedTag); 
	  
	  $(current_area).html("");
	  $(current_area).append(embedDiv);
	  	    
	  VISH.Editor.addDeleteButton($(current_area));
	  
	  var value = 10; //we set it to the maximum value
	  var mystep = $(current_area).width()/10; //the step to multiply the value
	    	
	  //RESIZE
	  $("#menubar").before("<div id='sliderId"+nextFlashId+"' class='theslider'><input id='imageSlider"+nextFlashId+"' type='slider' name='size' value='"+value+"' style='display: none; '></div>");
	            
	  $("#imageSlider"+nextFlashId).slider({
	    from: 1,
	    to: 10,
	    step: 0.2,
	    round: 1,
	    dimension: "x",
	    skin: "blue",
	    onstatechange: function( value ){
	      VISH.Editor.Object.resizeObject(idToResize, mystep*value);
	    }
	  });

	  $("#" + idToDrag).draggable({cursor: "move"});
	}
			
	return {
		drawFlashObjectWithSource : drawFlashObjectWithSource
	};

}) (VISH, jQuery);
