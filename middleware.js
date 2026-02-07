const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingschema,reviewschema} = require("./schema.js");

module.exports.isLoggedin =(req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be loged in to create listing!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
if(req.session.redirectUrl){
  res.locals.redirectUrl = req.session.redirectUrl;
}
next();
}

module.exports.isOwner = async(req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/Listings/${id}`);
  }
  next();
}
module.exports.validateListing = async(req,res,next)=>{
let { error } = listingschema.validate(req.body);
if(error){
  let errMsg = error.details.map((ele)=> ele.message).join(",");
  throw new ExpressError(400, errMsg);
}else{
  next();
}
} ;

module.exports.validateReview = (req,res,next)=>{
let { error } = reviewschema.validate(req.body);
if(error){
  let errMsg = error.details.map((ele)=> ele.message).join(",");
  throw new ExpressError(400, errMsg);
}else{
  next();
}
} ;

module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error","You are not the author of this review");
    return res.redirect(`/Listings/${id}`);
  }
  next();
}