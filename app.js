
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose')
  , connect = require('connect')
  , mongojs = require('mongojs')
  , everyauth = require('everyauth');

var app = module.exports = express.createServer();


// Server Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.set('view options',{layout:true});
  app.use(express.cookieParser());
  app.use(express.session({ secret: "fhs rocks"}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.dynamicHelpers({flash: function(req,res){return req.flash();}});
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

app.get('/', function(req,res){res.render('index');});
app.get('/:url',function(req,res){req.flash('info','You have come to the non-index page \''+req.params.url+"\'");res.render(req.params.url);});


// Dynamic Routes

app.get('/url/:url', function(req,res){
  var url = req.params.url;
  res.send("You have been sparked by the page at the url '" + url + '\'');
  });

app.get('/short/:shortExtension',function(req,res){
  var shortExtension = req.params.shortExtension;
  var findLink = db.shortLinks.find({shortExtension:shortExtension},{link:1});
  res.redirect('http://' + findLink);
  res.end();
  });


// Post Routes
app.post('/short',function(req,res){
  var allChar = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
  var stringLength = 4;
  var shortExtension = "";
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
