VISH.Editor.Dummies = (function(V,undefined){

	var dummies = [];

	var init = function(){
		dummies = [
		"<article id='article_id_to_change' type='standard' template='t1' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='left' 	 size='large' class='t1_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='header' size='small' class='t1_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='subheader' size='extra-small' class='t1_subheader editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t2' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='left' 	 size='large' class='t2_left editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t3' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='header'  size='small' class='t3_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' size='large'  class='t3_left editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t4' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='header'  size='small' class='t4_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' size='large'  class='t4_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right'  size='small'  class='t4_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t5' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='header'  size='small' class='t5_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' size='medium' class='t5_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right'  size='medium' class='t5_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t6' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='header'  size='small' class='t6_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' size='medium' class='t6_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' size='medium' class='t6_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' size='medium'    class='t6_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t7' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='header'  size='small' class='t7_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' size='medium' class='t7_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' size='large'  class='t7_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='subheader' size='small' class='t7_subheader editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t8' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='header'  size='small' class='t8_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' size='small'  class='t8_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' size='large'  class='t8_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' size='small'     class='t8_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t9' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='header'  size='small' class='t9_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' size='medium' class='t9_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' size='medium' class='t9_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' size='medium'    class='t9_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t10' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='center'  size='large' class='t10_center editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t11' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='center1' size='medium' class='t11_center1 editable grey_background selectable'></div><div id='div_id_to_change' areaid='center2' size='medium'  class='t11_center2 editable grey_background selectable'></div><div id='div_id_to_change' areaid='center3'  size='medium'  class='t11_center3 editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t12' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='left1'   size='medium' class='t12_left1 editable grey_background selectable'></div><div id='div_id_to_change' areaid='right1' size='medium' class='t12_right1 editable grey_background selectable'></div><div id='div_id_to_change' areaid='left2' size='medium' class='t12_left2 editable grey_background selectable'></div><div id='div_id_to_change' areaid='right2' size='medium'  class='t12_right2 editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t13' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='header'  size='small' class='t13_header editable grey_background selectable'></div><div id='div_id_to_change' areaid='circle' size='medium' class='t13_circle editable grey_background selectable'></div><div id='div_id_to_change' areaid='left' size='medium' class='t13_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' size='medium'  class='t13_right editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t14' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='circle1' size='small' class='t14_circle1 editable grey_background selectable'></div><div id='div_id_to_change' areaid='right1' size='medium' class='t14_right1 editable grey_background selectable'></div><div id='div_id_to_change' areaid='circle2' size='small' class='t14_circle2 editable grey_background selectable'></div><div id='div_id_to_change' areaid='right2' size='medium' class='t14_right2 editable grey_background selectable'></div><div id='div_id_to_change' areaid='circle3' size='small' class='t14_circle3 editable grey_background selectable'></div><div id='div_id_to_change' areaid='right3' size='medium' class='t14_right3 editable grey_background selectable'></div></article>",
		"<article id='article_id_to_change' type='standard' template='t15' slidenumber='slidenumber_to_change'><div class='delete_slide'></div><img class='help_in_template' id='help_template_image' src='"+V.ImagesPath+"icons/helptutorial_circle_blank.png'/><div id='div_id_to_change' 	areaid='left' 	 size='medium' class='t15_left editable grey_background selectable'></div><div id='div_id_to_change' areaid='center' size='medium' class='t15_center editable grey_background selectable'></div><div id='div_id_to_change' areaid='right' size='medium' class='t15_right editable grey_background selectable'></div><div id='div_id_to_change' areaid='center2' size='large' class='t15_center2 editable grey_background selectable'></div></article>"
		];

		V.Editor.Quiz.Dummies.init();
	}


	/*
	 * Function to get a new slide (in string format)
	 */
	var getDummy = function(template, slideNumber){
		var dummy = dummies[parseInt(template,10)-1];
		return _replaceIds(dummy, slideNumber);
	};

    /*
	 *	Function to get a existing slide (in string format)
	 */
	var getScaffold = function(template, slideNumber, articleId, zoneIds){
		var dummy = dummies[parseInt(template,10)-1];
		return _removeEditable(_replaceIds(dummy, slideNumber, articleId, zoneIds));
	}

	var getScaffoldForSlide = function(template, slideNumber, slide){
		var zoneIds = [];
		for(el in slide.elements){
			zoneIds.push(slide.elements[el].id);
		}
		return getScaffold(template, slideNumber, slide.id, zoneIds);
	}

	/**
	 * Function to replace dummy ids
	 */
	var _replaceIds = function(dummy, slideNumber, articleId, zoneIds){
		var newDummy = dummy;
		var nextZoneId = 0;

		if(!articleId){
			articleId = V.Utils.getId("article");
		}

		if(newDummy.indexOf("article_id_to_change") != -1){
			newDummy = newDummy.replace("article_id_to_change", articleId);				
		}
		
		while(newDummy.indexOf("slidenumber_to_change") != -1){
			newDummy = newDummy.replace("slidenumber_to_change", slideNumber);
		}

		while(newDummy.indexOf("div_id_to_change") != -1){
			if(zoneIds){
				var newZoneId = zoneIds[nextZoneId];
				nextZoneId++;
			} else {
				var newZoneId = V.Utils.getId(articleId + "_zone");
			}
			newDummy = newDummy.replace("div_id_to_change", newZoneId);
		}

		return newDummy;
	};

	var _removeEditable = function(dummy){
		return dummy.replace(/editable /g,"");
	}

	return {
		init				: init,
		getDummy			: getDummy,
		getScaffold 		: getScaffold, 
		getScaffoldForSlide : getScaffoldForSlide
	};

}) (VISH);