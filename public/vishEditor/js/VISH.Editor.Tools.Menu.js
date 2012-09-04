VISH.Editor.Tools.Menu = (function(V,$,undefined){

	var init = function(){
		//Add listeners to menu buttons
		$.each($("img.toolbar_icon"), function(index, toolbarButton) {
			$(toolbarButton).on("click", function(event){
				if(typeof VISH.Editor.Tools[$(toolbarButton).attr("action")] == "function"){
					VISH.Editor.Tools[$(toolbarButton).attr("action")](this);
				}
			});
		});
	}
  



	return {
		init							: init
	};

}) (VISH, jQuery);