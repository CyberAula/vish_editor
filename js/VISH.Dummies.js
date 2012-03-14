VISH.Dummies = (function(VISH,undefined){
	//variable to add to the id when replacing id_to_change in the dummy
	var nextDivId = 1;
	var nextArticleId = 1;

	//array with the articles (slides) definition, one for each template
	//the ids of each div are id='id_to_change' and will be replaced by the next id by the function _replaceIds(string)
	var dummies = [
		"<article id='article_id_to_change' template='t1'><div id='div_id_to_change' areaid='header' class='t1_header editable grey_background'></div><div id='div_id_to_change' areaid='left' class='t1_left editable grey_background'><div class='edit_pencil'><img class='edit_pencil_img' src='images/edit.png'/></div></div><div id='div_id_to_change' areaid='right' class='t1_right editable grey_background'></div></article>",
		"<article id='article_id_to_change' template='t2'><div id='div_id_to_change' areaid='header' class='t2_header editable grey_background'></div><div id='div_id_to_change' areaid='left' class='t2_left editable grey_background'></div></article>"
	]; 

	var getDummy = function(template){
		return _replaceIds(dummies[parseInt(template,10)-1]);
	};
	
	/**
	 * Function to replace the text id_to_change by the next id
	 * the added id will be "zone + nextId"
	 */
	var _replaceIds = function(string){
		var newString = string;
		while(newString.indexOf("div_id_to_change") != -1){
			newString = newString.replace("div_id_to_change", "zone" + nextDivId);
			nextDivId++;
		}
		while(newString.indexOf("article_id_to_change") != -1){
			newString = newString.replace("article_id_to_change", "article" + nextArticleId);
			nextArticleId++;
		}
		return newString;
	};
	
	return {
		getDummy: getDummy
	};

}) (VISH);