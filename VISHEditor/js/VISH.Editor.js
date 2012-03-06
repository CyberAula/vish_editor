VISH.Editor = (function(V,$,undefined){
	
	var params = {
		current_el : null 	
	};

	var MENUBAR = "<div id='menubar'>\
	<div class='barbutton' id='add'>\
	</div>\
	<div class='barbutton' id='save'>\
	</div>\
	</div>";
	
	var TEMPLATES = "<div id='thumbcontent'><div class='templatethumb' template='1'><img src='images/templatesthumbs/t1.png' /></div><div class='templatethumb' template='2'><img src='images/templatesthumbs/t2.png' /></div></div>";                           

	var EDITORS = "<div class='menu'><div id='textthumb' class='menuicon'><img src='images/text-editor.png' /></div><div id='picthumb' class='menuicon'><img src='images/picture-editor.png' /></div></div>";

	/**
	 * Initializes the VISH editor
	 */
	var init = function(){
		_loadCSS('stylesheets/editor.css');
		$('body').append(MENUBAR);
		$(document).on('click','.templatethumb', _onTemplateThumbClicked);
		$(document).on('click','#add', _onAddButtonClicked);
		$(document).on('click','#save', _onSaveButtonClicked);
		$(document).on('click','.editable', _onEditableClicked);
		$(document).on('click','#textthumb', _launchTextEditor);
		$(document).on('click','#picthumb', _launchPicEditor);
		$.getScript('./js/slides.js',function(){
			var evt = document.createEvent("Event");
			evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
			document.dispatchEvent(evt);	
		});
	};

	/**
	 * Shows the available templates to create new slides 
	 */
	var _onAddButtonClicked = function(){
		smoke.alert(TEMPLATES);		
	};

	/**
	 * Saves the current slides generated
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
				element.type   = $(div).attr('type');
				element.areaid = $(div).attr('areaid');
				if(element.type==="text"){
					element.body   = $(div).html();
				} else if(element.type==="image"){
					element.body   = $(div).find('img').attr('src');
				}
				slide.elements.push(element);
				element = {};
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
	 * 
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
	 * Includes a new slide following the template selected
	 */
	var _onTemplateThumbClicked = function(event){
		$('.slides').append(V.Dummies.getDummy($(this).attr('template')));
		_clearSmoke();
		
		var evt = document.createEvent("Event");
		evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
		document.dispatchEvent(evt);
	};

	/**
	 * Event launched when an editable element belonging to the slide is clicked
	 */
	var _onEditableClicked = function(event){
		params['current_el'] = $(this);
		smoke.alert(EDITORS,function(e){
		});
	}

	/**
	 * Allows users to include text content in the slide using a WYSIWYG editor
	 */
	var _launchTextEditor = function(event){
		
		//params['current_el'].append("<textarea>Testing...</textarea>");
		
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
				params['current_el'].attr('type','image');
				params['current_el'].html("<img class='"+template+"_image' src='"+e+"' />");
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