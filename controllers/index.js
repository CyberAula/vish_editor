var everyauth = require('everyauth');
var _ = require('underscore');
var db = require("../db").connect();

//Get models
var User = db.model('User');
var Presentation = db.model('Presentation');

exports.index = function(req, res) {
  if(req.user){
  	res.redirect('/home')
  } else {
  	res.render('index')
  }
};

exports.home = function(req, res) {
  //Get user presentations
  //Coming soon...
  var presentations = 
  res.render('home', {locals: { presentations: presentations}});
};

exports.error = function(req, res) {
  res.render('error', { layout: false });
};

exports.authError = function(req,res){
	res.render('autherror', { layout: false });
}

exports.presentation = require('./presentation');
