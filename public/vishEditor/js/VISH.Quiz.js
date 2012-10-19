VISH.Quiz = (function(V,$,undefined){
  
  var quizMode;

  var mcOptionsHash = new Array();
  mcOptionsHash['a'] = 0;
  mcOptionsHash['b'] = 1;
  mcOptionsHash['c'] = 2;
  mcOptionsHash['d'] = 3;
  mcOptionsHash['e'] = 4;
  mcOptionsHash['f'] = 5;

  var startButtonClass = "quiz_session_start_button";
  var optionsButtonClass = "quiz_session_options_button";
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
$("a#addQuizSessionFancybox").fancybox({
      'autoDimensions' : false,
      'scrolling': 'no',
      'width': '80%',
      'height': '80%',
      'padding': 0,
      "onStart"  : function(data) {
       VISH.Utils.loadTab('tab_quiz_session');
      }
    });


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


var showQuizStats = function(){
  //open the fancybox
  $("a#addQuizSessionFancybox").trigger("click"); 
};
  /////////////////////////
  //// QUIZ MODE: QUESTION
  ////////////////////////

  var _loadEvents = function(){
    $(document).on('click', "."+startButtonClass, startMcQuizButtonClicked);
    //before close the quiz session ask to the user what want to do ...
    $(document).on('click', "."+stopSessionButtonClass, _onStopMcQuizButtonClicked);
    $(document).on('click', "."+ optionsButtonClass, showQuizStats);
    //$("#addQuizSessionFancybox").trigger('click');
        

  };
/* Chek if user is logged in and call VISH's API for starting a voting) */
  var startMcQuizButtonClicked = function () {
    
    if(V.User.isLogged()){
      var quizId = $(VISH.Slides.getCurrentSlide()).find(".quizId").val();
      $("a#addQuizSessionFancybox").trigger("click");
      V.Quiz.API.postStartQuizSession(quizId,_onQuizSessionReceived,_OnQuizSessionReceivedError);
       //   showQuizStats();
       //init the stats, empty
   

       //function updateStats que si la llamas sin params las pinta a cero pero si la llamas con datos los pinta
       //otro parametro podría ser el tipo de stadistica, barras, quesito o lo que sea
       //ultimo parametro-> el tiempo de refresco


       //open the fancybox
      
    _startStats();
    }
    else {

          V.Debugging.log("User not logged");

    }
  };
/*  
Load the question  options into the stats containers
 */

var _startStats = function() {
  V.Debugging.log("_startStats called");
  var tabQuizStatBarsContentId = "tab_quiz_stats_bars_content";
  var tabQuizStatPieContentId = "tab_quiz_stats_pie_content";
  var all_quiz = $(VISH.Slides.getCurrentSlide()).find("div.mcquestion_body").clone();
  var question = all_quiz.find(".question");
  V.Debugging.log("Question: " + question.html());
  var form = all_quiz.find(".mcquestion_form");
    if($("#"+tabQuizStatBarsContentId).find(".quiz_question_container").contents()){ 
        V.Debugging.log("Question container children detected ");
      $("#"+tabQuizStatBarsContentId).find(".quiz_question_container").children().remove();
    }
    $("#"+tabQuizStatBarsContentId).find(".quiz_options_container").append(form);
    $("#"+tabQuizStatBarsContentId).find(".quiz_question_container").append(question);
    if($("#"+tabQuizStatPieContentId).find(".quiz_question_container").children()){ 
      $("#"+tabQuizStatPieContentId).find(".quiz_question_container").children().remove();
    }
    $("#"+tabQuizStatBarsContentId).find("div.mcquestion_body").addClass("quiz_in_satistics");
    $("#"+tabQuizStatPieContentId).find(".quiz_question_container").append(question);
    
    _showResultsUI();

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

    //Hide Start Button and show options button
    $(current_slide).find("input." + startButtonClass).hide();
    $(current_slide).find("input." + optionsButtonClass).show();


   // $(current_slide).find("div.multiplechoicequestion").attr("quizSessionId",quiz_session_id);
   //put quiz_session_id value in the input hidden for stopping quiz session
    $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value",quiz_session_id);


    };

  var _OnQuizSessionReceivedError = function(error){
     var received = JSON.stringify(error);
     V.Debugging.log("_OnQuizSessionReceivedError:  " + received);
  };

  var _onStopMcQuizButtonClicked = function () {
    _stopAndSaveQuiz();
  };

  var _stopAndSaveQuiz = function(quizName) { 

     V.Debugging.log("_stopAndSaveQuiz ");
    var current_slide = VISH.Slides.getCurrentSlide();

    var header = $("#"+tabQuizSessionContent).find(".quiz_session_header");
   // var quizSessionActiveId =  $(current_slide).find("div.multiplechoicequestion").attr("quizSessionId");
    var quizSessionActiveId =  $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value");
    if(!quizName){
      quizName = "Unknown";
    }

   //Show Start Button and hide Options Button
    $(current_slide).find("input." + optionsButtonClass).hide();
    $(current_slide).find("input." + startButtonClass).show();

/*

    var stopButton = $(current_slide).find("." + stopSessionButtonClass);


    $(stopButton).val("Start Quiz");
    $(stopButton).removeClass().addClass(startButtonClass);
*/
    V.Quiz.API.deleteQuizSession(quizSessionActiveId,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError, quizName);
  };

  var _onQuizSessionCloseReceived = function(results){
         V.Debugging.log("_onQuizSessionCloseReceived");
//    var quizSessionActiveId =  $(VISH.Slides.getCurrentSlide()).find("div.multiplechoicequestion").attr("quizSessionId");
    var quizSessionActiveId = $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value");
    VISH.Utils.loadTab('tab_quiz_statistics');
    //V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _showResults, _onQuizSessionResultsReceivedError);
  };

  var _onQuizSessionCloseReceivedError = function(error){
    var received = JSON.stringify(error);
    V.Debugging.log("_onQuizSessionCloseReceivedError, and value received is:  " + received);
  };


/* Called when stop quiz session and when statistics tab session clicked*/
  var onStatisticsQuizButtonClicked = function () {
    var all_quiz = $(VISH.Slides.getCurrentSlide()).find("div.mcquestion_body").clone();
    var question = all_quiz.find(".question");
    var form = all_quiz.find(".mcquestion_form");

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
      var quizSessionActiveId =  $(".quiz_session_body").find("div.quiz_sesssion_inputs_container").find(".quiz_session_id").val()
          V.Debugging.log("_onQuizVotingSuccessReceived, and quizSessionActiveId is:  " + quizSessionActiveId);
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
    V.Debugging.log("_onQuizVotingSuccessReceived, and quizSessionActiveId is:  " + quizSessionActiveId);

    V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _onQuizSessionResultsReceived, _onQuizSessionResultsReceivedError);
  };

  var _OnQuizVotingReceivedError = function(error){
    var received = JSON.stringify(error);
    V.Debugging.log("_OnQuizVotingReceivedError, and value received is:  " + received);
  };



  /////////////////////////
  //// COMMON METHODS
  ////////////////////////
//data = {"quiz_session_id":19,"quiz_id":3,"results":{"b":4,"a":2,"c":1, "d":1}};
  var _onQuizSessionResultsReceived = function(data) {
    //_showResults(data);  
    //trying to use google chart 
      _displayResults(data.results);

  };

  var _onQuizSessionResultsReceivedError = function(error) {
    var received = JSON.stringify(error);
    V.Debugging.log("_onQuizSessionResultsReceivedError, and value received is:  " + received);
  };
    

//trying google chart 
var _displayResults = function(data) {
  var received = JSON.stringify(data);
  V.Debugging.log("_displayResults, and value received is:  " + received);
  var url = "http://chart.apis.google.com/chart?cht=p3&chs=300x200&chd=t:";
  var lenght_array = 0;
  $.each(data, function(clave, valor) {
    lenght_array += 1;
  });
  var counter = 0;
  $.each(data, function(clave, valor){ 
    url+= valor;
    counter++;
    if(counter==lenght_array) {
      url+= "&chl=";
    }
    else {
      url+= ",";
    } 
  });
  var counter = 0;
  $.each(data, function(clave, valor){ 
    url+= clave;
    counter++;
    if(counter==lenght_array) {
      url+= "&chtt=testedVish";
    }
    else {
      url+= "|";
    } 
  });
  V.Debugging.log("chart url :  " + url );
 $(".quiz_statistics_content").find(".img_chart").attr("src", url);
};


 /* NOT USED
  * Data format 
  */
/*

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
*/

  return {
    init                      : init, 
    prepareQuiz               : prepareQuiz,
    getQuizMode               : getQuizMode, 
    startMcQuizButtonClicked  :startMcQuizButtonClicked, 
    onStatisticsQuizButtonClicked : onStatisticsQuizButtonClicked

  };
    
}) (VISH, jQuery);

