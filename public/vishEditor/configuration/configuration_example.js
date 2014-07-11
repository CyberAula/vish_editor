/*
 * Configure Standalone ViSH Editor
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
		configuration["SearchLREPath"] = "http://vishub.org/lre/search";
		// configuration["SearchLREPath"] = "/lre/search"; To work with ViSH in localhost

		configuration["presentationSettings"] = false;
		configuration["presentationTags"] = true;
		configuration["presentationThumbnails"] = true;

		configuration["VishLives"] = true;
		configuration["VishRepo"] = true;

		configuration["Flickr"] = true;
		configuration["Youtube"] = true;
		configuration["Vimeo"] = false;
		configuration["LRE"] = true;

		configuration["SoundCloud"] = true;
		configuration["SoundCloudAPIKEY"] = "SoundcloudAPIKey";

		configuration["TrackingSystemAPIKEY"] = "TrackingSystemAPIKEY";

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
				developmentSettings.samples = VISH.Samples.basic_samples;
				// developmentSettings.samples = VISH.Samples.full_samples;
				// developmentSettings.samples = VISH.Samples.fc_sample;
				// developmentSettings.samples = VISH.Samples.vt_sample;
				// developmentSettings.samples = VISH.Samples.evideo_sample;
				// developmentSettings.samples = VISH.Samples.quiz_samples;
				//quiz_simple_sample
				// developmentSettings.samples = VISH.Samples.quiz_samples.slides[0].elements[0].quiz_simple_json
				// developmentSettings.samples = VISH.Samples.text_samples;
				// developmentSettings.samples = VISH.Samples.VE01_samples;
				// developmentSettings.samples = VISH.Samples.mooc_samples;
				// developmentSettings.samples = VISH.Samples.test;

				// Activate insertMode
				// developmentSettings.samples.insertMode = true;
				// options["preview"] = true;
			}

			//Possible actions: "preview"
			developmentSettings.actionSave = "preview";

			options["developmentSettings"] = developmentSettings;

			//Also you can define a user
			options["user"] = {
				name: "agordillo",
				id: "24",
				token: "12xfDgR345x6"
			}

			//URL to access to the Recommendation API
			options["recommendationsAPI"] = {
				rootURL: "/excursions/last_slide.js"
				// rootURL: "http://vishub.org/excursions/last_slide.js"
			};
			
			//URL to access to the Quiz Session API
			options["quizSessionAPI"] = {
				rootURL: 'http://localhost:3000/quiz_sessions/'
			};

			//QuizSessionId to answer the quiz
			options["quizSessionId"] = "1";

			options["watermarkURL"] = "http://localhost/vishEditor/viewer.html";
			
			// options["preview"] = true;
        	// options["comeBackUrl"] = "https://github.com/ging/vish_editor";

			options["fullScreenFallback"] = {
				// enterFullscreenURL: "http://localhost:3000/excursions/83.full",
				enterFullscreenURL: "http://localhost/vishEditor/viewer.html",
				exitFullscreenURL: "http://localhost/vishEditor/framed_viewer.html"
			};

        	//Draft presentations
        	options["draft"] = false;

			//SCORM package
			// options["scorm"] = true;

			//And a default landguage
			options["lang"] = "en";

			//Custom player for videos (needed for video synchronization)
			// options["videoCustomPlayer"]  = true;


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
			console.log("ViSH Editor Configured Options")
			console.log(options)
		}

	}

	return options;
}