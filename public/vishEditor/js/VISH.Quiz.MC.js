VISH.Quiz.MC = (function(V,$,undefined){
  
  var choicesLetters = ['a)','b)','c)','d)','e)','f)','g)','h)','i)','j)','k)','l)','m)','n)','o)','p)','q)','r)','s)'];
  var choices = {};


  var init = function(){
      _loadEvents();
  };

  var _loadEvents = function(){
  }

  var render = function(slide,template){
    var quizId = V.Utils.getId();
    var container = $("<div id='"+quizId+"' class='quizzContainer mcContainer' type='"+VISH.Constant.QZ_TYPE.MCHOICE+"'></div>");

    var multipleAnswer = false;
    var inputType = 'radio';
    if((slide.extras)&&(slide.extras.multipleAnswer===true)){
      multipleAnswer = true;
      inputType = 'checkbox';
    }

    //Question
    var questionWrapper = $("<div class='mc_question_wrapper, mc_question_wrapper_viewer'></div>");
    $(questionWrapper).html(slide.question.wysiwygValue);
    $(container).append(questionWrapper);

    //Options
    var optionsWrapper = $("<ul class='mc_options'></<ul>");
    choices[quizId] = [];

    for(var i=0; i<slide.choices.length; i++){
      var option = slide.choices[i];
      var li = $("<li class='mc_option' nChoice='"+(i+1)+"'></li>");
      var optionWrapper = $("<div class='option_wrapper'></div>");
      var optionBox = $("<input class='mc_box' type='"+inputType+"' name='mc_option' value='"+i+"'/>");
      var optionIndex = $("<span class='mc_option_index'>"+choicesLetters[i]+"</span>");
      var optionText = $("<div class='mc_option_text mc_option_text_viewer'></div>");
      $(optionText).html(option.wysiwygValue);

      $(optionWrapper).append(optionBox);
      $(optionWrapper).append(optionIndex);
      $(optionWrapper).append(optionText);
      $(li).append(optionWrapper);
      $(optionsWrapper).append(li);

      choices[quizId].push(option);
    }
    $(container).append(optionsWrapper);

    var quizButtons = V.Quiz.renderButtons(slide.selfA);
    $(container).append(quizButtons);

    return V.Utils.getOuterHTML(container);
  };

  var onAnswerQuiz = function(quiz){
    var answeredQuiz = false;
    var quizChoices = choices[$(quiz).attr("id")];
   
    //Color correct and wrong answers
    $(quiz).find("input[name='mc_option']").each(function(index,radioBox){
      var answerValue = parseInt($(radioBox).attr("value"));
      var choice = quizChoices[answerValue];

      if($(radioBox).is(':checked')){
        var liAnswer = $("li.mc_option").has(radioBox);
        if(choice.answer===true){
          $(liAnswer).addClass("mc_correct_choice");
        } else if(choice.answer===false){
          $(liAnswer).addClass("mc_wrong_choice");
        }
        answeredQuiz = true;
      }
    });

    //Look and mark correct answers
    var liCorrectAnswers = [];
    for (var key in quizChoices){
      if(quizChoices[key].answer===true){
        //Get correct choice
        var liCorrect = $(quiz).find("li.mc_option")[key];
        liCorrectAnswers.push($(quiz).find("li.mc_option")[key]);
        if(answeredQuiz){
          $(liCorrect).addClass("mc_correct_choice");
        }
      }
    }

    //Unfulfilled quiz
    if(!answeredQuiz){
      //Mark correct answers without colors
      $(liCorrectAnswers).each(function(index,liCorrect){
        $(liCorrect).find("input[name='mc_option']").attr("checked","checked");
      });
    }

    $(quiz).find("input[name='mc_option']").attr("disabled","disabled");
    V.Quiz.disableAnswerButton(quiz);
  }

  var getChoices = function(){
    return choices;
  }

  return {
    init          : init,
    render        : render,
    getChoices    : getChoices,
    onAnswerQuiz  : onAnswerQuiz
  };
    
}) (VISH, jQuery);

 