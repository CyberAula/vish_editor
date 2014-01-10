VISH.ViewerAdapter = (function(V,$,undefined){

	var render_full;
	var is_preview;
	var is_preview_insertMode;
	var close_button;
	var fs_button;
	var can_use_nativeFs;
	var embed;
	var scorm;
	var showViewbar;
	var isInExternalSite;
	var isInVishSite;

	//Fullscreen fallbacks
	var enter_fs_button;
	var enter_fs_url;
	var exit_fs_button;
	var exit_fs_url;

	//Indicate if the render is currently in fullscreen
	var page_is_fullscreen;

	//Make init idempotent
	var initialized = false;

	//Prevent updateInterface with same params (Make ViSH Viewer more efficient)
	var _lastWidth;
	var _lastHeight;


	var init = function(options){
		if(initialized){
			return;
		} else {
			_lastWidth = -1;
			_lastHeight = -1;
			initialized = true;
		}

		//Init vars
		embed = V.Status.getIsEmbed();
		showViewbar = _defaultViewbar();

		//SCORM package
		scorm = V.Status.getIsScorm();

		//External or internal site
		isInExternalSite = V.Status.getIsInExternalSite();
		isInVishSite = V.Status.getIsInVishSite();

		if(options){
			//Decide if we must render the presentation in fullscreen mode
			if(typeof render_full != "boolean"){
				render_full = ((options["full"]===true)&&(!V.Status.getIsInIframe()) || (options["forcefull"]===true));
			}
			if(typeof options["preview"] == "boolean"){
				is_preview = options["preview"];
			}

			//Close button
			close_button = (V.Status.getDevice().mobile)&&(!V.Status.getIsInIframe())&&(options["comeBackUrl"]);
			
			//Full screen buttons
			can_use_nativeFs = (V.Status.getDevice().features.fullscreen);

			enter_fs_button = (typeof options["fullscreen"] !== "undefined")&&(!can_use_nativeFs);
			if(enter_fs_button){
				enter_fs_url = options["fullscreen"];
			}

			exit_fs_button = (typeof options["exitFullscreen"] !== "undefined")&&(!can_use_nativeFs);
			if(exit_fs_button){
				exit_fs_url = options["exitFullscreen"];
			}

			//Decide if show full screen buttons
			fs_button = ((can_use_nativeFs)&&(V.Status.getIsInIframe()))||((enter_fs_button)&&(exit_fs_button));
			//No fs for preview
			fs_button = fs_button && (!is_preview);
			//No fs for embed
			fs_button = fs_button && (!embed);

			page_is_fullscreen = render_full && (!V.Status.getIsInIframe());
			
		} else {
			render_full = false;
			is_preview = false;
			close_button = false;
			enter_fs_button = false;
			exit_fs_button = false;
			fs_button = false;
			can_use_nativeFs = false;
		}

		is_preview_insertMode = false;
		if(is_preview){
			var presentation = V.Viewer.getCurrentPresentation();
			if(presentation.insertMode===true){
				is_preview_insertMode = true;
			}
		}

		//////////////
		//Restrictions
		/////////////

		//Mobiles
		if(V.Status.getDevice().mobile){
			//Mobile always in full
			render_full = true;
			page_is_fullscreen = render_full && (!V.Status.getIsInIframe());

			if(page_is_fullscreen){
				fs_button = false;
				showViewbar = false;
			} else {
				close_button = false;
			}
		}


		////////////////
		//Init interface
		///////////////

		//Init viewbar
		if(V.Status.getDevice().desktop){
			$("#back_arrow").html("");
			$("#forward_arrow").html("");
		}

		if(showViewbar){
			V.Viewer.updateSlideCounter();
			$("#viewbar").show();
		} else {
			$("#viewbar").hide();
		}

		if(is_preview){
			$("div#viewerpreview").show();
		}

		if(is_preview_insertMode){
			//Enable images
			$("#SelectedSlidesToAdd").attr("src",V.ImagesPath + "templatesthumbs/addt.png");
			$("#tutorialSelectAllImage").attr("src",V.ImagesPath + "tutorial/selectall.png");
			$("tutorialUnselectAllImage").attr("src",V.ImagesPath + "tutorial/unselectall.png");
			$("tutorialSelectSlidesImage").attr("src",V.ImagesPath + "tutorial/selectslides.png");

			$("#selectSlidesBar").show();
			$("#viewbar").css("bottom",$("#selectSlidesBar").height()+"px");
			$("#viewbar").css("border-bottom","none");
			V.SlidesSelector.init();
		}

		//Watermark
		if(isInExternalSite){
			if((options)&&(typeof options.watermarkURL == "string")){
				$("#embedWatermark").parent().attr("href",options.watermarkURL);
				$("#embedWatermark").show();
			}
		}

		//Recommendations
		if(isInVishSite || V.Configuration.getConfiguration()["mode"]===V.Constant.NOSERVER){
			$(".rec-first-row").show();
		} else {
			$(".rec-first-row").hide();
		}

		if(close_button){
			$("button#closeButton").show();
		}

		//Init fullscreen
		if(fs_button){
			_enableFullScreen(page_is_fullscreen);
			$("#page-fullscreen").show();
		} else {
			$("#page-fullscreen").hide();
		}

		//Update interface and init texts
		updateInterface();
		V.Text.init();
	}

	///////////////
	// PAGER
	//////////////

	/**
	 * Function to hide/show the page-switchers buttons
	 * hide the left one if on first slide
	 * hide the right one if on last slide -> always show it, it will show the recommendations if on last slide
	 * show both otherwise
	 */
	var decideIfPageSwitcher = function(){

		// ViewBar
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

		// Pager
		if(V.Slides.isCurrentFirstSlide()){
			$("#page-switcher-start").addClass("disabledarrow");			
		} else {
			$("#page-switcher-start").removeClass("disabledarrow");
		}
		//Always show, if you are in the last you can see the recommendations
		$("#page-switcher-end").show(); 
	};


	///////////
	// ViewBar
	///////////

	var _decideIfViewBarShow = function(fullScreen){
		if(showViewbar){
			$("#viewbar").show();
		} else {
			$("#viewbar").hide();
		}
	}

	var _defaultViewbar = function(){
		var presentationType = V.Viewer.getPresentationType();
		var slidesQuantity = V.Slides.getSlidesQuantity();
		if((presentationType===V.Constant.QUIZ_SIMPLE)&&(slidesQuantity===1)){
			return false;
		} else {
			return true;
		}
	}

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
		_setupSize(render_full);
	};


	/**
	 * Function to adapt the slides to the screen size, in case the editor is shown in another iframe
	 * param "fullscreen" indicates that the call comes from a fullscreen button
	 */
	var _setupSize = function(fullscreen){
		var reserved_px_for_menubar = _getDesiredVieweBarHeight(_lastHeight);
		var min_margin_height = 25;
		var min_margin_width = 60;

		if(!showViewbar){
			//Cases without viewbar (quiz_simple , etc)
			reserved_px_for_menubar = 0;
			min_margin_height = 0;
			min_margin_width = 0;
		} else if(is_preview_insertMode){
			//Preview with insert images
			reserved_px_for_menubar = 120; //Constant because is displayed from ViSH Editor
		}

		if(fullscreen){
			_onFullscreenEvent(true);
		} else {
			_onFullscreenEvent(false);
		}
		
		var height = _lastHeight - reserved_px_for_menubar; //the height to use is the window height - menubar height
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
		if(!is_preview_insertMode){
			$("#viewbar").height(reserved_px_for_menubar);
		}

		//resize slides
		var topSlides = $(".slides > article");
		var subSlides = $(".slides > article > article");
		var allSlides = $(".slides article");
		$(allSlides).css("height", finalH);
		$(allSlides).css("width", finalW);

		//margin-top and margin-left half of the height and width
		var marginTop = finalH/2 + reserved_px_for_menubar/2;
		var marginLeft = finalW/2;
		$(topSlides).css("margin-top", "-" + marginTop + "px");
		$(subSlides).css("margin-top", "-" + finalH/2 + "px");
		$(allSlides).css("margin-left", "-" + marginLeft + "px");
		
		var increase = finalH/600;
		var increaseW = finalW/800;
		
		//Paddings
		var paddingTopAndBottom = 3/100*finalW;	//3%
		var paddingLeftAndRight = 5/100*finalW;	//5%
		$(allSlides).css("padding-left",paddingLeftAndRight);
		$(allSlides).css("padding-right",paddingLeftAndRight); 
		$(allSlides).css("padding-top",	paddingTopAndBottom);
		$(allSlides).css("padding-bottom",paddingTopAndBottom);

		//and now the arrows have to be increased or decreased
		$(".fc_poi img").css("width", 50*increase + "px");
		$(".fc_poi img").css("height", 50*increase + "px");

		decideIfPageSwitcher();

		updateFancyboxAfterSetupSize();

		//Texts callbacks
		V.Text.aftersetupSize(increase,increaseW);

		//Snapshot callbacks
		V.SnapshotPlayer.aftersetupSize(increase,increaseW);
		
		//Object callbacks
		V.ObjectPlayer.aftersetupSize(increase,increaseW);

		//Maps callbacks
		V.VirtualTour.aftersetupSize(increase,increaseW);

		//Quiz callbacks
		V.Quiz.aftersetupSize(increase,increaseW);
	};

	var _getDesiredVieweBarHeight = function(windowHeight){
		var minimumViewBarHeight = 20;
		var maxViewBarHeight = 40;
		var viewBarHeight = 40;
		//TODO: Make Viewbar responsive
		return Math.min(Math.max(viewBarHeight,minimumViewBarHeight),maxViewBarHeight);
	}

	/**
	 * Fancybox resizing. If a fancybox is opened, resize it
	 */
	var updateFancyboxAfterSetupSize = function(){
		var fOverlay = $("#fancybox-overlay");
		if(($(fOverlay).length<1)||(!$(fOverlay).is(":visible"))){
			return;
		}

		var fwrap = $("#fancybox-wrap");
		var fcontent = $("#fancybox-content");
		var fccontentDivs = $("#" + $(fcontent).attr("id") + " > div");
		
		var currentSlide = $(".current");
		var paddingTop = $(currentSlide).cssNumber("padding-top");
		var paddingLeft = $(currentSlide).cssNumber("padding-left");
		var offset = $(currentSlide).offset();
		
		var fcClose = $("#fancybox-close");
		$(fcClose).height("22px");
		$(fcClose).css("padding","10px");
		$(fcClose).css("padding-left","4px");
		
		$(fwrap).css("margin-top", "0px");
		$(fwrap).width($(currentSlide).width()+paddingLeft);
		$(fwrap).height($(currentSlide).height()+2*paddingTop);
		$(fwrap).css("top", offset.top + "px");  
		$(fwrap).css("left", offset.left + "px");

		$(fcontent).width("100%");
		$(fcontent).height("100%");
		$(fccontentDivs).width("100%");
		$(fccontentDivs).height("100%");
	}


	///////////
	// Fullscreen functions
	///////////

	/*
	 * This method enables the fullscreen button, it will change to fullscreen if that feature is present
	 * and if not it is a link to the .full version
	 */
	var _enableFullScreen = function(fullscreen){
		if(can_use_nativeFs){
			//if we have fullscreen feature, use it

			if(V.Status.getIsInIframe()){
				var myDoc = parent.document;
			} else {
				var myDoc = document;
			}
			$(document).on('click', '#page-fullscreen', V.Viewer.toggleFullScreen);
			$(myDoc).on("webkitfullscreenchange mozfullscreenchange fullscreenchange",function(event){
				//Done with a timeout because it did not work well in ubuntu
				setTimeout(function(){
					page_is_fullscreen = !page_is_fullscreen;
					render_full = page_is_fullscreen;
					_setupSize(page_is_fullscreen);
				}, 400);
			});
		} else {
			if((fullscreen)&&(exit_fs_button)){
				//we are in "simulated" fullscreen ,showing the .full version and we need a close fullscreen
				$("#page-fullscreen").css("background-image", 'url("'+V.ImagesPath+'vicons/fullscreen.png")');
				$("#page-fullscreen").css("background-position", "0px 0px");

				$(document).on('click', '#page-fullscreen', function(){
					//Try fallback first
					if((exit_fs_url)&&(!embed)){
							window.location = exit_fs_url;
					} else if(V.Status.getDevice().features.history){
						//Use feature history if its allowed
						history.back();
					}
				});
			} else if((!fullscreen)&&(enter_fs_button)){
				$(document).on('click', '#page-fullscreen', function(){
					if(typeof window.parent.location.href !== "undefined"){
						V.Utils.sendParentToURL(enter_fs_url+"?orgUrl="+window.parent.location.href);
					} else {
						//In embed mode, we dont have access to window.parent properties (like window.parent.location)
						V.Utils.sendParentToURL(enter_fs_url+"?embed=true");
					}
				});
			}
		}
	}

	var _onFullscreenEvent = function(fullscreen){
		if(typeof fullscreen === "undefined"){
			fullscreen = page_is_fullscreen;
		}
		if(fullscreen){
			_onEnterFullScreen();
		} else {
			_onLeaveFullScreen();
		}
	};

	var _onEnterFullScreen = function(){
		$("#page-fullscreen").css("background-image", 'url("'+V.ImagesPath+'vicons/fullscreenback.png")');
		$("#page-fullscreen").css("background-position", "0px 0px");
		$("#page-fullscreen").hover(function(){
			$("#page-fullscreen").css("background-position", "-30px -40px");
		}, function() {
			$("#page-fullscreen").css("background-position", "0px 0px");
		});
		_decideIfViewBarShow(true);
	}

	var _onLeaveFullScreen = function(){
		$("#page-fullscreen").css("background-image", 'url("'+V.ImagesPath+'vicons/fullscreen.png")');
		$("#page-fullscreen").css("background-position", "0px 0px");
		$("#page-fullscreen").hover(function(){
			$("#page-fullscreen").css("background-position", "-40px -40px");
		}, function() {
			$("#page-fullscreen").css("background-position", "0px 0px");
		});
		_decideIfViewBarShow(false);
	}

	var isFullScreen = function(){
		return page_is_fullscreen;
	}

	/*
	 * Show close button if is appropiate
	 */
	var decideIfCloseButton = function(){
		if(close_button){
			$("#closeButton").show();
		}
	}
	
	return {
		init 					: init,
		updateInterface 		: updateInterface,
		isFullScreen 			: isFullScreen,
		decideIfPageSwitcher	: decideIfPageSwitcher,
		decideIfCloseButton		: decideIfCloseButton,
		updateFancyboxAfterSetupSize	: updateFancyboxAfterSetupSize
	};

}) (VISH, jQuery);
