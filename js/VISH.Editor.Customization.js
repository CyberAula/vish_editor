VISH.Editor.Customization = (function(V,$,undefined){
	
	var init = function(){
		 var editor_logo = VISH.Configuration.getConfiguration().editor_logo;
		if(editor_logo != null){
			$("#presentation_details_logo").attr("src", editor_logo );
		}

		var repository_image = VISH.Configuration.getConfiguration().repository_image;
		imageExist(repository_image); 
		if( repository_image != null ){
			$("img[src$='/images/logos/repositoryimg.png']").attr("src", repository_image);
		}

		var menu_logo = VISH.Configuration.getConfiguration().menu_logo;
		if( menu_logo != null ){
			$("#menuButton").attr("src",menu_logo);
		}

		var repository_name = VISH.Configuration.getConfiguration().repository_name;
		if(repository_name != null ){
			$("#tab_pic_repo").html(repository_name);
			$("#tab_object_repo").html(repository_name);
			$("#tab_video_repo").html(repository_name);
		}

	};

	var imageExist =  function(url, callback){
   		var img = new Image();
	    img.onload = function(){
	    	callback = true;
	    }; 
	    img.onerror =function(){
	    	callback = false;
	    }; 
	    img.src = url;
		}

	return {
			init 		: init,
			imageExist	: imageExist
	};

}) (VISH,jQuery);