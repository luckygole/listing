const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


//review post route//
module.exports.reviewPostRoute = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; //this line for author information with review //
    console.log(newReview);
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
  
    console.log("new review saved");
    req.flash("success","new review created!");
    res.redirect(`/listings/${listing._id}`);
};    

//delete review route//
module.exports.deleteReviewRoute = async(req , res) =>{
    let { id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`);
};    