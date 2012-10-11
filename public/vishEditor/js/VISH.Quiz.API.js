VISH.Quiz.API = (function(V,$,undefined){
	
	var init = function(){
		
	}
	
   /*
	* Request new quiz session
	* Server responds with a quiz_session_id
	*/
	var postStartQuizSession = function(quizId, successCallback, failCallback){
		
		if(VISH.Configuration.getConfiguration()["mode"]=="vish"){
			
			var send_type = 'POST';
	       
	        var params = {
	          "quiz_id": quizId,
	          "authenticity_token" : V.User.getToken()
	        }

			$.ajax({
				type    : send_type,
				url     : 'http://'+ window.location.host + '/quiz_sessions',
				data    : params,
				success : function(data) {
					var quiz_session_id = data;
					if(typeof successCallback=="function"){
						successCallback(quiz_session_id);
					}
				},
				error: function(error){
					failCallback(error);
				}
			});

	         return null;

		} else if(VISH.Configuration.getConfiguration()["mode"]=="noserver"){
			V.Debugging.log("No server case");
			var quiz_session_id = "989898";
			if(typeof successCallback=="function"){
				successCallback(quiz_session_id);
			}
		}

	};

	/**
  * DELETE /quiz_sessions/X => close quiz => show results
	 * function calls VISH server for closing a voting
	 */
	var deleteQuizSession = function(quiz_session_id, successCallback, failCallback, quiz_name){
	if(VISH.Configuration.getConfiguration()["mode"]=="vish"){

		V.Debugging.log("quiz_session_id to delete is: " + quiz_session_id);
		V.Debugging.log("quiz_name (if save) is: " + quiz_name);
		var quizName;
			if(quiz_name) {
				quizName = quiz_name;
			} else {
				quizName = "";

			}
			//DELETE 
			var send_type = 'DELETE';
	       
	        V.Debugging.log("token is: " + V.User.getToken());
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
} else if(VISH.Configuration.getConfiguration()["mode"]=="noserver"){
			V.Debugging.log("No server case");
			var results = {"quiz_session_id":19,"quiz_id":3,"results":{"b":4,"a":2,"c":1, "d":1}};
			if(typeof successCallback=="function"){
				successCallback(results);
			}
		}

  };
	
	/**
	 * PUT /quiz_sessions/X => vote => redirect to show
     * used for students when send a vote 
	 */
	var putQuizSession = function(answer_selected, quiz_active_session_id, successCallback, failCallback){

		if(VISH.Configuration.getConfiguration()["mode"]=="vish"){

			//POST 
			var send_type = 'PUT';
	       
	        V.Debugging.log("token is: " + V.User.getToken());
	        var params = {
	      	  "id": quiz_active_session_id,
	     	  "option":answer_selected,
	          "authenticity_token" : V.User.getToken()
	        }

	        $.ajax({
	          type    : send_type,
	          url     : 'http://'+ window.location.host + '/quiz_sessions/'+quiz_active_session_id,
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
	} else if(VISH.Configuration.getConfiguration()["mode"]=="noserver"){
			V.Debugging.log("No server case");
			var quiz_session_id = "123";
			if(typeof successCallback=="function"){
				successCallback(quiz_session_id);
			}
		}
	

   };
 	/**
	 * GET /quiz_sessions/X => render vote or results page 
	 * could be called for a teacher who stop a voting and is redirected to the quiz_session_id
	 or for a student who has the shared quiz URL for voting.

	  */
	var getQuizSessionResults = function (quiz_active_session_id, successCallback, failCallback) {

		if(VISH.Configuration.getConfiguration()["mode"]=="vish"){

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
		} else if(VISH.Configuration.getConfiguration()["mode"]=="noserver"){
			V.Debugging.log("No server case");
			var results = {"quiz_session_id":19,"quiz_id":3,"results":{"b":4,"a":2,"c":1, "d":1}};
			if(typeof successCallback=="function"){
				successCallback(results);
			}
		}

	};



	
	return {
		init					            : init, 
		postStartQuizSession				: postStartQuizSession, 
		deleteQuizSession					: deleteQuizSession, 
		putQuizSession						: putQuizSession, 
		getQuizSessionResults				: getQuizSessionResults

		
	};

}) (VISH, jQuery);