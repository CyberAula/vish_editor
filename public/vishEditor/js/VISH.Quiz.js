VISH.Quiz = (function(V,$,undefined){
  
  var quizMode;
  var quizSessionStarted = false; 

  var mcOptionsHash = new Array();
  mcOptionsHash['a'] = 0;
  mcOptionsHash['b'] = 1;
  mcOptionsHash['c'] = 2;
  mcOptionsHash['d'] = 3;
  mcOptionsHash['e'] = 4;
  mcOptionsHash['f'] = 5;

  var startButtonClass = "quiz_session_start_button";
  var optionsButtonClass = "quiz_session_options_button";
  var voteButtonClass = "quiz_send_vote_button";
  var stopSessionButtonClass = "quiz_session_stop_button";
  var statisticsButtonClass = "mch_statistics_icon";
  var tabQuizSessionContent = "tab_quiz_session_content";
  var tabQuizStatsBarsContentId = "quiz_stats_bars_content_id";
  var tabQuizStatsPieContentId = "quiz_stats_pie_content_id";
//vars for periodical calls to server data 
  var getResultsPeriod = 3000; //milliseconds
  var getResultsTimeOut; //must be global
//variables to control slide forward and backward 
  var pollingActivated = false;


  var init = function(presentation){
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
      'width': '90%',
      'height': '90%',
      'margin': '10%',
      'padding': 0,
      "autoScale" : true,

      "onStart"  : function(data) {
        VISH.Utils.loadTab('tab_quiz_session');
        _enableFullScreenQRButton();
      }
    });
   
  };

  var getQuizMode = function(){
    return quizMode;
  }

  var prepareQuiz = function(){
    if (quizMode=="answer") {
      $("." + startButtonClass).hide();
      $("." + voteButtonClass).show();
    } else if(quizMode=="question") {
      // V.Debugging.log("VISH.User.isLogged(): " + VISH.User.isLogged());
      if(!VISH.User.isLogged()){
        $("." + startButtonClass).hide();
      } else {
        $("." + startButtonClass).show();
      }
    }
  };


  var showQuizStats = function(){
    //open the fancybox
    $("a#addQuizSessionFancybox").trigger("click"); 
  };


  /////////////////////////
  //// QUIZ MODE: QUESTION
  ////////////////////////

  var _loadEvents = function(){
    $(document).on('click', "."+startButtonClass, startMcQuizButtonClicked);
    $(document).on('click', "."+stopSessionButtonClass, onStopMcQuizButtonClicked);
    $(document).on('click', "."+ optionsButtonClass, showQuizStats);
    $(document).on('click', "#mask_stop_quiz", _hideStopQuizPopup);
    $(document).on('click', ".quiz_stop_session_cancel", _hideStopQuizPopup);
    $(document).on('click', ".quiz_stop_session_save", _stopAndSaveQuiz);
    $(document).on('click', ".quiz_stop_session_dont_save", _stopAndDontSaveQuiz);
    //$(document).on('click', '.quiz_full_screen', VISH.SlideManager.toggleFullScreen);
    $(document).on('click', '.quiz_full_screen',qrToggleFullScreen);
    $(document).on('click', '.hide_qrcode', _hideQRCode);
    $(document).on('click', '.show_qrcode', _showQRCode);
   };
  /* Chek if user is logged in and call VISH's API for starting a voting) */
  var startMcQuizButtonClicked = function () {
    if(V.User.isLogged()){
      var quizId = $(VISH.Slides.getCurrentSlide()).find(".quizId").val();
      $("a#addQuizSessionFancybox").trigger("click");
      V.Quiz.API.postStartQuizSession(quizId,_onQuizSessionReceived,_OnQuizSessionReceivedError);
      //init the stats, empty
      _startStats();   
     // _updateBarsStats(); //there will be call to V:Quiz.API.getQuizSessionResults
      
    }
    else {
          V.Debugging.log("User not logged");
    }
  };
/*  
Load the question  options into the stats containers
 */

var _startStats = function() {
  if($("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").contents()){ 
    $("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").children().remove();
  }
  if($("#"+tabQuizStatsBarsContentId).find(".quiz_options_container").contents()){
    $("#"+tabQuizStatsBarsContentId).find(".quiz_options_container").children().remove();
  }
  if($("#"+tabQuizStatsPieContentId).find(".quiz_question_container").children()){ 
    $("#"+tabQuizStatsPieContentId).find(".quiz_question_container").children().remove();
  }
  $("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").append($(VISH.Slides.getCurrentSlide()).find("div.mcquestion_body").clone().find(".value_multiplechoice_question_in_zone"));
  $("#"+tabQuizStatsPieContentId).find(".quiz_question_container").append($(VISH.Slides.getCurrentSlide()).find("div.mcquestion_body").clone().find(".value_multiplechoice_question_in_zone"));
  var options_form = $(VISH.Slides.getCurrentSlide()).find("div.mcquestion_body").clone().find(".mcquestion_form");
  $("#"+tabQuizStatsBarsContentId).find(".quiz_options_container").append(options_form);
  $("#"+tabQuizStatsBarsContentId).find(".mch_inputs_wrapper").remove();

  $("#"+tabQuizStatsBarsContentId).find("div.mcquestion_body").addClass("quiz_in_satistics");
  //add class to resize div inside fancybox 
  $("#tab_quiz_stats_bars_content").addClass("resized_fancybox_for_stats");
  $("#tab_quiz_stats_pie_content").addClass("resized_fancybox_for_stats");
  $("#tab_quiz_session_content").addClass("resized_fancybox_for_stats");
};


var activatePolling = function (activate_boolean) {

  if( !pollingActivated && activate_boolean) { 
     pollingActivated = activate_boolean;//true
    _updateBarsStats();
    getResultsTimeOut = setInterval(_getResults, getResultsPeriod);  
  }
  else if (pollingActivated&&activate_boolean) {//already activated 
  //nothing

  } else {
    pollingActivated = activate_boolean; //false
    clearInterval(getResultsTimeOut);
  }

};

/* 
used to display statistics 
params:
  data 
  timeout: refresh time
 */

var _updateBarsStats = function(data) {
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
    //testing timeout
    _getResults();
     //getResultsTimeOut = setInterval(_getResults, getResultsPeriod);  
  }
};
/* function that calls to VISH API to receive voting's results  */
var _getResults =  function(quiz_session_active_id) {
   //V.Debugging.log("_getResults and quiz_Session_active id" + quiz_session_active_id);
  if(quiz_session_active_id) {
    var quizSessionActiveId = quiz_session_active_id;
  }
  else {
    var quizSessionActiveId = $("#" + tabQuizSessionContent).find("input.quiz_session_id").val();      
  }
  V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _showResults, _onQuizSessionResultsReceivedError);
};


/* must construct the URL and add an QR code inside the quiz_session tab */
  var _onQuizSessionReceived = function(quiz_session_id){
    var quizUrlForSession ="http://"+window.location.host.toString() +"/quiz_sessions/";
    var url = quizUrlForSession + quiz_session_id;
    var current_slide = V.Slides.getCurrentSlide();
    var header = $("#"+tabQuizSessionContent).find(".quiz_session_header");
    $(header).find(".url_share > span > a").attr("href",url);
    $(header).find(".url_share > span > a").text("");
    $(header).find(".url_share > span > a").append(url.toString());
    //$("#"+tabQuizSessionContent).find(".quiz_session_qrcode_container").children().remove();
    $(".hidden_for_qr_quiz").qrcode({width: 512,height: 512, text: url.toString()});
    var imageData = $(".hidden_for_qr_quiz > canvas")[0].toDataURL();
    $("#"+tabQuizSessionContent).find(".quiz_session_qrcode_container > img").attr("src", imageData);


     //Hide Start Button and show options button
    $(current_slide).find("input." + startButtonClass).hide();
    $(current_slide).find("input." + optionsButtonClass).show();
    quizSessionStarted = true;
   //put quiz_session_id value in the input hidden for stopping quiz session
    $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value",quiz_session_id);
    $("#" +tabQuizSessionContent).find(".quiz_session_qrcode_container").append(" <img class='qr_background' src='"+VISH.ImagesPath +"qrcode_background.png' />")
    };

  var _OnQuizSessionReceivedError = function(error){
    V.Debugging.log("_OnQuizSessionReceivedError:  " + JSON.stringify(error));
  };

/*
Show a popup with three buttons (Cancel, DOn't save & Save)
*/ 
 var onStopMcQuizButtonClicked = function () {
    var id = $('a[name=modal_fancybox]').attr('href'); //TODO in different way
    //Get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
       
     //Mask_stop_quiz is used like background shadow
     $('#mask_stop_quiz').css({'width':maskWidth,'height':maskHeight});
    //transition effect     
    $('#mask_stop_quiz').fadeTo("slow",0.6);  
    //TODO ask Nestor how to set the popup position in the center 
    $(id).css('top',  maskHeight/2-$(id).height()/2);
    $(id).css('left', maskWidth/2-$(id).width()/2);
    $(id).show();
    $(id).children().show();
    var date = new Date();
    var date_string = date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString()+"_"+date.getHours().toString() + date.getMinutes().toString();
    $(id).find(".quiz_saved_session_name").val(date_string);
        //transition effect
        $(id).fadeIn(2000); 
  };
/*Called when press save button in the stop quiz session popup*/
  var _stopAndSaveQuiz = function() { 
    var current_slide = VISH.Slides.getCurrentSlide();
    quizName = $("#stop_quiz_fancybox").find(".quiz_saved_session_name").val();
    var header = $("#"+tabQuizSessionContent).find(".quiz_session_header");
    var quizSessionActiveId =  $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value");
    if(!quizName){
      quizName = "Unknown";
    }
    //remove stop quiz fancybox
    _hideStopQuizPopup();
    $.fancybox.close();
    //Show Start Button and hide Options Button
    $(current_slide).find("input." + optionsButtonClass).hide();
    $(current_slide).find("input." + startButtonClass).show();

    V.Quiz.API.deleteQuizSession(quizSessionActiveId,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError, quizName);
     pollingActivated = false;
    clearInterval(getResultsTimeOut);
    quizSessionStarted = false;
    if(isWaitingForwardOneSlide) {
      V.Slides.forwardOneSlide();
    }
    else if(isWaitingBackwardOneSlide) {
      V.Slides.backwardOneSlide();
    }
  };

  var _onQuizSessionCloseReceived = function(results){
         V.Debugging.log("_onQuizSessionCloseReceived");
//    var quizSessionActiveId =  $(VISH.Slides.getCurrentSlide()).find("div.multiplechoicequestion").attr("quizSessionId");
    var quizSessionActiveId = $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value");
        //V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _showResults, _onQuizSessionResultsReceivedError);
  };

  var _onQuizSessionCloseReceivedError = function(error){
    V.Debugging.log("_onQuizSessionCloseReceivedError, and value received is:  " + JSON.stringify(error));
  };

  var _stopAndDontSaveQuiz = function() {
    var current_slide = VISH.Slides.getCurrentSlide();
    var quizSessionActiveId =  $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value");
    _hideStopQuizPopup();
    $.fancybox.close();
    quizName= false; //to inform that is not going to save the quiz session
    //Show Start Button and hide Options Button
    $(current_slide).find("input." + optionsButtonClass).hide();
    $(current_slide).find("input." + startButtonClass).show();

    V.Quiz.API.deleteQuizSession(quizSessionActiveId,_onQuizSessionCloseReceived,_onQuizSessionCloseReceivedError, quizName);
    clearInterval(getResultsTimeOut);

    quizSessionStarted = false;
        if(isWaitingForwardOneSlide) {
      V.Slides.forwardOneSlide();
    }
    else if(isWaitingBackwardOneSlide) {
      V.Slides.backwardOneSlide();
    }
  };

  /////////////////////////
  //// QUIZ MODE: ANSWERS
  ////////////////////////

  var _loadAnswerEvents = function(){
    $(document).on('click', "."+voteButtonClass, _sendVote);
  };
/*send the participant vote to the server & show gratefulness popup */
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

 var _onQuizSessionResultsReceived = function(data) {
    V.Debugging.log("_onQuizSessionResultsReceived, and data is:  " +  JSON.stringify(data));
       $(VISH.Slides.getCurrentSlide()).find(".li_mch_options_in_zone > input").remove();
       $(".thanks_div").show();
        var id = $('a[name=modal_window]').attr('href'); //TODO in different way
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
       
     //Mask_stop_quiz is used like background shadow
     $('#thanks_div').css({'width':maskWidth,'height':maskHeight});
    //transition effect     
    $('#thanks_div').fadeTo("slow",0.6);  
    //TODO ask Nestor how to set the popup position in the center 
    $(id).css('top',  maskHeight/2-$(id).height()/2);
    $(id).css('left', maskWidth/2-$(id).width()/2);
    $(id).show();
    $(VISH.Slides.getCurrentSlide()).find("."+ voteButtonClass).hide();
   // $(id).children().show();
    
 }
 
  var _OnQuizVotingReceivedError = function(error){
    V.Debugging.log("_OnQuizVotingReceivedError, and value received is:  " + JSON.stringify(error));
  };
  /////////////////////////
  //// COMMON METHODS
  ////////////////////////

  var _onQuizSessionResultsReceivedError = function(error) {
    V.Debugging.log("_onQuizSessionResultsReceivedError, and value received is:  " + JSON.stringify(error));
  };
 /* NOT USED
  * Data format 
  */

/*must update bar stats and draw an google Chart image (with data values)*/ 
  var _showResults = function (data) {
    var maxWidth = 70;
    //var scaleFactor = maxWidth/100;
    //Reset values
     var totalVotes =0;
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
    google.load('visualization', '1.0', {'packages':['corechart']}, {"callback" : VISH.Quiz.drawPieChart(data.results)});
  };


  var drawPieChart = function (data) {
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

  var question = $(VISH.Slides.getCurrentSlide()).find(".value_multiplechoice_question_in_zone").text();
        
  //TODO set values in percents for resizing 
  // Set chart options
    var options = {'title':'',
                   'width':400,
                   'height':300
                  };

        // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('quiz_chart_container_id'));
    chart.draw(data_for_chart, options);
  };


  var _hideStopQuizPopup = function() {
    $('#mask_stop_quiz').fadeTo("slow",0);  
    $('#mask_stop_quiz').hide();  
    $('#stop_quiz_fancybox').hide();
};


  var _hideQRCode = function () {
       //there is the QR Code
    if($("#" +tabQuizSessionContent).find(".quiz_session_qrcode_container > .qr_quiz_image")) {
      $("#" +tabQuizSessionContent).find(".qr_quiz_image").hide();
      $("#" +tabQuizSessionContent).find(".qr_background").show();
      $("#" +tabQuizSessionContent).find(".hide_qrcode").hide();
      $("#" +tabQuizSessionContent).find(".show_qrcode").show();
    
    }
  };

  var _showQRCode = function () {
       //there is the QR Code
    if($("#" +tabQuizSessionContent).find(".quiz_session_qrcode_container > .qr_background")) {
      $("#" +tabQuizSessionContent).find(".qr_background").hide();
      $("#" +tabQuizSessionContent).find(".qr_quiz_image").show();
      $("#" +tabQuizSessionContent).find(".show_qrcode").hide();
      $("#" +tabQuizSessionContent).find(".hide_qrcode").show();
    }
  };
  var _enableFullScreenQRButton = function() {
    //TODO consider all kind of browsers 
    if($(document).fullScreen){
      $('.quiz_full_screen').show();
    }
    else {
      $('.quiz_full_screen').hide();
    }
  };

  var qrToggleFullScreen = function (event) {
    //TODO consider all kind of browsers 
    myDoc = parent.document;
    var myElem = myDoc.getElementById('qr_quiz_fullscreen');
        if(event.target.classList[0]==="quiz_full_screen") {
      V.Debugging.log(" actvate qrFullScreen detected ");
      $(myDoc).find(".qr_quiz_fullscreen_img").attr("src", ($("#tab_quiz_session_content").find(".qr_quiz_image").attr("src")));
      
      //if (myDoc.requestFullscreen) {
      if (myElem.requestFullscreen) {
        $(myElem).show();
        $(myElem)[0].requestFullscreen();
      }
      else if (myElem.mozRequestFullScreen) {
       // $(myElem).show();
        $(myElem)[0].mozRequestFullScreen();


        myDoc.addEventListener("mozfullscreenchange", function () {
//fullscreenState.innerHTML = (document.mozFullScreen)? "" : "not ";
 if($(myElem).css("display")==="none") {
            $(myElem).show();
        } else {
            $(myElem).hide();
        }
}, false);
      }
      else if (myElem.webkitRequestFullScreen) {
       // $(myElem)[0].fullScreen();
          //$(myElem)[0].mozRequestFullScreen();
        $(myElem)[0].webkitRequestFullScreen();           
        //myDoc.addEventListener("webkitfullscreenchange", function() {
          myDoc.addEventListener("webkitfullscreenchange", function() {
        if($(myElem).css("display")==="none") {
            $(myElem).show();
        } else {
            $(myElem).hide();
        }

        }, false);        
     }

    }
    else if (event.target.classList[0]==="quiz_cancel_full_screen") {
      V.Debugging.log(" cancel qrFullScreen detected ");
      myDoc = parent.document;
      var myElem = myDoc.getElementById('qr_quiz_fullscreen');
      $(myElem).hide();
      if (document.exitFullscreen) {
        $(myElem)[0].exitFullscreen();
      }
      else if (document.mozCancelFullScreen) {
        $(myElem)[0].mozCancelFullScreen();
      }
      else if (document.webkitCancelFullScreen) {
        $(myElem)[0].webkitCancelFullScreen();
      }
     
    }
 else {
      V.Debugging.log("other target");
    }
  };


  var getIsQuizSessionStarted = function() {
    return quizSessionStarted;
  };



  return {
    init                        : init, 
    prepareQuiz                 : prepareQuiz,
    getQuizMode                 : getQuizMode, 
    startMcQuizButtonClicked    :startMcQuizButtonClicked, 
    drawPieChart                : drawPieChart, 
    getIsQuizSessionStarted     : getIsQuizSessionStarted, 
    onStopMcQuizButtonClicked   : onStopMcQuizButtonClicked, 
    activatePolling             : activatePolling, 
    qrToggleFullScreen          : qrToggleFullScreen


  };
    
}) (VISH, jQuery);

 