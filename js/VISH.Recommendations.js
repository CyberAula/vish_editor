VISH.Recommendations = (function(V,$,undefined){

	//Internals
	var _enabled;
	var _requesting;
	var _generated;
	var _isRecVisible;
	var _isEvalVisible;
	var _showFancyboxTimer;

	//Recommendations API
	var _recommendationAPIUrl;

	//Vishub params
	var user_id;
	var vishub_pres_id;

	//Params to enhance recommendation
	var _searchTerms;

	//Store information for tracking
	var _RSTrackingData;


	/**
	 * Function to initialize the Recommendations
	 */
	var init = function(options){
		_enabled = false;
		_isRecVisible = false;
		_requesting = false;
		_generated = false;

		var options = V.Utils.getOptions();
		if((options)&&(!options.preview)&&(typeof options["configuration"]["recommendationsAPI"] != "undefined")&&(typeof options["configuration"]["recommendationsAPI"]["rootURL"] == "string")){
			_recommendationAPIUrl = options["configuration"]["recommendationsAPI"]["rootURL"];
			_enabled = true;
		} else {
			return;
		}

		if(V.Status.getIsInVishSite()){
			user_id = V.User.getId();
			var presentation = V.Viewer.getCurrentPresentation();
			if(presentation["vishMetadata"] && presentation["vishMetadata"]["id"]){
				vishub_pres_id = presentation["vishMetadata"]["id"];
			}
		}

		_searchTerms = getCurrentSearchTerms();

		//Redimension of fancybox is done in ViewerAdapter
		$("#fancyRec").fancybox({
			'type'	: 'inline',
			'autoDimensions' : false,
			'scrolling': 'no',
			'autoScale' : false,		      
			'width': '100%',
			'height': '100%',
			'padding': 0,
			'overlayOpacity': 0,
			'center': false,
			'onStart' : function(){
				$("#fancybox-outer").css("display","none");
			},
			'onComplete'  : function(data) {
				$("#fancybox-outer").css("background", "rgba(0,0,0,.7)");
				$("#fancybox-wrap").css("margin-top", "0px");
				V.Slides.triggerLeaveEvent(V.Slides.getCurrentSlideNumber());
				_isRecVisible = true;
				V.ViewerAdapter.updateFancyboxAfterSetupSize();
				$("#fancybox-outer").css("display","block");
				V.ViewerAdapter.decideIfPageSwitcher();
			},
			'onClosed' : function(data) {
				V.EventsNotifier.notifyEvent(V.Constant.Event.onHideRecommendations,{},true);
				$("#fancybox-outer").css("background", "white");
				$("#fancybox-wrap").css("margin-top", "-14px");
				V.Slides.triggerEnterEvent(V.Slides.getCurrentSlideNumber());
				_isRecVisible = false;
				V.ViewerAdapter.decideIfPageSwitcher();
			}
		});

		$("#fancyEvaluations").fancybox({
			'type'	: 'inline',
			'autoDimensions' : false,
			'scrolling': 'no',
			'autoScale' : false,
			'width': '100%',
			'height': '100%',
			'padding': 0,
			'overlayOpacity': 0,
			'center': false,
			'onStart' : function(){
				$("#fancybox-outer").css("display","none");
			},
			'onComplete'  : function(data) {
				$("#fancybox-outer").css("background", "rgba(0,0,0,.7)");
				$("#fancybox-wrap").css("margin-top", "0px");
				_isRecVisible = true;
				_isEvalVisible = true;
				V.ViewerAdapter.updateFancyboxAfterSetupSize();
				$("#fancybox-outer").css("display","block");
				V.ViewerAdapter.decideIfPageSwitcher();

				var loepSettings = _getLOEPSettings();
				loepSettings.language = V.Utils.getOptions()["lang"];
				loepSettings.containerDOM = $('#fancy_evaluations');
				loepSettings.loadCallback = function(){
					//LOEP form loaded
				};
				loepSettings.submitCallback = function(){
					//"Sucesfully submitted"
					$.fancybox.close();
				};
				loepSettings.errorCallback = function(errorMsg){
					//"Error loading the evaluation form"
					hideEvaluations();
					$.fancybox.close();
				};
				loepSettings.debug = V.Debugging.isDevelopping();
				new LOEP.IframeAPI.instance(loepSettings);
			},
			'onClosed' : function(data) {
				$('#fancy_evaluations').html("");
				$("#fancybox-outer").css("background", "white");
				$("#fancybox-wrap").css("margin-top", "-14px");
				V.Slides.triggerEnterEvent(V.Slides.getCurrentSlideNumber());
				_isEvalVisible = false;
				_isRecVisible = false;
				V.ViewerAdapter.decideIfPageSwitcher();
			}
		});
	};

	var canShowRecommendations = function(){
		return true;
	};

	var canShowEvaluateButton = function(){
		var _showEvaluateButton = (_hasLOEPSettings() || (V.Status.getIsInVishSite()&&V.Status.getIsInIframe()));
		//Only available for desktop
		_showEvaluateButton = _showEvaluateButton && V.Status.getDevice().desktop;
		return _showEvaluateButton;
	};

	/**
	 * Function to check if this is the appropiate moment to request the recommendations
	 */
	var checkForRecommendations = function(){
		if(!_enabled){
			return;
		}

		var slidesQuantity = V.Slides.getSlidesQuantity();
		var cSlideNumber = V.Slides.getCurrentSlideNumber();

		if(cSlideNumber > slidesQuantity - 3){
			if(!_generated){
				_requestRecommendations();
			}
		}
	};

	/**
	 * Function to call ViSH via AJAX to get recommendations
	 */
	var _requestRecommendations = function(){
		if((_enabled)&&(typeof _recommendationAPIUrl != "undefined")&&(!_generated)&&(_requesting != true)){
			_requesting = true;

			var params = {};
			params["quantity"] = 6;
			if(_searchTerms){
				params["q"] = _searchTerms;
			}
			if(user_id){
				params["user_id"] = user_id;
			}
			if(vishub_pres_id){
				params["excursion_id"] = vishub_pres_id;
			}

			$.ajax({
				type    : "GET",
				url     : _recommendationAPIUrl,
				data    : params,
				success : function(data) {
					_fillFancyboxWithData(data);
				},
				error: function(error){
					_enabled = false; //Disable recommendations when API fail
					_requesting = false;
				}
			});
		}
	};

	var _fillFancyboxWithData = function(data){
		if((!data)||(data.length===0)){
			_enabled = false; //Disable recommendations when API fail
			_requesting = false;
			return;
		}

		//Store recommender information for tracking
        _RSTrackingData = data;

		var applyTargetBlank = V.Status.getIsInExternalSite();

        var ex;
        var result = "";
        for (var i = data.length - 1; i >= 0; i--){
        	ex = data[i];
        	if(applyTargetBlank){
        		result += '<a target="_blank" class="recommendedItemLinkBlank" href="'+ex.url+'" ex_id="' + ex.id + '">';
        	}
        	result += '<div class="rec-excursion" id="recom-'+ex.id+'" ex_id="' + ex.id + '"number="'+i+'">'+
                        '<ul class="rec-thumbnail">'+
                          '<li class="rec-img-excursion">'+
                           '<img src="'+ex.image+'">'+
                            '<div class="rec-number_pages">'+ex.number_of_slides+'</div>'+
                          '</li>'+
                          '<li class="rec-info-excursion">'+
                            '<div class="rec-title-excursion">'+ex.title+'</div>'+
                            '<div class="rec-by">by <span class="rec-name">'+ex.author+'</span></div>'+
                            '<span class="rec-visits">'+ex.views+'</span> <span class="rec-views">'+V.I18n.getTrans("i.exviews")+'</span>'+
                            '<div class="rec-likes"><span class="rec-likes-number">'+ex.favourites+'</span><img class="rec-menu_icon" src="'+ V.ImagesPath + 'vicons/star-on10.png"></div>'+
                          '</li>'+
                        '</ul>'+
                    '</div>';
			if(applyTargetBlank){
				result += '</a>';
			}
		};
        $("#fancy_recommendations .rec-grid").html(result);
        aftersetupSize();
        _generated = true;
        _requesting = false;

        if(!applyTargetBlank){
        	//we join the recom-X with sending the parent to the excursion url
        	 for (var i = data.length - 1; i >= 0; i--){
        	 	$("#recom-"+data[i].id).click(function(my_event){
        	 		V.EventsNotifier.notifyEvent(V.Constant.Event.onAcceptRecommendation,{"id": $(this).attr("ex_id")},true);
        	 		V.Utils.sendParentToURL(data[$(my_event.target).closest(".rec-excursion").attr("number")].url);
				});
        	 }
        };
	};

	var showFancybox = function(){
		if(_enabled == false){
			return;
		}
		if(V.Editing){
			return;
		}
		// Disable recommendations for Mobiles and tablets
		// if(!V.Status.getDevice().desktop){
		// 	return;
		// }
		if(V.Viewer.getPresentationType()!= V.Constant.PRESENTATION){
			return;
		}
		if((V.Utils.getOptions())&&(V.Utils.getOptions().preview)){
			return;
		}
		if(isRecVisible()){
			return;
		}
		if(!V.Slides.isCurrentLastSlide()){
			return;
		}

		if(!_generated){
			if(!_requesting){
				//Request recommendations
				_requestRecommendations();
			}

			if(typeof _showFancyboxTimer == "undefined"){
				_showFancyboxTimer = setTimeout(function(){
					clearTimeout(_showFancyboxTimer);
					_showFancyboxTimer = undefined;
					showFancybox();
				},300);
			}

			return;
		}

		V.EventsNotifier.notifyEvent(V.Constant.Event.onShowRecommendations,{},true);

		//Show fancybox
		$("#fancyRec").trigger('click');
	};

	var hideFancybox = function(){
		V.EventsNotifier.notifyEvent(V.Constant.Event.onHideRecommendations,{},true);
		$.fancybox.close();
	};

	var isRecVisible = function(){
		return _isRecVisible;
	};

	var isEnabled = function(){
		return _enabled;
	};

	var aftersetupSize = function(increase){
		var items = $(".rec-excursion");
		if(items.length < 1){
			return;
		}

		increase = (typeof increase == "number") ? increase : V.ViewerAdapter.getLastIncrease()[0];
		if(increase > 0.82){
			$(items).css("width","44%");
		} else if(increase > 0.36){
			$(items).css("width","40%");
		} else {
			$(items).css("width","36%");
		}
	};

	var getCurrentSearchTerms = function(){
		return getSearchTerms(V.Viewer.getCurrentPresentation());
	};

	var getSearchTerms = function(pJSON){
		var searchTerms = [];
		if(typeof pJSON["tags"] != "undefined"){
			$(pJSON["tags"]).each(function(index,tag){
				searchTerms.push(tag);
			});
		}
		if(typeof pJSON["subject"] != "undefined"){
			$(pJSON["subject"]).each(function(index,tag){
				searchTerms.push(tag);
			});
		}
		if(typeof pJSON["title"] != "undefined"){
			searchTerms.push(pJSON["title"]);
		}

		return searchTerms.join(",");
	};

	var getData = function(){
		return _RSTrackingData;
	}


	//////////////////////////
	//Evaluations (displayed in the recommendation panel)
	//////////////////////////

	var onClickEvaluateButton = function(){
		V.EventsNotifier.notifyEvent(V.Constant.Event.onEvaluate,{},true);

		try {
			if(V.Status.getIsInVishSite()&&V.Status.getIsInIframe()&&(typeof window.parent.triggerEvaluation == "function")){
				//VE in the ViSH site. Trigger ViSH evaluation. This case is not triggered when we access the .full in ViSH.
				V.FullScreen.exitFromNativeFullScreen();
				window.parent.triggerEvaluation();
				return;
			}
		} catch(e){}

		if(_hasLOEPSettings()){
			//Show evaluations inside the VE through LOEP
			_showEvaluationsFancybox();
		} else {
			//Otherwise (testing)
			window.alert("Evaluate!");
		}
	};

	var _hasLOEPSettings = function(){
		return (typeof _getLOEPSettings() == "object");
	};

	var _getLOEPSettings = function(){
		try {
			return V.Utils.getOptions()["configuration"]["loepSettings"];
		} catch (e){
			return undefined;
		}
	};

	var _showEvaluationsFancybox = function(){
		$("#fancyEvaluations").trigger('click');
	};

	var showEvaluations = function(){
		$(".rec-first-row").show();
		// $(".rec-second-row").css("margin-top","0%"); //Center second row vertically
	};

	var hideEvaluations = function(){
		$(".rec-first-row").hide();
		$(".rec-second-row").css("margin-top","10%"); //Center second row vertically
	};

	return {
		init          			: init,
		canShowRecommendations	: canShowRecommendations,
		canShowEvaluateButton	: canShowEvaluateButton,
		checkForRecommendations	: checkForRecommendations,
		showFancybox			: showFancybox,
		hideFancybox			: hideFancybox,
		isRecVisible 			: isRecVisible,
		isEnabled				: isEnabled,
		getData					: getData,
		onClickEvaluateButton	: onClickEvaluateButton,
		showEvaluations 		: showEvaluations,
		hideEvaluations 		: hideEvaluations,
		aftersetupSize			: aftersetupSize
	};

}) (VISH,jQuery);