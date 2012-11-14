VISH.LocalStorage = (function(V,$,undefined){
	/*This class manages the localStorage*/


	var addPresentation = function(presentation){
		if(typeof(Storage)!=="undefined")
		{
			// Yes! localStorage and sessionStorage support!
		 	//get the array of presentations with their ids, i.e. {[1], [6], [78]}
		 	var list = localStorage.getItem("presentation_list") ? JSON.parse(localStorage.getItem("presentation_list")) : new Array();
		 	if($.inArray(presentation.id, list) === -1){
		 		list.push(presentation.id);
		 		localStorage.setItem("presentation_list", JSON.stringify(list));
		 	}
		 	//save the presentation, we save the full json in case we need info about the slides in the future
		 	localStorage.setItem("presentation_"+presentation.id, JSON.stringify(presentation));
		 	//save also its URL, because we have the object id but the URL is composed with the excursion id
		 	localStorage.setItem("presentation_"+presentation.id+"_url", window.location.href);
		 	if(presentation.avatar !== undefined){
		 		_saveImage(presentation.avatar);
		 	}
		}
		else
		{
			// Sorry! No web storage support..
		  	V.Debugging.log("Sorry! No web storage support.");
		}
	};

	//method to store an image in the localstorage
	var _saveImage = function(path){
		//save in localstorage only if path is relative, for now, we can't save there flickr images (we have 5MB max for everything)
		if(localStorage.getItem(path) === null && !path.match(/^http/)){
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			var img = new Image();
			img.src = path;
			img.onload = function () {
			    canvas.width = this.width;
			    canvas.height = this.height;
			    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
			    var name = img.src.replace(/http:\/\/[^\/]+/i, ""); //remove the domain name
			    localStorage.setItem(name, canvas.toDataURL());
			};
		}
	}


	return {
		addPresentation        : addPresentation		
	};

}) (VISH,jQuery);
