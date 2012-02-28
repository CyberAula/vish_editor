VISH.AppletPlayer = (function(){
	
	var loadApplet = function(element){
		$.each(element.children('.appletelement'),function(index,value){
			var toAppend = "<applet code='"+$(value).attr('code')+"' width='"+$(value).attr('width')+"' height='"+$(value).attr('height')+"' archive='"+$(value).attr('archive')+"'>"+$(value).attr('params')+"</applet>";
			$(value).append(toAppend);
		});
	};

	var unloadApplet = function(element){
		$('.appletelement applet').remove();
	}

	return {
		loadApplet:loadApplet,
		unloadApplet:unloadApplet
	};

})(VISH,jQuery);