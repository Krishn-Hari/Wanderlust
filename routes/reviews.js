const express = require("express");
const router = express.Router({mergeParams : true});

const wrapAscync =require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js")
const reiewControler= require("../controlers/reviews.js");
//validate the review


// create reviews route
//post route
router.post("/" ,isLoggedin,validateReview , wrapAscync(reiewControler.creatReview));

//delete review route

router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAscync(reiewControler.deleteReview));

module.exports = router;