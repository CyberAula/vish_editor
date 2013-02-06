VISH.ViewerAdapter = (function(V,$,undefined){

	var render_full;
	var is_preview;
	var close_button;
	var enter_fs_button;
	var enter_fs_url;
	var exit_fs_button;
	var exit_fs_url;
	var page_is_fullscreen;
	var isOneSlide;

	var init = function(options){
		//Init vars
		if(options){
			//Decide if we must render the presentation in fullscreen
			if(typeof render_full !== "boolean"){
				render_full = ((options["full"]===true)&&(!V.Status.getIsInIframe()) || (options["forcefull"]===true));
			}
			if(typeof options["preview"] === "boolean"){
				is_preview = true;
			}
			close_button = (!V.Status.getDevice().desktop)&&(!V.Status.getIsInIframe())&&(options["comeBackUrl"]);
			
			enter_fs_button = ((V.Status.getIsInIframe())&&(options["fullscreen"]));
			if(enter_fs_button){
				enter_fs_url = options["fullscreen"];
			}

			exit_fs_button = (typeof options["exitFullscreen"] !== "undefined");
			if(exit_fs_button){
				exit_fs_url = options["exitFullscreen"];
			}

		} else {
			render_full = false;
			is_preview = false;
			close_button = false;
			enter_fs_button = false;
			exit_fs_button = false;
		}

		//Restrictions

		//Mobile and tablet always in full
		render_full = (render_full || (V.Status.getDevice().mobile) || (V.Status.getDevice().tablet));

		//Enter and exit fullscreen buttons only for desktops
		enter_fs_button = (enter_fs_button && (V.Status.getDevice().desktop));
		exit_fs_button = (exit_fs_button && (V.Status.getDevice().desktop));

		page_is_fullscreen = false;
		isOneSlide = (!(VISH.Slides.getSlidesQuantity()>1));

		_initPager(render_full);
		updateInterface();
		V.Text.init();
	}

	///////////
	// Pager
	///////////

	var _initPager = function(render_full){
		if(V.Status.getDevice().desktop){
			$("#back_arrow").html("");
			$("#forward_arrow").html("");
		}

		if(render_full){
			$("#viewbar").hide();
		} else {
			if(!isOneSlide){
				$("#viewbar").show();
				VISH.SlideManager.updateSlideCounter();
			} else {
				$("#viewbar").hide();
			}
		}
	}

	/**
	 * Function to hide/show the page-switchers buttons
	 * hide the left one if on first slide
	 * hide the right one if on last slide
	 * show both otherwise
	 */
	var decideIfPageSwitcher = function(){

		// ViewBar
		if (VISH.Slides.getCurrentSubSlide()!==null){
			//Subslide active
			$("#forward_arrow").hide();
			$("#back_arrow").hide();
		} else {
			//No subslide
			if(VISH.Slides.isCurrentFirstSlide()){
				$("#back_arrow").hide();
			} else {
				$("#back_arrow").show();
			} 
			if (VISH.Slides.isCurrentLastSlide()){
				$("#forward_arrow").hide();		
			} else {
				$("#forward_arrow").show();
			}
		}

		// Pager
		if(!page_is_fullscreen){
			if(VISH.Slides.isCurrentFirstSlide()){
				$("#page-switcher-start").hide();			
			} else {
				$("#page-switcher-start").show();
			}
			if(VISH.Slides.isCurrentLastSlide()){
				$("#page-switcher-end").hide();
			} else {
				$("#page-switcher-end").show();
			}
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
	// Setup functions
	///////////

	var updateInterface = function(){
		if(is_preview){
			$("div#viewerpreview").show();
			V.Quiz.UnbindStartQuizEvents();
		}

		if(close_button){
			$("button#closeButton").show();
		}

		if(!render_full){
			//No fullscreen
			if (!is_preview) {
				_enableFullScreen();
			}	else {
			  	$("#page-fullscreen").hide();
			}
		} else {
			//Rendering in fullscreen
			if(exit_fs_button){
	 			//we are in "simulated" fullscreen ,showing the .full version and we need a close fullscreen
	 			$("#page-fullscreen").css("background-position", "-45px 0px");
				$("#page-fullscreen").hover(function(){
					$("#page-fullscreen").css("background-position", "-45px -40px");
				}, function() {
					$("#page-fullscreen").css("background-position", "-45px 0px");
				});
				$(document).on('click', '#page-fullscreen', function(){
					window.location = exit_fs_url;
    			});
			}else {
				$("#page-fullscreen").hide();
			}
		}
		setupSize(render_full);
	};


	/**
	 * Function to adapt the slides to the screen size, in case the editor is shown in another iframe
	 * param "fullscreen" indicates that the call comes from a fullscreen button
	 */
	var setupSize = function(fullscreen){
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
		
		var height = $(window).height() - reserved_px_for_menubar; //the height to use is the window height - 40px that is the menubar height
		var width = $(window).width();
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
		// var increaseW = finalW/800;
		
		//and now the arrows have to be increased or decreased
		$(".fc_poi img").css("width", 50*increase + "px");
		$(".fc_poi img").css("height", 50*increase + "px");
		
		//if fancybox is opened, resize it
		if ($('#fancy_content:empty').length === 0){	
			$('#fancybox-inner').width("80%");
			$('#fancybox-wrap').width("80%");

			$("#fancybox-content").width("80%");
			$("#fancybox-content > div").width("100%");
			$('#fancybox-inner').height("80%");
			$('#fancybox-wrap').height("80%");	

			$('#fancybox-wrap').css("top", "10%");	
			$('#fancybox-wrap').css("left", "10%");
			//TODO check if the excursion has quiz() (fullscreen --> remove QR FS Button)
			V.Quiz.testFullScreen();
		}

		decideIfPageSwitcher();

		//Texts callbacks
		VISH.Text.aftersetupSize(increase);

		//Snapshot callbacks
		VISH.SnapshotPlayer.aftersetupSize(increase);
		
		//Object callbacks
		VISH.ObjectPlayer.aftersetupSize(increase);
	};


	///////////
	// Fullscreen functions
	///////////

	/*
	 * This method enables the fullscreen button, it will change to fullscreen if that feature is present
	 * and if not it is a link to the .full version
	 */
	var _enableFullScreen = function(){
		if(V.Status.getDevice().features.fullscreen){
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
					setupSize(!page_is_fullscreen);
				}, 400);
			});
		} else if(enter_fs_button){
			$(document).on('click', '#page-fullscreen', function(){
				VISH.Utils.sendParentToURL(enter_fs_url);
    		});
		}
	}

	var _onFullscreenEvent = function(fullscreen){
		if(typeof fullscreen === "undefined"){
			fullscreen = page_is_fullscreen;
		}
		page_is_fullscreen = fullscreen;
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


	// /**
	// * Method to add the src to the iframe, show it, hide the slides, and so on
	// */
	// var setupGame = function(presentation){
	// 	$("#my_game_iframe").attr("src", presentation.game.src);
	// 	//load file game.css dinamically
	// 	var fileref=document.createElement("link");
 //  		fileref.setAttribute("rel", "stylesheet");
 //  		fileref.setAttribute("type", "text/css");
 //  		fileref.setAttribute("href", "stylesheets/game/game.css");
 //  		document.getElementsByTagName("body")[0].appendChild(fileref);
	// };

	
	return {
		init 					: init,
		decideIfPageSwitcher	: decideIfPageSwitcher,
		updateInterface 		: updateInterface
	};
}) (VISH, jQuery);
