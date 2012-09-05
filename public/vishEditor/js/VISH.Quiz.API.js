VISH.Quiz.API = (function(V,$,undefined){
	
	var init = function(){
		V.Debugging.log("VIS.QUIZ.API init");
	}
	
	
	/**
	 * function to call to VISH and start a poll activating the quiz 
	 
	 POST /quiz_sessions => open quiz to collect answers => respond with quiz_session id
   server returns: value of: quiz_session_id 
   function returns: string to construct the link to share
	 */
	var postStartQuizSession = function(quiz_id, successCallback, failCallback){
		
		if(VISH.Configuration.getConfiguration()["mode"]=="vish"){
			V.Debugging.log("Vish case");
			V.Debugging.log("quiz_id to start Quiz Session is: " + quiz_id);
			//POST 
			var send_type = 'POST';
	       
	        V.Debugging.log("token is: " + V.User.getToken());
	        //POST to http://server/quiz_session/
	     /* TODO  review what others params are required for post correctly */
	        var params = {
	     	  "quiz_id":quiz_id,
	          "authenticity_token" : V.User.getToken()
	        }

	        $.ajax({
	          type    : send_type,
	          url     : 'http://'+ window.location.host + '/quiz_sessions',
	          data    : params,
	          success : function(data) {

	              //if we redirect the parent frame
		            V.Debugging.log("data: "+ data);	
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
			var quiz_session_id = "123";
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
	     /* TODO  review what others params are required for post correctly */
	        var params = {
	     	  "id":quiz_session_id,
	          "authenticity_token" : V.User.getToken(), 
	          "name" : quizName
	        }

	        $.ajax({
	          type    : send_type,
	          url     : 'http://'+ window.location.host + '/quiz_sessions/'+quiz_session_id,
	          data    : params,
	          success : function(data) {

	              //if we redirect the parent frame
		            //V.Debugging.log("data: "+ data);	
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
      
  };
	
	
	/**
	 * GET /quiz_sessions/X => render vote or results page 
	 * could be called for a teacher who stop a voting and is redirected to the quiz_session_id
	 or for a student who has the shared quiz URL for voting.

	  */
	var getQuizSession = function(quiz_session_id, successCallback, failCallback){
		
		
	};
	
	
	/**
	 * PUT /quiz_sessions/X => vote => redirect to show
   * used for students when send a vote 
	 */
	var putQuizSession = function(answer_selected, quiz_active_session_id, successCallback, failCallback){
		V.Debugging.log("quiz_active_session_id for voting is : " + quiz_active_session_id);

		V.Debugging.log("Answer selected value is: " + answer_selected);
		if(VISH.Configuration.getConfiguration()["mode"]=="vish"){
			V.Debugging.log("Vish case");

			//POST 
			var send_type = 'PUT';
	       
	        V.Debugging.log("token is: " + V.User.getToken());
	        //DELETE to http://server/quiz_session/X
	     /* TODO  review what others params are required for post correctly */
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

	              //if we redirect the parent frame
		            V.Debugging.log("data: "+ data);	
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
 
	var getQuizSessionResults = function (quiz_active_session_id, successCallback, failCallback) {

		V.Debugging.log("quiz_active_session_id for asking results is : " + quiz_active_session_id);

		if(VISH.Configuration.getConfiguration()["mode"]=="vish"){
			V.Debugging.log("Vish case");

			//GET
			var send_type = 'GET';
	       
	        //DELETE to http://server/quiz_session/X
	     /* TODO  review what others params are required for post correctly */
	        var params = {
	        "id": quiz_active_session_id, 
	        "authenticity_token" : V.User.getToken()  
	        }

	        $.ajax({
	          type    : send_type,
	          url     : 'http://'+ window.location.host + '/quiz_sessions/'+quiz_active_session_id + '/results.json',
	          data    : params,
	          success : function(data) {

	              //if we redirect the parent frame
		          console.log("data: "+ data);	
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
			var results = {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]}; ;
			if(typeof successCallback=="function"){
				successCallback(results);
			}
		}


	};



	
	return {
		init					            : init, 
		postStartQuizSession				: postStartQuizSession, 
		deleteQuizSession					: deleteQuizSession, 
		getQuizSession						: getQuizSession, 
		putQuizSession						: putQuizSession, 
		getQuizSessionResults				: getQuizSessionResults

		
	};

}) (VISH, jQuery);