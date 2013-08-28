VISH.Editor.Settings = (function(V,$,undefined){

	var init = function(){
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
			'showCloseButton': true,
			"onComplete"  : function(data) {
				$("#fancybox-wrap").css("margin-top", "20px");
				_onDisplaySettings();
			}
		});

		$("a#edit_presentation_details").trigger('click');
	}

	var _onDisplaySettings = function(){
		//Tags
		if(V.Configuration.getConfiguration()["presentationTags"]){
			//Loader
			$("#tagBoxIntro").attr("HTMLcontent", $("#tagBoxIntro").html());
			V.Utils.Loader.startLoadingInContainer($("#tagBoxIntro"),{style: "loading_tags"});
			V.Editor.API.requestTags(_onInitialTagsReceived);
		}

		//Avatar
		var presentation = V.Editor.getPresentation();
		if(presentation && presentation.avatar){
			V.Editor.AvatarPicker.onLoadPresentationDetails(presentation.avatar);
		} else {
			V.Editor.AvatarPicker.onLoadPresentationDetails(null);
		}
	}

	var _onInitialTagsReceived = function(data){
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


	/**
	 * function called when the user clicks on the save button
	 * in the initial presentation details fancybox to save
	 * the data in order to be stored at the end in the JSON file   
	 */
	var onSavePresentationDetailsButtonClicked = function(event){
		event.preventDefault();

		// TODO: Validate	
		// if($('#presentation_title').val().length < 1) {
		// 	return false;
		// }
		
		var draftPresentation = V.Editor.getPresentation();

		if(!draftPresentation){
			draftPresentation = {};
		}

		draftPresentation.title = $('#presentation_title').val();
		draftPresentation.description = $('#presentation_description').val();
		draftPresentation.avatar = $('#presentation_avatar').val();
		draftPresentation.tags = V.Editor.Utils.convertToTagsArray($("#tagindex").tagit("tags"));

		//now the pedagogical fields if any
		draftPresentation.age_range = $("#age_range").val();
		draftPresentation.difficulty = $("#difficulty_range").attr("difficulty");
		draftPresentation.subject = $("#subject_tag").val();
		draftPresentation.language = $("#language_tag").val();
		draftPresentation.educational_objectives = $("#educational_objectives_tag").val();
		draftPresentation.adquired_competencies = $("#acquired_competencies_tag").val();

		V.Editor.setPresentation(draftPresentation);

		$.fancybox.close();
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

	return {
		init									: init,
		displaySettings							: displaySettings,
		onSavePresentationDetailsButtonClicked	: onSavePresentationDetailsButtonClicked,
		onPedagogicalButtonClicked   			: onPedagogicalButtonClicked,
		onDonePedagogicalButtonClicked 			: onDonePedagogicalButtonClicked
	};

}) (VISH, jQuery);