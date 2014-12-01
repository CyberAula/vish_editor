/*
 * Configure Standalone ViSH Editor
 */

var options;

var getOptions = function(){
	if(!options){
		options = {};
		
		//Specified VISH Editor Configuration
		var configuration = {};

		//Paths
		configuration["ImagesPath"] = "/images/";
		configuration["StylesheetsPath"] = "/stylesheets/";
		configuration["uploadImagePath"] = "/image";
		configuration["uploadObjectPath"] = "/object";
		configuration["uploadPresentationPath"] = "/presentation/";
		configuration["uploadPDF2PPath"] = "/pdfex/";

		//Behaviour customization
		configuration["presentationSettings"] = true;

		//Sources enabled
		configuration["Upload"] = true;
		configuration["ViSH"] = true;
		configuration["Flickr"] = true;
		configuration["Youtube"] = true;
		configuration["Vimeo"] = false;
		configuration["LRE"] = true;
		configuration["SearchLREPath"] = "http://vishub.org/lre/search";
		// configuration["SearchLREPath"] = "/lre/search"; To work with ViSH in localhost
		configuration["SoundCloud"] = true;
		// configuration["SoundCloudAPIKEY"] = "SoundcloudAPIKey";

		//Features enabled

		// Tracking System
		// configuration["TrackingSystemAPIKEY"] = "trackingSystemAPIKey";
		// configuration["TrackingSystemAPIURL"] = "http://localhost:3000/tracking_system_entries";

		// Evaluation System
		//LOEP configuration (For evaluations)
		// configuration["loepSettings"] = {
		// 	tokenURL: "http://localhost:3000/loep/session_token.json",
		// 	domain: "http://localhost:8080",
		// 	app: "Vish",
		// 	loId: "Excursion:1057",
		// 	evmethod: "wbltses"
		// };

		/*
		 * Mode. Possible values:
		 * noserver: for developping.
		 * vish: working with the vish server.
		 */
		configuration["mode"] = "noserver";
		// configuration["mode"] = "vish";

		options["configuration"] = configuration;


		//More options

		options["developping"] = true;

		if(options["developping"]==true){
			//Setting developping options
			var developmentSettings = new Object();

			// Possible action: "nothing" or "loadSamples".
			developmentSettings.actionInit = "loadSamples";
			// developmentSettings.actionInit = "nothing";

			//Select your samples
			if((typeof VISH != "undefined")&&(typeof VISH.Samples != "undefined")){
				// developmentSettings.samples = VISH.Samples.basic_samples;
				developmentSettings.samples = VISH.Samples.full_samples;
				// developmentSettings.samples = VISH.Samples.fc_sample;
				// developmentSettings.samples = VISH.Samples.vt_sample;
				// developmentSettings.samples = VISH.Samples.evideo_sample;
				// developmentSettings.samples = VISH.Samples.quiz_samples;
				//quiz_simple_sample
				// developmentSettings.samples = VISH.Samples.quiz_samples.slides[0].elements[0].quiz_simple_json
				//developmentSettings.samples = VISH.Samples.text_samples;
				// developmentSettings.samples = VISH.Samples.VE01_samples;
				// developmentSettings.samples = VISH.Samples.mooc_samples;

				// Activate insertMode
				// developmentSettings.samples.insertMode = true;
				// options["preview"] = true;
			}

			//Possible actions: "preview"
			developmentSettings.actionSave = "preview";

			options["developmentSettings"] = developmentSettings;

			//User data
			options["user"] = {
				name: "agordillo",
				id: "20",
				token: "12xfDgR345x6"
			}

			//URL to access to the Recommendation API
			options["recommendationsAPI"] = {
				rootURL: "http://localhost:3000/excursions/last_slide.json"
				// rootURL: "http://vishub.org/excursions/last_slide.js"
			};

			//URL to access to the Quiz Session API
			options["quizSessionAPI"] = {
				rootURL: "http://localhost:3000/quiz_sessions/"
			};
			//QuizSessionId to answer the quiz
			options["quizSessionId"] = "1";

			// options["comeBackUrl"] = "https://github.com/ging/vish_editor";

			options["fullScreenFallback"] = {
				// enterFullscreenURL: "http://localhost:3000/excursions/83.full",
				enterFullscreenURL: "http://localhost/viewer.html",
				exitFullscreenURL: "http://localhost/framed_viewer.html"
			};

			options["exitURL"]  = "http://localhost/framed_edit.html";

			//Draft presentations
			options["draft"] = false;

			//Preview mode
			// options["preview"] = true;

        	//SCORM package
        	// options["scorm"] = true;

			//And a default landguage
			options["lang"] = "en";
			// languagesWithCSS = ["es", "fr", "hu", "nl", "de"];

			//Custom player for videos (needed for video synchronization)
			// options["videoCustomPlayer"]  = true;

			//Add a Watermark
			options["watermarkURL"] = "http://localhost/viewer.html";

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
			console.log("ViSH Editor Configured Options");
			console.log(options);
		}

	}

	return options;
};