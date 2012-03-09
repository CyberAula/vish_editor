VISH.Dummies = (function(VISH,undefined){
	

	var dummies = [
		"<article template='t1'><div areaid='header' class='t1_header editable grey_background'></div><div areaid='left' class='t1_left editable grey_background'></div><div areaid='right' class='t1_right editable grey_background'></div></article>",
		"<article template='t2'><div areaid='header' class='t2_header editable grey_background'></div><div areaid='left' class='t2_left editable grey_background'></div></article>"
	]; 

	var getDummy = function(template){
		return dummies[parseInt(template,10)-1];
	};

	return {
		getDummy: getDummy
	};

}) (VISH);