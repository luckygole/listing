const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema  } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/expressError.js");


// its is check is user login or not
module.exports.isloggedIn = (req , res , next) =>{
  console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing")
        return res.redirect("/login");
      }
      next();
} 
 
//its use for redirect to user wanted pages
module.exports.saveRedirectUrl = (req, res , next) =>{
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

//its is for authorization for edit delete update routes in listings.js file
module.exports.isOwned = async ( req , res ,next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id); 
  if(!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

//its is for delete button for review only author can delete its own review not other review//
module.exports.isReviewAuthor = async (req,res,next) =>{
  let { id , reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)) {
    req.flash("error","You are not author of this review");
    res.redirect(`/listings/${id}`);
  }
  next();
};

//this is for listing validation middleware for listing  and this is use in route listing.js
module.exports.validateListing = (req , res , next) =>{
  let {error} = listingSchema.validate(req.body);
  console.log(error);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400 , errMsg);
  } else {
    next();
  }
}

//this is for listing review validation middleware for review and this is use in route review.js
module.exports.validateReview = (req , res , next) =>{
  let {error} = reviewSchema.validate(req.body);
  console.log(error);

  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400 , errMsg);
  } else {
    next();
  }
}
