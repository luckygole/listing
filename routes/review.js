const express = require("express")
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn , isReviewAuthor , validateReview} = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js")

// review post route
router.post("/", isloggedIn , validateReview, wrapAsync( reviewsController.reviewPostRoute ))
  
  // delete review route
router.delete("/:reviewId" , isReviewAuthor, wrapAsync( reviewsController.deleteReviewRoute))

module.exports = router;  