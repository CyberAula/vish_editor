var configuration = require('./configuration/configuration').getConfiguration();
var util = require('util');
var debug = require('./debug');
var everyauth = require('everyauth');
Promise = everyauth.Promise;
var db = require("./db").connect();

//Get User model
require("./models/all")
var User = db.model('User');

//EveryAuth Settings
everyauth.everymodule
  .findUserById( function (id, callback) {
    User.findById(id,function(err,user){
      callback(err,user);
    });
  });

everyauth.everymodule.moduleErrback( function (err) {
  debug.errorTrace("EveryAuth Error:" + err);
  //throw error...
});


//Auth by user and password

everyauth.password
  .getLoginPath('/index') // Uri path to the login page
  .postLoginPath('/login') // Uri path that your login form POSTs to
  .loginView('index.jade')
  .authenticate( function (login, password) {
    var errors = [];
    if (!login) errors.push('Missing login');
    if (!password) errors.push('Missing password');
    if (errors.length) {
      return errors;
    }

    var promise = this.Promise();

    User.findOne({login: login, password: password, authBy: 'password'},function(err,user){
      if(err){
         promise.fulfill([err]);
      } else {
         if(user !== null){
          promise.fulfill(user);
         } else {
          promise.fulfill(["Incorrect login or password."]);
         }
      }
    });

    return promise;

  })
  .loginSuccessRedirect('/home') // Where to redirect to after a login
  .getRegisterPath('/register') // Uri path to the registration page
  .postRegisterPath('/register') // The Uri path that your registration form POSTs to
  .registerView('index.jade')
  .validateRegistration( function (newUserAttributes,errors) {
      var promise = this.Promise();

      if((errors)&&(errors.length)){
        promise.fulfill(errors);
        return promise;
      }

      if((!newUserAttributes)||(!newUserAttributes.login)||(!newUserAttributes.password)){
        errors.push("Login or password missed");
        promise.fulfill(errors);
        return promise;
      }

      User.findOne({login: newUserAttributes.login, authBy : 'password'},function(err,user){
        if(!err){
          if(user !== null){
            errors.push("Login already taken");
            promise.fulfill(errors);
          }else{
            promise.fulfill([]);
          }
        }else{
          errors.push(err);
          promise.fulfill(errors);
        }
      });
      return promise;
  })
  .registerUser( function (newUserAttributes) {
    // This step is only executed if we pass the validateRegistration step without
    // any errors.
      var promise = this.Promise();
      var user = new User();
      user.login = newUserAttributes.login;
      user.name = newUserAttributes.login;
      user.password = newUserAttributes.password;
      user.authBy = 'password';
      user.save( function(){
	  	promise.fulfill(user);
	  });

      return promise;
  })
  .registerSuccessRedirect('/home'); // Where to redirect to after a successful registration


/*
* Auth by Twitter
*/
  everyauth.twitter
  .consumerKey(configuration["twitterConsumerKey"])
  .consumerSecret(configuration["twitterConsumerSecret"])
  .findOrCreateUser(function(session, accessToken, accessTokenSecret, twitterUserData){

    if(!twitterUserData){
    	return ["No twitter data"];
    } else {
      // debug.logTrace(util.inspect(twitterUserData));
    }

    var promise = this.Promise();

    var twitterId = twitterUserData.id;

    User.findOne({login: twitterId, authBy: 'twitter'}, function(err,user){
	    if(err){
	      promise.fulfill([err]);
	    } else {
	      if(user !== null){
	        promise.fulfill(user);
	      } else {
	        var user = new User();
	        user.login = twitterId;
	        user.name = twitterUserData.name;
	        user.authBy = 'twitter';
	        user.save( function(){
	          promise.fulfill(user);
	        });
	      }
	    }
  	});

  	return promise;
  })
  .redirectPath('/home');



/*
* Auth by Facebook
*/
everyauth.facebook
  .appId(configuration["facebookConsumerKey"])
  .appSecret(configuration["facebookConsumerSecret"])
  .moduleTimeout(9000)
  .callbackPath('/auth/facebook/callback')
  .handleAuthCallbackError( function (req, res) {
    // If a user denies your app, Facebook will redirect the user to
    // /auth/facebook/callback?error_reason=user_denied&error=access_denied&error_description=The+user+denied+your+request.
    // This configurable route handler defines how you want to respond to that.
    // If you do not configure this, everyauth renders a default fallback
    // view notifying the user that their authentication failed and why.
    res.render('index');
  })
  .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
    // find or create user logic goes here

    if(!fbUserMetadata){
      return ["No facebook data"];
    } else {
      debug.logTrace(util.inspect(fbUserMetadata));
    }

    var promise = this.Promise();

    var facebookId = fbUserMetadata.id;

    User.findOne({login: facebookId, authBy: 'facebook'}, function(err,user){
      if(err){
        promise.fulfill([err]);
      } else {
        if(user !== null){
          promise.fulfill(user);
        } else {
          var user = new User();
          user.login = facebookId;
          user.name = fbUserMetadata.name;
          user.authBy = 'facebook';
          user.save( function(){
            promise.fulfill(user);
          });
        }
      }
    });

    return promise;
  })
  .redirectPath('/home');