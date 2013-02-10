VISH.Quiz.Renderer = (function(V,$,undefined){
  var isQuizInPreview= false;

  var init = function(){
  };

  ////////////////////
  //renderer methods called from VISH.Renderer
  ///////////////////

  /**
   * Function to render a quiz inside an article (a slide)
   */
  var renderQuiz = function(quizType, quiz_element, zone_class, slide_id, zone){
    switch(quizType){
      case "multiplechoice":
        return _renderMcQuestion(quiz_element, zone_class, slide_id, zone);

        break;

      case "openQuestion":
        return _renderOpenquestion(element, template);
        break;
      case "truefalse":
        return _renderTrueFalseQuestion(quiz_element, zone_class, slide_id, zone);

        break;
      default:
        break;
    }
  };

  var _renderMcQuestion = function(quiz_element, zone_class, slide_id, zone){ 
      V.Debugging.log("_renderMcQuestion, and quiz choices received is:  " + JSON.stringify(quiz_element['options']['choices']));
      var ret = "<div id='"+quiz_element['id']+"' class='"+ zone_class + " quiz' quiztype='multiplechoice'>";
      ret += "<div class='mcquestion_container'>";
      ret += "<div class='mcquestion_body'>";
      ret += "<div class='value_multiplechoice_question_in_zone question_in_viewer'>"+ quiz_element['question']+"</div>";
      ret += "<form class='mcquestion_form' action='"+quiz_element['posturl']+"' method='post'>";
      ret += "<ul class='ul_mch_options_in_zone'>";  
      for(var i = 0; i<quiz_element['options']['choices'].length; i++){
        var next_index = String.fromCharCode("a".charCodeAt(0) + (i));
        if(VISH.Quiz.getQuizMode()=="answer"){
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


  var _renderOpenquestion = function(element, template){
    var ret = "<form action='"+element['posturl']+"' method='post' style='text-align:center;'>";
    ret += "<label class='question_name'>Name:  </label>";
    ret += "<textarea id='pupil_name' rows='1' cols='50' class='question_name_input' placeholder='Write your name here'></textarea>";
    ret += "<h2 class='question'> Question: "+element['question']+"? </h2>";        
    
    ret += "<label class='label_question'>Answer: </label>";
    ret += "<textarea id='question_answer' rows='5' cols='50' class='question_answer' placeholder='Write your answer here'></textarea>";
    
    ret += "<button type='button' class='question_button'>Send</button>";
    
    return ret;   
  };


  /**
   * Function to render a True False Question choice question form inside an article (a slide)
   * TODO Include in the VISH.Quiz?? ... think and ask Kike about it 
   */
  
  var _renderTrueFalseQuestion = function(quiz_element, zone_class, slide_id, zone){

    var ret = "<div id='"+quiz_element['id']+"' class='"+ zone_class +" quiz' quiztype='truefalse'>";
    ret += "<div class='truefalse_question_container'>";
 
    //ret += "<form class='truefalse_question_form' action='"+element['posturl']+"' method='post'>";
    ret+= "<div class='value_truefalse_question_in_zone question_in_viewer'>";
    ret += quiz_element['question'];
    ret += "</div>";
    ret += "<div class='truefalse_options_in_zone'> ";
    ret += "<form class='truefalse_form' action='"+quiz_element['posturl']+"' method='post'>";
    ret += "<div class='truefalse_options'>";
       ret += "<div class='truefalse_titles'>";
          ret += "<div class='truefalse_titles_true'>True</div>";
          ret += "<div class='truefalse_titles_false'>False</div>";
        ret += "</div>";

 if(VISH.Quiz.getQuizMode()=="answer"){  //Just radio inputs to respond   
    ret+= "<div class='truefalse_answers answer_mode'>";
    ret += "<input class='truefalse_answer_radio_true' type='radio' name='truefalse' value='true'/>";
    ret += "<input class='truefalse_answer_radio_false' type='radio' name='truefalse' value='false'/>";
    ret += "</div>";

    }
  else { //Teacher view.  button to enable answers view or not (default view not show)
    
    ret+= "<div class='truefalse_answers teacher_mode'>";
    if( quiz_element['options']['answer']=="true") {
      ret += "<input class='truefalse_answer_radio_true' type='radio' name='truefalse' value='true' disabled='disabled' checked/>";
      ret += "<input class='truefalse_answer_radio_false' type='radio' name='truefalse' value='false' disabled='disabled'/>";
    }
    else if ( quiz_element['options']['answer']==="false") {
      ret += "<input class='truefalse_answer_radio_true' type='radio' name='truefalse' value='true' disabled='disabled'/>";
      ret += "<input class='truefalse_answer_radio_false' type='radio' name='truefalse' value='false' disabled='disabled' checked/>";
    }
    ret += "</div>";
    ret += "<div class='truefalse_options_container'>";
    ret += "<li class='truefalse_options_in_zone'>";
    ret += "<div class='truefalse_titles_true'>True</div>";
    ret += "</li>";
    ret += "<div class='mc_meter'><span style='width:0%' >&nbsp;</span></div>";
    ret += "<label class='mcoption_label'></label>";
    ret += "<li class='truefalse_options_in_zone'>";
    ret += "<div class='truefalse_titles_false'>False</div>";
    ret += "</li>";
    //ret += "</div>";    
    ret += "<div class='mc_meter'><span style='width:0%' >&nbsp;</span></div>";
    ret += "<label class='mcoption_label'></label>";
    ret += "</div>";
 
    ret += "<div class='showhide_answer_button_container'>";
    ret += "<input type='button' class='show_answers_button' value='Show Answer'/>";
    ret += "<input type='button' class='hide_answers_button' value='Hide Answer'/>";
    ret += "</div>";


  }

      ret += "</div>";
      //ret += "<input type='hidden' value='"+ zone +"' name='zone' />";
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
 

  return {
    init                              : init,
    renderQuiz                        : renderQuiz

  };
    
}) (VISH, jQuery);