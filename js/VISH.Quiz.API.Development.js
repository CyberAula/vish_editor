VISH.Quiz.API.Development = (function(V,$,undefined){
	
	// URL in the form: "http://localhost:3000/quiz_sessions/"
	var ARS_API_RootURL;

	// Just for developping
	var getResultsCount = 0;

	var init = function(ARS_API){
		if((typeof ARS_API == "object")&&(typeof ARS_API.rootURL == "string")){
			ARS_API_RootURL = V.Utils.checkUrlProtocol(ARS_API.rootURL);
		}
	};
	
   /*
	* Create new quiz session
	* Server responds with a quiz_session JSON object including the quiz session id
	*/
	var startQuizSession = function(quizDOM,quizJSON,successCallback, failCallback){
		//Developping
		var quizSessionId = Math.ceil(10000*(1+Math.random())).toString();
		var url = ARS_API_RootURL + quizSessionId;
		var quiz_session = {id: quizSessionId, url: url};
		
		if((typeof successCallback=="function")&&(typeof failCallback=="function")){
			setTimeout(function(){
				// failCallback(quizDOM,"error");
				successCallback(quizDOM,quiz_session);
			},1000);
		}
		return;
	};

   /*
	* Close opened quiz session
	*/
	var closeQuizSession = function(quizSessionId,name,successCallback,failCallback){
		var data = {"processed":"true"};
		if((typeof successCallback=="function")&&(typeof failCallback=="function")){
			setTimeout(function(){
				successCallback(data);
				// failCallback();
			},1000);
		}
		return;
	};

   /*
	* Delete opened quiz session
	*/
	var deleteQuizSession = function(quizSessionId,successCallback,failCallback){
		var data = {"processed":"true"};
		if(typeof successCallback=="function"){
			setTimeout(function(){
				successCallback(data);
			},1000);
		}
		return;
	};

	var getResults = function(quizSessionId, successCallback, failCallback){
		//Test
		//MC (Multiple Choice)
		var mc_data = [{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"}]","created_at":"2013-11-28T13:24:14Z","id":62,"quiz_session_id":50},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"}]","created_at":"2013-11-28T13:24:22Z","id":63,"quiz_session_id":50},{"answer":"[{\"choiceId\":\"3\",\"answer\":\"true\"}]","created_at":"2013-11-28T13:25:13Z","id":64,"quiz_session_id":50}];

		//MC with only one result
		var mc_one_data = [{"answer":"[{\"choiceId\":\"3\",\"answer\":\"true\"}]","created_at":"2013-11-26T12:49:34Z","id":47,"quiz_session_id":31}];

		//MC Multiple answer
		var mcm_data = [{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"true\"},{\"choiceId\":\"3\",\"answer\":\"true\"}]","created_at":"2013-11-22T17:51:20Z","id":37,"quiz_session_id":27},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"true\"},{\"choiceId\":\"3\",\"answer\":\"true\"}]","created_at":"2013-11-22T17:51:29Z","id":38,"quiz_session_id":27},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"true\"}]","created_at":"2013-11-22T17:51:35Z","id":39,"quiz_session_id":27}];

		//TF Quiz (True/False)
		var tf_data = [{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"false\"},{\"choiceId\":\"3\",\"answer\":\"true\"},{\"choiceId\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:10:23Z","id":30,"quiz_session_id":19},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"false\"},{\"choiceId\":\"3\",\"answer\":\"false\"},{\"choiceId\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:10:37Z","id":31,"quiz_session_id":19},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"true\"},{\"choiceId\":\"3\",\"answer\":\"false\"},{\"choiceId\":\"4\",\"answer\":\"false\"}]","created_at":"2013-05-13T13:10:52Z","id":32,"quiz_session_id":19},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"false\"},{\"choiceId\":\"3\",\"answer\":\"true\"},{\"choiceId\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:11:09Z","id":33,"quiz_session_id":19},{"answer":"[{\"choiceId\":\"1\",\"answer\":\"true\"},{\"choiceId\":\"2\",\"answer\":\"false\"},{\"choiceId\":\"3\",\"answer\":\"true\"},{\"choiceId\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:11:41Z","id":34,"quiz_session_id":19}];
		
		//Sorting Quiz
		var s_data = [{"answer":"[{\"choiceId\":\"2\",\"answer\":2},{\"choiceId\":\"1\",\"answer\":1},{\"choiceId\":\"3\",\"answer\":3},{\"selfAssessment\":{\"result\":true}}]","created_at":"2013-11-26T12:49:34Z","id":47,"quiz_session_id":31},{"answer":"[{\"choiceId\":\"2\",\"answer\":1},{\"choiceId\":\"1\",\"answer\":2},{\"choiceId\":\"3\",\"answer\":3},{\"selfAssessment\":{\"result\":false}}]","created_at":"2013-11-26T12:49:34Z","id":48,"quiz_session_id":31}];
		
		//Open Ended Quiz
		var o_data = [{"answer":"[{\"answer\":\"Lorem ipsum dolor si amet one.\"}]","created_at":"2013-11-28T13:24:14Z","id":62,"quiz_session_id":50},{"answer":"[{\"answer\":\"Proin in blandit odio. Mauris placerat sollicitudin urna, at malesuada odio rhoncus eget.\"}]","created_at":"2013-11-28T13:24:14Z","id":63,"quiz_session_id":50},{"answer":"[{\"answer\":\"Aenean imperdiet tortor arcu, at congue sapien aliquam a.\"}]","created_at":"2013-11-28T13:24:14Z","id":64,"quiz_session_id":50}];

		//Empty
		var data;
		if(getResultsCount<1){
			//Empty data
			data = [];
		} else if(getResultsCount<3){
			data = mc_data;
		} else {
			data = mc_data;
		}
		getResultsCount++;

		if(typeof successCallback=="function"){
			setTimeout(function(){
				successCallback(data);
			},1000);
		}
	};

	/**
	 * Send answers for real time quizzes
	 */
	var sendAnwers = function(answers, quizSessionId, successCallback, failCallback){
		if(typeof successCallback=="function"){
			setTimeout(function(){
				successCallback();
			},1000);
		}
		return;
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