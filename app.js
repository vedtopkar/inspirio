
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , connect = require('connect')
  , mongojs = require('mongojs');

var app = module.exports = express.createServer();


// Server Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.set('view options',{layout:false});
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Database Configuration

var databaseURL = "inspirio";
var collections = ["shortLinks"];
var db = mongojs.connect(databaseURL, collections);



// Fixed Routes

app.get('/', routes.index);
app.get('/short',function(req,res){res.render('short')});


// Dynamic Routes

app.get('/url/:url', function(req,res){
  var url = req.params.url;
  res.send("You have been sparked by the page at the url '" + url + '\'');
  });

app.get('/short/:shortExtension',function(req,res){
  var shortExtension = req.params.shortExtension;
  var url = db.shortLinks.find({shortExtension:shortExtension},{link:1});
  console.log(url);
  res.end();
  });


// Post Routes
app.post('/short',function(req,res){
  var allChar = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
  var stringLength = 4;
  var shortExtension = "7s93";
  for(var i = 0; i<stringLength;i++)
    shortExtension += allChar.charAt(Math.floor(Math.random()*allChar.length));
  db.shortLinks.save({shortExtension: shortExtension, link: req.param('link')});
  console.log('Shortened the URL ' + req.param('link') + ' into vedtopkar.webfactional.com/' + shortExtension);
  res.write('vedtopkar.webfactional.com/' + shortExtension);
  res.end();
  });


// Define port and listen on it

var port = 22599;

app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
