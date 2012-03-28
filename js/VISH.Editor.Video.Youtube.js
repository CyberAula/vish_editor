VISH.Editor.Video.Youtube = (function(V,$,undefined){
	
	var carrouselDivId = "tab_video_youtube_content_carrousel";
	var queryMaxMaxNumberYoutubeVideo= 20; //maximum video query for youtube API's (999 max)
	var hash_youtube_video_id = new Array(); //to videoID param
	
	var onLoadTab = function(){
   // $("#ytb_slider_content").remove();
    		$("#youtube_preview").remove();
		$("#preview_video_button").remove();
    //clean carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId); 
	//adding input search type
		var myInput = $("#tab_video_youtube_content").find("input[type='search']");
	  	$(myInput).watermark('Search content');
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
		        	VISH.Editor.Video.Youtube.listVideo($(myInput).val());
		          	$(myInput).blur();
			}
	
		});
	};


  /** 
   * Funcion to get an youtube video and embed into the zone
   */
  var drawYoutubeVideo = function (video_id) {
 	var template = VISH.Editor.getTemplate();
	var current_area = VISH.Editor.getCurrentArea();

	var nextVideoId = VISH.Editor.getId();
    $.fancybox.close();
    //generate embed for the video
    var video_embedded = "http://www.youtube.com/embed/"+video_id;
    var final_video = "<div id='youtube_"+nextVideoId+"' class='iframe_youtube' src='"+video_embedded+"?wmode=transparent' ><iframe type='text/html' class='"+template+"_video'  style='width:324px; height:243px;' src='"+video_embedded+"?wmode=transparent' frameborder='0'></iframe></div>";
    //insert embed in zone
		var current_area = VISH.Editor.getCurrentArea();
    current_area.attr('type','iframe');
   
    current_area.html(final_video);
  };


  
  /** 
   * Funcion to show a preview youtube video and select to embed into the zone
   * video_id    
*/
  var showYoutubeVideo = function(e) {
    //generate embed for the preview video
	
    var video_embedded = "http://www.youtube.com/embed/"+ hash_youtube_video_id[e.target.id];
    var final_video = '<iframe class="youtube_frame" type="text/html" style="width:300px; height:225px; padding-top:10px;" src="'+video_embedded+'?wmode=transparent" frameborder="0"></iframe>';
    $("#youtube_preview").html(final_video);
    if($("#preview_video_button")){
   	 $("#preview_video_button").remove();    
    }
    $("#tab_video_youtube_content").append('<button id="preview_video_button" onclick="VISH.Editor.Video.Youtube.drawYoutubeVideo(\''+hash_youtube_video_id[e.target.id]+'\')" >add this video</button>'); 
  };





/*
(New) Will list the videos finded that match with the term wrote
*/

var listVideo = function(text){
	$("#youtube_preview").remove();	
$("#preview_video_button").remove();
    //clean carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);     
		
	var template = VISH.Editor.getParams()['current_el'].parent().attr('template');
    	
	var url_youtube = "http://gdata.youtube.com/feeds/api/videos?q="+text+"&alt=json-in-script&callback=?&max-results="+queryMaxMaxNumberYoutubeVideo+"&start-index=1";
	
//adding content searchForm 
  
	jQuery.getJSON(url_youtube,function (data) {

		$.each(data.feed.entry, function(i, item) {


		        var title = item['title']['$t']; //not used yet
		
		        var video = item['id']['$t'];



		        video=video.replace('http://gdata.youtube.com/feeds/api/videos/', 'http://www.youtube.com/watch?v='); //replacement of link

		        videoID=video.replace('http://www.youtube.com/watch?v=', ''); //removing link and getting the video ID
	//url's video thumbnail 
        		hash_youtube_video_id["vid"+i] = videoID;
			

        		var image_url = "http://img.youtube.com/vi/"+videoID+"/0.jpg" ;
			
			$("#" + carrouselDivId).append('<img id="vid'+i+'" src="'+image_url+'" />');

		});
//call createCarrousel ( div_Carrousel_id, 1 , callbackFunction)

	VISH.Editor.Carrousel.createCarrousel (carrouselDivId, 1, VISH.Editor.Video.Youtube.showYoutubeVideo);


	});

 //draw an empty div to preview the youtube video

 $("#tab_video_youtube_content").append('<div id="youtube_preview" style="width:300px; height:240px; padding-left:30%;"></div>');

};



	return {
		onLoadTab	  : onLoadTab,
		drawYoutubeVideo  : drawYoutubeVideo,
		showYoutubeVideo  : showYoutubeVideo, 
		
		listVideo         : listVideo
		
	};

}) (VISH, jQuery);
