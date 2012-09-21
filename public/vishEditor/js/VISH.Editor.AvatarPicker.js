VISH.Editor.AvatarPicker = (function(V,$,undefined){
    var avatars = null;
		var selectedAvatar;
		var thumbnailsDetailsId = "thumbnails_in_presentation_details";
		var carrouselDivId = "avatars_carrousel";
    

   var init = function(){

   		//Add fancybox to upload Thumbnail	
   		//COMPLETE CODE!! UPLOAD THUMBNAILS FEATURE
   		$("#hidden_button_to_launch_picture_fancybox_for_thumbnail").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {						
				// V.Editor.Image.setFlashcardMode(true);
				V.Editor.Utils.loadTab('tab_pic_from_url');
			},
			"onClosed"	: function(data){
				// V.Editor.Image.setFlashcardMode(false);
			}
		});
   };	
	 
	var onLoadPresentationDetails = function(mySelectedAvatar){
		selectedAvatar = mySelectedAvatar;
		$("#" + thumbnailsDetailsId).hide();
		VISH.Editor.API.requestThumbnails(_onThumbnailsReceived,_onThumbnailsError);
	}  
    
  /**
   * Callback function to select an avatar
   */
  var _selectAvatar = function(event){
  	var avatar = $(event.target);

  	if($(avatar).hasClass("uploadThumbnail")){
  		$("#hidden_button_to_launch_picture_fancybox_for_thumbnail").trigger("click");
  		return;
  	}

  	$(".carrousel_element_single_row_thumbnails").removeClass("selectedThumbnail");
  	$(avatar).addClass("selectedThumbnail");
  	$('#presentation_avatar').val($(event.target).attr("src"));
  };
  
  /**
   * function to select a random avatar, it will be chosen between the first and the max (to be in the first carrousel page)
   */
  var selectRandom = function(max){
  	var randomnumber=Math.ceil(Math.random()*max);
  	$("#" + carrouselDivId + " .carrousel_element_single_row_thumbnails:nth-child("+randomnumber+") img").addClass("selectedThumbnail");
  	$('#presentation_avatar').val($("#" + carrouselDivId + " .carrousel_element_single_row_thumbnails:nth-child("+randomnumber+") img").attr("src"));
  };
	
	/**
   * function to select a specific avatar.
   */
	var selectAvatarInCarrousel = function(avatar){
		//Get avatar name
		avatar = avatar.split("/").pop();

		var avatarImages = $("#" + carrouselDivId).find("img.carrousel_element_single_row_thumbnails");

		$.each(avatarImages, function(i, image) {
			if($(image).attr("src").split("/").pop() == avatar){
				$(image).addClass("selectedThumbnail");
				VISH.Editor.Carrousel.goToElement(carrouselDivId,$(image));
			}
		});

	};
    
	
	var _onThumbnailsReceived = function(data){
		avatars = data;

		//Clean previous carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);

		//Build new carrousel
		var content = "";
		var carrouselImages = [];
		// Uncomment to allow uploadThumbnail button
		//carrouselImages.push($("<img class='uploadThumbnail' src='" + VISH.ImagesPath + "addThumbnail.png'/>")[0]);
		$.each(avatars.pictures, function(i, item) {
			var myImg = $("<img src="+item.src+" />");
			carrouselImages.push($(myImg)[0]);
		});

		VISH.Utils.loader.loadImagesOnCarrouselOrder(carrouselImages,_onImagesLoaded,carrouselDivId);
	}
	
	var _onThumbnailsError = function(xhr, ajaxOptions, thrownError){
		VISH.Debugging.log("_onThumbnailsError")
		VISH.Debugging.log("status returned by server:" + xhr.status);
		VISH.Debugging.log("Error in client: " + thrownError);  
		VISH.Debugging.log("ERROR!" + thrownError)
	}
	
	var _onImagesLoaded = function(){
		$("#" + thumbnailsDetailsId).show(); 

		var options = new Array();
		options['rows'] = 1;
		options['callback'] = _selectAvatar;
		options['rowItems'] = 5;
		options['styleClass'] = "thumbnails";

		VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);

		$(".buttonintro").addClass("buttonintro_extramargin");

		if(selectedAvatar){
			selectAvatarInCarrousel(selectedAvatar);
		} else {
			selectRandom(5);  //Randomly select one between first page
		}
	}
  
	return {
		init	       : init,
		selectRandom   : selectRandom,
		onLoadPresentationDetails : onLoadPresentationDetails
		
	};

}) (VISH, jQuery);