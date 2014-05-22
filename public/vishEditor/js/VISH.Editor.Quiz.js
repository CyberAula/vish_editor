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
				var qSF = $("#quizSettings_fancybox");

				//Load Quiz
				var quiz = V.Editor.getCurrentArea();
				$(qSF).find("input[type='hidden'][name='elId']").val($(quiz).attr("id"));

				//Load Settings
				var qSettings = $(quiz).attr("elSettings");
				if(typeof qSettings == "string"){
					try{
						qSettings = JSON.parse(qSettings);
						//Fill form
						if(typeof qSettings.nAttempts != "undefined"){
							$(qSF).find("#quizSettings_nAttempts").val(qSettings.nAttempts);
						}
						var ARSEnabledCheckbox = $(qSF).find("input[type='checkbox'][name='enableARS']");
						if(qSettings.ARSEnabled===true){
							$(ARSEnabledCheckbox).prop('checked', true);
						} else {
							$(ARSEnabledCheckbox).prop('checked', false);
						}
					}catch(e){}
				}
			},
			"onComplete" : function(data){
			},
			"onClosed"  : function(data){
			}
		});
	};

	var onQuizSettingsDone = function(){
		//Get Settings
		var qSF = $("#quizSettings_fancybox");
		var qSettings = {};
		qSettings.nAttempts = $(qSF).find("#quizSettings_nAttempts").val();
		qSettings.ARSEnabled = $(qSF).find("input[type='checkbox'][name='enableARS']").is(":checked");

		//Get quiz
		var quizId = $(qSF).find("input[type='hidden'][name='elId']").val();
		var quiz = $("#"+quizId);

		//Save Settings
		var qSSerialized = JSON.stringify(qSettings);
		$(quiz).attr("elSettings",qSSerialized);

		$.fancybox.close();
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
		showQuizSettings	: showQuizSettings,
		onQuizSettingsDone	: onQuizSettingsDone
	};

}) (VISH, jQuery);