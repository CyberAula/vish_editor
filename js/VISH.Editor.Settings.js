VISH.Editor.Settings = (function(V,$,undefined){

	var tagsLoaded = false;

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
			}
		});

		$("a#edit_presentation_details").trigger('click');
	};

	var _onDisplaySettings = function(){
		var options = V.Utils.getOptions();

		//Sliders are initialized in the init() method.
		onTLTchange();
		if(typeof V.Utils.getOptions().configuration.catalog === 'undefined' || V.Utils.getOptions().configuration.catalog.length == 0 ){
			$('#catalog_button').hide();
		}
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

		var catalog_tags = V.Utils.getOptions().configuration.catalog;
		if(catalog_tags){
			for(var i = 0; i<catalog_tags.length; i++){
				$("#catalog_tags").append($("<option />").val(catalog_tags[i]).attr("i18n-key", "i."+ catalog_tags[i]).text(catalog_tags[i]))
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
		var validLicenseValues = [];
		$("#presentation_details_license_select option").each(function(index,optionTag){
			validLicenseValues.push($(optionTag).attr("value"));
		});
		var hasLicense = ((typeof presentation.license == "object")&&(typeof presentation.license.key == "string")&&(validLicenseValues.indexOf(presentation.license.key)!=-1));
		if(hasLicense){
			$("#presentation_details_license_select").val(presentation.license.key);
		}

		//Block license if resource has been already published
		if(V.Editor.hasBeenPublished()){
			if(hasLicense){
				var hasPrivateLicense = (hasLicense && presentation.license.key === "private");
				if(!hasPrivateLicense){
					$("#presentation_details_license_select").attr("disabled","disabled");
				}
			}
		}

		//Set the title of the license, so it can be completely displayed
		if(hasLicense){
			switch(presentation.license.key) {
			    case "public":
			        document.getElementById("presentation_details_license_select").title = "Public Domain";
			        break;
			    case "cc-by":
			        document.getElementById("presentation_details_license_select").title = "Creative Commons Attribution";
			        break;
			    case "cc-by-sa":
			        document.getElementById("presentation_details_license_select").title = "Creative Commons Attribution-ShareAlike";
			        break;
			    case "cc-by-nd":
			        document.getElementById("presentation_details_license_select").title = "Creative Commons Attribution-NoDerivs";
			        break;
			    case "cc-by-nc":
			        document.getElementById("presentation_details_license_select").title = "Creative Commons Attribution-NonCommercial";
			        break;
			    case "cc-by-nc-sa":
			        document.getElementById("presentation_details_license_select").title = "Creative Commons Attribution-NonCommercial-ShareAlike";
			        break;
			    case "cc-by-nc-nd":
			        document.getElementById("presentation_details_license_select").title = "Creative Commons Attribution-NonCommercial-NoDerivs";
			        break;
			    default:
			        document.getElementById("presentation_details_license_select").title = "";
			}
		}

		//Themes
		selectTheme(V.Editor.Themes.getCurrentTheme().number);

		//Metadata

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
		
		//Advanced Settings
		if(presentation.educational_objectives){
			$("#educational_objectives_textarea").val(presentation.educational_objectives);
		}

		//to make checked by the fault and read settings
		if(presentation.allow_clone == "false"){
			$("#allow_clone").prop("checked", false);
		} else {
			$("#allow_clone").prop('checked', true);
		}

		if( presentation.license != undefined && (presentation.license.key == "cc-by-nd" || presentation.license.key == "cc-by-nc-nd")){
			$("#allow_clone").prop("checked", false);
			$("#allow_clone").prop("disabled", true);
		}

		if(presentation.allow_comment == "false"){
			$("#allow_comment").prop("checked", false);
		} else {
			$("#allow_comment").prop('checked', true);
		}

		if(presentation.allow_download == "false"){
			$("#allow_download").prop("checked", false);
		} else {
			$("#allow_download").prop('checked', true);
		}

		if(presentation.allow_following_rte == "false"){
			$("#allow_following_rte").prop("checked", false);
		} else {
			$("#allow_following_rte").prop('checked', true);
		}

		if(V.Editor.hasBeenSaved()){
			$('.attachmentFileUpload').removeAttr('disabled');
			$('#attachment_file').removeAttr('disabled');
			if(presentation.attachment_file_name != undefined){
				document.getElementById("description_attachment").value = presentation.attachment_file_name;
				$("#upload_icon_success").show();
			}
		} else {
			$('.attachmentFileUpload').prop('disabled',true);
			$('#attachment_file').prop('disabled',true);
		}
	};
	
	var selectTheme = function(themeNumber){
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
		$("#catalog_content").hide();
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

		//Metadata fields
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

		//Publication settings
		var allow_clone = $("#allow_clone").is(':checked');
		if(typeof allow_clone == "boolean"){
			settings.allow_clone = allow_clone.toString();
		}

		if( licenseKey == "cc-by-nd" || licenseKey == "cc-by-nc-nd"){
			settings.allow_clone = "false";
		}


		var allow_comment = $("#allow_comment").is(':checked');
			if(typeof allow_comment == "boolean"){
			settings.allow_comment = allow_comment.toString();
		}

		var allow_download = $("#allow_download").is(':checked');
		if(typeof allow_download == "boolean"){
			settings.allow_download = allow_download.toString();
		}

		var allow_following_rte = $("#allow_following_rte").is(':checked');
		if(typeof allow_following_rte == "boolean"){
			settings.allow_following_rte = allow_following_rte.toString();
		}
		
		var attachment_file_name = V.Editor.Utils.filterFilePath(document.getElementById("description_attachment").value);
		if(attachment_file_name != "" && $('#upload_file_attachment').prop('disabled')){
			settings.attachment_file_name = attachment_file_name;
		}
		
		//callbacks
		$('.attachmentFileUpload').prop('disabled', false);
		$('#attachment_file').prop('disabled', false);
		$('.attachmentFileUpload').removeAttr('disabled');

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

		var user = V.User.getUser();
		if(typeof user != "undefined"){
			//Override some params
			if(typeof V.User.getName() != "undefined"){
				author.name = V.User.getName();
			}
			author.vishMetadata = {};
			if(typeof V.User.getId() != "undefined"){
				author.vishMetadata.id = V.User.getId();
			}
		}

		return author;
	};

	/**
	 * function called when navigating into metadata options to manage tabs
	 */
	 var advancedTabs = function(event){
	 	event.preventDefault();
	 	if($(this).hasClass != true){
	 		$(this).closest('ul').find('.fancy_selected').removeClass('fancy_selected');
	 		$(this).addClass("fancy_selected");
		 	$("#metadata_options_fields").children('.active').removeClass('active').hide();
		 	var attr = "#" + $(this).attr("tab");
		 	$(attr).addClass("active").show();

		 	//help behaviour
		 	$($(".help_in_settings")[1]).attr("id", "help-" + $(this).attr("tab"));
	 	}
	 };

	/**
	 * function called when the user clicks on the metadata options button
	 */
	 var onMetadataButtonClicked = function(event){
	 	event.preventDefault();
	 	$("#catalog_content").hide();
	 	$("#presentation_details_fields").slideUp();
	 	$("#metadata_options_fields").slideDown();
	 	if ($("#advanced_tabs .fancy_selected") != undefined ){ 
	 		$(".help_in_settings").attr("id", "help-" + $("#advanced_tabs .fancy_selected").attr("tab"));
	 	}
	 };

	/**
	 * Function called when the user clicks on the done button in the metadata options panel
	 */
	 var onDoneMetadataButtonClicked = function(event){
	 	event.preventDefault();
	 	$("#metadata_options_fields").slideUp();
	 	$("#presentation_details_fields").slideDown();
	 	$(".help_in_settings").attr("id","help_in_settings"); 
	 };

	/**
	 * Function called when the user clicks on the catalog button
	 */
	 var onCatalogButtonClicked = function(event){
	 	event.preventDefault();
	 	$("#catalog_content").fadeIn();
	 };


	/**
	 * Function called when the user clicks on the done button in the catalog panel
	 */
	var onDoneCatalogButtonClicked = function(event){
	 	event.preventDefault();
	 	var catalog_tags = $("#catalog_tags").find(":selected");
	 	if (catalog_tags.length > 0){
 			for( i = 0; i < catalog_tags.length; i ++){
 				$("#tagBoxIntro .tagList").tagit('add', catalog_tags[i].value);
 			}
 			$("#catalog_tags :selected").removeAttr("selected");
	 	}
	 	$("#catalog_content").fadeOut();
	 };

	/**
	 *	Function to beautify upload behaviour
	 */
	var onChangeAttachmentFile = function(event){
		$("#upload_icon_success").hide();
		if(V.Editor.hasBeenSaved()){
			var fileName = document.getElementById("attachment_file").value;
			if(fileName != ""){
				document.getElementById("description_attachment").value = V.Editor.Utils.filterFilePath(fileName);
				$('#upload_file_attachment').prop('disabled', false);
			}
		} else {
			V.Editor.Utils.showErrorDialog(V.I18n.getTrans("i.uploadHasToSaveFirst"));
		}
	 };

	/**
	 *	Function to handle uploading an attachment behaviour
	 **/
	var onUploadAttachmentFile = function(event){
		if(V.Editor.hasBeenSaved()){
			var fileName = document.getElementById("attachment_file").value;
			if(fileName != ""){
				if(typeof V.UploadAttachmentPath == "string"){
					$("#attachment_file_form").attr("action", V.UploadAttachmentPath);
					$("#attachment_author").val(V.User.getId());
					$("#attachment_auth_token").val(V.User.getToken());
					$("#attachment_pres_id").val(V.Editor.getPresentationId());
					$("#attachment_file_form").ajaxForm({
						success: function(responseText, statusText, xhr, form) {
							if(responseText.status == "bad_request" && responseText.message == "bad_size"){
								V.Editor.Utils.showErrorDialog(V.I18n.getTrans("i.uploadErrorTooBig"));
								$('#upload_file_attachment').prop('disabled', true);
							}else if(responseText.status == "bad_request" && responseText.message == "wrong_params"){
								V.Editor.Utils.showErrorDialog(V.I18n.getTrans("i.uploadErrorWrongServer"));
								$('#upload_file_attachment').prop('disabled', true);
							} else if (responseText.status == "ok" && responseText.message == "success") {
								$("#upload_icon_success").show();
								$('#upload_file_attachment').prop('disabled', true);
								V.Editor.Tools.save();
							}
						},
						error: function(error){
							V.Editor.Utils.showErrorDialog(V.I18n.getTrans("i.uploadErrorWrongServer"));
						}
					});
				}
			} else {
				event.preventDefault();
				V.Editor.Utils.showErrorDialog(V.I18n.getTrans("i.uploadErrorCantReach"));
			}
		} else {
			event.preventDefault();
			V.Editor.Utils.showErrorDialog(V.I18n.getTrans("i.uploadHasToSaveFirst"));
		}
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
		onChangeAttachmentFile					: onChangeAttachmentFile,
		onUploadAttachmentFile					: onUploadAttachmentFile,
		selectTheme								: selectTheme,
		onKeyUpOnTitle							: onKeyUpOnTitle,
		onKeyUpOnPreviewTitle					: onKeyUpOnPreviewTitle,
		onTLTchange								: onTLTchange,
		advancedTabs							: advancedTabs,
		checkMandatoryFields					: checkMandatoryFields,
		onSavePresentationDetailsButtonClicked	: onSavePresentationDetailsButtonClicked,
		getTags									: getTags,
		saveSettings							: saveSettings,
		onMetadataButtonClicked   				: onMetadataButtonClicked,
		onDoneMetadataButtonClicked 			: onDoneMetadataButtonClicked,
		onCatalogButtonClicked 					: onCatalogButtonClicked,
		onDoneCatalogButtonClicked				: onDoneCatalogButtonClicked,
		selectAnimation 						: selectAnimation,
		addContributor							: addContributor
	};

}) (VISH, jQuery);