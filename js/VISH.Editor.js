VISH.Editor = (function(V,$,undefined){
	
	//hash to store current_el that will be the zone of the template that the user has clicked
	var params = {
		current_el : null 	
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
		$(document).on('click','#textthumb', _launchTextEditor);

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
	
	/**
	 * function called when user clicks on save
	 * Generates the json for the current slides
	 * covers the section element and every article inside
	 * finally calls SlideManager with the generated json
	 */
	var _onSaveButtonClicked = function(){
		var excursion = [];
		var slide = {};
		$('article').each(function(index,s){
			slide.id = ''; //TO-DO what if saved before!
			slide.template = $(s).attr('template');
			slide.elements = [];
			var element = {};
			$(s).find('div').each(function(i,div){
				//to remove all the divs of the sliders, only consider the final boxes
				if($(div).attr("areaid") !== undefined){
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
			excursion.push(slide);
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
		addSlide(V.Dummies.getDummy($(this).attr('template')));		
		
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
		$(this).html($("#menuselect").clone());	 //need to clone it, because we need to show it many times, not only the first one
		
		$("a#addpicture").fancybox({
			"onStart"  : function(data) {
			loadTab('tab_pic_from_url');
		}
		});
		$("a#addflash").fancybox({
			"onStart"  : function(data) {
			loadTab('tab_flash_from_url');
		}
		});
		$("a#addvideo").fancybox({
			"onStart"  : function(data) {
			loadTab('tab_video_from_url');
		}
		});
	};
	
	/**
	 * Allows users to include text content in the slide using a WYSIWYG editor
	 */
	var _launchTextEditor = function(event){
		params['current_el'].attr('type','text');
		params['current_el'].html("aqui iria el codigo del wysiwyg");		
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
		params['current_el'].html("<img class='"+template+"_image' id='"+idToDragAndResize+"' title='Click to drag' src='"+image_url+"' />");
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
	
	/**
	 * Removes the smoke box
	 */
	var _closeFancybox = function(){
		$.fancybox.close();
	};

	return {
		init			: init,
		getValueFromFancybox    : getValueFromFancybox
	};

}) (VISH, jQuery);
