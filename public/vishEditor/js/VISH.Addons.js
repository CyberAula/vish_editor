VISH.Addons = (function(V,undefined){

	var init = function(addons){
		if(typeof addons === "object"){
			for(var i=0; i<addons.length; i++){
				var targeted = ((V.Editing)&&(addons[i].target===V.Constant.Edit))||((!V.Editing)&&(addons[i].target===V.Constant.Viewer))||(addons[i].target===V.Constant.AnyMode);
				if(targeted){
					if((typeof V.Addons[addons[i].id] !== "undefined")&&(typeof V.Addons[addons[i].id].init === "function")){
						V.Addons[addons[i].id].init(addons[i].config);
					}
				}
			}
		}
	}

	return {
		init 	: init
	};

}) (VISH, jQuery);