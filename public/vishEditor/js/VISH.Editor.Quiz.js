VISH.Editor.Quiz = (function(V,$,undefined){
	var buttonAddOptionId = "a_add_quiz_option";
	var buttonRemoveOptionId = "a_remove_quiz_option";
	//var buttonAddOptionClass = "add_quiz_option"; //con esto sí funciona	
	var MultipleChoiceOptionClass = "multiplechoice_text";
	var searchOptionText= "mchoice_radio_option_";
	var maxNumMultipleChoiceOptions = 6; // maximum input options 
	
	
	//var for T/F Quiz
	var buttonAddTrueFalseQuestionId = "a_add_true_false_question";
	var maxNumTrueFalseQuestions = 6; // maximum input options
	
	var init = function(){
		
		$(document).on('click','#'+buttonAddOptionId , addMultipleChoiceOption);
		$(document).on('click','#'+buttonAddTrueFalseQuestionId , addTrueFalseQuestion);

 var myInput = $(".current").find("input[type='text']");
	//	$(myInput).watermark('Search content');
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
			
				if(($(myInput).val()!="")&& ($(myInput).val()!="write quiz options here")) {
					//call to addMultipleChoiceOption
					addMultipleChoiceOption();
					$(myInput).blur();
				} 
				else {
					alert("You must enter some text option.");	
				}
		}	
			
		}); 
	};	
	/* TODO: change id of input 
	 Function that add an input text option for the Multiple Choice Quiz  
	 * */
	var addMultipleChoiceOption = function(event){
		
		
		
		V.Debugging.log("event.type vale: "  + event);
		
		//New element to apply operations  
		var myInput = $(".current").find("input[type='text']").last(); 
				
			if((myInput.val() !="") && (myInput.val() != "write quiz options here")) {
		
		//the input in text type  
				$(".current").find("."+MultipleChoiceOptionClass).removeAttr("autofocus");	

				var text  = $('<div>').append($('.' +MultipleChoiceOptionClass).clone()).html();
				var inputs_search = $(".current").find("."+MultipleChoiceOptionClass);
		
				var next_num = inputs_search.size()+1;
				var next_index = String.fromCharCode("a".charCodeAt(0) + (next_num-1)); 
				
		//remove add button , add option input 
				if (next_num < maxNumMultipleChoiceOptions) {

		    		$(".add_quiz_option").remove();
		    
		    		var delete_icon = "<a href='javascript:VISH.Editor.Quiz.removeMultipleChoiceOption("+(next_num-1)+")' id='"+buttonRemoveOptionId+"' class='remove_quiz_option'><img src='images/delete.png' id='remove_quiz_option_img'/></a>";
		    
		    		$(".current").find("#ul_mch_options").find("#li_mch_option_"+(next_num-1)).append(delete_icon);
		    		var add_option = "<li id='li_mch_option_"+(next_num)+"' class='li_mch_option'>"+next_index+") <input id='radio_text_"+(next_num)+"' class='"+MultipleChoiceOptionClass+"' type='text' placeholder='write quiz options here' />";
			
					add_option += "<a id='"+buttonAddOptionId+"' class='add_quiz_option'><img src='images/add_quiz_option.png' id='add_quiz_option_img'/></a></li>";
			
					$(".current").find("#ul_mch_options").append(add_option);
					//remove button + 
					
					} else if (next_num == (maxNumMultipleChoiceOptions)) {
						//if the last one remove add button and add delete button to the preview and to the last one
						$(".add_quiz_option").remove();
			
						var delete_icon = "<a href='javascript:VISH.Editor.Quiz.removeMultipleChoiceOption("+(next_num-1)+")' id='"+buttonRemoveOptionId+"' class='remove_quiz_option'><img src='images/delete.png' id='remove_quiz_option_img'/></a>";
						$(".current").find("#ul_mch_options").find("#li_mch_option_"+(next_num-1).toString()).append(delete_icon);
			
						var add_option = "<li id='li_mch_option_"+next_num+"' class='li_mch_option'>"+next_index+")&nbsp;  <input id='radio_text_"+next_num+"' class='"+MultipleChoiceOptionClass+"' type='text' placeholder='write quiz options here' />";
						add_option += "<a href='javascript:VISH.Editor.Quiz.removeMultipleChoiceOption("+(next_num)+")' id='"+buttonRemoveOptionId+"' class='remove_quiz_option'><img src='images/delete.png' id='remove_quiz_option_img'/></a></li>";
			
						$(".current").find("#ul_mch_options").append(add_option);

					}
				} 
				else {
			
				alert("You must enter some text option.");	
				}
		myNextInput =$(".current").find("#radio_text_"+next_num); 	
			
		myNextInput.keydown(function(event) {
			if(event.keyCode == 13) {
				V.Debugging.log("event.type vale (inside addMultipleChoiceOption): "  + event.type); //KeyDown
				if(($(myNextInput).val()!="") && ($(myInput).val()!="write quiz options here"))  {
					//call to addMultipleChoiceOption
					addMultipleChoiceOption();
					$(myNextInput).blur();
				} 
				else {
					alert("You must enter some text option.");	
				}
		}	
			
		}); 
		
			//move cursor on the next input	
			$(".current").find(myNextInput).attr("autofocus", "autofocus");
	};
	
	
	//remove a multiple choice option when click on the icon delete 
	var removeMultipleChoiceOption = function(id) {
		
		var add_option_button = "<a id='"+buttonAddOptionId+"' class='add_quiz_option'><img src='images/add_quiz_option.png' id='add_quiz_option_img'/></a>";
	 	
	 	//remove children's li selected (id) except index a), b), etc ...  
		$("#li_mch_option_"+id.toString()).children().remove();
		//all the inputs in the Multiple Choice Quiz
		//var num_inputs = $(".current").find("."+MultipleChoiceOptionClass).size();
		
		//testing
		var num_inputs = $(".current").find(".li_mch_option").size();
		
		var i;
		var next_index;
		
		//when the option clicked to remove is diferent from the last one 
		
		
		//if id less than number of inputs
		if(id < (maxNumMultipleChoiceOptions) ) {
			
			//OJO con el igual
		for (i=id; i<=num_inputs; i++) {
			
			next_index = "a".charCodeAt(0)+ i; 
			next_index = String.fromCharCode(next_index);
			
			//change the id of inputs (decrease one number) the next one will be the deleted
			$(".current").find("li#li_mch_option_"+(i+1).toString()+"> input").attr('id', "radio_text_"+i.toString());//.attr(id, "radio_text_"+i.toString());
			
			//change the href to the next elements (even the last one ?) 
					
			$(".current").find("li#li_mch_option_"+(i+1).toString()+"> a").attr('href', "javascript:VISH.Editor.Quiz.removeMultipleChoiceOption("+i.toString()+")");
			
			//move children up 
			
			$("#li_mch_option_"+i.toString()).append($("#li_mch_option_"+(i+1).toString()).children());
			
			//TODO ask Kike how to do this better....
			if (i==(num_inputs)){ 
				//for the last one the icon is for adding and input element , so remove whatever 
				//there was add the add option button 
				$(".current").find("#li_mch_option_"+(i-1).toString()+" > a").remove();
				$(".current").find("#li_mch_option_"+(i-1).toString()).append(add_option_button);
				
			}
			
		     
		}
		//remove the last index 
		$(".current").find("#li_mch_option_"+(num_inputs).toString()).remove();
		//add new counter to add option 

		}
		//if the selected input to remove is the last one of all options
		
		// id=6 
		else if (id == (maxNumMultipleChoiceOptions) ) {
			//remove the last input
			 $(".current").find("#li_mch_option_"+id.toString()).remove();
			
			
			//remove the delete icon from the preview input
			$(".current").find("li#li_mch_option_"+(id-1).toString()+" > #a_remove_quiz_option").remove();
			
			//add the add icon to the preview input 
			$(".current").find("#li_mch_option_"+(id-1).toString()).append(add_option_button);
			
		}
		
		else {
			
			VISH.Debugging.log("Error executing VISH.Editor.Quiz.removeMultipleChoiceOption function with parameter: " + id);
			
		}
	};
	/*
	 *Add a new row into the table with the elements that    
	 * */
	
	var  addTrueFalseQuestion = function(event){
		
			var numCurrentQuestions = $(".current").find(".true_false_question").size();
			//test number of questios
		if (numCurrentQuestions < maxNumTrueFalseQuestions)	{
			
			//test has been added text into current input
			if(($(".current").find(".true_false_question").last().val()!="")&&($(".current").find(".true_false_question").last().val()!="Write question here")) {
				//remove add question button
				$(document).find('#'+buttonAddTrueFalseQuestionId).remove();
			
				var trueFalseQuestionRow = "<tr id='tr_question_"+(numCurrentQuestions+1)+"'><td id='td_true_"+(numCurrentQuestions+1)+"' class='td_true'><input type='radio' id='true_"+(numCurrentQuestions+1)+"' name='answer_"+(numCurrentQuestions+1)+"'/></td><td id='td_false_"+(numCurrentQuestions+1)+"' class='td_false'><input type='radio' id='false_"+(numCurrentQuestions+1)+"' name='answer_"+(numCurrentQuestions+1)+"'/></td><td id='td_question_"+(numCurrentQuestions+1)+"' class='td_truefalse_question'><textarea rows='1' cols='50' class='true_false_question' placeholder='Write question here' id='true_false_question__"+(numCurrentQuestions+1)+"'></textarea></td><td class='td_add_button'><a id='a_add_true_false_question' ><img src='"+VISH.ImagesPath+"/add_quiz_option.png' /></a> </td></tr>";
				
				//add the row into the table 
				$(".current").find(".truefalse_quiz_table").append(trueFalseQuestionRow);
			 
							
			} 
			
			else {
				
				alert ("Must write question before add new row.");
				
			}
			
		} else {
		
		 			alert ("Number of maximum questions reached.");
		}
	};
			
	return {
		init: init, 
		addMultipleChoiceOption		: addMultipleChoiceOption, 
		removeMultipleChoiceOption	: removeMultipleChoiceOption, 
		addTrueFalseQuestion		: addTrueFalseQuestion
	};

}) (VISH, jQuery);
