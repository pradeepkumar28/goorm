const Campground = require("../models/campground");
const Comment    = require("../models/comment");

var middlewareObj = {}
middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership (req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,foundcampground){
		if(err){
			res.redirect("back");
			
		} else {
			if(foundcampground.author.id.equals(req.user._id)){
					next();

						}else{
							req.flash("error","You don't have permission to do that");
							res.redirect("back");
						}
			}
	});
	}else {
		req.flash("error","You need to be logged in");
		res.redirect("back");
	}
	
}	
middlewareObj.checkCommentOwnership =function (req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comments_id,function(err,foundcomment){
		if(err){
			res.redirect("back");
			
		} else {
			if(foundcomment.author.id.equals(req.user._id)){
					next();

						}else{
							res.redirect("back");
						}
			}
	});
	}else {
			req.flash("error","Log in first");

		res.redirect("back");
	}
	
}
middlewareObj.IsLoggedIn=function  (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Log in first");
	res.redirect("/login");
};

module.exports = middlewareObj;