VISH.Editor.Text = (function(V,$,undefined){
	
	var initialized = false;

	var init = function(){
		if(!initialized){
			$(document).on('click','.textthumb', launchTextEditor);

			CKEDITOR.on( 'dialogDefinition', function(ev){
				// Take the dialog name and its definition from the event data.
				var dialogName = ev.data.name;
				var dialogDefinition = ev.data.definition;

				if ( dialogName == 'link' ) {
					//Customize main window

					// Remove unused link type options
					// var linkType = dialogDefinition.getContents('info').get("linkType");
					// linkType.items.splice(2,1);
					// linkType.items.splice(1,1);

					//Remove LinkType
                    dialogDefinition.getContents('info').remove("linkType");

					//Remove advanced options
					dialogDefinition.removeContents('advanced');
					
					//Customize target window
					var targetTab = dialogDefinition.getContents('target');
					var targetField = targetTab.get('linkTargetType');
					targetField['default'] ='_blank';
                    targetField.items.splice(6,1);
                    targetField.items.splice(4,1);
                    targetField.items.splice(1,1);
                    targetField.items.splice(0,1);
                    // dialogDefinition.removeContents( 'target' ); //To remove targets
				}
			});

			initialized=true;
		}
	}

	
	/**
	* Function called when user clicks on the text thumb
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

		var newInstance = !(typeof initial_text === "string");

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
		config.removePlugins = 'elementspath';

		//Add links settings
		// config.DefaultLinkTarget = '_blank';


		//Fit the current area
		config.width = '100%';
		//The height value defines the height of CKEditor editing area and can be given in pixels or em. Percent values are not supported. 
		//http://docs.cksource.com/CKEditor_3.x/Howto/Editor_Size_On_The_Fly
		config.height = $(current_area).height();

		//Toolbar defaults
		config.fontSize_defaultLabel = '12px';

		//Apply vEditor skin
		var ckeditorBasePath = CKEDITOR.basePath.substr(0, CKEDITOR.basePath.indexOf("editor/"));
		config.skin = 'vEditor,' + ckeditorBasePath + 'editor/skins/vEditor/';

		//Add ckeditor wysiwyg instance
		var ckeditor = CKEDITOR.appendTo(wysiwygContainerId,config);

		var myWidth = $(current_area).width();
		var myHeight = $(current_area).height();

		if(newInstance){
			var defaultFontSize = 12;
			var defaultAlignment = "left";

			switch($(current_area).attr("size")){
				case VISH.Constant.EXTRA_SMALL:
					defaultFontSize = 18;
					break;
				case VISH.Constant.SMALL:
					defaultFontSize = 18;
					break;
				case VISH.Constant.MEDIUM:
					defaultFontSize = 26;
					break;
				case VISH.Constant.LARGE:
					defaultFontSize = 36;
					break;
				default:
					break;
			}

			var isCircleArea = $(current_area).attr("areaid").indexOf("circle")!==-1;
			if(isCircleArea){
				defaultAlignment = "center";
			}

			initial_text = "<p style='text-align:"+defaultAlignment+";'><span style='font-size:"+defaultFontSize+"px;'>&shy;</span></p>";
		}

		ckeditor.on("instanceReady", function(){
			if(initial_text){
				ckeditor.setData(initial_text, function(){
					//Resize: needed to fit content properly
					//Acces current_area leads to errors, use myWidth and myHeight
					ckeditor.resize(myWidth,myHeight);
					//Apply fix for a official CKEditor bug
					_fixCKEDITORBug(ckeditor);
				});
				if(newInstance){
					ckeditor.focus();
				}
			}
		});

		//Catch the focus event
		ckeditor.on('focus', function(event){
			var area = $("div[type='text']").has(event.editor.container.$);
			VISH.Editor.selectArea(area);
		});

		ckeditor.on('blur', function(event){
			var area = $("div[type='text']").has(event.editor.container.$);
		});

		// Add a button to delete the current text area
		V.Editor.addDeleteButton(current_area);		
	};
	

	var getCKEditorFromZone = function(zone){
		if((!zone)||(typeof CKEDITOR === 'undefined')||(typeof CKEDITOR.instances === 'undefined')){
			return null;
		}

		var CKEditorInstance = null;

		jQuery.each(CKEDITOR.instances, function(name, CKinstance) {
			var CKzone = $(CKinstance.container.$).parent().parent();
			if($(CKzone).attr("id")===$(zone).attr("id")){
				CKEditorInstance = CKinstance;
				return;
			}
		});
		return CKEditorInstance;
	}

	var getCKEditorIframeContentFromZone = function(zone){
		var editor = getCKEditorFromZone(zone);
		if(!editor){
			return null;
		}
		var iframe = $(document.getElementById('cke_contents_' + editor.name)).find("iframe")[0];
		return $(iframe).contents()[0];
	}

	/*
	 * Fix oficial WebKit bug: http://ckeditor.com/forums/CKEditor-3.x/Minimum-Editor-Width-Safari#comment-48574
	 */
	var _fixCKEDITORBug = function(editor){
	    //webkit not redraw iframe correctly when editor's width is < 310px (300px iframe + 10px paddings)
	    if (CKEDITOR.env.webkit) {
	        var iframe = $(document.getElementById('cke_contents_' + editor.name)).find("iframe")[0];
	        iframe.style.display = 'none';
	        iframe.style.display = 'block';
	    }
	}

	return {
		init              			: init,
		launchTextEditor  			: launchTextEditor,
		getCKEditorFromZone 		: getCKEditorFromZone,
		getCKEditorIframeContentFromZone : getCKEditorIframeContentFromZone
	};

}) (VISH, jQuery);
