VISHWS.CORE = (function(V,$,undefined){

	var initAll = function(){
		VISHWS.VALIDATION.init();
		//[Init all submodules...]
	};
		
	return {
		initAll : initAll
	};

}) (VISHWS, jQuery);