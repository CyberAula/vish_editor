VISH.Quiz.Renderer = (function(V,$,undefined){


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
   /*   case "mcquestion":
        return _renderMcQuestion(element, zone_class, slide);
        break; */
      case "openQuestion":
        return _renderOpenquestion(element, template);
        break;
      case "truefalsequestion":
        return _renderTrueFalseQuestion(element, template);
        break;
      default:
        break;
    }
  };

  var _renderMcQuestion = function(quiz_element, zone_class, slide_id, zone){ 
      V.Debugging.log("_renderMcQuestion, and quiz choices received is:  " + JSON.stringify(quiz_element['options']['choices']));
      var ret = "<div id='"+quiz_element['id']+"' class='"+ zone_class + " quiz'>";
      ret += "<div class='mcquestion_container'>";
      ret += "<div class='mcquestion_body'>";
      ret += "<div class='value_multiplechoice_question_in_zone question_in_viewer'>"+ quiz_element['question']+"</div>";
      ret += "<form class='mcquestion_form' action='"+quiz_element['posturl']+"' method='post'>";
      ret += "<ul class='ul_mch_options_in_zone'>";  
      for(var i = 0; i<quiz_element['options']['choices'].length; i++){
        var next_index = String.fromCharCode("a".charCodeAt(0) + (i));
        if(VISH.Quiz.getQuizMode()=="answer"){
          ret += "<li class='li_mch_options_in_zone'>";
          ret += "<input class='mc_radio' type='radio' name='mc_radio' value='"+next_index+"'/><span>"+next_index+")</span><div class='multiplechoice_option_in_zone multiplechoice_option_in_viewer'>"+quiz_element.options['choices'][i]['container']+"</div>";
          ret += "</li>"
        /*  ret += "<label class='mc_answer'><input class='mc_radio' type='radio' name='mc_radio' value='"+next_index+"'</input>";
          ret += next_index+") "+ quiz_element.options['choices'][i] + "</label>";
        */
        } else {
          ret += "<li class='li_mch_options_in_zone'>";
          ret += "<span>"+next_index+")</span><div class='multiplechoice_option_in_zone multiplechoice_option_in_viewer'>"+quiz_element.options['choices'][i]['container']+"</div>";
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
  
  var _renderTrueFalseQuestion = function(element, template){
    var next_num=0;
    var answers = new Array();
    var ret = "<div id='"+element['id']+"' class='truefalse_question'>";
    
    ret += "<div class='truefalse_question_container'>";
    ret += "<form class='truefalse_question_form' action='"+element['posturl']+"' method='post'>";
    ret+= "<table id='truefalse_quiz_table_1' class='truefalse_quiz_table'><tr><th>True</th><th>False</th><th> Question </th></tr>";
     
    for(var i = 0; i<element['questions'].length; i++){
      //saving correct answers 
      answers[i] =element['questions'][i]['answer'];
      ret +="<tr id='tr_question_"+(i+1)+"'>";
      ret +="<td id='td_true_"+(i+1)+"' class='td_true'>";
      ret += "<input type='radio' name='tf_radio_"+(i+1)+"' value='true' /></td>";
      ret += "<td id='td_false_"+(i+1)+"' class='td_false' >";
      ret += "<input type='radio' name='tf_radio_"+(i+1)+"' value='false'/></td>";
      ret += "<td id='td_question_"+(i+1)+"' class='true_false_question_txt'><label>"+element['questions'][i]['text_question']+"?</label></td>";
      ret += "</tr>";
    }
    
    ret += "</table>";
    ret += "<input type='button' class='tfquestion_button' value='Send'/>";
    ret += "</form>";
    ret += "</div>";
    
    trueFalseAnswers = answers;
    asnswers = [];
    VISH.Debugging.log("JSON object answer is: " +trueFalseAnswers);
    
    return ret;
  };


  return {
    init:                             init,
    renderQuiz:                       renderQuiz
  };
    
}) (VISH, jQuery);