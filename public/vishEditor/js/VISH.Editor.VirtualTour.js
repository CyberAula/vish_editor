VISH.Editor.VirtualTour = (function(V,$,undefined){

	//Var to store the JSON of the inserted virtual touirs
	var myVirtualTours;
	// myVirtualTour = myVirtualTours['virtualTourIdInMyPresentation']

	var init = function(){
		// V.Editor.VirtualTour.Repository.init();
		V.Editor.VirtualTour.Creator.init();
		myVirtualTours = new Array();
	};

	var addVirtualTour = function(vt){
		if(typeof myVirtualTours !== "undefined"){
			myVirtualTours[vt.id] = vt;
		}
	}

	var getVirtualTour = function(id){
		if(typeof myVirtualTours !== "undefined"){
			return myVirtualTours[id];
		}
	}

	var hasVirtualTours = function(){
		return $("section.slides > .VirtualTour_slide[type='VirtualTour']").length>0;
	}

	return {
		init 				 	: init,
		addVirtualTour 			: addVirtualTour,
		getVirtualTour 			: getVirtualTour,
		hasVirtualTours 		: hasVirtualTours
	};

}) (VISH, jQuery);