const express    = require("express");
const app        = express();
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");
const passport   = require("passport");
const localStrategy= require("passport-local");
const methodOverride = require("method-override");
const flash       = require("connect-flash");
const Campground = require("./models/campground");
const Comment    = require("./models/comment");
const User       = require("./models/User");
const seedDB     = require("./seeds");


var campgroundRoutes = require("./routes/campground"),
	commentRoutes    = require("./routes/comment"),
	authRoutes       = require("./routes/index");

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost/yelp_camp_v9");
app.use(express.static(__dirname + "/public"));
app.use(flash());
//seedDB();
//Passport configuration

app.use(require("express-session")({
	secret:"Hard time create stronger man",
	resave:false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error= req.flash("error");
	res.locals.sucess= req.flash("sucess");
	next();
});
app.set("view engine", "ejs");
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);


app.listen(3000, process.env.IP, function(){
	console.log("Yelpcamp has started");
});

/*if(err){
  req.flash("error", err.message);
  return res.redirect("/register");
}*/