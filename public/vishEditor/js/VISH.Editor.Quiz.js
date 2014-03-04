VISH.Editor.Quiz = (function(V,$,undefined){

	var _hiddenLinkToInitQuizSettings;

	var init = function(){
		V.Editor.Quiz.MC.init();
		V.Editor.Quiz.TF.init();

		//Quiz Settings
		_hiddenLinkToInitQuizSettings = $('<a href="#quizSettings_fancybox" style="display:none"></a>');
		$(_hiddenLinkToInitQuizSettings).fancybox({
			'autoDimensions' : false,
			'height': 330,
			'width': 400,
			'scrolling': 'no',
			'showCloseButton': false,
			'padding' : 0,
			"onStart"  : function(data){
				// var quiz = V.Editor.getCurrentArea();
				// console.log("onStart loading quizSettings for Quiz:");
				// console.log(quiz);
				// var qSF = $("#quizSettings_fancybox");
			},
			"onComplete" : function(data){
			},
			"onClosed"  : function(data){
			}
		});
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
	};

	/*
	 * Add a new Quiz
	 */ 
	var add = function(quizType,area){
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
	};

	var draw = function(area,quiz){
		if(_getQuizModule(quiz.quiztype)){
			_getQuizModule(quiz.quiztype).draw(area,quiz);
		}
	};

	var showQuizSettings = function(){
		$(_hiddenLinkToInitQuizSettings).trigger("click");
	};


	return {
		init				: init, 
		add					: add,
		save				: save,
		draw				: draw,
		showQuizSettings	: showQuizSettings
	};

}) (VISH, jQuery);