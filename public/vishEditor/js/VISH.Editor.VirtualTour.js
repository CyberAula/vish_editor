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

	var getSlideset = function(id){
		return getVirtualTour(id);
	}

	var preCopyActions = function(){
		// console.log("VTour precopy");
	}

	var postCopyActions = function(){
		// console.log("VTour postcopy");
	}

	return {
		init 				 	: init,
		addVirtualTour 			: addVirtualTour,
		getVirtualTour 			: getVirtualTour,
		hasVirtualTours 		: hasVirtualTours,
		getSlideset				: getSlideset,
		preCopyActions			: preCopyActions,
		postCopyActions			: postCopyActions
	};

}) (VISH, jQuery);