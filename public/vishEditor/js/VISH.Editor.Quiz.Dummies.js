VISH.Editor.Quiz.Dummies = (function(VISH,undefined){
	var quizDummies = [];
	var quizOptionsDummies = [];

	var init = function(){
		quizDummies = ["<div class='openQuizContainer'><textarea class='value_open_question_in_zone'><div><font size="+4+">Write question here</font></div></textarea></div>", 
		"<div class='multipleChoiceQuizContainer'><div class='value_multiplechoice_question_in_zone'><div class='initTextDiv'><font size='4'>Write question here</font></div></div><ul class='ul_mch_options_in_zone'></ul><input type='hidden' name='quiz_id'/></div></div>",
		"<div class='trueFalseQuizContainer'><p> quiz dummy truefalse</p></div>"
		];
		quizOptionDummies = ["", 
		"<li class='li_mch_options_in_zone'><span class='quiz_option_index'></span><div class='multiplechoice_option_in_zone'><div class='initTextDiv'><font size='4'>Write options here</font></div></div><img src='"+VISH.ImagesPath+ "icons/add.png' class='add_quiz_option_button'/><img src='"+VISH.ImagesPath+ "icons/ve_delete.png' class='delete_quiz_option_button'/></li>", 
		""
		];
	}

	var hashTypeQuiz = {"open":0,  "multiplechoice" : 1, "truefalse": 2 };

	var getQuizDummy = function(type_quiz, position) {
		return quizDummies[hashTypeQuiz[type_quiz]];
	}

	var getQuizOptionDummy = function(type_quiz) {
		return quizOptionDummies[hashTypeQuiz[type_quiz]];
	}

	return {
		init				: init,
		getQuizDummy		: getQuizDummy, 
		getQuizOptionDummy :getQuizOptionDummy
	};

}) (VISH);