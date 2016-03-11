/**
 * SCORM API APP
 */
var SAPI = SAPI || {};

SAPI.CORE = (function(S,undefined){

	var init = function(){
		SAPI.SCORM.init();
	};

	return {
		init : init
	};

}) (SAPI);