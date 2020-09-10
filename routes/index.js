var express = require("express");
var router = express.Router();
var passport = require("passport");
const User    = require("../models/User");
var middleware = require("../middleware");

//=====================
//AUTH ROUTES
router.get("/register",function(req,res){
		res.render("register");
	});
router.post("/register",function(req,res){
var newUser=new User({username: req.body.username})
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			 return res.redirect("/register");
		}
		passport.authenticate("local",req,res,function(){
			req.flash("sucess","Welcome to YelpCamp " + user.username);
			res.redirect("/campground");
		})
	});
});
//login
router.get("/login",function(req,res){
	res.render("login" );
});
router.post("/login",passport.authenticate("local",
{
	successRedirect:"/campground",
	failureRedirect:"/login"
}),function(req,res){
	
});

//Logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("sucess","Logged you out");
	res.redirect("/campground");
});


module.exports = router;
