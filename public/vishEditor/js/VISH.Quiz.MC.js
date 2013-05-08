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
    var container = $("<div id='"+quizId+"' class='quizzContainer mcContainer' type='"+V.Constant.QZ_TYPE.MCHOICE+"'></div>");

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
    var optionsWrapper = $("<table cellspacing='0' cellpadding='0' class='mc_options'></table>");
    choices[quizId] = [];

    for(var i=0; i<slide.choices.length; i++){
      var option = slide.choices[i];
      var optionWrapper = $("<tr class='mc_option' nChoice='"+(i+1)+"'></tr>");
      var optionBox = $("<td><input class='mc_box' type='"+inputType+"' name='mc_option' value='"+i+"'/></td>");
      var optionIndex = $("<td><span class='mc_option_index mc_option_index_viewer'>"+choicesLetters[i]+"</span></td>");
      var optionText = $("<td><div class='mc_option_text mc_option_text_viewer'></div></td>");
      $(optionText).html(option.wysiwygValue);

      $(optionWrapper).append(optionBox);
      $(optionWrapper).append(optionIndex);
      $(optionWrapper).append(optionText);
      $(optionsWrapper).append(optionWrapper);

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
        var trAnswer = $("tr.mc_option").has(radioBox);
        if(choice.answer===true){
          $(trAnswer).addClass("mc_correct_choice");
        } else if(choice.answer===false){
          $(trAnswer).addClass("mc_wrong_choice");
        }
        answeredQuiz = true;
      }
    });

    //Look and mark correct answers
    var trCorrectAnswers = [];
    for (var key in quizChoices){
      if(quizChoices[key].answer===true){
        //Get correct choice
        var trCorrect = $(quiz).find("tr.mc_option")[key];
        trCorrectAnswers.push($(quiz).find("tr.mc_option")[key]);
        if(answeredQuiz){
          $(trCorrect).addClass("mc_correct_choice");
        }
      }
    }

    //Unfulfilled quiz
    if(!answeredQuiz){
      //Mark correct answers without colors
      $(trCorrectAnswers).each(function(index,trCorrect){
        $(trCorrect).find("input[name='mc_option']").attr("checked","checked");
      });
    }

    disableQuiz(quiz);
  }

  var getReport = function(quiz){
    var report = {};
    report.answers = [];

    $(quiz).find("input[name='mc_option']").each(function(index,radioBox){
      if($(radioBox).is(':checked')){
        report.answers.push({no: (index+1).toString(), answer: "true"});
      }
    });

    report.empty = (report.answers.length===0);
    return report;
  }

  var disableQuiz = function(quiz){
    $(quiz).find("input[name='mc_option']").attr("disabled","disabled");
    V.Quiz.disableAnswerButton(quiz);
  }

  var getChoicesLetters = function(){
    return choicesLetters;
  }

  /*
   * Data representation
   */

  var drawAnswers = function(quiz,answersList,options){
    var canvas = $("#quiz_chart");
    var nAnswers = $(quiz).find("tr.mc_option[nChoice]").length;
    V.QuizCharts.drawQuizChart(canvas,V.Constant.QZ_TYPE.MCHOICE,nAnswers,answersList,options);
  }

  return {
    init                : init,
    render              : render,
    onAnswerQuiz        : onAnswerQuiz,
    getChoicesLetters   : getChoicesLetters,
    getReport           : getReport,
    disableQuiz         : disableQuiz,
    drawAnswers         : drawAnswers
  };
    
}) (VISH, jQuery);

 