const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn , isOwned , validateListing} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js")


const multer  = require('multer')
const { storage } = require("../cloudConfig.js") 
const upload = multer({ storage })
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret : process.env.CLOUD_API_SECRET
})


// const upload = multer({ dest: 'uploads/' })

  // create listing
  router.get("/" ,wrapAsync( listingControllers.index));
  
  //New Route
  router.get("/new", isloggedIn , listingControllers.renderNewForm);
  
  //Show Route
  router.get("/:id", wrapAsync( listingControllers.showRoute));
  
  //Create Route
  router.post("/",  isloggedIn  , upload.single('listing[image]'), validateListing ,wrapAsync( listingControllers.createRoute))

  //Edit Route
  router.get("/:id/edit", isloggedIn , isOwned , wrapAsync( listingControllers.editRoute));
  
  //Update Route
  router.put("/:id", isloggedIn , isOwned ,upload.single('listing[image]'), validateListing , wrapAsync( listingControllers.updateRoute));
  
  //Delete Route
  router.delete("/:id", isloggedIn , isOwned ,wrapAsync( listingControllers.deleteRoute));
  
module.exports = router;  