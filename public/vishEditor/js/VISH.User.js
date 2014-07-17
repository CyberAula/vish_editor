VISH.User = (function(V,$,undefined){

	var _user; //{name: "user_name", id: "id", token: "token"}

	var init = function(options){
		_user= {};

		if(options.scorm===true){
			//SCORM do not allow user token on option params
			delete options['user']['token'];
		}

		setUser(options['user']);
	};

	var isUser = function(){
		return !(JSON.stringify(_user) == '{}');
	}

	var isLogged = function(){
		if((_user)&&(typeof _user.token == "string")&&(_user.id)){
			return true;
		} else {
			return false;
		}
	};

	var getUser = function(){
		if(_user){
			return _user;
		} else {
			return null;
		}
	};

	var setUser = function(userObject){
		if(typeof userObject == "object") {
			_user= userObject;
		} else {
			_user= {};
		}
	};

	var getName = function(){
		if((_user)&&(_user.name)){
			return _user.name;
		} else {
			return null;
		}
	};

	var getId = function(){
		if((_user)&&(_user.id)){
			return _user.id;
		} else {
			return null;
		}
	};

	var getToken = function(){
		if((_user)&&(_user.token)){
			return _user.token;
		} else {
			return null;
		}
	};

	return {
		init:           init,
		isUser:			isUser,
		isLogged: 		isLogged,
		getUser: 		getUser,
		setUser: 		setUser,
		getName:  		getName,
		getId: 			getId,
		getToken:   	getToken
	};
    
}) (VISH, jQuery);