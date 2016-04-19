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
		// Assets paths
		/////////////////////
		configuration["ImagesPath"] = "/images/";
		configuration["StylesheetsPath"] = "/stylesheets/";

		/////////////////////
		// CORE paths
		/////////////////////
		configuration["uploadPresentationPath"] = "/presentation";
		configuration["previewPresentationPath"] = "/viewer.html";

		/////////////////////
		// Upload paths
		/////////////////////
		// configuration["uploadImagePath"]
		// configuration["uploadObjectPath"]
		// configuration["uploadPDF2PPath"]
		// configuration["uploadEPackagesPath"]
		configuration["enableFileImportation"] = true;

		/////////////////////
		// Sources enabled
		/////////////////////
		configuration["ViSH"] = true;
		configuration["ViSH_instances"] = ["http://localhost:3000"];
		configuration["Flickr"] = true;
		configuration["Europeana"] = true;
		configuration["EuropeanaAPIKEY"] = "EuropeanaAPIKEY";
		configuration["Youtube"] = true;
		configuration["YoutubeAPIKEY"] = 'YoutubeAPIKey';
		configuration["LRE"] = true;
		configuration["LRE_path"] = "http://localhost:3000/lre/search";
		configuration["SoundCloud"] = true;
		configuration["SoundCloudAPIKEY"] = 'SoundcloudAPIKey';

		/////////////////////
		// Features enabled (other services)
		/////////////////////

		//Thumbnails
		// configuration["thumbnailsPath"]
		//Tags
		// configuration["tagsPath"]
		//TmpJSON
		// configuration["uploadJSONPath"]
		//Attachment
		// configuration["uploadAttachmentPath"]

		// Recommendations API
		configuration["recommendationsAPI"] = {
			rootURL: "http://localhost:3000/excursions/last_slide.json"
		};

		//Quiz Sessions API (Audience Response System)
		configuration["ARS_API"] = {
			rootURL: "http://localhost:3000/quiz_sessions/"
		};

		//WAPP Token API
		configuration["WAPP_TOKEN_API"] = {
			rootURL: "http://localhost:3000/apis/wapp_token"
		};

		// Tracking System
		// configuration["TrackingSystemAPIKEY"] = "TrackingSystemAPIKEY";
		// configuration["TrackingSystemAPIURL"] = "http://localhost:3000/tracking_system_entries";
		// options["TrackingSystemRelatedEntryId"] = "1"
		// options["referrer"] = "some url"

		// Evaluation System
		// LOEP configuration (For evaluations)
		// configuration["loepSettings"] = {
		// 	tokenURL: "http://localhost:3000/loep/session_token.json",
		// 	domain: "http://localhost:8080",
		// 	app: "ViSH",
		// 	loId: "Excursion:1057",
		// 	evmethod: "wbltses"
		// };

		// Private Student Groups
		// configuration["notifyTeacherPath"] = "/private_student_group/notify_teacher";
		// configuration["userMode"] = "student";


		/////////////////////
		// Behaviour customization
		/////////////////////
		configuration["presentationSettings"] = true;
		configuration["tagsSettings"] = {maxLength: 20, maxTags: 8, triggerKeys: ['enter', 'space', 'comma', 'tab']};	
		configuration["catalog"] = ["Art", "Astronomy", "Biology", "Chemistry", "Citizenship", "Classical Languages", "Cross Curricular Education", "Computer Science", "General Culture", "Economics", "Education", "Electronics", "Environmental Education", "Ethics", "Foreign Languages", "Geography", "Geology", "Health Education", "History", "Home Economics", "Literature", "Law", "Mathematics", "Music", "Natural Sciences", "Philosophy", "Physical Education", "Physics", "Politics", "Psychology", "Religion", "Social Sciences", "Software Engineering", "Technology", "Telecommunications"];
		configuration["publishPermissions"] = ["Comment","Download","Clone"]


		////////////////////
		// Locales
		///////////////////
		
		// configuration["defaultLanguage"] = "en";
		// configuration["locales"] = {
		// 	"en": {
		// 		"i.Settings"	: "Settings"
		// 	},
		// 	"es": {
		// 		"i.Settings"	: "Ajustes"
		// 	}
		// }

		options["configuration"] = configuration;


		/////////////////////
		// Aspect Customization
		/////////////////////
		// configuration["repository_image"] = "/images/logos/repositoryimg_educa.png";
		// configuration["editor_logo"] = "/images/icons/logo_educa.png";
		// configuration["menu_logo"] = "/images/toolbar/logofondo_educa.png";
		

		/////////////////////
		// Options to initialize ViSH Editor
		/////////////////////

		options["developping"] = true;

		if(options["developping"]==true){
			//Setting developping options
			var developmentSettings = new Object();

			// Possible action: "nothing" or "loadSamples".
			developmentSettings.actionInit = "nothing";
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
				// developmentSettings.samples = VISH.Samples.webAPPVEAPIexample;

				// Activate insertMode
				// developmentSettings.samples.insertMode = true;
				// options["preview"] = true;
			}

			options["developmentSettings"] = developmentSettings;
		}

		//Environment data
		options["environment"] = {
			name: "ViSH Editor Development"
		}

		//User data
		options["user"] = {
			name: "agordillo",
			id: "20",
			token: "12xfDgR345x6"
		}

		//QuizSessionId to answer a quiz using the ARS (Audience Response System)
		// options["quizSessionId"] = "1";

		// options["fullScreenFallback"] = {
		// 	enterFullscreenURL: "http://localhost/viewer.html",
		// 	exitFullscreenURL: "http://localhost/framed_viewer.html"
		// };

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
		// options["watermarkURL"] = "http://localhost/viewer.html";
		// options["watermarkIcon"] = "custom";

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