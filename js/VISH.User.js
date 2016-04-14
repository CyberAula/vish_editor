VISH.User = (function(V,$,undefined){

	var _user; //{name: "user_name", id: "id", token: "token"}


	var init = function(options){
		var userOptions = {};
		if(typeof options == "object"){
			userOptions = options['user'];
		}
		setUser(userOptions);
	};

	var getUser = function(){
		if(Object.keys(_user).length > 0){
			return _user;
		} else {
			return undefined;
		}
	};

	var setUser = function(userObject){
		if(typeof userObject == "object"){
			_user = userObject;
		} else {
			_user = {};
		}

		var options = V.Utils.getOptions();
		if(options.scorm===true){
			if(typeof _user['token'] != "undefined"){
				//SCORM do not allow user token on option params
				delete _user['token'];
			}
		}
	};

	var isLogged = function(){
		return ((_user)&&(typeof _user['token'] == "string")&&(_user['id']));
	};

	var getName = function(){
		return _user['name'];
	};

	var getId = function(){
		return _user['id'];
	};

	var getToken = function(){
		return _user['token'];
	};

	return {
		init: 			init,
		getUser: 		getUser,
		setUser: 		setUser,
		isLogged: 		isLogged,
		getName:  		getName,
		getId: 			getId,
		getToken: 		getToken
	};
	
}) (VISH, jQuery);