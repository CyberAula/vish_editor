VISH.Quiz = (function(V,$,undefined){
    var role;
    var slideToActivate;
    var slideToVote;
    /**
    * called from VISH.Renderer.renderSlide when one of the slide's element type is a mcquestion 
    
    * */
   
   	var init = function(element, template, slide){
		//depending on the role we use a diferent rederer function      
   		 role = V.SlideManager.getUser().role;
   		//the object to be returned
   		var obj;
   		
   		switch(role) {
   	 
   			case "logged": 
      	//render the slide for a logged user
      		obj = _renderMcquestionLogged (element, template, slide); 
      		//add listener to stat Button
     		
   			break;
   
   			case "student":
   		//render the slide for a student (he knows the shared URL) and no logged user 
   			obj =  _renderMcquestionStudent (element, template, slide); 
   			//add listener to send button _onSendVoteMcQuizButtonClicked
			
   			break;
   
   			case "none":
   		//render the slide for a viewer (he doesn't know the shared) URL an not logged user
   			obj =  _renderMcquestionNone (element, template, slide);
   			
   			
   			break;
   
   			default: 
   			//obj could be an error message :  <p> Error</p>
   			VISH.Debugging.log("Something went wrong while processing the Quiz, role value is: "+ role);	
   	
   		}
   
   
   return obj;
  
   
   };
   /**
    * called from VISH.Excursion._finishRenderer only when one of the slide's element type is a mcquestion 
    * add listeners and some functions and it is necessary that objects be loaded so that it's done later than 
    * render
    * */
   var enableInteraction = function (slide){
   	
   	   	
   	switch(role) {
   	 
   	
   			case "logged": 
   			slideToActivate = slide;
      	   		//add listener to stat Button
      		_activateLoggedInteraction();
      		
      		
   			break;
   
   			case "student":
   			//add listener to send button _onSendVoteMcQuizButtonClicked
   			slideToVote = slide;
			_activateStudentInteraction();
      		 	
				  
   			break;
   
   			case "none":
   		//render the slide for a viewer (he doesn't know the shared) URL an not logged user
   			_activateNoneInteraction();
   			
   			break;
   
   			default: 
   			//obj could be an error message :  <p> Error</p>
   			VISH.Debugging.log("Something went wrong while processing the Quiz, role value is: "+ role);	
   	
   		}
   	
   	
   	
   	
   	
   	
   };
   
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


   var _renderMcquestionLogged = function(element, template, slide){
   	
   //	V.Debugging.log("element is: " + element);
   	
   		var next_num=0;
		
		
		var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
		
		ret += "<div class='mcquestion_container'>";
		ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
		
		ret += "<form id='form_"+slide+"'class='mcquestion_form' action='"+element['posturl']+"' method='post'>";
		
		
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
		ret += "<input type='hidden' id='slide_to_activate' value='"+slide+"'/>";
		ret += "<input type='button' id='mcquestion_start_button_"+slide+"' class='mcquestion_start_button' value='Start Quiz'/>";
		
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
      var _renderMcquestionStudent = function(element, template, slide){
    
    	 		var next_num=0;
		//V.Debugging.log("element is: " + element);
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
		ret += "<input type='hidden' id='slide_to_vote' value='"+slide+"'/>";
		ret += "<input type='button' id='mcquestion_send_vote_button_"+slide+"' class='mcquestion_send_vote_button' value='Send'/>";
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
    
    var _renderMcquestionNone = function(element, template, slide){
    	V.Debugging.log("enter to renderMcquestionNone");
    	
    	
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
			
			//ret += "<div class='mc_meter'><span style='width:33%;'></span></div>";
		
		}
		
		ret += "</div>";
		ret += "<div class='mcquestion_right'>";
		//ret += "<img class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
	//	ret += "<input type='submit' class='mcquestion_button' value='Start Quiz'/>";
		
		ret += "</div>";
		ret += "</form>";
		ret += "</div>";
		return ret;
    	
    }; 
    
    /*
     * Function will be call when a teacher wants to start a voting or opinion pull
     * so must do an post to the ViSH server, 
     * 
     * params: 
     * 
     */
    
    var _activateLoggedInteraction = function () {
    	
    	var button = '#mcquestion_start_button_'+slideToActivate;
    	
       	$(document).on('click', button, _onStartMcQuizButtonClicked);
    	
    };
    
    var _activateStudentInteraction = function () {
    	
    	var button = '#mcquestion_send_vote_button_'+slideToVote;
    	//mcquestion_send_vote_article4
    	$(document).on('click', button, _onSendVoteMcQuizButtonClicked);
    	
    	$(".mc_meter").hide();
    };
    
    
    var _activateNoneInteraction = function () {
    	
    	
    	V.Debugging.log(" enter on _activeNoneInteraction function");
    };
    
    /*
     * Function activated when is pressed the start quiz button (teacher)
     * params --- we get the quiz to activate/deactivate from an form's hidden input that has the 
     * article value   
     */
      var _onStartMcQuizButtonClicked = function () {
      	
      	//get values from the form
      	
      	//construct url (making an POST to VISH.Server. Which params does it need? 
      		
      		// show (construct) share button 
    	
    	var URL = "<span> http://www.vishub.org/dasdas </span>";
    	
    	var slideToPlay = $(".current").find("#slide_to_activate").val();
    		
    	var shareButton = "<a class='shareQuizButton' href='http://www.vishub.org'><img src="+VISH.ImagesPath+"quiz/share-glossy-blue.png /></a>";	
    	//make appear the voting URL and share icon
    	//first remove children if there are   
    	if($("#"+slideToPlay).find(".t11_header").children()) {
    		
    		$("#"+slideToPlay).find(".t11_header").children().remove();
    	} 
    	
    	$("#"+slideToPlay).find(".t11_header").append(URL);
    	$("#"+slideToPlay).find(".t11_header").append(shareButton);
		
		//show header 
    	$("#"+slideToPlay).find(".t11_header").show();
    	//change the value button (Start Quiz --> StopQuiz) and the id?
    	$("#"+slideToPlay).find("#mcquestion_start_button_"+slideToPlay).attr('value', 'Stop Quiz');
    	$("#"+slideToPlay).find("#mcquestion_start_button_"+slideToPlay).attr('class', 'mcquestion_stop_button');
    	$("#"+slideToPlay).find("#mcquestion_start_button_"+slideToPlay).attr('id', 'mcquestion_stop_button_'+slideToPlay);
    	//add onclick event to the new stop button
    	//$("#"+slideToPlay).find("form_"+slideToPlay > input ).attr('value', 'Stop Quiz');
    	$("#"+slideToPlay).find("#slide_to_activate" ).attr('id', 'slide_to_stop');
    	//$("#"+slideToPlay).find("#mcquestion_start_button_"+slideToPlay).css('font-weight', 'bold');
    	$(document).on('click', '#mcquestion_stop_button_'+slideToPlay, _onStopMcQuizButtonClicked);
    };

    var _onSendVoteMcQuizButtonClicked = function (event) {
    	
    	var slideToVote = $(".current").find("#slide_to_vote").val();
    	V.Debugging.log(" button pressed and  _onSendtMcQuizButtonClicked called");
    	V.Debugging.log(" slideToVote value: " +slideToVote);
    };
    
    var _onStopMcQuizButtonClicked = function () {

    	V.Debugging.log(" button pressed and  _onStopMcQuizButtonClicked called");
    	
    	var slideToStop = $(".current").find("#slide_to_stop").val();
    	
    		V.Debugging.log("slideToStop value is: " + slideToStop);
    	
    	//TODO just only hide not remove ... but disappear the element so all the remainder elements go up
   		//	$("#"+slideToStop).find(".t11_header").css('display', 'block');
    	$("#"+slideToStop).find(".t11_header").text("");
    	//TODO thing if the button at the end of the voting must be removed or just only show start again
    	
    	//show start quiz again
    	
    	$("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('value', 'Start Quiz');
    	$("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('class', 'mcquestion_start_button');
    	$("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('id', 'mcquestion_start_button_'+slideToStop);
    	
    	$("#"+slideToStop).find("#slide_to_stop" ).attr('id', 'slide_to_activate');
    	$(document).on('click', '#mcquestion_start_button_'+slideToStop, _onStartMcQuizButtonClicked);
    	
    	
    };
    
    
    
    
    return {
    	init 			 	 : init,
        enableInteraction    : enableInteraction
        
        
    };
    

    
}) (VISH, jQuery);