if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRoute = require("./routes/listings.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const db_url = process.env.ATLASDB_DB;

// Database Connection (Use async/await properly)
(async () => {
  try {
    await mongoose.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false, // No need to set bufferCommands here; await handles it
    });
    console.log("Connected to DB");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the process if DB connection fails
  }
})();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave: false, // Prevents resaving session if nothing is changed
  saveUninitialized: false, // Prevents creating empty sessions
  Cookie:{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

// passport code
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// its is used for locals kuch cheeje hum ejs mai direct use nahi kr sakte esliye pehle usko locals banate h
app.use((req , res , next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/listings" , listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

app.all("*",(req,res,next) => {
  next(new ExpressError(404,"page not found"));
})

app.use((err , req, res , next)=>{
  let { status=500 , message="something went wrong"} = err;
  res.status(status).render("listings/error.ejs", {message});
  // res.status(status).send(message);
  // res.send("something went wrong!")
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});