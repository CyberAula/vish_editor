VISH.Editor.Customization = (function(V,$,undefined){
	
	var init = function(){
		 var editor_logo = VISH.Configuration.getConfiguration().editor_logo;
		if(editor_logo != null && imageExist(editor_logo) ){
			$("#presentation_details_logo").attr("src", editor_logo );
		}

		var repository_image = VISH.Configuration.getConfiguration().repository_image;
		if( repository_image != null && imageExist(repository_image) ){
			$("img[src$='/images/logos/repositoryimg.png']").attr("src", repository_image);
		}

		var menu_logo = VISH.Configuration.getConfiguration().menu_logo;
		if(menu_logo != null && imageExist(menu_logo) ){
			$("#menuButton").attr("src",menu_logo);
		}

		var repository_name = VISH.Configuration.getConfiguration().repository_name;
		if(repository_name != null ){
			$("#tab_pic_repo").html(repository_name);
			$("#tab_object_repo").html(repository_name);
			$("#tab_video_repo").html(repository_name);
		}

	};

	var imageExist =  function(url){
   		var img = new Image();
   		img.src = url;
   		return img.height != 0;
	};

	return {
			init 		: init
	};

}) (VISH,jQuery);