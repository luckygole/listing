const Listing = require("../models/listing.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret : process.env.CLOUD_API_SECRET
})


//index route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

//new route  
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//show route
module.exports.showRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
      path : "reviews",
      populate:{
        path:"author"
      }
    }).populate("owner");
    if(!listing){
      req.flash("error", "listing you requsted for does not exists!");
      res.redirect("/listings")
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
};

//create route
// module.exports.createRoute = async (req, res , next) => { 
//   let url = req.file.path;
//   let filename = req.file.filename;

//     console.log(url ,"..", filename);

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;

//     // Assign the image properties correctly
//     newListing.image.url = url; // Assign only the URL string to image.url
//     newListing.image.filename = filename; // Assign only the filename to image.filename

//     await newListing.save();
//     console.log(newListing);
//     req.flash("success","new listing created!");
//     res.redirect("/listings");
// };

module.exports.createRoute = async (req, res, next) => {
  try {
    // Upload file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(req.file.path);

    const url = uploadResponse.secure_url; // Correct URL
    const filename = uploadResponse.public_id; // Cloudinary public ID

    console.log("Uploaded Image URL:", url, "Filename:", filename);

    // Create a new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image.url = url;
    newListing.image.filename = filename;

    await newListing.save();
    console.log("Saved Listing:", newListing);

    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error:", err);
    next(err);
  }
};


//edit route
module.exports.editRoute = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "listing you requsted for does not exists!");
      res.redirect("/listings")
    }
    let originalImageurl = listing.image.url;
    originalImageurl = originalImageurl.replace("/upload" , "/upload/h_150,w_150");
    res.render("listings/edit.ejs", { listing, originalImageurl });
}

//update route
module.exports.updateRoute = async (req, res) => { 
    let { id } = req.params;
    let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url , filename};
      await listing.save();

    }
    req.flash("success","listing updated!");
    res.redirect(`/listings/${id}`);
};    

//delete route 
module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};    