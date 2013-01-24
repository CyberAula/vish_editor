VISH.ImagePlayer = (function(){
	
	/**
	 * Function to reload a gifs in the slide for Mobile devices
	 */
	var reloadGifs = function(slide){
		var imgs = $(slide).find("img");
		$.each(imgs,function(index,img){
			var ext = VISH.Object.getExtensionFromSrc($(img).attr("src"));
			if(ext === "gif"){
				//Reload
				$(img).attr("src",$(img).attr("src"));
			}
		});
	};

	return {
		reloadGifs	: 	reloadGifs
	};

})(VISH,jQuery);