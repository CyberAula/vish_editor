var configuration;

module.exports.getConfiguration = function() {
	return getConfiguration();
}

var getConfiguration = function(){
	if(!configuration){
		configuration = {};

		configuration["secret_key"] = "session_secret_key";
		configuration["db"] = "vishEditorStandalone"; //your database name

		//Developer API Keys

		//Twitter: Register your app in https://dev.twitter.com/
		configuration["twitterConsumerKey"] = "";
		configuration["twitterConsumerSecret"] = "";
		//Facebook: Register your app in https://developers.facebook.com
		configuration["facebookConsumerKey"] = "";
		configuration["facebookConsumerSecret"] = "";
	}
	return configuration;
}