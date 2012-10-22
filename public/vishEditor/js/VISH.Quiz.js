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
  var tabQuizStatsBarsContentId = "quiz_stats_bars_content_id";
  var tabQuizStatsPieContentId = "quiz_stats_pie_content_id";


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
   };
/* Chek if user is logged in and call VISH's API for starting a voting) */
  var startMcQuizButtonClicked = function () {
    
    if(V.User.isLogged()){
      var quizId = $(VISH.Slides.getCurrentSlide()).find(".quizId").val();
      $("a#addQuizSessionFancybox").trigger("click");
      V.Quiz.API.postStartQuizSession(quizId,_onQuizSessionReceived,_OnQuizSessionReceivedError);
       //init the stats, empty
       _startStats();   

       
      _updateBarsStats();
      _updatePieStats();

       var quizSessionActiveId = $("#" + tabQuizSessionContent).find("input.quiz_session_id").val();
     //   V.Debugging.log("session ID to get results from server is: " +  quizSessionActiveId);
    //get results
   // V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _showResults, _onQuizSessionResultsReceivedError);

    }
    else {

          V.Debugging.log("User not logged");

    }
  };
/*  
Load the question  options into the stats containers
 */

var _startStats = function() {
  //var tabQuizStatsBarsContentId = "tab_quiz_stats_bars_content";
  //var tabQuizStatPieContentId = "tab_quiz_stats_pie_content";
  if($("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").contents()){ 
    $("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").children().remove();
  }
  if($("#"+tabQuizStatsBarsContentId).find(".quiz_options_container").contents()){
    $("#"+tabQuizStatsBarsContentId).find(".quiz_options_container").children().remove();
  }
  if($("#"+tabQuizStatsPieContentId).find(".quiz_question_container").children()){ 
    $("#"+tabQuizStatsPieContentId).find(".quiz_question_container").children().remove();
  }
  $("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").append($(VISH.Slides.getCurrentSlide()).find("div.mcquestion_body").clone().find(".question"));
  $("#"+tabQuizStatsPieContentId).find(".quiz_question_container").append($(VISH.Slides.getCurrentSlide()).find("div.mcquestion_body").clone().find(".question"));
  $("#"+tabQuizStatsBarsContentId).find(".quiz_options_container").append($(VISH.Slides.getCurrentSlide()).find("div.mcquestion_body").clone().find(".mcquestion_form"));
  $("#"+tabQuizStatsBarsContentId).find("div.mcquestion_body").addClass("quiz_in_satistics");
  //add class to resize div inside fancybox 
  $("#tab_quiz_stats_bars_content").addClass("resized_fancybox_for_stats");
  $("#tab_quiz_stats_pie_content").addClass("resized_fancybox_for_stats");
  $("#tab_quiz_session_content").addClass("resized_fancybox_for_stats");
};

/* 
used to display statistics 
params:
  data 
  timeout: refresh time
 */

var _updateBarsStats = function(data, timeout) {
 var quizSessionActiveId = $("#" + tabQuizSessionContent).find("input.quiz_session_id").val();
   V.Debugging.log("_updateBarsStats  quizSessionId: " + quizSessionActiveId);
/* called from  */
  if(data) {
    V.Debugging.log("_updateBarsStats with  data: " +JSON.stringify(data));




  } 
//display empty stats
  else {
    V.Debugging.log("_updateBarsStats with no data params");

    $("#"+tabQuizStatsBarsContentId).find(".mc_meter").css('display','block');
    $("#"+tabQuizStatsBarsContentId).find(".mcoption_label").css('display','block');
    $("#"+tabQuizStatsBarsContentId).find(".mcoption_label").text("0%");
    $("#"+tabQuizStatsBarsContentId).find(".mc_meter > span").css('width','0%');
V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _showResults, _onQuizSessionResultsReceivedError);  
  }


};

var _updatePieStats = function() {


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
      V.Debugging.log("hide element");
    } else {
      var quizSessionActiveId =  $(".quiz_session_body").find("div.quiz_sesssion_inputs_container").find(".quiz_session_id").val()
          V.Debugging.log("_onQuizVotingSuccessReceived, and quizSessionActiveId is:  " + quizSessionActiveId);
      V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _onQuizSessionResultsReceived, _onQuizSessionResultsReceivedError);
    }
  
  };

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

/*must update bar stats and draw an google Chart image (with data values)*/ 
  var _showResults = function (data) {
    var received = JSON.stringify(data);
    V.Debugging.log("_displayResults, and value received is:  " + received);
    var maxWidth = 70;
    //var scaleFactor = maxWidth/100;
    //Reset values
     var totalVotes =0;
     //$(VISH.Slides.getCurrentSlide()).find(".mc_meter").css("width", "0%");
     //$(VISH.Slides.getCurrentSlide()).find(".mcoption_label").text("0%");
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
            var percentString = (percent).toString()  + "%";
            var roundedNumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);
            if(typeof $("#"+tabQuizStatsBarsContentId).find(".mc_meter")[index] != "undefined"){
             $("#"+tabQuizStatsBarsContentId).find(".mc_meter > span")[index].style.width = percentString;
             $($("#"+tabQuizStatsBarsContentId).find(".mcoption_label")[index]).text(roundedNumber+"%");
             $($("#"+tabQuizStatsBarsContentId).find(".mc_meter > span")[index]).addClass("mcoption_" +option );
            }
          }
        }
      }
 google.load('visualization', '1.0', {'packages':['corechart']}, {"callback" : VISH.Quiz.drawChart(data.results)});

 };


  var drawChart = function (data) {
        // Create the data table.
        var data_for_chart = new google.visualization.DataTable();
        data_for_chart.addColumn('string', 'Question');
        data_for_chart.addColumn('number', 'Slices');
        
        for (option in data) {

          if((option in mcOptionsHash)){ // a --> 2 , b -->3
            var votes = data[option];
            data_for_chart.addRow([option, votes]);
          }
        }; 

        /*data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
        ]); */
        var question = $(VISH.Slides.getCurrentSlide()).find(".question").text();
        // Set chart options
        var options = {'title':'',
                       'width':400,
                       'height':300};

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('quiz_chart_container_id'));
        chart.draw(data_for_chart, options);
      }


  return {
    init                      : init, 
    prepareQuiz               : prepareQuiz,
    getQuizMode               : getQuizMode, 
    startMcQuizButtonClicked  :startMcQuizButtonClicked, 
    onStatisticsQuizButtonClicked : onStatisticsQuizButtonClicked, 
    drawChart                 : drawChart

  };
    
}) (VISH, jQuery);

