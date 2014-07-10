VISH.TrackingSystem = (function(V,$,undefined){

	var _enabled = false;
	var _timeReference; //since the beginning of the session
	var _currentTimeReference; //since the last slide change

	//Stores the cronology
	var _chronology;

	//Tracking API Key
	var _apiKey;


	var init = function(animation,callback){
		_apiKey = V.Configuration.getConfiguration().TrackingSystemAPIKEY;
		
		if(typeof _apiKey == "undefined"){
			_enabled = false;
			return;
		}

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

		V.EventsNotifier.registerCallback(V.Constant.Event.onSubslideOpen, function(params){
			registerAction(V.Constant.Event.onSubslideOpen,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onSubslideClosed, function(params){
			registerAction(V.Constant.Event.onSubslideClosed,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onPlayVideo, function(params){
			registerAction(V.Constant.Event.onPlayVideo,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onPauseVideo, function(params){
			registerAction(V.Constant.Event.onPauseVideo,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onSeekVideo, function(params){
			registerAction(V.Constant.Event.onSeekVideo,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.exit, function(){
			registerAction(V.Constant.Event.exit);
			//TODO: Send tracking data
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
		V.Debugging.log("Action id: " + id + ", with params:");
		V.Debugging.log(params);
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
		this.actions = [];
		this.t = getAbsoluteTime();
	};

	var Action = function(id,params){
		this.id = id;
		this.t = getAbsoluteTime();
		if(typeof params != "undefined"){
			this.params = params;
		}
	};


	return {
		init				: init,
		registerAction		: registerAction,
		getAbsoluteTime		: getAbsoluteTime,
		getRelativeTime		: getRelativeTime,
		getChronology		: getChronology
	};

}) (VISH, jQuery);