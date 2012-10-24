VISH.LocalStorage = (function(V,$,undefined){
	/*This class manages the localStorage*/


	var addPresentation = function(presentation){
		if(typeof(Storage)!=="undefined")
		{
			// Yes! localStorage and sessionStorage support!
		 	//get the array of presentations with their ids, i.e. {[1], [6], [78]}
		 	var list = localStorage.getItem("presentation_list") ? JSON.parse(localStorage.getItem("presentation_list")) : new Array();
		 	if($.inArray(presentation.id, list) === -1){
		 		list.push(presentation.id);
		 		localStorage.setItem("presentation_list", JSON.stringify(list));
		 	}
		 	//save the presentation, we save the full json in case we need info about the slides in the future
		 	localStorage.setItem("presentation_"+presentation.id, JSON.stringify(presentation));

		}
		else
		{
			// Sorry! No web storage support..
		  	V.Debugging.log("Sorry! No web storage support.");
		}
	};


	return {
		addPresentation        : addPresentation		
	};

}) (VISH,jQuery);
