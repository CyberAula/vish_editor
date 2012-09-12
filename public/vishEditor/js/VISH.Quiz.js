VISH.Quiz = (function(V,$,undefined){
  var slideToActivate;
  var slideToStop;
  var slideToVote;
  var quizIdToStartSession;
  var quizUrlForSession =" http://"+window.location.host.toString() +"/quiz_sessions/";
  var quizStatus = {};
  var startButton = "mcquestion_start_button";
  var stopButton = "mcquestion_stop_button";


  var init = function(excursion){
    var options = VISH.SlideManager.getOptions();
    
    if (excursion.type=="quiz_simple") {
      if(options['quiz_active_session_id']) {
          quizStatus.quiz_active_session_id = options['quiz_active_session_id'];
           _activateStudentInteraction();
      } 
    } else if(excursion.type=="presentation") {
      if(VISH.User.isLogged()){
        $(".mcquestion_start_button").show();
        _loadEvents();
      } else {
        $(".mcquestion_start_button").hide();
      }
    }

    VISH.Quiz.Renderer.init(quizStatus);
    VISH.Quiz.API.init();
  };

  var _loadEvents = function(){      
    var myInput = $(".current").find("input[class='save_results_quiz']"); 

    $(document).on('click', ".mcquestion_start_button", _startMcQuizButtonClicked);
    $(document).on('click', ".mch_statistics_icon", _statisticsMcQuizButtonClicked);

    $(document).on('click', ".mcquestion_save_yes_button", _saveQuizYesButtonClicked);
    $(document).on('click', ".mcquestion_save_no_button", _saveQuizNoButtonClicked);

    //TODO correct this , because doesn't avoid the press enter action instead pressed ok button for saving
    $(myInput).keydown(function(event) {
      V.Debugging.log("event.keyCode  =" + event.keyCode);
      event.preventDefault();
      if(event.keyCode == 13) {
        V.Debugging.log("event.keyCode  =" + event.keyCode);
        if(($(myInput).val()!="")&& ($(myInput).val()!="write a name for saving")) {
          _saveQuizYesButtonClicked();
          return false;
        } else {
          // alert("You must enter some text option.");  
        }
      }
    }); 
  };

    
  /*
  * Function will be call when a teacher wants to start a voting or opinion pull
  * so must do an post to the ViSH server, 
  */

  var _activateLoggedInteraction = function () {
    var startButton = '#mcquestion_start_button_'+slideToActivate;
    var statisticsButton = '#mch_statistics_button_'+slideToActivate;
    var saveQuizYesButton = '#mcquestion_save_yes_button_'+slideToActivate;
    var saveQuizNoButton = '#mcquestion_save_no_button_'+slideToActivate;       
    $(document).on('click', startButton, _startMcQuizButtonClicked);
    $(document).on('click', statisticsButton, _statisticsMcQuizButtonClicked);
  };
    
    
  /*
   * Function activate interactive elements in the Quiz for a student who is going
   * to participate in a polling process 
   */   
  var _activateStudentInteraction = function () {
    var sendVoteButton = '.mcquestion_send_vote_button';
   
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
    var quiz_id =  $(".current").find(".quiz_id_to_activate").val();
    V.Quiz.API.postStartQuizSession(quiz_id,_onQuizSessionReceived,_OnQuizSessionReceivedError);
  };


  var _onQuizSessionReceived = function(quiz_session_id){
    //V.Debugging.log("returned value is (quiz_Session_id?): " + quiz_session_id);
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
   
    //TODO improve the share URL method meanwhile remove element to share

    //$(".current").find("#url_share_"+slideToPlay).append(shareButton);
    //$(".current").find("#url_share_"+slideToPlay).append(shareContainerIcons);
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
    $(".current").find(".quiz_id_to_activate").attr("id", "quiz_session_id"); 
    $(".current").find("#quiz_session_id").attr("value", quiz_session_id);
    $(".current").find("#quiz_session_id").attr("class", "quiz_session_id");
    //adding listeners for different events

    //appear share buttons when mouse over share button
    $(".current").on("mouseenter", "#share_icon_"+slideToPlay, function(event){
    event.preventDefault();//setQuizToActivate
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

   // $(document).on('click', '#mcquestion_stop_button_'+slideToPlay, _onStopMcQuizButtonClicked);
    $(document).on('click', '.mcquestion_stop_button', _onStopMcQuizButtonClicked);

    //hide save quiz div if it has been shown before
    if($(".current").find(".save_quiz").css("display")=="inline-block"){
      $(".current").find(".save_quiz").css("display", "none"); 
    }
  }

  var _OnQuizSessionReceivedError = function(error){
     var received = JSON.stringify(error);
    V.Debugging.log("_OnQuizSessionReceivedError:  " + received);
  };

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
       var quiz_active_session_id = $(".current").find("#quiz_active_session_id").val();
       V.Quiz.API.putQuizSession(answer, quiz_active_session_id, _onQuizVotingSuccessReceived, _OnQuizVotingReceivedError);
      }
  };
    

  var _onQuizVotingSuccessReceived = function(data){ 
    var quiz_active_session_id = $(".current").find("#quiz_active_session_id").val();
    V.Quiz.API.getQuizSessionResults(quiz_active_session_id, _onQuizSessionResultsReceived, _onQuizSessionResultsReceivedError);
  };

  var _OnQuizVotingReceivedError = function(error){
    var received = JSON.stringify(error);
    V.Debugging.log("_OnQuizVotingReceivedError, and value received is:  " + received);
  };

  var _onQuizSessionResultsReceived = function(data) {
      var received = JSON.stringify(data);
      //V.Debugging.log("_onQuizSessionResultsReceived and data received is: " + received);

    //  var data =  {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
      _showResultsToParticipant(data, slideToVote);

    //remove input radio 
      $(".current").find(".mc_radio").remove();
      $(".current").find("#mcquestion_send_vote_button_"+slideToVote).remove();

    // update values to span css('width','xx%') ..it will be done by the function _showResultsToParticipant
    /*var data =  {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
    _showResultsToParticipant(data); */

    //for avoid bring out when mouse over option
      _removeOptionsListener(slideToVote);
  };

  var _onQuizSessionResultsReceivedError = function(error) {
    var received = JSON.stringify(error)
    V.Debugging.log("_onQuizSessionResultsReceivedError, and value received is:  " + received);
  };


  /*
  *called for a teacher who wants to stop a voting 
  */
  var _onStopMcQuizButtonClicked = function () {
    //first show save results  div (put a name for saving)
    $(".current").find(".save_quiz").css("display", "inline-block"); 
    //then wait answer (yes or not) depending on that we put name or not 
  };
    

  var _onQuizSessionCloseReceived = function(results){
    slideToStop = $(".current").find("#slide_to_stop").val();
    //TODO just only hide not remove ... but disappear the element so all the remainder elements go up
    //  $("#"+slideToStop).find(".t11_header").css('display', 'block');
    $("#"+slideToStop).find(".t11_header").text("");
    //TODO remove stop button and save quiz into the server(popup) 
    var quiz_active_session_id = $(".current").find(".quiz_session_id").val();
    V.Quiz.API.getQuizSessionResults(quiz_active_session_id, _showResultsToTeacher, _onQuizSessionResultsReceivedError);

    $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('disabled', 'disabled');
    $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('value', 'Start Quiz');

    $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('class', 'mcquestion_start_button');
    $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('id', 'mcquestion_start_button_'+slideToStop);

    $("#"+slideToStop).find("#slide_to_stop" ).attr('id', 'slide_to_activate');

    $(document).on('click', '.mcquestion_start_button', _startMcQuizButtonClicked);

    $("#"+slideToStop).find("#mcquestion_start_button_"+slideToStop).css("color", "#F76464");
    $("#"+slideToStop).find("#mcquestion_start_button_"+slideToStop).css("background-color", "#F8F8F8");

    $(".current").find(".mcquestion_start_button").removeAttr('disabled');
    $(".current").find(".save_quiz").css("display", "none");  
    $(".current").find(".mcquestion_start_button").css("color", "blue");
    $(".current").find(".mcquestion_start_button").css("background-color", "buttonface"); 

    $(".current").find(".quiz_session_id").attr("class", "quiz_id_to_activate"); 
    $(".current").find(".quiz_id_to_activate").val(quizIdToStartSession); 
  };

  var _onQuizSessionCloseReceivedError = function(error){
    var received = JSON.stringify(error);
    V.Debugging.log("_onQuizSessionCloseReceivedError, and value received is:  " + received);
  };

  var _statisticsMcQuizButtonClicked = function () {
    var marginTopDefault = 18; 
    var marginTopDefault2 = 24; 

    //find the number of slide setQuizToActivate
    //if it is shown --> hide and move the button up  
    if( $(".current").find(".mc_meter").css('display')=="block") {
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
   
          //
           var quiz_active_session_id = $(".current").find(".quiz_session_id").val();
           V.Quiz.API.getQuizSessionResults(quiz_active_session_id, _showResultsToTeacher, _onQuizSessionResultsReceivedError);

           var marginTopPercentTxt = (marginTopDefault2*parseInt($(".current").find(".mc_answer").length).toString())+"%";

      //  var data =  {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
      

        if ($(".current").find("#slide_to_activate").val()) {
          //try to read values from 
          slideToActivate = $(".current").find("#slide_to_activate").val();
          $("#" + startButton + "_" + slideToActivate).css("margin-top", marginTopPercentTxt);
        } else  if ($(".current").find("#slide_to_stop").val()) {
          slideToStop = $(".current").find("#slide_to_stop").val();
          $("#" + stopButton + "_" + slideToStop).css("margin-top", marginTopPercentTxt);
        }
      }
  };

/*
Must call API's method to destroy the quiz's session
*/
  var _saveQuizYesButtonClicked = function () { 
    var quizSessionActiveId =  $(".current").find("#quiz_session_id").val();
    var quizNameForSaving = $(".current").find(".save_results_quiz").val();
    V.Quiz.API.deleteQuizSession(quizSessionActiveId,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError, quizNameForSaving);
    $(".current").find(".mcquestion_start_button").removeAttr('disabled');
    $(".current").find(".save_quiz").css("display", "none");  
    $(".current").find(".mcquestion_start_button").css("color", "blue");
    $(".current").find(".mcquestion_start_button").css("background-color", "buttonface"); 
  };
    
    
  var _saveQuizNoButtonClicked = function () {
        //TODO change to class insted of id
    var quizSessionActiveId =  $(".current").find("#quiz_session_id").val();
    
    $(".current").find(".mcquestion_start_button").removeAttr('disabled');
    $(".current").find(".save_quiz").css("display", "none");
    $(".current").find(".mcquestion_start_button").css("color", "blue");
    $(".current").find(".mcquestion_start_button").css("background-color", "buttonface");

    V.Quiz.API.deleteQuizSession(quizSessionActiveId,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError);
    //TODO call a function that do this ('cause there are duplicated code)
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
    var index = "";
    //calculate the vote's total sum and the greatest option voted 
    
    for (votes in data.results) {
      //votes is the letter (a, b , c ... ) in order received by server.
           totalVotes  += data.results[votes];
      if(data.results[votes]>greatest) {
        greatestId=votes;
        greatest=data.results[votes];
      } else {
        greatestId;
      } 
    }

    for (votes in data.results) {
      //calculate the percent of each option to show next to it
      var percent= ((((parseInt(data.results[votes]))/totalVotes))*100) ;
      var percentString = percent.toString()  + "%";
      var newnumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);
      $(".current").find("#mcoption_"+votes).css("width", percentString);
      $(".current").find("#mcoption_label_"+votes).text(newnumber+"%");
    }

    //var indexOfGreatestVoted = String.fromCharCode("a".charCodeAt(0) + parseInt(greatestId)); //creating index 
    var indexOfGreatestVoted = String.fromCharCode(greatestId); //creating index 

    $(".current").find("#mc_answer_"+ slideToVote + "_option_" + indexOfGreatestVoted).css('color', 'blue');
    $(".current").find("#mc_answer_"+ slideToVote + "_option_" + indexOfGreatestVoted).css('font-weight', 'bold');
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
  * actions to do: show results received by server and  do a bucle for ask more results every X seconds?*/
  var _showResultsToTeacher = function (data) {
     // var received = JSON.stringify(data)
     // V.Debugging.log("_showResultsToTeacher and data is: " + received); 
      var votes;  
      var totalVotes =0;
      //calculate the vote's total sum 
      for (votes in data.results) {
        totalVotes  += parseInt(data.results[votes]);
      }
      for (votes in data.results) {

         if(data.results[votes]!=0) { 
            var percent= ((((parseInt(data.results[votes]))/totalVotes))*100) ;
            var percentString = percent.toString()  + "%";
            var newnumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);
           //   $(".current").find("#mcoption_"+votes).css("width", percentString);
           //  $(".current").find("#mcoption_label_"+votes).text(newnumber+"%");
          }
          else {
              var percentString = "0%";
              var newnumber = 0;

          }
          $(".current").find("#mcoption_"+votes).css("width", percentString);
          $(".current").find("#mcoption_label_"+votes).text(newnumber+"%");
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


  var getQuizStatus = function(){
    return quizStatus;
  };


  var setQuizToActivate = function (quizIdToStart)  {
    quizIdToStartSession = quizIdToStart;
  };

  var getQuizIdToStartSession = function(){
    return quizIdToStartSession;
  };  


  var setSlideToVote = function (slide) {
    slideToVote = slide; 
  };

  return {
    getQuizStatus               : getQuizStatus,
    init                        : init, 
    setQuizToActivate           : setQuizToActivate, 
    getQuizIdToStartSession     : getQuizIdToStartSession, 
    setSlideToVote              : setSlideToVote
  };
    
}) (VISH, jQuery);
