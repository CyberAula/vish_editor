VISH.Editor = (function(V,$,undefined){
	var initOptions;
	
	// Hash to store: 
	// current_el that will be the zone of the template that the user has clicked
	// current_editor that will be the wysiwyg editor that the user is managing
	var params = {
		current_el : null,
	};
	
	var nextImageId = 0;  //number for next image id and its slider to resize it
	var domId = 0;  //number for next doom element id and its slider to resize it
	
	var myNicEditor; // to manage the NicEditor WYSIWYG
	
	/**
	 * Initializes the VISH editor
	 * adds the listeners to the click events in the different images and buttons
	 */
	var init = function(options){
		initOptions = options;
				
		$("a#addslide").fancybox();		
		$(document).on('click','.templatethumb', _onTemplateThumbClicked);
		$(document).on('click','#save', _onSaveButtonClicked);
		$(document).on('click','.editable', _onEditableClicked);
		$(document).on('click','.edit_pencil', _onEditableClicked);
		$(document).on('click','.textthumb', _launchTextEditor);
		$(document).on('click','#youtube_search_button', _listVideo);
		var evt = document.createEvent("Event");
		evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
		document.dispatchEvent(evt);	
	};
	
		
  /**
   * Return a unic id.
   */
	var getNewId = function(){
		domId = domId +1;
		return "unicID_" + domId;
	}

	/**
	 * Function to get a value from the id in the dom and draw it in the zone in params['current_el']
	 */
	var getValueFromFancybox = function(id_to_get){
		$.fancybox.close();
		_drawImageInZone($("#"+id_to_get).val());
		//delete the value
		$("#"+id_to_get).val("");
	};


	/** Funcion to get an youtube video and embed into the zone
	**/

	var getYoutubeVideo = function (video_id) {
		$.fancybox.close();
		//generate embed for the video
		var video_embedded = "http://www.youtube.com/embed/"+video_id;
		var final_video = '<iframe type="text/html"style="width:400px; height:300px;" src="'+video_embedded+'" frameborder="0"></iframe>';
		//insert embed in zone
		params['current_el'].attr('type','flash');
		params['current_el'].html(final_video);
		
	};
	/** Funcion to show a preview youtube video and select to embed into the zone
	**/

	var showYoutubeVideo = function(video_id) {
		//generate embed for the preview video
		var video_embedded = "http://www.youtube.com/embed/"+video_id;
		var final_video = '<iframe type="text/html" style="width:300px; height:225px;"" src="'+video_embedded+'" frameborder="0"></iframe>';
		$("#youtube_preview").html(final_video);
		
		 $("#tab_video_youtube_content").append('<button id="preview_video_button" onclick="VISH.Editor.getYoutubeVideo(\''+video_id+'\')" >add this video</button>');
	};

	/**
	 * function to load a tab and its content in the fancybox
	 */
	var loadTab = function (tab_id){
	    //deselect all of them
	    $(".fancy_tab").removeClass("fancy_selected");
	    //select the correct one
	    $("#" + tab_id).addClass("fancy_selected");
	    
	    //hide previous tab
	    $(".fancy_tab_content").hide();
	    //show content
	    $("#" + tab_id + "_content").show();
	};

	/**
	 * function called when user clicks on save
	 * Generates the json for the current slides
	 * covers the section element and every article inside
	 * finally calls SlideManager with the generated json
	 */
	var _onSaveButtonClicked = function(){
		var excursion = {};
		//TODO decide this params
		excursion.id = '';
		excursion.title = '';
		excursion.description = '';
		excursion.author = '';
		excursion.slides = [];
		var slide = {};
		$('article').each(function(index,s){
			slide.id = $(s).attr('id'); //TODO what if saved before!
			slide.template = $(s).attr('template');
			slide.elements = [];
			var element = {};
			$(s).find('div').each(function(i,div){
				//to remove all the divs of the sliders, only consider the final boxes
				if($(div).attr("areaid") !== undefined){
					element.id     = $(div).attr('id');
					element.type   = $(div).attr('type');
					element.areaid = $(div).attr('areaid');
					if(element.type==="text"){
						element.body   = $(div).html();
					} else if(element.type==="image"){
						element.body   = $(div).find('img').attr('src');
						element.style  = $(div).find('img').attr('style');
					}
				}
			});
			excursion.slides.push(slide);
			slide = {};
		});
		var jsonexcursion = JSON.stringify(excursion);
		console.log(jsonexcursion);
		
		//$('article').remove();
		//$('#menubar').remove();
		//V.SlideManager.init(excursion);
		
		//POST to http://server/excursions/
		
		var params = {
			"excursion[json]": jsonexcursion,
			"authenticity_token" : initOptions["token"]
		}
		
		$.post(initOptions["postPath"], params, function(data) {
	      	alert("Return data: " + data);
	    });
		
	};

	/**
	 * function to dinamically add a css
	 */
	var _loadCSS = function(path){
		$("head").append("<link>");
		css = $("head").children(":last");
		css.attr({
			rel:  "stylesheet",
			type: "text/css",
			href: path
		});
	};

	/**
	 * function called when user clicks on template
	 * Includes a new slide following the template selected
	 */
	var _onTemplateThumbClicked = function(event){
		var slide = V.Dummies.getDummy($(this).attr('template'));
		
		addSlide(slide);		
		
		_closeFancybox();
		
		var evt = document.createEvent("Event");
		evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
		document.dispatchEvent(evt);
		setTimeout("lastSlide()", 300);
	};

	/**
	 * function called when user clicks on an editable element
	 * Event launched when an editable element belonging to the slide is clicked
	 */
	var _onEditableClicked = function(event){
		//first remove the "editable" class because we are going to add clickable icons there and we don´t want it to be editable any more
		$(this).removeClass("editable");
		params['current_el'] = $(this);
		
		//need to clone it, because we need to show it many times, not only the first one
		//so we need to remove its id		
		var content = $("#menuselect").clone().attr('id','');
		//add zone attr to the a elements to remember where to add the content
		content.find("a").each(function(index, domElem) {
			$(domElem).attr("zone", params['current_el'].attr("id"));
		});
		
		$(this).html(content);
		
		$("a.addpicture").fancybox({
			"onStart"  : function(data) {
				//re-set the params['current_el'] to the clicked zone, because maybe the user have clicked in another editable zone before this one
				var clickedZoneId = $(data).attr("zone");
				params['current_el'] = $("#" + clickedZoneId);
				loadTab('tab_pic_from_url');
			}
		});
		$("a.addflash").fancybox({
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				params['current_el'] = $("#" + clickedZoneId);
				loadTab('tab_flash_from_url');
			}
		});
		$("a.addvideo").fancybox({
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				params['current_el'] = $("#" + clickedZoneId);
				loadTab('tab_video_from_url');
			}
		});
	};

	

	/**
	 * function called when user clicks on the text thumb
	 * Allows users to include text content in the slide using a WYSIWYG editor
	 */
	var _launchTextEditor = function(event){
		if(myNicEditor == null) {
			myNicEditor = new nicEditor();
        	myNicEditor.setPanel('slides_panel');
		}
		params['current_el'].attr('type','text');
		var wysiwygId = "wysiwyg_" + params['current_el'][0].id;
		var wysiwygWidth = params['current_el'].width() - 10;
		var wysiwygHeight = params['current_el'].height() - 10;
		params['current_el'].html("<div class='wysiwygInstance' id="+wysiwygId+" style='width:"+wysiwygWidth+"px; height:"+wysiwygHeight+"px;'>Insert text here</div>");
		myNicEditor.addInstance(wysiwygId);
		/*$("#"+wysiwygId).keydown(function(e) {
			if(e.keyCode == 39) {
					
			}
		});*/
	}
	
	
	/**
   * Function called when user clicks on import HTML5 video from URL
   * Allows users to paste a HTML5 video from URL
   */
  var pasteHTML5Video = function(input_id){
		_closeFancybox();
		var url = $("#" + input_id).val();
		$("#" + input_id).val("");
		
		//Draw video!
		var template = params['current_el'].parent().attr('template');
    //slide object = params['current_el']

    var nextVideoId = getNewId();
    var idToDragAndResize = "draggable" + nextVideoId;
    params['current_el'].attr('type','video');
		
    var videoTag = document.createElement('video');
    videoTag.setAttribute('id', idToDragAndResize);
    videoTag.setAttribute('class', template + "_video");
    videoTag.setAttribute('title', "Click to drag");
		videoTag.setAttribute('controls', "controls");
		videoTag.setAttribute('preload', "metadata");
		videoTag.setAttribute('poster', "https://github.com/ging/vish_editor/raw/master/images/example_poster_image.jpg");
		var videoSource = document.createElement('source');
		videoSource.setAttribute('src', url);
		var fallbackText = document.createElement('p');
		$(fallbackText).html("Your browser does not support HTML5 video.")
    $(videoTag).append(videoSource)
		$(videoTag).append(fallbackText)
		
		$(params['current_el']).html("");
		$(params['current_el']).append(videoTag)
		
		var editTag = "<div class='edit_pencil'><img class='edit_pencil_img' src='"+VISH.ImagesPath+"/edit.png'/></div>"
		$(params['current_el']).append(editTag)
		
//		params['current_el'].after("<div id='sliderId"+nextVideoId+"' class='theslider'><input id='imageSlider"+nextVideoId+"' type='slider' name='size' value='1' style='display: none; '></div>");      
//    
//    //position the slider below the div with the image
//    var divPos = params['current_el'].position();
//    var divHeight = params['current_el'].height();
//    $("#sliderId"+nextVideoId).css('top', divPos.top + divHeight - 20);
//    $("#sliderId"+nextVideoId).css('left', divPos.left);
//    $("#sliderId"+nextVideoId).css('margin-left', '12px');
//           
//    $("#imageSlider"+nextVideoId).slider({
//      from: 1,
//      to: 8,
//      step: 0.5,
//      round: 1,
//      dimension: "x",
//      skin: "blue",
//      onstatechange: function( value ){
//          $("#" + idToDragAndResize).width(325*value);
//					console.log("onStateChange")
//      }
//    });
    $("#" + idToDragAndResize).draggable({cursor: "move"});
  }

	
	/**
	 * Function to draw an image in a zone of the template
	 * the zone to draw is the one in params['current_el']
	 * this function also adds the slider and makes the image draggable
	 */
	var _drawImageInZone = function(image_url){
		var template = params['current_el'].parent().attr('template');

		var idToDragAndResize = "draggable" + nextImageId;
		params['current_el'].attr('type','image');
		params['current_el'].html("<img class='"+template+"_image' id='"+idToDragAndResize+"' title='Click to drag' src='"+image_url+"' /><div class='edit_pencil'><img class='edit_pencil_img' src='"+VISH.ImagesPath+"/edit.png'/></div>");
		if(params['current_el'].next().attr('class')==="theslider"){
			//already added slider remove it to add a new one
			params['current_el'].next().remove();
		}
		params['current_el'].after("<div id='sliderId"+nextImageId+"' class='theslider'><input id='imageSlider"+nextImageId+"' type='slider' name='size' value='1' style='display: none; '></div>");			
		
		//position the slider below the div with the image
		var divPos = params['current_el'].position();
		var divHeight = params['current_el'].height();
		$("#sliderId"+nextImageId).css('top', divPos.top + divHeight - 20);
		$("#sliderId"+nextImageId).css('left', divPos.left);
		$("#sliderId"+nextImageId).css('margin-left', '12px');
				   
		$("#imageSlider"+nextImageId).slider({
			from: 1,
			to: 8,
			step: 0.5,
			round: 1,
			dimension: "x",
			skin: "blue",
			onstatechange: function( value ){
			    $("#" + idToDragAndResize).width(325*value);
			}
		});
		$("#" + idToDragAndResize).draggable({cursor: "move"});
		nextImageId += 1;
	};




/*
Will list the videos finded that match with the term wrote
*/

	var _listVideo = function(event){
		
		
		console.log("_listVideo!")
		
		var template = params['current_el'].parent().attr('template');	
		
		
		if ($("#searchResultsVideoListTable")) {
			$("#searchResultsVideoListTable").remove();

		}
		var videos= 10; 
		
		var term = $('#youtube_input_text').val();
		
		var url_youtube = "http://gdata.youtube.com/feeds/api/videos?q="+term+"&alt=json-in-script&callback=?&max-results=10&start-index=1";
		
			
	//adding content searchForm 

		$("#tab_video_youtube_content").append('<table id="searchResultsVideoListTable"> </table>');
		$("#searchResultsVideoListTable").append('<tr id="video_row"> </tr>');
		jQuery.getJSON(url_youtube,function (data) {

			$.each(data.feed.entry, function(i, item) {
				var title = item['title']['$t'];
//console.log("title es: "+title);
				var video = item['id']['$t'];
				

				video=video.replace('http://gdata.youtube.com/feeds/api/videos/', 'http://www.youtube.com/watch?v='); //replacement of link
				videoID=video.replace('http://www.youtube.com/watch?v=', ''); //removing link and getting the video ID
//url's video thumbnail 
				var image_url = "http://img.youtube.com/vi/"+videoID+"/0.jpg" ;
			//not used yet
					
				$("#video_row").append('<td><a href="javascript:VISH.Editor.showYoutubeVideo(\''+videoID+'\')" id="link_'+i+' "><img id="img_'+i+'" src="'+image_url+'" width=130px height="97px"></a></td>');
							
				
			});
		});
		//draw an empty div to preview the youtube video
		$("#tab_video_youtube_content").append('<div id="youtube_preview" style="width:300px; height:225px;"></div>');
	};
	

	/**
	 * Removes the lightbox
	 */
	var _closeFancybox = function(){
		$.fancybox.close();
	};

	return {
		init					: init,
		loadTab 				: loadTab,
		getValueFromFancybox    : getValueFromFancybox, 
		getYoutubeVideo			: getYoutubeVideo,
		pasteHTML5Video     : pasteHTML5Video,
		showYoutubeVideo		: showYoutubeVideo
	};

}) (VISH, jQuery);
