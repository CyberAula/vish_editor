VISH.ViewerAdapter = (function(V,$,undefined){

	var render_full;
	var is_preview;
	var close_button;
	var fs_button;

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


	var init = function(options){
		if(initialized){
			return;
		} else {
			initialized = true;
		}

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

			fs_button = (((V.Status.getDevice().features.fullscreen)||((enter_fs_button)&&(exit_fs_button)))&&(!is_preview));

		} else {
			render_full = false;
			is_preview = false;
			close_button = false;
			enter_fs_button = false;
			exit_fs_button = false;
			fs_button = false;
		}

		//////////////
		//Restrictions
		/////////////

		//Mobile always in full
		render_full = (render_full || (V.Status.getDevice().mobile));

		//Enter and exit fullscreen buttons disable on mobiles
		enter_fs_button = (enter_fs_button && (!V.Status.getDevice().mobile));
		exit_fs_button = (exit_fs_button && (!V.Status.getDevice().mobile));

		//Close button just for mobiles (disable in tablets)
		close_button = (close_button && (V.Status.getDevice().mobile));

		// page_is_fullscreen = false;
		page_is_fullscreen = render_full;
		isOneSlide = (!(VISH.Slides.getSlidesQuantity()>1));


		////////////////
		//Init interface
		///////////////

		//Init viewbar
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

		if(is_preview){
			$("div#viewerpreview").show();
			V.Quiz.UnbindStartQuizEvents();
		}

		if(close_button){
			$("button#closeButton").show();
		}

		//Init fullscreen
		if(fs_button){
			_enableFullScreen(render_full);
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
	// Setup
	///////////

	var updateInterface = function(){
		_setupSize(page_is_fullscreen);
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
	var _enableFullScreen = function(fullscreen){
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
					_setupSize(!page_is_fullscreen);
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
					window.location = exit_fs_url;
				});
			} else if((!fullscreen)&&(enter_fs_button)){
				$(document).on('click', '#page-fullscreen', function(){
					VISH.Utils.sendParentToURL(enter_fs_url);
				});
			}
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
