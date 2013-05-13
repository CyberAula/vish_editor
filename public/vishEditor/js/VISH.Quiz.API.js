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
					if(typeof failCallback=="function"){
						failCallback(error);
					}
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
					if(typeof failCallback=="function"){
						failCallback(error);
					}
				}
			});
		} else if(V.Configuration.getConfiguration()["mode"]=="noserver"){
			//Test

			// For MCChoice
			// var data = [{"answer":"[{\"no\":\"3\",\"answer\":\"true\"}]","created_at":"2013-04-29T10:48:42Z","id":1,"quiz_session_id":1}];
			// var data = [{"answer":"[{\"no\":\"2\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:00:11Z","id":25,"quiz_session_id":18},{"answer":"[{\"no\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:00:31Z","id":26,"quiz_session_id":18},{"answer":"[{\"no\":\"1\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:01:03Z","id":27,"quiz_session_id":18},{"answer":"[{\"no\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:01:11Z","id":28,"quiz_session_id":18},{"answer":"[{\"no\":\"3\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:01:20Z","id":29,"quiz_session_id":18}];

			//For TF quizzes (also works with MC)
			var data = [{"answer":"[{\"no\":\"1\",\"answer\":\"true\"},{\"no\":\"2\",\"answer\":\"false\"},{\"no\":\"3\",\"answer\":\"true\"},{\"no\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:10:23Z","id":30,"quiz_session_id":19},{"answer":"[{\"no\":\"1\",\"answer\":\"true\"},{\"no\":\"2\",\"answer\":\"false\"},{\"no\":\"3\",\"answer\":\"false\"},{\"no\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:10:37Z","id":31,"quiz_session_id":19},{"answer":"[{\"no\":\"1\",\"answer\":\"true\"},{\"no\":\"2\",\"answer\":\"true\"},{\"no\":\"3\",\"answer\":\"false\"},{\"no\":\"4\",\"answer\":\"false\"}]","created_at":"2013-05-13T13:10:52Z","id":32,"quiz_session_id":19},{"answer":"[{\"no\":\"1\",\"answer\":\"true\"},{\"no\":\"2\",\"answer\":\"false\"},{\"no\":\"3\",\"answer\":\"true\"},{\"no\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:11:09Z","id":33,"quiz_session_id":19},{"answer":"[{\"no\":\"1\",\"answer\":\"true\"},{\"no\":\"2\",\"answer\":\"false\"},{\"no\":\"3\",\"answer\":\"true\"},{\"no\":\"4\",\"answer\":\"true\"}]","created_at":"2013-05-13T13:11:41Z","id":34,"quiz_session_id":19}];


			if(typeof successCallback=="function"){
				setTimeout(function(){
					successCallback(data);
				},1000);
			}
		}
	};

   /*
	* Close opened quiz session
	*/
	var closeQuizSession = function(quizSessionId,name,successCallback, failCallback){

		if(V.Configuration.getConfiguration()["mode"]=="vish"){

			var send_type = 'GET';
			var params = {
				"id": quizSessionId, 
				"authenticity_token" : V.User.getToken() 
			}

			if(typeof name == "string"){
				params["name"] = name;
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
					if(typeof failCallback=="function"){
						failCallback(error);
					}
				}
			});
		} else if(V.Configuration.getConfiguration()["mode"]=="noserver"){

			// var params = {
			// 	"id": quizSessionId, 
			// 	"authenticity_token" : V.User.getToken() 
			// }
			// if(typeof name == "string"){
			// 	params["name"] = name;
			// }
			// V.Debugging.log(params)

			var data = {"processed":"true"};
			if(typeof successCallback=="function"){
				setTimeout(function(){
					successCallback(data);
				},1000);
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