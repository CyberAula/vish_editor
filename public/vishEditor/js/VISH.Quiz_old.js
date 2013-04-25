VISH.Quiz_OLD = (function(V,$,undefined){
  
  var quizMode;
  var quizSessionStarted = false; 

  var mcOptionsHash = new Array();
  mcOptionsHash['a'] = 0;
  mcOptionsHash['b'] = 1;
  mcOptionsHash['c'] = 2;
  mcOptionsHash['d'] = 3;
  mcOptionsHash['e'] = 4;
  mcOptionsHash['f'] = 5;

  var tfOptionsHash = new Array();
  tfOptionsHash['true'] = 0;
  tfOptionsHash['false'] = 1; 

  var startButtonClass = "quiz_session_start_button";
  var optionsButtonClass = "quiz_session_options_button";
  var showAnswerButtonClass = "show_answers_button";
   var hideAnswerButtonClass = "hide_answers_button";
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
  var addedFullScreenListener = false; 


  var init = function(presentation){
    if (presentation.type=="quiz_simple"){
      quizMode = "answer";
      _loadAnswerEvents();
    } else {
        quizMode = "question";
        _loadEvents();
    }

    V.Quiz.Renderer.init();
    V.Quiz.API.init();
   $("a#addQuizSessionFancybox").fancybox({
      'autoDimensions' : false,
      'scrolling': 'no',
      'width': '90%',
      'height': '90%',
      'margin': '10%',
      'padding': 0,
      "autoScale" : true,

      "onStart"  : function(data) {
        V.Utils.loadTab('tab_quiz_session');
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
      // V.Debugging.log("V.User.isLogged(): " + V.User.isLogged());
      if(!V.User.isLogged()){
        $("." + startButtonClass).hide();
      } else {
        $("." + startButtonClass).show();
      }
    }
  };


  var showQuizStats = function(){
 
    //open the fancybox
    $("a#addQuizSessionFancybox").trigger("click"); 

  testFullScreen();
};
  /////////////////////////
  //// QUIZ MODE: QUESTION
  ////////////////////////

  var _loadEvents = function(){
    $(document).on('click', "."+startButtonClass, startMcQuizButtonClicked);
    $(document).on('click', "."+stopSessionButtonClass, onStopMcQuizButtonClicked);
    $(document).on('click', "."+ optionsButtonClass, showQuizStats);
    $(document).on('click', "."+ showAnswerButtonClass, toggleShowAnswers);
    $(document).on('click', "."+ hideAnswerButtonClass, toggleShowAnswers);
    $(document).on('click', "#mask_stop_quiz", _hideStopQuizPopup);
    $(document).on('click', ".quiz_stop_session_cancel", _hideStopQuizPopup);
    $(document).on('click', ".quiz_stop_session_save", _stopAndSaveQuiz);
    $(document).on('click', ".quiz_stop_session_dont_save", _stopAndDontSaveQuiz);
    $(document).on('click', '.quiz_full_screen',qrToggleFullScreen);
    $(document).on('click', '.hide_qrcode', _hideQRCode);
    $(document).on('click', '.show_qrcode', _showQRCode);
    $(document).on('click', '.quiz_cancel_full_screen',qrToggleFullScreen);
  };
  /* Chek if user is logged in and call VISH's API for starting a voting) */
  var startMcQuizButtonClicked = function () {
    if(V.User.isLogged()){
      var quizId = $(V.Slides.getCurrentSlide()).find(".quizId").val();
      var quiztype= $(V.Slides.getCurrentSlide()).find(".quiz").attr("quiztype");
      $("a#addQuizSessionFancybox").trigger("click");
      V.Quiz.API.postStartQuizSession(quizId,_onQuizSessionReceived,_OnQuizSessionReceivedError);
      //init the stats, empty
      _startStats(quiztype);   
      testFullScreen();
  }
  else {
    V.Debugging.log("User not logged");
  }
};
/*  
Load the question options into the stats containers
params @quiz_type allows to select the type of content to be shown in stats
 */

var _startStats = function(quiz_type) {

  // TODO 
  var question;



  if($("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").contents()){ 
    $("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").children().remove();
  }
  if($("#"+tabQuizStatsBarsContentId).find(".quiz_options_container").contents()){
    $("#"+tabQuizStatsBarsContentId).find(".quiz_options_container").children().remove();
  }
  if($("#"+tabQuizStatsPieContentId).find(".quiz_question_container").children()){ 
    $("#"+tabQuizStatsPieContentId).find(".quiz_question_container").children().remove();
  }

  if(quiz_type=="multiplechoice") {
    question = $(V.Slides.getCurrentSlide()).find("div.mcquestion_body").clone().find(".value_multiplechoice_question_in_zone");
    //question.addClass("question_in_stats");
    //$("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").append(question.clone());
    //$("#"+tabQuizStatsPieContentId).find(".quiz_question_container").append(question.clone());
    var options_form = $(V.Slides.getCurrentSlide()).find("div.mcquestion_body").clone().find(".mcquestion_form");
 
    
  }
  if(quiz_type=="truefalse") {
  //this case only two options (true & false)
  question = $(V.Slides.getCurrentSlide()).find("div.truefalse_question_container").clone().find(".value_truefalse_question_in_zone");
  var options_form = $(V.Slides.getCurrentSlide()).find("div.truefalse_question_container").clone().find(".truefalse_options_container");
  //options_form.find(".truefalse_options_container").css("display", "block");

  }
    question.addClass("question_in_stats");
    $("#"+tabQuizStatsBarsContentId).find(".quiz_question_container").append(question.clone());
    $("#"+tabQuizStatsPieContentId).find(".quiz_question_container").append(question.clone());

   
   options_form.find(".multiplechoice_option_in_viewer").addClass("option_in_stats");

    $("#"+tabQuizStatsBarsContentId).find(".quiz_options_container").append(options_form);
    $("#"+tabQuizStatsBarsContentId).find(".truefalse_options_container").css("display", "block");
    $("#"+tabQuizStatsBarsContentId).find(".mch_inputs_wrapper").remove();

    
  //$("#"+tabQuizStatsBarsContentId).find("div.mcquestion_body").addClass("quiz_in_satistics");
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
  else if (pollingActivated && activate_boolean) {//already activated 
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
   /* called from  activatePolling()*/
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
    $(header).find(".url_share_link").attr("href",url);
    $(header).find(".url_share_link").text("");
    $(header).find(".url_share_link").append(url.toString());
    
    $(".hidden_for_qr_quiz > canvas").remove();
    $(".hidden_for_qr_quiz").qrcode({width: 512,height: 512, text: url.toString()});
    var imageData = $(".hidden_for_qr_quiz > canvas")[0].toDataURL();
    $("#"+tabQuizSessionContent).find(".qr_quiz_image").attr("src", imageData);
   // $("#"+tabQuizSessionContent).find(".qr_quiz_image")..css('width', '70%');

     //Hide Start Button and show options button
    $(current_slide).find("input." + startButtonClass).hide();
    $(current_slide).find("input." + optionsButtonClass).show();
    quizSessionStarted = true;
   //put quiz_session_id value in the input hidden for stopping quiz session
    $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value",quiz_session_id);

    _showQRCode();
    if (addedFullScreenListener === false) {
      _addToggleFullScreenListener();
    }
    };

  var _OnQuizSessionReceivedError = function(error){
    V.Debugging.log("_OnQuizSessionReceivedError:  " + JSON.stringify(error));
  };


  var _addToggleFullScreenListener = function () {
    var qrImgID = "quiz_session_qrcode_container_id";
    addedFullScreenListener = true;
    if(V.Status.getIsInIframe()){
      var myDoc = parent.document;
    } else {
      var myDoc = document;
    }
    var myElem = $(document).find(".quiz_full_screen")[0];
    if (myElem.requestFullscreen) {
    myDoc.addEventListener("fullscreenchange", function () {
//if FullScreen mode: document.fullScreen-- remove full-screen class
      if (document.fullScreen) {
        $(document.getElementById(qrImgID)).removeClass("quiz_session_qrcode_container");
        $(document.getElementById(qrImgID)).addClass("full-screen");
        }
      else {
        $(document.getElementById(qrImgID)).removeClass("full-screen");
        $(document.getElementById(qrImgID)).addClass("quiz_session_qrcode_container");
      }      

    /*  if($(myElem).css("display")==="none") {
          $(myElem).show();
        } else {
          $(myElem).hide();
        } */
      }, false);
     }
     else if (myElem.webkitRequestFullScreen) {
      myDoc.addEventListener("webkitfullscreenchange", function() {
        //is in fullScreen        
        if (document.webkitIsFullScreen) { 
          if ($(document.getElementById(qrImgID)).hasClass("quiz_session_qrcode_container")) {
              $(document.getElementById(qrImgID)).removeClass("quiz_session_qrcode_container");
              $(document.getElementById(qrImgID)).addClass("full-screen");
              $(".quiz_cancel_full_screen").show();
          }
        }
        else {
          if ($(document.getElementById(qrImgID)).hasClass("full-screen")) {
            $(document.getElementById(qrImgID)).removeClass("full-screen");
            $(document.getElementById(qrImgID)).addClass("quiz_session_qrcode_container");
            $(".quiz_cancel_full_screen").hide();
          }
        }      
      /*  if($(myElem).css("display")==="none") {
          $(myElem).show();
        } else {
          $(myElem).hide();
        } */
      }, false);
    } 
    else if (myElem.mozRequestFullScreen) {
      myDoc.addEventListener("mozfullscreenchange", function () {
        if (document.mozFullScreen) {
          $(document.getElementById(qrImgID)).removeClass("quiz_session_qrcode_container");
          $(document.getElementById(qrImgID)).addClass("full-screen");
          $(".quiz_cancel_full_screen").show();
        }
        else {
          $(document.getElementById(qrImgID)).removeClass("full-screen");
          $(document.getElementById(qrImgID)).addClass("quiz_session_qrcode_container");
          $(".quiz_cancel_full_screen").hide();
        }   
      /*  if($(myElem).css("display")==="none") {
            $(myElem).show();
          } else {
              $(myElem).hide();
          } */
      }, false);
    }
    else {

      V.Debugging.log ("Other Browser does not support FUll Screen Mode");
    }
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
    var current_slide = V.Slides.getCurrentSlide();
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

  };

  var _onQuizSessionCloseReceived = function(results){
         V.Debugging.log("_onQuizSessionCloseReceived");
//    var quizSessionActiveId =  $(V.Slides.getCurrentSlide()).find("div.multiplechoicequestion").attr("quizSessionId");
    var quizSessionActiveId = $("#" + tabQuizSessionContent).find("input.quiz_session_id").attr("value");
  };

  var _onQuizSessionCloseReceivedError = function(error){
    V.Debugging.log("_onQuizSessionCloseReceivedError, and value received is:  " + JSON.stringify(error));
  };

  var _stopAndDontSaveQuiz = function() {
    var current_slide = V.Slides.getCurrentSlide();
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

  };

  /////////////////////////
  //// QUIZ MODE: ANSWERS
  ////////////////////////

  var _loadAnswerEvents = function(){
    $(document).on('click', "."+voteButtonClass, _sendVote);
  };
/*send the participant vote to the server & show gratefulness popup */
  var _sendVote = function (event) {
    var answer;
    if(event.target.parentElement.classList[0]=="mch_inputs_wrapper") {

      var answer = $(V.Slides.getCurrentSlide()).find("input:radio[name='mc_radio']:checked'").val();
    }  
    else if(event.target.parentElement.classList[0]=="truefalse_inputs_wrapper") {

      var answer = $(V.Slides.getCurrentSlide()).find("input:radio[name='truefalse']:checked'").val();
    }
    if(typeof answer !== "undefined") {
       var quizSessionActiveId = V.SlideManager.getOptions()["quiz_active_session_id"];
       V.Quiz.API.putQuizSession(answer, quizSessionActiveId, _onQuizVotingSuccessReceived, _OnQuizVotingReceivedError);
       $("."+startButtonClass).hide();

    }
  };

  var _onQuizVotingSuccessReceived = function(data){ 
    var quizSessionActiveId = V.SlideManager.getOptions()["quiz_active_session_id"];
    V.Quiz.API.getQuizSessionResults(quizSessionActiveId, _onQuizSessionResultsReceived, _onQuizSessionResultsReceivedError);
  };

 var _onQuizSessionResultsReceived = function(data) {
      //remove all radio inputs
     $(V.Slides.getCurrentSlide()).find(".li_mch_options_in_zone > input").remove();
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
    $(V.Slides.getCurrentSlide()).find("."+ voteButtonClass).hide();
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
    
    var quiz_type = $(V.Slides.getCurrentSlide()).find(".quiz").attr("quiztype");
   
    var index ;
    var maxWidth = 70;
    //var scaleFactor = maxWidth/100;
    //Reset values
     var totalVotes =0;
      for (option in data.results) {
       if(quiz_type=="multiplechoice"){
        if((option in mcOptionsHash)){
          var votes = data.results[option];
          totalVotes  += votes;
        }
       }
       else if (quiz_type=="truefalse")  {
        if((option in tfOptionsHash)){
          var votes = data.results[option];
          totalVotes  += votes;
        }
      }
  
      }
      if(totalVotes>0){
        for (option in data.results) {
          if((option in mcOptionsHash || option in tfOptionsHash)){
            if(quiz_type=="multiplechoice") {
             index = mcOptionsHash[option];
            }
            else if (quiz_type="truefalse") {
               index = tfOptionsHash[option];  
            }
              var votes = data.results[option];
              var percent= (votes/totalVotes)*100;
              var percentString = (percent).toString()  + "%";
              var roundedNumber = Math.round(percent*Math.pow(10,2))/Math.pow(10,2);
              if(typeof $("#"+tabQuizStatsBarsContentId).find(".mc_meter")[index] != "undefined"){
               $("#"+tabQuizStatsBarsContentId).find(".mc_meter > span")[index].style.width = percentString;
               $($("#"+tabQuizStatsBarsContentId).find(".mcoption_label")[index]).text(roundedNumber+"%");
              if(quiz_type=="multiplechoice") {
                $($("#"+tabQuizStatsBarsContentId).find(".mc_meter > span")[index]).addClass("mcoption_" +option);
               } else if (quiz_type="truefalse") {
                 $($("#"+tabQuizStatsBarsContentId).find(".mc_meter > span")[index]).addClass("tfoption_" +option);
               }
              }
            }
        }
      }
    google.load('visualization', '1.0', {'packages':['corechart']}, {"callback" : V.Quiz.drawPieChart(data.results)});
  };


  var drawPieChart = function (data) {
    // Create the data table.
    var data_for_chart = new google.visualization.DataTable();
    data_for_chart.addColumn('string', 'Question');
    data_for_chart.addColumn('number', 'Slices');

    for (option in data) {
 if((option in mcOptionsHash || option in tfOptionsHash)){ //a --> 2 , b -->3 or true ->3 , false ->2
        var votes = data[option];
        data_for_chart.addRow([option, votes]);
      }
    }; 
  var question = $(V.Slides.getCurrentSlide()).find(".value_multiplechoice_question_in_zone").text();
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
    if ((V.Status.getDevice().features.fullscreen)){
      $('.quiz_full_screen').show();
    }
    else {
      $('.quiz_full_screen').hide();
    }
  };

  var qrToggleFullScreen = function (event) {
    var myDoc = document;
    //var myElem = document.getElementById('qr_quiz_image_id');
    var myElem =  document.getElementById('quiz_session_qrcode_container_id');
     if ((myDoc.fullScreenElement && myDoc.fullScreenElement !== null) || (!myDoc.mozFullScreen && !myDoc.webkitIsFullScreen)) {

        if (myDoc.documentElement.requestFullScreen) {

          myElem.requestFullScreen();
        } else if (myDoc.documentElement.mozRequestFullScreen) {

          myElem.mozRequestFullScreen();
        } else if (myDoc.documentElement.webkitRequestFullScreen) {

          myElem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); 
        }   
    } 
    else {
        if (myDoc.cancelFullScreen) {
          myDoc.cancelFullScreen();
        } else if (myDoc.mozCancelFullScreen) {
          myDoc.mozCancelFullScreen();
        } else if (myDoc.webkitCancelFullScreen) {
          myDoc.webkitCancelFullScreen();
        }       
    }      
  };

  var getIsQuizSessionStarted = function() {
    return quizSessionStarted;
  };

  var testFullScreen = function() {
  //    var myDoc;
  //  if(V.Status.getIsInIframe()){
  //      myDoc = parent.document;
      
  //   }
  //   else {
  //     myDoc = document;
  //   }
  // if ( myDoc.fullScreen || myDoc.mozFullScreen || myDoc.webkitIsFullScreen) {
  //   var myElem = $(document).find('.quiz_full_screen');
  //   myElem.hide();
  // }
  };


  /*
   * Function to unbind the start quiz button events
   * used in the preview functionality
   */
  var UnbindStartQuizEvents = function(){
    $(document).off('click', "."+startButtonClass, startMcQuizButtonClicked);
  };

  var toggleShowAnswers = function(event) {
    var current_slide = V.Slides.getCurrentSlide();  
    if(event.target.classList[0]==showAnswerButtonClass) {
     
      $(current_slide).find(".truefalse_answers > input").show();
      $(current_slide).find(".show_answers_button").hide();
      $(current_slide).find(".hide_answers_button").show();
    } else if (event.target.classList[0]==hideAnswerButtonClass) {
      $(current_slide).find(".truefalse_answers > input").hide();
      $(current_slide).find(".hide_answers_button").hide();
      $(current_slide).find(".show_answers_button").show();
      
    }
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
    qrToggleFullScreen          : qrToggleFullScreen, 
    showQuizStats               : showQuizStats, 
    testFullScreen              : testFullScreen,
    UnbindStartQuizEvents       : UnbindStartQuizEvents

  };
    
}) (VISH, jQuery);

 