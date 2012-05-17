VISH.Dummies = (function(VISH,undefined){
	//variable to add to the id when replacing id_to_change in the dummy
	var nextDivId = 1;
	var nextArticleId = 1;

	//array with the articles (slides) definition, one for each template
	//the ids of each div are id='id_to_change' and will be replaced by the next id by the function _replaceIds(string)
	var dummies = [
		"<article id='article_id_to_change' template='t1'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t1_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t1_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t1_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t2'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t2_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t2_left editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t3'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t3_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t3_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' class='t3_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t3_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t4'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t4_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t4_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t4_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t4'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t4_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t4_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t4_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t4'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t4_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t4_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t4_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t4'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t4_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t4_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t4_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t8'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t8_header' type='title_multiple_choice_question'></div><div id='div_id_to_change' areaid='left' class='t8_left mcquestion' type='mcquestion'><h2 class='header_multiplechoice_question'>Write Multiple Choice Question:</h2><textarea rows='4' cols='50' class='value_multiplechoice_question' placeholder='insert question here'></textarea><br><input id='mchoice_radio_option 1' type='radio' class='multiplechoice_radio' /><input id='radio_text_1' type='text' placeholder='insert text option here' /><a src='' id='add_quiz_option' class='add_quiz_option'><img src='images/add_quiz_option.png' id='add_quiz_option_img'/> </a></div></article>",
		"<article id='article_id_to_change' template='t9'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t9_header' type='title_openquestion'></div><div id='div_id_to_change' areaid='left' class='t9_left' type='openquestion'><h2 class='header_openquestion'>Write Question:</h2>Title:<br><textarea rows='1' cols='30' class='title_openquestion'></textarea><br>Question:<br><textarea rows='4' cols='50' class='value_openquestion' placeholder='insert text option here'></textarea></div></article>"		
		]; 

	/**
	 * function to get the string for the new slide
	 * param article_id: id of the article, used for editing excursions
	 */
	var getDummy = function(template, article_id){
		var dum = dummies[parseInt(template,10)-1];
		return _replaceIds(dum, article_id);
	};
	
	/**
	 * Function to replace the text id_to_change by the next id
	 * the added id will be "zone + nextId"
	 * CAREFUL: if article_id is passed we remove "editable" class because we are editing an existing excursion
	 */
	var _replaceIds = function(string, article_id){
		var newString = string;
		while(newString.indexOf("div_id_to_change") != -1){
			newString = newString.replace("div_id_to_change", "zone" + nextDivId);
			nextDivId++;
		}
		while(newString.indexOf("article_id_to_change") != -1){
			if(article_id){
				newString = newString.replace("article_id_to_change", "article" + article_id);
			}
			else{
				newString = newString.replace("article_id_to_change", "article" + nextArticleId);
				nextArticleId++;
			}
		}
		if(article_id){
			newString = newString.replace(/editable /g,"");
		}
		return newString;
	};
	
/*
 Function to add a radio button for multiple choice quiz
 * */
/*
var _onaddRadioChoiceClicked = function() {
	
	var radio_elements = $(".multiplechoice_radio");
		console.log("entra en _onaddRadioChoiceClicked");
		
	
}; 

* */
	
	return {
		getDummy: getDummy
	
		
	};

}) (VISH);