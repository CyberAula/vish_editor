VISH.Configuration = (function(V,$,undefined){
  
	var configuration;
	
	var init = function(myConfiguration){ 
		configuration = myConfiguration;
		_initPaths();
	};

	var _initPaths = function(){
		//Assets paths
		V.ImagesPath = configuration["ImagesPath"];
		V.StylesheetsPath = configuration["StylesheetsPath"];

		//Services
		V.RootPath = configuration["rootPath"];

		//Upload paths
		V.UploadImagePath = configuration["uploadImagePath"];
		V.UploadObjectPath = configuration["uploadObjectPath"];
		V.UploadPresentationPath = configuration["uploadPresentationPath"];
		V.UploadPDF2PPath = configuration["uploadPDF2PPath"];

		//Source paths
		V.LREPath = configuration["LRE_path"];
		V.ViSHInstances = configuration["ViSH_instances"];
	};
	
	var applyConfiguration = function(){
		//Sources
		if(!configuration["Upload"]){
			$("#tab_pic_upload").css("display","none").addClass("disabled");
			$("#tab_object_upload").css("display","none").addClass("disabled");
		}

		if(!configuration["ViSH"]){
			$("#tab_pic_repo").css("display","none").addClass("disabled");
			$("#tab_object_repo").css("display","none").addClass("disabled");
			$("#tab_video_repo").css("display","none").addClass("disabled");
		}

		if(!configuration["Youtube"]){
	      $("#tab_video_youtube").css("display","none").addClass("disabled");
	    }

	    if(!configuration["SoundCloud"]){
	      $("#tab_audio_soundcloud").css("display","none").addClass("disabled");
	    }
			
		if(!configuration["Vimeo"]){
	      $("#tab_video_vimeo").css("display","none").addClass("disabled");
	    }

	    if(!configuration["LRE"]){
	      $("#tab_pic_lre").css("display","none").addClass("disabled");
	      $("#tab_object_lre").css("display","none").addClass("disabled");
	    }
			
		if(!configuration["Flickr"]){
			$("#tab_pic_flikr").css("display","none").addClass("disabled");
		}

		//Tags configuration
		//Default config
		var tagsSettings = {maxLength: 20, maxTags: 8, triggerKeys: ['enter', 'space', 'comma', 'tab']};

		if(typeof configuration.tagsSettings == "object"){
			if(!typeof configuration.tagsSettings.maxLength == "number"){
				configuration.tagsSettings.maxLength = tagsSettings.maxLength;
			}
			if(!typeof configuration.tagsSettings.maxTags == "number"){
				configuration.tagsSettings.maxTags = tagsSettings.maxTags;
			}
			if(!(configuration.tagsSettings.triggerKeys instanceof Array)){
				configuration.tagsSettings.triggerKeys = tagsSettings.triggerKeys;
			}
		} else {
			configuration.tagsSettings = tagsSettings;
		}
	};
	
	var getConfiguration = function(){
		return configuration;
	};
	
	return {
    	init                : init,
    	applyConfiguration  : applyConfiguration,
		getConfiguration    : getConfiguration
  	};
	
}) (VISH, jQuery);