VISH.Editor.Video.Youtube = (function(V,$,undefined){
	
	var queryMaxMaxNumberYoutubeVideo= 20; //maximum video query for youtube API's (999 max)
	var vid_array = new Array(); //to manage video slider
	
	var onLoadTab = function(){
    $("#ytb_slider_content").remove();
    $("#youtube_preview").remove();
    $("#preview_video_button").remove();
	}
	
	var onClickCarrouselElement = function(){
		console.log("onClickCarrouselElement! in VISH.Editor.Video.Youtube!")
	}

  /** 
   * Funcion to get an youtube video and embed into the zone
   */
  var drawYoutubeVideo = function (video_id) {
    $.fancybox.close();
    //generate embed for the video
    var video_embedded = "http://www.youtube.com/embed/"+video_id;
    var final_video = "<iframe type='text/html' style='width:324px; height:243px;' src='"+video_embedded+"?wmode=transparent' frameborder='0'></iframe>";
    //insert embed in zone
		var current_area = VISH.Editor.getCurrentArea();
    current_area.attr('type','iframe');
    current_area.html(final_video);
  };


  
  /** 
   * Funcion to show a preview youtube video and select to embed into the zone
   */
  var showYoutubeVideo = function(video_id) {
    //generate embed for the preview video
    var video_embedded = "http://www.youtube.com/embed/"+video_id;
    var final_video = '<iframe class="youtube_frame" type="text/html" style="width:300px; height:225px; padding-top:10px;" src="'+video_embedded+'?wmode=transparent" frameborder="0"></iframe>';
    $("#youtube_preview").html(final_video);
    if($("#preview_video_button")){
    $("#preview_video_button").remove();    
    }
     $("#tab_video_youtube_content").append('<button id="preview_video_button" onclick="VISH.Editor.Video.Youtube.drawYoutubeVideo(\''+video_id+'\')" >add this video</button>');
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
Will list the videos finded that match with the term wrote
*/

  var listVideo = function(id){
		    
		var term = $('#' + id).val();		
    var template = VISH.Editor.getParams()['current_el'].parent().attr('template');
    
    //remove preview elements
    if ($("#ytb_slider_content")) {
      $("#ytb_slider_content").remove();

    }
    if($("#preview_video_button")){
      $("#preview_video_button").remove();    
    }
    if($("#youtube_preview")){
      $("#youtube_preview").remove();   
    }
    
    var url_youtube = "http://gdata.youtube.com/feeds/api/videos?q="+term+"&alt=json-in-script&callback=?&max-results="+queryMaxMaxNumberYoutubeVideo+"&start-index=1";
    /*adding div for sliding */
    $("#tab_video_youtube_content").append('<div id="ytb_slider_content"> </div>'); 
    $("#ytb_slider_content").append('<ul id="ul_ytb_vid"></ul>');
/* trying do slider  */
    $("#ul_ytb_vid").append('<li id="prev_but_ytb" style="width:40px;  "><a id="a_prev_but_ytb" ><img src="images/arrow_left_strech.png"  /></a></li>');    
    $("#ul_ytb_vid").append('<li id="vid_1"></ul>');
    $("#ul_ytb_vid").append('<li id="vid_2"></ul>');
    $("#ul_ytb_vid").append('<li id="vid_3"></ul>');
    $("#ul_ytb_vid").append('<li id="vid_4"></ul>');
    $("#ul_ytb_vid").append('<li id="vid_5"></ul>');
    $("#ul_ytb_vid").append('<li id="next_but_ytb" style="width:40px;  "><a id="a_next_but_ytb"><img src="images/arrow_right_strech.png"  /></a></li>');

    
  //adding content searchForm 
  
    jQuery.getJSON(url_youtube,function (data) {

      $.each(data.feed.entry, function(i, item) {
        var title = item['title']['$t'];
//console.log("title es: "+title);
        var video = item['id']['$t'];
        

        video=video.replace('http://gdata.youtube.com/feeds/api/videos/', 'http://www.youtube.com/watch?v='); //replacement of link
        videoID=video.replace('http://www.youtube.com/watch?v=', ''); //removing link and getting the video ID
//url's video thumbnail 
        var image_url = "http://img.youtube.com/vi/"+videoID+"/0.jpg" ;
      
//new way for slidding using array like a container 
        vid_array[i+1]='<div class="ytb_slide" style="width:100%; height:100%;"><a href="javascript:VISH.Editor.Video.Youtube.showYoutubeVideo(\''+videoID+'\')" id="link_'+i+' "><img id="img_'+i+'" src="'+image_url+'" width=130px height="97px"></a></div>';
    
      });

//call to the function that draws five video slides and paginates them

    drawYoutubeSlides(1); 
    //use drawYouTubeSlides (number of page to draw) 
    
    });
    //draw an empty div to preview the youtube video
    $("#tab_video_youtube_content").append('<div id="youtube_preview" style="width:300px; height:350px; padding-left:30%;"></div>');

};




	return {
		onLoadTab					: onLoadTab,
		drawYoutubeVideo   : drawYoutubeVideo,
		showYoutubeVideo  : showYoutubeVideo, 
		drawYoutubeSlides : drawYoutubeSlides,
		listVideo         : listVideo,
		onClickCarrouselElement : onClickCarrouselElement
	};

}) (VISH, jQuery);
