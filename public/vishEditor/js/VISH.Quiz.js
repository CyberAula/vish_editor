VISH.Quiz = (function(V,$,undefined){
  
  var startButtonClass = "mcquestion_start_button";
  var stopButtonClass = "mcquestion_stop_button";
  var statisticsButtonClass = "mch_statistics_icon";

  var init = function(excursion){
    if (excursion.type=="quiz_simple") {
      _loadAnswerEvents();
    } else if(excursion.type=="presentation") {
      _loadEvents();
    }
    VISH.Quiz.Renderer.init(excursion);
    VISH.Quiz.API.init();
  };

  var prepareQuiz = function(){
    var excursion = VISH.SlideManager.getCurrentPresentation();

    $("." + statisticsButtonClass).hide();
    $("." + startButtonClass).show();

    if (excursion.type=="quiz_simple") {
      $("." + startButtonClass).val("Send");
    } else if(excursion.type=="presentation") {
      if(!VISH.User.isLogged()){
        $("." + startButtonClass).hide();
      }
    }
  }

  var _loadEvents = function(){
    $(document).on('click', "."+startButtonClass, _startMcQuizButtonClicked);
    $(document).on('click', "."+stopButtonClass, _onStopMcQuizButtonClicked);
    $(document).on('click', "."+statisticsButtonClass, _statisticsMcQuizButtonClicked);

    // $(document).on('click', ".mcquestion_save_yes_button", _saveQuizYesButtonClicked);
    // $(document).on('click', ".mcquestion_save_no_button", _saveQuizNoButtonClicked);
  };

  var _loadAnswerEvents = function(){
    $(document).on('click', "."+startButtonClass, _sendVote);
  };


  var _startMcQuizButtonClicked = function () {
    if(V.User.isLogged()){
      var quizId = $(VISH.Slides.getCurrentSlide()).attr("quizid");
      V.Quiz.API.postStartQuizSession(quizId,_onQuizSessionReceived,_OnQuizSessionReceivedError);
    }
  };
    
  var _onQuizSessionReceived = function(quiz_session_id){
    V.Debugging.log("_onQuizSessionReceived with  quiz_session_id: " + quiz_session_id);

    var quizUrlForSession ="http://"+window.location.host.toString() +"/quiz_sessions/";
    var url = quizUrlForSession + quiz_session_id;

    var current_slide = V.Slides.getCurrentSlide();
    var header = $(current_slide).find(".t11_header");

    var divURLShare = "<div class='url_share'><span><a target='blank_' href=" + url + ">"+url+"</a></span></div>";
    $(header).html(divURLShare);

     //Change Start Button
     var startButton = $(current_slide).find("." + startButtonClass);
     $(startButton).val("Stop Quiz");
     $(startButton).removeClass().addClass(stopButtonClass);

     //Show statictics button
     $("."+statisticsButtonClass).show();

     //Store quiz_session_id in the quiz element
     $(current_slide).find("div.multiplechoicequestion").attr("quizSessionId",quiz_session_id);
  }

  var _OnQuizSessionReceivedError = function(error){
     var received = JSON.stringify(error);
     V.Debugging.log("_OnQuizSessionReceivedError:  " + received);
  };


  var _onStopMcQuizButtonClicked = function () {
    console.log("_onStopMcQuizButtonClicked");
    _stopAndSaveQuiz();
  };

  var _stopAndSaveQuiz = function(quizName) { 
    var current_slide = VISH.Slides.getCurrentSlide();
    var header = $(current_slide).find(".t11_header");

    var quizSessionActiveId =  $(current_slide).find("div.multiplechoicequestion").attr("quizSessionId");
    if(!quizName){
      quizName = "Unknown";
    }
    $(header).hide();

    //Change Stop Button
    var stopButton = $(current_slide).find("." + stopButtonClass);
    $(stopButton).val("Start Quiz");
    $(stopButton).removeClass().addClass(startButtonClass);

    V.Quiz.API.deleteQuizSession(quizSessionActiveId,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError, quizName);
  };




 /* Function executed when the studen has pressed the send vote button
  * has to send the option choosen to the server and wait for total results till that moment. 
  */ 
  var _sendVote = function (event) {
    var answer = $(VISH.Slides.getCurrentSlide()).find("input:radio[name='mc_radio']:checked'").val();
    if(typeof answer !== "undefined") {
       var quizSessionActiveId = VISH.SlideManager.getOptions()["quiz_active_session_id"];
       V.Quiz.API.putQuizSession(answer, quizSessionActiveId, _onQuizVotingSuccessReceived, _OnQuizVotingReceivedError);
      }
  };
    

  var _onQuizVotingSuccessReceived = function(data){ 
    var quizSessionActiveId = VISH.SlideManager.getOptions()["quiz_active_session_id"];
    V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _onQuizSessionResultsReceived, _onQuizSessionResultsReceivedError);
  };

  var _OnQuizVotingReceivedError = function(error){
    var received = JSON.stringify(error);
    V.Debugging.log("_OnQuizVotingReceivedError, and value received is:  " + received);
  };

  var _onQuizSessionResultsReceived = function(data) {
    var received = JSON.stringify(data);
     //  var data =  {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
      _showResultsToParticipant(data);
    $(VISH.Slides.getCurrentSlide()).find(".mch_inputs_wrapper").remove();
  };

  var _onQuizSessionResultsReceivedError = function(error) {
    var received = JSON.stringify(error)
    V.Debugging.log("_onQuizSessionResultsReceivedError, and value received is:  " + received);
  };
    

  var _onQuizSessionCloseReceived = function(results){
    // slideToStop = $(".current").find("#slide_to_stop").val();
    // //TODO just only hide not remove ... but disappear the element so all the remainder elements go up
    // //  $("#"+slideToStop).find(".t11_header").css('display', 'block');
    // $("#"+slideToStop).find(".t11_header").text("");
    // //TODO remove stop button and save quiz into the server(popup) 
    // var quiz_active_session_id = $(".current").find(".quiz_session_id").val();
    // V.Quiz.API.getQuizSessionResults(quiz_active_session_id, _showResultsToTeacher, _onQuizSessionResultsReceivedError);

    // $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('disabled', 'disabled');
    // $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('value', 'Start Quiz');

    // $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('class', 'mcquestion_start_button');
    // $("#"+slideToStop).find("#mcquestion_stop_button_"+slideToStop).attr('id', 'mcquestion_start_button_'+slideToStop);

    // $("#"+slideToStop).find("#slide_to_stop" ).attr('id', 'slide_to_activate');

    // $(document).on('click', '.mcquestion_start_button', _startMcQuizButtonClicked);

    // $("#"+slideToStop).find("#mcquestion_start_button_"+slideToStop).css("color", "#F76464");
    // $("#"+slideToStop).find("#mcquestion_start_button_"+slideToStop).css("background-color", "#F8F8F8");

    // $(".current").find(".mcquestion_start_button").removeAttr('disabled');
    // $(".current").find(".save_quiz").css("display", "none");  
    // $(".current").find(".mcquestion_start_button").css("color", "blue");
    // $(".current").find(".mcquestion_start_button").css("background-color", "buttonface"); 

    // $(".current").find(".quiz_session_id").attr("class", "quiz_id_to_activate"); 
    // $(".current").find(".quiz_id_to_activate").val(quizIdToStartSession); 
  };

  var _onQuizSessionCloseReceivedError = function(error){
    var received = JSON.stringify(error);
    V.Debugging.log("_onQuizSessionCloseReceivedError, and value received is:  " + received);
  };

  var _statisticsMcQuizButtonClicked = function () {
    var marginTopDefault = 18; 
    var marginTopDefault2 = 24; 

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
  * Data format
  * {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
  */
  var _showResultsToParticipant = function (data) {
    var current_slide = VISH.Slides.getCurrentSlide();
    var greatestId;
    var greatest=0; 

    var votes;  
    var totalVotes =0;
    var index = "";
    
    for (votes in data.results) {
           totalVotes  += data.results[votes];
      if(data.results[votes]>greatest) {
        greatestId=votes;
        greatest=data.results[votes];
      } else {
        greatestId;
      } 
    }

    for (votes in data.results) {
      var percent= ((((parseInt(data.results[votes]))/totalVotes))*100) ;
      var percentString = percent.toString()  + "%";
      var newnumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);
      $(".current").find("#mcoption_"+votes).css("width", percentString);
      $(".current").find("#mcoption_label_"+votes).text(newnumber+"%");
    }

    var indexOfGreatestVoted = String.fromCharCode(greatestId); //creating index 

    // $(current_slide).find("#mc_answer_"+ slideToVote + "_option_" + indexOfGreatestVoted).css('color', 'blue');
    // $(current_slide).find("#mc_answer_"+ slideToVote + "_option_" + indexOfGreatestVoted).css('font-weight', 'bold');
    $(current_slide).find(".mc_meter").css('display', 'block');  
    $(current_slide).find(".mcoption_label").css('display', 'block');

    $(".current").find(".mcquestion_right").remove();
    $(".current").find(".mcquestion_left").css('width', '95%'); 
  };


 /*
  * Data format 
  * {"quiz_session_id":"444", "quiz_id":"4", "results" : ["23", "3", "5", "1", "6"]};
  */
  var _showResultsToTeacher = function (data) { 
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


  /*
  Must call API's method to destroy the quiz's session
  */
  // var _saveQuizYesButtonClicked = function () { 
  //   var quizSessionActiveId =  $(".current").find("#quiz_session_id").val();
  //   var quizNameForSaving = $(".current").find(".save_results_quiz").val();
  //   V.Quiz.API.deleteQuizSession(quizSessionActiveId,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError, quizNameForSaving);
  //   $(".current").find(".mcquestion_start_button").removeAttr('disabled');
  //   $(".current").find(".save_quiz").css("display", "none");  
  //   $(".current").find(".mcquestion_start_button").css("color", "blue");
  //   $(".current").find(".mcquestion_start_button").css("background-color", "buttonface"); 
  // };
    
    
  // var _saveQuizNoButtonClicked = function () {
  //   var quizSessionActiveId =  $(".current").find("#quiz_session_id").val();  
  //   $(".current").find(".mcquestion_start_button").removeAttr('disabled');
  //   $(".current").find(".save_quiz").css("display", "none");
  //   $(".current").find(".mcquestion_start_button").css("color", "blue");
  //   $(".current").find(".mcquestion_start_button").css("background-color", "buttonface");
  //   V.Quiz.API.deleteQuizSession(quizSessionActiveId,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError);
  //   $(".current").find(".mcquestion_start_button").removeAttr('disabled');
  //   $(".current").find(".save_quiz").css("display", "none");  
  //   $(".current").find(".mcquestion_start_button").css("color", "blue");
  //   $(".current").find(".mcquestion_start_button").css("background-color", "buttonface"); 
  // };



  return {
    init              : init, 
    prepareQuiz       : prepareQuiz
  };
    
}) (VISH, jQuery);
