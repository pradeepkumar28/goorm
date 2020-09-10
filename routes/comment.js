var express = require("express");
var router = express.Router();
const Campground = require("../models/campground");
const Comment    = require("../models/comment");
var middleware = require("../middleware");





router.get("/campground/:id/comments/new",middleware.IsLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
				res.render("comments/new",{campground:campground});

		}
	});
});


router.post("/campground/:id/comments",middleware.IsLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			Comment.create(req.body.comments,function(err,comment){
				if(err){
					console.log(err);
					
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment");
					res.redirect("/campground/" + campground._id);
				}
			});
		}
	});
});
//comment edit
router.get("/campground/:id/comments/:comments_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comments_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
		res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});

		}
	});
});
//comment update
router.put("/campground/:id/comments/:comments_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comments_id,req.body.comments,function(err,UpdatedComment){
if(err){
	res.redirect("back");
}else{
	req.flash("sucess","Updated comment");
res.redirect("/campground/" + req.params.id);
}
	});
  
});
//comment delete
router.delete("/campground/:id/comments/:comments_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comments_id,function(err){
		if(err){
			res.redirect("back");
			
		}else{
			req.flash("sucess","Comment deleted");
			
			res.redirect("/campground/" + req.params.id);
		}
		
	});
});




module.exports = router;

