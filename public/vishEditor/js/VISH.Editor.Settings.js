VISH.Editor.Settings = (function(V,$,undefined){

	var themeScrollbarDivId = "scrollbar_themes_list";
	var tagsLoaded = false;
	var themeScrollbarCreated = false;

	//Metadata
	var presentationThumbnail;


	var init = function(){
		_initSliders();
	};

	var _initSliders = function(){
		$("#slider-age").slider({
			range: true,
			min: 0,
			max: 30,
			values: [ V.Constant.AGE_RANGE_MIN, V.Constant.AGE_RANGE_MAX ],
			slide: function( event, ui ) {
				$( "#age_range" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
			}
		});
		$("#age_range").val(V.Constant.AGE_RANGE);

		var LOM_difficulty = new Array();
		LOM_difficulty[0] = "unspecified";
		LOM_difficulty[1] = "very easy";
		LOM_difficulty[2] = "easy";
		LOM_difficulty[3] = "medium";
		LOM_difficulty[4] = "difficult";
		LOM_difficulty[5] = "very difficult";

		$("#slider-difficulty").slider({
			min: 0,
			max: 5,
			value: [ V.Constant.DIFFICULTY ],
			slide: function( event, ui ) {
				$("#difficulty_range").attr("difficulty",ui.value);
				$("#difficulty_range").val(LOM_difficulty[ui.value]);
			}
		}); 
		$( "#difficulty_range" ).attr( "difficulty" , V.Constant.DIFFICULTY);
		$("#difficulty_range").val(LOM_difficulty[V.Constant.DIFFICULTY]);
	}

	var displaySettings = function(){
		// fancybox to edit presentation settings
		$("a#edit_presentation_details").fancybox({
			'autoDimensions' : false,
			'autoScale' : true,
			'scrolling': 'no',
			'width': 1000,
			'height': 700,
			'padding': 0,
			'hideOnOverlayClick': false,
			'hideOnContentClick': false,
			'showCloseButton': false,
			"onComplete"  : function(data) {
				$("#fancybox-wrap").css("margin-top", "20px");
				_onDisplaySettings();
			},
			"onClose" : function(data){
			}
		});

		$("a#edit_presentation_details").trigger('click');
	}

	var _onDisplaySettings = function(){
		var options = V.Utils.getOptions();
		var presentation = V.Editor.getPresentation();

		//Avatar
		if(presentation && presentation.avatar){
			_addThumbnail(presentation.avatar);
		}

		//Title
		if(presentation && presentation.title){
			var titleDOM = $("#presentation_details_preview_addtitle").find("span");
			$(titleDOM).html(presentation.title);
		}

		//Author
		var author;
		if(options && options.username){
			author = options.username;
		} else if(presentation && presentation.author){
			author = presentation.author;
		}
		if(author){
			var authorDOM = $("#author_span_in_preview");
			$(authorDOM).html(author);
		}

		//Description
		if(presentation && presentation.description){
			var descriptionDOM = $("#presentation_details_textarea");
			$(descriptionDOM).val(presentation.description);
		}

		//Tags
		if((V.Configuration.getConfiguration()["presentationTags"])&&(!tagsLoaded)){
			$("#tagBoxIntro").attr("HTMLcontent", $("#tagBoxIntro").html());
			V.Utils.Loader.startLoadingInContainer($("#tagBoxIntro"),{style: "loading_tags"});
			V.Editor.API.requestTags(_onInitialTagsReceived);
		}

		//Themes
		if(!themeScrollbarCreated){
			//Select Theme scrollbar
			V.Editor.Scrollbar.cleanScrollbar(themeScrollbarDivId);
			$("#" + themeScrollbarDivId).hide();

			//Generate thumbnail images
			var imagesArray = [];
			var imagesArrayTitles = [];

			for(var i=1; i<13; i++){
				var imgExt = "png";
				if(i==12){
					imgExt = "gif";
				}
				var srcURL = V.ImagesPath + "themes/theme" + i + "/select." + imgExt;
				imagesArray.push($("<img themeNumber='"+ i +"' class='image_barbutton' src='" + srcURL + "' />"));
				imagesArrayTitles.push(i);
			}

			var options = {};
			options.order = true;
			options.titleArray = imagesArrayTitles;
			options.callback = _onThemeImagesLoaded;
			V.Utils.Loader.loadImagesOnContainer(imagesArray,themeScrollbarDivId,options);
		}

		//TODO: Pedagogical metadata...
		//Sliders are initialized in the init() method.

		if(presentation && presentation.TLT){
			var durations = VISH.Editor.Utils.iso8601Parser.getDurationPerUnit(presentation.TLT);
			$("#tlt_hours").val(durations[4].toString());
			$("#tlt_minutes").val(durations[5].toString());
			$("#tlt_seconds").val(durations[6].toString());
		}
		onTLTchange();

		//Check for enable continue button
		_checkIfEnableContinueButton();
	}

	var _onThemeImagesLoaded = function(){
		//Add class to title elements and events
		$("#" + themeScrollbarDivId).find("img.image_barbutton").each(function(index,img){
			//Add class to title
			var imgContainer = $(img).parent();
			$(imgContainer).addClass("wrapper_barbutton");
			var p = $(imgContainer).find("p");
			$(p).addClass("ptext_barbutton");

			//Add events to imgs
			$(img).click(function(event){
				_onClickTheme(event);
			});
		});

		var options = new Array();
		options.scrollTop = true;
		options.callback = _afterCreateThemesScrollbar;

		//Create scrollbar
		$("#" + themeScrollbarDivId).show();
		V.Editor.Scrollbar.createScrollbar(themeScrollbarDivId, options);
	}

	var _onClickTheme = function(event){
		var themeNumber = $(event.target).attr("themeNumber");
		selectTheme(themeNumber);
	}

	var _afterCreateThemesScrollbar = function(){
		//Select default theme
		selectTheme(1);
		themeScrollbarCreated = true;
	}

	var selectTheme = function(themeNumber){
		$(".theme_selected_in_scrollbar").removeClass("theme_selected_in_scrollbar");
		var themeDOM = $("#scrollbar_themes_list img.image_barbutton[themenumber='"+themeNumber+"']").addClass("theme_selected_in_scrollbar");
	}

	var _onInitialTagsReceived = function(data){
		tagsLoaded = true;

		V.Utils.Loader.stopLoadingInContainer($("#tagBoxIntro"));
		$("#tagBoxIntro").html($("#tagBoxIntro").attr("HTMLcontent"));

		var tagList = $("#tagBoxIntro .tagList");
		var draftPresentation = V.Editor.getPresentation();

		if ($(tagList).children().length == 0){
			if(!draftPresentation){
				// //Insert the two first tags. //DEPRECATED
				// $.each(data, function(index, tag) {
				// 	if(index==2){
				// 		return false; //break the bucle
				// 	}
				// 	$(tagList).append("<li>" + tag + "</li>")
				// });
			} else {
				if(draftPresentation.tags){
					//Insert draftPresentation tags
					$.each(draftPresentation.tags, function(index, tag) {
						$(tagList).append("<li>" + tag + "</li>")
					});
				}
			}
			$(tagList).tagit({tagSource:data, sortable:true, maxLength:15, maxTags:6 , 
			watermarkAllowMessage: V.Editor.I18n.getTrans("i.AddTags"), watermarkDenyMessage: V.Editor.I18n.getTrans("i.limitReached")});
		}
	}

	var onChangeThumbnailClicked = function(){
		$("#editthumb").hide();
		$("#hidden_button_to_uploadThumbnail").trigger("click");
	}

	var onThumbnailSelected = function(thumbnail_url){
		V.Editor.Settings.displaySettings(); //Hide previous fancybox
		_addThumbnail(thumbnail_url);
		_checkIfEnableContinueButton();
	}

	var _addThumbnail = function(thumbnail_url){
		var thumbnail_wrapper = $("#presentation_details_preview_thumbnail");
		var thumbnail = $("#presentation_details_preview_thumbnail_img");
		$(thumbnail).removeClass("addThumbnailPlus");
		$(thumbnail).attr("src",thumbnail_url);
		$(thumbnail_wrapper).find("p.addthumbtitle").hide();
		presentationThumbnail = thumbnail_url;
	}

	var onKeyUpOnTitle = function(event){
		var input = $("#presentation_details_input_title");
		var span = $("#presentation_details_preview_addtitle").find("span");
		var title = $("#presentation_details_input_title").val();
		if(title.trim() != ""){
			$(span).html($("#presentation_details_input_title").val());
		} else {
			$(span).html("add a title");
		}
		_checkIfEnableContinueButton();
	}

	var onTLTchange = function(){
		var TLT = _getTLT();
		if(TLT===null){
			$("#tlt_current_value").val("invalid value");
		} else if(typeof TLT == "undefined"){
			$("#tlt_current_value").val("unspecified");
		} else if(typeof TLT == "string"){
			$("#tlt_current_value").val(TLT);
		}
	}

	var _checkIfEnableContinueButton = function(){
		var enable = _checkMandatoryFields();
		if(enable){
			$("#save_presentation_details").removeClass("buttonDisabledOnSettings");
			$("#save_presentation_details").removeAttr("disabled");
			$("#save_presentation_details").attr("disabledTitle",$("#save_presentation_details").attr("title"));
			$("#save_presentation_details").removeAttr("title");
		} else {
			if(!$("#save_presentation_details").attr("title")){
				$("#save_presentation_details").attr("title",$("#save_presentation_details").attr("disabledTitle"));
			}
			$("#save_presentation_details").addClass("buttonDisabledOnSettings");
			$("#save_presentation_details").attr("disabled","true");
		}
	}

	var _checkMandatoryFields = function(){
		//Check that mandatory params are filled appropiately.
		var title = $('#presentation_details_input_title').val();
		var thumbnailURL = presentationThumbnail;

		if((typeof title != "string")||(title.trim()=="")){
			return false;
		}
		if((typeof thumbnailURL != "string")||(thumbnailURL.trim()=="")){
			return false;
		}
		return true;
	}

	/**
	 * function called when the user clicks on the save button
	 * in the initial presentation details fancybox to save
	 * the data in order to be stored at the end in the JSON file   
	 */
	var onSavePresentationDetailsButtonClicked = function(event){
		event.preventDefault();

		//Check if is disabled
		if($(event.target).hasClass("buttonDisabledOnSettings")){
			return;
		}
		
		var draftPresentation = V.Editor.getPresentation();
		if(!draftPresentation){
			draftPresentation = {};
		}

		draftPresentation.title = $('#presentation_details_input_title').val();
		draftPresentation.description = $('#presentation_details_textarea').val();
		if(presentationThumbnail){
			draftPresentation.avatar = presentationThumbnail;
		}
		draftPresentation.author = $("#author_span_in_preview").html();
		draftPresentation.tags = V.Editor.Utils.convertToTagsArray($("#tagindex").tagit("tags"));

		draftPresentation.theme = $(".theme_selected_in_scrollbar").attr("themeNumber");

		//Pedagogical fields
		draftPresentation.language = $("#language_tag").val();
		draftPresentation.context = $("#context_tag").val();
		draftPresentation.age_range = $("#age_range").val();
		draftPresentation.difficulty = $("#difficulty_range").val();
		var TLT = _getTLT();
		if(typeof TLT == "string"){
			draftPresentation.tlt = TLT;
		}
		draftPresentation.subject = $("#subject_tag").val().toString();
		draftPresentation.educational_objectives = $("#educational_objectives_textarea").val();

		V.Debugging.log("draftPresentation");
		V.Debugging.log(draftPresentation);

		V.Editor.setPresentation(draftPresentation);

		$.fancybox.close();
	};

	// Return Typical Learning Time (TLT) compliant to LOM.
	// Return null if form values are incorrect (e.g. letters).
	// Return undefined when no TLT is specified. In other words, when value (i.e duration) is zero.
	// TLT must be in ISO8601:2000 format
	// e.g. PT1H30M5S means 1 hour, 30 minutes and 5 seconds
	var _getTLT = function(){
		var TLT = "PT";
		var hours = $("#tlt_hours").val();
		var minutes = $("#tlt_minutes").val();
		var seconds = $("#tlt_seconds").val();

		if(jQuery.isNumeric(hours)&&jQuery.isNumeric(minutes)&&jQuery.isNumeric(seconds)){
			hours = parseInt(hours);
			minutes = parseInt(minutes);
			seconds = parseInt(seconds);
			
			if((hours>=0)&&(hours<100)&&(minutes>=0)&&(minutes<60)&&(seconds>=0)&&(seconds<60)){
				if(hours*24*60+minutes*60+seconds>0){
					if(hours!=0){
						TLT = TLT + hours + "H";
					}
					if(minutes!=0){
						TLT = TLT + minutes + "M";
					}
					if(seconds!=0){
						TLT = TLT + seconds + "S";
					}
					return TLT;
				} else if((hours===0)&&(minutes===0)&&(seconds===0)){
					return undefined;
				}
			}
		}
		return null;
	}

	/**
	 * function called when the user clicks on the pedagogical options button
	 */
	 var onPedagogicalButtonClicked = function(event){
	 	event.preventDefault();
	 	$("#presentation_details_fields").slideUp();
	 	$("#pedagogical_options_fields").slideDown();
	 };

	 /**
	 * function called when the user clicks on the done button in the pedagogical options panel
	 */
	 var onDonePedagogicalButtonClicked = function(event){
	 	event.preventDefault();
	 	$("#pedagogical_options_fields").slideUp();
	 	$("#presentation_details_fields").slideDown();
	 };

	return {
		init									: init,
		displaySettings							: displaySettings,
		onChangeThumbnailClicked				: onChangeThumbnailClicked,
		onThumbnailSelected						: onThumbnailSelected,
		selectTheme								: selectTheme,
		onKeyUpOnTitle							: onKeyUpOnTitle,
		onTLTchange								: onTLTchange,
		onSavePresentationDetailsButtonClicked	: onSavePresentationDetailsButtonClicked,
		onPedagogicalButtonClicked   			: onPedagogicalButtonClicked,
		onDonePedagogicalButtonClicked 			: onDonePedagogicalButtonClicked
	};

}) (VISH, jQuery);