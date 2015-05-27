VISH.Editor.Quiz = (function(V,$,undefined){

	var _hiddenLinkToInitQuizSettings;

	var init = function(){
		V.Editor.Quiz.MC.init();
		V.Editor.Quiz.TF.init();
		V.Editor.Quiz.Sorting.init();
		V.Editor.Quiz.Open.init();

		//Quiz Settings
		_hiddenLinkToInitQuizSettings = $('<a href="#quizSettings_fancybox" style="display:none"></a>');
		$(_hiddenLinkToInitQuizSettings).fancybox({
			'autoDimensions' : false,
			'height': 360,
			'width': 400,
			'scrolling': 'no',
			'showCloseButton': false,
			'padding' : 0,
			"onStart"  : function(data){
				var qSF = $("#quizSettings_fancybox");

				//Load Quiz
				var quiz = V.Editor.getCurrentArea();
				var quizType = $(quiz).attr("quiztype");
				var quizModule = _getQuizModule(quizType);
				$(qSF).find("input[type='hidden'][name='elId']").val($(quiz).attr("id"));

				//Load Settings
				var qSettings = $(quiz).attr("elSettings");
				var nAttempts = 1;
				var quizScore = 10;
				var shuffleChoices = false;
				var disableShuffleChoices = false;
				var ARSEnabled = false;
				

				if(typeof qSettings == "string"){
					try {
						qSettings = JSON.parse(qSettings);

						if(typeof qSettings.nAttempts != "undefined"){
							nAttempts = qSettings.nAttempts;
						}
						if(typeof qSettings.quizScore != "undefined"){
							quizScore = qSettings.quizScore;
						}
						if(qSettings.ARSEnabled===true){
							ARSEnabled = true;
						}
						if(qSettings.shuffleChoices===true){
							shuffleChoices = true;
						}
					} catch(e){}
				}

				//Force options by quiz type
				switch(quizType){
					case V.Constant.QZ_TYPE.OPEN:
						shuffleChoices = false;
						disableShuffleChoices = true;
						break;
					case V.Constant.QZ_TYPE.MCHOICE:
						break;
					case V.Constant.QZ_TYPE.TF:
						break;
					case V.Constant.QZ_TYPE.SORTING:
						shuffleChoices = true;
						disableShuffleChoices = true;
						break;
					default:
						break;
				};

				//Fill and reset form
	
				var isSelfAssessment = false;
				if((quizModule)&&(typeof quizModule.isSelfAssessment == "function")){
					isSelfAssessment = quizModule.isSelfAssessment(quiz);
				}

				//Number of Attempts
				var nAttemptsDOM = $(qSF).find("#quizSettings_nAttempts");
				if(!isSelfAssessment){
					//Disable nAttempts
					$(nAttemptsDOM).prop('disabled',true);
					$(nAttemptsDOM).parent().addClass("disableSettingsField");
					$(nAttemptsDOM).val(1);
				} else {
					$(nAttemptsDOM).prop('disabled',false);
					$(nAttemptsDOM).parent().removeClass("disableSettingsField");
					$(nAttemptsDOM).val(nAttempts);
				}

				//Quiz score
				var quizScoreDOM = $(qSF).find("select[name='quizScorePoints']");
				if(!isSelfAssessment){
					//Disable quizScore
					$(quizScoreDOM).prop('disabled',true);
					$(quizScoreDOM).parent().addClass("disableSettingsField");
					$(quizScoreDOM).val(0);
				} else {
					$(quizScoreDOM).prop('disabled',false);
					$(quizScoreDOM).parent().removeClass("disableSettingsField");
					$(quizScoreDOM).val(quizScore);
				}

				//Shuffle Choices
				var shuffleChoicesCheckbox = $(qSF).find("input[type='checkbox'][name='shuffleChoices']");
				$(shuffleChoicesCheckbox).prop('checked', shuffleChoices);
				if(disableShuffleChoices){
					$(shuffleChoicesCheckbox).parent().addClass("disableSettingsField");
					$(shuffleChoicesCheckbox).attr('disabled', 'disabled');
				} else {
					$(shuffleChoicesCheckbox).parent().removeClass("disableSettingsField");
					$(shuffleChoicesCheckbox).removeAttr('disabled');
				}		

				//ARS Enabled
				var ARSEnabledCheckbox = $(qSF).find("input[type='checkbox'][name='enableARS']");
				$(ARSEnabledCheckbox).prop('checked', ARSEnabled);

				// //Post actions
				// switch(quizType){
				// 	case V.Constant.QZ_TYPE.OPEN:
				// 		break;
				// 	case V.Constant.QZ_TYPE.MCHOICE:
				// 		break;
				// 	case V.Constant.QZ_TYPE.TF:
				// 		break;
				// 	case V.Constant.QZ_TYPE.SORTING:
				// 		break;
				// 	default:
				// 		break;
				// };
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

		var nAttemptsDOM = $(qSF).find("#quizSettings_nAttempts");
		if(!$(nAttemptsDOM).is(":disabled")){
			qSettings.nAttempts = $(nAttemptsDOM).val();
		}

		var quizScoreDOM = $(qSF).find("select[name='quizScorePoints']");
		if(!$(quizScoreDOM).is(":disabled")){
			qSettings.quizScore = $(quizScoreDOM).val();
		}

		qSettings.shuffleChoices = $(qSF).find("input[type='checkbox'][name='shuffleChoices']").is(":checked");
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
		switch(quiz_type){
			case V.Constant.QZ_TYPE.OPEN:
				return V.Editor.Quiz.Open;
				break;
			case V.Constant.QZ_TYPE.MCHOICE:
				return V.Editor.Quiz.MC;
				break;
			case V.Constant.QZ_TYPE.TF:
				return V.Editor.Quiz.TF;
				break;
			case V.Constant.QZ_TYPE.SORTING:
				return V.Editor.Quiz.Sorting;
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


	/* 
	 * Quiz exporting 
	 * Usage example: VISH.Editor.Quiz.exportTo("QTI", function(){ alert("Success")}, function(){alert("Fail")})
	 */
	var _exportTo = function(format,successCallback,failCallback){
		var cJSONQuiz = _getCurrentJSONQuiz();

		if(typeof cJSONQuiz == "undefined"){
			if(typeof failCallback == "function"){
				failCallback();
			}
			return;
		}

		V.Editor.API.uploadTmpJSON(cJSONQuiz,format,successCallback,failCallback);
	};

	var onExportTo = function(format){
		$.fancybox.close();
		
		_exportTo(format,function(){
			//Success
		},function(){
			setTimeout(function(){
				//On fail
				var options = {};
				options.width = 600;
				options.height = 185;

				if(format=="QTI"){
					options.text = V.I18n.getTrans("i.exportQuizToQTIerrorNotification");
				} else if(format=="MoodleXML"){
					options.text = V.I18n.getTrans("i.exportQuizToMoodleXMLerrorNotification");
				}
				
				var button1 = {};
				button1.text = V.I18n.getTrans("i.Ok");
				button1.callback = function(){
					$.fancybox.close();
				}
				options.buttons = [button1];
				V.Utils.showDialog(options);
			},600);
		});
	};

	var _getCurrentJSONQuiz = function(){
		var quizJSON = undefined;
		var presentation = V.Editor.savePresentation();
		var cslide = V.Slides.getCurrentSlide();

		if(typeof cslide == "object"){
			var cslideId = $(cslide).attr("id");
			
		 	$.each(presentation.slides, function(index,value){
				if((value.id == cslideId)&&(value.containsQuiz == true)){
					$.each(value.elements, function(index,elVal){
						if(elVal.type == "quiz"){
							quizJSON = elVal;
						}
					});
	 			}	
		 	});
		}
		return quizJSON;
	};

	var afterCopyQuiz = function(quizDOM){
		var quizType = $(quizDOM).attr("quiztype");
		var quizModule = _getQuizModule(quizType);
		if((quizModule)&&(typeof quizModule.afterCopyQuiz == "function")){
			return quizModule.afterCopyQuiz(quizDOM);
		}
	};

	return {
		init				: init, 
		add					: add,
		save				: save,
		draw				: draw,
		onExportTo			: onExportTo,
		showQuizSettings	: showQuizSettings,
		onQuizSettingsDone	: onQuizSettingsDone,
		afterCopyQuiz		: afterCopyQuiz
	};

}) (VISH, jQuery);