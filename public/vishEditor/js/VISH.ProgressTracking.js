/*
 * Track the progress of a learner during a session.
 * Used by the SCORM API.
 */
VISH.ProgressTracking = (function(V,$,undefined){

	//Constants
	var SCORE_THRESHOLD = 0.5;

	//Auxiliar vars
	var objectives = {};
	var minRequiredTime = 1;
	var hasScore = false;


	var init = function(animation,callback){
		_createObjectives();

		//Subscribe to events

		// Check if all slides have been viewed
		// V.EventsNotifier.registerCallback(V.Constant.Event.onEnterSlide, function(params){
		// });

		// Check the average time viewing slides
		minRequiredTime = _getMinRequiredTime();
		setTimeout(function(){
			objectives["slide_average_time"].completed = true;
			objectives["slide_average_time"].progress = 1;
			V.EventsNotifier.notifyEvent(V.Constant.Event.onProgressObjectiveUpdated,objectives["slide_average_time"],false);
		},minRequiredTime*1000);

		//Quizzes
		V.EventsNotifier.registerCallback(V.Constant.Event.onAnswerQuiz, function(params){

			//Find Objective
			if((params.quizId)&&(typeof objectives[params.quizId] != "undefined")){
				objectives[params.quizId].progress = 1;
				objectives[params.quizId].completed = true;

				if(typeof params.score == "number"){
					//params.score (i.e. the scaled quiz score) is number in a 0-100 scale.
					//If a customized score weight has been assigned to the quiz in the settings, this should be reflected in the score_weight param.
					//objectives[params.quizId].score should be a score in a 0-1 scale. So, we will divide params.score/100
					var scaledScore = params.score/100;
					objectives[params.quizId].score = scaledScore;

					if(scaledScore >= SCORE_THRESHOLD){
						objectives[params.quizId].success = true;
					} else {
						objectives[params.quizId].success = false;
					}
				}

				V.EventsNotifier.notifyEvent(V.Constant.Event.onProgressObjectiveUpdated,objectives[params.quizId],false);
			}
		});
	};

	var _getMinRequiredTime = function(){
		var AVERAGE_SLIDE_TIME = 4; //seg
		try {
			_minRequiredTime = V.Viewer.getCurrentPresentation().slides.length * AVERAGE_SLIDE_TIME;
		} catch(e) {
			_minRequiredTime = 1;
		}
		return _minRequiredTime;
	};

	//Return a value in a [0,1] scale
	var getProgressMeasure = function(){
		//Adjust slide_average_time progress if is not 100%
		if (objectives["slide_average_time"].progress<1){
			objectives["slide_average_time"].progress = Math.min(1,V.TrackingSystem.getAbsoluteTime()/minRequiredTime);
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
		var timeObjective = new Objective("slide_average_time");
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
		if(slideJSON.containsQuiz===true){
			var slideElementsL = slideJSON.elements.length;
			for(var j=0; j<slideElementsL; j++){
				var element = slideJSON.elements[j];
				if(element.type===V.Constant.QUIZ){
					_createObjectiveForQuiz(element);
				}
			}
		}
	};

	var _createObjectiveForQuiz = function(quizJSON){
		if(quizJSON.selfA===true){
			//Self-assessed quiz
			hasScore = true;

			//Create objective
			var scoreWeight = 10;
			if((typeof quizJSON.settings == "object")&&(typeof quizJSON.settings.score != "undefined")){
				scoreWeight = parseInt(quizJSON.settings.score);
			}

			//'scoreWeight' is the 'score points' assigned to the quiz (10 by default). Later all these score weights will be normalized to sum to one.
			var quizObjective = new Objective(quizJSON.quizId,undefined,scoreWeight);
			objectives[quizObjective.id] = quizObjective;
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