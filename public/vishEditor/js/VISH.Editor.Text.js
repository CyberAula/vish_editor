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
  	init();

  	var current_area;
  	if(area){
  		current_area = area;
  	} else {
  		current_area = $(this).parents(".selectable");
  	}
    current_area.attr('type','text');

    //Create the wysiwyg container and add to the area
    var wysiwygContainerId = VISH.Utils.getId();
    var wysiwygContainer = $("<div id='"+wysiwygContainerId+"'></div>")
    $(wysiwygContainer).attr('style','width: 100%; height: 100%');
    $(current_area).append(wysiwygContainer);

    //Specified CKEditor configuration
    var config = {};

    //Select the features of the toolbar
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

	//Singleton toolbar
	config.sharedSpaces =
	{
		top : 'toolbar_text'
	};

	//Disable toolbar expansion
	config.toolbarCanCollapse = false;
	//Disable resizing
	config.resize_enabled = false;
	//Disable bottom tags
	config.removePlugins = 'elementspath','resize';

	//Fit the current area
	config.width = '100%';
	//The height value defines the height of CKEditor editing area and can be given in pixels or em. Percent values are not supported. 
	//http://docs.cksource.com/CKEditor_3.x/Howto/Editor_Size_On_The_Fly
	config.height = $(current_area).height();

	// config.extraPlugins = 'autogrow';
	// config.autoGrow_maxHeight = $(current_area).height();

	//Apply vEditor skin
	var ckeditorBasePath = CKEDITOR.basePath.substr(0, CKEDITOR.basePath.indexOf("editor/"));
	config.skin = 'vEditor,' + ckeditorBasePath + 'editor/skins/vEditor/';

	//Add ckeditor wysiwyg instance
	var ckeditor = CKEDITOR.appendTo( wysiwygContainerId, config, initial_text );
	
	//Catch the focus event
	//TODO: Improve event cathing... currently is not triggered in all cases.
	ckeditor.on('focus', function(event){
		var area = $("div[type='text']").has(event.editor.container.$);
		VISH.Editor.selectArea(area);
	});

	// add a button to delete the current text area   
    V.Editor.addDeleteButton(current_area); 

  };
	

	return {
		init              		: init,
		launchTextEditor  		: launchTextEditor
	};

}) (VISH, jQuery);
