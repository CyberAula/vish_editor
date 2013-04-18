VISH.Quiz.TF = (function(V,$,undefined){
  
  var init = function(){
      _loadEvents();
  };

  var _loadEvents = function(){
  }

  var render = function(slide,template){
    var mcQuestion = $(V.Quiz.MC.render(slide,template));
    $(mcQuestion).attr("type",VISH.Constant.QZ_TYPE.TF);

    var ul =  $(mcQuestion).find(".mc_options");
    var newLi = $("<li class='mc_option'>");
    $(newLi).html("<img src='"+V.ImagesPath+"quiz/checkbox_checked.jpg' class='tfCheckbox_viewer'/><img src='"+V.ImagesPath+"quiz/checkbox_wrong.png' class='tfCheckbox_viewer'/>");

    $(mcQuestion).find(".option_wrapper").each(function(index,option){
      //Remove radio input
      $(option).find(".mc_box").remove();
      //Add new radio buttons
      var form = $("<form></form>");
      $(form).prepend("<input class='tf_radio' type='radio' name='tf_radio' column='false' value='"+index+"'/>");
      $(form).prepend("<input class='tf_radio' type='radio' name='tf_radio' column='true' value='"+index+"'/>");
      $(option).prepend(form);
    });
    return V.Utils.getOuterHTML(mcQuestion);
  };

  var onAnswerQuiz = function(quiz){
    var choices = V.Quiz.MC.getChoices()[$(quiz).attr("id")];

    $(quiz).find("form").each(function(index,form){
      var trueRadio = $(form).find("input[type='radio'][column='true']")[0];
      var falseRadio = $(form).find("input[type='radio'][column='false']")[0];

      var myAnswer;
      if($(trueRadio).is(':checked')){
        myAnswer = true;
      } else if($(falseRadio).is(':checked')){
        myAnswer = false;
      } else {
        myAnswer = undefined;
      }

      var choice = choices[index];
      var liChoice = $(quiz).find("li.mc_option")[index+1];

      if(myAnswer===choice.answer){
        $(liChoice).addClass("mc_correct_choice");
      } else if(typeof myAnswer != "undefined"){
        $(liChoice).addClass("mc_wrong_choice");
      } else {
        //No mark, indicate correct answer
        if(choice.answer===true){
          $(trueRadio).attr('checked', true);
        } else if(choice.answer===false){
          $(falseRadio).attr('checked', true);
        }
      }
    });

    $(quiz).find("input[type='radio']").attr("disabled","disabled");
    V.Quiz.disableAnswerButton(quiz);
  }

  return {
    init          : init,
    render        : render,
    onAnswerQuiz  : onAnswerQuiz
  };
    
}) (VISH, jQuery);

 