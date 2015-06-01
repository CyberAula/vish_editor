VISH.Editor.Settings = (function(V,$,undefined){

	var themeScrollbarDivId = "scrollbar_themes_list";
	var tagsLoaded = false;
	var themeScrollbarCreated = false;

	//Timers
	var t1;

	//LOM
	var LOM_Difficulty;

	//Metadata
	var presentationThumbnail;
	var _contributors;


	var init = function(){
		LOM_Difficulty = V.Editor.Utils.LOM.getDifficulty();
		_initSliders();
	};

	var _initSliders = function(){
		$("#slider-age").slider({
			range: true,
			min: 0,
			max: 30,
			values: [ V.Constant.AGE_RANGE_MIN, V.Constant.AGE_RANGE_MAX ],
			slide: function( event, ui ) {
				_changeAgeRangeDisplayedValue(ui.values[0] + " - " + ui.values[1]);
			}
		});
		_changeAgeRangeDisplayedValue(V.Constant.AGE_RANGE);

		$("#slider-difficulty").slider({
			min: 0,
			max: 5,
			value: [ V.Constant.DIFFICULTY ],
			slide: function( event, ui ) {
				$("#difficulty_range").attr("difficulty",ui.value);
				$("#difficulty_range").val(LOM_Difficulty[ui.value].text);
			}
		}); 
		$( "#difficulty_range" ).attr( "difficulty" , V.Constant.DIFFICULTY);
		$("#difficulty_range").val(LOM_Difficulty[V.Constant.DIFFICULTY].text);

		//Tags
		if(!tagsLoaded){
			$("#tagBoxIntro").attr("HTMLcontent", $("#tagBoxIntro").html());
			V.Utils.Loader.startLoadingInContainer($("#tagBoxIntro"),{style: "loading_tags"});
			V.Editor.API.requestTags(_onInitialTagsReceived,_onInitialTagsReceived);
		}
	};

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
			"onComplete"  : function(data){
				$("#fancybox-wrap").css("margin-top", "20px");
				_onDisplaySettings();
			},
			"onClosed" : function(data){
				//Update theme if it has change
				var selectedThemeNumber = $(".theme_selected_in_scrollbar").attr("themeNumber");
				var currentThemeNumber = V.Editor.Themes.getCurrentTheme().number;
				if((typeof selectedThemeNumber == "string")&&(selectedThemeNumber!=currentThemeNumber)){
					V.Editor.Themes.selectTheme("theme"+selectedThemeNumber);
				};
			}
		});

		$("a#edit_presentation_details").trigger('click');
	};

	var _onDisplaySettings = function(){
		var options = V.Utils.getOptions();

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
			t1 = Date.now();
			V.Utils.Loader.loadImagesOnContainer(imagesArray,themeScrollbarDivId,options);
		} else {
			//Select and move to current theme
			selectTheme(V.Editor.Themes.getCurrentTheme().number);
			V.Editor.Scrollbar.goToElement(themeScrollbarDivId,$("img.theme_selected_in_scrollbar"));
		}

		//Sliders are initialized in the init() method.
		onTLTchange();

		//Check for enable continue button
		_checkIfEnableContinueButton();
	};

	var loadPresentationSettings = function(presentation){
		//Prevent to check presentation var in all cases
		if(!presentation){
			presentation = {};
		}

		//Avatar
		if(presentation.avatar){
			_addThumbnail(presentation.avatar);
		}

		//Title
		if(presentation.title){
			$("#presentation_details_preview_addtitle_input").val(presentation.title); //preview input
			$("#presentation_details_input_title").val(presentation.title); //data input
		}

		//Author
		var author = _getAuthor(presentation);
		if(author){
			var authorName = author.name;
			if(typeof authorName == "string"){
				var authorDOM = $("#author_span_in_preview");
				$(authorDOM).html(authorName);
			}
		}

		//Contributors
		if(typeof presentation.contributors == "object"){
			_contributors = presentation.contributors;
		} else {
			_contributors = [];
		}

		//Description
		if(presentation.description){
			var descriptionDOM = $("#presentation_details_textarea");
			$(descriptionDOM).val(presentation.description);
		}

		//Tags: intialized on _onInitialTagsReceived method.

		//License
		if((typeof presentation.license == "object")&&(typeof presentation.license.key == "string")){
			$("#presentation_details_license_select").val(presentation.license.key);
		}

		//Themes
		selectTheme(V.Editor.Themes.getCurrentTheme().number);

		//Pedagogical
		
		if(presentation.language){
			$("#language_tag").val(presentation.language);
		}
		if(presentation.context){
			$("#context_tag").val(presentation.context);
		}
		
		if(presentation.age_range){
			var start_range = presentation.age_range.substring(0, presentation.age_range.indexOf("-")-1);
			var end_range = presentation.age_range.substring(presentation.age_range.indexOf("-")+2);
			$("#slider-age" ).slider( "values", [start_range, end_range] );
			_changeAgeRangeDisplayedValue(presentation.age_range);
		} else {
			_changeAgeRangeDisplayedValue(V.Constant.AGE_RANGE);
		}

		if(presentation.difficulty){
			var difficultyIndexValue = 0;
			for(var j=0; j<LOM_Difficulty.length; j++){
				if(LOM_Difficulty[j].value===presentation.difficulty){
					difficultyIndexValue = j;
				}
			}
			$("#difficulty_range").val(LOM_Difficulty[difficultyIndexValue].text);
			$("#difficulty_range").attr("difficulty",difficultyIndexValue);
			$("#slider-difficulty" ).slider("value",difficultyIndexValue);
		}

		if(presentation.TLT){
			var durations = V.Utils.iso8601Parser.getDurationFromISOPerUnit(presentation.TLT);
			$("#tlt_hours").val(durations[4].toString());
			$("#tlt_minutes").val(durations[5].toString());
			$("#tlt_seconds").val(durations[6].toString());
		}

		if(presentation.subject){
			$("#subject_tag").val(presentation.subject);
		}
		
		if(presentation.educational_objectives){
			$("#educational_objectives_textarea").val(presentation.educational_objectives);
		}		
	};

	var _onThemeImagesLoaded = function(){

		var diff = Date.now()-t1;
		if(diff<1500){
			setTimeout(function(){
				_onThemeImagesLoaded();
			},1500-diff);
			return;
		}

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
	};

	var _onClickTheme = function(event){
		var themeNumber = $(event.target).attr("themeNumber");
		selectTheme(themeNumber);
	};

	var _afterCreateThemesScrollbar = function(){
		selectTheme(V.Editor.Themes.getCurrentTheme().number);
		V.Editor.Scrollbar.goToElement(themeScrollbarDivId,$("img.theme_selected_in_scrollbar"));
		themeScrollbarCreated = true;
	};

	var selectTheme = function(themeNumber){
		$(".theme_selected_in_scrollbar").removeClass("theme_selected_in_scrollbar");
		$("#scrollbar_themes_list img.image_barbutton[themenumber='"+themeNumber+"']").addClass("theme_selected_in_scrollbar");
		$(".theme_selected_in_fancybox").removeClass("theme_selected_in_fancybox");
		$("#theme_fancybox div#select_theme"+themeNumber+" img").addClass("theme_selected_in_fancybox");
	};

	var selectAnimation = function(animationNumber){
		$(".animation_selected_in_fancybox").removeClass("animation_selected_in_fancybox");
		$("#animation_fancybox div#select_animation"+animationNumber).addClass("animation_selected_in_fancybox");
	};

	var _onInitialTagsReceived = function(data){
		if(typeof data != "object"){
			data = [];
		}
		tagsLoaded = true;

		V.Utils.Loader.stopLoadingInContainer($("#tagBoxIntro"));
		$("#tagBoxIntro").html($("#tagBoxIntro").attr("HTMLcontent"));

		var tagList = $("#tagBoxIntro .tagList");

		if ($(tagList).children().length == 0){
			var options = V.Utils.getOptions();
			if((options)&&(options["extra_tags"] instanceof Array)){
				$(options["extra_tags"]).each(function(index,tag){
					$(tagList).append("<li>" + tag + "</li>");
				});
			}

			var draftPresentation = V.Editor.getDraftPresentation();
			if(draftPresentation && draftPresentation.tags){
				//Insert draftPresentation tags
				$.each(draftPresentation.tags, function(index,tag){
					$(tagList).append("<li>" + tag + "</li>");
				});
			}

			var config = V.Configuration.getConfiguration();
			$(tagList).tagit({tagSource:data, sortable:true, maxLength:config.tagsSettings.maxLength, maxTags:config.tagsSettings.maxTags, triggerKeys:config.tagsSettings.triggerKeys, 
			watermarkAllowMessage: V.I18n.getTrans("i.AddTags"), watermarkDenyMessage: V.I18n.getTrans("i.limitReached")});
		}
	};

	var onChangeThumbnailClicked = function(){
		$("#editthumb").hide();
		$("#hidden_button_to_uploadThumbnail").trigger("click");
	};

	var onThumbnailSelected = function(thumbnail_url){
		V.Editor.Settings.displaySettings(); //Hide previous fancybox
		_addThumbnail(thumbnail_url);
		_checkIfEnableContinueButton();
	};

	var _addThumbnail = function(thumbnail_url){
		var thumbnail_wrapper = $("#presentation_details_preview_thumbnail");
		var thumbnail = $("#presentation_details_preview_thumbnail_img");
		$(thumbnail).removeClass("addThumbnailPlus");
		$(thumbnail).attr("src",thumbnail_url);
		$(thumbnail_wrapper).find("p.addthumbtitle").hide();
		presentationThumbnail = thumbnail_url;
	};

	var onKeyUpOnTitle = function(event){
		var inputData = $("#presentation_details_input_title");
		var inputPreview = $("#presentation_details_preview_addtitle_input");

		var title = $(inputData).val();
		if(title.trim() != ""){
			$(inputPreview).val(title);
		} else {
			$(inputPreview).val("");
		}
		_checkIfEnableContinueButton();

		if(event.keyCode===13){
			//Enter key
			$(inputData).blur();
		}
	};

	var onKeyUpOnPreviewTitle = function(event){
		var inputData = $("#presentation_details_input_title");
		var inputPreview = $("#presentation_details_preview_addtitle_input");

		var title = $(inputPreview).val();
		if(title.trim() != ""){
			$(inputData).val(title);
		} else {
			$(inputData).val("");
		}
		_checkIfEnableContinueButton();

		if(event.keyCode===13){
			//Enter key
			$(inputPreview).blur();
		}
	};

	var _changeAgeRangeDisplayedValue = function(ageRange){
		if(ageRange==="0 - 0"){
			ageRange = V.I18n.getTrans("i.unspecified");
		}
		$("#age_range").val(ageRange);
	};

	var onTLTchange = function(event){
		if((event)&&(event.keyCode===13)){
			$(event.target).blur();
			return;
		}

		var TLT = _getTLT();
		if(TLT===null){
			$("#tlt_current_value").val(V.I18n.getTrans("i.invalidvalue"));
		} else if(typeof TLT == "undefined"){
			$("#tlt_current_value").val(V.I18n.getTrans("i.unspecified"));
		} else if(typeof TLT == "string"){
			$("#tlt_current_value").val(TLT);
		}
	};

	var _checkIfEnableContinueButton = function(){
		var enable = checkMandatoryFields();
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
	};

	var checkMandatoryFields = function(){
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
	};

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

		$.fancybox.close();
	};

	var saveSettings = function(){
		var settings = {};

		settings.VEVersion = V.VERSION;
		settings.type = V.Constant.PRESENTATION;

		var draftPresentation = V.Editor.getDraftPresentation()

		var title = $('#presentation_details_input_title').val();
		if((typeof title == "string")&&(title.trim()!="")){
			settings.title = title;
		}

		var description = $('#presentation_details_textarea').val();
		if((typeof description == "string")&&(description.trim()!="")){
			settings.description = description;
		}
		
		if(presentationThumbnail){
			settings.avatar = presentationThumbnail;
		}

		//Author
		var author = _getAuthor(draftPresentation);
		var authorName = $("#author_span_in_preview").html();
		if((typeof authorName == "string")&&(authorName.trim()!="")){
			author.name = authorName;
		} else if(typeof author == "object"){
			delete author["name"];
		}
		settings.author = author;

		//Contributors
		if((typeof _contributors == "object")&&(_contributors.length > 0)){
			settings.contributors = _contributors;
		}
		
		var tags = getTags();
		if((tags)&&(tags.length > 0)){
			settings.tags = tags;
		}

		//License
		var licenseName = $("#presentation_details_license_select").find(":selected").text();
		var licenseKey = $("#presentation_details_license_select").val();
		if((typeof licenseName == "string")&&(licenseKey)){
			settings.license = {name: licenseName, key: licenseKey};
		}
		
		var themeNumber = V.Editor.Themes.getCurrentTheme().number;
		if(typeof  themeNumber == "string"){
			settings.theme = "theme" + themeNumber;
		} else {
			settings.theme = V.Constant.Themes.Default;
		}

		var animationSelection = V.Editor.Animations.getCurrentAnimation().filename;
		if(typeof  animationSelection == "string"){
			settings.animation = animationSelection;
		} else {
			settings.animation = V.Constant.Animations.Default;
		}

		//Pedagogical fields
		var language = $("#language_tag").val();
		if(typeof language == "string"){
			settings.language = language;
		}
		
		var context = $("#context_tag").val();
		if((typeof context == "string")&&(context!="unspecified")){
			settings.context = context;
		}

		var age_range = $("#age_range").val();
		if((typeof age_range == "string")&&(age_range != V.I18n.getTrans("i.unspecified"))){
			settings.age_range = age_range;
		}
		
		var difficultyIndexValue = $("#difficulty_range").attr("difficulty");
		var difficultyValue = LOM_Difficulty[difficultyIndexValue];
		if(typeof difficultyValue == "object"){
			var difficulty = difficultyValue.value;
			if((typeof difficulty == "string")&&(difficulty!="unspecified")){
				settings.difficulty = difficulty;
			}
		}
		
		var TLT = _getTLT();
		if(typeof TLT == "string"){
			settings.TLT = TLT;
		}

		var subjectsToSave = [];
		var subjects = $("#subject_tag").val();
		var sL = subjects.length;
		if((typeof sL == "number")&&(sL>0)){
			for(var sI=0; sI<sL; sI++){
				var subject = subjects[sI];
				if(subject!="Unspecified"){
					subjectsToSave.push(subject);
				}
			}
			if(subjectsToSave.length>0){
				settings.subject = subjectsToSave;
			}
		}
		
		var educational_objectives = $("#educational_objectives_textarea").val();
		if((typeof educational_objectives == "string")&&(educational_objectives.trim()!="")){
			settings.educational_objectives = educational_objectives;
		}

		return settings;
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
	};

	var getTags = function(){
		var tagIndex = $("#tagindex");
		if((tagIndex.length>0)&&($(tagIndex).hasClass("tagit"))){
			return V.Editor.Utils.convertToTagsArray($(tagIndex).tagit("tags"));
		} else {
			var draftPresentation = V.Editor.getDraftPresentation();
			if(typeof draftPresentation == "object"){
				return draftPresentation.tags;
			}
		}
	};

	var _getAuthor = function(presentation){
		var author;
		if((presentation)&&(typeof presentation.author == "object")){
			author = presentation.author;
		} else {
			author = {};
		}

		if(V.User.isUser()){
			//Override some params
			var user = V.User.getUser();
			if(V.User.getName()){
				author.name = V.User.getName();
			}
			author.vishMetadata = {};
			if(V.User.getId()){
				author.vishMetadata.id = V.User.getId();
			}
		}

		return author;
	};

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


	 /*
	  * Contributors Management
	  */

	 var addContributor = function(contributor){
	 	if((typeof contributor == "object")&&(typeof contributor.name == "string")){
	 		_contributors.push(contributor);
	 	}
	 };


	return {
		init									: init,
		displaySettings							: displaySettings,
		loadPresentationSettings				: loadPresentationSettings,
		onChangeThumbnailClicked				: onChangeThumbnailClicked,
		onThumbnailSelected						: onThumbnailSelected,
		selectTheme								: selectTheme,
		onKeyUpOnTitle							: onKeyUpOnTitle,
		onKeyUpOnPreviewTitle					: onKeyUpOnPreviewTitle,
		onTLTchange								: onTLTchange,
		checkMandatoryFields					: checkMandatoryFields,
		onSavePresentationDetailsButtonClicked	: onSavePresentationDetailsButtonClicked,
		getTags									: getTags,
		saveSettings							: saveSettings,
		onPedagogicalButtonClicked   			: onPedagogicalButtonClicked,
		onDonePedagogicalButtonClicked 			: onDonePedagogicalButtonClicked,
		selectAnimation 						: selectAnimation,
		addContributor							: addContributor
	};

}) (VISH, jQuery);