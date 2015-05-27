/*
 * Track the progress of a learner during a session.
 * Used by the SCORM API.
 */
VISH.ProgressTracking = (function(V,$,undefined){

	//Constants
	var SCORE_THRESHOLD = 0.5;

	//Auxiliar vars
	var _initialized = false;
	var objectives = {};
	var minRequiredTime = 10;
	var hasScore = false;


	var init = function(){
		if(_initialized){
			return;
		}
		_initialized = true;

		_createObjectives();

		//Subscribe to events

		// Check if all slides have been viewed
		// V.EventsNotifier.registerCallback(V.Constant.Event.onEnterSlide, function(params){
		// });

		// Check the average time viewing slides
		minRequiredTime = _getMinRequiredTime();
		setTimeout(function(){
			objectives["lo_spent_time"].completed = true;
			objectives["lo_spent_time"].progress = 1;
			V.EventsNotifier.notifyEvent(V.Constant.Event.onProgressObjectiveUpdated,objectives["lo_spent_time"],false);
		},minRequiredTime*1000);

		//Quizzes
		V.EventsNotifier.registerCallback(V.Constant.Event.onAnswerQuiz, function(params){
			if(typeof params != "object"){
				return;
			}

			//params.score (i.e. the quiz score) is (or should be) a number in a 0-100 scale.
			//scaledScore (i.e score param expected by onNewScoreOnObjective) should be a score in a 0-1 scale.
			//So, we should divide params.score by 100.
			if(typeof params.score == "number"){
				params.score = params.score/100;
			}
			_onNewObjectiveScore(params.quizId,params.score);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onNewObjectiveScore, function(params){
			if(typeof params != "object"){
				return;
			}

			//params.score should be a number in a 0-1 scale.
			_onNewObjectiveScore(params.objectiveId,params.score);
		});
	};

	/*
	 * objectiveId is the identifier of the object to be updated.
	 * scaledScore should be a number in a 0-1 scale.
	 */
	var _onNewObjectiveScore = function(objectiveId,scaledScore){
		if((typeof objectiveId == "undefined")||(objectives[objectiveId] == "undefined")){
			return; //objective not found
		}

		// console.log("_onNewObjectiveScor");
		// console.log(objectiveId);
		// console.log(scaledScore);

		objectives[objectiveId].progress = 1;
		objectives[objectiveId].completed = true;

		if(typeof scaledScore == "number"){
			//If a customized score weight has been assigned to the object in the settings, this should be reflected in the score_weight param.
			//objectives[objectiveId].score should be a score in a 0-1 scale.
			objectives[objectiveId].score = scaledScore;

			if(objectives[objectiveId].score >= SCORE_THRESHOLD){
				objectives[objectiveId].success = true;
			} else {
				objectives[objectiveId].success = false;
			}
		}

		V.EventsNotifier.notifyEvent(V.Constant.Event.onProgressObjectiveUpdated,objectives[objectiveId],false);
	};

	var _getMinRequiredTime = function(){
		var _minRequiredTime = minRequiredTime; //Default

		var currentPresentation = V.Viewer.getCurrentPresentation();
		if(typeof currentPresentation.TLT != "undefined"){
			var TLT = V.Utils.iso8601Parser.getDurationFromISO(currentPresentation.TLT);
			if((typeof TLT == "number")&&(TLT > 0)){
				_minRequiredTime = (0.5 * TLT);
			}
		}
		
		return _minRequiredTime;
	};

	//Return a value in a [0,1] scale
	var getProgressMeasure = function(){
		//Adjust lo_spent_time progress if is not 100%
		if (objectives["lo_spent_time"].progress<1){
			objectives["lo_spent_time"].progress = Math.min(1,V.TrackingSystem.getAbsoluteTime()/minRequiredTime);
		}

		var overallProgressMeasure = 0;
		Object.keys(objectives).forEach(function(key){
			overallProgressMeasure += objectives[key].progress * objectives[key].completion_weight;
		});

		return +(overallProgressMeasure).toFixed(6);
	};

	//Return a value in a [0,1] scale
	var getScore = function(){
		var overallScore = 0;
		Object.keys(objectives).forEach(function(key){
			if(typeof objectives[key].score == "number"){
				overallScore += objectives[key].score * objectives[key].score_weight;
			}
		});
		return +(overallScore).toFixed(6);
	};

	var getHasScore = function(){
		return hasScore;
	};

	var getObjectives = function(){
		return objectives;
	};


	/////////////
	// Helpers
	/////////////

	var _createObjectives = function(){
		var presentation = V.Viewer.getCurrentPresentation();

		var slidesL = presentation.slides.length;
		for(var i=0; i<slidesL; i++){
			var slide = presentation.slides[i];
			_createObjectiveForStandardSlide(slide);

			if(typeof slide.slides == "object"){
				var subslidesL = slide.slides.length;
				for(var k=0; k<subslidesL; k++){
					var subslide = slide.slides[k];
					_createObjectiveForStandardSlide(subslide);
				}
			}
		}

		//Create an objective that requires to spent a minimum average time viewing the slides.
		var timeObjective = new Objective("lo_spent_time");
		if(hasScore){
			timeObjective.completion_weight = 0.5;
		} else {
			timeObjective.completion_weight = 1;
		}
		objectives[timeObjective.id] = timeObjective;

		//Fill completion weights
		var objectivesKeys = Object.keys(objectives);
		var nObjectives = objectivesKeys.length;

		if(nObjectives>1){
			var defaultCompletionWeight = (1-timeObjective.completion_weight)/(nObjectives-1);
			var scoreWeightSum = 0;

			objectivesKeys.forEach(function(key){
				if(typeof objectives[key].completion_weight == "undefined"){
					objectives[key].completion_weight = defaultCompletionWeight;
				}
				if(typeof objectives[key].score_weight == "number"){
					//Calculate sum to normalize score_weight
					scoreWeightSum += objectives[key].score_weight;
				}
			});

			if(scoreWeightSum > 0){
				objectivesKeys.forEach(function(key){ 
					if(typeof objectives[key].score_weight == "number"){
						//Normalize score_weight
						objectives[key].score_weight = objectives[key].score_weight/scoreWeightSum;
					}
				});
			};
		};	
	};

	var _createObjectiveForStandardSlide = function(slideJSON){
		var slideElementsL = slideJSON.elements.length;
		for(var j=0; j<slideElementsL; j++){
			var element = slideJSON.elements[j];

			switch(element.type){
				case V.Constant.QUIZ:
					_createObjectiveForQuiz(element);
					break;
				case V.Constant.OBJECT:
					if((typeof element.settings == "object")&&(element.settings.wappAPI===true)){
						_createObjectiveForWAPP(element);
					}
					break;
				default:
					return;
			}
		}
	};

	var _createObjectiveForQuiz = function(quizJSON){
		if(quizJSON.selfA===true){
			//Self-assessed quiz
			hasScore = true;

			//Create objective
			var scoreWeight = 10;
			if((typeof quizJSON.settings == "object")&&(typeof quizJSON.settings.quizScore != "undefined")){
				scoreWeight = parseInt(quizJSON.settings.quizScore);
			}

			//'scoreWeight' is the 'score points' assigned to the quiz (10 by default). Later all these score weights will be normalized to sum to one.
			var quizObjective = new Objective(quizJSON.quizId,undefined,scoreWeight);
			objectives[quizObjective.id] = quizObjective;
		}
	};

	var _createObjectiveForWAPP = function(wappJSON){
		if((typeof wappJSON.settings != "object")||(wappJSON.settings.wappAPI!==true)){
			return;
		}

		if(wappJSON.settings.wappScore === true){
			//WAPP with score
			hasScore = true;

			//Create objective
			var scoreWeight = 10;
			if(typeof wappJSON.settings.wappScorePoints != "undefined"){
				scoreWeight = parseInt(wappJSON.settings.wappScorePoints);
			}

			var wappId = $(wappJSON.body).attr("wappid");
			if(typeof wappId != "string"){
				return;
			}

			//'scoreWeight' is the 'score points' assigned to the wapp (10 by default). Later all these score weights will be normalized to sum to one.
			var wappObjective = new Objective(wappId,undefined,scoreWeight);
			objectives[wappObjective.id] = wappObjective;
		}
	};


	/////////////
	// Constructors
	/////////////

	var Objective = function(id,completion_weight,score_weight,description){
		this.id = id;
		this.seq_id = _getObjectiveId();
		this.completed = false;
		this.progress = 0;
		this.score = undefined;
		this.success = undefined;
		if(typeof completion_weight == "number"){
			this.completion_weight = completion_weight;
		}
		if(typeof score_weight == "number"){
			this.score_weight = score_weight;
		}
		if(typeof description == "string"){
			this.description = description;
		}
	};

	var lastObjectiveId = -1;
	var _getObjectiveId = function(){
		lastObjectiveId += 1;
		return lastObjectiveId;
	};


	return {
		init					: init,
		getProgressMeasure		: getProgressMeasure,
		getScore				: getScore,
		getHasScore				: getHasScore,
		getObjectives			: getObjectives
	};

}) (VISH, jQuery);