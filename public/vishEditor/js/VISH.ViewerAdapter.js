VISH.ViewerAdapter = (function(V,$,undefined){

	//Viewbar
	var _showViewbar;
	//Arrows
	var _showArrows;

	//Full Screen
	var _fsButton;

	//Close button
	var _closeButton;

	//Recommendations
	var _showRec;
	var _showEval;

	//Internals
	var _initialized = false;
	//Prevent updateInterface with same params (Make ViSH Viewer more efficient)
	var _lastWidth;
	var _lastHeight;
	//Store last increases
	var _lastIncrease;
	var _lastIncreaseW;


	var init = function(options){
		if(_initialized){
			return;
		} 
		_initialized = true;

		//Init vars
		_lastWidth = -1;
		_lastHeight = -1;

		_showViewbar = _defaultViewbar();
		_showArrows = true;
		_fsButton = V.FullScreen.canFullScreen();

		//Close button false by default
		_closeButton = false;

		//Recommendations
		_showRec = V.Recommendations.canShowRecommendations();
		_showEval = V.Recommendations.canShowEvaluateButton();

		//Mobiles
		if(V.Status.getDevice().mobile){
			if(!V.Status.getIsInIframe()){
				_closeButton = (options)&&(options["comeBackUrl"]);
			}
		}

		//Mobile and Tablets
		if(!V.Status.getDevice().desktop){
			_showArrows = false;
		}

		//Uniq mode
		if(V.Status.getIsUniqMode()){
			_showViewbar = false;
			_showArrows = false;
		}


		//////////////
		//Restrictions
		/////////////

		//No fs for preview
		_fsButton = _fsButton && (!V.Status.getIsPreview());


		////////////////
		//Init interface
		///////////////

		if(_showViewbar){
			V.Viewer.updateSlideCounter();
			$("#viewbar").show();
		} else {
			$("#viewbar").hide();
		}

		if(!_showArrows){
			$("#back_arrow").hide();
			$("#forward_arrow").hide();
		};

		if(V.Status.getIsPreview()){
			$("div#viewerpreview").show();
		}

		if(V.Status.getIsPreviewInsertMode()){
			$("#selectSlidesBar").show();
			$("#viewbar").css("bottom",$("#selectSlidesBar").height()+"px");
			$("#viewbar").css("border-bottom","none");
			V.SlidesSelector.init();
		}

		//Watermark
		if((V.Status.getIsInExternalSite())&&(!V.Status.getIsPreviewInsertMode())){
			if((options)&&(typeof options.watermarkURL == "string")){
				$("#embedWatermark").parent().attr("href",options.watermarkURL);
				$("#embedWatermark").show();
			}
		}

		//Evaluations (in recommendation window)
		if(_showEval){
			V.Recommendations.showEvaluations();
		} else {
			V.Recommendations.hideEvaluations();
		}

		if(_closeButton){
			$("button#closeButton").show();
		}

		//Init fullscreen
		if(_fsButton){
			V.FullScreen.enableFullScreen();
			$("#page-fullscreen").show();
		} else {
			$("#page-fullscreen").hide();
		}

		//Update interface and init texts
		updateInterface();
		V.Text.init();
	};


	///////////////
	// PAGER
	//////////////

	/**
	 * Function to hide/show the page-switchers buttons and arrows
	 * hide the left one if on first slide
	 * hide the right one if on last slide -> always show it, it will show the recommendations if on last slide
	 * show both otherwise
	 */
	var decideIfPageSwitcher = function(){
		//Arrows
		if(_showArrows){
			if(V.Viewer.getPresentationType()===V.Constant.PRESENTATION){
				if (V.Slides.getCurrentSubslide()!==null){
					//Subslide active
					$("#forward_arrow").hide();
					$("#back_arrow").hide();
				} else {
					//No subslide
					if(V.Slides.isCurrentFirstSlide()){
						$("#back_arrow").hide();
					} else {
						$("#back_arrow").show();
					} 
					//Always show
					$("#forward_arrow").show();
				}
			} else if (V.Viewer.getPresentationType()===V.Constant.QUIZ_SIMPLE){
				//Remove arrow for simple quizs
				$("#forward_arrow").hide();
			}
		}

		// Pager
		if(V.Recommendations.isRecVisible()){
			$("#page-switcher-start").removeClass("disabledarrow");
			$("#page-switcher-end").addClass("disabledarrow");
		} else {
			if(V.Slides.isCurrentFirstSlide()){
				$("#page-switcher-start").addClass("disabledarrow");
			} else {
				$("#page-switcher-start").removeClass("disabledarrow");
			}
			if((V.Slides.isCurrentLastSlide())&&(!V.Recommendations.isEnabled())){
				$("#page-switcher-end").addClass("disabledarrow");
			} else {
				$("#page-switcher-end").removeClass("disabledarrow");
			}
		}
	};


	///////////
	// ViewBar
	///////////

	var _decideIfViewBarShow = function(){
		if(_showViewbar){
			$("#viewbar").show();
		} else {
			$("#viewbar").hide();
		}
	};

	var _defaultViewbar = function(){
		var presentationType = V.Viewer.getPresentationType();
		var slidesQuantity = V.Slides.getSlidesQuantity();
		if((presentationType===V.Constant.QUIZ_SIMPLE)&&(slidesQuantity===1)){
			return false;
		} else {
			return true;
		}
	};

	///////////
	// Setup
	///////////

	var updateInterface = function(){
		var cWidth = $(window).width();
		var cHeight = $(window).height();
		if((cWidth===_lastWidth)&&(cHeight===_lastHeight)){
			return;
		}
		_lastWidth = cWidth;
		_lastHeight = cHeight;
		_setupSize();
	};


	/**
	 * Function to adapt the slides to the screen size
	 */
	var _setupSize = function(){
		var viewbarHeight;
		var min_margin_height = 25;
		var min_margin_width = 60;

		if(!_showViewbar){
			//Cases without viewbar (quiz_simple , etc)
			viewbarHeight = 0;
			min_margin_height = 0;
			min_margin_width = 0;
		} else if(V.Status.getIsPreviewInsertMode()){
			//Preview with insert images
			viewbarHeight = 120; //Constant because is displayed from ViSH Editor
		} else {
			viewbarHeight = _getDesiredVieweBarHeight(_lastHeight);
		}
		
		var height = _lastHeight - viewbarHeight;
		var width = _lastWidth;
		var finalW = 800;
		var finalH = 600;

		var finalWidthMargin;

		var aspectRatio = (width-min_margin_width)/(height-min_margin_height);
		var slidesRatio = 4/3;
		if(aspectRatio > slidesRatio){
			finalH = height - min_margin_height;
			finalW = finalH*slidesRatio;
			var widthMargin = (width - finalW);
			if(widthMargin < min_margin_width){
				finalWidthMargin = min_margin_width;
				var marginWidthToAdd = min_margin_width - widthMargin;
				finalW = finalW - marginWidthToAdd;
			} else {
				finalWidthMargin = widthMargin;
			}
		}	else {
			finalW = width - min_margin_width;
			finalH = finalW/slidesRatio;
			finalWidthMargin = min_margin_width;
			var heightMargin = (height - finalH);
			if(heightMargin < min_margin_height){
				var marginHeightToAdd = min_margin_height - heightMargin;
				finalH = finalH - marginHeightToAdd;
			}
		}

		//finalWidthMargin: margin with added 
		$(".vish_arrow").width(finalWidthMargin/2*0.9);

		//Viewbar
		if((_showViewbar)&&(!V.Status.getIsPreviewInsertMode())){
			$("#viewbar").height(viewbarHeight);
		}

		//resize slides
		var topSlides = $(".slides > article");
		var subSlides = $(".slides > article > article");
		var allSlides = $(".slides article");
		$(allSlides).css("height", finalH);
		$(allSlides).css("width", finalW);

		//margin-top and margin-left half of the height and width
		var marginTop = finalH/2 + viewbarHeight/2;
		var marginLeft = finalW/2;
		$(topSlides).css("margin-top", "-" + marginTop + "px");
		$(subSlides).css("margin-top", "-" + finalH/2 + "px");
		$(allSlides).css("margin-left", "-" + marginLeft + "px");
		
		var increase = finalH/600;
		var increaseW = finalW/800;

		_lastIncrease = increase;
		_lastIncreaseW = increaseW;

		//Paddings
		var paddingTopAndBottom = 3/100*finalW;	//3%
		var paddingLeftAndRight = 5/100*finalW;	//5%
		$(allSlides).css("padding-left",paddingLeftAndRight);
		$(allSlides).css("padding-right",paddingLeftAndRight); 
		$(allSlides).css("padding-top",	paddingTopAndBottom);
		$(allSlides).css("padding-bottom",paddingTopAndBottom);

		//Close button for subslides
		var _closeButtonDimension = 23;
		if(increase <= 1){
			_closeButtonDimension = _closeButtonDimension*getPonderatedIncrease(increase,0.7);
		} else {
			_closeButtonDimension = _closeButtonDimension*getPonderatedIncrease(increase,0.2);
		}
		$("div.close_subslide").css("width",_closeButtonDimension+"px");
		$("div.close_subslide").css("height",_closeButtonDimension+"px");

		//Viewbar resizing
		if(_showViewbar){
			//Page switchers
			$("#page-switcher-start").width($("#page-switcher-start").height());
			$("#page-switcher-end").width($("#page-switcher-end").height());

			//Fs button
			$("#page-fullscreen").width($("#page-fullscreen").height());

			if(V.Status.getIsPreviewInsertMode()){
				//Get the real viewbar height in insert mode
				viewbarHeight = $("#viewbar").height();
			}

			//Slide counter
			//Font size related to menubar
			var menubarIncreaseFactor = viewbarHeight/40;
			var slideCounterFontSize = 14*getPonderatedIncrease(menubarIncreaseFactor,0.5);
			$("#slide-counter-span, #slide-counter-input").css("font-size",slideCounterFontSize+"px");
			$("#slide-counter-input").width(24*getPonderatedIncrease(menubarIncreaseFactor,1));
			var slideCounterMarginTop = (viewbarHeight - $("#slide-counter-div").height())/2;
			$("#slide-counter-div").css("margin-top",slideCounterMarginTop+"px");

			//Watermark
			$("#embedWatermark").width($("#embedWatermark").height()*2.7);
		}

		decideIfPageSwitcher();

		updateFancyboxAfterSetupSize(increase,increaseW);

		//Texts callbacks
		V.Text.aftersetupSize(increase,increaseW);

		//Snapshot callbacks
		V.SnapshotPlayer.aftersetupSize(increase,increaseW);
		
		//Object callbacks
		V.ObjectPlayer.aftersetupSize(increase,increaseW);

		//Slidesets
		V.Slideset.afterSetupSize(increase,increaseW);

		//Quiz callbacks
		V.Quiz.aftersetupSize(increase,increaseW);

		//Recommendations callbacks
		V.Recommendations.aftersetupSize(increase,increaseW);
	};

	var _getDesiredVieweBarHeight = function(windowHeight){
		var minimumViewBarHeight = 26;
		var maxViewBarHeight = 40;
		var estimatedIncrease = windowHeight/600;
		var viewBarHeight = 40 * getPonderatedIncrease(estimatedIncrease,0.7);
		return Math.min(Math.max(viewBarHeight,minimumViewBarHeight),maxViewBarHeight);
	};

	/**
	 * Fancybox resizing. If a fancybox is opened, resize it
	 */
	var updateFancyboxAfterSetupSize = function(increase,increaseW){
		var fOverlay = $("#fancybox-overlay");
		if(($(fOverlay).length<1)||(!$(fOverlay).is(":visible"))){
			return;
		}

		increase = (typeof increase == "number") ? increase : V.ViewerAdapter.getLastIncrease()[0];

		var fwrap = $("#fancybox-wrap");
		var fcontent = $("#fancybox-content");
		var fccontentDivs = $("#" + $(fcontent).attr("id") + " > div");
		
		var currentSlide = $(".current");
		var paddingTop = $(currentSlide).cssNumber("padding-top");
		var paddingLeft = $(currentSlide).cssNumber("padding-left");
		var paddingRight = $(currentSlide).cssNumber("padding-right");
		var offset = $(currentSlide).offset();
		
		var _closeButtonDimension = 23;
		if(increase <= 1){
			_closeButtonDimension = _closeButtonDimension*getPonderatedIncrease(increase,0.7);
		} else {
			_closeButtonDimension = _closeButtonDimension*getPonderatedIncrease(increase,0.2);
		}
		var fcClose = $("#fancybox-close");
		$(fcClose).width(_closeButtonDimension + "px");
		$(fcClose).height(_closeButtonDimension + "px");
		$(fcClose).css("padding","10px");
		$(fcClose).css("padding-left","4px");
		
		$(fwrap).css("margin-top", "0px");
		$(fwrap).css("margin-left", "0px");
		$(fwrap).width($(currentSlide).width()+paddingLeft+paddingRight);
		$(fwrap).height($(currentSlide).height()+2*paddingTop);
		$(fwrap).css("top", offset.top + "px");  
		$(fwrap).css("left", offset.left + "px");

		$(fcontent).width("100%");
		$(fcontent).height("100%");
		$(fccontentDivs).width("100%");
		$(fccontentDivs).height("100%");
	};

	/*
	 * Show close button if is appropiate
	 */
	var decideIfCloseButton = function(){
		if(_closeButton){
			$("#closeButton").show();
		}
	};

	var getDimensionsForResizedButton = function(increase,originalWidth,aspectRatio){
		var originalWidth = originalWidth || 23;
		var aspectRatio = aspectRatio || 1;

		var _buttonWidth = originalWidth;
		if(increase <= 1){
			_buttonWidth = _buttonWidth*getPonderatedIncrease(increase,0.7);
		} else {
			_buttonWidth = _buttonWidth*getPonderatedIncrease(increase,0.2);
		}

		return {width: _buttonWidth, height: _buttonWidth/aspectRatio};
	}

	var getLastIncrease = function(){
		return [_lastIncrease,_lastIncreaseW];
	};

	var getPonderatedIncrease = function(increase,pFactor){
		var diff = (increase-1)*pFactor;
		return 1+diff;
	};
	
	return {
		init 							: init,
		updateInterface 				: updateInterface,
		decideIfPageSwitcher			: decideIfPageSwitcher,
		decideIfCloseButton				: decideIfCloseButton,
		updateFancyboxAfterSetupSize	: updateFancyboxAfterSetupSize,
		getDimensionsForResizedButton	: getDimensionsForResizedButton,
		getPonderatedIncrease 			: getPonderatedIncrease,
		getLastIncrease					: getLastIncrease
	};

}) (VISH, jQuery);