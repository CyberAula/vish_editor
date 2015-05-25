VISH.Object.Webapp.Handler = (function(V,$,undefined){

	var _WAPP_TOKEN_API_URL;


	var init = function(){
		if(typeof V.Configuration.getConfiguration()["WAPP_TOKEN_API"] == "object"){
			if(typeof V.Configuration.getConfiguration()["WAPP_TOKEN_API"]["rootURL"] == "string"){
				_WAPP_TOKEN_API_URL = V.Configuration.getConfiguration()["WAPP_TOKEN_API"]["rootURL"];
			}
		}
	};

	var onWAPPConnected = function(origin,originId){
		if(V.Editing){
			V.Editor.Object.Webapp.Handler.onWAPPConnected(origin,originId);
		}
	};


	//TODO: methods implementation

	var onSetScore = function(score,iframe){
		return;
	};

	var onSetProgress = function(progress,iframe){
		return;
	};

	var onSetSuccessStatus = function(status,iframe){
		return;
	};

	var onSetCompletionStatus = function(status,iframe){
		return;
	};

	var getAuthToken = function(callback){
		_requestAuthToken(function(data){
			var token = data["token"];
			callback(token);
		});
	};

	var _requestAuthToken = function(successCallback,failCallback){

		if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){
			var _token = parseInt(Math.random()*1000000000);
			successCallback({token: _token});
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