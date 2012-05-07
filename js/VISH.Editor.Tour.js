VISH.Editor.Tour = (function(V,$,undefined){
		
	/**
	 * function to start a walkme tour witht he help "ol" id given
	 */
	var startTourWithId = function(helpid){
		$(window).joyride({
			 'tipContent': '#' + helpid,
			 'postRideCallback': VISH.Editor.Tour.clear()			 
		});
	};
	
	var clear = function(){
		$('.joyride-tip-guide').each(function()
		{
			$(this).remove();
		});
	};
	
	
	return {
		clear             : clear,
		startTourWithId   : startTourWithId
	};

}) (VISH, jQuery);
