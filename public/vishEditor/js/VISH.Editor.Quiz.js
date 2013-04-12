VISH.Editor.Quiz = (function(V,$,undefined){

	var init = function(){
		V.Editor.Quiz.MC.init();
		V.Editor.Quiz.TF.init();
	};

	/*
	 * Quiz modules
	 */
	var _getQuizModule = function(quiz_type){
		switch (quiz_type) {
			case VISH.Constant.QZ_TYPE.OPEN:
				 break;
			case VISH.Constant.QZ_TYPE.MCHOICE:
				return V.Editor.Quiz.MC;
				break;
			case VISH.Constant.QZ_TYPE.TF:
				return V.Editor.Quiz.TF;
			 	break;
			default:
				return null; 
				break;
		}
	}

	/*
	 * Add a new Quiz
	 */ 
	var add = function(quizType,area) {
		var current_area;
		if(area) {
			current_area = area;
		} else {
			current_area = V.Editor.getCurrentArea();
		}

		if(_getQuizModule(quizType)){
			_getQuizModule(quizType).add(current_area);
		}
		
		$.fancybox.close();
	};

	/*
	 * return quiz in JSON
	 */
	var save = function(area){
		var current_area;
		if(area) {
			current_area = area;
		} else {
			current_area = V.Editor.getCurrentArea();
		}

		var quizType = $(area).attr("quiztype");
		if(_getQuizModule(quizType)){
			return _getQuizModule(quizType).save(current_area);
		}
	}

	var draw = function(area,quiz){
		if(_getQuizModule(quiz.quiztype)){
			_getQuizModule(quiz.quiztype).draw(area,quiz);
		}
	}


	/*
	 * Utils
	 */
	var updateCheckbox = function(checkbox,check){
		if(typeof check == "boolean"){
			check = check.toString();
		}

		var imagePathRoot = V.ImagesPath+ "quiz/checkbox";
		switch(check){
			case "true":
				$(checkbox).attr("check","true");
				$(checkbox).attr("src",imagePathRoot+"_checked.jpg");
				break;
			case "false":
				$(checkbox).attr("check","false");
				$(checkbox).attr("src",imagePathRoot+"_wrong.png");
				break;
			case "none":
			default:
				$(checkbox).attr("check","none");
				$(checkbox).attr("src",imagePathRoot+".jpg");
				break;
		}
	}

	return {
		init			: init, 
		add				: add,
		save			: save,
		draw			: draw,
		updateCheckbox	: updateCheckbox
	};

}) (VISH, jQuery);