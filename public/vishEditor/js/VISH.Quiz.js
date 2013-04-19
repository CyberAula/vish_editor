VISH.Quiz = (function(V,$,undefined){
  
  var quizMode; //selfA or realTime
  var selfA = "selfA";
  var realTime = "realTime";

  var init = function(presentation){
    V.Quiz.MC.init();
    V.Quiz.TF.init();
    _loadEvents();
    if(presentation.type===VISH.Constant.QUIZ_SIMPLE){
      quizMode = VISH.Constant.QZ_MODE.RT;
    } else {
      quizMode = VISH.Constant.QZ_MODE.SELFA;
    }
  };

/*
 * Load common events of Quizzes: answer, stats, etc
 */
  var _loadEvents = function(){
    $(document).on('click', ".quizAnswerButton",_onAnswerQuiz);
    $(document).on('click', ".quizStartButton",_onStartQuiz);
  }

  var _onAnswerQuiz = function(event){
    var quiz = $("div.quizzContainer").has(event.target);
    var quizModule = _getQuizModule($(quiz).attr("type"));
    if(quizModule){
      if(quizMode===VISH.Constant.QZ_MODE.SELFA){
        quizModule.onAnswerQuiz(quiz);
      } else {
        var report = quizModule.getResults(quiz);
        _answerRTQuiz(quiz,quizModule,report);
      }      
    }
  }

  var _answerRTQuiz = function(quiz,quizModule,report){
    if(report.empty===true){
      alert("Answer the quiz before send");
      return;
    }
    quizModule.disableQuiz(quiz);

    var results = report.results;
    V.Debugging.log(results)
    //Send to ViSH... get Quiz session id, etc
    
    alert("Your answer has been submitted");
  }

  var _onStartQuiz = function(){
    // console.log("onStartQuiz");
    //TODO
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
    if(VISH.User.isLogged()){
      var startButton = $("<input type='button' class='quizButton quizStartButton' value='Start'/>");
      // $(quizButtons).prepend(startButton); //Not in this version
    }
    if(selfA){
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


  /*
   * Utils
   */
  var _getQuizModule = function(quiz_type){
    switch (quiz_type) {
      case VISH.Constant.QZ_TYPE.OPEN:
         break;
      case VISH.Constant.QZ_TYPE.MCHOICE:
        return V.Quiz.MC;
        break;
      case VISH.Constant.QZ_TYPE.TF:
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
        $(checkbox).attr("src",imagePathRoot+"_checked.jpg");
        break;
      case "false":
        $(checkbox).attr("check","false");
        $(checkbox).attr("src",imagePathRoot+"_wrong.png");
        break;
      case "none":
      default:
        $(checkbox).attr("check","none");
        $(checkbox).attr("src",imagePathRoot+".jpg");
        break;
    }
  }

  return {
    init            : init,
    render          : render,
    renderButtons   : renderButtons,
    updateCheckbox  : updateCheckbox,
    disableAnswerButton : disableAnswerButton
  };
    
}) (VISH, jQuery);

 