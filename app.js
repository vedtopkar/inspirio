
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
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


// Routes

app.get('/', routes.index);
app.get('/url/:url', function(req,res){
  var url = req.params.url;
  res.send("You have been sparked by the page at the url '" + url + '\'');
});


//Define port and listen on it and log it in console

var port = 22599;

app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
