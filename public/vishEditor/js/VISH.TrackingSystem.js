VISH.TrackingSystem = (function(V,$,undefined){

	var _enabled = false;
	var _timeReference; //since the beginning of the session
	var _currentTimeReference; //since the last slide change

	//Stores the cronology
	var _chronology;


	var init = function(animation,callback){
		_enabled = true;

		_timeReference = new Date().getTime();
		_currentTimeReference = _timeReference;

		_chronology = [];
		_chronology.push(new ChronologyEntry(V.Slides.getCurrentSlideNumber()));

		V.EventsNotifier.registerCallback(V.Constant.Event.onGoToSlide, function(params){
			_cTime = new Date().getTime();
			if(typeof _chronology[_chronology.length-1] != "undefined"){
				_chronology[_chronology.length-1].duration = _getTimeDiff(_cTime,_currentTimeReference);
			}
			_currentTimeReference = _cTime;
			setTimeout(function(){
				_chronology.push(new ChronologyEntry(V.Slides.getCurrentSlideNumber()));
			},10);
		});

		//Custom Tracking Events
		$(document).bind('click', function(event){
			var params = {};
			params["x"] = event.clientX;
			params["y"] = event.clientY;

			if(event.target){
				if(event.target.tagName){
					params["tagName"] = event.target.tagName
				}
				if(event.target.id){
					params["id"] = event.target.id
				}
			}

			registerAction("click",params);
		});
	};

	var registerAction = function(id,params){
		V.Debugging.log("Action id: " + id);
		if((_enabled)&&(typeof _chronology[_chronology.length-1] != "undefined")){
			_chronology[_chronology.length-1].actions.push(new Action(id,params));
		}
	};

	var getAbsoluteTime = function(){
		return _getTimeDiff(new Date().getTime(),_timeReference);
	};

	var getRelativeTime = function(){
		return _getTimeDiff(new Date().getTime(),_currentTimeReference);
	};

	var _getTimeDiff = function(t1,t2){
		return +((t1 - t2)/1000).toFixed(2);
	};

	var getChronology = function(){
		return _chronology;
	};

	//ChronologyEntry constructor
	var ChronologyEntry = function(slideNumber){
		this.slideNumber = slideNumber;
		this.nclicks = 0;
		this.nkeys = 0;
		this.actions = [];
		this.t = getAbsoluteTime();
	};

	var Action = function(id,params){
		this.id = id;
		this.t = getAbsoluteTime();
		this.params = params;
	};


	return {
		init				: init,
		registerAction		: registerAction,
		getAbsoluteTime		: getAbsoluteTime,
		getRelativeTime		: getRelativeTime,
		getChronology		: getChronology
	};

}) (VISH, jQuery);