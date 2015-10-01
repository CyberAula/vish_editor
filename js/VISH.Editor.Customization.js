VISH.Editor.Customization = (function(V,$,undefined){

	///////////////
	// Initializer
	///////////////
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

	///////////////
	// Method to check if the image provided exist
	///////////////
	var imageExist =  function(url, callback){
   		var img = new Image();
   		img.src = url;
		img.onload = function(){
				//image exists!
		    	callback();
		    };
		};

	///////////////
	// Method to make up all concrete names in platform
	///////////////
	var globalMakeUp = function(){
		//String decorator for platform
		var customization_words = VISH.Configuration.getConfiguration().customization_words;
		if (customization_words != null){
			$("[i18n-key]").each(function(index, elem){
				switch(elem.tagName){
					 case "INPUT":
					 	_customizeInput(elem,customization_words);
					 	break;
					 case "TEXTAREA":
					 	_customizeTextArea(elem,customization_words);
					 	break;
					 case "DIV":
					 	_customizeDiv(elem,customization_words);
					 	break;
					 case "LI":
					 	_customizeLI(elem,customization_words);
					 	break;
					 case "IMG":
					 	_customizeImg(elem,customization_words);
					default:
						//Generic translation (for h,p or span elements)
						_genericCustomization(elem,customization_words);
						break;
				}
			})
		}
	};

	var _doMakeUp = function(elem, customization_words){
		for (var m in makeup){
		    	var regexp = new RegExp(m, "g");
		    	if(elem.match(regexp)){
		    		elem.replace(regexp,m[makeup])
		    	}
		    }
	};

	var _customizeInput = function(elem,customization_words){

	};

	var _customizeTextArea = function(elem,customization_words){
		
	};

	var _customizeDiv = function(elem,customization_words){
		
	};

	var _customizeLI = function(elem,customization_words){
		
	};

	var _customizeImg = function(elem,customization_words){
		
	};

	var _genericCustomization = function(elem,customization_words){
		
	};

	return {
			init 		: init
	};

}) (VISH,jQuery);