VISH.Editor.Video.Youtube = (function(V,$,undefined){
	
	var carrouselDivId = "tab_video_youtube_content_carrousel";
	var previewDivId = "tab_video_youtube_content_preview";
	var queryMaxMaxNumberYoutubeVideo= 20; //maximum video query for youtube API's (999 max)
	var currentVideos = new Array(); //to videoID param
	var selectedVideo = null;
	
	var init = function(){
		var myInput = $("#tab_video_youtube_content").find("input[type='search']");
	  	$(myInput).watermark('Search content');
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
		        	VISH.Editor.Video.Youtube.requestYoutubeData($(myInput).val());
		          	$(myInput).blur();
			}
		});
	};

	
	var onLoadTab = function(){
		var previousSearch = ($("#tab_video_youtube_content").find("input[type='search']").val() != "");
		if(!previousSearch) {
			_cleanVideoPreview();
		}
	};

	
    /*
	 Request videos to Youtube API
	 */	
	var requestYoutubeData = function(text){
		var url_youtube = "http://gdata.youtube.com/feeds/api/videos?q="+text+"&alt=json-in-script&callback=?&max-results="+queryMaxMaxNumberYoutubeVideo+"&start-index=1";	 
		jQuery.getJSON(url_youtube,function (data) {
			_onDataReceived(data);
		});
	};

	var _onDataReceived = function(data) {
		//Clean previous content
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		//clean previous preview if any
		_cleanVideoPreview();

		//Clean previous videos
		currentVideos = new Array();

		var content = "";

		if(data.feed.entry==0){
			$("#" + carrouselDivId).html("No results found.");
		} else{ 
			$.each(data.feed.entry, function(i, item) {
				var video = item['id']['$t'];
			    var title = item['title']['$t']; //not used yet
				var author = item.author[0].name.$t;
				var subtitle = item.media$group.media$description.$t;

			    video=video.replace('http://gdata.youtube.com/feeds/api/videos/', 'http://www.youtube.com/watch?v='); //replacement of link
			    var videoID = video.replace('http://www.youtube.com/watch?v=', ''); //removing link and getting the video ID
				//url's video thumbnail 
	        	currentVideos[videoID] = new Object();
			    currentVideos[videoID].id = videoID;
	        	currentVideos[videoID].title = title;
	        	currentVideos[videoID].author = author;
	        	currentVideos[videoID].subtitle = subtitle;

	        	var image_url = "http://img.youtube.com/vi/"+videoID+"/0.jpg" ;
	        	content = content + '<div><img videoID="'+videoID+'" src="'+image_url+'" /></div>'
			});
			
			$("#" + carrouselDivId).html(content);
			VISH.Editor.Carrousel.createCarrousel(carrouselDivId, 1, VISH.Editor.Video.Youtube.onClickCarrouselElement);
		}
	};

	
  
  var addSelectedVideo = function() {
	if(selectedVideo != null) {
	
		
		VISH.Editor.Object.drawObject(_generateWrapper(selectedVideo));
		$.fancybox.close();
	}
  };


  /** 
   * Funcion to show a preview youtube video and select to embed into the zone
   * video_id    
*/
  var onClickCarrouselElement = function(event) {
    var videoId = $(event.target).attr("videoID");
    var video_embedded = "http://www.youtube.com/embed/"+ videoId;
    
	var renderedIframe = '<iframe class="preview_video" type="text/html" style="width:350px; height:195px; " src="'+video_embedded+'?wmode=transparent" frameborder="0"></iframe>';
	_renderVideoPreview(renderedIframe, currentVideos[videoId]);
	selectedVideo = currentVideos[videoId];	
  };

  
  var _renderVideoPreview = function(renderedIframe, video) {
	var videoArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_video");
	var metadataArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_metadata");
	var button = $("#" + previewDivId).find(".okButton");
	$(videoArea).html("");
	$(metadataArea).html("");
	if((renderedIframe) && (video)) {
		$(videoArea).append(renderedIframe);
		var table = _generateTable(video.author, video.title, video.description);
		$(metadataArea).html(table);
		$(button).show();
	}
  };
  
  
  var _cleanVideoPreview = function() {
	var videoArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_video");
	var metadataArea = $("#" + previewDivId).find("#tab_video_youtube_content_preview_metadata");
	var button = $("#" + previewDivId).find(".okButton");
	$(videoArea).html("");
	$(metadataArea).html("");
	$(button).hide();
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

  
 var _generateWrapper = function (video) {
   var videoID = video.id;
   var video_embedded = "http://www.youtube.com/embed/"+videoID;
   current_area=  VISH.Editor.getCurrentArea();
 var width_height = VISH.SlidesUtilities.dimentionToDraw(
   	  current_area.width(), current_area.height(), 325, 243 );
   	   
   var wrapper = "<iframe src='"+video_embedded+"?wmode=transparent' frameborder='0' style='width:"+width_height.width+ "px; height:"+ width_height.height+ "px;'></iframe>";
   return wrapper;
 }


 
  return {
	init		  			: init,
	onLoadTab	  			: onLoadTab,
	onClickCarrouselElement : onClickCarrouselElement, 
	requestYoutubeData      : requestYoutubeData,
	addSelectedVideo		: addSelectedVideo
	
	
  };

}) (VISH, jQuery);
