/*
 * Configure Standalone Vish Editor
 */
var configuration = {};
configuration["presentationSettings"] = false;
configuration["presentationTags"] = true;
configuration["presentationThumbnails"] = true;

configuration["Vish"] = true;
configuration["VishLives"] = true;
configuration["VishUpload"] = true;
configuration["VishRepo"] = true;

configuration["Flickr"] = true;
configuration["Youtube"] = true;
configuration["Vimeo"] = true;

configuration["VishIntegration"] = true;

$.getScript("/js/lang/translations.Vish.es.js", function(){
  configuration["translation"] = i18n_Vish;
});



VISH.Configuration = (function(V,$,undefined){
  
	var configuration;
	
	var init = function(myConfiguration){ 
	 configuration = myConfiguration;
	};
	
	var applyConfiguration = function(){
		
		if(configuration["presentationSettings"]){
			if(!configuration["presentationTags"]){
        $(".tagBoxUpload").css("display","none");
				$(".tagBoxIntro").css("display","none");
      }
			if(!configuration["presentationThumbnails"]){
        $("#thumbnails_in_excursion_details").css("display","none");
      }
		}
		
   if(!configuration["Vish"]){
      $("#tab_pic_upload").css("display","none");
			$("#tab_pic_repo").css("display","none");
			$("#tab_object_upload").css("display","none");
      $("#tab_object_repo").css("display","none");
			$("#tab_video_repo").css("display","none");
			$(".addLive").css("display","none");
    } else {
			//Vish Apis Enabled
			if(!configuration["VishLives"]){
				$(".addLive").css("display","none");
			}
			if(!configuration["VishUpload"]){
				$("#tab_pic_upload").css("display","none");
        $("#tab_object_upload").css("display","none");
      }
			if(!configuration["VishRepo"]){
        $("#tab_pic_repo").css("display","none");
        $("#tab_object_repo").css("display","none");
				$("#tab_video_repo").css("display","none");
      }
		}
		
		if(!configuration["Youtube"]){
      $("#tab_video_youtube").css("display","none");
    }
		
	  if(!configuration["Vimeo"]){
      $("#tab_video_vimeo").css("display","none");
    }
		
		if(!configuration["Flickr"]){
			$("#tab_pic_flikr").css("display","none");
		}


    //    VISH.Debugging.log("Configuration completed")
	}
	
	var getConfiguration = function(){
		return configuration;
	}
	
	return {
    init                : init,
    applyConfiguration  : applyConfiguration,
		getConfiguration    : getConfiguration
  };
	
}) (VISH, jQuery);