VISH.Editor.Text = (function(V,$,undefined){
	
	var initialized = false;

	var init = function(){
		if(!initialized){
			$(document).on('click','.textthumb', launchTextEditor);

			CKEDITOR.on( 'dialogDefinition', function(ev){
				// Take the dialog name and its definition from the event data.
				var dialogName = ev.data.name;
				var dialogDefinition = ev.data.definition;

				if (dialogName == 'link') {
					//Customize main window

					// Remove unused link type options
					// var linkType = dialogDefinition.getContents('info').get("linkType");
					// linkType.items.splice(2,1);
					// linkType.items.splice(1,1);

					//Remove LinkType
                    dialogDefinition.getContents('info').remove("linkType");
                    //Remove unuseful protocols
                    var protocols = dialogDefinition.getContents('info').get("protocol").items;
                    protocols.splice(3,1);
					protocols.splice(2,1);

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

				if (dialogName == 'table') {
					dialogDefinition.removeContents('advanced');
					var info = dialogDefinition.getContents('info');
					//Set center as default alignment
					var alignment = info.get("cmbAlign");
					alignment.items.splice(0,1);
					//Keep ["default"] to prevent Google closure compiler errors
					alignment["default"] = "center";
					//Remove self-headers
					info.remove("selHeaders");
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
	var launchTextEditor = function(event, area, initial_text, options){
		init();

		var current_area;
		if(area){
			current_area = area;
		} else {
			current_area = $(this).parents(".selectable");
		}

		//current_area can also be a 'textArea' of a quiz.
		var isQuiz = $("div[type='quiz']").has(current_area).length>0;
		var isTemplateArea = ($(current_area).attr("areaid")!==undefined);
		
		if(isTemplateArea){
			current_area.attr('type','text');
		}

		//Create the wysiwyg container and add to the area
		var wysiwygContainerId = V.Utils.getId();
		var wysiwygContainer = $("<div id='"+wysiwygContainerId+"' class='wysiwygTextArea'></div>")
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
		//Enable table resize and autogrow
		config.extraPlugins = 'tableresize,autogrow';

		if((options)&&(options.autogrow)){
			config.autoGrow_minHeight = 34;
			config.autoGrow_maxHeight = 800;
		}

		//Fit the current area
		config.width = '100%';
		//The height value defines the height of CKEditor editing area and can be given in pixels or em. Percent values are not supported. 
		//http://docs.cksource.com/CKEditor_3.x/Howto/Editor_Size_On_The_Fly
		config.height = $(current_area).height();

		//Toolbar defaults
		config.fontSize_defaultLabel = '12';

		//Apply vEditor skin
		var ckeditorBasePath = CKEDITOR.basePath.substr(0, CKEDITOR.basePath.indexOf("editor/"));
		config.skin = 'vEditor,' + ckeditorBasePath + 'editor/skins/vEditor/';

		//Add ckeditor wysiwyg instance
		var ckeditor = CKEDITOR.appendTo(wysiwygContainerId,config);

		var myWidth = $(current_area).width();
		var myHeight = $(current_area).height();


		var newInstance = !(typeof initial_text === "string")||((options)&&(options.forceNew));

		if(newInstance){
			var defaultFontSize = 12;
			var defaultAlignment = "left";

			//Font size depends of the area size
			switch($(current_area).attr("size")){
				case V.Constant.EXTRA_SMALL:
					defaultFontSize = 18;
					break;
				case V.Constant.SMALL:
					defaultFontSize = 18;
					break;
				case V.Constant.MEDIUM:
					defaultFontSize = 26;
					break;
				case V.Constant.LARGE:
					defaultFontSize = 36;
					break;
				default:
					break;
			}

			//Alignment depends of the area type
			var areaId = $(current_area).attr("areaid");
			if(areaId){
				var isCircleArea = $(current_area).attr("areaid").indexOf("circle")!==-1;
				if(isCircleArea){
					defaultAlignment = "center";
				}
			}

			//Color depends of the current theme
			var initialTextColor = "color:#" + V.Editor.Themes.getCurrentTheme().color;
			var blankTextColor = initialTextColor; //For placeholders

			//We can also specify initial_texts style in the options param
			//This options override defaults
			if(options){
				//Font size
				if(typeof options.fontSize == "number"){
					defaultFontSize = options.fontSize;
				}

				//Placeholder
				if(options.placeholder === true){
					initialTextColor = "color:#ccc";
				}
			}

			if((isTemplateArea)||(typeof initial_text != "string")||(initial_text==="")){
				initial_text = "&shy";
			}

			initial_text = "<p style='text-align:"+defaultAlignment+";'><span autoColor='true' style='"+initialTextColor+"'><span style='font-size:"+defaultFontSize+"px;'>"+initial_text+"</span></span></p>";
			initial_text_blank = "<p style='text-align:"+defaultAlignment+";'><span autoColor='true' style='"+blankTextColor+"'><span style='font-size:"+defaultFontSize+"px;'>"+"&shy"+"</span></span></p>";
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
					if((isTemplateArea)||((options)&&(options.focus))){
						ckeditor.focus();
					}
				}
			}
		});

		//Catch the focus event
		ckeditor.on('focus', function(event){
			if((options)&&(options.placeholder===true)){
				var a = $(initial_text).text().replace(/\s+/g,'');
				var b = $(event.editor.getData()).text().replace(/\s+/g,'');
				if(a==b){
					setTimeout(function(){
						event.editor.setData(initial_text_blank);
						event.editor.focus();
					},20);
				}
			}

			var area = getZoneForCKContainer(event.editor.container.$);
			V.Editor.selectArea(area);
		});

		ckeditor.on('blur', function(event){
			//Code here
		});

		//Exnteds CKEditor functionality

		ckeditor.getPlainText = _getPlainText;

		if(isTemplateArea){
			// Add a button to delete the current text area
			V.Editor.addDeleteButton(current_area);	
		}
	};
	

	var getCKEditorFromZone = function(zone){
		if((!zone)||(typeof CKEDITOR === 'undefined')||(typeof CKEDITOR.instances === 'undefined')){
			return null;
		}

		var CKEditorInstance = null;

		jQuery.each(CKEDITOR.instances, function(name, CKinstance) {
			var CKzone = getZoneForCKContainer(CKinstance.container.$);

			if($(CKzone).attr("id")===$(zone).attr("id")){
				CKEditorInstance = CKinstance;
				return;
			}
		});
		return CKEditorInstance;
	}

	var getZoneForCKContainer = function(container){
		var area;
		area = $("div[type='text']").has(container);
		if(area.length===0){
			area = $("div[type='quiz']").has(container);
		}
		return area;
	}

	var getCKEditorIframeContentFromZone = function(zone){
		var editor = getCKEditorFromZone(zone);
		if(!editor){
			return null;
		}
		var iframe = $(document.getElementById('cke_contents_' + editor.name)).find("iframe")[0];
		return $(iframe).contents()[0];
	}


	var getCKEditorFromTextArea = function(textArea){
		if((!textArea)||(typeof CKEDITOR === 'undefined')||(typeof CKEDITOR.instances === 'undefined')){
			return null;
		}

		if(!$(textArea).hasClass(".cke_skin_vEditor")){
			textArea = $(textArea).find(".cke_skin_vEditor");
			if(textArea.length>0){
				textArea = textArea[0];
			}
		}
		
		var CKEditorInstance = null;
		jQuery.each(CKEDITOR.instances, function(name, CKinstance) {
			if(textArea===CKinstance.container.$){
				CKEditorInstance = CKinstance;
				return;
			}
		});
		return CKEditorInstance;
	}

	var _getPlainText = function(){
		return $(this.getSnapshot()).text();
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

	var refreshAutoColors = function(){
		var currentColor = "color:#" + V.Editor.Themes.getCurrentTheme().color;
		jQuery.each(CKEDITOR.instances, function(name, CKinstance) {
			 var iframe = $($(document.getElementById('cke_contents_' + CKinstance.name)).find("iframe")[0]).contents()[0];
			 var spans = $(iframe).find("span[autocolor][style]");
			 jQuery.each(spans, function(name, span) {
			 	$(span).attr("style",currentColor+";");
			 });
		});
	}

	return {
		init								: init,
		launchTextEditor					: launchTextEditor,
		getCKEditorFromZone					: getCKEditorFromZone,
		getCKEditorIframeContentFromZone	: getCKEditorIframeContentFromZone,
		getCKEditorFromTextArea				: getCKEditorFromTextArea,
		refreshAutoColors					: refreshAutoColors
	};

}) (VISH, jQuery);
