/*
 *	Provides an API that allows other domains to listen to Vish Editor Events
 */
 var VISH = VISH || {};
 VISH.API = VISH.API || {};


VISH.API = (function(V,undefined){
	
	var init = function() {
		console.log("Init VISH API !");

		if (window.addEventListener){
			window.addEventListener("message", _onVishEditorMessage, false);
		} else if (el.attachEvent){
			window.attachEvent("message", _onVishEditorMessage);
		}
	};

	var _onVishEditorMessage = function(message){
		console.log("_onVishEditorMessage received");
		console.log(message);
		console.log(message.origin);
		console.log(message.data);
	}

	//API Methods
	
	var action = new Object();
	//Code here...

	var goToSlide = function(slideNumber){
		$("#presentation_iframe").postMessage("goToSlide",'*');
	}
	
	return {
			init 		: init
	};

}) (VISH);