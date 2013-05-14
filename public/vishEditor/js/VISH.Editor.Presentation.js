VISH.Editor.Presentation = (function(V,$,undefined){

	var init = function(){
	};

	var _onConnect = function(origin){
		V.Debugging.log("Communication stablished with origin " + origin);

		VISH.IframeAPI.registerCallback("onMessage",function(VEMessage,origin){
			V.Debugging.log("onMessage from " + origin);
			V.Debugging.log(VEMessage);
		});
	}

	/*
	 * Preview a presentation to insert its slides into the current presentation
	 */
	var previewPresentation = function(presentation){
		V.Editor.Preview.preview({insertMode: true, slideNumberToPreview: 1, presentationJSON: presentation});
		VISH.IframeAPI.init({callback: _onConnect});
	}

	return {
		init 				 	: init,
		previewPresentation		: previewPresentation
	};

}) (VISH, jQuery);