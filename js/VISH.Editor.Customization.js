VISH.Editor.Customization = (function(V,$,undefined){
	
	var init = function(){
		var editor_logo = VISH.Configuration.getConfiguration().editor_logo;
		if(editor_logo != null){
			imageExist(editor_logo, function(){
				$("#presentation_details_logo").attr("src", editor_logo );
			});			
		}

		var repository_image = VISH.Configuration.getConfiguration().repository_image;
		if( repository_image != null ){
			imageExist(repository_image, function(){
				$("img[src$='/images/logos/repositoryimg.png']").attr("src", repository_image);
			});
		}

		var menu_logo = VISH.Configuration.getConfiguration().menu_logo;
		if( menu_logo != null ){
			imageExist(menu_logo, function(){
				$("#menuButton").css("background-image", "url("+menu_logo+")");
			});
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
   		img.src = url;
		img.onload = function(){
				//image exists!
		    	callback();
		    };
		}

	return {
			init 		: init
	};

}) (VISH,jQuery);