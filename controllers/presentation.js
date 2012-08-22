//RESOURCE MAPPING (REST)

// GET     /presentation                       ->  index
// GET     /presentation/new                   ->  new
// POST    /presentation                       ->  create
// GET     /presentation/:presentationId       ->  show
// GET     /presentation/:presentationId/edit  ->  edit
// PUT     /presentation/:presentationId       ->  update
// DELETE  /presentation/:presentationId       ->  destroy

var fs = require('fs');
var database = require("../db/api");
var options = JSON.stringify(require('../public/vishEditor/configuration/configuration.js').getOptions());

exports.index = function(req,res){
  res.redirect('/home');
}

exports.new = function(req,res){
  res.render('presentation/new', { locals: { options: options }});
}

exports.create = function(req,res){
  database.createPresentation(req.user,req.body.presentation.json,function(err,presentationId){
    if(err){
      res.redirect('/home');
    } else {
      var data = new Object();
      data.url = '/presentation/' + presentationId;
      res.contentType('application/json');
      res.send(data);
    }
  });
}

exports.show = function(req,res,full){
  showPresentation(req,res,false);
}

exports.full = function(req,res){
  showPresentation(req,res,true);
}

function showPresentation(req,res,full){
  var id = req.params.id;
  database.findPresentationById(id,function(err,presentation){
    if(err){
      req.flash('warn','Presentation not found');
      res.render('genericError', { locals: {returnUrl: "/home" } });
    } else {
      database.findUserById(presentation.author,function(err,user){
        if((err)||(user===null)){
          res.redirect('/home');
        } else {
          if((typeof full !== undefined)&&(full===true)) {
            res.render('presentation/full', {locals: {layout: false, presentation: presentation, author: user.name, options: options}});
          } else {
            res.render('presentation/show', {locals: {presentation: presentation, author: user.name, options: options}});
          }
        }
      });
    }
  });
}

exports.edit = function(req,res){
  var id = req.params.id;

  if(req.user.presentations.indexOf(id)===-1){
    //Current user is not the owner of this presentation
    req.flash('warn','You don\'t have permissions to edit this presentation');
    res.render('genericError', { locals: {returnUrl: "/home" } });
    return;
  }

  database.findPresentationById(id,function(err,presentation){
    if((err)||(presentation===null)){
      req.flash('warn','Presentation not found');
      res.render('genericError', { locals: {returnUrl: "/home" } });
    } else {
      database.findUserById(presentation.author,function(err,user){
        if((err)||(user===null)){
          req.flash('warn','Presentation owner not found');
          res.render('genericError', { locals: {returnUrl: "/home" } });
        } else {
          res.render('presentation/edit', {locals: {presentation: presentation, author: user.name, options: options}});
        }
      });
    }
  });  
}

exports.update = function(req,res){
  var id = req.params.id;

  if(req.user.presentations.indexOf(id)===-1){
    //Current user is not the owner of this presentation
    req.flash('warn','You don\'t have permissions to edit this presentation');
    res.render('genericError', { locals: {returnUrl: "/home" } });
    return;
  }

  database.updatePresentation(req.user,req.body.presentation.json,function(err,presentationId){
    if(err){
      req.flash('warn','This presentation can\'t be updated');
      res.render('genericError', { locals: {returnUrl: "/home" } });
    } else {
      var data = new Object();
      data.url = '/presentation/' + presentationId;
      res.contentType('application/json');
      res.send(data);
    }
  });
}

exports.destroy = function(req,res){
  var id = req.params.id;

  if(req.user.presentations.indexOf(id)===-1){
    //Current user is not the owner of this presentation
    req.flash('warn','You don\'t have permissions to edit this presentation');
    res.render('genericError', { locals: {returnUrl: "/home" } });
    return;
  }

  database.destroyPresentation(id,function(err,presentation){
      if(err){
        req.flash('warn','This presentation can\'t be destroyed');
        res.render('genericError', { locals: {returnUrl: "/home" } });
      } else {
        res.redirect('/home');
      }
  });
}

exports.download = function(req,res){
  var id = req.params.id;
  database.findPresentationById(id,function(err,presentation){
    if((err)||(presentation===null)){
      req.flash('warn','Presentation not found');
      res.render('genericError', { locals: {returnUrl: "/home" } });
    } else {
      writeJsonToFile(presentation._id.toHexString(),presentation.content, function(err,outputFileName){
          if((err)||(outputFileName===null)){
            req.flash('warn','Presentation can\'t be downloaded');
            res.render('genericError', { locals: {returnUrl: "/home" } });
          } else {
            res.contentType('application/json');
            res.attachment(outputFileName);
            res.sendfile(outputFileName);
          }
      });
    }
  });
}

function writeJsonToFile(id,json,callback){
  var outputFilename = "./data/presentations/" + id + ".json";
    fs.writeFile(outputFilename, json, function(err) {
        if(err) {
          callback(err);
        } else {
          callback(err,outputFilename);
        }
    }); 
}