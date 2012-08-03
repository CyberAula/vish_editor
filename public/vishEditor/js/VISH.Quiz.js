VISH.Quiz = (function(V,$,undefined){
    var role;
    var slideToActivate;
    var slideToStop;
    var slideToVote;
    var user;
    var userStatus; 
   	var startButton = "mcquestion_start_button";
	var stopButton = "mcquestion_stop_button";
   
    /**
    * called from VISH.Renderer.renderSlide when one of the slide's element type is a mcquestion 
    
    * */
   
   	var init = function(element, template, slide){
		//depending on the role we use a diferent rederer function      
   		user = V.SlideManager.getUser();
   		userStatus = V.SlideManager.getUserStatus();
   		role = user.role;
   		//TODO where initialize this variable (here or )
   		slideToVote = userStatus.quiz_active;
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
   var enableInteraction = function (slide, options){
   	
   	   	
   	switch(role) {
   	 
   			case "logged": 
   			slideToActivate = slide;
   			
   			_alignStartButton(options);
      	   		//add listener to start and statistic buttons
      		_activateLoggedInteraction();
     		
   			break;
   
   			case "student":
   			//is this variable correctly initialized here?
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
 * Render an Multiple choice question slide for an user who is logged in. In this case 
 * the user can start the Quiz so we show the quiz with all elements and buttons  
 * 
 */
   var _renderMcquestionLogged = function(element, template, slide){
   	
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
			//ret += "<div class='mc_meter'><span id='mcoption"+(i+1)+"'></span></div>";
			ret += "<div class='mc_meter' id='mcoption_div_"+(i+1)+"'><span  id='mcoption"+(i+1)+"'></span></div>";
			ret += "<label class='mcoption_label' id='mcoption_label_"+(i+1)+"'></label>";
		}
		
		ret += "</div>";
		ret += "<div class='mcquestion_right'>";
		ret += "<img id='mch_statistics_button_"+slide+"' class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
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
		
		var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
		
		ret += "<div class='mcquestion_container'>";
		ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
		
		ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";
		
		for(var i = 0; i<element['options'].length; i++){
			var next_num = i;
			var next_index = "a".charCodeAt(0) + (next_num); 
			next_index = String.fromCharCode(next_index);
			
			ret += "<label class='mc_answer' id='mc_answer_"+slide+"_option_"+next_index+"'>"+next_index+") <input class='mc_radio' type='radio' name='mc_radio' value='"+next_index+"'</input>"+element['options'][i]+"</label>";
			ret += "<div class='mc_meter' id='mcoption_div_"+(i+1)+"'><span  id='mcoption"+(i+1)+"'></span></div>";
			ret += "<label class='mcoption_label' id='mcoption_label_"+(i+1)+"'></label>";
	
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
				
		}
		
		ret += "</div>";
		ret += "<div class='mcquestion_right'>";
		
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
    	
    	var startButton = '#mcquestion_start_button_'+slideToActivate;
    	
    	var statisticsButton = '#mch_statistics_button_'+slideToActivate;
    	
       	$(document).on('click', startButton, _onStartMcQuizButtonClicked);
     	$(document).on('click', statisticsButton, _onStatisticsMcQuizButtonClicked);
    	
    };
    
    
    /*
     *Function activate interactive elements in the Quiz for a student who is going
     * to participate in a polling process 
     * 
     * */
    
    var _activateStudentInteraction = function () {
    	 
    	var sendVoteButton = '#mcquestion_send_vote_button_'+slideToVote;
   
    	//add listener to send button _onSendVoteMcQuizButtonClicked
    	$(document).on('click', sendVoteButton, _onSendVoteMcQuizButtonClicked);
    	$(".mc_meter").hide();
    	var numOptions = $("#" +slideToVote).find(".mc_answer").size();
    	
    	for(var i = 0; i<numOptions; i++){
    		var next_num = i;
			var next_index_prev = "a".charCodeAt(0) + (next_num); //creating index 
			next_index = String.fromCharCode(next_index_prev);
    		
    		var overOptionZone = "#mc_answer_"+slideToVote+"_option_"+ next_index;
    		
    		
    	  	$("#"+slideToVote).on("mouseenter", overOptionZone, function(event){	
  				//event.preventDefault();
  				$(event.srcElement).css("color", "blue");
  				$(event.srcElement).css("font-weight", "bold");
  			});
		
			$("#"+slideToVote).on("mouseleave", overOptionZone, function(event){
  				//event.preventDefault();
  				$(event.srcElement).css("color", "black");
      			$(event.srcElement).css("font-weight", "normal");
      		});
		
		
		}
    	
    };
    
    
    var _activateNoneInteraction = function () {
    	
    	
    	V.Debugging.log(" enter on _activeNoneInteraction function");
    };
    
  /*   Function that move the start button down when created 
   * */  
    
  var _alignStartButton = function (options) {
  	var marginTopDefault = 18;
    	
  	var startButton = "mcquestion_start_button_" + slideToActivate;

  	var marginTopPercentTxt = (marginTopDefault*parseInt(options).toString())+"%";
  	
  	//operations to move down the start button 
      	$("#"+startButton).css("margin-top", marginTopPercentTxt);
  	
  	
  };
  
  
  
    /*
     * Function activated when is pressed the start quiz button (teacher)
     * params --- we get the quiz to activate/deactivate from an form's hidden input that has the 
     * article value   
     */
      var _onStartMcQuizButtonClicked = function () {
     
	  	//get values from the form
      	
      	//construct url (making an POST to VISH.Server. Which params does it need? 
      		
      		// show (construct) share button and different buttons for social networks sharing
    	slideToPlay = $(".current").find("#slide_to_activate").val();
    	
    	var url = "http://www.vishub.org/dasdas";
    	
    	var divURLShare = "<div id='url_share_"+slideToPlay+"' class='url_share'></div>";
    	var URL = "<span>"+url+"</span>";
    	
    	
    	//create share buttons (Share, FB & TW):
    	var shareButton = "<a id='share_icon_"+slideToPlay+"' class='shareQuizButton' ><img src="+VISH.ImagesPath+"quiz/share-glossy-blue.png /></a>";
    																																		//http://twitter.com/share?url=http://www.example.com/&text=Texto			
    	var shareTwitterButton = "<a target='_blank' title='share on Twitter' href='http://twitter.com/share?url="+encodeURIComponent(url)+"' class='twitter-share-button' data-url='"+encodeURIComponent(url)+"' data-size='large' data-count='none'><img src='"+V.ImagesPath+"quiz/tw_40x40.jpg'/></a>";
		var shareFacebookButton = "<a target='_blank' title='share on Facebook' href='http://www.facebook.com/share.php?u="+encodeURIComponent(url)+"' "; 
		    shareFacebookButton += "id='fb_share_link_"+slideToPlay+"' class='a_share_content_icon'><img src='"+V.ImagesPath+"quiz/fb_40x40.jpg'/></a>";
    	
    	//Container for share buttons	
    	var shareContainerIcons = "<div id='share_content_icons_"+slideToPlay+"' class='shareContentIcons'> ";
        	shareContainerIcons += shareFacebookButton;
    		shareContainerIcons += shareTwitterButton;
    	
    	//make appear the voting URL and share icon
    	//first remove children if there are   
    	if($("#"+slideToPlay).find(".t11_header").children()) {
    		
    		$("#"+slideToPlay).find(".t11_header").children().remove();
    	} 
    	
    	//add elements created  
    	$("#"+slideToPlay).find(".t11_header").append(divURLShare);
    	$(".current").find("#url_share_"+slideToPlay).append(URL);
    	$(".current").find("#url_share_"+slideToPlay).append(shareButton);
    	$(".current").find("#url_share_"+slideToPlay).append(shareContainerIcons);
		//show header 
    	$("#"+slideToPlay).find(".t11_header").show();
    	//change the value button (Start Quiz --> StopQuiz) and the id?
    	$("#"+slideToPlay).find("#mcquestion_start_button_"+slideToPlay).attr('value', 'Stop Quiz');
    	$("#"+slideToPlay).find("#mcquestion_start_button_"+slideToPlay).attr('class', 'mcquestion_stop_button');
    	$("#"+slideToPlay).find("#mcquestion_start_button_"+slideToPlay).attr('id', 'mcquestion_stop_button_'+slideToPlay);
    	//add onclick event to the new stop button
    	$("#"+slideToPlay).find("#slide_to_activate" ).attr('id', 'slide_to_stop');
    	
    	
    	//adding listeners for different events
    	
    	//appear share buttons when mouse over share button
    	$(".current").on("mouseenter", "#share_icon_"+slideToPlay, function(event){
  			event.preventDefault();
      		$(".current").find(".shareContentIcons").css("display", "inline-block");
      		//$(".current").find(".a_share_content_icon").slideDown();
  
		});
  		//prevent default action for clicking the share button
  		$(document).on("click", "#share_icon_"+slideToPlay, function(event){
  			event.preventDefault();
		}); 
		
		//remove share buttons when mouseleave share buttons area
		$(document).on("mouseleave", "#url_share_"+slideToPlay, function(event){
  			event.preventDefault();
  			
  		$(".current").find(".shareContentIcons").css("display", "none");
  			
		});
  		
  		
    	$(document).on('click', '#mcquestion_stop_button_'+slideToPlay, _onStopMcQuizButtonClicked);
    };

/*Function executed when the studen has pressed the send vote button
 * has to send the option choosen to the server and wait for total results till that moment. 
 * 
 * 
 *
 * 
 */ 
     var _onSendVoteMcQuizButtonClicked = function (event) {
    	
    	slideToVote = $(".current").find("#slide_to_vote").val();
    
       	//get the selected option {a,b,c,d,e} 
    	var answer = $(".current").find("input:radio[name='mc_radio']:checked'").val();
    	
    	//check that student selected one option
    	if(answer==undefined) {
    		
    		alert("You must choice your answer before polling");
    	}
    	//option selected
    	else {
    	
    	
    	/*TODO we have to send the vote to the Server (PUT /quiz_sessions/ID)
    	and we receive from the server the quantities of votes for each option in a JSON object:
    	{"quiz_session_id":"444", "quiz_id":"4", "option_a":"23", "option_b":"3", "option_c":"5", "option_d":"1", "option_e":"6"}
    	{"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
    		*/
    	var vote_url; //must include the session_quiz/id and the option to vote
    	//jQuery.getJSON(vote_url,function (data) {
    	//var for testing receive values for a pull	
    	var data = 	{"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
			_showResultsToParticipant(data, slideToVote);
		//});
    	
    	//remove input radio 
    	$(".current").find(".mc_radio").remove();
    	$(".current").find("#mcquestion_send_vote_button_"+slideToVote).remove();
    	
    	
    	// update values to span css('width','xx%') ..it will be done by the function _showResultsToParticipant
    	var data = 	{"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
    	
    	_showResultsToParticipant(data);
    	
    	//for avoid bring out when mouse over option
    	_removeOptionsListener(slideToVote);
    	
    	
    	
    	}
    };
    
    var _onStopMcQuizButtonClicked = function () {
		
    	//V.Debugging.log(" button pressed and  _onStopMcQuizButtonClicked called");
    	
    	slideToStop = $(".current").find("#slide_to_stop").val();
    	
    	//TODO just only hide not remove ... but disappear the element so all the remainder elements go up
   		//	$("#"+slideToStop).find(".t11_header").css('display', 'block');
    	$("#"+slideToStop).find(".t11_header").text("");
    	//TODO think if the button at the end of the voting must be removed or just only show start again
    	
    	//show start quiz again
    	
    	$("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('value', 'Start Quiz');
    	$("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('class', 'mcquestion_start_button');
    	$("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('id', 'mcquestion_start_button_'+slideToStop);
    	
    	$("#"+slideToStop).find("#slide_to_stop" ).attr('id', 'slide_to_activate');
    	$(document).on('click', '#mcquestion_start_button_'+slideToStop, _onStartMcQuizButtonClicked);
    	
    };
    
    var _onStatisticsMcQuizButtonClicked = function () {
    	var marginTopDefault = 18; 
    	var marginTopDefault2 = 24; 
		
		//find the number of slide 
	 
	  	//if it is shown --> hide and move the button up  
    	if(	$(".current").find(".mc_meter").css('display')=="block") {
    		var marginTopPercentTxt = (marginTopDefault*parseInt($(".current").find(".mc_answer").length).toString())+"%";
    		
    		$(".current").find(".mc_meter").css('display', 'none');
    		$(".current").find(".mcoption_label").css('display', 'none');
    		
    		//if ($(".current").find("#" + startButton + "_" + slideToActivate)) {
    		if ($(".current").find("#slide_to_activate").val()) {
    			slideToActivate = $(".current").find("#slide_to_activate").val();
    			$("#" + startButton + "_" + slideToActivate).css("margin-top", marginTopPercentTxt);
    		} //mcquestion_stop_button_article1
    	//	else if ($(".current").find("#" + stopButton + "_" + slideToStop))  {  // if ($(".current").find(".mcquestion_stop_button"))
    		else if ($(".current").find("#slide_to_stop").val()) { 
    		
    			slideToStop = $(".current").find("#slide_to_stop").val();
    		
    			$("#" + stopButton + "_" + slideToStop).css("margin-top", marginTopPercentTxt);
    		
    		}
    	} 
    	//if it is hidden --> fill values, show statistics and move the button down 
    	//TODO call a function that do periodical get's to keep updated statistics values  
    	else {
    		
    		var marginTopPercentTxt = (marginTopDefault2*parseInt($(".current").find(".mc_answer").length).toString())+"%";
    		
    		//get values from the server , send the quiz_session_id
    		
    		//data must be received from the VISH Server 
    		var data = 	{"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
			_showResultsToTeacher(data);
    
    	
    
    	if ($(".current").find("#slide_to_activate").val()) {	
    			//try to read values from 
    			slideToActivate = $(".current").find("#slide_to_activate").val();
    			$("#" + startButton + "_" + slideToActivate).css("margin-top", marginTopPercentTxt);
    				
    			
    		
    		} else	if ($(".current").find("#slide_to_stop").val()) { 
    		
    			slideToStop = $(".current").find("#slide_to_stop").val();
    		
    			
    			$("#" + stopButton + "_" + slideToStop).css("margin-top", marginTopPercentTxt);
    			
    		
    			
    		} 
    	
    	
    	}
    	
    	
    };
    
    /*
     * Function called when the JSON object is received from the server 
     * {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
     * actions to do: 
     * 
     */
    
    var _showResultsToParticipant = function (data, slide) {
    	
    	  var greatestId;
    	  var greatest=0;	
    	//if (data.quiz_session_id==userQuizSessionID) ??
    	//TODO 
    	if(data.quiz_id == userStatus.quiz_active) {
    		
    		var votes;	
    		var totalVotes =0;
    	//calculate the vote's total sum 
    		for (votes in data.results) {
    			totalVotes 	+= parseInt(data.results[votes]);
    			if(parseInt(data.results[votes])>greatest) {
    				greatestId=votes;
    				greatest=parseInt(data.results[votes]);
    			  }
    			 else {
    			 	greatestId;
    			 	
    			 } 
    			  
    		}
    		for (votes in data.results) {
	    		var percent= ((((parseInt(data.results[votes]))/totalVotes))*100).toString() ;
    		   var percentString = percent  + "%";
    		    var newnumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);
    		    //V.Debugging.log(" data result "+ (votes+1).toString() +" value " + data.results[votes]);
    			// change the value for span css('width','xx%')
    			$(".current").find("#mcoption"+(parseInt(votes)+1).toString()).css("width", percentString);
    			$(".current").find("#mcoption_label_"+(parseInt(votes)+1).toString()).text(newnumber+"%");
    		}
    		//show results 
    		
    	} 
    	else {
    		V.Debugging.log(" The Quiz voted is not the active Quiz ... please reload the Quiz");
    		
    	}
    	
    	var indexOfGreatestVoted = String.fromCharCode("a".charCodeAt(0) + parseInt(greatestId)); //creating index 
			
    	
	$(".current").find("#mc_answer_"+ slide + "_option_" + indexOfGreatestVoted).css('color', 'blue');
	$(".current").find("#mc_answer_"+ slide + "_option_" + indexOfGreatestVoted).css('font-weight', 'bold');
    $(".current").find(".mc_meter").css('display', 'block');	
    $(".current").find(".mcoption_label").css('display', 'block');

    	
  //  $(".current").find(".mc_meter").css('display', 'block');	
    };
    
    
      /*
     * Function called when the JSON object is received from the server 
     * {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
     * actions to do:  */
    
    
     var _showResultsToTeacher = function (data) {
    	
    	  	
    	//if (data.quiz_session_id==userQuizSessionID) ??
    	//TODO 
    	if(role=="logged") {
    		
    		var votes;	
    		var totalVotes =0;
    	//calculate the vote's total sum 
    		for (votes in data.results) {
    			totalVotes 	+= parseInt(data.results[votes]);
    		}
    		for (votes in data.results) {
	    		var percent= ((((parseInt(data.results[votes]))/totalVotes))*100).toString() ;
    		   var percentString = percent  + "%";
    		    var newnumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);
    		    //V.Debugging.log(" data result "+ (votes+1).toString() +" value " + data.results[votes]);
    			// change the value for span css('width','xx%')
    			$(".current").find("#mcoption"+(parseInt(votes)+1).toString()).css("width", percentString);
    			$(".current").find("#mcoption_label_"+(parseInt(votes)+1).toString()).text(newnumber+"%");
    		}
    		//show results 
    		
    	} 
    	else {
    		V.Debugging.log(" The User's role is not the correct");
    		
    	}
    	
    $(".current").find(".mc_meter").css('display', 'block');	
    $(".current").find(".mcoption_label").css('display', 'block');
    };
    

	var _removeOptionsListener = function (slideToRemoveListeners) {
		
		var totalOptions = $(".current").find(".mc_answer").size();
		V.Debugging.log("totalOptions value is: " + totalOptions);
			
			for(var i = 0; i<totalOptions; i++){
    		var next_num = i;
			var next_index_prev = "a".charCodeAt(0) + (next_num); //creating index 
			next_index = String.fromCharCode(next_index_prev);
    		
    		var overOptionZone = "#mc_answer_"+slideToRemoveListeners+"_option_"+ next_index;
    		
    	  	//didn't get to remove the listener ... it just does nothing diferent  
    	  	$(document).on("mouseenter", overOptionZone, function(event){
  			 
  			 event.preventDefault();
  			 event.srcElement.unbind("mouseenter");
  			/*	$(event.srcElement).css("color", "black");
      			$(event.srcElement).css("font-weight", "normal"); */
		});
    	  	
  			  				
		}	
			
			
			
		
	};
    
    
    
    return {
    	init 			 	 : init,
        enableInteraction    : enableInteraction
        
        
    };
    

    
}) (VISH, jQuery);