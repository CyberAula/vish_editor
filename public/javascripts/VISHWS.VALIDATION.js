VISHWS.VALIDATION = (function(V,$,undefined){
	
	var init = function(){
	}

	var validateSignIn = function(name,password){
		if(!_validateString(name)){
			return false;
		}
		if(!_validateString(password)){
			return false;
		}

		return true;
	}

	var validateSignUp = function(name,password,confirmedPassword){
		if(!_validateString(name)){
			return false;
		}
		if(!_validateString(password)){
			return false;
		}
		if(!_validateString(confirmedPassword)){
			return false;
		}
		if(password!=confirmedPassword){
			return false;
		}

		return true;
	}

	var _validateString = function(string){
		if(!string){
			return false;
		}
		if(string.trim()==""){
			return false;
		}
		return true;
	}
		
		
	return {
		init            : init,
		validateSignIn  : validateSignIn,
		validateSignUp 	: validateSignUp
	};

}) (VISHWS, jQuery);