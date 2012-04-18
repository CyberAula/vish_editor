VISH.AppletPlayer = (function(){
	
	/**
	 * Function to add an applet element to the slide
	 * the applet is inside the archive, width, height and params attributes of the div
	 */
	var loadApplet = function(element){
		$.each(element.children('.appletelement'),function(index,value){
			var toAppend = "<applet code='"+$(value).attr('code')+"' width='"+$(value).attr('width')+"' height='"+$(value).attr('height')+"' archive='"+$(value).attr('archive')+"'>"+$(value).attr('params')+"</applet>";
			$(value).html(toAppend);
		});
	};
	
	
	/**
	 * Function to remove the applets of the presentation
	 */
	var unloadApplet = function(element){
		$('.appletelement applet').remove();
	}

	return {
		loadApplet:loadApplet,
		unloadApplet:unloadApplet
	};

})(VISH,jQuery);