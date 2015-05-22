VISH.Object.Webapp.Handler = (function(V,$,undefined){

	var init = function(){
	};

	var onSetScore = function(score,iframe){
		V.Debugging.log("onSetScore called");
		console.log(score);
		console.log(iframe);
		//TODO
		return;
	};


	return {
		init				: init,
		onSetScore 			: onSetScore
	};

}) (VISH, jQuery);