VISH.Recommendations = (function(V,$,undefined){

	var url_to_get_recommendations;
	var username;
	var presentation_id;
	var generated;


	/**
	 * Function to initialize the Recommendations
	 */
	var init = function(options){
		if(options && options["urlToGetRecommendations"]){
			url_to_get_recommendations = options["urlToGetRecommendations"];
			username = options["username"];
			presentation_id = V.SlideManager.getCurrentPresentation().id;
		}
		generated = false;

	};

	/**
	 * function to call ViSH via AJAX to get recommendation of excursions
	 */
	var generateFancybox = function(){
		if(!generated){
			console.log("username " + username + " id " + presentation_id);
			generated = true;
		}
	};


	return {
		init          			: init,
		generateFancybox		: generateFancybox
	};

}) (VISH,jQuery);