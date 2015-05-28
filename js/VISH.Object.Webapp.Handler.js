VISH.Object.Webapp.Handler = (function(V,$,undefined){

	var _WAPP_TOKEN_API_URL;

	var _validOrigins = {};
	// _validOrigins["origin"] = {settings};


	var init = function(){
		if(typeof V.Configuration.getConfiguration()["WAPP_TOKEN_API"] == "object"){
			if(typeof V.Configuration.getConfiguration()["WAPP_TOKEN_API"]["rootURL"] == "string"){
				_WAPP_TOKEN_API_URL = V.Configuration.getConfiguration()["WAPP_TOKEN_API"]["rootURL"];
			}
		}
	};

	var onWAPPConnected = function(origin){
		var iframe = $("iframe[src='" + origin + "']");
		var wrapper = $(iframe).parents("div.objectelement");
		var settings = $(wrapper).attr("settings");

		if(typeof settings == "string"){
			try{
				settings = JSON.parse(settings);
				if(settings.wappAPI===true){
					_validOrigins[origin] = settings;
					_validOrigins[origin].wappId = $(iframe).attr("wappid");
				}
			} catch (e){}
		}
	};


	/*
	 * score should be a number in a 0-100 scale.
	 */
	var onSetScore = function(score,origin){
		if((typeof origin == "undefined")||(typeof _validOrigins[origin] == "undefined")||(_validOrigins[origin]["wappScore"]!=true)){
			return false; //WAPP not allowed to set score
		}

		var params = {};
		params.objectiveId = _validOrigins[origin].wappId;
		if(typeof score == "number"){
			params.score = score/100;
		}
		
		V.EventsNotifier.notifyEvent(V.Constant.Event.onNewObjectiveScore,params,false);

		return true;
	};

	var onSetProgress = function(progress,origin){
		if((typeof origin == "undefined")||(typeof _validOrigins[origin] == "undefined")||(_validOrigins[origin]["wappProgress"]!=true)){
			return false; //WAPP not allowed to set progress
		}

		return true;
	};

	var onSetSuccessStatus = function(status,origin){
		if((typeof origin == "undefined")||(typeof _validOrigins[origin] == "undefined")||(_validOrigins[origin]["wappScore"]!=true)){
			return false; //WAPP not allowed to set success status
		}

		return true;
	};

	var onSetCompletionStatus = function(status,origin){
		if((typeof origin == "undefined")||(typeof _validOrigins[origin] == "undefined")||(_validOrigins[origin]["wappProgress"]!=true)){
			return false; //WAPP not allowed to set completion status
		}

		return true;
	};

	var getAuthToken = function(callback){
		_requestAuthToken(function(data){
			var token = data["auth_token"];
			callback(token);
		});
	};

	var _requestAuthToken = function(successCallback,failCallback){

		if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){
			var _token = parseInt(Math.random()*1000000000);
			successCallback({auth_token: _token});
			return;
		}

		if(typeof _WAPP_TOKEN_API_URL != "string"){
			return;
		}

		var params = {
		  "authenticity_token" : V.User.getToken()
		}

		$.ajax({
			type    : 'GET',
			url     : _WAPP_TOKEN_API_URL,
			data    : params,
			success : function(data) {
				if(typeof successCallback=="function"){
					successCallback(data);
				}
			},
			error: function(error){
				if(typeof failCallback=="function"){
					failCallback(error);
				}
			}
		});
	};


	return {
		init					: init,
		onWAPPConnected			: onWAPPConnected,
		onSetScore 				: onSetScore,
		onSetProgress			: onSetProgress,
		onSetSuccessStatus		: onSetSuccessStatus,
		onSetCompletionStatus	: onSetCompletionStatus,
		getAuthToken			: getAuthToken
	};

}) (VISH, jQuery);