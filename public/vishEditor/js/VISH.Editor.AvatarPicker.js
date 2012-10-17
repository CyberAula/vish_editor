VISH.Editor.AvatarPicker = (function(V,$,undefined){
	var avatars = null;
	var selectedAvatar; //avatar url
	var thumbnailsDetailsId = "thumbnails_in_presentation_details";
	var carrouselDivId = "avatars_carrousel";
    

	var init = function(){
		//Add fancybox to upload Thumbnail
		$("#hidden_button_to_uploadThumbnail").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {						
				V.Editor.Image.setAddContentMode(VISH.Constant.THUMBNAIL);
				V.Utils.loadTab('tab_pic_from_url');
			}
		});
	};	
	 
	var onLoadPresentationDetails = function(mySelectedAvatar){
		if(mySelectedAvatar){
			selectedAvatar = mySelectedAvatar;
		}

		if(avatars===null){
			$("#" + thumbnailsDetailsId).hide();
			VISH.Editor.API.requestThumbnails(_onThumbnailsReceived,_onThumbnailsError);
		} else {
			_selectAvatarInCarrousel(selectedAvatar);
		}
	}  

	var onCustomThumbnailSelected = function(thumbnail_url){
		VISH.Editor.Tools.Menu.displaySettings(); //Hide previous fancybox
		_addCustomThumbnail(thumbnail_url);
	}

	var _addCustomThumbnail = function(thumbnail_url){
		var element = $("<div class='carrousel_element_single_row_thumbnails'><img class='carrousel_element_single_row_thumbnails carrousel_last_added_element' src='" + thumbnail_url + "'/></div>")[0];
		VISH.Editor.Carrousel.insertElement(carrouselDivId,element,1);

		var element = $(".carrousel_last_added_element");

		//Add callback to the inserted element
		$(element).click(function(event){
			_onAvatarSelected(event);
		});

		VISH.Editor.Carrousel.goToElement(carrouselDivId,$(element)[0]);

		$(element).trigger('click');
		$(element).removeClass("carrousel_last_added_element");
	}

	/**
	* Callback function to select an avatar
	*/
	var _onAvatarSelected = function(event){
		if($(event.target)[0].tagName !== "IMG"){
			return;
		} else {
			var avatar = $(event.target);
		}

		if($(avatar).hasClass("uploadThumbnail")){
			$("#hidden_button_to_uploadThumbnail").trigger("click");
			return;
		}

		$(".carrousel_element_single_row_thumbnails").removeClass("selectedThumbnail");
		$(avatar).addClass("selectedThumbnail");
		$('#presentation_avatar').val($(event.target).attr("src"));
	};
  
	/**
	* Function to select a random avatar, it will be chosen between the first and the max (to be in the first carrousel page)
	*/
	var _selectRandom = function(max){
		var randomnumber = Math.ceil(Math.random()*max);
		$("#" + carrouselDivId + " .carrousel_element_single_row_thumbnails:nth-child("+randomnumber+") img").addClass("selectedThumbnail");
		$('#presentation_avatar').val($("#" + carrouselDivId + " .carrousel_element_single_row_thumbnails:nth-child("+randomnumber+") img").attr("src"));
	};
	
   /**
	* Function to select a specific DEFAULT avatar.
	*/
	var _selectDefaultAvatarInCarrousel = function(avatar){
		if(avatar){
			var avatarName = avatar.split("/").pop();

			var avatarImages = $("#" + carrouselDivId).find("img.carrousel_element_single_row_thumbnails");

			$.each(avatarImages, function(i, image) {
				if($(image).attr("src").split("/").pop() === avatarName){
					$(image).addClass("selectedThumbnail");
					VISH.Editor.Carrousel.goToElement(carrouselDivId,$(image));
				}
			});	
		}
	};

   /**
	* Function to select a specific avatar identified by its url.
	*/
	var _selectAvatarInCarrousel = function(avatar){
		if(avatar){
			var avatarImages = $("#" + carrouselDivId).find("img.carrousel_element_single_row_thumbnails");

			$.each(avatarImages, function(i, image) {
				if($(image).attr("src") === avatar){
					$(image).addClass("selectedThumbnail");
					VISH.Editor.Carrousel.goToElement(carrouselDivId,$(image));
				}
			});		
		}
	}
    
	
	var _onThumbnailsReceived = function(data){
		avatars = data;

		//Clean previous carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);

		//Build new carrousel
		var content = "";
		var carrouselImages = [];
		carrouselImages.push($("<img class='uploadThumbnail' src='" + VISH.ImagesPath + "addThumbnail.png'/>")[0]);
		$.each(avatars.pictures, function(i, item) {
			var myImg = $("<img src="+item.src+" />");
			carrouselImages.push($(myImg)[0]);
		});

		VISH.Utils.loader.loadImagesOnCarrouselOrder(carrouselImages,_onImagesLoaded,carrouselDivId);
	}
	
	var _onThumbnailsError = function(xhr, ajaxOptions, thrownError){
		VISH.Debugging.log("_onThumbnailsError");
		VISH.Debugging.log("status returned by server:" + xhr.status);
		VISH.Debugging.log("Error in client: " + thrownError);  
		VISH.Debugging.log("ERROR!" + thrownError);
	}
	
	var _onImagesLoaded = function(){
		$("#" + thumbnailsDetailsId).show(); 

		var options = new Array();
		options['rows'] = 1;
		options['callback'] = _onAvatarSelected;
		options['rowItems'] = 5;
		options['styleClass'] = "thumbnails";

		VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);

		$(".buttonintro").addClass("buttonintro_extramargin");

		if(selectedAvatar){
			if(!_isDefaultAvatar(selectedAvatar)){
				//Load custom avatar
				_addCustomThumbnail(selectedAvatar);
			} else {
				_selectDefaultAvatarInCarrousel(selectedAvatar);
			}
		} else {
			_selectRandom(5);  //Randomly select one between first page
		}
	}

	var _isDefaultAvatar = function(avatar){
		if(!avatar){
			return false;
		}

		var namePattern = "(^excursion-)";
		var avatarName = avatar.split("/").pop();
		if (avatarName.match(namePattern)===null){
			return false;
		}
		
		var pathPattern = "(^" + VISH.ImagesPath + ")";
		return avatar.match(pathPattern)!==null;
	}
  
	return {
		init	       				: init,
		onLoadPresentationDetails 	: onLoadPresentationDetails,
		onCustomThumbnailSelected	: onCustomThumbnailSelected,
		_isDefaultAvatar			: _isDefaultAvatar
	};

}) (VISH, jQuery);