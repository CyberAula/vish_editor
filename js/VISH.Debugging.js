/*
 * Debug, test and utility functions for Vish Editor
 */
VISH.Debugging = (function(V,$,undefined){
	
	
	//CONFIGURATION VARIABLES
	
	//Possible actions: "view", "edit" or "nothing".
	var actionSave = "nothing";
	
	//Possible action: "nothing" or "loadSamples".
	var actionInit = "nothing";
	var excursionSamples = VISH.Samples.samples_aldo;
	
	
	var developping = false;
	
	var init = function(bol){
			developping = bol;
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
		return actionSave;
	}
	
	var getActionInit = function(){
    return actionInit;
  }
	
	var getExcursionSamples = function(){
		return excursionSamples;
	}
	
	var initVishViewer = function(){
		var myexcursion = null;
		
		if(VISH.Editing){
			myexcursion = VISH.Editor.saveExcursion();
		} else {
			log("You are already in Vish Viewer");
      return;
		}
		
    $('article').remove();
    $('#menubar').hide();
    $('#menubar_helpsection').hide();
    $('#joyride_help_button').hide();
    $('.theslider').hide();
    $(".nicEdit-panelContain").hide();
    $("#menubar-viewer").show();
		VISH.Debugging.log("Init Vish Viewer with excursion: " + JSON.stringify(myexcursion));
		VISH.SlideManager.init(myexcursion);
	}
	
	var initVishEditor = function(){
		
		var myexcursion = null;
		
		if(VISH.Editing){
      log("You are already in Vish Editor");
			return;
    } else {
			myexcursion = VISH.Editor.getSavedExcursion();
    }
		
		$('article').remove();
		$('#menubar').show();
    $('#menubar_helpsection').show();
    $('#joyride_help_button').show();
    $('.theslider').show();
    $(".nicEdit-panelContain").show();
    $("#menubar-viewer").hide();
    var options = {};
    options["developping"] = true;
		options["configuration"] = configuration;
		VISH.Debugging.log("Init Vish Editor with excursion: " + JSON.stringify(myexcursion));
    VISH.Editor.init(options, myexcursion);
  }
	
	return {
		init                    : init,
		log                     : log,
		shuffleJson             : shuffleJson,
		enableDevelopingMode    : enableDevelopingMode,
		disableDevelopingMode   : disableDevelopingMode,
		isDevelopping           : isDevelopping,
		getActionSave           : getActionSave,
		getActionInit           : getActionInit,
		getExcursionSamples     : getExcursionSamples,
		initVishViewer          : initVishViewer,
		initVishEditor          : initVishEditor
	};

}) (VISH, jQuery);
