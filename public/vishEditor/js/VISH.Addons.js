VISH.Addons = (function(V,undefined){

	var init = function(addons){
		if(typeof addons === "object"){
			for(var i=0; i<addons.length; i++){
				var targeted = ((VISH.Editing)&&(addons[i].target===VISH.Constant.Edit))||((!VISH.Editing)&&(addons[i].target===VISH.Constant.Viewer))||(addons[i].target===VISH.Constant.AnyMode);
				if(targeted){
					if((typeof VISH.Addons[addons[i].id] !== "undefined")&&(typeof VISH.Addons[addons[i].id].init === "function")){
						VISH.Addons[addons[i].id].init(addons[i].config);
					}
				}
			}
		}
	}

	return {
		init 	: init
	};

}) (VISH, jQuery);