VISH.Editor = (function(V,$,undefined){
	
	var params = {
		current_el : null 	
	};

	//buttons bar that is shown at the bottom of the vish editor
	var MENUBAR = "<div id='menubar'>\
	<div class='barbutton' id='add'>\
	</div>\
	<div class='barbutton' id='add'>\
	</div>\
	<div class='barbutton' id='add'>\
	</div>\
	<div class='barbutton' id='add'>\
	</div>\
	<div class='barbutton' id='add'>\
	</div>\
	<div class='barbutton' id='add'>\
	</div>\
	<div class='barbutton' id='add'>\
	</div>\
	<div class='barbutton' id='add'>\
	</div>\
	<div class='barbutton' id='quiz'>\
	</div>\
	<div class='barbutton' id='save'>\
	</div>\
	</div>";
	
	//templates panel that is shown in the lightbox when adding a slide
	var TEMPLATES = "<div id='thumbcontent'><div class='templatethumb' template='1'><img src='/images/templatesthumbs/t1.png' /></div><div class='templatethumb' template='2'><img src='/images/templatesthumbs/t2.png' /></div></div>";                           

	//options menu shown in the lightbox to add text or image to the template
	var EDITORS = "<div class='menu'><div id='textthumb' class='menuicon'><img src='/images/text-editor.png' /></div><div id='picthumb' class='menuicon'><img src='/images/picture-editor.png' /></div></div>";

	//message shown in the lightbox to tell the user it haven´t been implemented yet
	var MESSAGE = "This functionality has not been implemented yet, we are working on it";
	
	var nextImageId = 0;  //number for next image id and its slider to resize it
	
	/**
	 * Initializes the VISH editor
	 * adds the listeners to the click events in the different images and buttons
	 */
	var init = function(){
		//_loadCSS('/assets/editor.css');
		$('body').append(MENUBAR);
		$(document).on('click','.templatethumb', _onTemplateThumbClicked);
		$(document).on('click','#add', _onAddButtonClicked);
		$(document).on('click','#quiz', _onQuizButtonClicked);
		$(document).on('click','#save', _onSaveButtonClicked);
		$(document).on('click','.editable', _onEditableClicked);
		$(document).on('click','#textthumb', _launchTextEditor);
		$(document).on('click','#picthumb', _launchPicEditor);
		//$.getScript('js/slides.js',function(){
		var evt = document.createEvent("Event");
		evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
		document.dispatchEvent(evt);	
		//});
	};

	/**
	 * function called when user clicks on add new slide button
	 * Shows the available templates to create new slides 
	 */
	var _onAddButtonClicked = function(){
		smoke.alert(TEMPLATES);		
	};

	/**
	 * function called when user clicks on add new quiz button
	 * Shows the message
	 */
	var _onQuizButtonClicked = function(){
		smoke.alert(MESSAGE);		
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
		
		_clearSmoke();
		
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
		params['current_el'] = $(this);
		smoke.alert(EDITORS,function(e){
		});
	};
	
	/**
	 * Allows users to include text content in the slide using a WYSIWYG editor
	 */
	var _launchTextEditor = function(event){
		_clearSmoke();

		smoke.prompt('Write your text',function(e){
			if (e){
				params['current_el'].attr('type','text');
				params['current_el'].html(e);
			}
		});
	};

	/**
	 * Allows users to include images in the slide by selecting the image URL
	 */
	var _launchPicEditor = function(event){
		_clearSmoke();
		var template = params['current_el'].parent().attr('template');

		smoke.prompt('Paste image url',function(e){
			if (e){
				var idToDragAndResize = "draggable" + nextImageId;
				params['current_el'].attr('type','image');
				params['current_el'].html("<img class='"+template+"_image' id='"+idToDragAndResize+"' title='Click to drag' src='"+e+"' />");
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
			}
		});
	};
	
	/**
	 * Removes the smoke box
	 */
	var _clearSmoke = function(){
		$('.smoke, .smoke-base, .smokebg').remove();
	};

	return {
		init: init
	};

}) (VISH, jQuery);
