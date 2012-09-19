VISH.Editor.Video.Vimeo = (function(V,$,undefined){
	
	var carrouselDivId = "tab_video_vimeo_content_carrousel";
	var previewDivId = "tab_video_vimeo_content_preview";
	var queryMaxMaxNumberVimeoVideo= 20; //maximum video query for youtube API's (999 max)
	var currentVideos = new Array(); //to videoID param
	var selectedVideo = null;
	
	var init = function(){
		var myInput = $("#tab_video_vimeo_content").find("input[type='search']");
	  $(myInput).watermark(VISH.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
		        	VISH.Editor.Video.Vimeo.requestVimeoData($(myInput).val());
		          	$(myInput).blur();
			}
		});
	};

	
	var onLoadTab = function(){
		//Clean previous content
		$("#tab_video_vimeo_content").find("input[type='search']").val("");
    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
    $("#" + carrouselDivId).hide();
		_cleanVideoPreview();
	};

	
    /*
	 Request videos to Vimeo API
	 */	
	var requestVimeoData = function(text){
		VISH.Debugging.log("enter in requestVimeoData and text's value is:" + text);
		//GET&http%3A%2F%2Fvimeo.com%2Fapi%2Frest%2Fv2&format%3Djson%26full_response%3D1%26method%3Dvimeo.videos.search%26oauth_consumer_key%3Dc1f5add1d34817a6775d10b3f6821268%26oauth_nonce%3D641560c0dca7dbb0d8fcc2d677a6b585%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1340633834%26oauth_version%3D1.0%26page%3D1%26per_page%3D20%26query%3Dcasa%26user_id%3D72da4651e040f6060def0d531cab7abab4ff5801
		//var api_key="72da4651e040f6060def0d531cab7abab4ff5801";
		
	//	var url_vimeo= "http://vimeo.com/api/rest/v2?api_key="+api_key+"&format=jsonp&full_response=1&method=vimeo.videos.search&page=1&per_page=20&query="+text+"&sort=relevant";
		//we have to create the URL using the Vimeo's API and the term to search is the parameter 'text'
		VISH.Debugging.log("url_vimeo is :" + url_vimeo);
		
		jQuery.getJSON(url_vimeo,function (data) {
			
			
			_onDataReceived(data);
			
			
			
		});
	};

	var _onDataReceived = function(data) {
		VISH.Debugging.log("enter in _onDataReceived and data value is: "+ data);
		
		
	};

  var _onImagesLoaded = function(){
    
   };
	
	
  var vimeo_video_pattern_1 =/https?:\/\/?youtu.be\/([aA-zZ0-9]+)/g
	var vimeo_video_pattern_2 =/(https?:\/\/)?(www.youtube.com\/watch\?v=|embed\/)([aA-z0-9Z]+)[&=.]*/g

  var _getYoutubeIdFromURL = function(url){	
		
		
	};
	
  var addSelectedVideo = function() {
	  
	  
  };


  /** 
   * Funcion to show a preview video and select to embed into the zone
   * video_id    
   */
  var onClickCarrouselElement = function(event) {
    
  };

  
  var _renderVideoPreview = function(renderedIframe, video) {
		
		
  };
  
  
  var _cleanVideoPreview = function() {
		
  };

 
 var _generateWrapper = function (videoId) {
   
 };
 
 var generateWrapperForYoutubeVideoUrl = function (url){
 	
 };


  return {
		init		  			                  : init,
		onLoadTab	  			                : onLoadTab, 
		requestVimeoData						: requestVimeoData
  };

}) (VISH, jQuery);
