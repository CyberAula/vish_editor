VISH.User = (function(V,$,undefined){

	var user; //{username: "user_name", id: "id", token: "token"}

	var init = function(options){
		user = new Object();
		if(options['username']) {
		 	user.username = options['username'];
		}
		if(options['userId']) {
		 	user.id= options['userId'];
		}
		if(options['token']){
			user.token = options['token'];
		}
	};

	var isLogged = function(){
		if((user)&&(user.token)){
			return (typeof user.token == "string");
		} else {
			return false;
		}
	};

	var getUser = function(){
		if(user){
			return user;
		} else {
			return null;
		}
	};

	var getName = function(){
		if((user)&&(user.username)){
			return user.username;
		} else {
			return null;
		}
	};

	var getId = function(){
		if((user)&&(user.id)){
			return user.id;
		} else {
			return null;
		}
	};

	var getToken = function(){
		if((user)&&(user.token)){
			return user.token;
		} else {
			return null;
		}
	};

	return {
		init:           init,
		isLogged: 		isLogged,
		getUser: 		getUser,
		getName:  		getName,
		getId: 			getId,
		getToken:   	getToken
	};
    
}) (VISH, jQuery);