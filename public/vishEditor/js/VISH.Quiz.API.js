VISH.Quiz.API = (function(V,$,undefined){
	
	var init = function(){
		
	};
	
   /*
	* Request new quiz session
	* Server responds with a quiz_session JSON object including the quiz session id
	*/
	var startQuizSession = function(quiz,quizJSON,successCallback, failCallback){
		if(V.Configuration.getConfiguration().mode===V.Constant.VISH){
			var send_type = 'POST';

	        var params = {
	          "quiz": JSON.stringify(quizJSON),
	          "authenticity_token" : V.User.getToken()
	        }

			$.ajax({
				type    : send_type,
				url     : 'http://'+ window.location.host + '/quiz_sessions',
				data    : params,
				success : function(data) {
					if(typeof successCallback=="function"){
						successCallback(quiz,data);
					}
				},
				error: function(error){
					failCallback(quiz,error);
				}
			});
		} else if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){
			var quizSessionId = Math.ceil(10000*(1+Math.random())).toString();
			var url = 'http://'+ window.location.host + '/quiz_sessions/' + quizSessionId;
			var quiz_session = {id: quizSessionId, url: url};
			if(typeof successCallback=="function"){
				setTimeout(function(){
					successCallback(quiz,quiz_session);
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
			var send_type = 'PUT';
	       
	        var params = {
	      	  "id": quizSessionId,
	     	  "answers": JSON.stringify(answers),
	          "authenticity_token" : V.User.getToken()
	        }

	        $.ajax({
	          type    : send_type,
	          url     : 'http://'+ window.location.host + '/quiz_sessions/'+quizSessionId,
	          data    : params,
				success : function(data) {
				if(typeof successCallback=="function"){
					successCallback(data);
				}
	          },
				error: function(error){
					failCallback(error);
				}
             });

	         return null;
		}
   };


 	/**
	 * GET /quiz_sessions/X/results.json.
	 */
	var getResults = function(quizSessionId, successCallback, failCallback){
		if(V.Configuration.getConfiguration()["mode"]=="vish"){

			var send_type = 'GET';
			var params = {
				"id": quizSessionId, 
				"authenticity_token" : V.User.getToken() 
			}

			$.ajax({
				type    : send_type,
				url     : 'http://'+ window.location.host + '/quiz_sessions/'+quizSessionId + '/results.json',
				data    : params,
				success : function(data) {
					if(typeof successCallback=="function"){
						successCallback(data);
					}
				},
				error: function(error){
					failCallback(error);
				}
			});
		} else if(V.Configuration.getConfiguration()["mode"]=="noserver"){
			//Test
			var data = [{"answer":"[{\"no\":\"3\",\"answer\":\"true\"}]","created_at":"2013-04-29T10:48:42Z","id":1,"quiz_session_id":1}];
			if(Math.random()<0.5){
				data = [{"answer":"[{\"no\":\"1\",\"answer\":\"false\"}]","created_at":"2013-04-29T10:48:42Z","id":1,"quiz_session_id":1},{"answer":"[{\"no\":\"3\",\"answer\":\"true\"}]","created_at":"2013-04-29T10:48:42Z","id":1,"quiz_session_id":1}];
			}


			if(typeof successCallback=="function"){
				successCallback(data);
			}
		}
	};

   /*
	* Close opened quiz session
	*/
	var closeQuizSession = function(quizSessionId,successCallback, failCallback){
		//TODO (test)

		if(V.Configuration.getConfiguration()["mode"]=="vish"){

			var send_type = 'GET';
			var params = {
				"id": quizSessionId, 
				"authenticity_token" : V.User.getToken() 
			}

			$.ajax({
				type    : send_type,
				url     : 'http://'+ window.location.host + '/quiz_sessions/'+quizSessionId + '/close',
				data    : params,
				success : function(data) {
					if(typeof successCallback=="function"){
						successCallback(data);
					}
				},
				error: function(error){
					failCallback(error);
				}
			});
		} else if(V.Configuration.getConfiguration()["mode"]=="noserver"){
			var data = {"processed":"true"};
			if(typeof successCallback=="function"){
				successCallback(data);
			}
		}
	}


	return {
		init					: init, 
		startQuizSession		: startQuizSession, 
		closeQuizSession		: closeQuizSession,
		sendAnwers				: sendAnwers,
		getResults 				: getResults
	};

}) (VISH, jQuery);