VISH.Quiz = (function(V,$,undefined){
    
    /**
    * called it will render depending of the kind of role
    * */
   var init = function(role, element, template){
   
   
   
   switch(role) {
   	
   	
   case "logged": 
      //render the slide for a logged user
   return _rederMcquestionLogged (element, template); 
   
   
   break;
   
   case "student":
   //render the slide for a student (he knows the shared URL) and no logged user 
   return _rederMcquestionStudent (element, template); 
   break;
   
   case "none":
   //render the slide for a viewer (he doesn't know the shared) URL an not logged user
   return _rederMcquestionNone (element, template);
   break;
   
   default: 
   
   VISH.Debugging.log("Something went wrong while processing the Quiz");	
   	
   	
   	
   	
   }
   
   
   user = VISH.SlideManager.getUser();	
   	
   	$(".mcquestion").find(".mc_meter").css('display','none'); 
   	
    
   
  // $(document).on('click', '#edit_excursion_details', _onEditExcursionDetailsButtonClicked);
   
   }
   var showStatistic = function (event){
   	
   	V.Debugging.log(" Enter showStatistics value of the event: "+ event);
   	
   }
   
   /*
   var renderMcquestion = function(element, template){
   	
   	
		var next_num=0;
		
		var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
		
		ret += "<div class='mcquestion_container'>";
		ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
		
		ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";
		//ret += "<label class='question_name'>Name:  </label>";
		//ret += "<textarea id='pupil_name' rows='1' cols='50' class='question_name_input' placeholder='Write your name here'></textarea>";
		
		
		for(var i = 0; i<element['options'].length; i++){
			var next_num = i;
		var next_index = "a".charCodeAt(0) + (next_num); 
		next_index = String.fromCharCode(next_index);
			
			ret += "<label class='mc_answer'>"+next_index+") <input type='radio' name='mc_radio' value='"+next_index+"'>"+element['options'][i]+"</label>";
			ret += "<div class='mc_meter'><span style='width:33%;'></span></div>";
		
		}
		
		ret += "</div>";
		ret += "<div class='mcquestion_right'>";
		ret += "<img class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
		ret += "<input type='submit' class='mcquestion_button' value='Start Quiz'/>";
		
		ret += "</div>";
		ret += "</form>";
		ret += "</div>";
		return ret;
	};
*/
/*
 * Render an Multiple choice question slide for an user who is logged in. In this case 
 * the user can start the Quiz so we show the quiz with all elements and buttons  
 * 
 */


   var _rederMcquestionLogged = function(element, template){
   	
   	 	
   	V.Debugging.log("enter to renderMcquestionLogged");
   		var next_num=0;
		
		var ret = "<div id='"+element['id']+"' class='multiplechoicequestion'>";
		
		ret += "<div class='mcquestion_container'>";
		ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['question']+"?</h2>";
		
		ret += "<form class='mcquestion_form' action='"+element['posturl']+"' method='post'>";
		//ret += "<label class='question_name'>Name:  </label>";
		//ret += "<textarea id='pupil_name' rows='1' cols='50' class='question_name_input' placeholder='Write your name here'></textarea>";
		
		
		for(var i = 0; i<element['options'].length; i++){
			var next_num = i;
		var next_index = "a".charCodeAt(0) + (next_num); 
		next_index = String.fromCharCode(next_index);
			
			ret += "<label class='mc_answer'>"+next_index+") <input type='radio' name='mc_radio' value='"+next_index+"'>"+element['options'][i]+"</label>";
			ret += "<div class='mc_meter'><span style='width:33%;'></span></div>";
		
		}
		
		ret += "</div>";
		ret += "<div class='mcquestion_right'>";
		ret += "<img class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
		ret += "<input type='submit' class='mcquestion_button' value='Start Quiz'/>";
		
		ret += "</div>";
		ret += "</form>";
		ret += "</div>";
		return ret;
	};
	
/*
 * Render an Multiple choice question slide for an user who is logged in. In this case 
 * the user can start the Quiz so we show the quiz with all elements and buttons  
 * 
 */
      var _rederMcquestionStudent = function(element, template){
    	
    	V.Debugging.log("enter to renderMcquestionLogged");
    	
    };
    
    var _rederMcquestionNone = function(element, template){
    	V.Debugging.log("enter to renderMcquestionLogged");
    	
    }; 
    
    
    return {
    	init 			 : init,
        showStatistic    : showStatistic
        
        
    };
    

    
}) (VISH, jQuery);
