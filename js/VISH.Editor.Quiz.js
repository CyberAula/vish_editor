VISH.Editor.Quiz = (function(V,$,undefined){
	var buttonAddOptionId = "a_add_quiz_option";
	var buttonRemoveOptionId = "a_remove_quiz_option";
	//var buttonAddOptionClass = "add_quiz_option"; //con esto sí funciona	
	var MultipleChoiceOptionClass = "multiplechoice_text";
	var searchOptionText= "mchoice_radio_option_";
	var num_options = 5; // maximum options can be added
	
	var init = function(){
		
		$(document).on('click','#'+buttonAddOptionId , addMultipleChoiceOption);

	};	
	/*
	 Function that add an input text option for the Multiple Choice Quiz  
	 * */
	var addMultipleChoiceOption = function(event){
		
		//the input in text type  
		var text  = $('<div>').append($('.' +MultipleChoiceOptionClass).clone()).html();
		
		
var inputs_search = $(".current").find("."+MultipleChoiceOptionClass);
		
		var next_num = inputs_search.size();
		var next_index = "a".charCodeAt(0) + next_num; 
			next_index = String.fromCharCode(next_index);

		if (next_num < num_options) {

		    //the next radio input  TODO ... add delete in li and add li with input and letter
		    $(".add_quiz_option").remove();
		    
		    var delete_icon = "<a href='javascript:VISH.Editor.Quiz.removeMultipleChoiceOption("+(next_num -1)+")' id='"+buttonRemoveOptionId+"' class='remove_quiz_option'><img src='images/delete.png' id='remove_quiz_option_img'/></a>";
		    
		    $(".current").find("#ul_mch_options").find("#li_mch_option_"+(next_num-1)).append(delete_icon);
		    var add_option = "<li id='li_mch_option_"+next_num+"' class='li_mch_option'>"+next_index+") <input id='radio_text_"+next_num+"' class='"+MultipleChoiceOptionClass+"' type='text' placeholder='insert text option here' />";
			//add_option += "<br>"+next_index+") <input id='radio_text_"+next_num+"' class='"+MultipleChoiceOptionClass+"' type='text' placeholder='insert text option here' />";
			add_option += "<a id='"+buttonAddOptionId+"' class='add_quiz_option'><img src='images/add_quiz_option.png' id='add_quiz_option_img'/></a></li>";
			
			$(".current").find("#ul_mch_options").append(add_option);
			//remove button + 
					
		} else if (next_num = num_options) {
			
			$(".add_quiz_option").remove();
			
			var delete_icon = "<a href='javascript:VISH.Editor.Quiz.removeMultipleChoiceOption("+(next_num -1)+")' id='"+buttonRemoveOptionId+"' class='remove_quiz_option'><img src='images/delete.png' id='remove_quiz_option_img'/></a>";
			$(".current").find("#ul_mch_options").find("#li_mch_option_"+(next_num-1)).append(delete_icon);
			
			// var add_option = "<a href='javascript:VISH.Editor.Quiz.removeMultipleChoiceOption("+(next_num -1)+")' id='"+buttonRemoveOptionId+"' class='remove_quiz_option'><img src='images/delete.png' id='remove_quiz_option_img'/></a>";
			 var add_option = "<li id='li_mch_option_"+next_num+"' class='li_mch_option'>"+next_index+")&nbsp;  <input id='radio_text_"+next_num+"' class='"+MultipleChoiceOptionClass+"' type='text' placeholder='insert text option here' />";
			 add_option += "<a href='javascript:VISH.Editor.Quiz.removeMultipleChoiceOption("+(next_num)+")' id='"+buttonRemoveOptionId+"' class='remove_quiz_option'><img src='images/delete.png' id='remove_quiz_option_img'/></a></li>";
			
			$(".current").find("#ul_mch_options").append(add_option);
		//	$(".mcquestion").append(add_option);

		}
		
	};
	
	
	//if someone wants to delete some option 
	var removeMultipleChoiceOption = function(id) {
		
	 	VISH.Debugging.log("enter removeMCH option " + id);
		
		VISH.Debugging.log("lo que buscamos vale: "+$("#li_mch_option_"+id.toString()));
		
	
		
			
		//remove children except the text
		$("#li_mch_option_"+id.toString()).children().remove();
		
		var num_inputs =	$(".current").find("."+MultipleChoiceOptionClass).size();
		VISH.Debugging.log("number of inputs: " + num_inputs);
		next_index = String.fromCharCode(next_index);
var i;
var next_index;

		for (i=id; i<num_inputs; i++) {
			VISH.Debugging.log("i vale:  " + i);
			next_index = "a".charCodeAt(0)+ i; 
			next_index = String.fromCharCode(next_index);
			
			VISH.Debugging.log("next_index:  " + next_index);
			
			
			$(".current").find("li#li_mch_option_"+(i+1).toString()+"> input").attr('id', "radio_text_"+i.toString());//.attr(id, "radio_text_"+i.toString());
			
			//do this for every one after the removed element except the last one
			
			
			if(i<(num_inputs-1)) {
			
			$(".current").find("li#li_mch_option_"+(i+1).toString()+"> a").attr('href', "javascript:VISH.Editor.Quiz.removeMultipleChoiceOption("+i.toString()+")");
			} 
			else { //for the last one the the icon is for add , so remove whatever there was and 
				// add the add option button 
				
				//
				var add_option_button =" <a id='"+buttonAddOptionId+"' class='add_quiz_option'><img src='images/add_quiz_option.png' id='add_quiz_option_img'/></a>";
				//remove the button icon
				$(".current").find("li#li_mch_option_"+(i+1).toString()+"> a").remove();
				//add the "add button"
				$(".current").find("#li_mch_option_"+(i+1).toString()).append(add_option_button);
				
			}
			//move children up 
			
			$("#li_mch_option_"+i.toString()).append($("#li_mch_option_"+(i+1).toString()).children())
			
		     
		}
		//remove the last index 
		$(".current").find("#li_mch_option_"+num_inputs.toString()).remove();
		//add new counter to add option 
		$(".current").find("#li_mch_option_"+num_inputs.toString())
	};
	
	
			
	return {
		init: init, 
		addMultipleChoiceOption: addMultipleChoiceOption, 
		removeMultipleChoiceOption: removeMultipleChoiceOption 
	};

}) (VISH, jQuery);
