//

module.exports.bookmark = function(req,res){
  var url = req.params.url;
  res.send("You have been sparked by the page at the url '" + url + '\'');
};