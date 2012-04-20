VISH.Editor.Video.Youtube = (function(V,$,undefined){
	
	var carrouselDivId = "tab_video_youtube_content_carrousel";
	var queryMaxMaxNumberYoutubeVideo= 20; //maximum video query for youtube API's (999 max)
	var hash_youtube_video_id = new Array(); //to videoID param
	//add event to input
	var init = function(){
		var myInput = $("#tab_video_youtube_content").find("input[type='search']");
	  	$(myInput).watermark('Search content');

		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
		        	VISH.Editor.Video.Youtube.listVideo($(myInput).val());
		          	$(myInput).blur();
			}
	
		});

};

	//function that is called when tab loads
	var onLoadTab = function(){

    		$("#youtube_preview").remove();
		$("#preview_video_button").remove();
		$("#youtube_preview_metadata").remove();
		$("#youtube_text_to_search").attr("value","");
	
		
    //clean carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId); 
var myInput = $("#tab_video_youtube_content").find("input[type='search']");
	  	$(myInput).watermark('Search content');


	//adding input search type
		
	};


  /** 
   * Funcion to get an youtube video and embed into the zone
   */
  var drawYoutubeVideo = function (video_id) {
  	//default value
  	var height = 243;
 	var template = VISH.Editor.getTemplate();
	var current_area = VISH.Editor.getCurrentArea();
	
	//for 
	var width = current_area.width();
	
	var nextVideoId = VISH.Editor.getId();
	var idToDrag = "draggable" + nextVideoId;
	//var nextFlashId = VISH.Editor.getId();
    $.fancybox.close();
    
    
    
    //generate embed for the video
	//it depends on the dimension of the current_area
	var video_embedded = "http://www.youtube.com/embed/"+video_id;
	
	//TODO take a better decission to drag or not to drag, not only bigger than 400
	if (width > 400) { //no draggable & full area
		
		var height = current_area.height();
		var final_video = "<iframe type='text/html' class='"+template+"_video'  style='width:"+ width +"px; height:"+height+
    "px;' src='"+video_embedded+"?wmode=transparent' frameborder='0'></iframe>";
    
	} 
	else if (width <= 400) { //draggable 
	var height_drag = height + 40;	
    var final_video = "<div id='"+idToDrag+"' style='background-color:red; width:"+ width +"px; height:"+height_drag+
    "px;'><iframe type='text/html' class='"+template+"_video'  style='width:"+ width +"px; height:"+height+
    "px;' src='"+video_embedded+"?wmode=transparent' frameborder='0'></iframe></div>";
   }
    //insert embed in zone
	
    current_area.addClass('iframeelement');
    current_area.attr('type', 'iframe');
    
    //set class of article to iframe to load and unload the video when entering and leaving the slide
    current_area.parent().addClass('iframe');
    //save the src in the element to load and unload the content
    current_area.attr('src', final_video);
    
   
    current_area.html(final_video);
    //make draggable the div 
    $("#" + idToDrag).draggable({cursor: "move"});
    
    V.Editor.addDeleteButton(current_area);
  };


  
  /** 
   * Funcion to show a preview youtube video and select to embed into the zone
   * video_id    
*/
  var showYoutubeVideo = function(e) {
    //generate embed for the preview video
	console.log("entra en showYTVideo");
    var video_embedded = "http://www.youtube.com/embed/"+ hash_youtube_video_id[e.target.id];
    var title =  hash_youtube_video_id["title"+e.target.id.replace("vid","")]; //
    var author = hash_youtube_video_id["author"+e.target.id.replace("vid","")];
    var subtitle = hash_youtube_video_id["subtitle"+e.target.id.replace("vid","")];

	var final_video = '<iframe class="youtube_frame" type="text/html" style="width:350px; height:195px; " src="'+video_embedded+'?wmode=transparent" frameborder="0"></iframe>';
    $("#youtube_preview").html(final_video);
    if($("#preview_video_button")){
   	 $("#preview_video_button").remove();    
    }
  //  $("#tab_video_youtube_content").append('<button class="okButton" id="preview_video_button" onclick="VISH.Editor.Video.Youtube.drawYoutubeVideo(\''+hash_youtube_video_id[e.target.id]+'\')" >add this video</button>'); 
    $("#tab_video_youtube_content").children(".box1fancy2").append('<button class="okButton" id="preview_video_button" onclick="VISH.Editor.Video.Youtube.drawYoutubeVideo(\''+hash_youtube_video_id[e.target.id]+'\')" >add this video</button>');
	var table = _generateTable(author,title,subtitle);
	$("#youtube_preview_metadata").html(table);

};





/*
(New) Will list the videos finded that match with the term wrote
*/

var listVideo = function(text){
	$("#youtube_preview").remove();	
	$("#preview_video_button").remove();
	$("#youtube_preview_metadata").remove();

    //clean carrousel
	VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);    

 
		
	var template = VISH.Editor.getParams()['current_el'].parent().attr('template');
    	
	var url_youtube = "http://gdata.youtube.com/feeds/api/videos?q="+text+"&alt=json-in-script&callback=?&max-results="+queryMaxMaxNumberYoutubeVideo+"&start-index=1";
	
//adding content searchForm 
  
	jQuery.getJSON(url_youtube,function (data) {

		$.each(data.feed.entry, function(i, item) {


			 var video = item['id']['$t'];
		        var title = item['title']['$t']; //not used yet
			var author = item.author[0].name.$t;
			var subtitle = item.media$group.media$description.$t;

		        video=video.replace('http://gdata.youtube.com/feeds/api/videos/', 'http://www.youtube.com/watch?v='); //replacement of link

		        videoID=video.replace('http://www.youtube.com/watch?v=', ''); //removing link and getting the video ID
			//url's video thumbnail 
        		hash_youtube_video_id["vid"+i] = videoID;
        		hash_youtube_video_id["title"+i] = title;
        		hash_youtube_video_id["author"+i] = author;
        		hash_youtube_video_id["subtitle"+i] = subtitle;
			
			

        		var image_url = "http://img.youtube.com/vi/"+videoID+"/0.jpg" ;
			
			$("#" + carrouselDivId).append('<img id="vid'+i+'" src="'+image_url+'" />');

		});
//call createCarrousel ( div_Carrousel_id, 1 , callbackFunction)

	VISH.Editor.Carrousel.createCarrousel (carrouselDivId, 1, VISH.Editor.Video.Youtube.showYoutubeVideo);


	});

 //draw an empty div to preview the youtube video

 //$("#tab_video_youtube_content").append('<div id="youtube_preview" ></div>');
$("#tab_video_youtube_content").children(".box1fancy2").append('<div id="youtube_preview" style="z-index:+1;"></div>');
 //draw an empty div to draw a table with the youtube's video metadata content
 //$("#tab_video_youtube_content").append('<div id="youtube_preview_metadata"></div>');
$("#tab_video_youtube_content").children(".box1fancy2").append('<div id="youtube_preview_metadata" style="z-index:+1;"></div>');
};


	var _generateTable = function(author,title,description){
		
		if(!author){
		  author = "";
		}
		if(!title){
		  title = "";
		}
		if(!description){
		  description = "";
		}
		
		return "<table class=\"metadata\">"+
		  "<tr class=\"even\">" +
		    "<td class=\"title header_left\">Author</td>" + 
		    "<td class=\"title header_right\"><div class=\"height_wrapper\">" + author + "</div></td>" + 
		  "</tr>" + 
		  "<tr class=\"odd\">" + 
		  	"<td class=\"title\">Title</td>" + 
		    "<td class=\"info\"><div class=\"height_wrapper\">" + title + "</div></td>" + 
		  "</tr>" + 
		  "<tr class=\"even\">" + 
		    "<td colspan=\"2\" class=\"title_description\">Description</td>" + 
		  "</tr>" + 
		  "<tr class=\"odd\">" + 
		  	"<td colspan=\"2\" class=\"info_description\"><div class=\"height_wrapper_description\">" + description + "</div></td>" + 
		  "</tr>" + 
		"</table>";
	}




	return {
		init		  : init,
		onLoadTab	  : onLoadTab,
		drawYoutubeVideo  : drawYoutubeVideo,
		showYoutubeVideo  : showYoutubeVideo, 
		
		listVideo         : listVideo
		
	};

}) (VISH, jQuery);
