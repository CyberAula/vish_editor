VISH.Quiz.TF = (function(V,$,undefined){
  
  var init = function(){
      _loadEvents();
  };


  var _loadEvents = function(){
    $(document).on('click','.tfCheckbox_viewer', _onCheckboxClick);
  }


  var _onCheckboxClick = function(event){
    var check = $(event.target).attr("check");
    var column = $(event.target).attr("column");

    switch(column){
      case "true":
        if(check==="true"){
          V.Quiz.updateCheckbox(event.target,"none");
        } else {
          var falseColumnCheckbox = $(event.target).parent().find(".tfCheckbox_viewer[column='false']");
          V.Quiz.updateCheckbox(falseColumnCheckbox,"none");
          V.Quiz.updateCheckbox(event.target,"true");
        }
        break;
      case "false":
        if(check==="false"){
          V.Quiz.updateCheckbox(event.target,"none");
        } else {
          var trueColumnCheckbox = $(event.target).parent().find(".tfCheckbox_viewer[column='true']");
          V.Quiz.updateCheckbox(trueColumnCheckbox,"none");
          V.Quiz.updateCheckbox(event.target,"false");
        }
        break;
      default:
        break;
    }
  }


  var render = function(slide,template){
    var mcQuestion = $(V.Quiz.MC.render(slide,template));
    $(mcQuestion).attr("type",VISH.Constant.QZ_TYPE.TF);
    $(mcQuestion).find(".option_wrapper").each(function(index,option){
      //Remove radio input
      $(option).find(".mc_radio").remove();
      //Add checkbox input
      var optionCheckbox = $("<img src='/vishEditor/images/quiz/checkbox.jpg' class='tfCheckbox_viewer' column='true' check='none'/><img src='/vishEditor/images/quiz/checkbox.jpg' class='tfCheckbox_viewer' column='false' check='none'/>");
      $(option).prepend(optionCheckbox);
    });
    return V.Utils.getOuterHTML(mcQuestion);
  };

  var onAnswerQuiz = function(quiz){
    // TODO
    // var myAnswer;
    // $(quiz).find("input[type='radio']").each(function(index,radioButton){
    //   if($(radioButton).is(':checked')){
    //     myAnswer = parseInt($(radioButton).attr("value"));
    //   }
    // });

    // if(myAnswer){
    //   //Compare
    //   var quizAnswers = V.Quiz.MC.answers[$(quiz).attr("id")];
    //   var correct = quizAnswers[myAnswer];
    //   if(correct){
    //     console.log("correct");
    //   } else {
    //     console.log("incorrect");
    //   }
    // }
  }

  return {
    init          : init,
    render        : render,
    onAnswerQuiz  : onAnswerQuiz
  };
    
}) (VISH, jQuery);

 