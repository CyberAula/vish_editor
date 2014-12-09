VISH.Quiz.API = (function(V,$,undefined){
	
	// URL in the form: "http://localhost:3000/quiz_sessions/"
	var ARS_API_RootURL;

	// Just for developping
	var getResultsCount = 0;

	var init = function(ARS_API){
		if((typeof ARS_API == "object")&&(typeof ARS_API.rootURL == "string")){
			ARS_API_RootURL = ARS_API.rootURL;
		}
	};
	
   /*
	* Create new quiz session
	* Server responds with a quiz_session JSON object including the quiz session id
	*/
	var startQuizSession = function(quizDOM,quizJSON,successCallback, failCallback){
		if(V.Configuration.getConfiguration().mode===V.Constant.VISH){
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
		} else if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){
			var quizSessionId = Math.ceil(10000*(1+Math.random())).toString();
			var url = ARS_API_RootURL + quizSessionId;
			var quiz_session = {id: quizSessionId, url: url};
			
			if((typeof successCallback=="function")&&(typeof failCallback=="function")){
				setTimeout(function(){
					// failCallback(quizDOM,"error");
					successCallback(quizDOM,quiz_session);
				},1000);
			}
		}
	};

   /*
	* Close opened quiz session
	*/
	var closeQuizSession = function(quizSessionId,name,successCallback,failCallback){

		if(V.Configuration.getConfiguration()["mode"]==V.Constant.VISH){

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
		} else if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){

			// var params = {
			// 	"id": quizSessionId, 
			// 	"authenticity_token" : V.User.getToken() 
			// }
			// if(typeof name == "string"){
			// 	params["name"] = name;
			// }
			// V.Debugging.log(params)

			var data = {"processed":"true"};
			if((typeof successCallback=="function")&&(typeof failCallback=="function")){
				setTimeout(function(){
					successCallback(data);
					// failCallback();
				},1000);
			}
		}
	};

   /*
	* Delete opened quiz session
	*/
	var deleteQuizSession = function(quizSessionId,successCallback,failCallback){
		if(V.Configuration.getConfiguration()["mode"]==V.Constant.VISH){

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

		} else if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){
			var data = {"processed":"true"};
			if(typeof successCallback=="function"){
				setTimeout(function(){
					successCallback(data);
				},1000);
			}
		}
	};

	/**
	 * GET /quiz_sessions/X/results.json.
	 */
	var getResults = function(quizSessionId, successCallback, failCallback){
		if(V.Configuration.getConfiguration()["mode"]==V.Constant.VISH){

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
		} else if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){
			//Test

			//Empty
			var data;
			if(getResultsCount<1){
				//Empty data
				data = [];
			} else if(getResultsCount<3){
				data = [{"answer":"[{\"answer\":\"Lorem ipsum dolor si amet one.\"}]","created_at":"2013-11-28T13:24:14Z","id":62,"quiz_session_id":50}];	
			} else {
				data = [{"answer":"[{\"answer\":\"Lorem ipsum dolor si amet one.\"}]","created_at":"2013-11-28T13:24:14Z","id":62,"quiz_session_id":50},{"answer":"[{\"answer\":\"Proin in blandit odio. Mauris placerat sollicitudin urna, at malesuada odio rhoncus eget.\"}]","created_at":"2013-11-28T13:24:14Z","id":63,"quiz_session_id":50},{"answer":"[{\"answer\":\"Aenean imperdiet tortor arcu, at congue sapien aliquam a.\"}]","created_at":"2013-11-28T13:24:14Z","id":64,"quiz_session_id":50}];
			}
			getResultsCount++;

			// MC (Multiple Choice)
			// var data = [{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"}]","created_at":"2013-11-28T13:24:14Z","id":62,"quiz_session_id":50},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"}]","created_at":"2013-11-28T13:24:22Z","id":63,"quiz_session_id":50},{"answer":"[{\"choiceId\":\"3\",\"answer\":\"true\"}]","created_at":"2013-11-28T13:25:13Z","id":64,"quiz_session_id":50}];

			// MC with only one result
			// var data = [{"answer":"[{\"choiceId\":\"3\",\"answer\":\"true\"}]","created_at":"2013-11-26T12:49:34Z","id":47,"quiz_session_id":31}];

			// MC Multiple answer
			// var data = [{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"true\"},{\"choiceId\":\"3\",\"answer\":\"true\"}]","created_at":"2013-11-22T17:51:20Z","id":37,"quiz_session_id":27},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"true\"},{\"choiceId\":\"3\",\"answer\":\"true\"}]","created_at":"2013-11-22T17:51:29Z","id":38,"quiz_session_id":27},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"true\"}]","created_at":"2013-11-22T17:51:35Z","id":39,"quiz_session_id":27}];

			// TF Quiz (True/False)
			// var data = [{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"false\"},{\"choiceId\":\"3\",\"answer\":\"true\"},{\"choiceId\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:10:23Z","id":30,"quiz_session_id":19},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"false\"},{\"choiceId\":\"3\",\"answer\":\"false\"},{\"choiceId\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:10:37Z","id":31,"quiz_session_id":19},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"true\"},{\"choiceId\":\"3\",\"answer\":\"false\"},{\"choiceId\":\"4\",\"answer\":\"false\"}]","created_at":"2013-05-13T13:10:52Z","id":32,"quiz_session_id":19},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"false\"},{\"choiceId\":\"3\",\"answer\":\"true\"},{\"choiceId\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:11:09Z","id":33,"quiz_session_id":19},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"false\"},{\"choiceId\":\"3\",\"answer\":\"true\"},{\"choiceId\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:11:41Z","id":34,"quiz_session_id":19}];
			
			// Sorting Quiz
			// var data = [{"answer":"[{\"choiceId\":\"2\",\"answer\":2},{\"choiceId\":\"1\",\"answer\":1},{\"choiceId\":\"3\",\"answer\":3},{\"selfAssessment\":{\"result\":true}}]","created_at":"2013-11-26T12:49:34Z","id":47,"quiz_session_id":31},{"answer":"[{\"choiceId\":\"2\",\"answer\":1},{\"choiceId\":\"1\",\"answer\":2},{\"choiceId\":\"3\",\"answer\":3},{\"selfAssessment\":{\"result\":false}}]","created_at":"2013-11-26T12:49:34Z","id":48,"quiz_session_id":31}];
			
			// Open Ended Quiz
			// var data = [{"answer":"[{\"answer\":\"Lorem ipsum dolor si amet one.\"}]","created_at":"2013-11-28T13:24:14Z","id":62,"quiz_session_id":50},{"answer":"[{\"answer\":\"Proin in blandit odio. Mauris placerat sollicitudin urna, at malesuada odio rhoncus eget.\"}]","created_at":"2013-11-28T13:24:14Z","id":63,"quiz_session_id":50},{"answer":"[{\"answer\":\"Aenean imperdiet tortor arcu, at congue sapien aliquam a.\"}]","created_at":"2013-11-28T13:24:14Z","id":64,"quiz_session_id":50}];

			if(typeof successCallback=="function"){
				setTimeout(function(){
					successCallback(data);
				},1000);
			}
		}
	};

	/**
	 * Send answers for real time quizzes
	 * PUT /quiz_sessions/X
	 */
	var sendAnwers = function(answers, quizSessionId, successCallback, failCallback){
		if(V.Configuration.getConfiguration().mode===V.Constant.VISH){
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

			 return null;
		} else {
			if(typeof successCallback=="function"){
				setTimeout(function(){
					successCallback();
				},1000);
			}
		}
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