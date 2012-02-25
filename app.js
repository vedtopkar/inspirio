
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
  app.set('view options',{pretty:false});
  app.use(express.cookieParser());
  app.use(express.session({ secret: "fhs rocks"}));
  app.use(express.methodOverride());
  app.use(express.favicon(__dirname + '/public/images/favicon.ico',{maxAge:31556926000}));
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

app.get('/', routes.index);
app.get('/:url',function(req,res){req.flash('info','You have come to the non-index page \''+req.params.url+"\'");res.render(req.params.url);});


// Dynamic Routes

app.get('/url/:url', function(req, res){
  var url = req.params.url;
  res.send("You have been sparked by the page at the url '" + url + '\'');
});

app.get('/short/:shortExtension',function(req,res){
  db.shortLinks.find({'shortExtension':req.params.shortExtension},function(err, docs){
    console.log(docs[0].link);
    res.redirect('http://' + docs[0].link, 302);
  });
});


// Post Routes
app.post('/shorten',function(req,res){
  var charString = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
  var stringLength = 4;
  var shortExtension = "";
  for(var i = 0; i < stringLength; i++)
    shortExtension += charString.charAt(Math.floor(Math.random()*charString.length));
  db.shortLinks.save({shortExtension: shortExtension, link: req.param('url-input')});
  req.flash('info', 'The URL');
  console.log('Shortened the URL ' + req.param('url-input') + ' into vedtopkar.webfactional.com/' + shortExtension);
  res.redirect('index');
  res.end();
  });



// Define port and listen on it

var port = 22599;

app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
