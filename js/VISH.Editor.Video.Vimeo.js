VISH.Editor.Video.Vimeo = (function(V,$,undefined){
	
	var carrouselDivId = "tab_video_vimeo_content_carrousel";
	var previewDivId = "tab_video_vimeo_content_preview";
	var queryMaxMaxNumberYoutubeVideo= 20; //maximum video query for youtube API's (999 max)
	var currentVideos = new Array(); //to videoID param
	var selectedVideo = null;
	
	var init = function(){
		var myInput = $("#tab_video_vimeo_content").find("input[type='search']");
	  $(myInput).watermark('Search content');
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
		VISH.Debugging.log("entra en requesVimeoData");
		var url_vimeo = "http://gdata.youtube.com/feeds/api/videos?q="+text+"&alt=json-in-script&callback=?&max-results="+queryMaxMaxNumberYoutubeVideo+"&start-index=1";	 
		jQuery.getJSON(url_youtube,function (data) {
			_onDataReceived(data);
		});
	};

	var _onDataReceived = function(data) {
		VISH.Debugging.log("entra en _onDataReceived");
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
  };

}) (VISH, jQuery);
