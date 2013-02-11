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

		configuration["presentationSettings"] = true;
		configuration["presentationTags"] = true;
		configuration["presentationThumbnails"] = true;

		configuration["VishLives"] = true;
		configuration["VishRepo"] = true;

		configuration["Flickr"] = true;
		configuration["Youtube"] = true;
		configuration["Vimeo"] = false;

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
			developmentSettings.actionInit = "nothing";
			//Select your samples
			if((typeof VISH != "undefined")&&(typeof VISH.Samples != "undefined")){
				developmentSettings.samples = VISH.Samples.basic_samples;
				// developmentSettings.samples = VISH.Samples.samplesv01;
				// developmentSettings.samples = VISH.Samples.fc_sample;
				// developmentSettings.samples = VISH.Samples.full_samples;
				// developmentSettings.samples = VISH.Samples.quizes_samples;
				// developmentSettings.samples = VISH.Samples.quizzes__samples2;
			}

			//Possible actions: "view", "edit", or "nothing".
			developmentSettings.actionSave = "view";

			options["developmentSettings"] = developmentSettings;


			//Also you can define a username and token for testing purposes
			options["username"] = "ebarra";
			options["userId"] = "3456";
			options["token"] = "12xfDgR345x6";

			//Testing Quizes
			options["quiz_active_session_id"] = "29";

			//Show full presentation when its outside an inframe 
			options["full"] = false;
			//Show full presentation, even its inside an iframe 
			options["forcefull"] = false;

			//Indicate that the presentation is embeded (in another domain)
			options["embed"] = false;

			//Preview
			options["preview"] = false;

			//Close or come back button
			//If comeBackUrl not exists, back button will be hidden
        	options["comeBackUrl"] = "https://github.com/ging/vish_editor";

        	//to show the fullscreen if the feature is not present
        	options["fullscreen"] = "http://localhost/vishEditor/viewer.html";
        	options["exitFullscreen"] = "http://localhost/vishEditor/framed_viewer.html";

        	//Draft presentations
        	options["draft"] = false;

			//And a default landguage
			options["lang"] = "en";


			//Addons Configuration
			options.addons = [];

			//Add a new addon: For example, VISH.Addons.IFrameMessenger
			var addon = new Object();
			addon.target = "Both";
			addon.id = "IframeMessenger";
			addon.url = "";
			//Specific addon config, readed by VISH.Addons.IFrameMessenger
			addon.config = {enable: true};

			options.addons.push(addon);
		}
		
		if((typeof window != "undefined")&&(window.console) && (window.console.log)){
			console.log("Vish Editor Configured Options")
			console.log(options)
		}
	}

	return options;
}