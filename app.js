var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  Beard = require("./models/beard"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  session = require("express-session"),
  seedDB = require("./seeds"),
  methodOverride = require("method-override");

// configure dotenv
require("dotenv").load();

//requiring routes
var commentRoutes = require("./routes/comments"),
  beardRoutes = require("./routes/beards"),
  indexRoutes = require("./routes/index");

const port = process.env.PORT || 4096;

//mongoose.connect('mongodb://localhost/beard_me4');
var url = process.env.DATABASEURL || "mongodb://localhost/beardme-A";
mongoose.connect(url);

app.set(port);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser("secret"));
//require moment
app.locals.moment = require("moment");

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRoutes);
app.use("/beards", beardRoutes);
app.use("/beards/:id/comments", commentRoutes);

app.listen(port, function() {
  console.log("Beard Me Server Has Started!");
});
