VISH.Quiz.API = (function(V,$,undefined){
	
	// URL in the form: "http://localhost:3000/quiz_sessions/"
	var ARS_API_RootURL;

	var init = function(ARS_API){
		if((typeof ARS_API == "object")&&(typeof ARS_API.rootURL == "string")){
			ARS_API_RootURL = V.Utils.checkUrlProtocol(ARS_API.rootURL);
		}
		if(V.Debugging.isDevelopping()){
			V.Quiz.API.Development.init(ARS_API);
		}
	};
	
   /*
	* Create new quiz session
	* Server responds with a quiz_session JSON object including the quiz session id
	*/
	var startQuizSession = function(quizDOM,quizJSON,successCallback, failCallback){
		if(V.Debugging.isDevelopping()){
			return V.Quiz.API.Development.startQuizSession(quizDOM,quizJSON,successCallback, failCallback);
		}


		var send_type = 'POST';

		var params = {
		  "quiz": JSON.stringify(quizJSON),
		  "authenticity_token" : V.User.getToken()
		}

		$.ajax({
			type    : send_type,
			url     : ARS_API_RootURL,
			data    : params,
			success : function(data) {
				if(typeof successCallback=="function"){
					successCallback(quizDOM,data);
				}
			},
			error: function(error){
				if(typeof failCallback=="function"){
					failCallback(quizDOM,error);
				}
			}
		});
	};

   /*
	* Close opened quiz session
	*/
	var closeQuizSession = function(quizSessionId,name,successCallback,failCallback){
		if(V.Debugging.isDevelopping()){
			return V.Quiz.API.Development.closeQuizSession(quizSessionId,name,successCallback,failCallback);
		}

		var send_type = 'GET';
		var params = {
			"id": quizSessionId, 
			"authenticity_token" : V.User.getToken() 
		}

		if((typeof name == "string")&&(name.trim()!="")){
			params["name"] = name;
		}

		$.ajax({
			type    : send_type,
			url     : ARS_API_RootURL + quizSessionId + '/close',
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

   /*
	* Delete opened quiz session
	*/
	var deleteQuizSession = function(quizSessionId,successCallback,failCallback){
		if(V.Debugging.isDevelopping()){
			return V.Quiz.API.Development.deleteQuizSession(quizSessionId,successCallback,failCallback);
		}

		var send_type = 'GET';
		var params = {
			"id": quizSessionId, 
			"authenticity_token" : V.User.getToken()
		}

		$.ajax({
			type    : send_type,
			url     : ARS_API_RootURL + quizSessionId + '/delete',
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

	/**
	 * GET /quiz_sessions/X/results.json.
	 */
	var getResults = function(quizSessionId, successCallback, failCallback){
		if(V.Debugging.isDevelopping()){
			return V.Quiz.API.Development.getResults(quizSessionId, successCallback, failCallback);
		}

		var send_type = 'GET';
		var params = {
			"id": quizSessionId
		}

		if(V.User.isLogged()){
			params["authenticity_token"] = V.User.getToken();
		}

		$.ajax({
			type    : send_type,
			url     : ARS_API_RootURL + quizSessionId + '/results.json',
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

	/**
	 * Send answers for real time quizzes
	 * PUT /quiz_sessions/X
	 */
	var sendAnwers = function(answers, quizSessionId, successCallback, failCallback){
		if(V.Debugging.isDevelopping()){
			return V.Quiz.API.Development.sendAnwers(answers, quizSessionId, successCallback, failCallback);
		}

		var send_type = 'POST';

		var params = {
			"id": quizSessionId,
			"answers": JSON.stringify(answers)
		}

		if(V.User.isLogged()){
			params["authenticity_token"] = V.User.getToken();
		}

		$.ajax({
			type    : send_type,
			url     : ARS_API_RootURL + quizSessionId + '/answer',
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
		startQuizSession		: startQuizSession, 
		closeQuizSession		: closeQuizSession,
		deleteQuizSession		: deleteQuizSession,
		getResults 				: getResults,
		sendAnwers				: sendAnwers
	};

}) (VISH, jQuery);