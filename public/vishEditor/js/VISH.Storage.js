VISH.Storage = (function(V,$,undefined){

	var _initialized;
	var _testing = false;

	//Own vars
	var _isLocalStorageSupported;
	
	var init = function(){
		if(!_initialized){
			_isLocalStorageSupported = checkLocalStorageSupport();
			_initialized = true;
			if(_testing){
				clear();
				_isLocalStorageSupported = false;
			}
		}
	};


	/*
	 * Generic function to store values
	 * Persistent===false indicate that the stored value will be lost when ViSH Editor version upgrading.
	 */
	var add = function(key,value,persistent){
		if(!_initialized){
			init();
		}
		if(_isLocalStorageSupported){
			persistent = !(persistent===false);
			var myObject = {};
			myObject.value = value;
			myObject.persistent = persistent;
			myObject.version = V.VERSION;
			myObject = JSON.stringify(myObject);
			localStorage.setItem(key,myObject);
			return true;
		} else {
			return false;
		}
	}

	var get = function(key){
		if(!_initialized){
			init();
		}
		if(_isLocalStorageSupported){
			var myObject = localStorage.getItem(key);
			if(typeof myObject === "string"){
				myObject = JSON.parse(myObject);
				if((myObject)&&(myObject.value)){
					if((!myObject.persistent)&&(myObject.version)){
						if(V.Utils.isObseleteVersion(myObject.version)){
							//Obsolete value
							return undefined;
						}
					}
					return myObject.value;
				}
			}
			return undefined;
		} else {
			return undefined;
		}
	}


	//////////////
	// OFFLINE STORAGE
	/////////////

	var addPresentation = function(presentation){
		if(!_initialized){
			init();
		}
		if(_isLocalStorageSupported){
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
		} else {
			// Sorry! No web storage support.
		}
	};

	/*
	 * Method to store an image in the localstorage
	 */
	var _saveImage = function(path){
		if(!_initialized){
			init();
		}
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

	///////////////
	// UTILS
	//////////////

	var checkLocalStorageSupport = function(){
		return (typeof(Storage)!=="undefined");
	}

	var clear = function(){
		localStorage.clear();
	}

	/*
	 * In testing mode not save anything, and clear localstorage in the init
	 */
	var setTestingMode = function(bolean){
		_testing = bolean;
	}

	return {
		init						: init,
		add							: add,
		get							: get,
		addPresentation				: addPresentation,
		checkLocalStorageSupport	: checkLocalStorageSupport,
		clear 						: clear,
		setTestingMode 				: setTestingMode
	};
    
}) (VISH, jQuery);