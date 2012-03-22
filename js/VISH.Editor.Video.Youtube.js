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
	
	}
	


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
    var final_video = "<iframe type='text/html' class='"+template+"'_video'  style='width:324px; height:243px;' src='"+video_embedded+"?wmode=transparent' frameborder='0'></iframe>";
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


 // function to draw Youtube video slider (draw 5 video thumbnails)
  var drawYoutubeSlides = function (page) {
  
    if (vid_array.length==0) {
      console.log("empty array"); //
    } 
    else {
      var count = 0;
      count = (page*5+1)-5;
      
      $(".ytb_slide").remove(); 
      var i;
      
      for (i=1;i<=5 ;i++) {
        
        $("#vid_"+i).append(vid_array[count]);
        count+=1;
      }
  //add page number (each page contents 5 slides)
    var tot_num_pag = queryMaxMaxNumberYoutubeVideo/5;
      
      
    var prev = parseInt(page)-1;    
    
    $("#a_prev_but_ytb").attr("href", 'javascript:VISH.Editor.Video.Youtube.drawYoutubeSlides(\''+ prev+'\')');
    var next = parseInt(page)+1;
    $("#a_next_but_ytb").attr("href", 'javascript:VISH.Editor.Video.Youtube.drawYoutubeSlides(\''+next+'\')');
    //no action preview button if fisrt page
    if (page==1) { 
      $("#a_prev_but_ytb").attr("href", 'javascript:void(0)');
    }
    
        //no action next button if last page
    else if (page==tot_num_pag) { 
      $("#a_next_but_ytb").attr("href", 'javascript:void(0)');
    }
  }
}


/*
(New) Will list the videos finded that match with the term wrote
*/
var listVideo = function(id){
		    
	var term = $('#' + id).val();		
	var template = VISH.Editor.getParams()['current_el'].parent().attr('template');
    	
	var url_youtube = "http://gdata.youtube.com/feeds/api/videos?q="+term+"&alt=json-in-script&callback=?&max-results="+queryMaxMaxNumberYoutubeVideo+"&start-index=1";
	
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
		drawYoutubeSlides : drawYoutubeSlides,
		listVideo         : listVideo,
		
	};

}) (VISH, jQuery);
