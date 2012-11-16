VISH.Editor.Clipboard = (function(V,$,undefined){

	var stack;

	var init = function() {
		stack = [null,null];
	};

	var copy = function(element,type) {
		if(element){
			stack[0] = $(element).clone();
			stack[1] = type;
		}
	};

	var paste = function() {
	  if(!stack[0]){
	  	return;
	  }	

	  switch(stack[1]){
	  	case VISH.Constant.Clipboard.Slide:
	  		var slideToCopy = _rewriteIds($(stack[0]).clone());
	  		VISH.Slides.copySlide(slideToCopy);
	  		break;
	  	default:
	  		break;
	  }
	};
	

	var _rewriteIds = function(parentElement){
		var ids_pattern = /unicID_[0-9]+/g
		$(parentElement).attr("id",VISH.Utils.getId());
		$(parentElement).find("[id]").each(function(index,element){
			var id = $(element).attr("id")
			var unicIDToReplace = ids_pattern.exec(id)
			if(unicIDToReplace!=null){
				var newId = $(element).attr("id").replace(unicIDToReplace,VISH.Utils.getId());
				$(element).attr("id",newId);
			}
		});
		return parentElement;
	}

	return {
			init 		: init,
			copy		: copy,
			paste		: paste
	};

}) (VISH,jQuery);