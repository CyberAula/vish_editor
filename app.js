/**
 * Module dependencies.
 */
var express = require('express');
var fs = require('fs');
var configuration = require('./configuration/configuration').getConfiguration();
var configurationVishEditor = require('./public/vishEditor/configuration/configuration.js');
var everyauth = require('everyauth');
var debug = require('./debug');

//Open db
require("./db").connect();

//Load models
require("./models/all");

//EveryAuth Settings
require('./everyauth');

//MemStore for cookies
var MemStore = express.session.MemoryStore;

var app = module.exports = express.createServer(
  //Session management
  express.cookieParser(),
  express.session({
    secret: configuration['secret_key'],
    store : MemStore({ 
      reapInterval : 60000*10 
    })
  })
);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', {layout: true});
  app.use(express.static(__dirname + '/public'));
  app.register('.html', require('ejs'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(everyauth.middleware());
  everyauth.helpExpress(app);

  //Enable logger
  app.use(express.logger());

  //Router must be the last!!!
  app.use(app.router);
});


/**
 * Enviroment configuration
 */
app.configure('development', function(){
  //Enable error Handler
  app.use(express.errorHandler({ 
    dumpExceptions: true, 
    showStack: true 
  }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


 
/**
 * DynamicHelpers
 */
app.dynamicHelpers({
    flash: function(req,res){
      return req.flash();
    }
});


//Load routes
var routes =require('./routes/index');
routes.init(app);


/*
 * Start
 */
app.listen(3000, function(){
  configurationVishEditor.getOptions(app.settings.env);
  debug.initTrace(app.address().port, app.settings.env);
});