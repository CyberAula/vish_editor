VISH.Quiz.API = (function(V,$,undefined){
	
	var init = function(){


	}
	
	
	/**
	 * function to call to VISH and start a poll activating the quiz 
	 
	 POST /quiz_sessions => open quiz to collect answers => respond with quiz_session id
   server returns: value of: quiz_session_id 
   function returns: string to construct the link to share
	 */
	var postStartQuizSession = function(quiz_id, successCallback, failCallback){
		V.Debugging.log("quiz_id to start Quiz Session is: " + quiz_id);
		//POST 
			var send_type = POST;
	       
	        
	        //POST to http://server/quiz_session/
	     /* TODO  review what others params are required for post correctly 
	        var params = {
	     		
	          "authenticity_token" : VISH.SlideManager.initOptions["token"]
	        }
	        
	        $.ajax({
	          type    : send_type,
	          url     : http://localhost/quiz_sessions
	          data    : params,
	          success : function(data) {
	              //if we redirect the parent frame
	            return data;
	          }     */
	return 5555;
	};
	
	
	/**
  * DELETE /quiz_sessions/X => close quiz => show results
	 * function to call to VISH and request recommended videos
	 */
	var deleteQuizSession = function(quiz_session_id, successCallback, failCallback){
	
      
  };
	
	
	/**
	 * GET /quiz_sessions/X => render vote or results page
	 */
	var getQuizSession = function(quiz_session_id, successCallback, failCallback){
		
		
	};
	
	
	/**
	 * PUT /quiz_sessions/X => vote => redirect to show
   * used for students when send a vote 
	 */
	var putQuizSession = function(quiz_session_id, successCallback, failCallback){
		

   };
 
	
	
	return {
		init					            : init, 
		postStartQuizSession				: postStartQuizSession, 
		deleteQuizSession					: deleteQuizSession, 
		getQuizSession						: getQuizSession, 
		putQuizSession						: putQuizSession

		
	};

}) (VISH, jQuery);