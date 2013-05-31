VISH.Tour = (function(V,$,undefined){
		
	/**
	 * function to start a walkme tour witht he help "ol" id given
	 * tipLocation can be 'top' or 'bottom' in relation to parent element
	 */
	var startTourWithId = function(helpid, tipLocation){
		clear();
		var loc;
		if(tipLocation === undefined){
			loc = "top";
		}
		else{
			loc = tipLocation;
		}
		$(window).joyride({
			 'tipLocation'		: loc,
			 'tipContent'		: '#' + helpid,
			 'postRideCallback' : V.Tour.clear	 
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