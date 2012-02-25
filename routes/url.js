// Get any general url

exports.url = function(req,res){
  req.flash('info','You have come to the non-index page \''+req.params.url+"\'");
  res.render(req.params.url);
  };