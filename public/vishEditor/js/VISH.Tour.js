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
			 'postRideCallback' : _onTourFinish,
			 'postStepCallback'	: _onStepFinish,
			 'onInitCallback'	: _onInit
		});
	};

	var _onInit = function(){
	};

	var _onStepFinish = function(count){
		_adjustMaxHeightOfCurrentTour();
	};

	var _onTourFinish = function(el){
		_clean();
	};

	var _clean = function(){
		$('.joyride-tip-guide').each(function(){
			$(this).remove();
		});
	};

	var getCurrentTour = function(){
		var currentJoyride = $(".joyRideCurrent");
		if(currentJoyride.length>0){
			return currentJoyride;
		}
	};

	var _adjustMaxHeightOfCurrentTour = function(){
		var currentJoyride = getCurrentTour();
		if(typeof currentJoyride != "undefined"){
			var joyRideParent = $(currentJoyride).parent();
			var joyRideWrapper = $(currentJoyride).find(".joyride-content-wrapper");

			var top = $(currentJoyride).cssNumber("top");
			var paddingTop = $(joyRideWrapper).cssNumber("padding-top");
			var paddingBottom = $(joyRideWrapper).cssNumber("padding-bottom");

			var outerPercentage = (top+paddingTop+paddingBottom)*100/($(joyRideParent).width());
			var maxHeightPercentage = Math.floor(100-outerPercentage);

			//Add 1.5% extra margin
			if(maxHeightPercentage > 1.5){
				maxHeightPercentage = maxHeightPercentage-1.5;
			}

			$(currentJoyride).css("max-height",maxHeightPercentage + "%");

			if(top===0){
				//Center vertical
				var currentHeightPercentage = ($(currentJoyride).height()*100)/($(window).height());
				currentHeightPercentage = Math.min(currentHeightPercentage,maxHeightPercentage);
				var topPorcentage = (100 - currentHeightPercentage)/2;
				$(currentJoyride).css("top",topPorcentage + "%");
			}
		}
	};
	
	return {
		startTourWithId   : startTourWithId,
		getCurrentTour	  : getCurrentTour
	};

}) (VISH, jQuery);