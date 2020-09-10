var express = require("express");
var router = express.Router();
const Campground = require("../models/campground");
const Comment    = require("../models/comment");
var middleware = require("../middleware");


router.get("/", function(req,res){
  res.render("campground/landing");
});
router.get("/campground",function(req,res){
	Campground.find({},function(err,allcampground){
		if(err){
			console.log(err);
		} else {
			res.render("campground/index",{campGround:allcampground });
		}
	});
	
	
});
 
router.post("/campground",middleware.IsLoggedIn, function(req, res){
	var name= req.body.title;
	var img = req.body.img;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newcamp={title:name, price:price,img:img, description:desc, author:author};
	Campground.create(newcamp,function(err,newlycreated){
		if(err){
			console.log(err);
			
		}else{
										req.flash("sucess","Added campground successfully");

			res.redirect("/campground");
	
		}
	});
	
});
router.get("/campground/new",middleware.IsLoggedIn,function(req,res){
	res.render("campground/new");
});
router.get("/campground/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
		if(err){
			console.log(err);
		}else {
			res.render("campground/show",{campground:foundcampground});
		}
	});
	
});
//Edit 
router.get("/campground/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	
		Campground.findById(req.params.id,function(err,foundcampground){
						res.render("campground/edit",{campground:foundcampground});

			});

});


//update
router.put("/campground/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,foundCampground){
		if(err){
			res.redirect("/campground");
		}else {
			res.redirect("/campground/" + req.params.id);
		}
	});
});
//delete
router.delete("/campground/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
		res.redirect("/campground");
		}else{
					res.redirect("/campground")

		}
	});
});



module.exports = router;
