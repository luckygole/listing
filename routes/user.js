const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const usersController = require("../controllers/users")

//signup form render//
router.get("/signup", usersController.signupformRoute)

//signup route
router.post("/signup" , wrapAsync( usersController.signupRoute))

// login form render//
router.get("/login" , usersController.loginFormRoute )

//login route
router.post("/login", saveRedirectUrl ,passport.authenticate("local",{failureRedirect: "/login",failureFlash:true}), usersController.loginRoute);

// logout route
router.get("/logout", usersController.logoutRoute);

module.exports = router;