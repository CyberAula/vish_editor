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
  //var stopButtonClass = "mcquestion_stop_button";
  var stopSessionButtonClass = "quiz_session_stop_button";
  var statisticsButtonClass = "mch_statistics_icon";
  var tabQuizSessionContent = "tab_quiz_session_content";

  var init = function(presentation){
  // V.Debugging.log("presentation value: " + presentation);
     
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
/*called when quiz has been rendered */
var setQuizEvents = function() {

     $("a#launchQuizFancybox").fancybox({
      'autoDimensions' : false,
      'scrolling': 'no',
      'width': '80%',
      'height': '80%',
      'padding': 0,
      "onStart"  : function(data) {
        VISH.Quiz.loadQuizSessionTab('tab_quiz_session');
      }
    });

};
/*called when start a Quiz session with default tab (*/
var loadQuizSessionTab = function (tab_id) {
    // TODO ask Kike 
    //copied from VISH.Editor.util.js consider to use that class to di this function
    // first remove the walkthrough if open
    $('.joyride-close-tip').click();

    //hide previous tab
    $(".fancy_tab_content").hide();
    //show content
    $("#" + tab_id + "_content").show();

    //deselect all of them
    $(".fancy_tab").removeClass("fancy_selected");
    //select the correct one
    $("#" + tab_id).addClass("fancy_selected");

    //hide previous help button
    $(".help_in_fancybox").hide();
    //show correct one
    $("#"+ tab_id + "_help").show();
  switch (tab_id) {

    case "tab_quiz_session": 
          _startMcQuizButtonClicked();
    break;

    case "tab_quiz_statistics":
        VISH.Debugging.log("quiz_statistics tab click detected");
       // V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _showResults, _onQuizSessionResultsReceivedError);
       _onStatisticsQuizButtonClicked();
    break;

    default:
      VISH.Debugging.log("other tab click detected");
    break;

}
};

  /////////////////////////
  //// QUIZ MODE: QUESTION
  ////////////////////////

  var _loadEvents = function(){
    // $(document).on('click', "."+startButtonClass, _startMcQuizButtonClicked);
    $(document).on('click', "."+stopSessionButtonClass, _onStopMcQuizButtonClicked);
    $(document).on('click', "."+statisticsButtonClass, _onStatisticsQuizButtonClicked);

  };
/* Chek if user is logged in and call VISH's API for starting a voting) */
  var _startMcQuizButtonClicked = function () {
    
    if(V.User.isLogged()){
      var quizId = $(VISH.Slides.getCurrentSlide()).find(".quizId").val();

      V.Quiz.API.postStartQuizSession(quizId,_onQuizSessionReceived,_OnQuizSessionReceivedError);
    }
  };

/* must construct the URL and add an QR code inside the quiz_session tab */
  var _onQuizSessionReceived = function(quiz_session_id){
    V.Debugging.log("_onQuizSessionReceived with  quiz_session_id: " + quiz_session_id);

    var quizUrlForSession ="http://"+window.location.host.toString() +"/quiz_sessions/";
    var url = quizUrlForSession + quiz_session_id;

    var current_slide = V.Slides.getCurrentSlide();
 
    var header = $("#"+tabQuizSessionContent).find(".quiz_session_header");

    var divURLShare = "<div class='url_share'><span><a target='blank_' href=" + url + ">"+url+"</a></span></div>";
    $(header).html(divURLShare);
    $("#"+tabQuizSessionContent).find(".quiz_session_qrcode_container").children().remove();
    $("#"+tabQuizSessionContent).find(".quiz_session_qrcode_container").qrcode(url.toString());

    _hideResultsUI();

    //Change Start Button ?
    var startButton = $(current_slide).find("." + startButtonClass);
    $(startButton).val("Stop Quiz");
    //$(startButton).removeClass().addClass(stopSessionButtonClass);

   // $(current_slide).find("div.multiplechoicequestion").attr("quizSessionId",quiz_session_id);
   //put quiz_session_id value in the input hidden for stopping quiz session
    $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value",quiz_session_id);
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

    var header = $("#"+tabQuizSessionContent).find(".quiz_session_header");
   // var quizSessionActiveId =  $(current_slide).find("div.multiplechoicequestion").attr("quizSessionId");
    var quizSessionActiveId =  $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value");
    if(!quizName){
      quizName = "Unknown";
    }

   //Change Stop Button
    var stopButton = $(current_slide).find("." + stopSessionButtonClass);
    //$(stopButton).val("Start Quiz");
    $(stopButton).removeClass().addClass(startButtonClass);

    V.Quiz.API.deleteQuizSession(quizSessionActiveId,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError, quizName);
  };

  var _onQuizSessionCloseReceived = function(results){
         V.Debugging.log("_onQuizSessionCloseReceived");
//    var quizSessionActiveId =  $(VISH.Slides.getCurrentSlide()).find("div.multiplechoicequestion").attr("quizSessionId");
    var quizSessionActiveId = $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value");
    loadQuizSessionTab('tab_quiz_statistics');
    //V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _showResults, _onQuizSessionResultsReceivedError);
  };

  var _onQuizSessionCloseReceivedError = function(error){
    var received = JSON.stringify(error);
    V.Debugging.log("_onQuizSessionCloseReceivedError, and value received is:  " + received);
  };
/* Called when stop quiz session and when statistics tab session clicked*/
  var _onStatisticsQuizButtonClicked = function () {
    var all_quiz = $(VISH.Slides.getCurrentSlide()).find("div.mcquestion_body").clone();
    var question = all_quiz.find(".question");
    var form = all_quiz.find(".mcquestion_form");

    V.Debugging.log("_onStatisticsQuizButtonClicked " );
    if($(".quiz_statistics_content").find(".question")) {
      $(".quiz_statistics_content").find(".question").remove();
    }
    if ($(".quiz_statistics_content").find(".mcquestion_form")) {
      $(".quiz_statistics_content").find(".mcquestion_form").remove();
    }
    //clone all the question content to show into fancybox 
 
    $(".quiz_statistics_content").find(".quiz_question_container").append(question);
    $(".quiz_statistics_content").find(".quiz_options_container").append(form);
    $(".quiz_statistics_content").find("div.mcquestion_body").addClass("quiz_in_satistics");
    //$(".quiz_statistics_content").find(".mcquestion_form").removeClass().addClass("mcquestion_form_in_fancybox");
    
 
  if( $(".quiz_statistics_content").find(".mc_meter").css('display')=="block") {
      _hideResultsUI();
    } else {
      var quizSessionActiveId =  $(VISH.Slides.getCurrentSlide()).find("div.multiplechoicequestion").attr("quizSessionId");
      V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _onQuizSessionResultsReceived, _onQuizSessionResultsReceivedError);
    }
    /* if( $(VISH.Slides.getCurrentSlide()).find(".mc_meter").css('display')=="block") {
      _hideResultsUI();
    } else {
      var quizSessionActiveId =  $(VISH.Slides.getCurrentSlide()).find("div.multiplechoicequestion").attr("quizSessionId");
      V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _onQuizSessionResultsReceived, _onQuizSessionResultsReceivedError);
    } */
  };

  var _hideResultsUI = function(){
    $(".quiz_statistics_content").find(".mc_meter").css('display','none');
    $(".quiz_statistics_content").find(".mcoption_label").css('display','none');
    /*
    $(VISH.Slides.getCurrentSlide()).find(".mc_meter").css('display','none');
    $(VISH.Slides.getCurrentSlide()).find(".mcoption_label").css('display','none');
    */
  }

  var _showResultsUI = function(){
    $(".quiz_statistics_content").find(".mc_meter").css('display','block');
    $(".quiz_statistics_content").find(".mcoption_label").css('display','block');
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
    init                  : init, 
    prepareQuiz           : prepareQuiz,
    getQuizMode           : getQuizMode, 
    setQuizEvents         : setQuizEvents, 
    loadQuizSessionTab    : loadQuizSessionTab
  };
    
}) (VISH, jQuery);

