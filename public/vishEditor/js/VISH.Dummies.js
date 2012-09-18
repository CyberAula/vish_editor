VISH.Dummies = (function(VISH,undefined){
	//variable to add to the id when replacing id_to_change in the dummy
	var nextDivId = 1;
	var nextArticleId = 1;

	//array with the articles (slides) definition, one for each template
	//the ids of each div are id='id_to_change' and will be replaced by the next id by the function _replaceIds(string)
	var dummies = [];

	var init = function(){
		dummies = [
		"<article id='article_id_to_change' template='t1' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='left' class='t1_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='header' class='t1_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='subheader' class='t1_subheader editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t2' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='left' class='t2_left editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t3' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t3_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t3_left editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t4' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t4_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t4_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t4_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t5' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t5_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t5_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t5_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t6' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t6_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t6_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' class='t6_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t6_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t7' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t7_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t7_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' class='t7_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='subheader' class='t7_subheader editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t8' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t8_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t8_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' class='t8_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t8_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t9' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t9_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t9_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' class='t9_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t9_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t10' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><div id='div_id_to_change' areaid='left' class='t10_left' type='openquestion'><h2 class='header_openquestion'>Open Question:</h2><textarea rows='4' cols='50' class='value_openquestion' placeholder='write open question here'></textarea></div></article>",
		"<article id='article_id_to_change' template='t11' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t11_header'></div><div id='div_id_to_change' areaid='left' class='t11_left mcquestion' type='mcquestion'><h2 class='header_multiplechoice_question'>Multiple Choice Question:</h2><textarea rows='4' cols='50' class='value_multiplechoice_question' placeholder='write question here'></textarea><ul class='ul_mch_options'><li class='li_mch_option'>a) <input class='multiplechoice_text' type='text' placeholder='write quiz options here' /><a class='add_quiz_option'><img src='"+VISH.ImagesPath+"add_quiz_option.png' /></a></li> </ul> </div></article>",
		"<article id='article_id_to_change' template='t12' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t12_header'></div><div id='div_id_to_change' areaid='left' class='t12_left truefalsequestion' type='truefalsequestion'><h2 class='header_truefalse_question'>True/False Question:</h2><table class='truefalse_quiz_table'><tr><th>True</th><th>False</th><th> Question </th><th></th></tr><tr><td class='td_true'><input type='radio' name='answer_1' class='truefalse_answer' value='true'/></td><td class='td_false'><input type='radio' name='answer_1' class='truefalse_answer' value='false'/></td><td class='td_truefalse_question'><textarea rows='1' class='true_false_question' placeholder='Write question here'></textarea></td><td class='td_add_button'><a><img src='"+VISH.ImagesPath+"/add_quiz_option.png' /></a> </td></tr></table></div></article>"
		]; 
	}

	/**
	 * function to get the string for the new slide
	 * param article_id: id of the article, used for editing presentations
	 */
	var getDummy = function(template, position, presentation_id, existing_slide){
		var dum = dummies[parseInt(template,10)-1];
		return _replaceIds(dum, position, presentation_id, existing_slide);
	};
	
	/**
	 * Function to replace the text id_to_change by the next id
	 * the added id will be "zone + nextId"
	 * CAREFUL: if article_id is passed we remove "editable" class because we are editing an existing presentation
	 */
	var _replaceIds = function(string, position, presentation_id, existing_slide){
		var newString = string;
		// VISH.Debugging.log("article_id passed like parameter is: " + article_id);
		while(newString.indexOf("div_id_to_change") != -1){
			newString = newString.replace("div_id_to_change", "zone" + nextDivId);
			nextDivId++;
		}
		while(newString.indexOf("article_id_to_change") != -1){			
				if(!presentation_id){
					presentation_id = "";
				}
				newString = newString.replace("article_id_to_change", "article_" + presentation_id + "_" + position);				
		}
		while(newString.indexOf("slidenumber_to_change") != -1){	
				newString = newString.replace("slidenumber_to_change", position);
		}
		if(existing_slide){
			newString = newString.replace(/editable /g,"");
		}
		return newString;
	};
	
	
	return {
		init		: init,
		getDummy	: getDummy
	};

}) (VISH);