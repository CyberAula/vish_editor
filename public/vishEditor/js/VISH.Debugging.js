/*
 * Debug, test and utility functions for Vish Editor
 */
VISH.Debugging = (function(V,$,undefined){
	
	var developping = false;
	var settings;
	var presentationOptions;

	var init = function(options){
		if(options){
			if(typeof options["developping"] == "boolean"){
				developping = options["developping"];

				if(developping){
					presentationOptions = options;
					if(options["developmentSettings"]){
						settings = options["developmentSettings"];
					}
				}
			} else {
				developping = false;
				settings = null;
			}
		} else {
			developping = false;
			settings = null;
		}
	};
	
	var log = function(text){
		if ((window.console && window.console.log) && (developping)) {
		  console.log(text);
		}
	};
	
	var shuffleJson = function(json){
		return _shuffle(json);
	};
	
	var _shuffle = function(o){
	  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	  return o;
	};
	
	var enableDevelopingMode = function(){
		developping = true;
	}
	
	var disableDevelopingMode = function(){
    	developping = false;
    }
	
	var isDevelopping = function(){
		return developping;
	}
	
	var getActionSave = function(){
		if(settings){
			return settings.actionSave;
		} else {
			//Default action
			return "view";
		}
	}
	
	var getActionInit = function(){
		if(settings){
			return settings.actionInit;
		} else {
			//Default action
			return "nothing";
		}
    }
	
	var getPresentationSamples = function(){
		if((settings)&&(settings.samples)){
			return settings.samples;
		} else {
			log("VISH.Debugging Error: Please specify development settings");
			return null;
		}
	}
	
	var initVishViewer = function(){
		var mypresentation = null;
		
		if(VISH.Editing){
			if(!presentationOptions){
				log("VISH.Debugging Error: Specify presentationOptions");
				return;
			}
			mypresentation = VISH.Editor.savePresentation();
		} else {
			log("You are already in Vish Viewer");
      		return;
		}
		
	    $('article').remove();
	    $('#menubar').hide();
	    $('#menubar_helpsection').hide();
	    $('#menubar_helpsection2').hide();
	    $('#joyride_help_button').hide();
	    $('#preview_circle').hide();
	    VISH.Editor.Tools.cleanZoneTools();
	    VISH.Editor.Tools.disableToolbar();
	    $("#menubar-viewer").show();

		log("Init Vish Viewer with presentation: " + JSON.stringify(mypresentation));

		VISH.SlideManager.init(presentationOptions, mypresentation);
	}
	
	var initVishEditor = function(){
		
		var mypresentation = null;
		
		if(VISH.Editing){
			log("You are already in Vish Editor");
			return;
		} else {
			if(!presentationOptions){
				log("VISH.Debugging Error: Specify presentationOptions");
				return;
			}
			mypresentation = VISH.Editor.getSavedPresentation();
		}
		
		$('article').remove();
		$('#menubar').show();
		$('#menubar_helpsection').show();
		$('#menubar_helpsection2').show();
		$('#joyride_help_button').show();
		$('#preview_circle').show();
		VISH.Editor.Tools.enableToolbar();
		$("#menubar-viewer").hide();

		VISH.Debugging.log("Init Vish Editor with presentation: " + JSON.stringify(mypresentation));
		
		VISH.Editor.init(presentationOptions, mypresentation);
	}
	
	return {
		init                    	: init,
		log                     	: log,
		shuffleJson             	: shuffleJson,
		enableDevelopingMode    	: enableDevelopingMode,
		disableDevelopingMode   	: disableDevelopingMode,
		isDevelopping           	: isDevelopping,
		getActionSave           	: getActionSave,
		getActionInit           	: getActionInit,
		getPresentationSamples     	: getPresentationSamples,
		initVishViewer          	: initVishViewer,
		initVishEditor          	: initVishEditor
	};

}) (VISH, jQuery);
