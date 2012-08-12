 var db = require("./db").connect();
 var User = db.model('User');
 var Presentation = db.model('Presentation');

exports.findPresentationById = function(id,callback) {
  Presentation.findById(id, function(err,presentation){
    callback(err,presentation);
  });
}

exports.findUserById = function(userId,callback) {
  User.findById(userId, function(err,user){
    callback(err,user);
  });
}

exports.findAllPresentationsOfUser = function(userId,callback) {
  Presentation.find({author: userId}, function(err,presentations){
    callback(err,presentations);
  });
}

exports.createPresentation = function(user,json,callback) {
  var presentation = new Presentation();
  var presentationJson = JSON.parse(json);
  presentation.title = presentationJson.title;
  presentation.description = presentationJson.description;
  presentation.avatar = presentationJson.avatar;
  presentation.tags = presentationJson.tags;
  presentation.author = user._id.toHexString();
  presentation.content = json; 

  presentation.save( function(err){
    if(err){
    	callback(err,null);
    } else {
      var presentationId = presentation._id.toHexString();
      //save the presentation id in the user presentations array
      user.presentations.push(presentationId);
      user.save(function(err){
        if(err){
          	callback(err,presentationId);
        } else {
        	callback(err,presentationId);
        }
      });
    }
  });
}

exports.destroyPresentation = function(id,callback) {
 Presentation.findById(id, function(err,presentation){
    if((err)||(presentation===null)){
      callback(err);
    } else {
      var userId = presentation.author;
      var presId = presentation._id;
      presentation.remove(function(err){
        if(err){
          callback(err);
        } else {
          User.findById(userId,function(err,user){
            if((err)||(user===null)){
              callback(err);
            } else {
              //Remove presentation id from user.presentations
              var index = user.presentations.indexOf(presId);
              if(index!=-1){
                user.presentations.splice(index, 1);
              }
              user.save(function(err){
                if(err){
                    callback(err);
                } else {
                  callback(err);
                }
              });
            }
          });
        }
      });
    }
  });
}


exports.updatePresentation = function(user,json,callback) {
  var presentationJson = JSON.parse(json);
  Presentation.findById(presentationJson.id, function(err,presentation){
      if(err){
        return callback(err);
      } else {
        presentation.title = presentationJson.title;
        presentation.description = presentationJson.description;
        presentation.avatar = presentationJson.avatar;
        presentation.tags = presentationJson.tags;
        presentation.author = user._id.toHexString();
        presentation.content = json;
        presentation.save(function (err) {
          return callback(err, presentationJson.id);
        }); 
      }
    });
}

