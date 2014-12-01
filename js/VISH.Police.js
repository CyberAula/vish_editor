VISH.Police = (function(V,$,undefined){
	
	var init = function(){
	};
	
	var validateObject = function(object,callback){

		if(!object){
			return [false,"Object is null or undefined"];
		}
		
		if((typeof object == "string")&&(object.trim()=="")){
			return [false,"Object is an empty string"];
		}

		var objectInfo = V.Object.getObjectInfo(object);
		
		if(!objectInfo){
			return [false,"Can't get Object info"];
		}
				
		if((!objectInfo.source)||(!objectInfo.type)){
			return [false,"Can't recognize object source"];
		}
		
		if(typeof objectInfo.source == "string"){
			if(objectInfo.source.trim()==""){
				return [false,"Object source is an empty string"];
			}
		} else if(typeof objectInfo.source == "object"){
			if(objectInfo.source.length<1){
				return [false,"Object source is an empty object"];
			}
		} else {
			return [false,"Invalid object source"];
		}

		// var valid_url_pattern=/((http(s)?:\/\/)|(www[.]))(.*)/g
//		if(objectInfo.source.match(valid_url_pattern)==null){
//      	return [false,"Not valid URL"];
//    	}
		
		//Add more conditions here...
		
		//Broken links validation (Optional) 
		if(typeof callback == "function"){
			//Validation response sent in callback
			_validateUrl(objectInfo.source,callback);
		}

		return [true,"Validation Ok"];
	};
	
  	
	function _validateUrl(url,callback){
		_checkUrl(url, function(status){
			if(status === 404){
				//HTTP 404: Not found
				callback([false,"HTTP 404: Not found"]);
			} else {
				callback([true,"Validation Ok"]);
			}
		});
	};
	
	function _checkUrl(url, cb){
		jQuery.ajax({
			url:      url,
			dataType: 'text',
			type:     'GET',
			complete:  function(xhr){
				if(typeof cb === 'function'){
					cb.apply(this, [xhr.status]);
				}  
			}
		});
	};

	var validateFileUpload = function(fileName){
		if(!fileName){
			return [false,"Name is null or undefined"];
		}
		if(fileName.trim()==""){
			return [false,"Name is an empty string"];
		}
		return [true,"Validation Ok"];
	};
	
	return {
		init            	: init,
		validateObject  	: validateObject,
		validateFileUpload 	: validateFileUpload
	};

}) (VISH, jQuery);
