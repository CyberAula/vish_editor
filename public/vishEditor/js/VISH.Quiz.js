VISH.Quiz = (function(V,$,undefined){
  
  var quizMode;

  var mcOptionsHash = new Array();
  mcOptionsHash['a'] = 0;
  mcOptionsHash['b'] = 1;
  mcOptionsHash['c'] = 2;
  mcOptionsHash['d'] = 3;
  mcOptionsHash['e'] = 4;
  mcOptionsHash['f'] = 5;

  var startButtonClass = "mcquestion_start_button";
  var stopButtonClass = "mcquestion_stop_button";
  var statisticsButtonClass = "mch_statistics_icon";

  var init = function(presentation){
      V.Debugging.log("presentation type: " + presentation.type);
    if (presentation.type=="quiz_simple"){
      quizMode = "answer";
       _loadAnswerEvents();
    } else {
      quizMode = "question";
      _loadEvents();
    }

    VISH.Quiz.Renderer.init();
    VISH.Quiz.API.init();
  };

  var getQuizMode = function(){
    return quizMode;
  }

  var prepareQuiz = function(){
    $("." + statisticsButtonClass).hide();

    if (quizMode=="answer") {
      $("." + startButtonClass).show();
      $("." + startButtonClass).val("Send");
    } else if(quizMode=="question") {
      if(!VISH.User.isLogged()){
        $("." + startButtonClass).hide();
      } else {
        $("." + startButtonClass).show();
      }
    }
  }


  /////////////////////////
  //// QUIZ MODE: QUESTION
  ////////////////////////

  var _loadEvents = function(){
    $(document).on('click', "."+startButtonClass, _startMcQuizButtonClicked);
    $(document).on('click', "."+stopButtonClass, _onStopMcQuizButtonClicked);
    $(document).on('click', "."+statisticsButtonClass, _statisticsMcQuizButtonClicked);
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
    //var header = $(current_slide).find(".t11_header");
    var header = $(current_slide).find(".mcquestion_header");

    var divURLShare = "<div class='url_share'><span><a target='blank_' href=" + url + ">"+url+"</a></span></div>";
    $(header).html(divURLShare);

    $(header).show();

    _hideResultsUI();

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
    _stopAndSaveQuiz();
  };

  var _stopAndSaveQuiz = function(quizName) { 
    var current_slide = VISH.Slides.getCurrentSlide();
    //var header = $(current_slide).find(".t11_header");
    var header = $(current_slide).find(".mcquestion_header");
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

  var _onQuizSessionCloseReceived = function(results){
    var quizSessionActiveId =  $(VISH.Slides.getCurrentSlide()).find("div.multiplechoicequestion").attr("quizSessionId");
    V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _showResults, _onQuizSessionResultsReceivedError);
  };

  var _onQuizSessionCloseReceivedError = function(error){
    var received = JSON.stringify(error);
    V.Debugging.log("_onQuizSessionCloseReceivedError, and value received is:  " + received);
  };

  var _statisticsMcQuizButtonClicked = function () {
    if( $(VISH.Slides.getCurrentSlide()).find(".mc_meter").css('display')=="block") {
      _hideResultsUI();
    } else {
      var quizSessionActiveId =  $(VISH.Slides.getCurrentSlide()).find("div.multiplechoicequestion").attr("quizSessionId");
      V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _onQuizSessionResultsReceived, _onQuizSessionResultsReceivedError);
    }
  };

  var _hideResultsUI = function(){
    $(VISH.Slides.getCurrentSlide()).find(".mc_meter").css('display','none');
    $(VISH.Slides.getCurrentSlide()).find(".mcoption_label").css('display','none');
  }

  var _showResultsUI = function(){
  $(VISH.Slides.getCurrentSlide()).find(".mc_meter").css('display','block');
    $(VISH.Slides.getCurrentSlide()).find(".mcoption_label").css('display','block');
  }


  /////////////////////////
  //// QUIZ MODE: ANSWERS
  ////////////////////////

  var _loadAnswerEvents = function(){
    $(document).on('click', "."+startButtonClass, _sendVote);
  };

  var _sendVote = function (event) {
    var answer = $(VISH.Slides.getCurrentSlide()).find("input:radio[name='mc_radio']:checked'").val();
    if(typeof answer !== "undefined") {
       var quizSessionActiveId = VISH.SlideManager.getOptions()["quiz_active_session_id"];
       V.Quiz.API.putQuizSession(answer, quizSessionActiveId, _onQuizVotingSuccessReceived, _OnQuizVotingReceivedError);
       $("."+startButtonClass).hide();
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



  /////////////////////////
  //// COMMON METHODS
  ////////////////////////

  var _onQuizSessionResultsReceived = function(data) {
    _showResults(data);
  };

  var _onQuizSessionResultsReceivedError = function(error) {
    var received = JSON.stringify(error)
    V.Debugging.log("_onQuizSessionResultsReceivedError, and value received is:  " + received);
  };
    
 /*
  * Data format 
  */
  var _showResults = function (data) {
     var maxWidth = 70;
     var scaleFactor = maxWidth/100;

     //Reset values
      var totalVotes =0;
      $(VISH.Slides.getCurrentSlide()).find(".mc_meter").css("width", "0%");
      $(VISH.Slides.getCurrentSlide()).find(".mcoption_label").text("0%");

      for (option in data.results) {
        if((option in mcOptionsHash)){
          var votes = data.results[option];
          totalVotes  += votes;
        } 
      }

      if(totalVotes>0){
         for (option in data.results) {
          if((option in mcOptionsHash)){
            var index = mcOptionsHash[option];
            var votes = data.results[option];
            var percent= (votes/totalVotes)*100;
            var percentString = (percent*scaleFactor).toString()  + "%";
            var roundedNumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);

            if(typeof $(VISH.Slides.getCurrentSlide()).find(".mc_meter")[index] != "undefined"){
                $($(VISH.Slides.getCurrentSlide()).find(".mc_meter")[index]).css("width", percentString);
                $($(VISH.Slides.getCurrentSlide()).find(".mcoption_label")[index]).text(roundedNumber+"%");
                $($(VISH.Slides.getCurrentSlide()).find(".mc_meter")[index]).addClass("mcoption_" +option );
             }
          }
        }
      }

      _showResultsUI();
  };


  return {
    init              : init, 
    prepareQuiz       : prepareQuiz,
    getQuizMode       : getQuizMode
  };
    
}) (VISH, jQuery);

