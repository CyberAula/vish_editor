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

    $("a#addQuizSessionFancybox").fancybox({
      'autoDimensions' : false,
      'scrolling': 'no',
      'width': '90%',
      'height': '90%',
      'margin': '20%',
      'padding': 0,
      "autoScale" : true,
      "onStart"  : function(data) {
        loadTab('tab_quiz_session');
      },
      "onClosed"  : function(){
        _stopPolling();
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
      alert("Answer the quiz before send");
      return;
    }
    quizModule.disableQuiz(quiz);

    var answers = report.answers;
    V.Debugging.log(answers);

    V.Quiz.API.sendAnwers(answers, quizSessionId, 
      function(data){
         alert("Your answer has been submitted");
    }, 
      function(error){
        alert("Error on submit answer");
    });
  }

  var _onStartQuiz = function(event){
    var startButton = $(event.target);
    var quiz = $("div.quizzContainer").has(startButton);

    switch($(startButton).attr("quizStatus")){
      case "running":
        $("a#addQuizSessionFancybox").trigger("click");
        break;
      case "loading":
        break;
      case "stop":
      default:
        //Start new quiz session
        _loadingLaunchButton(quiz);
        var quizJSON = _getQuizJSONFromQuiz(quiz);
        V.Quiz.API.startQuizSession(quiz,quizJSON,_onQuizSessionReceived,_onQuizSessionReceivedError);
        break;
    }
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
    _stopLaunchButton(quiz);
  }

  var _getQuizJSONFromQuiz = function(quiz){
    var slide = $("article").has(quiz);
    return _getQuizJSONFromSlide(slide);
  }

  var _getQuizJSONFromSlide = function(slide){
    var slideId = $(slide).attr("id");
    var presentation = V.SlideManager.getCurrentPresentation();
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
      var startButton = $("<input type='button' class='quizButton quizStartButton' value='Start'/>");
      $(quizButtons).prepend(startButton);
    }
    if((selfA)||(quizMode === V.Constant.QZ_MODE.RT)){
      var answerButton = $("<input type='button' class='quizButton quizAnswerButton' value='Answer'/>");
      $(quizButtons).prepend(answerButton);
    }

    return quizButtons;
  }

  var disableAnswerButton = function(quiz){
    var answeButton = $(quiz).find("input.quizAnswerButton");
    $(answeButton).attr("disabled", "disabled");
    $(answeButton).addClass("quizAnswerButtonDisabled");
  }

  var _loadingLaunchButton = function(quiz){
    var startButton = $(quiz).find("input.quizStartButton");
    $(startButton).attr("disabled", "disabled");
    $(startButton).addClass("quizStartButtonLoading");
    $(startButton).attr("quizStatus","loading");
    $(startButton).attr("value","Start");
  }

  var _runningLaunchButton = function(quiz){
    var startButton = $(quiz).find("input.quizStartButton");
    $(startButton).removeAttr("disabled");
    $(startButton).removeClass("quizStartButtonLoading");
    $(startButton).attr("quizStatus","running");
    $(startButton).attr("value","Options");
  }

  var _stopLaunchButton = function(quiz){
    var startButton = $(quiz).find("input.quizStartButton");
    $(startButton).removeAttr("disabled");
    $(startButton).removeClass("quizStartButtonLoading");
    $(startButton).removeAttr("quizStatus");
    $(startButton).attr("value","Start");
  }


  /*
   *  Fancybox
   */

  var loadTab = function(tab_id){
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
    if(!currentQuizSession){
      return;
    }
    var myA = $("<a class='link_quiz_session_url' target='_blank' href='"+currentQuizSession.url+"'>"+currentQuizSession.url+"</a>");
    $("#tab_quiz_session_url").html("");
    $("#tab_quiz_session_url").prepend(myA);
  }

  var _loadStats = function(){
    V.Quiz.API.getResults(currentQuizSession.id, function(results){
        _drawResults(results);
        _startPolling();
    });
  }

  var _startPolling = function(){
    _stopPolling();
    currentPolling = setInterval(function(){
      V.Quiz.API.getResults(currentQuizSession.id, function(results){
        _drawResults(results);
      });
    },2000);
  }

  var _stopPolling = function(){
    if(currentPolling){
      clearInterval(currentPolling);
    }
  }

  var _drawResults = function(results){
    var statsDiv = $("#tab_quiz_session_results");
    $(statsDiv).html("<p>"+JSON.stringify(results)+"</p>");
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

  return {
    initBeforeRender  : initBeforeRender,
    init              : init,
    render            : render,
    renderButtons     : renderButtons,
    updateCheckbox    : updateCheckbox,
    disableAnswerButton : disableAnswerButton,
    loadTab           : loadTab
  };
    
}) (VISH, jQuery);

 