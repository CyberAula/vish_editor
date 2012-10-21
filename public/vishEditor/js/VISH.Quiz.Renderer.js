VISH.Quiz.Renderer = (function(V,$,undefined){


  var init = function(){


  }

  ////////////////////
  //renderer methods called from VISH.Renderer
  ///////////////////

  /**
   * Function to render a quiz inside an article (a slide)
   */
  var renderQuiz = function(quizType, element, zone_class, slide, zone){

    switch(quizType){
      case "multiplechoice":
        return _renderMcQuestion(element, zone_class, slide, zone);

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


  var _renderMcQuestion = function(element, zone_class, slide, zone){ 


      var ret = "<div id='"+element['id']+"' class='"+ zone_class + " quiz'>";
      ret += "<div class='mcquestion_container'>";
      ret += "<div class='mcquestion_header'></div>";
      ret += "<div class='mcquestion_body'><h2 class='question'>"+ element['question']+"</h2>";
      ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";

      for(var i = 0; i<element['options'].length; i++){
        var next_index = String.fromCharCode("a".charCodeAt(0) + (i));
        if(VISH.Quiz.getQuizMode()=="answer"){
          ret += "<label class='mc_answer'>"+next_index+") <input class='mc_radio' type='radio' name='mc_radio' value='"+next_index+"'</input>"+element['options'][i]+"</label>";
        } else {
          ret += "<label class='mc_answer'>"+next_index+") "+element['options'][i]+"</label>";
        }
        ret += "<div class='mc_meter'><span style='width:0%' >&nbsp;</span></div>";
        ret += "<label class='mcoption_label'></label>";
      }
      ret += "<input type='hidden' value='"+ slide + "_"+ zone +"' name='zone' />";
      ret += "<input type='hidden' value='"+element['quizid']+"' name='quizid' class='quizId' />";
      ret += "</div>";
      ret += "<div class='mcquestion_buttons'>";
      ret += "<div class='mch_statistics_icon_wrapper'>";
      ret += "<img class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
      ret += "</div>";
      ret += "<div class='mch_inputs_wrapper'>";
      ret += "<a href='#start_quiz_fancybox' class='quiz_session_start_link' id='launchQuizFancybox'><input type='button' class='quiz_session_start_button' value='Start Quiz'/></a>";
      ret += "<input type='button' class='quiz_session_options_button' value='Options'/>";
      ret += "</div>";
      ret += "</form>";
      ret += "</div>";
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