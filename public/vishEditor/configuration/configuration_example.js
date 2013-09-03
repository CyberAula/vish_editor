/*
 * Configure Standalone Vish Editor
 */

var options;

if(typeof module != 'undefined'){
	module.exports.getOptions = function(env) {
		return getOptions();
	}
}

var getOptions = function(){
	if(!options){

		options = {};
		var configuration = {};

		//Specified VISH Editor Configuration

		//Paths
		configuration["ImagesPath"] = "/vishEditor/images/";
		configuration["StylesheetsPath"] = "/vishEditor/stylesheets/";
		configuration["uploadImagePath"] = "/image";
		configuration["uploadObjectPath"] = "/object";
		configuration["uploadPresentationPath"] = "/presentation/";
		configuration["uploadPDF2PPath"] = "/pdfex/";		
		configuration["SearchLREPath"] = "/lre/search";

		configuration["presentationSettings"] = false;
		configuration["presentationTags"] = true;
		configuration["presentationThumbnails"] = true;

		configuration["VishLives"] = true;
		configuration["VishRepo"] = true;

		configuration["Flickr"] = true;
		configuration["Youtube"] = true;
		configuration["Vimeo"] = false;
		configuration["LRE"] = true;

		configuration["Upload"] = true;

		//Posible values: noserver, node, vish
		configuration["mode"] = "noserver";

		options["configuration"] = configuration;

		if(typeof env != 'undefined'){
			if(env=="development"){
				options["developping"] = true;
			} else if(env=="production"){
				options["developping"] = false;
			}
		} else {
			options["developping"] = true;
		}

		if(options["developping"]==true){
			//Setting developping options
			var developmentSettings = new Object();

			//Possible action: "nothing" or "loadSamples".
			developmentSettings.actionInit = "loadSamples";
			//Select your samples
			if((typeof VISH != "undefined")&&(typeof VISH.Samples != "undefined")){
				// developmentSettings.samples = VISH.Samples.basic_samples;
				// developmentSettings.samples = VISH.Samples.samplesv01;
				// developmentSettings.samples = VISH.Samples.fc_sample;
				// developmentSettings.samples = VISH.Samples.samples_vtour;
				developmentSettings.samples = VISH.Samples.full_samples;
				// developmentSettings.samples = VISH.Samples.quiz_samples;
				//quiz_simple_sample
				// developmentSettings.samples = VISH.Samples.quiz_samples.slides[0].elements[0].quiz_simple_json
				// developmentSettings.samples = VISH.Samples.magnetic_gifs;
				// developmentSettings.samples = VISH.Samples.new_wysiwyg;
			}

			//Possible actions: "view", "edit", or "nothing".
			developmentSettings.actionSave = "view";

			options["developmentSettings"] = developmentSettings;


			//Also you can define a username and token for testing purposes
			options["username"] = "ebarra";
			options["userId"] = "3456";
			options["token"] = "12xfDgR345x6";
			options["quizSessionId"] = "1";

			options["full"] = true;
			options["forcefull"] = false;
			options["forceHideViewbar"] = false;
			options["watermarkURL"] = "http://localhost/vishEditor/viewer.html";
			
			// options["preview"] = true;
        	// options["comeBackUrl"] = "https://github.com/ging/vish_editor";

			options["fullscreen"]  = "http://trapo.dit.upm.es:3000/excursions/83.full";
			options["exitFullscreen"]  = "http://localhost/vishEditor/framed_viewer.html";

        	//Draft presentations
        	options["draft"] = false;

        	//SCORM package
        	// options["scorm"] = true;

			//And a default landguage
			options["lang"] = "en";

			//URL to get the recommendations to show in the last slide
			//options["urlToGetRecommendations"] = "/excursions/last_slide.js"

			//URL to call LRE search
			options["urlToSearchLRE"] = "/lre/search";

			//Addons
			options.addons = [];

			var addon = new Object();
			addon.id = "IframeMessenger";
			addon.target = "Both";
			addon.url = "";
			addon.config = new Object();
			addon.config.enable = true;

			options.addons.push(addon);
		}
		
		if((typeof window != "undefined")&&(window.console) && (window.console.log)){
			console.log("Vish Editor Configured Options")
			console.log(options)
		}

	}

	return options;
}