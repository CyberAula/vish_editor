VISH.SWFPlayer = (function(){
	
	var loadSWF = function(element){
		$.each(element.children('.swfelement'),function(index,value){
			$(value).append("<embed src='"+$(value).attr('src')+"' class='"+$(value).attr('templateclass')+"' />");
		});
	};

	var unloadSWF = function(element){
		$('.swfelement embed').remove();
	}

	return {
		loadSWF:loadSWF,
		unloadSWF:unloadSWF
	};

})(VISH,jQuery);