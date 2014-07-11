VISH.TrackingSystem = (function(V,$,undefined){

	var _enabled = false;
	var _timeReference; //since the beginning of the session
	var _currentTimeReference; //since the last slide change

	//Store the LO of the session
	var _lo;
	//Store the user of the session
	var _user;
	//User device
	var _device;
	//Stores the cronology
	var _chronology;
	//Stores specific information about the RecommenderSystem (RS)
	var _rs;

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

		_lo = new LO();
		if(V.User.isLogged()){
			_user = new User();
		}
		_device = V.Status.getDevice();
		_rs = new RS();

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

		V.EventsNotifier.registerCallback(V.Constant.Event.onPlayAudio, function(params){
			registerAction(V.Constant.Event.onPlayAudio,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onPauseAudio, function(params){
			registerAction(V.Constant.Event.onPauseAudio,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onSeekAudio, function(params){
			registerAction(V.Constant.Event.onSeekAudio,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onShowRecommendations, function(params){
			_rs.shown = true;
			//Get and store RS data
			_rs.tdata = V.Recommendations.getData();
			registerAction(V.Constant.Event.onShowRecommendations,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onHideRecommendations, function(params){
			_rs.accepted = false;
			registerAction(V.Constant.Event.onHideRecommendations,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onAcceptRecommendation, function(params){
			_rs.accepted = params.id;
			registerAction(V.Constant.Event.onAcceptRecommendation,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onEvaluate, function(params){
			registerAction(V.Constant.Event.onEvaluate,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onEvaluateCompletion, function(params){
			registerAction(V.Constant.Event.onEvaluateCompletion,params);
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.exit, function(){
			registerAction(V.Constant.Event.exit);
			sendTrackingObject();
		});

		V.EventsNotifier.registerCallback(V.Constant.Event.onViewportResize, function(params){
			registerAction(V.Constant.Event.onViewportResize,params);
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


	/////////////
	// Functions
	/////////////

	var registerAction = function(id,params){
		// V.Debugging.log("Action id: " + id + ", with params:");
		// V.Debugging.log(params);
		if((_enabled)&&(typeof _chronology[_chronology.length-1] != "undefined")){
			_chronology[_chronology.length-1].actions.push(new Action(id,params));
		}
	};

	var sendTrackingObject = function(){
		var data = _composeTrackingObject();

		if(typeof V.Configuration.getConfiguration().TrackingSystemAPIURL == "string"){
			var trackerAPIUrl = V.Configuration.getConfiguration().TrackingSystemAPIURL;
		} else {
			//Default tracker: Vishub.org
			var trackerAPIUrl = "http://vishub.org/tracking_system_entries";
		}

		$.ajax({
			type    : 'POST',
			url     : trackerAPIUrl,
			data    : data,
			async	: false
		});
	};

	var _composeTrackingObject = function(){
		return {
			"app_id": "ViSH Editor",
			"app_key": _apiKey,
			"data": _composeData()
		}
	};

	var _composeData = function(){
		var data = {};
		data["lo"] = _lo;
		if(typeof _user != "undefined"){
			data["user"] = _user;
		}
		data["device"] = _device;
		data["chronology"] = _chronology;
		data["rs"] = _rs;
		data["duration"] = getAbsoluteTime();

		return data;
	};


	/////////////
	// Helpers
	/////////////

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

	//Constructors
	var LO = function(){
		var current_presentation = V.Viewer.getCurrentPresentation();
		if(typeof current_presentation == "object"){
			this.content = current_presentation;
			if(typeof current_presentation.vishMetadata == "object"){
				this.id = current_presentation.vishMetadata.id;
			}
		}
	};

	var User = function(){
		var current_user = V.User.getUser();
		if(typeof current_user == "object"){
			this.id = current_user.id;
		}
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

	var RS = function(){
		this.shown = false;
		this.accepted = undefined;
		this.tdata = {};
	};


	return {
		init					: init,
		registerAction			: registerAction,
		getAbsoluteTime			: getAbsoluteTime,
		getRelativeTime			: getRelativeTime,
		getChronology			: getChronology,
		_composeTrackingObject	: _composeTrackingObject,
		sendTrackingObject		: sendTrackingObject
	};

}) (VISH, jQuery);