VISH.Quiz.Renderer = (function(V,$,undefined){
  var isQuizInPreview= false;

  var init = function(){
  };

  ////////////////////
  //renderer methods called from V.Renderer
  ///////////////////

  /**
   * Function to render a quiz inside an article (a slide)
   */
  var renderQuiz = function(slide,template){
    switch(slide.quiztype){
      case V.Constant.QZ_TYPE.MCHOICE:
        return _renderMcQuestion(slide,template);
        break;
      default:
        break;
    }
  };


  var _renderMcQuestion = function(slide,template){
      console.log("_renderMcQuestion");
      console.log(slide);
      console.log(template);
      return;

      
      V.Debugging.log("_renderMcQuestion, and quiz choices received is:  " + JSON.stringify(quiz_element['options']['choices']));
      var ret = "<div id='"+quiz_element['id']+"' class='"+ zone_class + " quiz' quiztype='multiplechoice'>";
      ret += "<div class='mcquestion_container'>";
      ret += "<div class='mcquestion_body'>";
      ret += "<div class='value_multiplechoice_question_in_zone question_in_viewer'>"+ quiz_element['question']+"</div>";
      ret += "<form class='mcquestion_form' action='"+quiz_element['posturl']+"' method='post'>";
      ret += "<ul class='ul_mch_options_in_zone'>";  
      for(var i = 0; i<quiz_element['options']['choices'].length; i++){
        var next_index = String.fromCharCode("a".charCodeAt(0) + (i));
        if(V.Quiz.getQuizMode()=="answer"){
          ret += "<li class='li_mch_options_in_zone'>";
          ret += "<input class='mc_radio' type='radio' name='mc_radio' value='"+next_index+"'/><span class='quiz_option_index'>"+next_index+")</span><div class='multiplechoice_option_in_zone multiplechoice_option_in_viewer'>"+quiz_element.options['choices'][i]['container']+"</div>";
          ret += "</li>"
        }
        else {
          ret += "<li class='li_mch_options_in_zone'>";
          ret += "<span class='quiz_option_index'>"+next_index+")</span><div class='multiplechoice_option_in_zone multiplechoice_option_in_viewer'>"+quiz_element.options['choices'][i]['container']+"</div>";
          ret += "</li>"
         }
        ret += "<div class='mc_meter'><span style='width:0%' >&nbsp;</span></div>";
        ret += "<label class='mcoption_label'></label>";
      } 
      ret += "</ul>";
      ret += "<input type='hidden' value='"+ zone +"' name='zone' />";
      ret += "<input type='hidden' value='"+quiz_element['quiz_id']+"' name='quiz_id' class='quizId' />";
      ret += "<div class='mch_inputs_wrapper'>";
      ret += "<a href='#start_quiz_fancybox' class='quiz_session_start_link' id='launchQuizFancybox'><input type='button' class='quiz_session_start_button' value='Start Quiz'/></a>";
      ret += "<input type='button' class='quiz_send_vote_button' value='Send'/>";
      ret += "<input type='button' class='quiz_session_options_button' value='Options'/>";
      ret += "</div>"; //close mch_input_wrapper
      ret += "</form>";
      ret += "</div>";//close mcquestion_body
      ret += "</div>";//close mcquestion_container
       ret += "</div>"; //close zoneclass quiz
      return ret;
  };

  // var _renderMcQuestion = function(quiz_element, zone_class, slide_id, zone){
  //     V.Debugging.log("_renderMcQuestion, and quiz choices received is:  " + JSON.stringify(quiz_element['options']['choices']));
  //     var ret = "<div id='"+quiz_element['id']+"' class='"+ zone_class + " quiz' quiztype='multiplechoice'>";
  //     ret += "<div class='mcquestion_container'>";
  //     ret += "<div class='mcquestion_body'>";
  //     ret += "<div class='value_multiplechoice_question_in_zone question_in_viewer'>"+ quiz_element['question']+"</div>";
  //     ret += "<form class='mcquestion_form' action='"+quiz_element['posturl']+"' method='post'>";
  //     ret += "<ul class='ul_mch_options_in_zone'>";  
  //     for(var i = 0; i<quiz_element['options']['choices'].length; i++){
  //       var next_index = String.fromCharCode("a".charCodeAt(0) + (i));
  //       if(V.Quiz.getQuizMode()=="answer"){
  //         ret += "<li class='li_mch_options_in_zone'>";
  //         ret += "<input class='mc_radio' type='radio' name='mc_radio' value='"+next_index+"'/><span class='quiz_option_index'>"+next_index+")</span><div class='multiplechoice_option_in_zone multiplechoice_option_in_viewer'>"+quiz_element.options['choices'][i]['container']+"</div>";
  //         ret += "</li>"
  //       }
  //       else {
  //         ret += "<li class='li_mch_options_in_zone'>";
  //         ret += "<span class='quiz_option_index'>"+next_index+")</span><div class='multiplechoice_option_in_zone multiplechoice_option_in_viewer'>"+quiz_element.options['choices'][i]['container']+"</div>";
  //         ret += "</li>"
  //        }
  //       ret += "<div class='mc_meter'><span style='width:0%' >&nbsp;</span></div>";
  //       ret += "<label class='mcoption_label'></label>";
  //     } 
  //     ret += "</ul>";
  //     ret += "<input type='hidden' value='"+ zone +"' name='zone' />";
  //     ret += "<input type='hidden' value='"+quiz_element['quiz_id']+"' name='quiz_id' class='quizId' />";
  //     ret += "<div class='mch_inputs_wrapper'>";
  //     ret += "<a href='#start_quiz_fancybox' class='quiz_session_start_link' id='launchQuizFancybox'><input type='button' class='quiz_session_start_button' value='Start Quiz'/></a>";
  //     ret += "<input type='button' class='quiz_send_vote_button' value='Send'/>";
  //     ret += "<input type='button' class='quiz_session_options_button' value='Options'/>";
  //     ret += "</div>"; //close mch_input_wrapper
  //     ret += "</form>";
  //     ret += "</div>";//close mcquestion_body
  //     ret += "</div>";//close mcquestion_container
  //      ret += "</div>"; //close zoneclass quiz
  //     return ret;
  // };

  return {
    init                              : init,
    renderQuiz                        : renderQuiz

  };
    
}) (VISH, jQuery);