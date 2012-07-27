var db = require("../db/api");


exports.index = function(req, res) {
  if(req.user){
  	res.redirect('/home')
  } else {
  	res.render('index')
  }
};

exports.home = function(req, res) {
  db.findAllPresentationsOfUser(req.user._id.toHexString(), function(err,presentations){
    if(err){
      res.render('home');
    } else {
      res.render('home', {locals: { presentations: presentations}});
    }
  });
  
};

exports.error = function(req, res) {
  res.render('error', { layout: false });
};

exports.authError = function(req,res){
	res.render('autherror', { layout: false });
}

exports.presentation = require('./presentation');
