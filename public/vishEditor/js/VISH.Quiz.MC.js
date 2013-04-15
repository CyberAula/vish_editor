VISH.Quiz.MC = (function(V,$,undefined){
  
  var choicesLetters = ['a)','b)','c)','d)','e)','f)','g)','h)','i)','j)','k)','l)','m)','n)','o)','p)','q)','r)','s)'];
  var answers = {};


  var init = function(){
      _loadEvents();
  };

  var _loadEvents = function(){
  }

  var render = function(slide,template){
    var quizId = V.Utils.getId();
    var container = $("<div id='"+quizId+"' class='quizzContainer mcContainer' type='"+VISH.Constant.QZ_TYPE.MCHOICE+"'></div>");

    //Question
    var questionWrapper = $("<div class='mc_question_wrapper, mc_question_wrapper_viewer'></div>");
    $(questionWrapper).html(slide.question.wysiwygValue);
    $(container).append(questionWrapper);

    //Options
    var optionsWrapper = $("<ul class='mc_options'></<ul>");
    answers[quizId] = [];

    for(var i=0; i<slide.choices.length; i++){
      var option = slide.choices[i];
      var li = $("<li class='mc_option' nChoice='"+(i+1)+"'></li>");
      var optionWrapper = $("<div class='option_wrapper'></div>");
      var optionRadio = $("<input class='mc_radio' type='radio' name='mc_radio' value='"+i+"'/>");
      var optionIndex = $("<span class='mc_option_index'>"+choicesLetters[i]+"</span>");
      var optionText = $("<div class='mc_option_text mc_option_text_viewer'></div>");
      $(optionText).html(option.wysiwygValue);

      $(optionWrapper).append(optionRadio);
      $(optionWrapper).append(optionIndex);
      $(optionWrapper).append(optionText);
      $(li).append(optionWrapper);
      $(optionsWrapper).append(li);

      answers[quizId].push(option.answer);
    }
    $(container).append(optionsWrapper);

    var quizButtons = V.Quiz.renderButtons(slide.selfA);
    $(container).append(quizButtons);

    return V.Utils.getOuterHTML(container);
  };

  var onAnswerQuiz = function(quiz){
    var myAnswer;
    $(quiz).find("input[type='radio']").each(function(index,radioButton){
      if($(radioButton).is(':checked')){
        myAnswer = parseInt($(radioButton).attr("value"));
      }
    });

    if(myAnswer){
      //Compare
      var quizAnswers = answers[$(quiz).attr("id")];
      var correct = quizAnswers[myAnswer];
      if(correct){
        console.log("correct");
      } else {
        console.log("incorrect");
      }
    }
  }

  var getAnswers = function(){
    return answers;
  }

  return {
    init          : init,
    render        : render,
    getAnswers    : getAnswers,
    onAnswerQuiz  : onAnswerQuiz
  };
    
}) (VISH, jQuery);

 