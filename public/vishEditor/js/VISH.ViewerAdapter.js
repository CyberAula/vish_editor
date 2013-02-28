VISH.ViewerAdapter = (function(V,$,undefined){

	var render_full;
	var is_preview;
	var close_button;
	var fs_button;
	var can_use_nativeFs;
	var embed;

	var display_recommendations;

	//Fullscreen fallbacks
	var enter_fs_button;
	var enter_fs_url;
	var exit_fs_button;
	var exit_fs_url;
	var isOneSlide;

	//Indicate if the render is currently in fullscreen
	var page_is_fullscreen;

	//Make init idempotent
	var initialized = false;

	//Prevent updateInterface with same params (Make Vish Viewer more efficient)
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
		if(options){
			//Decide if we must render the presentation in fullscreen mode
			if(typeof render_full !== "boolean"){
				render_full = ((options["full"]===true)&&(!V.Status.getIsInIframe()) || (options["forcefull"]===true));
			}
			if(typeof options["preview"] === "boolean"){
				is_preview = options["preview"];
			}
			if(typeof options["embed"] === "boolean"){
				embed = options["embed"];
			} else {
				embed = false;
			}

			close_button = (V.Status.getDevice().mobile)&&(!V.Status.getIsInIframe())&&((options["comeBackUrl"])||((V.Status.getDevice().features.history)&&(embed)));
			
			//Embed elements can use native fullscreen
			can_use_nativeFs = (V.Status.getDevice().features.fullscreen)&&(!embed);

			enter_fs_button = (typeof options["fullscreen"] !== "undefined")&&(!can_use_nativeFs);
			if(enter_fs_button){
				enter_fs_url = options["fullscreen"];
			}

			exit_fs_button = ((typeof options["exitFullscreen"] !== "undefined")||((V.Status.getDevice().features.history)&&(embed)))&&(!can_use_nativeFs);
			if(exit_fs_button){
				exit_fs_url = options["exitFullscreen"];
			}

			//Full screen buttons
			fs_button = ((can_use_nativeFs)&&(V.Status.getIsInIframe()))||((enter_fs_button)&&(exit_fs_button));
			//No fs for preview
			fs_button = fs_button && (!is_preview);

			//Force fs buttons disabling
			if(options["disablefullscreen"] === true){
				fs_button = false;
			}

			page_is_fullscreen = render_full && (!V.Status.getIsInIframe());

			//recommendations slide in the end
			if(typeof options["urlToGetRecommendations"] == "string"){
				display_recommendations = true;
			} else {
				display_recommendations = false;
			}

		} else {
			render_full = false;
			is_preview = false;
			close_button = false;
			enter_fs_button = false;
			exit_fs_button = false;
			fs_button = false;
			can_use_nativeFs = false;
			embed = false;
			display_recommendations = false;
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
			} else {
				close_button = false;
			}
		}


		isOneSlide = (!(V.Slides.getSlidesQuantity()>1));

		////////////////
		//Init interface
		///////////////

		//Init viewbar
		if(V.Status.getDevice().desktop){
			$("#back_arrow").html("");
			$("#forward_arrow").html("");
		}

		if(!isOneSlide){
			if(render_full){
				$("#viewbar").hide();
			} else {
				$("#viewbar").show();
			}
			V.SlideManager.updateSlideCounter();
		} else {
			$("#viewbar").hide();
		}

		if(is_preview){
			$("div#viewerpreview").show();
			V.Quiz.UnbindStartQuizEvents();
		}

		if((embed)&&(V.Status.getIsInIframe())){
			$("#embedWatermarkWrapper").show();
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
		if (V.Slides.getCurrentSubSlide()!==null){
			//Subslide active
			//$("#forward_arrow").hide();
			$("#back_arrow").hide();
		} else {
			//No subslide
			if(V.Slides.isCurrentFirstSlide()){
				$("#back_arrow").hide();
			} else {
				$("#back_arrow").show();
			} 
			if (V.Slides.isCurrentLastSlide()){
				$("#forward_arrow").hide();		
			} else {
				$("#forward_arrow").show();
			}
			//$("#forward_arrow").show();
		}

		// Pager
		if(!render_full){
			if(V.Slides.isCurrentFirstSlide()){
				$("#page-switcher-start").hide();			
			} else {
				$("#page-switcher-start").show();
			}
			if(V.Slides.isCurrentLastSlide()){
				$("#page-switcher-end").hide();
			} else {
				$("#page-switcher-end").show();
			}
			//$("#page-switcher-end").show();
		}
	};


	///////////
	// ViewBar
	///////////

	var _decideIfViewBarShow = function(fullScreen){
		if(!fullScreen){
			if(!isOneSlide){
				$("#viewbar").show();
			} else {
				$("#viewbar").hide();
			}
		} else {
			$("#viewbar").hide();
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
		var reserved_px_for_menubar; //we don´t show the menubar
		var margin_height;
		var margin_width;

		if(fullscreen){
			_onFullscreenEvent(true);
			reserved_px_for_menubar = 0; //we don´t show the menubar
			margin_height = 0;
			margin_width = 0;
		} else {
			_onFullscreenEvent(false);
			if(!isOneSlide){
				reserved_px_for_menubar = 40;
			} else {
				reserved_px_for_menubar = 0;
			}							
			margin_height = 40;
			margin_width = 30;
		}
		
		var height = _lastHeight - reserved_px_for_menubar; //the height to use is the window height - 40px that is the menubar height
		var width = _lastWidth;
		var finalW = 800;
		var finalH = 600;

		var aspectRatio = width/height;
		var slidesRatio = 4/3;
		if(aspectRatio > slidesRatio){
			finalH = height - margin_height;  //leave 40px free, 20 in the top and 20 in the bottom ideally
			finalW = finalH*slidesRatio;
		}	else {
			finalW = width - margin_width; //leave 110px free, at least, 55 left and 55 right ideally
			finalH = finalW/slidesRatio;
		}

		$(".slides > article").css("height", finalH);
		$(".slides > article").css("width", finalW);
		$(".subslide").css("height", finalH);
		$(".subslide").css("width", finalW);

		//margin-top and margin-left half of the height and width
		var marginTop = finalH/2 + reserved_px_for_menubar/2;
		var marginLeft = finalW/2;
		$(".slides > article").css("margin-top", "-" + marginTop + "px");
		$(".slides > article").css("margin-left", "-" + marginLeft + "px");
		
		$(".subslide").css("margin-top", "-" + finalH/2 + "px");
		$(".subslide").css("margin-left", "-" + marginLeft + "px");	
		
		var increase = finalH/600;
		var increaseW = finalW/800;
		
		//and now the arrows have to be increased or decreased
		$(".fc_poi img").css("width", 50*increase + "px");
		$(".fc_poi img").css("height", 50*increase + "px");
		
		//if fancybox is opened, resize it
		
		if ($('#fancybox-content:empty').length === 0){
			$('#fancybox-wrap').width($(".current").width()+100); //+100 because it is the padding
			$('#fancybox-wrap').height($(".current").height()+70);	//+70 because it is the padding
			$('#fancybox-wrap').css("top", $(".current").offset().top + "px");	
			$('#fancybox-wrap').css("left", $(".current").offset().left + "px");

			setTimeout(function () {
				$('#fancybox-wrap').height($(".current").height()+70);	//+70 because it is the padding
				$("#fancybox-content").width("100%");
				$("#fancybox-content").height("100%");
				$("#fancybox-content > div").width("100%");
				$("#fancybox-content > div").height("100%"); 
			}, 300);
			
		
			//TODO check if the excursion has quiz() (fullscreen --> remove QR FS Button)
			V.Quiz.testFullScreen();
		}
		

		decideIfPageSwitcher();

		//Texts callbacks
		V.Text.aftersetupSize(increase,increaseW);

		//Snapshot callbacks
		V.SnapshotPlayer.aftersetupSize(increase,increaseW);
		
		//Object callbacks
		V.ObjectPlayer.aftersetupSize(increase,increaseW);

		//Maps callbacks
		V.VirtualTour.aftersetupSize(increase,increaseW);
	};


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
			$(document).on('click', '#page-fullscreen', V.SlideManager.toggleFullScreen);
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
				$("#page-fullscreen").css("background-position", "-45px 0px");
				$("#page-fullscreen").hover(function(){
					$("#page-fullscreen").css("background-position", "-45px -40px");
				}, function() {
					$("#page-fullscreen").css("background-position", "-45px 0px");
				});
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
		$("#page-fullscreen").css("background-position", "-45px 0px");
		$("#page-fullscreen").hover(function(){
			$("#page-fullscreen").css("background-position", "-45px -40px");
		}, function() {
			$("#page-fullscreen").css("background-position", "-45px 0px");
		});
		_decideIfViewBarShow(true);
	}

	var _onLeaveFullScreen = function(){
		$("#page-fullscreen").css("background-position", "0px 0px");
		$("#page-fullscreen").hover(function(){
			$("#page-fullscreen").css("background-position", "0px -40px");
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
		decideIfCloseButton		: decideIfCloseButton
	};

}) (VISH, jQuery);
