VISH.Quiz.Renderer = (function(V,$,undefined){

  var quiz_id;

  var init = function(quizStatus){
    if(quizStatus && quizStatus.quiz_active_session_id){
      quiz_id = quizStatus.quiz_active_session_id;
    }
  }

  ////////////////////
  //renderer methods called from VISH.Renderer
  ///////////////////

  /**
   * Function to render a quiz inside an article (a slide)
   */
  var renderQuiz = function(quizType, element, template, slide){
    switch(quizType){
      case "mcquestion":
        return _renderMcQuestion(element, template, slide);
        break;
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


  var _renderMcQuestion = function(element, template, slide){ 
      var user = V.User.getUser();
      var logged = V.User.isLogged();
     
      var obj;
      if(quiz_id){
        obj = _renderMcquestionToAnswer(element, template, slide); 
        V.Quiz.setSlideToVote (slide);
      }
      else{
        if(logged){
          obj = _renderMcquestionLogged(element, template, slide); 
        } else {
          obj =  _renderMcquestionNone(element, template, slide);
        }
      }

      return obj;
  };


  /*
  * Render an Multiple choice question slide for an user who is logged in. In this case 
  * the user can start the Quiz so we show the quiz with all elements and buttons  
   *we use geter of Quiz Class for using the quiz id to Start Session */
  var _renderMcquestionLogged = function(element, template, slide){
    var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
    ret += "<div class='mcquestion_container'>";
    ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
    ret += "<form id='form_"+slide+"'class='mcquestion_form' action='"+element['posturl']+"' method='post'>";

    for(var i = 0; i<element['options'].length; i++){
      var next_index = String.fromCharCode("a".charCodeAt(0) + (i)); 

      ret += "<label class='mc_answer'>"+next_index+") "+element['options'][i]+"</label>";
      //ret += "<div class='mc_meter'><span id='mcoption"+(i+1)+"'></span></div>";
      ret += "<div class='mc_meter' id='mcoption_div_"+(i+1)+"'><span  id='mcoption_"+next_index+"' style='width:0%'></span></div>";
      ret += "<label class='mcoption_label' id='mcoption_label_"+next_index+"'></label>";
    }

    ret += "</div>";
    ret += "<div class='mcquestion_right'>";
    ret += "<img id='mch_statistics_button_"+slide+"' class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
    ret += "<input type='hidden' id='slide_to_activate' value='"+slide+"'/>";
    ret += "<input type='hidden' id='quiz_id_to_activate_"+slide+"' value='"+V.Quiz.getQuizIdToStartSession()+"' class='quiz_id_to_activate'/>";
    ret += "<input type='button' id='mcquestion_start_button_"+slide+"' class='mcquestion_start_button' value='Start Quiz'/>";
    ret += "<div id='save_quiz_"+slide+"' class='save_quiz'><label>Do you want to save the polling results?</label>";
    ret +="<input type='text' id='save_name_quiz_"+slide+"' class='save_results_quiz' type='text' placeholder='write a name for saving' />";
    ret +="<input type='button'class='mcquestion_save_yes_button' id='mcquestion_save_yes_button_"+slide+"' value='Yes'><input type='button' class='mcquestion_save_no_button' id='mcquestion_save_no_button_"+slide+"' value='No'></div>"
    ret += "</div>";
    ret += "</form>";
    ret += "</div>";
    return ret;
  };

  /*
  * Render an Multiple choice question slide for a user who is not logged in. 
  * Only is watching the excursion
  * In this case the render will show the Quiz without the input radio options for allowing to vote 
  * and without the buttons
  */    
  var _renderMcquestionNone = function(element, template, slide){
    var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
    ret += "<div class='mcquestion_container'>";
    ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
    ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";

    for(var i = 0; i<element['options'].length; i++){
      var next_index = String.fromCharCode("a".charCodeAt(0) + (i)); 
      ret += "<label class='mc_answer'>"+next_index+") "+element['options'][i]+"</label>";  
    }

    ret += "</div>";
    ret += "<div class='mcquestion_right'>";
    ret += "</div>";
    ret += "</form>";
    ret += "</div>";
    return ret;
  }; 

 /*
  * Render an Multiple choice question slide to allow a user, who has access by URL, to answer the mcquestion. 
  * In this case the render will show the Quiz with the input radio options for allowing to vote 
  * and a send button for clicking when decide to vote  
  */
  var _renderMcquestionToAnswer = function(element, template, slide){
    var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
    ret += "<div class='mcquestion_container'>";
    ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
    ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";

    for(var i = 0; i<element['options'].length; i++){
      var next_index = String.fromCharCode("a".charCodeAt(0) + (i)); 
      ret += "<label class='mc_answer' id='mc_answer_"+slide+"_option_"+next_index+"'>"+next_index+") <input class='mc_radio' type='radio' name='mc_radio' value='"+next_index+"'</input>"+element['options'][i]+"</label>";
      ret += "<div class='mc_meter' id='mcoption_div_"+(i+1)+"'><span  id='mcoption_"+next_index+"'></span></div>";
      ret += "<label class='mcoption_label' id='mcoption_label_"+next_index+"'></label>";
    }

    ret += "</div>";
    ret += "<div class='mcquestion_right'>";
    ret += "<input type='hidden' id='slide_to_vote' value='"+slide+"'/>";
    ret += "<input type='hidden' id='quiz_active_session_id' value='"+ V.Quiz.getQuizStatus().quiz_active_session_id +"'/>";
    ret += "<input type='button' id='mcquestion_send_vote_button_"+slide+"' class='mcquestion_send_vote_button' value='Send'/>";
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