/*
 * Configure ViSH Editor
 */

var options;

var getOptions = function(){
	if(!options){
		options = {};
		
		//Specify VISH Editor Configuration
		var configuration = {};

		/////////////////////
		// Operation Modes
		// Possible values:
		// noserver: working with a HTTP server like apache for developping.
		// vish: working with a vish server.
		/////////////////////
		configuration["mode"] = "noserver";
		// configuration["mode"] = "vish";


		/////////////////////
		// Assets paths (use relative paths)
		/////////////////////
		configuration["ImagesPath"] = "/images/";
		configuration["StylesheetsPath"] = "/stylesheets/";


		/////////////////////
		// Configuration of server services
		/////////////////////

		//Root path of the ViSH server (used for tags, thumbnails, etc.)
		configuration["rootPath"] = "http://localhost:3000";

		//Upload
		configuration["Upload"] = true;
		configuration["uploadImagePath"] = "/image";
		configuration["uploadObjectPath"] = "/object";
		configuration["uploadPresentationPath"] = "/presentation";
		configuration["uploadPDF2PPath"] = "/pdfex";

		// Recommendations API
		configuration["recommendationsAPI"] = {
			rootURL: "http://localhost:3000/excursions/last_slide.json"
		};

		//Quiz Sessions API (Audience Response System)
		configuration["ARS_API"] = {
			rootURL: "http://localhost:3000/quiz_sessions/"
		};


		/////////////////////
		// Sources enabled
		/////////////////////
		configuration["ViSH"] = true;
		configuration["ViSH_instances"] = ["http://localhost:3000"];
		configuration["Flickr"] = true;
		configuration["Youtube"] = true;
		configuration["Vimeo"] = false;
		configuration["LRE"] = true;
		configuration["LRE_path"] = "http://localhost:3000/lre/search";
		configuration["SoundCloud"] = true;
		configuration["SoundCloudAPIKEY"] = 'SoundcloudAPIKey';

		/////////////////////
		// Features enabled
		/////////////////////

		// Tracking System
		// configuration["TrackingSystemAPIKEY"] = "TrackingSystemAPIKEY";
		// configuration["TrackingSystemAPIURL"] = "http://localhost:3000/tracking_system_entries";
		// options["TrackingSystemRelatedEntryId"] = "1"

		// Evaluation System
		//LOEP configuration (For evaluations)
		// configuration["loepSettings"] = {
		// 	tokenURL: "http://localhost:3000/loep/session_token.json",
		// 	domain: "http://localhost:8080",
		// 	app: "ViSH",
		// 	loId: "Excursion:1057",
		// 	evmethod: "wbltses"
		// };


		/////////////////////
		// Behaviour customization
		/////////////////////
		configuration["presentationSettings"] = true;
		configuration["tagsSettings"] = {maxLength: 20, maxTags: 8, triggerKeys: ['enter', 'space', 'comma', 'tab']};

		options["configuration"] = configuration;



		/////////////////////
		// Options to initialize ViSH Editor
		/////////////////////

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
				// developmentSettings.samples = VISH.Samples.quiz_samples.slides[0].elements[0].quiz_simple_json;
				//developmentSettings.samples = VISH.Samples.text_samples;
				// developmentSettings.samples = VISH.Samples.VE01_samples;

				// Activate insertMode
				// developmentSettings.samples.insertMode = true;
				// options["preview"] = true;
			}

			//Possible actions: "preview"
			developmentSettings.actionSave = "preview";

			options["developmentSettings"] = developmentSettings;
		}

		//User data
		options["user"] = {
			name: "agordillo",
			id: "20",
			token: "12xfDgR345x6"
		}

		//QuizSessionId to answer a quiz using the ARS (Audience Response System)
		options["quizSessionId"] = "1";

		options["fullScreenFallback"] = {
			enterFullscreenURL: "http://localhost/viewer.html",
			exitFullscreenURL: "http://localhost/framed_viewer.html"
		};

		// options["comeBackUrl"] = "https://github.com/ging/vish_editor";

		options["exitURL"]  = "http://localhost/framed_edit.html";

		//Draft presentations
		options["draft"] = false;

		//Preview mode
		// options["preview"] = true;

		//SCORM package
		// options["scorm"] = true;

		//Specify a default language
		options["lang"] = "en";

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
		
		if((typeof window != "undefined")&&(window.console) && (window.console.log)){
			console.log("ViSH Editor Configured Options");
			console.log(options);
		}

	}

	return options;
};