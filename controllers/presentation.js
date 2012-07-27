//RESOURCE MAPPING (REST)

// GET     /presentation                       ->  index
// GET     /presentation/new                   ->  new
// POST    /presentation                       ->  create
// GET     /presentation/:presentationId       ->  show
// GET     /presentation/:presentationId/edit  ->  edit
// PUT     /presentation/:presentationId       ->  update
// DELETE  /presentation/:presentationId       ->  destroy

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

exports.show = function(req,res){
  var id = req.params.id;
  database.findPresentationById(id,function(err,presentation){
    if(err){
      res.redirect('/home');
    } else {
      database.findUserById(presentation.author,function(err,user){
        if((err)||(user===null)){
          res.redirect('/home');
        } else {
          res.render('presentation/show', {locals: {presentation: presentation, author: user.name, options: options}});
        }
      });
    }
  });
}

exports.edit = function(req,res){
  var id = req.params.id;
  database.findPresentationById(id,function(err,presentation){
    if(err){
      res.redirect('/home');
    } else {
      database.findUserById(presentation.author,function(err,user){
        if((err)||(user===null)){
          res.redirect('/home');
        } else {
          res.render('presentation/edit', {locals: {presentation: presentation, author: user.name, options: options}});
        }
      });
    }
  });  
}

exports.update = function(req,res){
   database.updatePresentation(req.user,req.body.presentation.json,function(err,presentationId){
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

exports.destroy = function(req,res){
  var id = req.params.id;
  database.destroyPresentation(id,function(err,presentation){
    if(err){
      res.redirect('/home');
    } else {
      res.redirect('/home');
    }
  });

}