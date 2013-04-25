VISH.Quiz = (function(V,$,undefined){
  
  var quizMode; //selfA or realTime

  var initBeforeRender = function(presentation){
    if(presentation.type===V.Constant.QUIZ_SIMPLE){
      quizMode = V.Constant.QZ_MODE.RT;
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
  }

  var _onAnswerQuiz = function(event){
    var quiz = $("div.quizzContainer").has(event.target);
    var quizModule = _getQuizModule($(quiz).attr("type"));
    if(quizModule){
      if(quizMode===V.Constant.QZ_MODE.SELFA){
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
    var quizJSON = _getQuizJSONFromSlide(V.Slides.getCurrentSlide());
    V.Quiz.API.postStartQuizSession(quizJSON,_onQuizSessionReceived,_onQuizSessionReceivedError);
  }

  var _onQuizSessionReceived = function(data){
    console.log("_onQuizSessionReceived");
    console.log(data);
  }

  var _onQuizSessionReceivedError = function(error){
    console.log("_OnQuizSessionReceivedError");
    console.log(error);
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

    if((quizMode === V.Constant.QZ_MODE.SELFA)&&((V.Configuration.getConfiguration().mode===V.Constant.VISH)||(V.Configuration.getConfiguration()["mode"]===V.Constant.NOSERVER))&&(V.User.isLogged())){
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
    init            : init,
    render          : render,
    renderButtons   : renderButtons,
    updateCheckbox  : updateCheckbox,
    disableAnswerButton : disableAnswerButton
  };
    
}) (VISH, jQuery);

 