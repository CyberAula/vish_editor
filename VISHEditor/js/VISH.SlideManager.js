VISH.SlideManager = (function(V,$,undefined){
	
	var init = function(slides){
		V.Excursion.init(slides);

		$('article').on('slideenter',_onslideenter);
		$('article').on('slideleave',_onslideleave);
	};

	var _onslideenter = function(e){
		setTimeout(function(){
			if($(e.target).hasClass('swf')){
				V.SWFPlayer.loadSWF($(e.target));
			}
			else if($(e.target).hasClass('applet')){
				V.AppletPlayer.loadApplet($(e.target));
			}
		},500);
	}

	var _onslideleave = function(e){
		V.SWFPlayer.unloadSWF();
		V.AppletPlayer.unloadApplet();
	}

	return {
		init : init
	};

}) (VISH,jQuery);