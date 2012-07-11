VISH.Quiz = (function(V,$,undefined){
    
    /**
    * called it will render depending of the kind of role
    * */
   //var init = function(role, element, template){
   	var init = function(role, element, template){
   
   		role = V.SlideManager.getUser().role;
   var obj;
   		switch(role) {
   	 
   	
   			case "logged": 
      	//render the slide for a logged user
      		obj = _renderMcquestionLogged (element, template); 
      		//add listener to stat Button
      		$(document).on('click', '.mcquestion_start_button', _onStartMcQuizButtonClicked);
      		
   			break;
   
   			case "student":
   		//render the slide for a student (he knows the shared URL) and no logged user 
   			obj =  _renderMcquestionStudent (element, template); 
   			//add listener to send button _onSendVoteMcQuizButtonClicked
      		 		$(document).on('click', '.mcquestion_send_vote_button', _onSendVoteMcQuizButtonClicked);
   			break;
   
   			case "none":
   		//render the slide for a viewer (he doesn't know the shared) URL an not logged user
   			obj =  _renderMcquestionNone (element, template);
   			
   			
   			break;
   
   			default: 
   			//obj could be an error message :  <p> Error</p>
   			VISH.Debugging.log("Something went wrong while processing the Quiz");	
   	
   		}
   
   
   return obj;
   
   	   
  // $(document).on('click', '#edit_excursion_details', _onEditExcursionDetailsButtonClicked);
   
   }
   var showStatistic = function (event){
   	
   	V.Debugging.log(" Enter showStatistics value of the event: "+ event);
   	
   }
   
   /*
   var renderMcquestion = function(element, template){
   	
   	
		var next_num=0;
		
		var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
		
		ret += "<div class='mcquestion_container'>";
		ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
		
		ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";
		//ret += "<label class='question_name'>Name:  </label>";
		//ret += "<textarea id='pupil_name' rows='1' cols='50' class='question_name_input' placeholder='Write your name here'></textarea>";
		
		
		for(var i = 0; i<element['options'].length; i++){
			var next_num = i;
		var next_index = "a".charCodeAt(0) + (next_num); 
		next_index = String.fromCharCode(next_index);
			
			ret += "<label class='mc_answer'>"+next_index+") <input type='radio' name='mc_radio' value='"+next_index+"'>"+element['options'][i]+"</label>";
			ret += "<div class='mc_meter'><span style='width:33%;'></span></div>";
		
		}
		
		ret += "</div>";
		ret += "<div class='mcquestion_right'>";
		ret += "<img class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
		ret += "<input type='submit' class='mcquestion_button' value='Start Quiz'/>";
		
		ret += "</div>";
		ret += "</form>";
		ret += "</div>";
		return ret;
	};
*/
/*
 * Render an Multiple choice question slide for an user who is logged in. In this case 
 * the user can start the Quiz so we show the quiz with all elements and buttons  
 * 
 */


   var _renderMcquestionLogged = function(element, template){
   	
   		var next_num=0;
		
		var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
		
		ret += "<div class='mcquestion_container'>";
		ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
		
		ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";
		
		
		for(var i = 0; i<element['options'].length; i++){
			var next_num = i;
		var next_index = "a".charCodeAt(0) + (next_num); 
		next_index = String.fromCharCode(next_index);
			
			ret += "<label class='mc_answer'>"+next_index+") "+element['options'][i]+"</label>";
			ret += "<div class='mc_meter'><span style='width:33%;'></span></div>";
		
		}
		
		ret += "</div>";
		ret += "<div class='mcquestion_right'>";
		ret += "<img class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
		ret += "<input type='submit' class='mcquestion_start_button' value='Start Quiz'/>";
		
		ret += "</div>";
		ret += "</form>";
		ret += "</div>";
		return ret;
	};
	
/*
 * Render an Multiple choice question slide for a student user who has the URL for voting. 
 * In this case the render will show the Quiz with the input radio options for allowing to vote 
 * and a send button for clicking when decide to vote  
 * 
 */
      var _renderMcquestionStudent = function(element, template){
    
    	 		var next_num=0;
		
		var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
		
		ret += "<div class='mcquestion_container'>";
		ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
		
		ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";
		
		
		for(var i = 0; i<element['options'].length; i++){
			var next_num = i;
		var next_index = "a".charCodeAt(0) + (next_num); 
		next_index = String.fromCharCode(next_index);
			
			ret += "<label class='mc_answer'>"+next_index+") <input type='radio' name='mc_radio' value='"+next_index+"'>"+element['options'][i]+"</label>";
			ret += "<div class='mc_meter'><span style='width:33%;'></span></div>";
		
		}
		
		ret += "</div>";
		ret += "<div class='mcquestion_right'>";
		ret += "<img class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
		ret += "<input type='submit' class='mcquestion_send_vote_button' value='Send'/>";
		
		ret += "</div>";
		ret += "</form>";
		ret += "</div>";
		return ret;
    	
    	
    	
    };
/*
 * Render an Multiple choice question slide for a user who is not logged in and has not URL. Only is watching 
 * the slide (excursion) 
 * In this case the render will show the Quiz without the input radio options for allowing to vote 
 * and without the buttons   
 * 
 */    
    
    var _renderMcquestionNone = function(element, template){
    	V.Debugging.log("enter to renderMcquestionNone");
    	
    }; 
    
    /*
     * Function will be call when a teacher wants to start a voting or opinion pull
     * so must do an post to the ViSH server, 
     * 
     * params: 
     * 
     */
    var _onSendVoteMcQuizButtonClicked = function () {
    	
    	V.Debugging.log(" button pressed and  _onStartMcQuizButtonClicked called");
    	
    };
    
      var _onStartMcQuizButtonClicked = function () {
    	
    	V.Debugging.log(" button pressed and  _onStartMcQuizButtonClicked called");
    	
    };
    
    
    return {
    	init 			 : init,
        showStatistic    : showStatistic
        
        
    };
    

    
}) (VISH, jQuery);
