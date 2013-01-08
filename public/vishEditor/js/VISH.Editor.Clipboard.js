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
	  		var slideToCopy = VISH.Editor.Utils.replaceIdsForSlide($(stack[0]).clone()[0]);
	  		if(typeof slideToCopy != "undefined"){
	  			VISH.Slides.copySlide(slideToCopy);
	  		}
	  		break;
	  	default:
	  		break;
	  }
	};

	return {
			init 		: init,
			copy		: copy,
			paste		: paste
	};

}) (VISH,jQuery);