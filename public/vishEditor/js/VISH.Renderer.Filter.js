VISH.Renderer.Filter = (function(V,$,undefined){

	var init  = function(){
		
	}

	var allowElement = function(element){
		var device = VISH.Status.getDevice();

		if(device.desktop){

			switch(element.type){
				case "applet":
					//Disable applets
					return false;
				default:
					return true;
			}

			//Browser filtering
			//Code here...

		} else if((device.mobile)||(device.tablet)){
			//Disable content for mobile phones and tablets

			switch(element.type){
				case "object":
					var objectInfo = VISH.Object.getObjectInfo(element.body);
					if(objectInfo.type=="swf"){
						//Disable flash
						return false;
					} else if(objectInfo.type=="youtube"){
						//Explicity allow youtube videos
						return true;
					}
					break;
				case "video":
					return true;
					break;
				case "snapshot":
					return true;
					break;
				case "applet":
					return false;
				default:
					return true;
			}
		}
		//Default response: enable content
		return true;
	}


	var renderContentFiltered = function(element,template){
		return "<div id='"+element['id']+"' class='contentfiltered "+template+"_"+element['areaid']+"'><img class='"+template+"_image' src='"+VISH.ImagesPath+"advert_new_grey.png'/></div>";
	}


	return {
		init        			: init,
		allowElement			: allowElement,
		renderContentFiltered	: renderContentFiltered
	};

}) (VISH,jQuery);