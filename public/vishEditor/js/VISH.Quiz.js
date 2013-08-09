VISH.Quiz = (function(V,$,undefined){
  
  var quizMode; //selfA or realTime
  var quizSessionId;

  //Quiz in real time
  //Current quiz data
  var currentQuiz;
  var currentQuizSession;
  var currentPolling;


  var initBeforeRender = function(presentation){
    if(presentation.type===V.Constant.QUIZ_SIMPLE){
      quizMode = V.Constant.QZ_MODE.RT;
      if(V.Utils.getOptions().quizSessionId){
        quizSessionId = V.Utils.getOptions().quizSessionId;
      }
    } else {
      quizMode = V.Constant.QZ_MODE.SELFA;
    }
  }

  var init = function(){
    $("#prompt2name").watermark("Quiz Session Name");
    V.Quiz.API.init();
    V.Quiz.MC.init();
    V.Quiz.TF.init();
    _loadEvents();
  };

/*
 * Load common events of Quizzes: answer, stats, etc
 */
  var _loadEvents = function(){
    $(document).on('click', ".quizAnswerButton",_onAnswerQuiz);
    $(document).on('click', ".quizStartButton",_onStartQuiz);
    $(document).on('click', ".quizStopButton",_onStopQuiz);

    // Fullscreen QR Code: Not stable feature
    // if(V.Status.getDevice().features.fullscreen){
    //   $(document).on('click', ".quizQr",_onClickQR);
    //   $(".quizQr").attr("title","Click to put the QR in full screen");
    //   $(".quizQr").css("cursor","pointer");
    // }

    $("a#addQuizSessionFancybox").fancybox({
      'autoDimensions' : false,
      'scrolling': 'no',
      'width': '0%',
      'height': '0%',
      'padding': 0,
      "autoScale" : true,
      "onStart"  : function(data) {
        loadTab('tab_quiz_session');
        $("#fancybox-close").height(0);
        $("#fancybox-close").css("padding",0);
      },
      'onComplete'  : function(data) {
        setTimeout(function () {
          $("#fancybox-close").height("22px");
          $("#fancybox-close").css("padding","10px");
          $("#fancybox-close").css("padding-left","4px");

          $("#fancybox-wrap").css("margin-top", "0px");
          $('#fancybox-wrap').width($(".current").width()+100); //+100 because it is the padding
          $('#fancybox-wrap').height($(".current").height()+70);  //+70 because it is the padding
          $('.outer_box').css("width","100%");
          $('.outer_box').height($(".current").height()+70);
          $('#fancybox-wrap').css("top", $(".current").offset().top + "px");  
          $('#fancybox-wrap').css("left", $(".current").offset().left + "px");

          $("#fancybox-content").width("100%");
          $("#fancybox-content").height("100%");
          $("#fancybox-content > div").width("100%");
          $("#fancybox-content > div").height("100%");
          $('#fancybox-wrap').show();
          if((currentQuizSession)&&(currentQuizSession.url)){
            _loadQr(currentQuizSession.url);
          }
        }, 300);   
      },
      "onClosed"  : function(){
        _stopPolling();
        _cleanResults();
      }
    });

  }

  var _onAnswerQuiz = function(event){
    var quiz = $("div.quizzContainer").has(event.target);
    var quizModule = _getQuizModule($(quiz).attr("type"));
    if(quizModule){
      if(quizMode===V.Constant.QZ_MODE.SELFA){
        quizModule.onAnswerQuiz(quiz);
      } else {
        var report = quizModule.getReport(quiz);
        _answerRTQuiz(quiz,quizModule,report);
      }      
    }
  }

  var _answerRTQuiz = function(quiz,quizModule,report){
    if(!quizSessionId){
      return;
    }
    if(report.empty===true){
      _showAlert("prompt3_alert");
      return;
    }
    quizModule.disableQuiz(quiz);

    _loadingAnswerButton(quiz);

    var answers = report.answers;
    V.Debugging.log(answers);

    V.Quiz.API.sendAnwers(answers, quizSessionId, 
      function(data){
        disableAnswerButton(quiz);
         _showAlert("prompt4_alert");
    }, 
      function(error){
        disableAnswerButton(quiz);
        _showAlert("prompt5_alert");
    });
  }

  var _onStartQuiz = function(event){
    var startButton = $(event.target);
    var quiz = $("div.quizzContainer").has(startButton);

    switch($(startButton).attr("quizStatus")){
      case "running":
        $("#fancybox-close").hide();
        $("a#addQuizSessionFancybox").trigger("click");
        break;
      case "loading":
        break;
      case "stop":
      default:
        _startNewQuizSession(quiz);
        break;
    }
  }

  var _startNewQuizSession = function(quiz){
    if(currentQuizSession){
      _showAlert("prompt1_alert");
      return;
    }
    _loadingLaunchButton(quiz);
    var quizJSON = _getQuizJSONFromQuiz(quiz);
    V.Quiz.API.startQuizSession(quiz,quizJSON,_onQuizSessionReceived,_onQuizSessionReceivedError);
  }

  var _onQuizSessionReceived = function(quiz,quizSession){
    V.Debugging.log("_onQuizSessionReceived");
    V.Debugging.log(quizSession);

    currentQuiz = quiz;
    currentQuizSession = quizSession;

    _runningLaunchButton(quiz);
    $("a#addQuizSessionFancybox").trigger("click");
  }

  var _onQuizSessionReceivedError = function(quiz,error){
    V.Debugging.log("_OnQuizSessionReceivedError");
    V.Debugging.log(error);
    _enableLaunchButton(quiz);
  }

  var _getQuizJSONFromQuiz = function(quiz){
    var slide = $("article").has(quiz);
    return _getQuizJSONFromSlide(slide);
  }

  var _getQuizJSONFromSlide = function(slide){
    var slideId = $(slide).attr("id");
    var presentation = V.Viewer.getCurrentPresentation();
    if((slideId)&&(presentation)){
      var slides = presentation.slides;
      var sL = slides.length;
      for(var i=0; i<sL; i++){
        if(slides[i].id==slideId){
          //Look for quiz element
          var elements = slides[i].elements;
          var eL = elements.length;
          for(var j=0; j<eL; j++){
            if(elements[j].type==V.Constant.QUIZ){
              return elements[j].quiz_simple_json
            }
          }
        }
      }
    }
  }

  var _onStopQuiz = function(event){
    $.fancybox(
      $("#prompt2_alert").html(),
      {
        'autoDimensions'  : false,
        'scrolling'       : 'no',
        'width'           : $(".current").width(),
        'height'          : Math.min(200,$(".current").height()),
        'showCloseButton' : false,
        'padding'         : 5,
        'onCleanup'       : function(){

        },
        'onClosed'        : function(){
        }
      }
    );
  }

  var onCloseQuizSession = function(saving){
    var name = undefined;
    switch(saving){
      case "yes":
        $(".prompt2name").each(function(index,pn){
          if($(pn).is(":visible")){
            name = $(pn).val();
          }
        });
        $(".prompt_button_viewer2").addClass("quizStartButtonLoading");
        _closeQuizSession(name);
        break;
      case "no":
        $(".prompt_button_viewer1").addClass("quizStartButtonLoading");
        _closeQuizSession();
        break;
      case "cancel":
      default:
        $.fancybox.close();
        break;
    }
  }

  var _closeQuizSession = function(name){
    V.Quiz.API.closeQuizSession(currentQuizSession.id,name,function(data){
      $.fancybox.close();
      $(".prompt_button_viewer1").removeClass("quizStartButtonLoading")
      $(".prompt_button_viewer2").removeClass("quizStartButtonLoading")
      _enableLaunchButton(currentQuiz);
      currentQuiz = null;
      currentQuizSession = null;
    });
  }

  /**
   * Function to render a quiz inside an article (a slide)
   */
  var render = function(slide,template){
    var quizModule = _getQuizModule(slide.quiztype);
    if(quizModule){
      return quizModule.render(slide,template);
    }
  };

  var renderButtons = function(selfA){
    var quizButtons = $("<div class='quizButtons'></div>");

    if((quizMode === V.Constant.QZ_MODE.SELFA)&&((V.Configuration.getConfiguration().mode===V.Constant.VISH)||(V.Configuration.getConfiguration()["mode"]===V.Constant.NOSERVER))&&(V.User.isLogged())&&(!V.Utils.getOptions().preview)){
      var startButton = $("<input type='button' class='buttonQuiz quizStartButton' value='Launch'/>");
      $(quizButtons).prepend(startButton);
    }
    if((selfA)||(quizMode === V.Constant.QZ_MODE.RT)){
      var answerButton = $("<input type='button' class='buttonQuiz quizAnswerButton' value='Answer'/>");
      $(quizButtons).prepend(answerButton);
    }

    return quizButtons;
  }


  /*
   * Answer button states: Enabled, Loading and Disabled
   */

  var _enableAnswerButton = function(quiz){
    var answerButton = $(quiz).find("input.quizAnswerButton");
    $(answerButton).removeAttr("disabled");
    $(answerButton).removeClass("quizStartButtonLoading");
    $(answerButton).removeAttr("quizStatus");
  }

  var _loadingAnswerButton = function(quiz){
    var answerButton = $(quiz).find("input.quizAnswerButton");
    $(answerButton).attr("disabled", "disabled");
    $(answerButton).addClass("quizStartButtonLoading");
    $(answerButton).attr("quizStatus","loading");
  }

  var disableAnswerButton = function(quiz){
    var answerButton = $(quiz).find("input.quizAnswerButton");
    $(answerButton).attr("disabled", "disabled");
    $(answerButton).addClass("quizAnswerButtonDisabled");
    $(answerButton).removeClass("quizStartButtonLoading");
    $(answerButton).attr("quizStatus","disabled");
  }


  /*
   * Launch button states: Enabled, Loading and Running
   */

  var _enableLaunchButton = function(quiz){
    var startButton = $(quiz).find("input.quizStartButton");
    $(startButton).removeAttr("disabled");
    $(startButton).removeClass("quizStartButtonLoading");
    $(startButton).removeAttr("quizStatus");
    $(startButton).attr("value","Launch");
  }

  var _loadingLaunchButton = function(quiz){
    var startButton = $(quiz).find("input.quizStartButton");
    $(startButton).attr("disabled", "disabled");
    $(startButton).addClass("quizStartButtonLoading");
    $(startButton).attr("quizStatus","loading");
    $(startButton).attr("value","Launch");
  }

  var _runningLaunchButton = function(quiz){
    var startButton = $(quiz).find("input.quizStartButton");
    $(startButton).removeAttr("disabled");
    $(startButton).removeClass("quizStartButtonLoading");
    $(startButton).attr("quizStatus","running");
    $(startButton).attr("value","Options");
  }



  /*
   *  Fancybox
   */

  var loadTab = function(tab_id){
    //hide previous tab
    $(".fancy_viewer_tab_content").hide();
    //show content
    $("#" + tab_id + "_content").show();
    //deselect all of them
    $(".fancy_viewer_tab").removeClass("fancy_selected");
    //select the correct one
    $("#" + tab_id).addClass("fancy_selected");
    //hide previous help button
    $(".help_in_fancybox_viewer").hide();
    //show correct one
    $("#"+ tab_id + "_help").show();

    switch(tab_id){
      case "tab_quiz_session":
        _loadQuizSession();
        break;
      case "tab_quiz_stats":
        _loadStats();
        break;
      default:
        break;
    }
  };

  var _loadQuizSession = function(){
    _cleanResults();
    if(!currentQuizSession){
      return;
    }
    if(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER){
      currentQuizSession.url = "http://vishub.org/quiz_sessions/4567";
    }

    var myA = $("#tab_quiz_session_url_link");
    $(myA).attr("href",currentQuizSession.url);
    $(myA).html("<p id='tab_quiz_session_url'>"+currentQuizSession.url+"</p>");

    var sharingText = $(currentQuiz).find(".mc_question_wrapper_viewer").text().trim();
    
    var twitter = $("#tab_quiz_session_share_twitter");
    $(twitter).attr("href","https://twitter.com/share?url="+currentQuizSession.url+"&text="+sharingText+"");
    
    var facebook = $("#tab_quiz_session_share_facebook");
    var facebookUrl = "http://www.facebook.com/sharer.php?s=100&p[url]="+currentQuizSession.url+"&p[title]="+sharingText;
    // &p[summary]=the description/summary you want to share";
    //&p[images][0]=the image you want to share
    $(facebook).attr("href",facebookUrl);

    var gPlus = $("#tab_quiz_session_share_gPlus");
    $(gPlus).attr("href","https://plus.google.com/share?url="+currentQuizSession.url);
  }


  var _loadQr = function(url){
    if(typeof url != "string"){
      return;
    }

    var container = $(".quizQr");
    $(container).html("");

    var height = $(container).height();
    var width = height;

    var qrOptions = {
      // render method: 'canvas' or 'div'
      render: 'canvas', 
      // width and height in pixel
      width: width,
      height: height,
      // QR code color
      color: '#000',
      // background color, null for transparent background
      bgColor: '#fff',
      // the encoded text
      text: url.toString()
    }
    $(container).qrcode(qrOptions);
  }

  var _onClickQR = function(){
    var changeToFs = false;
    var changeFromFs = false;
    var elem = $(".quizQr")[0];

    if((V.Status.getIsInIframe())&&(isFullscreen(parent.document))){
      //VE in FS
      //Breaks
      //TODO
      return; 
    }

    if(isFullscreen(document)){
      //Qr is in fullscreen
      changeFromFS = cancelFullScreen(document);
    } else {
      //Qr is not in fullscreen
      changeToFS = requestFullScreen(elem);
    }

    if(changeToFs){
      $(".quizQr").attr("disabledTitle",$(".quizQr").attr("title"));
      $(".quizQr").removeAttr("title");
    } else if(changeFromFs){
      $(".quizQr").attr("title",$(".quizQr").attr("disabledTitle"));
    }

    if((changeToFs)||(changeFromFs)){
      _loadQr(currentQuizSession.url);
    }
  }

  var isFullscreen = function(myDoc){
    return((myDoc.fullScreen) || (myDoc.mozFullScreen) || (myDoc.webkitIsFullScreen));
  }

  var cancelFullScreen = function(myDoc){
     if (myDoc.cancelFullScreen) {
        myDoc.cancelFullScreen();
        return true;
      } else if (myDoc.mozCancelFullScreen) {
        myDoc.mozCancelFullScreen();
        return true;
      } else if (myDoc.webkitCancelFullScreen) {
        myDoc.webkitCancelFullScreen();
        return true;
      }
      return false;
  }

  var requestFullScreen = function(elem){
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      return true;
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
      return true;
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
      return true;
    }
    return false;
  }


  var _loadStats = function(){
    _cleanResults();
    V.Quiz.API.getResults(currentQuizSession.id, function(results){
        _drawResults(results,{"first": true});
        _startPolling();
    });
  }

  var _startPolling = function(){
    _stopPolling();
    currentPolling = setInterval(function(){
      if(!currentQuizSession){
        _stopPolling();
        return;
      }
      V.Quiz.API.getResults(currentQuizSession.id, function(results){
        _drawResults(results,{"first": false});
      });
    },2000);
  }

  var _stopPolling = function(){
    if(currentPolling){
      clearInterval(currentPolling);
    }
  }

  var _drawResults = function(results,options){
    //Prepare canvas
    var canvas = $("#quiz_chart");
    var desiredWidth = $("#fancybox-content").width();
    var desiredHeight = $("#fancybox-content").height()*0.8;
    $(canvas).width(desiredWidth);
    $(canvas).height(desiredHeight);
    $(canvas).attr("width",desiredWidth);
    $(canvas).attr("height",desiredHeight);

    var quizModule = _getQuizModule($(currentQuiz).attr("type"));
    if(quizModule){
      $("#quiz_chart").show();
      quizModule.drawResults(currentQuiz,results,options);
    }
  }

  var _cleanResults = function(){
    var canvas = $("#quiz_chart");
    var ctx = $(canvas).get(0).getContext("2d");
    ctx.clearRect(0, 0, $(canvas).width(), $(canvas).height());
    $(canvas).hide();
  }


  /*
   * Utils
   */
  var _getQuizModule = function(quiz_type){
    switch (quiz_type) {
      case V.Constant.QZ_TYPE.OPEN:
         break;
      case V.Constant.QZ_TYPE.MCHOICE:
        return V.Quiz.MC;
        break;
      case V.Constant.QZ_TYPE.TF:
        return V.Quiz.TF;
        break;
      default:
        return null; 
        break;
    }
  }

  var updateCheckbox = function(checkbox,check){
    if(typeof check == "boolean"){
      check = check.toString();
    }

    var imagePathRoot = V.ImagesPath+ "quiz/checkbox";
    switch(check){
      case "true":
        $(checkbox).attr("check","true");
        $(checkbox).attr("src",imagePathRoot+"_checked.png");
        break;
      case "false":
        $(checkbox).attr("check","false");
        $(checkbox).attr("src",imagePathRoot+"_wrong.png");
        break;
      case "none":
      default:
        $(checkbox).attr("check","none");
        $(checkbox).attr("src",imagePathRoot+".png");
        break;
    }
  }

  var _showAlert = function(alertId){
    $.fancybox(
        $("#"+alertId).html(),
        {
          'autoDimensions'  : false,
          'scrolling': 'no',
          'width'           : $(".current").width(),
          'height'          : Math.min(200,$(".current").height()),
          'showCloseButton' : false,
          'padding'       : 5 
        }
    );
  }


  var aftersetupSize = function(increase){
    setTimeout(function(){
      if((currentQuizSession)&&(currentQuizSession.url)){
        _loadQr(currentQuizSession.url);
      }
    },500);
  }

  return {
    initBeforeRender  : initBeforeRender,
    init              : init,
    render            : render,
    renderButtons     : renderButtons,
    updateCheckbox    : updateCheckbox,
    disableAnswerButton : disableAnswerButton,
    loadTab             : loadTab,
    onCloseQuizSession  : onCloseQuizSession,
    aftersetupSize    : aftersetupSize
  };
    
}) (VISH, jQuery);

 