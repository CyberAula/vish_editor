VISH.Quiz.API = (function(V,$,undefined){
	
	var init = function(){
		
	};
	
   /*
	* Request new quiz session
	* Server responds with a quiz_session JSON object including the quiz session id
	*/
	var startQuizSession = function(quiz,successCallback, failCallback){
		if(V.Configuration.getConfiguration().mode===V.Constant.VISH){
			var send_type = 'POST';

	        var params = {
	          "quiz": JSON.stringify(quiz),
	          "authenticity_token" : V.User.getToken()
	        }

			$.ajax({
				type    : send_type,
				url     : 'http://'+ window.location.host + '/quiz_sessions',
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
		} else if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){
			V.Debugging.log("No server case");
			var quiz_session = {id: "10000"*(1+Math.random())};
			if(typeof successCallback=="function"){
				successCallback(quiz_session);
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


/*
 *	Old version
 */


	/**
  	 * DELETE /quiz_sessions/X => close quiz => show results
	 * function calls VISH server for closing a voting
	 */
	var deleteQuizSession = function(quiz_session_id, successCallback, failCallback, quiz_name){
	if(V.Configuration.getConfiguration()["mode"]=="vish"){
		var quizName;
			if(quiz_name) {
				quizName = quiz_name;
			} else {
				quizName = "";

			}
			//DELETE 
			var send_type = 'DELETE';

	        //DELETE to http://server/quiz_session/X
	          var params = {
	     	  "id": quiz_session_id,
	          "authenticity_token" : V.User.getToken(), 
	          "name" : quizName
	        }
	        $.ajax({
	          type    : send_type,
	          url     : 'http://'+ window.location.host + '/quiz_sessions/'+quiz_session_id,
	          data    : params,
	          success : function(data) {
		      	var results = data;
	            if(typeof successCallback=="function"){
	            	successCallback(results);
	            }
	          },
	          error: function(error){
	          	failCallback(error);
	          }
            });

	        return null;
} else if(V.Configuration.getConfiguration()["mode"]=="noserver"){
			V.Debugging.log("No server case");
			var results = {"quiz_session_id":19,"quiz_id":3,"results":{"b":4,"a":2,"c":1, "d":1}};
			if(typeof successCallback=="function"){
				successCallback(results);
			}
		}

  };
	

 	/**
	 * GET /quiz_sessions/X => render vote or results page 
	 * could be called for a teacher who stop a voting and is redirected to the quiz_session_id
	 or for a student who has the shared quiz URL for voting.

	  */
	var getQuizSessionResults = function (quiz_active_session_id, successCallback, failCallback) {

		if(V.Configuration.getConfiguration()["mode"]=="vish"){

			//GET
			var send_type = 'GET';
	        var params = {
	        	"id": quiz_active_session_id, 
	        	"authenticity_token" : V.User.getToken()  
	        }

	        $.ajax({
	          type    : send_type,
	          url     : 'http://'+ window.location.host + '/quiz_sessions/'+quiz_active_session_id + '/results.json',
	          data    : params,
	          success : function(data) {
               	var results = data;
	            if(typeof successCallback=="function"){
	            	successCallback(results);
	            }
	            		          },
	          error: function(error){
	          	failCallback(error);
	          }
	          
             });

	         return null;
		} else if(V.Configuration.getConfiguration()["mode"]=="noserver"){
			V.Debugging.log("No server case: and quiz session get results: " + quiz_active_session_id);
			if(quiz_active_session_id==98988){
				var results = {"quiz_session_id":98988,"quiz_id":12,"results":{"b":4,"a":2,"c":1, "d":1}};
			} else if (quiz_active_session_id==98955) {
				var results = {"quiz_session_id":98955,"quiz_id":13,"results":{"b":8,"a":4,"c":4}};

			}
			if(typeof successCallback=="function"){
				successCallback(results);
			}
		}

	};



	
	return {
		init					    : init, 
		startQuizSession			: startQuizSession, 
		sendAnwers					: sendAnwers
	};

}) (VISH, jQuery);