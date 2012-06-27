VISH.Dummies = (function(VISH,undefined){
	//variable to add to the id when replacing id_to_change in the dummy
	var nextDivId = 1;
	var nextArticleId = 1;

	//array with the articles (slides) definition, one for each template
	//the ids of each div are id='id_to_change' and will be replaced by the next id by the function _replaceIds(string)
	var dummies = [
		"<article id='article_id_to_change' template='t1'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='left' class='t1_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='header' class='t1_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='subheader' class='t1_subheader editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t2'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='left' class='t2_left editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t3'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t3_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t3_left editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t4'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t4_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t4_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t4_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t5'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t5_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t5_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t5_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t6'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t6_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t6_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' class='t6_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t6_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t7'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t7_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t7_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' class='t7_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='subheader' class='t7_subheader editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t8'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t8_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t8_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' class='t8_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t8_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t9'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+VISH.ImagesPath+"helptutorial_circle_blank.png'/><div id='div_id_to_change' areaid='header' class='t9_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' class='t9_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' class='t9_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' class='t9_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' template='t10'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t10_header' type='title_openquestion'></div><div id='div_id_to_change' areaid='left' class='t10_left' type='openquestion'><h2 class='header_openquestion'>Write Question:</h2>Title:<br><textarea rows='1' cols='30' class='title_openquestion' placeholder='insert title's question here'></textarea><br>Question:<br><textarea rows='4' cols='50' class='value_openquestion' placeholder='insert text option here'></textarea></div></article>",
		"<article id='article_id_to_change' template='t11'><div class='delete_slide'></div><div id='div_id_to_change' areaid='header' class='t11_header' type='title_multiple_choice_question'></div><div id='div_id_to_change' areaid='left' class='t11_left mcquestion' type='mcquestion'><h2 class='header_multiplechoice_question'>Write Multiple Choice Question:</h2><textarea rows='4' cols='50' class='value_multiplechoice_question' placeholder='insert question here'></textarea><br>a) <input id='radio_text_0' class='multiplechoice_text' type='text' placeholder='insert text option here' /><a src='' id='a_add_quiz_option' class='add_quiz_option'><img src='images/add_quiz_option.png' id='add_quiz_option_img'/></a></div></article>"	
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
	
	
	return {
		getDummy: getDummy
	};

}) (VISH);