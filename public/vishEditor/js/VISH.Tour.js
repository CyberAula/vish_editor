VISH.Tour = (function(V,$,undefined){
		
	/**
	 * Function to start a tutorial
	 * tipLocation can be 'top' or 'bottom' in relation to parent element
	 */
	var startTourWithId = function(helpid, tipLocation){
		_clean();
		var loc;
		if(tipLocation === undefined){
			loc = "top";
		} else {
			loc = tipLocation;
		}

		$(window).joyride({
			 'tipLocation'		: loc,
			 'tipContent'		: '#' + helpid,
			 'postRideCallback' : _afterShowTour
		});
	};
	
	var _afterShowTour = function(el){
		_clean();
	};

	var _clean = function(){
		$('.joyride-tip-guide').each(function(){
			$(this).remove();
		});
	}

	var getCurrentTour = function(){
		var currentJoyride = $(".joyRideCurrent");
		if(currentJoyride.length>0){
			return currentJoyride;
		}
	}
	
	return {
		startTourWithId   : startTourWithId,
		getCurrentTour	  : getCurrentTour
	};

}) (VISH, jQuery);