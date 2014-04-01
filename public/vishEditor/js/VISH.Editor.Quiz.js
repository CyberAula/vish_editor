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


	/* Quiz exporting */
	//Usage example: VISH.Editor.Quiz.exportTo("QTI", function(){ alert("Success")}, function(){alert("Fail")})
	var exportTo = function(format,successCallback,failCallback){
		var cJSONQuiz = _getCurrentJSONQuiz();

		if(typeof cJSONQuiz == "undefined"){
			if(typeof failCallback == "function"){
				failCallback();
			}
			return;
		}
		V.Editor.API.uploadTmpJSON(cJSONQuiz,format,successCallback,failCallback);
	};

	var _getCurrentJSONQuiz = function(){
		var quizJSON = [];
		var presentation = V.Editor.savePresentation();
		var cslide = V.Slides.getCurrentSlide();

		if(typeof cslide == "object"){
		var cslideId = $(cslide).attr("id");
			
		 $.each(presentation.slides, function( index, value ) {
					if (value.id == cslideId){
						if(value.containsQuiz == true){
							 $.each(value.elements, function( index, value_element ) {
							 	if(value_element.type == "quiz"){
							 		quizJSON = value_element;
							 	}
							 });
						}else{
							quizJSON = undefined;
						}
		 			}	
		 	});

			//console.log("cslideId");
			//console.log(cslideId);
			//TODO: 1. Look inside presentation JSON to find the slide JSON with id: cslideId
			//2. Look inside the slide to find a quiz
			//3. If there is a quiz, get its JSON and send it. If not return undefined.
		}
		return quizJSON;
	};

	return {
		init				: init, 
		add					: add,
		save				: save,
		draw				: draw,
		exportTo			: exportTo,
		showQuizSettings	: showQuizSettings,
		_getCurrentJSONQuiz : _getCurrentJSONQuiz
	};

}) (VISH, jQuery);