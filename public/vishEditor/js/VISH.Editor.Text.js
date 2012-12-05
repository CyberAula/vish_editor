VISH.Editor.Text = (function(V,$,undefined){
	
	var initialized = false;

	var init = function(){
		if(!initialized){
			$(document).on('click','.textthumb', launchTextEditor);
			initialized=true;
		}
  	}

	
 /**
  * function called when user clicks on the text thumb
  * Allows users to include text content in the slide using a WYSIWYG editor
  * param area: optional param indicating the area to add the wysiwyg, used for editing presentations
  */
  var launchTextEditor = function(event, area, initial_text){
  	// console.log("launchTextEditor");
  	// console.log(event);
  	// console.log(area);
  	init();

  	var current_area;
  	if(area){
  		current_area = area;
  	} else {
  		current_area = $(this).parents(".selectable");
  	}

    current_area.attr('type','text');

    var wysiwygContainerId = VISH.Utils.getId();
    var wysiwygContainer = $("<div id='"+wysiwygContainerId+"'></div>")
    $(current_area).append(wysiwygContainer);


    var config = {};
	config.toolbar = 'Basic';
	config.toolbar_Basic =
	[
	    ['Bold','Italic','Underline','-','Subscript','Superscript'],
	    ['NumberedList','BulletedList','Table'],
	    ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
	    ['Link'],
	    ['Font','FontSize'],
	    ['TextColor','BGColor']
	];
	config.sharedSpaces =
	{
		top : 'toolbar_element'
	};

	var ckeditorBasePath = CKEDITOR.basePath.substr(0, CKEDITOR.basePath.indexOf("editor/"));
	config.skin = 'vEditor,' + ckeditorBasePath + 'editor/skins/vEditor/';

	var editor = CKEDITOR.appendTo( wysiwygContainerId, config, initial_text );

	// add a button to delete the current text area   
    V.Editor.addDeleteButton(current_area); 

  };
	

	return {
		init              		: init,
		launchTextEditor  		: launchTextEditor
	};

}) (VISH, jQuery);
