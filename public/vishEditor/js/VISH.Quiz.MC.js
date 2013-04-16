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
      var optionRadio = $("<input class='mc_radio' type='radio' name='mc_radio' value='"+i+"'/>");
      var optionIndex = $("<span class='mc_option_index'>"+choicesLetters[i]+"</span>");
      var optionText = $("<div class='mc_option_text mc_option_text_viewer'></div>");
      $(optionText).html(option.wysiwygValue);

      $(optionWrapper).append(optionRadio);
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
    var myAnswerValue;
    var myAnswer;
    var lisCorrect = [];

    $(quiz).find("input[type='radio']").each(function(index,radioButton){
      if($(radioButton).is(':checked')){
        myAnswerValue = parseInt($(radioButton).attr("value"));
        myAnswer = $("li.mc_option").has(radioButton);
      }
    });

    //Look for correct answer
    var quizChoices = choices[$(quiz).attr("id")];
    for (var key in quizChoices){
      if(quizChoices[key].answer===true){
        //Get correct choice
        lisCorrect.push($(quiz).find("li.mc_option")[key]);
      }
    }

    if(myAnswerValue){
      var choice = quizChoices[myAnswerValue];
      if(choice.answer===true){
        $(myAnswer).addClass("mc_correct_choice");
      } else if(choice.answer===false){
        $(myAnswer).addClass("mc_wrong_choice");
        $(lisCorrect).each(function(index,liCorrect){
          $(liCorrect).addClass("mc_correct_choice");
        });
      }
    } else {
      $(lisCorrect).each(function(index,liCorrect){
        // $(liCorrect).addClass("mc_correct_choice");
        $(liCorrect).find("input[type='radio']").attr("checked","checked");
      });
    }

    $(quiz).find("input[type='radio']").attr("disabled","disabled");
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

 