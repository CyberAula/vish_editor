VISH.Quiz = (function(V,$,undefined){
  var role;
  var slideToActivate;
  var slideToStop;
  var slideToVote;
  var user;
  var userStatus; 
  var quizUrlForSession =" http://"+window.location.host.toString() +"/quiz_sessions/";
  var startButton = "mcquestion_start_button";
  var stopButton = "mcquestion_stop_button";
  var trueFalseAnswers = new Array(); //array to save the answers
  var quizStatus = {};

  //Called from VISH.SlideManager !
  var init = function(excursion){
    V.Debugging.log("Vish Quiz init");
      
    var options = VISH.SlideManager.getOptions();
    var user = VISH.SlideManager.getUser();

    if (excursion.type=="quiz_simple") {
      //Allow any user to answer a quiz
      if(options['quiz_active_session_id']) {
        quizStatus.quiz_active_session_id = options['quiz_active_session_id'];
      } 
    } else if(excursion.type=="standard") {
      switch(user.role){
        case "logged":
          //Code here...
          break;
        case "none":
          //Code here...
          break;
      }
    }

    VISH.Quiz.API.init();
  }

  /////////////
  // DEPRECATED CODE
  ///////////
/*
          //fixing editor mode when save an excursion
    if(options['username']) {
      
     user.username = options['username'];
     user.role  = "logged";
     if(options['token']){
       status.token = options['token'];


     if (excursion.type=="quiz_simple") {
       if(options['quiz_active_session_id']) {
         status.quiz_active_session_id = options['quiz_active_session_id'];
       } 
     }

       //when logged + token but no quiz_active_session_id
       else { 
       //must be false
       status.quiz_active_session_id = options['quiz_active_session_id']; 
       }     
      
     }
     //no token ( when? ) but logged 
     else {
      
       status.token = "";
       //logged, no token but quiz_active_session_id .... ?
       if(options['quiz_active_session_id']) {
            
         status.quiz_active_session_id = options['quiz_active_session_id'];
        
       }
     }
      
    }  //no username 
    else {
    
     user.username=""; //so no token
     status.token=""; 
      
     //no username but quiz active --> (student) 
     if(options['quiz_active_session_id']) {
       V.Debugging.log("options quiz_active_session_id value is: " + options['quiz_active_session_id']);
         user.role= "student";
       status.quiz_active_session_id = options['quiz_active_session_id'];
     }
    //no username no quiz active --> (none)
     else {
        
         user.role= "none";
         status.quiz_active_session_id = options['quiz_active_session_id'];
       } 
    
     }
    VISH.Debugging.log("(SlideManager)username: " + user.username);
    VISH.Debugging.log("(SlideManager)role: " + user.role);
     V.Debugging.log("Vish.SlideManager: options [username]= " + options['username'] + ", [token]=" + options['token'], + " [quiz_active_session_id]= " + options['quiz_active_session_id'] , + " [show results]= " + options['show_results']);
*/


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


  var enableTrueFalseInteraction = function (slide, options) {
    //var sendButton = $("#" + slide).find(".tfquestion_button");

    //var sendButton = $("#" + slide).find("input:button[class='tfquestion_button']");
    var sendButton = $("#" + slide).find("#tf_send_button");

    //var radioInput = $("#"+slide).find("input[type=radio][name=tf_radio_1]");
    var radioInput = $("#"+slide).find("input:radio[name='tf_radio_1']");

    //add listeners
    //$(document).on('click','#'+buttonAddOptionId , addMultipleChoiceOption);
    /*$(document).on('click', sendButton, function(event){	
    event.preventDefault();
    VISH.Debugging.log("Click detected: on send button TF question");		
    //	$(event.srcElement).css("color", "blue");
    }); */

    /*
    $("#"+slide).on("click", radioInput, function(event){	
    event.preventDefault();
    VISH.Debugging.log("Click detected: on radio button 1");		
    //	$(event.srcElement).css("color", "blue");

    valor = $("#"+slide).find("input[type=radio][name=tf_radio_1]").val();  			

    VISH.Debugging.log("Valor is: " + valor);
    VISH.Debugging.log("trueFalseAnswer 0 is : " + trueFalseAnswers[0]);

    if (valor==trueFalseAnswers[0]) {
    	
    	VISH.Debugging.log("Correct answer!!");
    	
    	
    } else {
    	
    	VISH.Debugging.log("Wrong answer!!");
    	
    }
    });
    */
    };
   
   
  /*
  * Render an Multiple choice question slide for an user who is logged in. In this case 
  * the user can start the Quiz so we show the quiz with all elements and buttons  
  * 
  */
  var _renderMcquestionLogged = function(element, template, slide, quiz_id){
    var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
    ret += "<div class='mcquestion_container'>";
    ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
    ret += "<form id='form_"+slide+"'class='mcquestion_form' action='"+element['posturl']+"' method='post'>";

    for(var i = 0; i<element['options'].length; i++){
      var next_index = String.fromCharCode("a".charCodeAt(0) + (i)); 

      ret += "<label class='mc_answer'>"+next_index+") "+element['options'][i]+"</label>";
      //ret += "<div class='mc_meter'><span id='mcoption"+(i+1)+"'></span></div>";
      ret += "<div class='mc_meter' id='mcoption_div_"+(i+1)+"'><span  id='mcoption"+(i+1)+"'></span></div>";
      ret += "<label class='mcoption_label' id='mcoption_label_"+(i+1)+"'></label>";
    }

    ret += "</div>";
    ret += "<div class='mcquestion_right'>";
    ret += "<img id='mch_statistics_button_"+slide+"' class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
    ret += "<input type='hidden' id='slide_to_activate' value='"+slide+"'/>";
    ret += "<input type='hidden' id='quiz_id_to_activate' value='"+quiz_id+"'/>";
    ret += "<input type='button' id='mcquestion_start_button_"+slide+"' class='mcquestion_start_button' value='Start Quiz'/>";
    ret += "<div id='save_quiz_"+slide+"' class='save_quiz'><label>Do you want to save the polling results?</label>";
    ret +="<input type='button'class='mcquestion_save_yes_button' id='mcquestion_save_yes_button_"+slide+"' value='Yes'><input type='button' class='mcquestion_save_no_button' id='mcquestion_save_no_button_"+slide+"' value='No'></div>"
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

    var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
    ret += "<div class='mcquestion_container'>";
    ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
    ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";

    for(var i = 0; i<element['options'].length; i++){
      var next_index = String.fromCharCode("a".charCodeAt(0) + (i)); 
      ret += "<label class='mc_answer' id='mc_answer_"+slide+"_option_"+next_index+"'>"+next_index+") <input class='mc_radio' type='radio' name='mc_radio' value='"+next_index+"'</input>"+element['options'][i]+"</label>";
      ret += "<div class='mc_meter' id='mcoption_div_"+(i+1)+"'><span  id='mcoption"+(i+1)+"'></span></div>";
      ret += "<label class='mcoption_label' id='mcoption_label_"+(i+1)+"'></label>";
    }

    ret += "</div>";
    ret += "<div class='mcquestion_right'>";
    ret += "<input type='hidden' id='slide_to_vote' value='"+slide+"'/>";
    ret += "<input type='hidden' id='quiz_active_session_id' value='"+V.SlideManager.getUserStatus().quiz_active_session_id +"'/>";
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
    var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
    ret += "<div class='mcquestion_container'>";
    ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
    ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";

    for(var i = 0; i<element['options'].length; i++){
      var next_index = String.fromCharCode("a".charCodeAt(0) + (i)); 
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
    var saveQuizYesButton = '#mcquestion_save_yes_button_'+slideToActivate;
    var saveQuizNoButton = '#mcquestion_save_no_button_'+slideToActivate;     	
    $(document).on('click', startButton, _startMcQuizButtonClicked);
    $(document).on('click', statisticsButton, _statisticsMcQuizButtonClicked);
    $(document).on('click', saveQuizYesButton, _saveQuizYesButtonClicked);
    $(document).on('click', saveQuizNoButton, _saveQuizNoButtonClicked);
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
        $(event.srcElement).css("color", "blue");
        $(event.srcElement).css("font-weight", "bold");
      });

      $("#"+slideToVote).on("mouseleave", overOptionZone, function(event){
        $(event.srcElement).css("color", "black");
        $(event.srcElement).css("font-weight", "normal");
      });
    }
  };


  /*
   * External user does not have interaction with the Quiz , think about remove this function
   */
  var _activateNoneInteraction = function () {
  	V.Debugging.log(" enter on _activeNoneInteraction function");
  };
    

  /*   
   * Function that move the start button down when created 
   */    
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
  var _startMcQuizButtonClicked = function () {
    // show (construct) share button and different buttons for social networks sharing
    slideToPlay = $(".current").find("#slide_to_activate").val();

    //this URL is generated for VISHUB server (through Ajax POST) 
    //var url = V.Quiz.API.postStartQuiz(quiz_id);
    //TODO URL shorter ?? talk to R & R 
    var quiz_id =  $(".current").find("#quiz_id_to_activate").val();
    // var quiz_id = 1; //sacarlo de la slide el parámetro quiz_id (verlo en modelo de la excursion)
    V.Debugging.log("Quiz_id from form : " + quiz_id);

    V.Quiz.API.postStartQuizSession(quiz_id,_onQuizSessionReceived,_OnQuizSessionReceivedError);
  };


  var _onQuizSessionReceived = function(quiz_session_id){
    V.Debugging.log("returned value is (quiz_Session_id?): " + quiz_session_id);
    var url = quizUrlForSession + quiz_session_id;

    var divURLShare = "<div id='url_share_"+slideToPlay+"' class='url_share'></div>";
    var urlToAppend = "<span>"+url+"</span>";

    //create share buttons (Share, FB & TW):
    var shareButton = "<a id='share_icon_"+slideToPlay+"' class='shareQuizButton' ><img src="+VISH.ImagesPath+"quiz/share-glossy-blue.png /></a>";
    var shareTwitterButton = "<a target='_blank' title='share on Twitter' href='http://twitter.com/share?url="+ encodeURIComponent(url) +"' class='twitter-share-button' data-url='"+encodeURIComponent(url)+"' data-size='large' data-count='none'><img src='"+V.ImagesPath+"quiz/tw_40x40.jpg'/></a>";
    var shareFacebookButton = "<a target='_blank' title='share on Facebook' href='http://www.facebook.com/share.php?u="+ encodeURIComponent(url) +"' "; 
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
    $(".current").find("#url_share_"+slideToPlay).append(urlToAppend);
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
    $("#"+slideToPlay).find(".mcquestion_stop_button").css("color", "red");
    //add the quiz_session_id to the form? for delete when stop
    $(".current").find("#quiz_id_to_activate").attr("id", "quiz_session_id");
     $(".current").find("#quiz_session_id").attr("value", quiz_session_id);
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

    //hide save quiz div if it has been shown before
    if($(".current").find(".save_quiz").css("display")=="inline-block"){
      $(".current").find(".save_quiz").css("display", "none"); 
    }
  }

  var _OnQuizSessionReceivedError = function(error){
    console.log("_OnQuizSessionReceivedError:  " + error);
  }

  /*Function executed when the studen has pressed the send vote button
  * has to send the option choosen to the server and wait for total results till that moment. 
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
    } else {
      V.Debugging.log("answer option selected is: " + answer);
      /*TODO we have to send the vote to the Server (PUT /quiz_sessions/ID)
      and we receive from the server the quantities of votes for each option in a JSON object:
      {"quiz_session_id":"444", "quiz_id":"4", "option_a":"23", "option_b":"3", "option_c":"5", "option_d":"1", "option_e":"6"}
      {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
      */
      var quiz_active_session_id = $(".current").find("#quiz_active_session_id").val();
      V.Debugging.log("quiz_active_session_id is: " + quiz_active_session_id);

      V.Quiz.API.putQuizSession(answer, quiz_active_session_id, _onQuizVotingSuccessReceived, _OnQuizVotingReceivedError);

      //jQuery.getJSON(vote_url,function (data) {
      //var for testing receive values for a pull	
    }
  };
    

  var _onQuizVotingSuccessReceived = function(data){
    var received = JSON.stringify(data);
    V.Debugging.log("_onQuizVotingSuccessReceived and data received is: " + received);

    var data =  {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
    _showResultsToParticipant(data, slideToVote);

    //remove input radio 
    $(".current").find(".mc_radio").remove();
    $(".current").find("#mcquestion_send_vote_button_"+slideToVote).remove();

    // update values to span css('width','xx%') ..it will be done by the function _showResultsToParticipant
    var data =  {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
    _showResultsToParticipant(data);

    //for avoid bring out when mouse over option
    _removeOptionsListener(slideToVote);
  };

  var _OnQuizVotingReceivedError = function(error){
    var received = JSON.stringify(error)
    console.log("_OnQuizVotingReceivedError, and value received is:  " + received);
  };


  /*
  *called for a teacher who wants to stop a voting 
  */
  var _onStopMcQuizButtonClicked = function () {
    var quiz_id =  $(".current").find("#quiz_session_id").val();
    V.Debugging.log("Quiz_session id from form : " + quiz_id);
    V.Quiz.API.deleteQuizSession(quiz_id,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError);
  };
    

  var _onQuizSessionCloseReceived = function(results){
    slideToStop = $(".current").find("#slide_to_stop").val();
    //TODO just only hide not remove ... but disappear the element so all the remainder elements go up
    //  $("#"+slideToStop).find(".t11_header").css('display', 'block');
    $("#"+slideToStop).find(".t11_header").text("");
    //TODO remove stop button and save quiz into the server(popup) 

    $(".current").find(".save_quiz").css("display", "inline-block"); 

    $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('disabled', 'disabled');
    $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('value', 'Start Quiz');

    $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('class', 'mcquestion_start_button');
    $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('id', 'mcquestion_start_button_'+slideToStop);

    $("#"+slideToStop).find("#slide_to_stop" ).attr('id', 'slide_to_activate');
    $(document).on('click', '#mcquestion_start_button_'+slideToStop, _startMcQuizButtonClicked);
    $("#"+slideToStop).find("#mcquestion_start_button_"+slideToStop).css("color", "#F76464");
    $("#"+slideToStop).find("#mcquestion_start_button_"+slideToStop).css("background-color", "#F8F8F8");
     
    // _showResultsToTeacher(results);
  };

  var _onQuizSessionCloseReceivedError = function(error){
    var received = JSON.stringify(error)
    console.log("_onQuizSessionCloseReceivedError, and value received is:  " + received);
  };

  var _statisticsMcQuizButtonClicked = function () {
    var marginTopDefault = 18; 
    var marginTopDefault2 = 24; 

    //find the number of slide 

    //if it is shown --> hide and move the button up  
    if(	$(".current").find(".mc_meter").css('display')=="block") {
      var marginTopPercentTxt = (marginTopDefault*parseInt($(".current").find(".mc_answer").length).toString())+"%";

      $(".current").find(".mc_meter").css('display', 'none');
      $(".current").find(".mcoption_label").css('display', 'none');

      if ($(".current").find("#slide_to_activate").val()) {
        slideToActivate = $(".current").find("#slide_to_activate").val();
        $("#" + startButton + "_" + slideToActivate).css("margin-top", marginTopPercentTxt);
      } else if ($(".current").find("#slide_to_stop").val()) { 
        slideToStop = $(".current").find("#slide_to_stop").val();
        $("#" + stopButton + "_" + slideToStop).css("margin-top", marginTopPercentTxt);
      }
    } else {
      //if it is hidden --> fill values, show statistics and move the button down 
      //create a new class called: VISH.Quiz.API.js having all methods for communication with 
      //VISH server
      // call a function that do periodical get's to keep updated statistics values  

      var marginTopPercentTxt = (marginTopDefault2*parseInt($(".current").find(".mc_answer").length).toString())+"%";

      //get values from the server , send the quiz_session_id

      //data must be received from the VISH Server 
      //var data = V.Quiz.API.getStatistics(quiz_session)
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

  var _saveQuizYesButtonClicked = function () {	
    V.Debugging.log("SaveQuizYes Button Clicked");	
    $(".current").find(".mcquestion_start_button").removeAttr('disabled');
    $(".current").find(".save_quiz").css("display", "none"); 	
    $(".current").find(".mcquestion_start_button").css("color", "blue");
    $(".current").find(".mcquestion_start_button").css("background-color", "buttonface");	
  };
    
    
  var _saveQuizNoButtonClicked = function () {
    V.Debugging.log("SaveQuizNo Button Clicked");	
    $(".current").find(".mcquestion_start_button").removeAttr('disabled');
    $(".current").find(".save_quiz").css("display", "none");
    $(".current").find(".mcquestion_start_button").css("color", "blue");
    $(".current").find(".mcquestion_start_button").css("background-color", "buttonface");
  };
    
    
    
  /*
  * Function called when the JSON object is received from the server 
  * {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
  * actions to do: calculate the vote's total sum
  * 
  */
  var _showResultsToParticipant = function (data, slide) {
    var greatestId;
    var greatest=0;	

    var votes;	
    var totalVotes =0;
    //calculate the vote's total sum and the greatest option voted 

    for (votes in data.results) {
      totalVotes 	+= parseInt(data.results[votes]);
      if(parseInt(data.results[votes])>greatest) {
        greatestId=votes;
        greatest=parseInt(data.results[votes]);
      } else {
        greatestId;
      } 
    }

    for (votes in data.results) {
      //calculate the percent of each option to show next to it
      var percent= ((((parseInt(data.results[votes]))/totalVotes))*100) ;
      var percentString = percent.toString()  + "%";
      var newnumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);
      //V.Debugging.log(" data result "+ (votes+1).toString() +" value " + data.results[votes]);
      // change the value for span css('width','xx%')
      $(".current").find("#mcoption"+(parseInt(votes)+1).toString()).css("width", percentString);
      $(".current").find("#mcoption_label_"+(parseInt(votes)+1).toString()).text(newnumber+"%");
    }

    var indexOfGreatestVoted = String.fromCharCode("a".charCodeAt(0) + parseInt(greatestId)); //creating index 

    $(".current").find("#mc_answer_"+ slide + "_option_" + indexOfGreatestVoted).css('color', 'blue');
    $(".current").find("#mc_answer_"+ slide + "_option_" + indexOfGreatestVoted).css('font-weight', 'bold');
    $(".current").find(".mc_meter").css('display', 'block');	
    $(".current").find(".mcoption_label").css('display', 'block');

    //remove mcquestion_right (trying to fit better the quiz) and extend mcquestion_left div
    $(".current").find(".mcquestion_right").remove();
    $(".current").find(".mcquestion_left").css('width', '95%');
    //  $(".current").find(".mc_meter").css('display', 'block');	
  };
    
    
  /*
  * Function called when the JSON object is received from the server 
  * {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
  * actions to do:  */
  var _showResultsToTeacher = function (data) {
    if(role=="logged") {
      var votes;	
      var totalVotes =0;
      //calculate the vote's total sum 
      for (votes in data.results) {
        totalVotes 	+= parseInt(data.results[votes]);
      }
      for (votes in data.results) {
        var percent= ((((parseInt(data.results[votes]))/totalVotes))*100) ;
        var percentString = percent.toString()  + "%";
        var newnumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);
        //V.Debugging.log(" data result "+ (votes+1).toString() +" value " + data.results[votes]);
        // change the value for span css('width','xx%')
        $(".current").find("#mcoption"+(parseInt(votes)+1).toString()).css("width", percentString);
        $(".current").find("#mcoption_label_"+(parseInt(votes)+1).toString()).text(newnumber+"%");
      }
    } else {
    	V.Debugging.log(" The User's role is not the correct");
    }
    $(".current").find(".mc_meter").css('display', 'block');	
    $(".current").find(".mcoption_label").css('display', 'block');
  };
    

	var _removeOptionsListener = function (slideToRemoveListeners) {
    var totalOptions = $(".current").find(".mc_answer").size();

    for(var i = 0; i<totalOptions; i++){
      //var next_num = i;
      var next_index = String.fromCharCode("a".charCodeAt(0) + (i)); //creating index 
      var overOptionZone = "#mc_answer_"+slideToRemoveListeners+"_option_"+ next_index;

      //changing the id of the element so the listener won't be able on that element	
      //TODO change class for removing events (hover) 
      $(overOptionZone).attr("id", "#mc_answer_"+slideToRemoveListeners+"_voted__option_"+ next_index);
    }
	};
	
	
  var _renderTrueFalseQuestion = function(element, template){
    var answers = new Array();
    var ret = "<div id='"+element['id']+"' class='truefalse_question'>";

    ret += "<div class='truefalse_question_container'>";
    ret += "<form class='truefalse_question_form' action='"+element['posturl']+"' method='post'>";
    ret+= "<table id='truefalse_quiz_table_1' class='truefalse_quiz_table'><tr><th>True</th><th>False</th><th> Question </th></tr>";

    for(var i = 0; i<element['questions'].length; i++){
      //saving correct answers 
      answers[i] =element['questions'][i]['answer'];
      ret +="<tr id='tr_question_"+(i+1)+"'>";
      ret +="<td id='td_true_"+(i+1)+"' class='td_true'>";
      ret += "<input type='radio' name='tf_radio_"+(i+1)+"' value='true'  id='radio_true_"+(i+1)+"'/></td>";
      ret += "<td id='td_false_"+(i+1)+"' class='td_false' >";
      ret += "<input type='radio' name='tf_radio_"+(i+1)+"' value='false' id='radio_false_"+(i+1)+"' /></td>";
      ret += "<td id='td_question_"+(i+1)+"' class='true_false_question_txt'><label>"+element['questions'][i]['text_question']+"?</label></td>";
      ret += "</tr>";
    }

    ret += "</table>";
    ret += "<input type='button' class='tfquestion_button' value='Send' id='tf_send_button'/>";
    ret += "</form>";
    ret += "</div>";

    trueFalseAnswers = answers;
    asnswers = [];
    VISH.Debugging.log("answer's array : " +trueFalseAnswers);
    return ret;
  }



  ////////////////////
  //VISH QUIZ RENDERER METHODS (Called from VISH.Renderer)
  ///////////////////

  var renderMcQuestion = function(element, template, slide, quiz_id){
    if(element.type==="mcquestion") {
      //depending on the role we use a diferent rederer function      
      user = V.SlideManager.getUser();
      userStatus = V.SlideManager.getUserStatus();
      role = user.role;
      //TODO where initialize this variable (here or )
      slideToVote = userStatus.quiz_active_session_id;
      //the object to be returned
      var obj;

      switch(role) {
        case "logged": 
          //render the slide for a logged user
          obj = _renderMcquestionLogged (element, template, slide, quiz_id); 
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
    } else if (element.type==="truefalsequestion") {
      obj=  _renderTrueFalseQuestion(element, template);
      return obj; 
    }
  };

  var renderOpenquestion = function(element, template){
    var ret = "<form action='"+element['posturl']+"' method='post' style='text-align:center;'>";
    ret += "<label class='question_name'>Name:  </label>";
    ret += "<textarea id='pupil_name' rows='1' cols='50' class='question_name_input' placeholder='Write your name here'></textarea>";
    ret += "<h2 class='question'> Question: "+element['question']+"? </h2>";        
    
    ret += "<label class='label_question'>Answer: </label>";
    ret += "<textarea id='question_answer' rows='5' cols='50' class='question_answer' placeholder='Write your answer here'></textarea>";
    
    ret += "<button type='button' class='question_button'>Send</button>";
    
    return ret;   
  };

    /**
   * Function to render a True False Question choice question form inside an article (a slide)
   * TODO Include in the VISH.Quiz?? ... think and ask Kike about it 
   * */
  
  /*var _renderTrueFalseQuestion = function(element, template){
    var next_num=0;
    var answers = new Array();
    var ret = "<div id='"+element['id']+"' class='truefalse_question'>";
    
    ret += "<div class='truefalse_question_container'>";
    ret += "<form class='truefalse_question_form' action='"+element['posturl']+"' method='post'>";
      ret+= "<table id='truefalse_quiz_table_1' class='truefalse_quiz_table'><tr><th>True</th><th>False</th><th> Question </th></tr>";
     
    for(var i = 0; i<element['questions'].length; i++){
    //saving correct answers 
    answers[i] =element['questions'][i]['answer'];
    
    ret +="<tr id='tr_question_"+(i+1)+"'>";
      ret +="<td id='td_true_"+(i+1)+"' class='td_true'>";
      ret += "<input type='radio' name='tf_radio_"+(i+1)+"' value='true' /></td>";
      ret += "<td id='td_false_"+(i+1)+"' class='td_false' >";
      ret += "<input type='radio' name='tf_radio_"+(i+1)+"' value='false'/></td>";
      ret += "<td id='td_question_"+(i+1)+"' class='true_false_question_txt'><label>"+element['questions'][i]['text_question']+"?</label></td>";
      ret += "</tr>";
    
    }
    
    ret += "</table>";
  
    ret += "<input type='button' class='tfquestion_button' value='Send'/>";

    ret += "</form>";
    
    
    ret += "</div>";
    
    trueFalseAnswers = answers;
    asnswers = [];
    VISH.Debugging.log("JSON object answer is: " +trueFalseAnswers);
    
    return ret;
  };
  
  */


  return {
    init:                             init,
    renderMcQuestion:                 renderMcQuestion,
    renderOpenquestion:               renderOpenquestion,
    enableInteraction:                enableInteraction,
    enableTrueFalseInteraction:       enableTrueFalseInteraction
  };
    
}) (VISH, jQuery);