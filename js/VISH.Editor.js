VISH.Editor = (function(V,$,undefined){
	
	// Hash to store: 
	// current_el that will be the zone of the template that the user has clicked
	// current_editor that will be the wysiwyg editor that the user is managing
	var params = {
		current_el : null,
		current_editor : null
	};
	
	var nextImageId = 0;  //number for next image id and its slider to resize it
	
	/**
	 * Initializes the VISH editor
	 * adds the listeners to the click events in the different images and buttons
	 */
	var init = function(){		
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
					slide.elements.push(element);
					element = {};
				}
			});
			excursion.slides.push(slide);
			slide = {};
		});
		var jsonexcursion = JSON.stringify(excursion);
		console.log(jsonexcursion);
		$('article').remove();
		$('#menubar').remove();
		V.SlideManager.init(excursion);
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
		params['current_el'].attr('type','text');
		params['current_el'].html("<textarea id='input' name='input'></textarea><button id='save_wysiwyg'type='button'>Save text</button>");
		params['current_editor'] = $("#input").cleditor({
          width:        params['current_el'].width(), // width not including margins, borders or padding
          height:       params['current_el'].height()-40, // height not including margins, borders or padding
          controls:     // controls to add to the toolbar
                        "bold italic underline strikethrough subscript superscript | font size " +
                        "style | color highlight removeformat | bullets numbering | outdent " +
                        "indent | alignleft center alignright justify | rule image link unlink ",
          colors:       // colors in the color popup
                        "FFF FCC FC9 FF9 FFC 9F9 9FF CFF CCF FCF " +
                        "CCC F66 F96 FF6 FF3 6F9 3FF 6FF 99F F9F " +
                        "BBB F00 F90 FC6 FF0 3F3 6CC 3CF 66C C6C " +
                        "999 C00 F60 FC3 FC0 3C0 0CC 36F 63F C3C " +
                        "666 900 C60 C93 990 090 399 33F 60C 939 " +
                        "333 600 930 963 660 060 366 009 339 636 " +
                        "000 300 630 633 330 030 033 006 309 303",    
          fonts:        // font names in the font popup
                        "Arial,Arial Black,Comic Sans MS,Courier New,Narrow,Garamond," +
                        "Georgia,Impact,Sans Serif,Serif,Tahoma,Trebuchet MS,Verdana",
          sizes:        // sizes in the font size popup
                        "1,2,3,4,5,6,7",
          styles:       // styles in the style popup
                        [["Paragraph", "<p>"], ["Header 1", "<h1>"], ["Header 2", "<h2>"],
                        ["Header 3", "<h3>"],  ["Header 4","<h4>"],  ["Header 5","<h5>"],
                        ["Header 6","<h6>"]],
          useCSS:       false, // use CSS to style HTML when possible (not supported in ie)
          docType:      // Document type contained within the editor
                        '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
          docCSSFile:   // CSS file used to style the document contained within the editor
                        "", 
          bodyStyle:    // style to assign to document body contained within the editor
                        "margin:4px; font:10pt Arial,Verdana; cursor:text"
        });
		// when the button is pressed the text and the html code from the wysiwyg editor are saved
		// TODO: save the text in a JSON file
		$("#save_wysiwyg").click(function(){
        	params['current_editor'][0].select();
        	var text = params['current_editor'][0].selectedText();
        	var htmlText = params['current_editor'][0].selectedHTML();
        });
	};

	
	/**
	 * Function to draw an image in a zone of the template
	 * the zone to draw is the one in params['current_el']
	 * this function also adds the slider and makes the image draggable
	 */
	var _drawImageInZone = function(image_url){
		var template = params['current_el'].parent().attr('template');

		var idToDragAndResize = "draggable" + nextImageId;
		params['current_el'].attr('type','image');
		params['current_el'].html("<img class='"+template+"_image' id='"+idToDragAndResize+"' title='Click to drag' src='"+image_url+"' /><div class='edit_pencil'><img class='edit_pencil_img' src='images/edit.png'/></div>");
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
		showYoutubeVideo		: showYoutubeVideo
	};

}) (VISH, jQuery);
